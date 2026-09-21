// Admin Suite: Authentication, Tabs & UI Dashboard State
const ADMIN_PASSWORD_HASH = "Juan8969796.";
let activeTabId = 'overview';

function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const el = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200' :
             type === 'error' ? 'bg-red-950/95 border-red-500 text-red-200' :
             'bg-slate-900/95 border-amber-500/70 text-amber-200';
  el.className = `${bg} border px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 pointer-events-auto transition duration-300 translate-y-2 opacity-0`;
  el.innerHTML = `<span>${msg}</span>`;
  c.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.remove('translate-y-2', 'opacity-0');
  });
  setTimeout(() => {
    el.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

function togglePassVisibility() {
  const pass = document.getElementById('admin-pass');
  const icon = document.getElementById('eye-icon');
  if (pass.type === 'password') {
    pass.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    pass.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}

function handleLogin(e) {
  e.preventDefault();
  const input = document.getElementById('admin-pass');
  const val = (input?.value || '').trim();
  if (val === ADMIN_PASSWORD_HASH) {
    sessionStorage.setItem('wow_admin_auth', 'authenticated');
    document.getElementById('login-error').classList.add('hidden');
    renderAdminDashboard();
    showToast('¡Sesión administrativa iniciada con éxito!', 'success');
  } else {
    document.getElementById('login-error').classList.remove('hidden');
    if (input) {
      input.focus();
      input.select();
    }
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('wow_admin_auth');
  location.reload();
}

function checkAuth() {
  if (sessionStorage.getItem('wow_admin_auth') === 'authenticated') {
    renderAdminDashboard();
  }
}

function switchAdminTab(tabId) {
  activeTabId = tabId;
  document.querySelectorAll('.admin-tab-pane').forEach(el => el.classList.add('hidden'));
  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) activePane.classList.remove('hidden');

  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.className = 'admin-tab-btn flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent';
  });

  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) {
    if (tabId === 'overview') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-amber-400 bg-amber-500/15 border border-amber-500/40 shadow';
    } else if (tabId === 'archon') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-purple-300 bg-purple-950/40 border border-purple-500/50 shadow';
    } else if (tabId === 'archon_healers') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[145px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-sky-300 bg-sky-950/40 border border-sky-500/50 shadow';
    } else if (tabId === 'stat_priorities') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[145px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-emerald-300 bg-emerald-950/40 border border-emerald-500/50 shadow';
    } else if (tabId === 'wowhead') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[145px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-amber-300 bg-amber-950/40 border border-amber-500/50 shadow';
    } else if (tabId === 'bloodmallet') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-red-300 bg-red-950/40 border border-red-500/50 shadow';
    } else if (tabId === 'tooltips') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[155px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-sky-300 bg-sky-950/40 border border-sky-500/50 shadow';
    } else if (tabId === 'tickets') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[160px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-amber-300 bg-amber-950/40 border border-amber-500/50 shadow';
    } else if (tabId === 'news') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[170px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-cyan-300 bg-cyan-950/40 border border-cyan-500/50 shadow';
    } else if (tabId === 'analytics') {
      activeBtn.className = 'admin-tab-btn flex-1 min-w-[175px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition text-violet-300 bg-violet-950/40 border border-violet-500/50 shadow';
    }
  }

  if (tabId === 'tooltips') {
    renderMissingTooltipsTable();
  } else if (tabId === 'tickets') {
    renderTicketsTable();
  } else if (tabId === 'news') {
    renderAdminNewsPreview();
  } else if (tabId === 'analytics') {
    fetchAnalyticsCounts();
  }
}

async function fetchAnalyticsCounts() {
  const icon = document.getElementById('refresh-analytics-icon');
  if (icon) icon.classList.add('fa-spin');

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  try {
    let isBlocked = false;
    const fetchCount = async (path) => {
      try {
        const encodedPath = path.startsWith('/') ? '%' + '2F' + path.slice(1) : path;
        const res = await fetch(`https://sephirods.goatcounter.com/counter/${encodedPath}.json?_ts=${Date.now()}`);
        if (!res.ok) return 0;
        const data = await res.json();
        return parseInt((data.count || '0').replace(/[^0-9]/g, ''), 10) || 0;
      } catch (e) {
        isBlocked = true;
        return null;
      }
    };

    const [total, indexCount, gearsim1, gearsim2] = await Promise.all([
      fetchCount('TOTAL'),
      fetchCount('/'),
      fetchCount('/gearsim'),
      fetchCount('/gearsim.html')
    ]);

    if (isBlocked || total === null) {
      setEl('analytics-count-total', 'Bloqueado (AdBlock)');
      setEl('analytics-count-index', 'Bloqueado (AdBlock)');
      setEl('analytics-count-gearsim', 'Bloqueado (AdBlock)');
      setEl('overview-analytics-total', 'AdBlock Activo');
      const lastEl = document.getElementById('analytics-last-update');
      if (lastEl) lastEl.innerText = 'Actualizado: ' + new Date().toLocaleTimeString() + ' (Desactiva AdBlocker para ver datos)';
    } else {
      const gearsimTotal = (gearsim1 || 0) + (gearsim2 || 0);
      setEl('analytics-count-total', total.toLocaleString());
      setEl('analytics-count-index', (indexCount || 0).toLocaleString());
      setEl('analytics-count-gearsim', gearsimTotal.toLocaleString());
      setEl('overview-analytics-total', `${total.toLocaleString()} visitas`);
      const lastEl = document.getElementById('analytics-last-update');
      if (lastEl) lastEl.innerText = 'Actualizado: ' + new Date().toLocaleTimeString();
    }

  } catch (err) {
    console.warn('Error al obtener métricas de GoatCounter:', err);
  } finally {
    if (icon) icon.classList.remove('fa-spin');
  }
}

function renderAdminDashboard() {
  const main = document.getElementById('main-content');
  if (main) {
    main.classList.remove('justify-center');
    main.classList.add('justify-start');
  }

  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('admin-dashboard').classList.remove('hidden');
  document.getElementById('btn-logout').classList.remove('hidden');

  const archonPre = document.getElementById('archon-script-preview');
  const archonHealersPre = document.getElementById('archon-healers-script-preview');
  const wowheadPre = document.getElementById('wowhead-script-preview');
  const statPrioritiesPre = document.getElementById('stat-priorities-script-preview');

  if (archonPre && window.ARCHON_EXTRACTOR_SCRIPT_CODE) archonPre.textContent = window.ARCHON_EXTRACTOR_SCRIPT_CODE;
  if (archonHealersPre && window.ARCHON_HEALER_EXTRACTOR_SCRIPT_CODE) archonHealersPre.textContent = window.ARCHON_HEALER_EXTRACTOR_SCRIPT_CODE;
  if (wowheadPre && window.WOWHEAD_EXTRACTOR_SCRIPT_CODE) wowheadPre.textContent = window.WOWHEAD_EXTRACTOR_SCRIPT_CODE;
  if (statPrioritiesPre && window.STAT_PRIORITIES_EXTRACTOR_SCRIPT_CODE) statPrioritiesPre.textContent = window.STAT_PRIORITIES_EXTRACTOR_SCRIPT_CODE;

  updateDevModalStatusBadges();
  updateGitHubTokenUI();
  renderMissingTooltipsTable();
  renderTicketsTable();
  renderAdminNewsPreview();
  fetchAnalyticsCounts();
}

function refreshAllStatuses() {
  updateDevModalStatusBadges();
  updateGitHubTokenUI();
  showToast('Estados actualizados', 'info');
}

function copyArchonExtractorScript() {
  const code = window.ARCHON_EXTRACTOR_SCRIPT_CODE || '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('¡Script de Archon copiado al portapapeles!', 'success');
  }).catch(() => showToast('Error al copiar script', 'error'));
}

function copyArchonHealerExtractorScript() {
  const code = window.ARCHON_HEALER_EXTRACTOR_SCRIPT_CODE || '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('¡Script de Abalorios Healers copiado!', 'success');
  }).catch(() => showToast('Error al copiar script', 'error'));
}

function copyWowheadExtractorScript() {
  const code = window.WOWHEAD_EXTRACTOR_SCRIPT_CODE || '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('¡Script de Wowhead copiado al portapapeles!', 'success');
  }).catch(() => showToast('Error al copiar script', 'error'));
}

function copyStatPrioritiesExtractorScript() {
  const code = window.STAT_PRIORITIES_EXTRACTOR_SCRIPT_CODE || '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('¡Script de Stat Priorities copiado!', 'success');
  }).catch(() => showToast('Error al copiar script', 'error'));
}
