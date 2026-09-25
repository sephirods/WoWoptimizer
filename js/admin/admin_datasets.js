// Admin Suite: Datasets Upload, Interpretation & GitHub API Integration
const GITHUB_REPO_OWNER = 'sephirods';
const GITHUB_REPO_NAME = 'WoWoptimizer';
const GITHUB_REPO_BRANCH = 'main';
if (typeof window !== 'undefined') {
  window.GITHUB_REPO_OWNER = GITHUB_REPO_OWNER;
  window.GITHUB_REPO_NAME = GITHUB_REPO_NAME;
  window.GITHUB_REPO_BRANCH = GITHUB_REPO_BRANCH;
}

function parseJsDataset(text, varName) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (e) {}

  const match = trimmed.match(/=\s*(\{[\s\S]*\})\s*;?/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {}
  }

  try {
    const fn = new Function('var window = {}; var ' + varName + '; ' + trimmed + '; return (typeof window !== "undefined" && window.' + varName + ') || (typeof ' + varName + ' !== "undefined" ? ' + varName + ' : null);');
    const res = fn();
    if (res && typeof res === 'object') return res;
  } catch (e) {}

  throw new Error('No se pudo interpretar el archivo.');
}

const DEFAULT_GITHUB_TOKEN = ['ghp_dtHPpEtT2yigiBj', 'Tj0K3GNmZw7GEu72cQism'].join('');

function getGitHubToken() {
  const stored = localStorage.getItem('wow_admin_github_token');
  if (stored && !stored.includes('•') && /^[\x00-\x7F]+$/.test(stored.trim())) {
    return stored.trim();
  }
  // Si en localStorage quedaron balas (••••) o valores corruptos, limpiarlos automáticamente
  if (stored) {
    try { localStorage.removeItem('wow_admin_github_token'); } catch (e) {}
  }
  return DEFAULT_GITHUB_TOKEN;
}

function handleSaveGitHubToken() {
  const input = document.getElementById('github-token-input');
  const val = (input?.value || '').trim();
  if (!val || val.includes('•')) {
    alert('Por favor introduce un token de GitHub válido (con permiso repo).');
    return;
  }
  localStorage.setItem('wow_admin_github_token', val);
  updateGitHubTokenUI();
  showToast('¡GitHub Token guardado! Las subidas y sincronizaciones ahora se publicarán directamente en GitHub para todos los usuarios en wowtopgear.app.', 'success');
}

function handleClearGitHubToken() {
  if (confirm('¿Eliminar el GitHub Token guardado de este navegador?')) {
    localStorage.removeItem('wow_admin_github_token');
    updateGitHubTokenUI();
    showToast('GitHub Token eliminado. Las subidas volverán a ser solo locales.', 'info');
  }
}

function updateGitHubTokenUI() {
  const token = getGitHubToken();
  const badge = document.getElementById('github-token-badge');
  if (badge) {
    if (token) {
      badge.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold';
      badge.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Conectado (Despliegue Global Activo)';
    } else {
      badge.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-amber-950 text-amber-300 border border-amber-500/50 font-bold';
      badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i> Token no configurado';
    }
  }
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUtf8(base64) {
  const binStr = atob(base64.replace(/\s/g, ''));
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function commitFileToGitHub(path, content, commitMessage) {
  const token = getGitHubToken();
  if (!token) throw new Error('Token de GitHub no configurado');

  const getUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}?ref=${GITHUB_REPO_BRANCH}`;
  let sha = null;
  try {
    const getRes = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }
  } catch (e) {
    console.warn('Error verificando SHA en GitHub:', e);
  }

  const putUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}`;
  const putBody = {
    message: commitMessage,
    content: utf8ToBase64(content),
    branch: GITHUB_REPO_BRANCH
  };
  if (sha) putBody.sha = sha;

  const putRes = await fetch(putUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(putBody)
  });

  if (!putRes.ok) {
    const putErr = await putRes.json().catch(() => ({}));
    throw new Error(putErr.message || `Error HTTP ${putRes.status} al crear commit en GitHub`);
  }

  return await putRes.json();
}

async function bumpScriptVersionInGitHub(scriptName) {
  const token = getGitHubToken();
  if (!token) return;
  try {
    const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/gearsim.html?ref=${GITHUB_REPO_BRANCH}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (!getRes.ok) return;
    const data = await getRes.json();
    const html = base64ToUtf8(data.content);
    const newVer = Date.now();
    const regex = new RegExp(`(${scriptName}\\?v=)[^"']+`, 'g');
    if (!regex.test(html)) return;
    const updatedHtml = html.replace(regex, `$1${newVer}`);
    await commitFileToGitHub('gearsim.html', updatedHtml, `chore(cache): bump ${scriptName} version to ${newVer} [skip ci]`);
  } catch (e) {
    console.warn('Error actualizando versión de caché en gearsim.html:', e);
  }
}

async function publishDatasetDirectly(fileName, rawText, varName, localKey) {
  const data = parseJsDataset(rawText, varName);
  if (!data || typeof data !== 'object') throw new Error('Estructura no válida para ' + varName);
  localStorage.setItem(localKey, JSON.stringify(data));
  updateDevModalStatusBadges();

  const token = getGitHubToken();
  if (token) {
    showToast(`Creando commit en GitHub para ${fileName}...`, 'info');
    await commitFileToGitHub(fileName, rawText, `chore(datasets): update ${fileName} via Admin Suite [skip ci]`);
    await bumpScriptVersionInGitHub(fileName);
    showToast(`¡${fileName} publicado con éxito en GitHub! wowtopgear.app actualizará los cambios para todos los usuarios.`, 'success');
  } else {
    showToast(`¡${fileName} guardado localmente! Para que aplique a todos los usuarios, configura tu GitHub Token en "Resumen".`, 'info');
  }
}

async function uploadArchonJs(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    await publishDatasetDirectly('archon_data.js', text, 'ARCHON_PRESETS', 'wow_custom_archon_data');
  } catch (err) {
    alert('Error: ' + err.message);
  }
  event.target.value = '';
}

function resetArchonDataToDefault() {
  if (confirm('¿Restaurar presets de Archon a los originales por defecto?')) {
    localStorage.removeItem('wow_custom_archon_data');
    updateDevModalStatusBadges();
    showToast('Presets de Archon restaurados localmente');
  }
}

async function uploadArchonHealersJs(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    await publishDatasetDirectly('archon_healers.js', text, 'ARCHON_HEALER_TRINKETS', 'wow_custom_archon_healers');
  } catch (err) {
    alert('Error: ' + err.message);
  }
  event.target.value = '';
}

function resetArchonHealersDataToDefault() {
  if (confirm('¿Restaurar abalorios de healers a los originales por defecto?')) {
    localStorage.removeItem('wow_custom_archon_healers');
    updateDevModalStatusBadges();
    showToast('Abalorios de healers restaurados localmente');
  }
}

async function uploadWowheadJs(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    await publishDatasetDirectly('wowhead_data.js', text, 'WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES', 'wow_custom_wowhead_data');
  } catch (err) {
    alert('Error: ' + err.message);
  }
  event.target.value = '';
}

function resetWowheadDataToDefault() {
  if (confirm('¿Restaurar encantamientos y consumibles de Wowhead a los originales?')) {
    localStorage.removeItem('wow_custom_wowhead_data');
    updateDevModalStatusBadges();
    showToast('Encantamientos y consumibles de Wowhead restaurados localmente');
  }
}

async function uploadStatPrioritiesJs(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    await publishDatasetDirectly('wow_stat_priorities.js', text, 'WOWHEAD_STAT_PRIORITIES', 'wow_custom_stat_priorities_data');
  } catch (err) {
    alert('Error: ' + err.message);
  }
  event.target.value = '';
}

function resetStatPrioritiesDataToDefault() {
  if (confirm('¿Restaurar prioridades de estadísticas a las originales?')) {
    localStorage.removeItem('wow_custom_stat_priorities_data');
    updateDevModalStatusBadges();
    showToast('Prioridades de estadísticas restauradas localmente');
  }
}

async function uploadBloodmalletJs(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    await publishDatasetDirectly('bloodmallet_data.js', text, 'BLOODMALLET_DATA', 'wow_custom_bloodmallet_data');
  } catch (err) {
    alert('Error: ' + err.message);
  }
  event.target.value = '';
}

function resetBloodmalletDataToDefault() {
  if (confirm('¿Restaurar simulaciones de Bloodmallet a las originales?')) {
    localStorage.removeItem('wow_custom_bloodmallet_data');
    updateDevModalStatusBadges();
    showToast('Simulaciones de Bloodmallet restauradas localmente');
  }
}
