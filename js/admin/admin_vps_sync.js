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

  const applyBadge = (tabId, mod) => {
    if (!mod) return;
    const isOk = mod.status === 'ok';
    const isRunning = mod.status === 'running';
    const isErr = mod.status === 'error';
    const rel = mod.updatedAt ? formatRelativeTimeEs(mod.updatedAt) : '';

    const cls = isRunning
      ? 'text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-amber-950 text-amber-300 border border-amber-500/60 font-bold animate-pulse'
      : isOk
      ? 'text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold'
      : isErr
      ? 'text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-red-950 text-red-300 border border-red-500/60 font-bold'
      : 'text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold';

    const label = isRunning
      ? 'Actualizando en VPS...'
      : isOk
      ? `VPS ✓ (${rel})`
      : isErr
      ? 'Fallo VPS ✗'
      : 'Pendiente';

    const el = document.getElementById(tabId);
    if (el) {
      el.className = cls;
      el.textContent = label;
    }
  };

  applyBadge('archon-data-status', mods.archon);
  applyBadge('stat-priorities-data-status', mods.stats);
  applyBadge('wowhead-data-status', mods.wowhead);
  applyBadge('bloodmallet-data-status', mods.bloodmallet);
}

function renderVpsSyncPanel(statusData) {
  const container = document.getElementById('admin-vps-sync-container');
  if (!container) return;

  if (!statusData) {
    container.innerHTML = `
      <div class="bg-wow-card border border-wow-border rounded-2xl p-6 text-xs text-slate-400 flex items-center gap-3">
        <i class="fa-solid fa-spinner fa-spin text-amber-400 text-base"></i>
        <span>Cargando estado en vivo del Auto-Scraper en VPS...</span>
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
    stateBadgeHtml = `<span class="text-[11px] px-3 py-1 rounded-full font-mono bg-amber-950/90 text-amber-300 border border-amber-500/60 font-bold flex items-center gap-1.5 shadow"><i class="fa-solid fa-spinner fa-spin"></i> Sincronizando en VPS...</span>`;
  } else if (state === 'queued') {
    stateBadgeHtml = `<span class="text-[11px] px-3 py-1 rounded-full font-mono bg-sky-950/90 text-sky-300 border border-sky-500/60 font-bold flex items-center gap-1.5 shadow"><i class="fa-solid fa-satellite-dish animate-pulse"></i> Señal en Cola (≤15s)</span>`;
  } else if (failedCount > 0) {
    stateBadgeHtml = `<span class="text-[11px] px-3 py-1 rounded-full font-mono bg-red-950/90 text-red-300 border border-red-500/60 font-bold flex items-center gap-1.5 shadow"><i class="fa-solid fa-triangle-exclamation"></i> ${failedCount} Fallo(s)</span>`;
  } else {
    stateBadgeHtml = `<span class="text-[11px] px-3 py-1 rounded-full font-mono bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 font-bold flex items-center gap-1.5 shadow"><i class="fa-solid fa-circle-check"></i> ${okCount}/4 Módulos al Día</span>`;
  }

  const moduleMeta = [
    {
      key: 'archon',
      tabId: 'archon',
      title: 'Archon.gg (40 Specs)',
      subtitle: 'Presets, BiS, Talentos 1:1 & Healers',
      icon: 'fa-shield-halved',
      color: 'text-purple-400',
      border: 'border-purple-500/35 hover:border-purple-500/60',
      iconBg: 'bg-purple-950/60 border-purple-500/50',
      btnAccent: 'hover:border-purple-500/50 hover:text-purple-200',
      shortBtn: 'Solo Archon'
    },
    {
      key: 'stats',
      tabId: 'stat_priorities',
      title: 'Prioridades Stats',
      subtitle: 'Pesos Oficiales & Árboles Héroe',
      icon: 'fa-chart-column',
      color: 'text-emerald-400',
      border: 'border-emerald-500/35 hover:border-emerald-500/60',
      iconBg: 'bg-emerald-950/60 border-emerald-500/50',
      btnAccent: 'hover:border-emerald-500/50 hover:text-emerald-200',
      shortBtn: 'Solo Stats'
    },
    {
      key: 'wowhead',
      tabId: 'wowhead',
      title: 'Enchants & Comida',
      subtitle: 'Gemas, Frascos, Pociones & Iconos',
      icon: 'fa-wand-magic-sparkles',
      color: 'text-amber-400',
      border: 'border-amber-500/35 hover:border-amber-500/60',
      iconBg: 'bg-amber-950/60 border-amber-500/50',
      btnAccent: 'hover:border-amber-500/50 hover:text-amber-200',
      shortBtn: 'Solo Enchants'
    },
    {
      key: 'bloodmallet',
      tabId: 'bloodmallet',
      title: 'Bloodmallet DPS',
      subtitle: 'Simulaciones Abalorios (1T y 5T)',
      icon: 'fa-fire',
      color: 'text-red-400',
      border: 'border-red-500/35 hover:border-red-500/60',
      iconBg: 'bg-red-950/60 border-red-500/50',
      btnAccent: 'hover:border-red-500/50 hover:text-red-200',
      shortBtn: 'Solo Bloodmallet'
    }
  ];

  const cardsHtml = moduleMeta.map(m => {
    const mod = mods[m.key] || { name: m.title, files: [], status: 'pending', updatedAt: null, summary: '-', error: null };
    const st = mod.status || 'pending';

    const statusPill = st === 'ok'
      ? `<span class="text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 font-bold shrink-0"><i class="fa-solid fa-check mr-1"></i>Actualizado</span>`
      : st === 'running'
      ? `<span class="text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-amber-950/90 text-amber-300 border border-amber-500/50 font-bold shrink-0 animate-pulse"><i class="fa-solid fa-spinner fa-spin mr-1"></i>Extrayendo</span>`
      : st === 'error'
      ? `<span class="text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-red-950/90 text-red-300 border border-red-500/60 font-bold shrink-0"><i class="fa-solid fa-xmark mr-1"></i>Falló</span>`
      : `<span class="text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-slate-800 text-slate-400 border border-slate-700 font-bold shrink-0">Pendiente</span>`;

    const filesHtml = (mod.files || []).map(f => `<code class="text-[10px] font-mono text-amber-300/90 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">${f}</code>`).join(' ');

    const errorHtml = mod.error
      ? `<div class="p-2.5 rounded-xl bg-red-950/70 border border-red-500/50 text-[11px] text-red-200 font-mono break-words"><i class="fa-solid fa-circle-exclamation text-red-400 mr-1.5"></i>${mod.error}</div>`
      : '';

    return `
      <div class="bg-[#111522] border ${mod.error ? 'border-red-500/60' : m.border} rounded-2xl p-4 flex flex-col justify-between space-y-3.5 transition shadow-lg">
        <div class="space-y-3">
          <!-- Card Header -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-9 h-9 rounded-xl ${m.iconBg} border flex items-center justify-center ${m.color} text-sm shrink-0 shadow-inner">
                <i class="fa-solid ${m.icon}"></i>
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-extrabold text-white truncate">${m.title}</h4>
                <p class="text-[11px] text-slate-400 truncate">${m.subtitle}</p>
              </div>
            </div>
            ${statusPill}
          </div>

          <!-- Target JS Files -->
          <div class="flex items-center gap-1.5 flex-wrap">
            ${filesHtml}
          </div>

          <!-- Telemetry Rows -->
          <div class="bg-black/35 border border-white/5 rounded-xl p-2.5 space-y-1.5 text-[11px]">
            <div class="flex items-center justify-between gap-2">
              <span class="text-slate-400">Resultado:</span>
              <span class="font-bold text-emerald-300 text-right truncate">${mod.summary || '-'}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-slate-400">Último update:</span>
              <span class="font-mono text-slate-200 font-semibold" title="${formatLocalDateTimeEs(mod.updatedAt)}">${formatRelativeTimeEs(mod.updatedAt)} <span class="text-slate-500 font-normal">(${formatLocalDateTimeEs(mod.updatedAt).split(',')[1]?.trim() || ''})</span></span>
            </div>
          </div>

          ${errorHtml}
        </div>

        <!-- Action Row: Remote Signal + Gear Manual Admin -->
        <div class="flex items-center gap-2 pt-1">
          <button onclick="triggerVpsRemoteSync('${m.key}')" ${isBusy ? 'disabled' : ''} class="min-h-[38px] flex-1 text-xs ${isBusy ? 'opacity-50 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800' : `bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 ${m.btnAccent} cursor-pointer`} border px-3 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition shadow-sm">
            <i class="fa-solid fa-satellite-dish ${m.color}"></i>
            <span>${m.shortBtn}</span>
          </button>
          <button onclick="switchAdminTab('${m.tabId}')" title="Administrar manualmente (${m.title})" aria-label="Administrar manualmente ${m.title}" class="min-h-[38px] w-10 shrink-0 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/50 rounded-xl flex items-center justify-center transition shadow-sm cursor-pointer">
            <i class="fa-solid fa-gear text-sm"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="bg-gradient-to-b from-[#171c2b] to-[#121520] border border-indigo-500/35 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5">
      <!-- Top Control Bar -->
      <div class="flex items-start lg:items-center justify-between flex-col lg:flex-row gap-4 pb-4 border-b border-white/10">
        <div class="flex items-center gap-3.5 min-w-0">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/25 to-purple-600/15 border border-indigo-400/50 flex items-center justify-center text-indigo-300 text-lg shadow-lg shrink-0">
            <i class="fa-solid fa-server"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2.5 flex-wrap">
              <h3 class="text-base sm:text-lg font-black text-white tracking-tight">Centro de Extracción Automática VPS</h3>
              ${stateBadgeHtml}
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              Contenedor Docker aislado (<code class="text-indigo-300 font-mono">wowtopgear-scraper</code> en <code class="text-slate-300 font-mono">13.140.233.235</code>) sincronizado cada 12h con <code class="text-amber-300 font-mono">sephirods/WoWoptimizer</code>. Usa <i class="fa-solid fa-gear text-slate-300 mx-0.5"></i> en cada tarjeta si deseas subir o copiar scripts manualmente.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap w-full lg:w-auto shrink-0">
          <button onclick="refreshVpsSyncStatusUI(true)" class="min-h-[38px] text-xs bg-black/40 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-indigo-400/40 px-3.5 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer flex-1 sm:flex-initial">
            <i id="vps-refresh-icon" class="fa-solid fa-arrows-rotate text-indigo-400"></i> Refrescar
          </button>
          <button onclick="triggerVpsRemoteSync('all')" ${isBusy ? 'disabled' : ''} class="min-h-[38px] text-xs ${isBusy ? 'opacity-60 cursor-not-allowed bg-slate-800 text-slate-400 border-slate-700' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white border-indigo-400/50 cursor-pointer'} border px-4 py-2 rounded-xl font-extrabold flex items-center justify-center gap-2 transition shadow-lg flex-1 sm:flex-initial">
            <i class="fa-solid ${isBusy ? 'fa-spinner fa-spin' : 'fa-bolt'} text-amber-200"></i>
            <span>${isBusy ? 'Sincronizando en VPS...' : 'Mandar Señal: Actualizar Todo Ahora'}</span>
          </button>
        </div>
      </div>

      <!-- Compact Telemetry Strip -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-black/35 border border-white/5 rounded-xl p-3.5 text-xs">
        <div class="space-y-0.5">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Último Ciclo Completo</span>
          <span class="font-mono font-bold text-emerald-300 text-sm">${formatRelativeTimeEs(statusData.lastRunAt)}</span>
          <span class="text-[11px] text-slate-500 block font-mono">${formatLocalDateTimeEs(statusData.lastRunAt)}</span>
        </div>
        <div class="space-y-0.5">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Tiempo de Ejecución</span>
          <span class="font-mono font-bold text-amber-300 text-sm">${statusData.durationSec ? `${statusData.durationSec}s (~${(statusData.durationSec / 60).toFixed(1)} min)` : '-'}</span>
          <span class="text-[11px] text-slate-500 block">Objetivo: <code class="text-slate-300 font-mono">${statusData.triggerTarget || 'all'}</code></span>
        </div>
        <div class="space-y-0.5">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Próximo Ciclo Automático</span>
          <span class="font-mono font-bold text-sky-300 text-sm">${formatRelativeTimeEs(statusData.nextScheduledAt)}</span>
          <span class="text-[11px] text-slate-500 block font-mono">${formatLocalDateTimeEs(statusData.nextScheduledAt)}</span>
        </div>
        <div class="space-y-0.5">
          <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Estado del Demonio VPS</span>
          <span class="font-semibold ${isBusy ? 'text-amber-300 animate-pulse' : 'text-slate-200'} block break-words">${statusData.currentStep || 'Escuchando señales remotas (cada 15s)'}</span>
        </div>
      </div>

      <!-- 4 Dataset Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
