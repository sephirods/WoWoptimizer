// Admin Suite: Online Bloodmallet API Sync & Status Badges Engine
async function syncBloodmalletOnlineAdmin() {
  const btn = document.getElementById('btn-sync-bm');
  const btnText = document.getElementById('btn-sync-bm-text');
  const spinner = document.getElementById('sync-bm-spinner');
  if (btn) btn.disabled = true;
  if (spinner) spinner.classList.add('fa-spin');

  const SPECS = [
    'death_knight_blood', 'death_knight_frost', 'death_knight_unholy',
    'demon_hunter_havoc', 'demon_hunter_vengeance',
    'druid_balance', 'druid_feral', 'druid_guardian', 'druid_restoration',
    'evoker_devastation', 'evoker_preservation', 'evoker_augmentation',
    'hunter_beast_mastery', 'hunter_marksmanship', 'hunter_survival',
    'mage_arcane', 'mage_fire', 'mage_frost',
    'monk_brewmaster', 'monk_mistweaver', 'monk_windwalker',
    'paladin_holy', 'paladin_protection', 'paladin_retribution',
    'priest_discipline', 'priest_holy', 'priest_shadow',
    'rogue_assassination', 'rogue_outlaw', 'rogue_subtlety',
    'shaman_elemental', 'shaman_enhancement', 'shaman_restoration',
    'warlock_affliction', 'warlock_demonology', 'warlock_destruction',
    'warrior_arms', 'warrior_fury', 'warrior_protection'
  ];

  const dataset = {};
  let completed = 0;
  showToast('Descargando simulaciones de Bloodmallet...', 'info');

  for (const slug of SPECS) {
    if (btnText) btnText.innerText = 'Descargando (' + completed + '/' + SPECS.length + ')...';
    try {
      const res = await fetch('https://bloodmallet.com/data/trinkets/castingpatchwerk/' + slug + '.json');
      if (res.ok) {
        const json = await res.json();
        dataset[slug] = json;
      }
    } catch (e) {
      console.warn('Error en ' + slug + ':', e);
    }
    completed++;
  }

  try {
    const fileContent = `// OFFICIAL BLOODMALLET TRINKET SIMULATION DATASET\nwindow.BLOODMALLET_DATA = ${JSON.stringify(dataset, null, 2)};\n`;
    await publishDatasetDirectly('bloodmallet_data.js', fileContent, 'BLOODMALLET_DATA', 'wow_custom_bloodmallet_data');
  } catch (err) {
    console.error('Error publicando bloodmallet_data.js:', err);
    showToast('Error al publicar Bloodmallet: ' + err.message, 'error');
  }

  if (btnText) btnText.innerText = 'Actualizar Bloodmallet en Vivo';
  if (spinner) spinner.classList.remove('fa-spin');
  if (btn) btn.disabled = false;
}

function updateDevModalStatusBadges() {
  const hasCustomArchon = !!localStorage.getItem('wow_custom_archon_data');
  const hasCustomArchonHealers = !!localStorage.getItem('wow_custom_archon_healers');
  const hasCustomWowhead = !!localStorage.getItem('wow_custom_wowhead_data');
  const hasCustomBloodmallet = !!localStorage.getItem('wow_custom_bloodmallet_data');
  const hasCustomStatPriorities = !!localStorage.getItem('wow_custom_stat_priorities_data');

  // Archon Presets
  const archonStatus = document.getElementById('archon-data-status');
  const archonResetBtn = document.getElementById('btn-reset-archon');
  const ovArchon = document.getElementById('overview-archon-status');
  if (archonStatus) {
    archonStatus.className = hasCustomArchon ? 'text-[10px] px-2 py-0.5 rounded font-mono bg-purple-950 text-purple-300 border border-purple-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700';
    archonStatus.innerText = hasCustomArchon ? 'Personalizado ✓' : 'Por Defecto';
  }
  if (ovArchon) {
    ovArchon.className = hasCustomArchon ? 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-950 text-purple-300 border border-purple-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold';
    ovArchon.innerText = hasCustomArchon ? 'Personalizado ✓' : 'Por Defecto';
  }
  if (archonResetBtn) archonResetBtn.classList.toggle('hidden', !hasCustomArchon);

  // Archon Healer Trinkets
  const archonHealersStatus = document.getElementById('archon-healers-data-status');
  const archonHealersResetBtn = document.getElementById('btn-reset-archon-healers');
  const ovArchonHealers = document.getElementById('overview-archon-healers-status');
  if (archonHealersStatus) {
    archonHealersStatus.className = hasCustomArchonHealers ? 'text-[10px] px-2 py-0.5 rounded font-mono bg-sky-950 text-sky-300 border border-sky-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700';
    archonHealersStatus.innerText = hasCustomArchonHealers ? 'Personalizado ✓' : 'Por Defecto';
  }
  if (ovArchonHealers) {
    ovArchonHealers.className = hasCustomArchonHealers ? 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-sky-950 text-sky-300 border border-sky-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold';
    ovArchonHealers.innerText = hasCustomArchonHealers ? 'Personalizado ✓' : 'Por Defecto';
  }
  if (archonHealersResetBtn) archonHealersResetBtn.classList.toggle('hidden', !hasCustomArchonHealers);

  // Stat Priorities
  const statPrioritiesStatus = document.getElementById('stat-priorities-data-status');
  const statPrioritiesResetBtn = document.getElementById('btn-reset-stat-priorities');
  const ovStat = document.getElementById('overview-stat-priorities-status');
  if (statPrioritiesStatus) {
    statPrioritiesStatus.className = hasCustomStatPriorities ? 'text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700';
    statPrioritiesStatus.innerText = hasCustomStatPriorities ? 'Personalizado ✓' : 'Por Defecto';
  }
  if (ovStat) {
    ovStat.className = hasCustomStatPriorities ? 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold';
    ovStat.innerText = hasCustomStatPriorities ? 'Personalizado ✓' : 'Por Defecto';
  }
  if (statPrioritiesResetBtn) statPrioritiesResetBtn.classList.toggle('hidden', !hasCustomStatPriorities);

  // Wowhead
  const wowheadStatus = document.getElementById('wowhead-data-status');
  const wowheadResetBtn = document.getElementById('btn-reset-wowhead');
  const ovWowhead = document.getElementById('overview-wowhead-status');
  if (wowheadStatus) {
    wowheadStatus.className = hasCustomWowhead ? 'text-[10px] px-2 py-0.5 rounded font-mono bg-amber-950 text-amber-300 border border-amber-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700';
    wowheadStatus.innerText = hasCustomWowhead ? 'Personalizado ✓' : 'Por Defecto';
  }
  if (ovWowhead) {
    ovWowhead.className = hasCustomWowhead ? 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-950 text-amber-300 border border-amber-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold';
    ovWowhead.innerText = hasCustomWowhead ? 'Personalizado ✓' : 'Por Defecto';
  }
  if (wowheadResetBtn) wowheadResetBtn.classList.toggle('hidden', !hasCustomWowhead);

  // Bloodmallet
  const bloodmalletStatus = document.getElementById('bloodmallet-data-status');
  const bloodmalletResetBtn = document.getElementById('btn-reset-bloodmallet');
  const ovBloodmallet = document.getElementById('overview-bloodmallet-status');
  if (bloodmalletStatus) {
    bloodmalletStatus.className = hasCustomBloodmallet ? 'text-[10px] px-2 py-0.5 rounded font-mono bg-red-950 text-red-300 border border-red-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700';
    bloodmalletStatus.innerText = hasCustomBloodmallet ? 'Actualizado ✓' : 'Por Defecto';
  }
  if (ovBloodmallet) {
    ovBloodmallet.className = hasCustomBloodmallet ? 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-red-950 text-red-300 border border-red-500/60 font-bold' : 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold';
    ovBloodmallet.innerText = hasCustomBloodmallet ? 'Actualizado ✓' : 'Por Defecto';
  }
  if (bloodmalletResetBtn) bloodmalletResetBtn.classList.toggle('hidden', !hasCustomBloodmallet);

  // Noticias & Blue Tracker
  const hasCustomNews = !!localStorage.getItem('wow_custom_news_data');
  const newsStatus = document.getElementById('news-data-status');
  const newsResetBtn = document.getElementById('btn-reset-news');
  const ovNews = document.getElementById('overview-news-status');
  const ovNewsSubtext = document.getElementById('overview-news-subtext');
  const tabNewsBadge = document.getElementById('tab-news-badge');
  const newsCountBadge = document.getElementById('news-items-count-badge');

  let currentNewsDb = null;
  try {
    if (hasCustomNews) {
      currentNewsDb = JSON.parse(localStorage.getItem('wow_custom_news_data'));
    } else {
      const base = window.WOW_NEWS_DATABASE || { blueTracker: [], blizzardNews: [], recentNews: [] };
      const live = window.WOW_LIVE_NEWS_DATA || {};
      currentNewsDb = {
        blueTracker: (live.blueTracker && live.blueTracker.length > 0) ? live.blueTracker : (base.blueTracker || []),
        blizzardNews: (base.blizzardNews && base.blizzardNews.length > 0) ? base.blizzardNews : (live.blizzardNews || []),
        recentNews: (base.recentNews && base.recentNews.length > 0) ? base.recentNews : (live.recentNews || [])
      };
    }
  } catch (e) {}

  const blueCount = (currentNewsDb && currentNewsDb.blueTracker) ? currentNewsDb.blueTracker.length : 0;
  const blizzCount = (currentNewsDb && currentNewsDb.blizzardNews) ? currentNewsDb.blizzardNews.length : 0;
  const newsCount = (currentNewsDb && currentNewsDb.recentNews) ? currentNewsDb.recentNews.length : 0;
  const totalCount = blueCount + blizzCount + newsCount;

  if (newsCountBadge) newsCountBadge.innerText = `${blueCount} Blues / ${blizzCount} Blizzard / ${newsCount} Wowhead`;
  if (tabNewsBadge) tabNewsBadge.innerText = hasCustomNews ? 'Custom' : `${totalCount}`;
  if (ovNewsSubtext) ovNewsSubtext.innerText = `${blueCount} Blues, ${blizzCount} Oficiales, ${newsCount} Wowhead`;

  if (newsStatus) {
    newsStatus.className = hasCustomNews 
      ? 'text-[10px] px-2 py-0.5 rounded font-mono bg-purple-950 text-purple-300 border border-purple-500/60 font-bold'
      : 'text-[10px] px-2 py-0.5 rounded font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold';
    newsStatus.innerText = hasCustomNews ? 'Personalizado ✓' : 'En Vivo (Auto)';
  }
  if (ovNews) {
    ovNews.className = hasCustomNews 
      ? 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-950 text-purple-300 border border-purple-500/60 font-bold'
      : 'text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold';
    ovNews.innerText = hasCustomNews ? 'Personalizado ✓' : 'En Vivo ✓';
  }
  if (newsResetBtn) newsResetBtn.classList.toggle('hidden', !hasCustomNews);
}
