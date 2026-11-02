// Admin Suite: VPS Docker Auto-Scraper Telemetry, Status Monitor & Remote Signal Trigger
const VPS_STATUS_FILE_PATH = 'js/data/vps_sync_status.json';
let vpsPollTimer = null;
let lastVpsStatusData = null;

function formatRelativeTimeEs(isoStr) {
  if (!isoStr) return 'Nunca';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return isoStr;
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 0) {
    const absSec = Math.abs(diffSec);
    if (absSec < 60) return `en ${absSec}s`;
    if (absSec < 3600) return `en ${Math.floor(absSec / 60)}m`;
    return `en ${Math.floor(absSec / 3600)}h ${Math.floor((absSec % 3600) / 60)}m`;
  }
  if (diffSec < 60) return `hace ${diffSec}s`;
  if (diffSec < 3600) return `hace ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `hace ${Math.floor(diffSec / 3600)}h ${Math.floor((diffSec % 3600) / 60)}m`;
  return `hace ${Math.floor(diffSec / 86400)}d`;
}

function formatLocalDateTimeEs(isoStr) {
  if (!isoStr) return '-';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return isoStr;
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

async function fetchVpsSyncStatus() {
  const token = typeof getGitHubToken === 'function' ? getGitHubToken() : '';
  if (token) {
    try {
      const apiUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${VPS_STATUS_FILE_PATH}?ref=${GITHUB_REPO_BRANCH}&_ts=${Date.now()}`;
      const res = await fetch(apiUrl, {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (res.ok) {
        const meta = await res.json();
        const jsonStr = base64ToUtf8(meta.content);
        return JSON.parse(jsonStr);
      }
    } catch (e) {
      console.warn('[VPS Monitor] Fallback a archivo local por error en API:', e);
    }
  }

  const localRes = await fetch(`${VPS_STATUS_FILE_PATH}?_ts=${Date.now()}`, { cache: 'no-store' });
  if (!localRes.ok) throw new Error(`HTTP ${localRes.status}`);
  return await localRes.json();
}

function updateTopDatasetBadgesFromVps(statusData) {
  if (!statusData || !statusData.modules) return;
  const mods = statusData.modules;

  const applyBadge = (overviewId, tabId, mod) => {
    if (!mod) return;
    const isOk = mod.status === 'ok';
    const isRunning = mod.status === 'running';
    const isErr = mod.status === 'error';
    const rel = mod.updatedAt ? formatRelativeTimeEs(mod.updatedAt) : '';

    const cls = isRunning
      ? 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-950 text-amber-300 border border-amber-500/60 font-bold animate-pulse'
      : isOk
      ? 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold'
      : isErr
      ? 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-red-950 text-red-300 border border-red-500/60 font-bold'
      : 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold';

    const label = isRunning
      ? 'Actualizando...'
      : isOk
      ? `VPS ✓ (${rel})`
      : isErr
      ? 'Fallo VPS ✗'
      : 'Pendiente';

    const el1 = document.getElementById(overviewId);
    if (el1) {
      el1.className = cls;
      el1.textContent = label;
    }
    const el2 = document.getElementById(tabId);
    if (el2) {
      el2.className = cls;
      el2.textContent = label;
    }
  };

  applyBadge('overview-archon-status', 'archon-data-status', mods.archon);
  applyBadge('overview-stat-priorities-status', 'stat-priorities-data-status', mods.stats);
  applyBadge('overview-wowhead-status', 'wowhead-data-status', mods.wowhead);
  applyBadge('overview-bloodmallet-status', 'bloodmallet-data-status', mods.bloodmallet);
}

function renderVpsSyncPanel(statusData) {
  const container = document.getElementById('admin-vps-sync-container');
  if (!container) return;

  if (!statusData) {
    container.innerHTML = `
      <div class="bg-wow-card border border-wow-border rounded-2xl p-5 text-xs text-slate-400">
        Cargando estado del Auto-Scraper en VPS...
      </div>
    `;
    return;
  }

  lastVpsStatusData = statusData;
  updateTopDatasetBadgesFromVps(statusData);

  const state = statusData.state || 'idle';
  const isBusy = state === 'running' || state === 'queued';
  const mods = statusData.modules || {};
  const moduleKeys = ['archon', 'stats', 'wowhead', 'bloodmallet'];
  const failedCount = moduleKeys.filter(k => mods[k]?.status === 'error').length;
  const okCount = moduleKeys.filter(k => mods[k]?.status === 'ok').length;

  let stateBadgeHtml = '';
  if (state === 'running') {
    stateBadgeHtml = `<span class="text-[11px] px-3 py-1 rounded-full font-mono bg-amber-950 text-amber-300 border border-amber-500/60 font-bold flex items-center gap-1.5"><i class="fa-solid fa-spinner fa-spin"></i> Sincronizando en VPS...</span>`;
  } else if (state === 'queued') {
    stateBadgeHtml = `<span class="text-[11px] px-3 py-1 rounded-full font-mono bg-sky-950 text-sky-300 border border-sky-500/60 font-bold flex items-center gap-1.5"><i class="fa-solid fa-satellite-dish animate-pulse"></i> Señal Enviada (En Cola)</span>`;
  } else if (failedCount > 0) {
    stateBadgeHtml = `<span class="text-[11px] px-3 py-1 rounded-full font-mono bg-red-950 text-red-300 border border-red-500/60 font-bold flex items-center gap-1.5"><i class="fa-solid fa-triangle-exclamation"></i> ${failedCount} Fallo(s) Detectado(s)</span>`;
  } else {
    stateBadgeHtml = `<span class="text-[11px] px-3 py-1 rounded-full font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold flex items-center gap-1.5"><i class="fa-solid fa-circle-check"></i> ${okCount}/4 Módulos al Día (Auto 12h)</span>`;
  }

  const moduleMeta = [
    { key: 'archon', icon: 'fa-shield-halved', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-950/30', shortBtn: 'Solo Archon' },
    { key: 'stats', icon: 'fa-chart-column', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/30', shortBtn: 'Solo Stats' },
    { key: 'wowhead', icon: 'fa-wand-magic-sparkles', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/30', shortBtn: 'Solo Enchants' },
    { key: 'bloodmallet', icon: 'fa-fire', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-950/30', shortBtn: 'Solo Bloodmallet' }
  ];

  const cardsHtml = moduleMeta.map(m => {
    const mod = mods[m.key] || { name: m.key, files: [], status: 'pending', updatedAt: null, summary: '-', error: null };
    const st = mod.status || 'pending';

    const statusPill = st === 'ok'
      ? `<span class="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold"><i class="fa-solid fa-check mr-1"></i>Actualizado</span>`
      : st === 'running'
      ? `<span class="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-950 text-amber-300 border border-amber-500/50 font-bold"><i class="fa-solid fa-spinner fa-spin mr-1"></i>Extrayendo...</span>`
      : st === 'error'
      ? `<span class="text-[10px] px-2 py-0.5 rounded-full font-mono bg-red-950 text-red-300 border border-red-500/60 font-bold"><i class="fa-solid fa-xmark mr-1"></i>Falló</span>`
      : `<span class="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-400 border border-slate-700 font-bold">Pendiente</span>`;

    const filesHtml = (mod.files || []).map(f => `<code class="text-[10px] font-mono text-amber-300 bg-black/50 px-1.5 py-0.5 rounded border border-white/10">${f}</code>`).join(' ');

    const errorHtml = mod.error
      ? `<div class="mt-2 p-2 rounded-lg bg-red-950/60 border border-red-500/50 text-[11px] text-red-200 font-mono break-words"><i class="fa-solid fa-circle-exclamation text-red-400 mr-1"></i>${mod.error}</div>`
      : '';

    return `
      <div class="bg-wow-subcard border ${mod.error ? 'border-red-500/60' : m.border} rounded-xl p-4 flex flex-col justify-between space-y-3">
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-8 h-8 rounded-lg ${m.bg} border ${m.border} flex items-center justify-center ${m.color} shrink-0">
                <i class="fa-solid ${m.icon}"></i>
              </div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-white leading-snug break-words">${mod.name}</h4>
              </div>
            </div>
            <div class="shrink-0">${statusPill}</div>
          </div>

          <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
            ${filesHtml}
          </div>

          <div class="text-[11px] text-slate-300 flex items-center justify-between gap-2 pt-1 border-t border-white/5">
            <span class="text-slate-400">Resultado:</span>
            <span class="font-semibold text-emerald-300 text-right">${mod.summary || '-'}</span>
          </div>

          <div class="text-[11px] text-slate-400 flex items-center justify-between gap-2">
            <span>Último update:</span>
            <span class="font-mono text-slate-200" title="${formatLocalDateTimeEs(mod.updatedAt)}">${formatRelativeTimeEs(mod.updatedAt)} (${formatLocalDateTimeEs(mod.updatedAt)})</span>
          </div>

          ${errorHtml}
        </div>

        <div class="pt-1">
          <button onclick="triggerVpsRemoteSync('${m.key}')" ${isBusy ? 'disabled' : ''} class="min-h-[38px] w-full text-xs ${isBusy ? 'opacity-50 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800' : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-600 cursor-pointer'} border px-3 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition">
            <i class="fa-solid fa-satellite-dish ${m.color}"></i> Mandar Señal: ${m.shortBtn}
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="bg-wow-card border border-indigo-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5">
      <!-- Header -->
      <div class="flex items-start sm:items-center justify-between flex-wrap gap-4 pb-4 border-b border-wow-border">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-11 h-11 rounded-xl bg-indigo-950/80 border border-indigo-500/60 flex items-center justify-center text-indigo-400 text-xl shadow shrink-0">
            <i class="fa-solid fa-server"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2.5 flex-wrap">
              <h3 class="text-base font-bold text-white">Auto-Scraper Docker en VPS (<code class="text-indigo-300 font-mono text-xs">13.140.233.235</code>)</h3>
              ${stateBadgeHtml}
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Ejecuta tus scripts exactos de consola en contenedor aislado (<code class="text-amber-300 font-mono">wowtopgear-scraper</code> con Camoufox) y publica directo a GitHub cada 12 horas o bajo demanda.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button onclick="refreshVpsSyncStatusUI(true)" class="min-h-[38px] text-xs bg-wow-subcard hover:bg-slate-800 text-slate-200 border border-wow-border px-3.5 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer flex-1 sm:flex-initial">
            <i id="vps-refresh-icon" class="fa-solid fa-arrows-rotate text-indigo-400"></i> Refrescar
          </button>
          <button onclick="triggerVpsRemoteSync('all')" ${isBusy ? 'disabled' : ''} class="min-h-[38px] text-xs ${isBusy ? 'opacity-60 cursor-not-allowed bg-slate-800 text-slate-400 border-slate-700' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-indigo-400/50 cursor-pointer'} border px-4 py-2 rounded-xl font-extrabold flex items-center justify-center gap-2 transition shadow-lg flex-1 sm:flex-initial">
            <i class="fa-solid ${isBusy ? 'fa-spinner fa-spin' : 'fa-bolt'} text-amber-300"></i>
            <span>${isBusy ? 'Sincronización en Curso...' : 'Mandar Señal: Actualizar Todo Ahora'}</span>
          </button>
        </div>
      </div>

      <!-- Summary Telemetry Bar -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-wow-subcard border border-wow-border rounded-xl p-3.5 text-xs">
        <div class="space-y-0.5">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Última Sincronización Completa</span>
          <span class="font-mono font-bold text-emerald-300 text-sm">${formatRelativeTimeEs(statusData.lastRunAt)}</span>
          <span class="text-[11px] text-slate-400 block font-mono">${formatLocalDateTimeEs(statusData.lastRunAt)}</span>
        </div>
        <div class="space-y-0.5">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Duración del Ciclo</span>
          <span class="font-mono font-bold text-amber-300 text-sm">${statusData.durationSec ? `${statusData.durationSec}s (~${(statusData.durationSec / 60).toFixed(1)} min)` : '-'}</span>
          <span class="text-[11px] text-slate-400 block">Modo: <code class="text-slate-200 font-mono">${statusData.triggerTarget || 'all'}</code></span>
        </div>
        <div class="space-y-0.5">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Próxima Ejecución Automática</span>
          <span class="font-mono font-bold text-sky-300 text-sm">${formatRelativeTimeEs(statusData.nextScheduledAt)}</span>
          <span class="text-[11px] text-slate-400 block font-mono">${formatLocalDateTimeEs(statusData.nextScheduledAt)}</span>
        </div>
        <div class="space-y-0.5">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Actividad Actual del Bot</span>
          <span class="font-semibold ${isBusy ? 'text-amber-300 animate-pulse' : 'text-slate-200'} block break-words">${statusData.currentStep || 'En espera del próximo ciclo'}</span>
        </div>
      </div>

      <!-- 4 Module Breakdown Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        ${cardsHtml}
      </div>
    </div>
  `;
}

async function refreshVpsSyncStatusUI(showFeedback = false) {
  const icon = document.getElementById('vps-refresh-icon');
  if (icon) icon.classList.add('fa-spin');
  try {
    const data = await fetchVpsSyncStatus();
    renderVpsSyncPanel(data);

    const state = data?.state || 'idle';
    if (state === 'running' || state === 'queued') {
      startVpsStatusPolling();
    } else {
      stopVpsStatusPolling();
    }

    if (showFeedback && typeof showToast === 'function') {
      showToast('Estado del bot VPS actualizado', 'info');
    }
  } catch (err) {
    console.warn('Error cargando estado del VPS:', err);
  } finally {
    if (icon) icon.classList.remove('fa-spin');
  }
}

function startVpsStatusPolling() {
  if (vpsPollTimer) return;
  vpsPollTimer = setInterval(() => {
    refreshVpsSyncStatusUI(false);
  }, 5000);
}

function stopVpsStatusPolling() {
  if (vpsPollTimer) {
    clearInterval(vpsPollTimer);
    vpsPollTimer = null;
  }
}

async function triggerVpsRemoteSync(target = 'all') {
  const token = typeof getGitHubToken === 'function' ? getGitHubToken() : '';
  if (!token) {
    alert('Se requiere el GitHub Token activo para enviar la señal remota al VPS.');
    return;
  }

  const targetNames = {
    all: 'TODOS los 4 datasets (Archon, Stats, Enchants y Bloodmallet)',
    archon: 'Archon.gg (40 Specs + Healers)',
    stats: 'Prioridades de Estadísticas (Wowhead)',
    wowhead: 'Encantamientos y Consumibles (Wowhead)',
    bloodmallet: 'Simulaciones de Abalorios (Bloodmallet)'
  };

  try {
    showToast(`Enviando señal al contenedor Docker del VPS para actualizar: ${targetNames[target] || target}...`, 'info');
    let current = lastVpsStatusData;
    try {
      current = await fetchVpsSyncStatus();
    } catch (e) {}

    const payload = current && typeof current === 'object' ? { ...current } : {};
    payload.state = 'queued';
    payload.triggerRequestedAt = Date.now();
    payload.triggerTarget = target;
    payload.currentStep = `Señal remota enviada (${target}) — el VPS iniciará en ≤ 15 segundos...`;

    await commitFileToGitHub(
      VPS_STATUS_FILE_PATH,
      JSON.stringify(payload, null, 2),
      `chore(vps): signal remote sync (${target}) from Admin Panel [skip ci]`
    );

    renderVpsSyncPanel(payload);
    startVpsStatusPolling();
    showToast('¡Señal enviada con éxito! El contenedor del VPS iniciará la extracción en unos segundos.', 'success');
  } catch (err) {
    console.error('Error enviando señal al VPS:', err);
    showToast('Error al enviar señal al VPS: ' + err.message, 'error');
  }
}
