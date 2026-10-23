// Results UI Rendering, BiS Enchants/Consumables & Discord Export

// Secondary Stat Diminishing Returns (DR) Threshold Engine — Midnight Level 90 Official Brackets
// Base Rating per 1% at Lv90: Haste = 44, Crit = 46, Mastery = 46 (per Mastery pt), Versatility = 54
const LV90_DR_THRESHOLDS = {
  haste:   { base: 44, t10: 1320, t20: 1760, t30: 2200, t40: 2640, t50: 3080, cap: 8800 },
  crit:    { base: 46, t10: 1380, t20: 1840, t30: 2300, t40: 2760, t50: 3220, cap: 9200 },
  mastery: { base: 46, t10: 1380, t20: 1840, t30: 2300, t40: 2760, t50: 3220, cap: 9200 },
  vers:    { base: 54, t10: 1620, t20: 2160, t30: 2700, t40: 3240, t50: 3780, cap: 10800 }
};

function getDRBadge(statRating, statKey) {
  const cfg = LV90_DR_THRESHOLDS[statKey] || LV90_DR_THRESHOLDS.crit;
  const val = Number(statRating) || 0;
  const isEs = (typeof currentLang === 'undefined' || currentLang === 'es' || currentLang === 'mx');
  if (val < cfg.t10) {
    const tip = isEs
      ? `Sin penalización DR (0 - ${cfg.t10} rating / 0-30%) — Clic para ver tabla de DR`
      : `No DR penalty (0 - ${cfg.t10} rating / 0-30%) — Click to view DR table`;
    return `<button type="button" onclick="openDRGuideModal('${statKey}', ${val})" class="text-[9px] text-emerald-400 font-mono font-bold hover:underline cursor-pointer" title="${tip}">DR 0% ✓</button>`;
  } else if (val < cfg.t20) {
    const tip = isEs
      ? `Penalización 10% DR (${cfg.t10} - ${cfg.t20} rating / 30-39%) — Clic para ver tabla de DR`
      : `10% DR Penalty (${cfg.t10} - ${cfg.t20} rating / 30-39%) — Click to view DR table`;
    return `<button type="button" onclick="openDRGuideModal('${statKey}', ${val})" class="text-[9px] text-amber-300 font-mono font-bold hover:underline cursor-pointer bg-amber-950/40 px-1 rounded border border-amber-500/30" title="${tip}">DR -10% ⚠️</button>`;
  } else if (val < cfg.t30) {
    const tip = isEs
      ? `Penalización 20% DR (${cfg.t20} - ${cfg.t30} rating / 39-47%) — Clic para ver tabla de DR`
      : `20% DR Penalty (${cfg.t20} - ${cfg.t30} rating / 39-47%) — Click to view DR table`;
    return `<button type="button" onclick="openDRGuideModal('${statKey}', ${val})" class="text-[9px] text-orange-400 font-mono font-bold hover:underline cursor-pointer bg-orange-950/40 px-1 rounded border border-orange-500/30" title="${tip}">DR -20% ⚠️</button>`;
  } else if (val < cfg.t40) {
    const tip = isEs
      ? `Penalización 30% DR (${cfg.t30} - ${cfg.t40} rating / 47-54%) — Clic para ver tabla de DR`
      : `30% DR Penalty (${cfg.t30} - ${cfg.t40} rating / 47-54%) — Click to view DR table`;
    return `<button type="button" onclick="openDRGuideModal('${statKey}', ${val})" class="text-[9px] text-red-400 font-mono font-bold hover:underline cursor-pointer bg-red-950/40 px-1 rounded border border-red-500/30 animate-pulse" title="${tip}">DR -30% 🛑</button>`;
  } else if (val < cfg.t50) {
    const tip = isEs
      ? `Penalización 40% DR (${cfg.t40} - ${cfg.t50} rating / 54-66%) — Clic para ver tabla de DR`
      : `40% DR Penalty (${cfg.t40} - ${cfg.t50} rating / 54-66%) — Click to view DR table`;
    return `<button type="button" onclick="openDRGuideModal('${statKey}', ${val})" class="text-[9px] text-red-400 font-mono font-bold hover:underline cursor-pointer bg-red-950/40 px-1 rounded border border-red-500/30 animate-pulse" title="${tip}">DR -40% 🛑</button>`;
  } else if (val <= cfg.cap) {
    const tip = isEs
      ? `Penalización 50% DR (${cfg.t50} - ${cfg.cap} rating / 66-126%) — Clic para ver tabla de DR`
      : `50% DR Penalty (${cfg.t50} - ${cfg.cap} rating / 66-126%) — Click to view DR table`;
    return `<button type="button" onclick="openDRGuideModal('${statKey}', ${val})" class="text-[9px] text-red-400 font-mono font-bold hover:underline cursor-pointer bg-red-950/40 px-1 rounded border border-red-500/30 animate-pulse" title="${tip}">DR -50% 🛑</button>`;
  } else {
    const tip = isEs
      ? `Límite máximo DR (>${cfg.cap} rating / >126%) — Clic para ver tabla de DR`
      : `Hard Cap DR (>${cfg.cap} rating / >126%) — Click to view DR table`;
    return `<button type="button" onclick="openDRGuideModal('${statKey}', ${val})" class="text-[9px] text-red-400 font-mono font-bold hover:underline cursor-pointer bg-red-950/40 px-1 rounded border border-red-500/30 animate-pulse" title="${tip}">DR -100% 🛑</button>`;
  }
}

function resolveWowheadSpecData(className, specId) {
  const whData = window.WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES || {};
  const classData = whData[className] || whData['paladin'] || whData['hunter'] || {};
  if (!classData) return null;
  if (classData[specId]) return classData[specId];
  const aliasMap = {
    'protection': className === 'paladin' ? 'protection_paladin' : (className === 'warrior' ? 'protection_warrior' : 'protection'),
    'holy': className === 'paladin' ? 'holy_paladin' : (className === 'priest' ? 'holy_priest' : 'holy'),
    'frost': className === 'deathknight' ? 'frost_dk' : (className === 'mage' ? 'frost_mage' : 'frost'),
    'restoration': className === 'druid' ? 'restoration_druid' : (className === 'shaman' ? 'restoration_shaman' : 'restoration'),
    'beast_mastery': 'beastmastery',
    'beastmastery': 'beastmastery'
  };
  const alias = aliasMap[specId];
  if (alias && classData[alias]) return classData[alias];
  const foundKey = Object.keys(classData).find(k => k === specId || k.startsWith(specId + '_') || k.endsWith('_' + specId));
  if (foundKey && classData[foundKey]) return classData[foundKey];
  return classData[Object.keys(classData)[0]] || null;
}

function renderSpecEnchantsAndConsumablesHtml(className, specId) {
  const specData = resolveWowheadSpecData(className, specId);
  if (!specData || !specData.enchants) return '';

  return `
    <!-- ENCHANTMENTS & CONSUMABLES (MIDNIGHT S2) -->
    <div class="bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-emerald-950/40 border border-blue-500/40 rounded-xl p-4 space-y-4 shadow-lg">
      
      <!-- Encantamientos BiS -->
      <div class="space-y-2.5">
        <div class="flex items-center justify-between border-b border-blue-500/30 pb-2">
          <h4 class="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-wand-magic-sparkles text-blue-400"></i> ${t('bisEnchantsTitle', 'Encantamientos BiS Recomendados:')}
          </h4>
          <span class="text-[11px] text-slate-400">${t('currentSeason', 'Temporada Actual')}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          ${specData.enchants.map(e => {
            const locSlot = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(e.slot) : e.slot;
            const encUrl = getWowheadEntityUrl(e.id, e.slot, e.name, e.entityKind);
            const encAttr = getWowheadEntityDataAttr(e.id, e.slot, e.name, e.entityKind);
            return `
            <div class="bg-black/60 border border-blue-500/30 hover:border-blue-400/60 rounded-lg p-2.5 flex items-start gap-2.5 shadow-sm transition">
              <a href="${encUrl}" target="_blank" ${encAttr} class="flex-shrink-0">
                <img src="https://wow.zamimg.com/images/wow/icons/large/${e.icon || 'inv_scroll_05'}.jpg" referrerpolicy="no-referrer" loading="lazy" class="w-8 h-8 rounded border border-blue-400/60 object-cover shadow" onerror="this.src='https://wow.zamimg.com/images/wow/icons/large/inv_scroll_05.jpg'">
              </a>
              <div class="min-w-0 flex-1">
                <div class="text-[10px] font-bold text-blue-300 uppercase tracking-tight truncate">${locSlot}</div>
                <a href="${encUrl}" target="_blank" data-item-id="${e.id}" ${encAttr} class="spec-auto-translate text-xs font-bold text-purple-300 hover:text-purple-200 mt-0.5 block truncate">${e.name}</a>
                <div class="text-[10px] text-slate-400 font-medium truncate">${e.desc || e.name}</div>
              </div>
            </div>
          `; }).join('')}
        </div>
      </div>

      <!-- Consumibles BiS -->
      <div class="space-y-2.5 pt-2 border-t border-purple-500/20">
        <div class="flex items-center justify-between border-b border-emerald-500/30 pb-2">
          <h4 class="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-flask text-emerald-400"></i> ${t('bisConsumablesTitle', 'Consumibles BiS Óptimos:')}
          </h4>
          <span class="text-[11px] text-slate-400">${t('consumablesSubtitle', 'Frascos, Pociones, Aceites y Festines')}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          ${specData.consumables.map(c => {
            const fallbackIcon = c.type === 'Food' ? 'inv_misc_food_15' : (c.type === 'Rune' ? 'inv_misc_rune_11' : (c.type === 'Flask' ? 'trade_alchemy_potiona1' : 'inv_potion_108'));
            const locType = typeof getLocalizedConsumableType === 'function' ? getLocalizedConsumableType(c.type) : c.type;
            const conUrl = getWowheadEntityUrl(c.id, c.type, c.name, c.entityKind);
            const conAttr = getWowheadEntityDataAttr(c.id, c.type, c.name, c.entityKind);
            return `
            <div class="bg-black/60 border border-emerald-500/30 hover:border-emerald-400/60 rounded-lg p-2.5 flex flex-col justify-between gap-1.5 shadow-sm transition">
              <div class="flex items-center gap-2">
                <a href="${conUrl}" ${conAttr} target="_blank" class="flex-shrink-0">
                  <img src="https://wow.zamimg.com/images/wow/icons/large/${c.icon || fallbackIcon}.jpg" referrerpolicy="no-referrer" loading="lazy" class="w-8 h-8 rounded border border-emerald-400/60 object-cover shadow" onerror="this.src='https://wow.zamimg.com/images/wow/icons/large/${fallbackIcon}.jpg'">
                </a>
                <div class="min-w-0 flex-1">
                  <div class="text-[9px] font-bold text-emerald-400 uppercase tracking-tight truncate">${locType}</div>
                  <a href="${conUrl}" target="_blank" data-item-id="${c.id}" ${conAttr} class="spec-auto-translate text-[11px] font-bold text-slate-200 hover:text-emerald-300 block truncate">${c.name}</a>
                </div>
              </div>
              <div class="text-[9px] text-slate-400 truncate">${c.desc || c.name}</div>
            </div>
          `; }).join('')}
        </div>
      </div>

    </div>
  `;
}

function renderResults(topResults, targets, benchmark = { count: 0, duration: 0 }) {
  currentOptimizationResults = topResults || [];
  if (typeof window !== 'undefined') {
    window.currentOptimizationResults = currentOptimizationResults;
  }
  const simMaxIlvl = document.getElementById('toggle-max-ilvl')?.checked ?? false;
  const simVenomstone = document.getElementById('toggle-venomstone')?.checked ?? false;
  const container = document.getElementById('results-container');
  if (!topResults || topResults.length === 0) {
    if (container) {
      container.innerHTML = `
        <div class="bg-wow-panel border border-red-500/40 rounded-xl p-8 text-center">
          <i class="fa-solid fa-triangle-exclamation text-3xl text-red-400 mb-2"></i>
          <h3 class="text-lg font-bold text-white">${t('noCombosFound', 'No valid combinations found')}</h3>
          <p class="text-xs text-slate-400 mt-1">${t('noCombosHint', 'Try enabling more upgrade tracks (Mythic/Hero/Champion/Veteran), unchecking Require Tier Set, or unlocking restricted items.')}</p>
        </div>
      `;
    }
    return;
  }

  if (container) {
    container.innerHTML = topResults.map((res, idx) => {
      const isBest = idx === 0;
      const gemData = res.gemData || { recommendations: [], projected: res };
      const totalSecondaries = (res.totMast + res.totCrit + res.totHaste + res.totVers) || 1;
      const mastPct = Math.round((res.totMast / totalSecondaries) * 100);
      const critPct = Math.round((res.totCrit / totalSecondaries) * 100);
      const hastePct = Math.round((res.totHaste / totalSecondaries) * 100);
      const versPct = Math.max(0, 100 - (mastPct + critPct + hastePct));

      let totalMetaPctSum = 0;
      let activeTargetCount = 0;
      const statTargets = [
        { val: gemData.projected.totMast, target: targets.targetMastery },
        { val: gemData.projected.totCrit, target: targets.targetCrit },
        { val: gemData.projected.totHaste, target: targets.targetHaste },
        { val: gemData.projected.totVers, target: targets.targetVers }
      ];
      statTargets.forEach(st => {
        if (st.target > 0) {
          const accuracy = st.val >= st.target 
            ? 100 
            : Math.max(0, Math.round((st.val / st.target) * 100));
          totalMetaPctSum += accuracy;
          activeTargetCount++;
        }
      });
      const avgMetaSuccessPct = activeTargetCount > 0 ? Math.round(totalMetaPctSum / activeTargetCount) : 100;
      res.avgMetaSuccessPct = avgMetaSuccessPct;
      
      return `
        <div class="bg-wow-panel border ${isBest ? 'border-amber-400/80 ring-1 ring-amber-400/40' : 'border-wow-border'} rounded-xl p-5 shadow-xl space-y-4">
          
          <!-- Result Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-wow-border pb-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="w-7 h-7 rounded-full ${isBest ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300'} font-black text-sm flex items-center justify-center shadow">
                #${idx + 1}
              </span>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                ${isBest ? t('bestComboFound', '🏆 Best Combination Found') : `${t('altCombo', 'Alternative')} #${idx + 1}`}
              </h3>
              <span class="text-xs px-2.5 py-0.5 rounded-md ${res.tierCount >= 4 ? 'bg-purple-950 text-purple-300 border border-purple-500/60 font-bold' : res.tierCount >= 2 ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/60 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-700/60 font-medium'} flex items-center gap-1 shadow-sm">
                <i class="fa-solid fa-layer-group text-[10px] ${res.tierCount >= 4 ? 'text-purple-400' : res.tierCount >= 2 ? 'text-indigo-400' : 'text-slate-500'}"></i>
                <span>${(res.tierCount >= 4 ? t('tierBadge4p', 'Tier: 4/5 (4P Bonus)') : res.tierCount >= 2 ? t('tierBadge2p', 'Tier: 2/5 (2P Bonus)') : t('tierBadge0p', 'Tier: 0/5 (No Tier)')).replace(/\d+\/5/, `${res.tierCount}/5`)}</span>
              </span>
              <span class="text-xs px-2.5 py-0.5 rounded-md ${avgMetaSuccessPct >= 90 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold' : avgMetaSuccessPct >= 80 ? 'bg-blue-950 text-blue-300 border border-blue-500/60 font-bold' : avgMetaSuccessPct >= 70 ? 'bg-amber-950 text-amber-300 border border-amber-500/60 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-700/60 font-medium'} flex items-center gap-1 shadow-sm" title="Average accuracy and stat compliance with gems">
                <i class="fa-solid fa-bullseye text-[10px] ${avgMetaSuccessPct >= 90 ? 'text-emerald-400' : 'text-amber-400'}"></i>
                <span>${t('metaBadge', 'Meta')}: ${avgMetaSuccessPct}%</span>
              </span>
              ${simVenomstone ? `
                <span class="text-xs px-2.5 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 font-bold flex items-center gap-1 shadow-sm" title="Ascendant Venomstones applied to eligible slots (Weapons, Trinkets, Neck: Hero 321→328 (+7), Myth 334→341 (+7), Crafted Hero 318→325 (+7), Crafted Myth 331→337 (+6)).">
                  <i class="fa-solid fa-flask-vial text-emerald-400 text-[10px]"></i>
                  <span>Venomstones</span>
                </span>
              ` : simMaxIlvl ? `
                <span class="text-xs px-2.5 py-0.5 rounded-md bg-amber-950/90 text-amber-300 border border-amber-500/60 font-bold flex items-center gap-1 shadow-sm" title="Simulating all items at max rank for track (Mythic 6/6: 334, Heroic 6/6: 321, Champion 6/6: 309, Veteran 6/6: 296)">
                  <i class="fa-solid fa-angles-up text-amber-400 text-[10px]"></i>
                  <span>Max ilvl Sim</span>
                </span>
              ` : ''}
            </div>
            
            <div class="flex items-center gap-2 flex-wrap">
              ${benchmark.count > 0 ? `
                <span class="text-[10px] bg-slate-900/90 text-amber-300/90 border border-slate-700 px-2 py-1 rounded font-mono flex items-center gap-1 shadow-sm">
                  <i class="fa-solid fa-bolt text-amber-400"></i> ${benchmark.count.toLocaleString()} combs (${benchmark.duration}ms)
                </span>
              ` : ''}
              <span class="text-xs text-amber-300 font-semibold flex items-center gap-1 bg-amber-950/30 border border-amber-500/30 px-2 py-1 rounded">
                <i class="fa-solid fa-gem text-amber-400"></i> ${gemData.recommendations.length} ${t('socketsBadge', 'Sockets')}
              </span>
              <button onclick="copyDiscordSummary(${idx})" class="text-xs bg-indigo-950/70 hover:bg-indigo-800 text-indigo-300 border border-indigo-500/50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition shadow-sm" title="Copy Discord / Text summary">
                <i class="fa-brands fa-discord"></i> Discord
              </button>
              <button onclick="exportResultToSimC(${idx})" class="text-xs bg-emerald-950/70 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition shadow-sm">
                <i class="fa-solid fa-file-export"></i> ${t('exportSimC', 'Export SimC')}
              </button>
            </div>
          </div>

          <!-- Stats Bar Comparison: BASE STATS -->
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              ${t('pureBaseStats', 'PURE BASE STATS (EXCLUDING GEMS):')}
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="bg-black/50 p-3 rounded-lg border border-purple-500/30 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-purple-400 uppercase">${t('statMastery', 'Mastery')}</span>
                    <div class="flex items-center gap-1">
                      ${Math.abs(res.diffMast) <= 25 ? '<span class="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/60 px-1 rounded font-bold">Meta ✓</span>' : ''}
                      ${getDRBadge(res.totMast, 'mastery')}
                    </div>
                  </div>
                  <div class="text-xl font-black text-white mt-1">${res.totMast}</div>
                </div>
                <div>
                  <div class="text-xs ${res.diffMast >= 0 ? 'text-emerald-400' : 'text-amber-400'} mt-1 flex items-center justify-between">
                    <span>${res.diffMast >= 0 ? '+' : ''}${res.diffMast} ${t('vsMeta', 'vs target')}</span>
                    <span class="text-[10px] text-slate-400 font-mono">${targets.targetMastery > 0 ? Math.round((res.totMast / targets.targetMastery) * 100) + '%' : '-'}</span>
                  </div>
                  ${targets.targetMastery > 0 ? `
                    <div class="w-full bg-black/80 rounded-full h-1.5 mt-1 overflow-hidden border border-white/10">
                      <div style="width: ${Math.min(100, Math.round((res.totMast / targets.targetMastery) * 100))}%" class="${Math.abs(res.diffMast) <= 25 ? 'bg-emerald-400' : 'bg-purple-500'} h-full transition-all"></div>
                    </div>
                  ` : ''}
                </div>
              </div>

              <div class="bg-black/50 p-3 rounded-lg border border-blue-500/30 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-blue-400 uppercase">${t('statCrit', 'Crit')}</span>
                    <div class="flex items-center gap-1">
                      ${Math.abs(res.diffCrit) <= 25 ? '<span class="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/60 px-1 rounded font-bold">Meta ✓</span>' : ''}
                      ${getDRBadge(res.totCrit, 'crit')}
                    </div>
                  </div>
                  <div class="text-xl font-black text-white mt-1">${res.totCrit}</div>
                </div>
                <div>
                  <div class="text-xs ${res.diffCrit >= 0 ? 'text-emerald-400' : 'text-amber-400'} mt-1 flex items-center justify-between">
                    <span>${res.diffCrit >= 0 ? '+' : ''}${res.diffCrit} ${t('vsMeta', 'vs target')}</span>
                    <span class="text-[10px] text-slate-400 font-mono">${targets.targetCrit > 0 ? Math.round((res.totCrit / targets.targetCrit) * 100) + '%' : '-'}</span>
                  </div>
                  ${targets.targetCrit > 0 ? `
                    <div class="w-full bg-black/80 rounded-full h-1.5 mt-1 overflow-hidden border border-white/10">
                      <div style="width: ${Math.min(100, Math.round((res.totCrit / targets.targetCrit) * 100))}%" class="${Math.abs(res.diffCrit) <= 25 ? 'bg-emerald-400' : 'bg-blue-500'} h-full transition-all"></div>
                    </div>
                  ` : ''}
                </div>
              </div>

              <div class="bg-black/50 p-3 rounded-lg border border-slate-500/30 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-slate-300 uppercase">${t('statHaste', 'Haste')}</span>
                    <div class="flex items-center gap-1">
                      ${Math.abs(res.diffHaste) <= 25 ? '<span class="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/60 px-1 rounded font-bold">Meta ✓</span>' : ''}
                      ${getDRBadge(res.totHaste, 'haste')}
                    </div>
                  </div>
                  <div class="text-xl font-black text-white mt-1">${res.totHaste}</div>
                </div>
                <div>
                  <div class="text-xs ${res.diffHaste >= 0 ? 'text-emerald-400' : 'text-amber-400'} mt-1 flex items-center justify-between">
                    <span>${res.diffHaste >= 0 ? '+' : ''}${res.diffHaste} ${t('vsMeta', 'vs target')}</span>
                    <span class="text-[10px] text-slate-400 font-mono">${targets.targetHaste > 0 ? Math.round((res.totHaste / targets.targetHaste) * 100) + '%' : '-'}</span>
                  </div>
                  ${targets.targetHaste > 0 ? `
                    <div class="w-full bg-black/80 rounded-full h-1.5 mt-1 overflow-hidden border border-white/10">
                      <div style="width: ${Math.min(100, Math.round((res.totHaste / targets.targetHaste) * 100))}%" class="${Math.abs(res.diffHaste) <= 25 ? 'bg-emerald-400' : 'bg-slate-400'} h-full transition-all"></div>
                    </div>
                  ` : ''}
                </div>
              </div>

              <div class="bg-black/50 p-3 rounded-lg border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-emerald-400 uppercase">${t('statVers', 'Versatility')}</span>
                    <div class="flex items-center gap-1">
                      ${Math.abs(res.diffVers) <= 25 ? '<span class="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/60 px-1 rounded font-bold">Meta ✓</span>' : ''}
                      ${getDRBadge(res.totVers, 'vers')}
                    </div>
                  </div>
                  <div class="text-xl font-black text-white mt-1">${res.totVers}</div>
                </div>
                <div>
                  <div class="text-xs ${res.diffVers >= 0 ? 'text-emerald-400' : 'text-amber-400'} mt-1 flex items-center justify-between">
                    <span>${res.diffVers >= 0 ? '+' : ''}${res.diffVers} ${t('vsMeta', 'vs target')}</span>
                    <span class="text-[10px] text-slate-400 font-mono">${targets.targetVers > 0 ? Math.round((res.totVers / targets.targetVers) * 100) + '%' : '-'}</span>
                  </div>
                  ${targets.targetVers > 0 ? `
                    <div class="w-full bg-black/80 rounded-full h-1.5 mt-1 overflow-hidden border border-white/10">
                      <div style="width: ${Math.min(100, Math.round((res.totVers / targets.targetVers) * 100))}%" class="${Math.abs(res.diffVers) <= 25 ? 'bg-emerald-400' : 'bg-emerald-500'} h-full transition-all"></div>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>

            ${gemData.recommendations.length > 0 ? (() => {
              const pDiffMast = (gemData.projected.totMast || 0) - (targets?.targetMastery || 0);
              const pDiffCrit = (gemData.projected.totCrit || 0) - (targets?.targetCrit || 0);
              const pDiffHaste = (gemData.projected.totHaste || 0) - (targets?.targetHaste || 0);
              const pDiffVers = (gemData.projected.totVers || 0) - (targets?.targetVers || 0);
              return `
              <!-- PROJECTED STATS WITH GEMS -->
              <div class="mt-3 bg-purple-950/30 rounded-lg p-2.5 flex items-center justify-around text-xs border border-purple-500/40 shadow-inner flex-wrap gap-2">
                <span class="text-slate-300 font-bold flex items-center gap-1.5"><i class="fa-solid fa-gem text-amber-400"></i> ${t('withGems', 'With Gems:')}</span>
                <span class="text-purple-400 font-bold">${t('statMastery', 'Mastery')}: <span class="text-white">${gemData.projected.totMast}</span> <span class="text-[10px] font-mono ${pDiffMast >= 0 ? 'text-emerald-400' : 'text-amber-400'}">(${pDiffMast >= 0 ? '+' : ''}${pDiffMast} ${t('vsMeta', 'vs target')})</span></span>
                <span class="text-blue-400 font-bold">${t('statCrit', 'Crit')}: <span class="text-white">${gemData.projected.totCrit}</span> <span class="text-[10px] font-mono ${pDiffCrit >= 0 ? 'text-emerald-400' : 'text-amber-400'}">(${pDiffCrit >= 0 ? '+' : ''}${pDiffCrit} ${t('vsMeta', 'vs target')})</span></span>
                <span class="text-slate-300 font-bold">${t('statHaste', 'Haste')}: <span class="text-white">${gemData.projected.totHaste}</span> <span class="text-[10px] font-mono ${pDiffHaste >= 0 ? 'text-emerald-400' : 'text-amber-400'}">(${pDiffHaste >= 0 ? '+' : ''}${pDiffHaste} ${t('vsMeta', 'vs target')})</span></span>
                <span class="text-emerald-400 font-bold">${t('statVers', 'Vers')}: <span class="text-white">${gemData.projected.totVers}</span> <span class="text-[10px] font-mono ${pDiffVers >= 0 ? 'text-emerald-400' : 'text-amber-400'}">(${pDiffVers >= 0 ? '+' : ''}${pDiffVers} ${t('vsMeta', 'vs target')})</span></span>
              </div>
            `; })() : ''}

            <!-- Secondary Stat Distribution Progress Bar -->
            <div class="mt-3 bg-black/40 p-2.5 rounded-lg border border-wow-border/50">
              <div class="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>${t('secStatDistribution', 'Secondary Stat Distribution:')}</span>
                <div class="flex items-center gap-3 text-[10px]">
                  <span class="text-purple-300"><i class="fa-solid fa-square text-purple-400 mr-1"></i>Mast ${mastPct}%</span>
                  <span class="text-blue-300"><i class="fa-solid fa-square text-blue-400 mr-1"></i>Crit ${critPct}%</span>
                  <span class="text-slate-300"><i class="fa-solid fa-square text-slate-400 mr-1"></i>Haste ${hastePct}%</span>
                  <span class="text-emerald-300"><i class="fa-solid fa-square text-emerald-400 mr-1"></i>Vers ${versPct}%</span>
                </div>
              </div>
              <div class="w-full h-2.5 bg-black rounded-full overflow-hidden flex border border-white/10">
                <div style="width: ${mastPct}%" class="bg-purple-500 h-full" title="Mastery ${mastPct}%"></div>
                <div style="width: ${critPct}%" class="bg-blue-500 h-full" title="Critical Strike ${critPct}%"></div>
                <div style="width: ${hastePct}%" class="bg-slate-400 h-full" title="Haste ${hastePct}%"></div>
                <div style="width: ${versPct}%" class="bg-emerald-500 h-full" title="Versatility ${versPct}%"></div>
              </div>
            </div>
          </div>

          <!-- Gear Grid with Wowhead Links -->
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">${t('itemsInSet', 'Items composing this set:')}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              ${res.items.map(it => `
                <div class="bg-wow-input border border-wow-border/80 rounded-lg p-2 flex items-center gap-2.5">
                  <a href="${getWowheadBaseUrl()}/item=${it.itemId || 0}" target="_blank" ${getItemWowheadAttr(it)} class="flex-shrink-0">
                    <img src="${getWowheadIconUrl(it.icon, it.slot, it.itemId)}" data-item-id="${it.itemId || ''}" alt="${it.name}" referrerpolicy="no-referrer" loading="lazy" onerror="handleImageError(this, '${it.slot}')" class="w-8 h-8 rounded border border-purple-500/40 object-cover">
                  </a>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-1">
                      <a href="${getWowheadBaseUrl()}/item=${it.itemId || 0}" target="_blank" ${getItemWowheadAttr(it)} class="text-xs font-bold ${it.isMissing ? 'text-slate-400 italic' : 'text-purple-300 hover:text-purple-200'} truncate block">${it.isMissing ? `${t('noItemInSlot', 'Sin')} ${typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(it.slot) : it.slot}` : it.name}</a>
                      <span class="text-amber-300 font-bold text-[10px] flex-shrink-0">${it.ilvl !== undefined ? it.ilvl : '-'}${it.isVenomstoneScaled ? ' <span class="text-[9px] text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-1 py-0.2 rounded font-mono font-bold" title="Ascendant Venomstone applied (' + (it.originalIlvl || it.baseIlvl) + ' → ' + it.ilvl + ')">🧪+VENOM</span>' : it.isMaxScaled ? ' <span class="text-[9px] text-emerald-400 font-mono font-bold" title="Simulated at max ilvl (' + (it.originalIlvl || it.baseIlvl) + ' → ' + it.ilvl + ')">▲MAX</span>' : ''}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                      <span class="capitalize truncate">${typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(it.slot) : it.slot.replace('_', ' ')} ${it.isVault ? `<span class="text-yellow-300 font-bold ml-0.5 bg-yellow-950/80 border border-yellow-500/50 px-1 py-0.2 rounded text-[8px] shadow-sm"><i class="fa-solid fa-vault text-[7px] mr-0.5 text-yellow-400"></i>${t('badgeVault', 'Vault')}</span>` : ''} ${(it.socketCount > 1) ? Array(it.socketCount).fill(`<i class="fa-solid fa-gem text-[8px] text-amber-300 ml-0.5" title="${t('badgeSocket', 'Socket')}"></i>`).join('') : (it.socket ? `<i class="fa-solid fa-gem text-[8px] text-amber-300 ml-0.5" title="${t('badgeSocket', 'Socket')}"></i>` : '')} ${it.tier ? `<span class="text-purple-300 font-bold ml-0.5">${t('badgeTier', 'Tier')}</span>` : ''} ${it.slot === 'trinket' ? getTrinketBloodmalletBadge(it) : ''}</span>
                      <div class="flex items-center gap-1 font-mono text-[9px] flex-shrink-0">
                        ${it.mastery ? `<span class="text-purple-300 font-semibold">+${it.mastery}M</span>` : ''}
                        ${it.crit ? `<span class="text-blue-300 font-semibold">+${it.crit}C</span>` : ''}
                        ${it.haste ? `<span class="text-slate-300 font-semibold">+${it.haste}H</span>` : ''}
                        ${it.vers ? `<span class="text-emerald-300 font-semibold">+${it.vers}V</span>` : ''}
                        ${(!it.mastery && !it.crit && !it.haste && !it.vers) ? `<span class="text-slate-500 font-mono text-[9px]">${it.slot === 'trinket' ? '' : '-'}</span>` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- SMART GEM RECOMMENDATION BOX -->
          ${gemData.recommendations.length > 0 ? `
            <div class="bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-indigo-950/40 border border-amber-500/40 rounded-xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <i class="fa-solid fa-gem text-amber-400"></i> ${t('smartGemRecs', 'Smart Gem Recommendations:')}
                </h4>
                <span class="text-[11px] text-purple-300">${t('projectedWithGems', 'Final Projection with Socketed Gems:')}</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                ${gemData.recommendations.map(g => {
                  const slotLabel = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(g.item.slot) : g.item.slot;
                  const rawDesc = g.gemDesc || g.benefit || '';
                  const gemDescLabel = typeof getLocalizedGemDesc === 'function' ? getLocalizedGemDesc(rawDesc) : rawDesc;
                  return `
                  <div class="bg-black/60 border border-amber-500/30 hover:border-amber-400/60 rounded-lg p-2.5 flex items-start gap-2.5 shadow-sm transition">
                    <a href="${getWowheadBaseUrl()}/item=${g.gemItemId}" target="_blank" ${getWowheadItemDataAttr(g.gemItemId)} class="flex-shrink-0">
                      <img src="https://wow.zamimg.com/images/wow/icons/large/${g.gemIcon}.jpg" referrerpolicy="no-referrer" loading="lazy" class="w-8 h-8 rounded border border-amber-400/60 object-cover shadow" onerror="this.src='https://wow.zamimg.com/images/wow/icons/large/inv_jewelcrafting_cut-standart-gem_color5.jpg'">
                    </a>
                    <div class="min-w-0 flex-1">
                      <div class="text-[11px] font-bold text-amber-300 capitalize truncate">${slotLabel}: ${g.item.name}</div>
                      <a href="${getWowheadBaseUrl()}/item=${g.gemItemId}" target="_blank" data-item-id="${g.gemItemId}" ${getWowheadItemDataAttr(g.gemItemId)} class="spec-auto-translate text-xs font-bold text-purple-300 hover:text-purple-200 mt-0.5 block truncate">${g.gemName}</a>
                      <div class="text-[10px] text-slate-300 font-medium truncate">${gemDescLabel}</div>
                    </div>
                  </div>
                `}).join('')}
              </div>
            </div>
          ` : ''}

          <!-- WOWHEAD MIDNIGHT S2 ENCHANTS & CONSUMABLES -->
          ${renderSpecEnchantsAndConsumablesHtml(currentClass, currentSpec)}

        </div>
      `;
    }).join('');
  }

  if (window.$WowheadPower) window.$WowheadPower.refreshLinks();
  setTimeout(() => {
    if (window.$WowheadPower) window.$WowheadPower.refreshLinks();
  }, 50);

  // Auto-traducción oficial multilenguaje (es / mx) de encantamientos, consumibles y gemas en resultados
  const activeLang = typeof currentLang !== 'undefined' ? currentLang : 'en';
  if ((activeLang === 'es' || activeLang === 'mx') && container) {
    const localeCode = activeLang === 'mx' ? 'mx' : 'es';
    const autoTranslateEls = container.querySelectorAll('.spec-auto-translate');
    autoTranslateEls.forEach(async (el) => {
      const itemId = el.getAttribute('data-item-id');
      if (!itemId) return;
      try {
        const res = await fetch(`https://nether.wowhead.com/tooltip/item/${itemId}?locale=${localeCode}`);
        if (res.ok) {
          const itemData = await res.json();
          if (itemData && itemData.name) {
            el.textContent = itemData.name;
          }
        }
      } catch (e) {}
    });
  }

  resolveAllItemIconsAsync();
}

// Toast Notification System
function showToast(message, type = 'success') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  
  const colors = {
    success: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 shadow-emerald-950/50',
    error: 'bg-red-950/90 text-red-300 border border-red-500/60 shadow-red-950/50',
    info: 'bg-purple-950/90 text-purple-300 border border-purple-500/60 shadow-purple-950/50',
    amber: 'bg-amber-950/90 text-amber-300 border border-amber-500/60 shadow-amber-950/50'
  };

  toast.className = `fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold transition-all duration-300 pointer-events-auto ${colors[type] || colors.success}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation text-red-400' : 'fa-circle-check text-emerald-400'} text-base"></i> <span>${message}</span>`;
  
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  if (!toast.dataset) toast.dataset = {};
  clearTimeout(toast.dataset.timeoutId);
  toast.dataset.timeoutId = setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
  }, 3000);
}

function applyResultAsEquipped(resultIndex) {
  const res = (typeof currentOptimizationResults !== 'undefined' ? currentOptimizationResults : window.currentOptimizationResults)?.[resultIndex];
  if (!res || !res.items) return;

  const resultItemIds = new Set(res.items.map(it => it.id));
  items.forEach(it => {
    it.isEquipped = resultItemIds.has(it.id);
  });

  saveState();
  renderInventory();
  showToast(`¡Set #${resultIndex + 1} marcado como tu equipamiento actual!`);
}

function copyDiscordSummary(resultIndex) {
  const res = (typeof currentOptimizationResults !== 'undefined' ? currentOptimizationResults : window.currentOptimizationResults)?.[resultIndex];
  if (!res) return;
  
  const isEs = (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'mx'));
  const className = typeof getLocalizedClassName === 'function' ? getLocalizedClassName(currentClass) : (WOW_CLASSES[currentClass]?.name || currentClass);
  const specName = typeof getLocalizedSpecName === 'function' ? getLocalizedSpecName(currentSpec) : currentSpec.toUpperCase();
  
  const lines = [];
  lines.push(`⚔️ **WoWTopGear — ${className} (${specName.toUpperCase()})** ⚔️`);
  lines.push(`🏆 **${isEs ? 'Set Óptimo' : 'Optimal Setup'} #${resultIndex + 1}** (Tier: ${res.tierCount}/5 | ${isEs ? 'Ranuras' : 'Sockets'}: ${res.gemData?.recommendations?.length || 0})`);
  lines.push(`\n📊 **${isEs ? 'Estadísticas Base Puras' : 'Pure Base Stats'}**:`);
  lines.push(`• **${isEs ? 'Maestría' : 'Mastery'}**: ${res.totMast} (${res.diffMast >= 0 ? '+' : ''}${res.diffMast} ${isEs ? 'vs meta' : 'vs target'})`);
  lines.push(`• **${isEs ? 'Crítico' : 'Crit'}**: ${res.totCrit} (${res.diffCrit >= 0 ? '+' : ''}${res.diffCrit} ${isEs ? 'vs meta' : 'vs target'})`);
  lines.push(`• **${isEs ? 'Celeridad' : 'Haste'}**: ${res.totHaste} (${res.diffHaste >= 0 ? '+' : ''}${res.diffHaste} ${isEs ? 'vs meta' : 'vs target'})`);
  lines.push(`• **${isEs ? 'Versatilidad' : 'Versatility'}**: ${res.totVers} (${res.diffVers >= 0 ? '+' : ''}${res.diffVers} ${isEs ? 'vs meta' : 'vs target'})`);

  lines.push(`\n🛡️ **${isEs ? 'Equipo Seleccionado' : 'Selected Gear'}**:`);
  res.items.forEach(it => {
    const slotLabel = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(it.slot).toUpperCase() : it.slot.toUpperCase();
    const itemName = it.isMissing ? `${isEs ? 'Sin' : 'No'} ${typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(it.slot) : it.slot}` : it.name;
    const ilvlLabel = it.ilvl !== undefined ? it.ilvl : '-';
    lines.push(`• **${slotLabel}**: ${itemName} (ilvl ${ilvlLabel})`);
  });

  if (res.gemData?.recommendations?.length > 0) {
    const targetMastery = parseInt(document.getElementById('target-mastery')?.value) || 0;
    const targetCrit = parseInt(document.getElementById('target-crit')?.value) || 0;
    const targetHaste = parseInt(document.getElementById('target-haste')?.value) || 0;
    const targetVers = parseInt(document.getElementById('target-vers')?.value) || 0;

    const pDiffMast = (res.gemData.projected.totMast || 0) - targetMastery;
    const pDiffCrit = (res.gemData.projected.totCrit || 0) - targetCrit;
    const pDiffHaste = (res.gemData.projected.totHaste || 0) - targetHaste;
    const pDiffVers = (res.gemData.projected.totVers || 0) - targetVers;

    lines.push(`\n💎 **${isEs ? 'Gemas Sugeridas' : 'Suggested Gems'}**:`);
    res.gemData.recommendations.forEach(g => {
      const slotLabel = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(g.item.slot).toUpperCase() : g.item.slot.toUpperCase();
      lines.push(`• *${slotLabel}* (${g.item.name}): ${g.gemName}`);
    });
    lines.push(`\n✨ **${isEs ? 'ESTADÍSTICAS TOTALES PROYECTADAS (CON GEMAS)' : 'PROJECTED FINAL STATS (WITH GEMS)'}** ✨`);
    lines.push(`> 🔮 **${isEs ? 'Maestría' : 'Mastery'}**: **${res.gemData.projected.totMast}** (${pDiffMast >= 0 ? '+' : ''}${pDiffMast} ${isEs ? 'vs meta' : 'vs target'})`);
    lines.push(`> 🎯 **${isEs ? 'Crítico' : 'Crit'}**: **${res.gemData.projected.totCrit}** (${pDiffCrit >= 0 ? '+' : ''}${pDiffCrit} ${isEs ? 'vs meta' : 'vs target'})`);
    lines.push(`> ⚡ **${isEs ? 'Celeridad' : 'Haste'}**: **${res.gemData.projected.totHaste}** (${pDiffHaste >= 0 ? '+' : ''}${pDiffHaste} ${isEs ? 'vs meta' : 'vs target'})`);
    lines.push(`> 🛡️ **${isEs ? 'Versatilidad' : 'Versatility'}**: **${res.gemData.projected.totVers}** (${pDiffVers >= 0 ? '+' : ''}${pDiffVers} ${isEs ? 'vs meta' : 'vs target'})`);
  }

  navigator.clipboard.writeText(lines.join('\n')).then(() => {
    showToast(typeof t === 'function' ? t('discordCopiedToast', '¡Resumen para Discord copiado al portapapeles!') : '¡Resumen copiado!', 'info');
  }).catch(() => {
    showToast(typeof t === 'function' ? t('discordErrorToast', 'Error al copiar resumen') : 'Error', 'error');
  });
}

function closeDRGuideModal() {
  const modal = document.getElementById('dr-guide-modal');
  if (modal) modal.classList.add('hidden');
}

function openDRGuideModal(highlightStat = null, highlightVal = null) {
  let modal = document.getElementById('dr-guide-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dr-guide-modal';
    modal.className = 'fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 hidden';
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeDRGuideModal();
    });
    document.body.appendChild(modal);
  }

  const isEs = (typeof currentLang === 'undefined' || currentLang === 'es' || currentLang === 'mx');
  const val = highlightVal !== null && highlightVal !== undefined ? Number(highlightVal) : null;

  const statMeta = {
    haste: {
      label: isEs ? 'Celeridad (Haste)' : 'Haste',
      short: isEs ? 'Celeridad' : 'Haste',
      color: 'text-slate-200',
      border: 'border-slate-500/40',
      bg: 'bg-slate-900/60',
      unit: isEs ? '44 rating = 1%' : '44 rating = 1%',
      cfg: LV90_DR_THRESHOLDS.haste
    },
    crit: {
      label: isEs ? 'Crítico (Crit)' : 'Critical Strike',
      short: isEs ? 'Crítico' : 'Crit',
      color: 'text-blue-400',
      border: 'border-blue-500/40',
      bg: 'bg-blue-950/30',
      unit: isEs ? '46 rating = 1%' : '46 rating = 1%',
      cfg: LV90_DR_THRESHOLDS.crit
    },
    mastery: {
      label: isEs ? 'Maestría (Mastery)' : 'Mastery',
      short: isEs ? 'Maestría' : 'Mastery',
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      bg: 'bg-purple-950/30',
      unit: isEs ? '46 rating = 1 pto base' : '46 rating = 1 base pt',
      cfg: LV90_DR_THRESHOLDS.mastery
    },
    vers: {
      label: isEs ? 'Versatilidad (Vers)' : 'Versatility',
      short: isEs ? 'Versatilidad' : 'Versatility',
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/30',
      unit: isEs ? '54 rating = 1%' : '54 rating = 1%',
      cfg: LV90_DR_THRESHOLDS.vers
    }
  };

  function getBracketIndex(v, cfg) {
    if (v === null || isNaN(v)) return -1;
    if (v < cfg.t10) return 0;
    if (v < cfg.t20) return 1;
    if (v < cfg.t30) return 2;
    if (v < cfg.t40) return 3;
    if (v < cfg.t50) return 4;
    if (v <= cfg.cap) return 5;
    return 6;
  }

  let currentStatBannerHtml = '';
  if (highlightStat && statMeta[highlightStat] && val !== null) {
    const sm = statMeta[highlightStat];
    const bIdx = getBracketIndex(val, sm.cfg);
    const rawPct = (val / sm.cfg.base).toFixed(1);
    const bracketNames = isEs
      ? ['0% Penalización (Sin DR ✓)', '-10% Penalización DR ⚠️', '-20% Penalización DR ⚠️', '-30% Penalización DR 🛑', '-40% Penalización DR 🛑', '-50% Penalización DR 🛑', '-100% Límite (Cap) 🛑']
      : ['0% Penalty (No DR ✓)', '-10% DR Penalty ⚠️', '-20% DR Penalty ⚠️', '-30% DR Penalty 🛑', '-40% DR Penalty 🛑', '-50% DR Penalty 🛑', '-100% Hard Cap 🛑'];
    const badgeClasses = [
      'bg-emerald-950/60 border-emerald-500/50 text-emerald-300',
      'bg-amber-950/60 border-amber-500/50 text-amber-300',
      'bg-orange-950/60 border-orange-500/50 text-orange-300',
      'bg-red-950/60 border-red-500/50 text-red-300',
      'bg-red-950/60 border-red-500/50 text-red-300',
      'bg-red-950/60 border-red-500/50 text-red-300',
      'bg-red-950/60 border-red-500/50 text-red-300'
    ];
    currentStatBannerHtml = `
      <div class="rounded-xl border ${badgeClasses[bIdx]} p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <i class="fa-solid fa-gauge-high text-base"></i>
          <div>
            <div class="text-xs font-black uppercase tracking-wide">
              ${isEs ? 'Tu Estadística Seleccionada:' : 'Your Selected Stat:'} <span class="text-white">${sm.label}</span>
            </div>
            <div class="text-[11px] text-slate-300 mt-0.5">
              ${isEs ? 'Puntos actuales:' : 'Current rating:'} <span class="font-mono font-bold text-white">${val.toLocaleString()}</span>
              <span class="text-slate-400">(${rawPct}% ${isEs ? 'base antes de DR' : 'raw before DR'} • ${isEs ? '1er escalón a los' : '1st bracket at'} <strong class="text-white">${sm.cfg.t10.toLocaleString()}</strong>)</span>
            </div>
          </div>
        </div>
        <span class="self-start sm:self-auto px-2.5 py-1 rounded-lg border text-xs font-mono font-black ${badgeClasses[bIdx]}">
          ${bracketNames[bIdx]}
        </span>
      </div>
    `;
  }

  const rowsHtml = ['haste', 'crit', 'mastery', 'vers'].map(key => {
    const sm = statMeta[key];
    const c = sm.cfg;
    const isRowActive = highlightStat === key;
    const activeIdx = isRowActive ? getBracketIndex(val, c) : -1;
    const cellClass = (idx, baseTextCls) => {
      if (activeIdx === idx) {
        return 'bg-amber-500/25 border-2 border-amber-400 text-white font-black shadow-inner';
      }
      return `${baseTextCls} border border-white/5`;
    };

    return `
      <tr class="${isRowActive ? 'bg-white/[0.06]' : 'bg-black/30'} hover:bg-white/[0.04] transition-colors">
        <td class="p-2.5 border border-white/5 font-bold ${sm.color} whitespace-nowrap">
          <div class="flex items-center gap-1.5">
            ${isRowActive ? '<i class="fa-solid fa-caret-right text-amber-400"></i>' : ''}
            <span>${sm.short}</span>
          </div>
          <div class="text-[10px] text-slate-400 font-mono font-normal">${sm.unit}</div>
        </td>
        <td class="p-2.5 text-center font-mono text-xs whitespace-nowrap ${cellClass(0, 'text-emerald-300')}">0 – ${c.t10.toLocaleString()}</td>
        <td class="p-2.5 text-center font-mono text-xs whitespace-nowrap ${cellClass(1, 'text-amber-300')}">${c.t10.toLocaleString()} – ${c.t20.toLocaleString()}</td>
        <td class="p-2.5 text-center font-mono text-xs whitespace-nowrap ${cellClass(2, 'text-orange-300')}">${c.t20.toLocaleString()} – ${c.t30.toLocaleString()}</td>
        <td class="p-2.5 text-center font-mono text-xs whitespace-nowrap ${cellClass(3, 'text-red-300')}">${c.t30.toLocaleString()} – ${c.t40.toLocaleString()}</td>
        <td class="p-2.5 text-center font-mono text-xs whitespace-nowrap ${cellClass(4, 'text-red-400')}">${c.t40.toLocaleString()} – ${c.t50.toLocaleString()}</td>
        <td class="p-2.5 text-center font-mono text-xs whitespace-nowrap ${cellClass(5, 'text-red-400')}">${c.t50.toLocaleString()} – ${c.cap.toLocaleString()}</td>
        <td class="p-2.5 text-center font-mono text-xs whitespace-nowrap ${cellClass(6, 'text-red-500')}">&gt; ${c.cap.toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  modal.innerHTML = `
    <div class="bg-[#0d111a] border border-amber-500/30 rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-black/40">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <i class="fa-solid fa-scale-unbalanced-flip text-lg"></i>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-white">
              ${isEs ? 'Tablas de Rendimientos Decrecientes (DR) — Midnight (Nivel 90)' : 'Diminishing Returns (DR) Tables — Midnight (Level 90)'}
            </h3>
            <p class="text-xs text-slate-400">
              ${isEs ? 'Escalones oficiales de penalización por índice de estadística secundaria en el Parche 12.1' : 'Official secondary stat rating penalty brackets for Patch 12.1'}
            </p>
          </div>
        </div>
        <button type="button" onclick="closeDRGuideModal()" class="min-h-[38px] min-w-[38px] px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-200">
        ${currentStatBannerHtml}

        <!-- 1. Base Conversion Cards -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-2">
            <i class="fa-solid fa-calculator"></i>
            <span>${isEs ? '1. Puntos de Índice (Rating) por cada 1% en Nivel 90 (Antes de DR)' : '1. Stat Rating per 1% at Level 90 (Before DR)'}</span>
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            ${['haste', 'crit', 'mastery', 'vers'].map(k => {
              const sm = statMeta[k];
              const active = highlightStat === k;
              return `
                <div class="p-3 rounded-xl border ${active ? 'border-amber-400 bg-amber-500/10' : `${sm.border} ${sm.bg}`} flex flex-col justify-between">
                  <span class="text-[11px] font-bold uppercase ${sm.color}">${sm.short}</span>
                  <span class="text-base font-black text-white font-mono mt-1">${sm.unit}</span>
                  <span class="text-[10px] text-slate-400 mt-0.5">${isEs ? '30% inicia en' : '30% starts at'} <strong class="text-slate-200 font-mono">${sm.cfg.t10.toLocaleString()}</strong></span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. Full DR Brackets Table -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-2">
            <i class="fa-solid fa-table"></i>
            <span>${isEs ? '2. Tabla Oficial de Tramos y Penalizaciones de DR (Puntos de Rating)' : '2. Official DR Brackets & Penalties Table (Stat Rating)'}</span>
          </h4>
          <div class="overflow-x-auto rounded-xl border border-white/10">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="bg-black/70 text-[11px]">
                  <th class="p-2.5 border border-white/5 text-slate-300 font-black uppercase">${isEs ? 'Estadística' : 'Stat'}</th>
                  <th class="p-2.5 border border-white/5 text-center text-emerald-400 font-black">
                    <div>0% DR ✓</div>
                    <div class="text-[10px] text-slate-400 font-mono font-normal">0% – 30%</div>
                  </th>
                  <th class="p-2.5 border border-white/5 text-center text-amber-300 font-black">
                    <div>-10% DR ⚠️</div>
                    <div class="text-[10px] text-slate-400 font-mono font-normal">30% – 39%</div>
                  </th>
                  <th class="p-2.5 border border-white/5 text-center text-orange-400 font-black">
                    <div>-20% DR ⚠️</div>
                    <div class="text-[10px] text-slate-400 font-mono font-normal">39% – 47%</div>
                  </th>
                  <th class="p-2.5 border border-white/5 text-center text-red-400 font-black">
                    <div>-30% DR 🛑</div>
                    <div class="text-[10px] text-slate-400 font-mono font-normal">47% – 54%</div>
                  </th>
                  <th class="p-2.5 border border-white/5 text-center text-red-400 font-black">
                    <div>-40% DR 🛑</div>
                    <div class="text-[10px] text-slate-400 font-mono font-normal">54% – 66%</div>
                  </th>
                  <th class="p-2.5 border border-white/5 text-center text-red-400 font-black">
                    <div>-50% DR 🛑</div>
                    <div class="text-[10px] text-slate-400 font-mono font-normal">66% – 126%</div>
                  </th>
                  <th class="p-2.5 border border-white/5 text-center text-red-500 font-black">
                    <div>-100% Cap 🛑</div>
                    <div class="text-[10px] text-slate-400 font-mono font-normal">&gt; 126%</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. How DR Works Notes -->
        <div class="bg-black/40 border border-white/10 rounded-xl p-3.5 space-y-2 text-xs text-slate-300 leading-relaxed">
          <div class="font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-circle-info text-blue-400"></i>
            <span>${isEs ? '¿Cómo se aplica exactamente la penalización en World of Warcraft?' : 'How does the DR penalty apply in World of Warcraft?'}</span>
          </div>
          <ul class="list-disc list-inside space-y-1 text-slate-300">
            <li>
              ${isEs
                ? '<strong>Penalización marginal (progresiva):</strong> Solo los puntos que <em>superan</em> el umbral sufren el descuento. Por ejemplo, si tienes <strong>1,500 de Crítico</strong>, tus primeros <strong>1,380 puntos</strong> mantienen el 100% de su valor (30%), y únicamente los <strong>120 puntos restantes</strong> reciben el -10% de penalización.'
                : '<strong>Marginal (progressive) penalty:</strong> Only the rating points <em>above</em> each threshold are penalized. For example, at <strong>1,500 Crit</strong>, your first <strong>1,380 rating</strong> grant full value (30%), and only the <strong>120 excess rating</strong> receives the -10% penalty.'}
            </li>
            <li>
              ${isEs
                ? '<strong>Maestría:</strong> El DR se calcula sobre los <strong>puntos base de Maestría</strong> (46 rating = 1 punto base, empezando el DR en 1,380) antes de multiplicarse por el factor de cada especialización.'
                : '<strong>Mastery:</strong> DR is calculated on <strong>base Mastery points</strong> (46 rating = 1 base point, starting DR at 1,380) before multiplying by your specialization coefficient.'}
            </li>
            <li>
              ${isEs
                ? '<strong>Buffs porcentuales vs Procs de Rating:</strong> Los beneficios que otorgan un <code>%</code> directo (como talentos o buffs de banda) <strong>no</strong> cuentan para el DR, mientras que los abalorios, frascos o consumibles que suman puntos de <em>rating</em> sí cuentan mientras estén activos.'
                : '<strong>Flat % Buffs vs Rating Procs:</strong> Buffs and talents granting flat <code>%</code> stats do <strong>not</strong> count toward rating DR, whereas trinket procs, flasks, and consumables granting raw stat <em>rating</em> do count while active.'}
            </li>
          </ul>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-4 sm:px-6 py-3.5 border-t border-white/10 bg-black/40 flex justify-end">
        <button type="button" onclick="closeDRGuideModal()" class="min-h-[38px] px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-colors cursor-pointer">
          ${isEs ? 'Entendido' : 'Got it'}
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDRGuideModal();
});

