// Official Bloodmallet & Archon Trinket Rankings Integration
let bloodmalletDataCache = {};
let isFetchingBloodmallet = false;

function getBloodmalletClassSpec(appClass, appSpec) {
  const classMap = {
    'deathknight': 'death_knight',
    'demonhunter': 'demon_hunter',
    'paladin': 'paladin',
    'warrior': 'warrior',
    'hunter': 'hunter',
    'shaman': 'shaman',
    'rogue': 'rogue',
    'monk': 'monk',
    'druid': 'druid',
    'mage': 'mage',
    'warlock': 'warlock',
    'priest': 'priest',
    'evoker': 'evoker'
  };
  const specMap = {
    'beastmastery': 'beast_mastery',
    'beast_mastery': 'beast_mastery',
    'marksmanship': 'marksmanship',
    'survival': 'survival',
    'protection': 'protection',
    'retribution': 'retribution',
    'holy': 'holy',
    'arms': 'arms',
    'fury': 'fury',
    'blood': 'blood',
    'frost': 'frost',
    'frost_mage': 'frost',
    'frost_dk': 'frost',
    'unholy': 'unholy',
    'elemental': 'elemental',
    'enhancement': 'enhancement',
    'restoration': 'restoration',
    'restoration_druid': 'restoration',
    'restoration_shaman': 'restoration',
    'assassination': 'assassination',
    'outlaw': 'outlaw',
    'subtlety': 'subtlety',
    'brewmaster': 'brewmaster',
    'windwalker': 'windwalker',
    'mistweaver': 'mistweaver',
    'havoc': 'havoc',
    'vengeance': 'vengeance',
    'devourer': 'devourer',
    'balance': 'balance',
    'feral': 'feral',
    'guardian': 'guardian',
    'arcane': 'arcane',
    'fire': 'fire',
    'affliction': 'affliction',
    'demonology': 'demonology',
    'destruction': 'destruction',
    'shadow': 'shadow',
    'discipline': 'discipline',
    'holy_priest': 'holy',
    'devastation': 'devastation',
    'preservation': 'preservation',
    'augmentation': 'augmentation'
  };
  const c = classMap[appClass?.toLowerCase()] || appClass?.toLowerCase() || 'paladin';
  const s = specMap[appSpec?.toLowerCase()] || appSpec?.toLowerCase() || 'retribution';
  return { wowClass: c, wowSpec: s };
}

async function fetchBloodmalletData(appClass, appSpec, fightStyle = 'castingpatchwerk') {
  const { wowClass, wowSpec } = getBloodmalletClassSpec(appClass, appSpec);
  const cacheKey = `${wowClass}_${wowSpec}_${fightStyle}`;

  if (bloodmalletDataCache[cacheKey]) {
    return bloodmalletDataCache[cacheKey];
  }

  if (window.BLOODMALLET_DATA && window.BLOODMALLET_DATA[cacheKey]) {
    bloodmalletDataCache[cacheKey] = window.BLOODMALLET_DATA[cacheKey];
    return bloodmalletDataCache[cacheKey];
  }

  try {
    const local = localStorage.getItem(`bm_cache_${cacheKey}`);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < 12 * 3600 * 1000) && parsed.data) {
        bloodmalletDataCache[cacheKey] = parsed.data;
        return parsed.data;
      }
    }
  } catch (e) {}

  const url = `https://bloodmallet.com/chart/get/trinkets/${fightStyle}/${wowClass}/${wowSpec}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Bloodmallet respondió HTTP ${response.status}`);
  }

  const json = await response.json();
  if (!json || !json.data) {
    throw new Error('Estructura de datos inválida de Bloodmallet');
  }

  bloodmalletDataCache[cacheKey] = json;
  try {
    localStorage.setItem(`bm_cache_${cacheKey}`, JSON.stringify({
      timestamp: Date.now(),
      data: json
    }));
  } catch (e) {}

  return json;
}

function getTrinketBloodmalletInfo(item, wowClass, wowSpec, mode) {
  if (!item || item.slot !== 'trinket') return null;
  const { wowClass: c, wowSpec: s } = getBloodmalletClassSpec(wowClass || currentClass, wowSpec || currentSpec);
  const m = mode || (typeof currentContentMode !== 'undefined' && currentContentMode === 'mplus' ? 'mplus' : 'raid');
  const fightStyle = m === 'mplus' ? 'castingpatchwerk5' : 'castingpatchwerk';
  const cacheKey = `${c}_${s}_${fightStyle}`;
  
  if (!bloodmalletDataCache[cacheKey] && window.BLOODMALLET_DATA && window.BLOODMALLET_DATA[cacheKey]) {
    bloodmalletDataCache[cacheKey] = window.BLOODMALLET_DATA[cacheKey];
  }

  let bmData = bloodmalletDataCache[cacheKey];
  if (!bmData && fightStyle === 'castingpatchwerk5') {
    const fallbackKey = `${c}_${s}_castingpatchwerk`;
    if (!bloodmalletDataCache[fallbackKey] && window.BLOODMALLET_DATA && window.BLOODMALLET_DATA[fallbackKey]) {
      bloodmalletDataCache[fallbackKey] = window.BLOODMALLET_DATA[fallbackKey];
    }
    bmData = bloodmalletDataCache[fallbackKey];
  }

  if (!bmData || !bmData.data) return null;

  const baseline = Object.values(bmData.data.baseline || {})[0] || 0;
  let matchedKey = null;

  if (item.itemId && bmData.item_ids) {
    for (const [name, id] of Object.entries(bmData.item_ids)) {
      if (id === item.itemId) {
        matchedKey = name;
        break;
      }
    }
  }

  if (!matchedKey && item.name) {
    const cleanItemName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const name of Object.keys(bmData.data)) {
      if (name === 'baseline') continue;
      const cleanBmName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanBmName === cleanItemName) {
        matchedKey = name;
        break;
      }
    }
    if (!matchedKey) {
      for (const name of Object.keys(bmData.data)) {
        if (name === 'baseline') continue;
        const cleanBmName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanItemName.includes(cleanBmName) || cleanBmName.includes(cleanItemName)) {
          matchedKey = name;
          break;
        }
      }
    }
  }

  if (!matchedKey || !bmData.data[matchedKey]) {
    return null;
  }

  const ilvlEntries = bmData.data[matchedKey];
  const ilvls = Object.keys(ilvlEntries).map(Number).sort((a, b) => a - b);
  if (ilvls.length === 0) return null;

  const targetIlvl = item.ilvl || ilvls[0];
  let chosenDps = null;
  let exactMatch = false;

  if (ilvlEntries[targetIlvl] !== undefined) {
    chosenDps = ilvlEntries[targetIlvl];
    exactMatch = true;
  } else {
    if (targetIlvl <= ilvls[0]) {
      chosenDps = ilvlEntries[ilvls[0]];
    } else if (targetIlvl >= ilvls[ilvls.length - 1]) {
      chosenDps = ilvlEntries[ilvls[ilvls.length - 1]];
    } else {
      let lower = ilvls[0], upper = ilvls[ilvls.length - 1];
      for (let i = 0; i < ilvls.length - 1; i++) {
        if (targetIlvl >= ilvls[i] && targetIlvl <= ilvls[i + 1]) {
          lower = ilvls[i];
          upper = ilvls[i + 1];
          break;
        }
      }
      const ratio = (targetIlvl - lower) / (upper - lower);
      chosenDps = Math.round(ilvlEntries[lower] + ratio * (ilvlEntries[upper] - ilvlEntries[lower]));
    }
  }

  const dpsGain = baseline > 0 ? Math.max(0, chosenDps - baseline) : chosenDps;
  const source = (bmData.data_sources && bmData.data_sources[matchedKey]) || 'Desconocido';
  const isActive = (bmData.data_active && bmData.data_active[matchedKey]) || false;

  return {
    name: matchedKey,
    itemId: bmData.item_ids ? bmData.item_ids[matchedKey] : item.itemId,
    dps: chosenDps,
    dpsGain: dpsGain,
    baseline: baseline,
    source: source,
    isActive: isActive,
    exactIlvl: exactMatch
  };
}

function isHealerSpec(c, s) {
  const cls = c || currentClass;
  const spc = s || currentSpec;
  const healerSpecs = ['holy', 'discipline', 'holy_priest', 'restoration_shaman', 'restoration_druid', 'mistweaver', 'preservation', 'restoration'];
  return healerSpecs.includes(spc) || (cls === 'paladin' && spc === 'holy') || (cls === 'druid' && (spc === 'restoration' || spc === 'restoration_druid')) || (cls === 'shaman' && (spc === 'restoration' || spc === 'restoration_shaman')) || (cls === 'priest' && (spc === 'holy' || spc === 'discipline' || spc === 'holy_priest')) || (cls === 'monk' && spc === 'mistweaver') || (cls === 'evoker' && spc === 'preservation');
}

function getArchonHealerSpecData(c, s) {
  if (!window.ARCHON_HEALER_TRINKETS) return null;
  const cls = c || currentClass;
  const spc = s || currentSpec;
  const classData = window.ARCHON_HEALER_TRINKETS[cls];
  if (!classData) return null;

  if (classData[spc]) return classData[spc];

  const aliases = {
    'restoration': cls === 'shaman' ? 'restoration_shaman' : (cls === 'druid' ? 'restoration_druid' : 'restoration'),
    'holy': cls === 'priest' ? 'holy_priest' : 'holy',
    'restoration_shaman': 'restoration',
    'restoration_druid': 'restoration',
    'holy_priest': 'holy'
  };

  const alias = aliases[spc];
  if (alias && classData[alias]) return classData[alias];

  const cleanSpc = String(spc).toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const k of Object.keys(classData)) {
    const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanK === cleanSpc || cleanK.includes(cleanSpc) || cleanSpc.includes(cleanK)) {
      return classData[k];
    }
  }
  return null;
}

function getTrinketArchonHealerInfo(item, wowClass, wowSpec, mode) {
  if (!item || item.slot !== 'trinket') return null;
  const c = wowClass || currentClass;
  const s = wowSpec || currentSpec;
  const specData = getArchonHealerSpecData(c, s);
  if (!specData) return null;
  
  const m = mode || (typeof currentContentMode !== 'undefined' && currentContentMode === 'raid' ? 'raid' : 'mplus');
  const list = specData[m] || [];
  
  let matches = list.filter(x => Number(x.itemId) === Number(item.itemId));
  if (matches.length === 0 && item.name) {
    const clean = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    matches = list.filter(x => x.name && x.name.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
    if (matches.length === 0) {
      matches = list.filter(x => x.name && (clean.includes(x.name.toLowerCase().replace(/[^a-z0-9]/g, '')) || x.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(clean)));
    }
  }
  let found = matches.length > 0 ? [...matches].sort((a, b) => (Number(b.popularity) || 0) - (Number(a.popularity) || 0))[0] : null;
  return found ? { ...found, isHealer: true, mode: m } : null;
}

function getTrinketBloodmalletBadge(item) {
  if (!item || item.slot !== 'trinket') return '';
  const activeMode = typeof currentContentMode !== 'undefined' && currentContentMode === 'mplus' ? 'mplus' : 'raid';
  if (isHealerSpec(currentClass, currentSpec)) {
    const archon = getTrinketArchonHealerInfo(item, currentClass, currentSpec, activeMode);
    if (!archon) return '';
    const keyBadge = archon.maxKey ? `<span class="px-1 py-0.2 rounded bg-purple-950/80 border border-purple-500/50 text-purple-300 text-[9px] font-bold ml-1">${archon.maxKey}</span>` : '';
    return `<span class="inline-flex items-center gap-1 text-[9px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/50 px-1.5 py-0.5 rounded ml-1" title="Popularidad Oficial Archon.gg (${archon.popularity}% Pick Rate)"><i class="fa-solid fa-chart-line text-amber-400 text-[8px]"></i> Archon: ${archon.popularity}%</span>${keyBadge}`;
  }
  const bmInfo = getTrinketBloodmalletInfo(item, currentClass, currentSpec, activeMode);
  if (!bmInfo) return '';

  const typeBadge = bmInfo.isActive 
    ? '<span class="px-1 py-0.2 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[9px] font-bold ml-1">Uso</span>'
    : '<span class="px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-[9px] font-bold ml-1">Pasivo</span>';

  const dpsFormatted = bmInfo.dpsGain >= 1000 
    ? '+' + (bmInfo.dpsGain / 1000).toFixed(1) + 'k DPS'
    : '+' + bmInfo.dpsGain + ' DPS';

  const modeBadge = activeMode === 'mplus' ? ' (5T)' : ' (1T)';
  return `<span class="inline-flex items-center gap-1 text-[9px] font-bold text-red-300 bg-red-950/60 border border-red-500/40 px-1.5 py-0.5 rounded ml-1" title="DPS Simulado Bloodmallet (+${bmInfo.dpsGain.toLocaleString()} DPS vs Baseline${modeBadge})"><i class="fa-solid fa-fire text-amber-400 text-[8px]"></i> ${dpsFormatted}</span>${typeBadge}`;
}

function getTrinketDpsScore(item, wowClass, wowSpec, mode) {
  if (!item || item.slot !== 'trinket') return 0;
  const c = wowClass || currentClass;
  const s = wowSpec || currentSpec;
  const m = mode || (typeof currentContentMode !== 'undefined' && currentContentMode === 'mplus' ? 'mplus' : 'raid');
  if (isHealerSpec(c, s)) {
    const archon = getTrinketArchonHealerInfo(item, c, s, m);
    if (!archon) return 0;
    const itemIlvl = item.ilvl || 308;
    const ilvlFactor = Math.pow(1.012, itemIlvl - 308);
    return Math.round(archon.popularity * 1000 * ilvlFactor);
  }
  const bmInfo = getTrinketBloodmalletInfo(item, c, s, m);
  return bmInfo ? bmInfo.dpsGain : 0;
}

async function syncBloodmalletData(showFeedback = false) {
  const icon = document.getElementById('bm-sync-icon');
  const label = document.getElementById('bm-sync-label');
  if (icon) icon.classList.add('fa-spin');
  if (label && showFeedback) label.innerText = 'Sincronizando...';

  try {
    const data = await fetchBloodmalletData(currentClass, currentSpec);
    const count = data && data.data ? Object.keys(data.data).length - (data.data.baseline ? 1 : 0) : 0;
    if (label) label.innerText = `Bloodmallet (${count})`;
    if (showFeedback && typeof showToast === 'function') {
      showToast(`¡Sincronizados ${count} abalorios oficiales de Bloodmallet para ${currentClass}/${currentSpec}!`, 'success');
    }
    if (typeof renderInventory === 'function') renderInventory();
    if (typeof runOptimizer === 'function') runOptimizer();
  } catch (err) {
    console.warn('Bloodmallet sync warning:', err);
    if (label) label.innerText = 'Bloodmallet';
    if (showFeedback && typeof showToast === 'function') {
      showToast('No se pudo conectar con bloodmallet.com (' + err.message + ')', 'error');
    }
  } finally {
    if (icon) icon.classList.remove('fa-spin');
  }
}
