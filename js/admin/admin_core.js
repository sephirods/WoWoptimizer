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
        const encodedPath = path.startsWith('/') ? '%' + '2F' + encodeURIComponent(path.slice(1)).replace(/%2F/g, '%2F') : path;
        const res = await fetch(`https://sephirods.goatcounter.com/counter/${encodedPath}.json?_ts=${Date.now()}`);
        if (!res.ok) return 0;
        const data = await res.json();
        return parseInt((data.count || '0').replace(/[^0-9]/g, ''), 10) || 0;
      } catch (e) {
        isBlocked = true;
        return null;
      }
    };

    const classRoutes = [
      { id: 'hub', label: 'Directorio General (/classes/)', path: '/classes/', color: 'text-sky-300' },
      { id: 'paladin', label: 'Paladín (/classes/paladin/)', path: '/classes/paladin/', color: 'text-pink-300' },
      { id: 'warrior', label: 'Guerrero (/classes/warrior/)', path: '/classes/warrior/', color: 'text-amber-300' },
      { id: 'deathknight', label: 'Caballero de la Muerte (/classes/deathknight/)', path: '/classes/deathknight/', color: 'text-red-400' },
      { id: 'demonhunter', label: 'Cazador de Demonios (/classes/demonhunter/)', path: '/classes/demonhunter/', color: 'text-purple-400' },
      { id: 'druid', label: 'Druida (/classes/druid/)', path: '/classes/druid/', color: 'text-orange-400' },
      { id: 'evoker', label: 'Evocador (/classes/evoker/)', path: '/classes/evoker/', color: 'text-teal-300' },
      { id: 'hunter', label: 'Cazador (/classes/hunter/)', path: '/classes/hunter/', color: 'text-lime-400' },
      { id: 'mage', label: 'Mago (/classes/mage/)', path: '/classes/mage/', color: 'text-cyan-300' },
      { id: 'monk', label: 'Monje (/classes/monk/)', path: '/classes/monk/', color: 'text-emerald-300' },
      { id: 'priest', label: 'Sacerdote (/classes/priest/)', path: '/classes/priest/', color: 'text-slate-100' },
      { id: 'rogue', label: 'Pícaro (/classes/rogue/)', path: '/classes/rogue/', color: 'text-yellow-300' },
      { id: 'shaman', label: 'Chamán (/classes/shaman/)', path: '/classes/shaman/', color: 'text-blue-400' },
      { id: 'warlock', label: 'Brujo (/classes/warlock/)', path: '/classes/warlock/', color: 'text-violet-400' }
    ];

    // Extraer las noticias principales para consultar sus lecturas en /news/<id>
    const rawNewsDb = window.WOW_NEWS_DATA || {};
    const allNewsItems = [
      ...(rawNewsDb.blizzardNews || []),
      ...(rawNewsDb.recentNews || []),
      ...(rawNewsDb.blueTracker || [])
    ];
    const uniqueNewsMap = new Map();
    allNewsItems.forEach(item => {
      if (item && item.id && !uniqueNewsMap.has(item.id)) {
        const titleStr = typeof item.title === 'object' ? (item.title.es || item.title.en || item.id) : (item.title || item.id);
        uniqueNewsMap.set(item.id, { id: item.id, title: titleStr, path: `/news/${item.id}` });
      }
    });
    const trackedNewsList = Array.from(uniqueNewsMap.values()).slice(0, 12);

    const [total, indexCount, indexHtmlCount, gearsim1, gearsim2] = await Promise.all([
      fetchCount('TOTAL'),
      fetchCount('/'),
      fetchCount('/index.html'),
      fetchCount('/gearsim'),
      fetchCount('/gearsim.html')
    ]);

    if (isBlocked || total === null) {
      setEl('analytics-count-total', 'Bloqueado (AdBlock)');
      setEl('analytics-count-index', 'Bloqueado (AdBlock)');
      setEl('analytics-count-gearsim', 'Bloqueado (AdBlock)');
      setEl('analytics-count-classes', 'Bloqueado (AdBlock)');
      setEl('analytics-count-news', 'Bloqueado (AdBlock)');
      setEl('overview-analytics-total', 'AdBlock Activo');
      const lastEl = document.getElementById('analytics-last-update');
      if (lastEl) lastEl.innerText = 'Actualizado: ' + new Date().toLocaleTimeString() + ' (Desactiva AdBlocker para ver datos)';
      return;
    }

    const classCounts = await Promise.all(classRoutes.map(async (r) => {
      const c1 = await fetchCount(r.path);
      const c2 = await fetchCount(r.path.replace(/\/$/, ''));
      return { ...r, count: (c1 || 0) + (c2 || 0) };
    }));

    const newsCounts = await Promise.all(trackedNewsList.map(async (n) => {
      const c = await fetchCount(n.path);
      return { ...n, count: c || 0 };
    }));

    const indexTotal = (indexCount || 0) + (indexHtmlCount || 0);
    const gearsimTotal = (gearsim1 || 0) + (gearsim2 || 0);
    const sumDirectClasses = classCounts.reduce((acc, x) => acc + x.count, 0);
    const sumNews = newsCounts.reduce((acc, x) => acc + x.count, 0);
    // Si hay visitas a sub-rutas de especializaciones (/classes/paladin/protection/, etc.), se reflejan en la diferencia contra TOTAL
    const inferredGuidesTotal = Math.max(sumDirectClasses, (total || 0) - indexTotal - gearsimTotal - sumNews);

    setEl('analytics-count-total', (total || 0).toLocaleString());
    setEl('analytics-count-index', indexTotal.toLocaleString());
    setEl('analytics-count-gearsim', gearsimTotal.toLocaleString());
    setEl('analytics-count-classes', inferredGuidesTotal.toLocaleString());
    setEl('analytics-count-news', sumNews.toLocaleString());
    setEl('overview-analytics-total', `${(total || 0).toLocaleString()} visitas`);

    const classesContainer = document.getElementById('analytics-classes-breakdown');
    if (classesContainer) {
      const sortedClasses = [...classCounts].sort((a, b) => b.count - a.count);
      classesContainer.innerHTML = sortedClasses.map(item => `
        <div class="py-2 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <div class="font-bold ${item.color} truncate">${item.label}</div>
          </div>
          <div class="flex items-center gap-2.5 shrink-0">
            <span class="font-mono font-black text-white bg-black/50 px-2 py-0.5 rounded border border-white/10">${item.count.toLocaleString()}</span>
            <a href="https://sephirods.goatcounter.com/?filter=${encodeURIComponent(item.path.replace(/\/$/, ''))}" target="_blank" rel="noopener noreferrer" class="text-[11px] text-sky-400 hover:text-white" title="Filtrar en GoatCounter">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
      `).join('');
    }

    const newsContainer = document.getElementById('analytics-news-breakdown');
    if (newsContainer) {
      const sortedNews = [...newsCounts].sort((a, b) => b.count - a.count);
      newsContainer.innerHTML = sortedNews.length > 0 ? sortedNews.map(item => `
        <div class="py-2 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <div class="font-semibold text-slate-200 truncate" title="${item.title.replace(/"/g, '&quot;')}">${item.title}</div>
            <div class="text-[10px] font-mono text-pink-400/80">${item.path}</div>
          </div>
          <div class="flex items-center gap-2.5 shrink-0">
            <span class="font-mono font-black text-white bg-black/50 px-2 py-0.5 rounded border border-white/10">${item.count.toLocaleString()}</span>
            <a href="https://sephirods.goatcounter.com/?filter=${encodeURIComponent(item.path)}" target="_blank" rel="noopener noreferrer" class="text-[11px] text-pink-400 hover:text-white" title="Filtrar en GoatCounter">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
      `).join('') : '<div class="py-4 text-center text-slate-400">Sin noticias registradas aún.</div>';
    }

    const lastEl = document.getElementById('analytics-last-update');
    if (lastEl) lastEl.innerText = 'Actualizado: ' + new Date().toLocaleTimeString();

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
