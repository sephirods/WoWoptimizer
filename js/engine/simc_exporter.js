// SimulationCraft & Raidbots Export Engine

let currentSimcExportResultIndex = 0;
let currentSimcExportMode = 'quick';

const SIMC_SPEC_MAP = {
  'deathknight': { 'blood': 'blood', 'frost_dk': 'frost', 'unholy': 'unholy' },
  'demonhunter': { 'havoc': 'havoc', 'vengeance': 'vengeance' },
  'druid': { 'balance': 'balance', 'feral': 'feral', 'guardian': 'guardian', 'restoration_druid': 'restoration' },
  'evoker': { 'devastation': 'devastation', 'preservation': 'preservation', 'augmentation': 'augmentation' },
  'hunter': { 'beast_mastery': 'beast_mastery', 'marksmanship': 'marksmanship', 'survival': 'survival' },
  'mage': { 'arcane': 'arcane', 'fire': 'fire', 'frost_mage': 'frost' },
  'monk': { 'brewmaster': 'brewmaster', 'mistweaver': 'mistweaver', 'windwalker': 'windwalker' },
  'paladin': { 'holy': 'holy', 'protection': 'protection', 'retribution': 'retribution' },
  'priest': { 'discipline': 'discipline', 'holy_priest': 'holy', 'shadow': 'shadow' },
  'rogue': { 'assassination': 'assassination', 'outlaw': 'outlaw', 'subtlety': 'subtlety' },
  'shaman': { 'elemental': 'elemental', 'enhancement': 'enhancement', 'restoration_shaman': 'restoration' },
  'warlock': { 'affliction': 'affliction', 'demonology': 'demonology', 'destruction': 'destruction' },
  'warrior': { 'arms': 'arms', 'fury': 'fury', 'prot_warrior': 'protection' }
};

function getSimcClassKey(cls) {
  if (cls === 'deathknight') return 'death_knight';
  if (cls === 'demonhunter') return 'demon_hunter';
  return cls;
}

function getSimcSpecName(cls, specId) {
  return SIMC_SPEC_MAP[cls]?.[specId] || specId;
}

function getDefaultRaceForClass(cls) {
  const races = {
    'deathknight': 'human',
    'demonhunter': 'blood_elf',
    'druid': 'night_elf',
    'evoker': 'dracthyr',
    'hunter': 'blood_elf',
    'mage': 'human',
    'monk': 'pandaren',
    'paladin': 'human',
    'priest': 'human',
    'rogue': 'human',
    'shaman': 'orc',
    'warlock': 'orc',
    'warrior': 'orc'
  };
  return races[cls] || 'human';
}

function getDefaultRoleForSpec(cls, specId) {
  const tanks = ['blood', 'vengeance', 'guardian', 'brewmaster', 'protection', 'prot_warrior', 'protection_paladin', 'protection_warrior'];
  const healers = ['restoration_druid', 'preservation', 'mistweaver', 'holy', 'holy_priest', 'holy_paladin', 'discipline', 'restoration_shaman', 'restoration'];
  const spells = ['balance', 'devastation', 'arcane', 'fire', 'frost_mage', 'shadow', 'elemental', 'affliction', 'demonology', 'destruction'];
  
  if (tanks.includes(specId)) return 'tank';
  if (healers.includes(specId)) return 'heal';
  if (spells.includes(specId)) return 'spell';
  return 'attack';
}

const ITEM_TO_SIMC_ENCHANT_ID = {
  // Helm
  244007: 8017, // Empowered Rune of Avoidance
  243951: 7961, // Empowered Hex of Leeching
  243981: 7991, // Empowered Blessing of Speed
  // Shoulders
  243990: 8001, // Amirdrassil's Grace
  243991: 8001, // Amirdrassil's Grace
  243961: 7971, // Flight of the Eagle
  243963: 7973, // Akil'zon's Swiftness
  244021: 8031, // Silvermoon's Mending
  // Chest
  243977: 7987, // Mark of the Worldsoul
  244003: 8013, // Mark of the Magister
  // Legs
  244641: 8159, // Forest Hunter's Armor Kit
  244643: 8163, // Blood Knight's Armor Kit
  240133: 7935, // Sunfire Silk Spellthread
  240155: 7937, // Arcanoweave Spellthread
  // Boots
  243952: 7963, // Lynx's Dexterity
  243953: 7963, // Lynx's Dexterity
  243983: 7993, // Shaladrassil's Roots
  244009: 8019, // Farstrider's Hunt
  // Rings
  243957: 7967, // Eyes of the Eagle
  256739: 7967, // Eyes of the Eagle
  243959: 7969, // Zul'jin's Mastery
  243987: 7997, // Nature's Fury
  244015: 8025, // Silvermoon's Alacrity
  244017: 8027, // Silvermoon's Tenacity
  // Weapons
  273071: 8689, // Rite of the Hash'ey
  273072: 8689, // Rite of the Hash'ey
  243971: 7981, // Jan'alai's Precision
  243973: 7983, // Berserker's Rage
  244029: 8039, // Acuity of the Ren'dorei
  244031: 8041, // Arcane Mastery
  53343: 3370,  // Rune of Razorice
  53344: 3368,  // Rune of the Fallen Crusader
  326805: 6241, // Rune of Sanguination
  327082: 6242, // Rune of the Apocalypse
  // Bracers
  275707: 8200
};

function getRecommendedEnchantForSlot(cls, spec, slotKey) {
  const specData = resolveWowheadSpecData(cls, spec);
  if (!specData || !specData.enchants) return null;

  const map = {
    head: ['head', 'helm'],
    shoulder: ['shoulder', 'shoulders'],
    back: ['back', 'cloak'],
    chest: ['chest'],
    wrist: ['wrist', 'bracers'],
    hands: ['hands', 'gloves'],
    waist: ['waist', 'belt'],
    legs: ['legs', 'leg'],
    feet: ['feet', 'boots', 'boot'],
    finger: ['ring', 'rings', 'finger'],
    finger1: ['ring', 'rings', 'finger'],
    finger2: ['ring', 'rings', 'finger'],
    weapon: ['weapon', 'weapons', 'main_hand'],
    weapon_2h: ['weapon', 'weapons', 'main_hand'],
    weapon_1h: ['weapon', 'weapons', 'main_hand'],
    main_hand: ['weapon', 'weapons', 'main_hand'],
    off_hand: ['weapon', 'weapons', 'off_hand', 'shield']
  };

  const targets = map[slotKey] || [String(slotKey).toLowerCase()];
  const enc = specData.enchants.find(e => targets.includes(String(e.slot).toLowerCase())) || null;
  if (!enc) return null;
  const simcEnchantId = ITEM_TO_SIMC_ENCHANT_ID[enc.id] || enc.id;
  return { ...enc, simcEnchantId };
}

function generateSimcExportString(resultIndex = 0, includeBags = (typeof currentSimcExportMode !== 'undefined' && currentSimcExportMode === 'topgear')) {
  const res = (typeof currentOptimizationResults !== 'undefined' ? currentOptimizationResults : window.currentOptimizationResults)?.[resultIndex];
  if (!res) return '';

  loadCharacterSimcDataFromStorage();
  if (!lastImportedSimcText) {
    try {
      lastImportedSimcText = localStorage.getItem('wow_last_imported_simc_raw') || '';
    } catch (e) {}
  }

  const charName = characterSimcData.name || `${currentClass.toUpperCase()}_Player`;
  const charLevel = characterSimcData.level || 90;
  const charRace = characterSimcData.race || getDefaultRaceForClass(currentClass);
  const charServer = characterSimcData.server || '';
  const charRegion = characterSimcData.region || 'us';
  const charRole = characterSimcData.role || getDefaultRoleForSpec(currentClass, currentSpec);
  const charProfessions = characterSimcData.professions || '';
  const charTalents = characterSimcData.talents || '';
  const charOmniumTalents = characterSimcData.omnium_talents || '';
  const charHeroTalents = characterSimcData.hero_talents || '';

  const simcClassKey = getSimcClassKey(currentClass);
  const simcSpecKey = getSimcSpecName(currentClass, currentSpec);

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

  const lines = [];

  if (lastImportedSimcText) {
    const origLines = lastImportedSimcText.split('\n');
    let firstEquippedIdx = -1;

    for (let i = 0; i < origLines.length; i++) {
      const l = origLines[i].trim();
      if (firstEquippedIdx === -1 && /^(?:#\s*)?(head|neck|shoulder|back|chest|wrist|hands|waist|legs|feet|finger1|finger2|trinket1|trinket2|main_hand|off_hand)=,id=/i.test(l)) {
        let startIdx = i;
        if (i > 0 && /^#\s*([A-Za-z0-9\s',-]+)\s*\((\d+)\)/.test(origLines[i - 1].trim())) {
          startIdx = i - 1;
        }
        firstEquippedIdx = startIdx;
        break;
      }
    }

    if (firstEquippedIdx !== -1) {
      for (let i = 0; i < firstEquippedIdx; i++) {
        const l = origLines[i];
        const trimmed = l.trim();

        if (new RegExp(`^(?:#\\s*)?(?:${simcClassKey}|${currentClass})\\s*=`, 'i').test(trimmed)) {
          lines.push(`${simcClassKey}="${charName}"`);
        } else if (/^(?:#\s*)?level\s*=/i.test(trimmed)) {
          lines.push(`level=${charLevel}`);
        } else if (/^(?:#\s*)?race\s*=/i.test(trimmed)) {
          lines.push(`race=${charRace}`);
        } else if (/^(?:#\s*)?region\s*=/i.test(trimmed)) {
          lines.push(`region=${charRegion}`);
        } else if (/^(?:#\s*)?server\s*=/i.test(trimmed)) {
          if (charServer) lines.push(`server=${charServer}`);
        } else if (/^(?:#\s*)?spec\s*=/i.test(trimmed)) {
          lines.push(`spec=${simcSpecKey}`);
        } else {
          lines.push(l);
        }
      }

      if (lines.length > 0 && lines[lines.length - 1].trim() !== '') {
        lines.push('');
      }
    }
  } else {
    // Fallback default clean header
    lines.push(`# ${charName} - ${WOW_CLASSES[currentClass]?.specs?.find(s => s.id === currentSpec)?.name || currentSpec} - ${dateStr} - ${charRegion.toUpperCase()}${charServer ? '/' + charServer : ''}`);
    lines.push(`# SimulationCraft / Raidbots Export (Midnight 12.1)`);
    if (res.gemData?.projected) {
      lines.push(`# Projected Stats (w/ Gems): Mastery: ${res.gemData.projected.totMast}, Crit: ${res.gemData.projected.totCrit}, Haste: ${res.gemData.projected.totHaste}, Vers: ${res.gemData.projected.totVers}`);
    } else {
      lines.push(`# Base Stats: Mastery: ${res.totMast}, Crit: ${res.totCrit}, Haste: ${res.totHaste}, Vers: ${res.totVers}`);
    }
    lines.push(`# Tier Set: ${res.tierCount}/5`);
    lines.push('');

    lines.push(`${simcClassKey}="${charName}"`);
    lines.push(`level=${charLevel}`);
    lines.push(`race=${charRace}`);
    if (charRegion) lines.push(`region=${charRegion}`);
    if (charServer) lines.push(`server=${charServer}`);
    if (charRole) lines.push(`role=${charRole}`);
    if (charProfessions) lines.push(`professions=${charProfessions}`);
    lines.push(`spec=${simcSpecKey}`);
    if (charTalents) {
      lines.push('');
      lines.push(`talents=${charTalents}`);
    }
    if (charOmniumTalents) {
      lines.push(`omnium_talents=${charOmniumTalents}`);
    }
    if (charHeroTalents) {
      lines.push(`hero_talents=${charHeroTalents}`);
    }
    lines.push('');
  }

  // Build Equipped Items with Optimizer Selection
  const slotToSimcKey = {
    head: 'head',
    neck: 'neck',
    shoulder: 'shoulder',
    back: 'back',
    chest: 'chest',
    wrist: 'wrist',
    hands: 'hands',
    waist: 'waist',
    legs: 'legs',
    feet: 'feet'
  };

  let ringCount = 0;
  let trinketCount = 0;
  let mainHandSet = false;

  const recommendations = res.gemData?.recommendations || [];

  res.items.forEach(it => {
    let simcKey = slotToSimcKey[it.slot];
    if (it.slot === 'finger') {
      ringCount++;
      simcKey = `finger${ringCount}`;
    } else if (it.slot === 'trinket') {
      trinketCount++;
      simcKey = `trinket${trinketCount}`;
    } else if (it.slot === 'weapon_2h') {
      simcKey = 'main_hand';
    } else if (it.slot === 'shield') {
      simcKey = 'off_hand';
    } else if (it.slot === 'weapon_1h') {
      if (!mainHandSet) {
        simcKey = 'main_hand';
        mainHandSet = true;
      } else {
        simcKey = 'off_hand';
      }
    }
    if (!simcKey) simcKey = it.slot;

    let assignedGemId = null;
    if (it.socket) {
      const rec = recommendations.find(r => r.item === it || r.item?.id === it.id || (r.item?.name === it.name && r.item?.slot === it.slot));
      if (rec && rec.gemItemId) {
        assignedGemId = rec.gemItemId;
      } else {
        assignedGemId = 240898;
      }
    }

    const recEnchant = getRecommendedEnchantForSlot(currentClass, currentSpec, it.slot);
    const recEnchantId = recEnchant ? recEnchant.simcEnchantId : null;

    lines.push(`# ${it.name} (${it.ilvl})`);
    let itemLine = `${simcKey}=,id=${it.itemId || 0}`;

    if (it.rawSimcOptions) {
      let opts = it.rawSimcOptions;
      if (assignedGemId) {
        if (/gem_id=\d+/i.test(opts)) {
          opts = opts.replace(/gem_id=\d+/i, `gem_id=${assignedGemId}`);
        } else if (/gems=[\d/]+/i.test(opts)) {
          opts = opts.replace(/gems=[\d/]+/i, `gems=${assignedGemId}`);
        } else {
          opts += `,gem_id=${assignedGemId}`;
        }
      }
      if (recEnchantId) {
        const currentEnchantMatch = opts.match(/enchant(?:_id)?=(\d+)/i);
        if (currentEnchantMatch) {
          const currentEncVal = parseInt(currentEnchantMatch[1]);
          if (currentEncVal > 200000 && ITEM_TO_SIMC_ENCHANT_ID[currentEncVal]) {
            opts = opts.replace(/enchant(?:_id)?=\d+/i, `enchant_id=${ITEM_TO_SIMC_ENCHANT_ID[currentEncVal]}`);
          }
        } else {
          opts += `,enchant_id=${recEnchantId}`;
        }
      }
      if (!opts.startsWith(',')) opts = ',' + opts;
      itemLine += opts;
    } else {
      itemLine += `,bonus_id=13440/6652/12699/12846,ilevel=${it.ilvl || 321}`;
      if (it.craftedStatCodes && it.craftedStatCodes.length === 2) {
        itemLine += `,crafted_stats=${it.craftedStatCodes[0]}/${it.craftedStatCodes[1]},crafting_quality=5`;
      }
      if (it.redirectedStatId) {
        itemLine += `,redirected_base_stats=${it.redirectedStatId}`;
      }
      if (recEnchantId) {
        itemLine += `,enchant_id=${recEnchantId}`;
      }
      if (assignedGemId) {
        itemLine += `,gem_id=${assignedGemId}`;
      }
    }

    lines.push(itemLine);
  });

  if (includeBags) {
    const equippedUids = new Set(res.items.map(x => x.id).filter(Boolean));
    const unequippedItems = (typeof items !== 'undefined' ? items : []).filter(it => !equippedUids.has(it.id));
    const vaultItems = unequippedItems.filter(it => it.isVault);
    const regularBagItems = unequippedItems.filter(it => !it.isVault);

    const appendSimcItemList = (itemList, headerTitle) => {
      if (!itemList || itemList.length === 0) return;
      lines.push('');
      lines.push(`### ${headerTitle}`);
      lines.push('#');

      itemList.forEach(it => {
        let simcKey = slotToSimcKey[it.slot] || it.slot;
        if (it.slot === 'finger') simcKey = 'finger1';
        else if (it.slot === 'trinket') simcKey = 'trinket1';
        else if (it.slot === 'weapon_2h' || it.slot === 'weapon_1h') simcKey = 'main_hand';
        else if (it.slot === 'shield') simcKey = 'off_hand';

        lines.push(`# ${it.name} (${it.ilvl})`);
        let itemLine = `# ${simcKey}=,id=${it.itemId || 0}`;

        if (it.rawSimcOptions) {
          let opts = it.rawSimcOptions;
          if (!opts.startsWith(',')) opts = ',' + opts;
          itemLine += opts;
        } else {
          itemLine += `,bonus_id=13440/6652/12699/12846,ilevel=${it.ilvl || 321}`;
          if (it.craftedStatCodes && it.craftedStatCodes.length === 2) {
            itemLine += `,crafted_stats=${it.craftedStatCodes[0]}/${it.craftedStatCodes[1]},crafting_quality=5`;
          }
          if (it.redirectedStatId) {
            itemLine += `,redirected_base_stats=${it.redirectedStatId}`;
          }
        }

        lines.push(itemLine);
        lines.push('#');
      });
    };

    appendSimcItemList(vaultItems, 'Great Vault Options');
    appendSimcItemList(regularBagItems, 'Gear from Bags');
  }

  return lines.join('\n');
}

function switchSimcExportMode(mode) {
  currentSimcExportMode = mode;
  const isTopGear = mode === 'topgear';
  const text = generateSimcExportString(currentSimcExportResultIndex, isTopGear);
  const exportArea = document.getElementById('simc-export-text');
  if (exportArea) exportArea.value = text;
  
  const statusEl = document.getElementById('simc-copy-status');
  if (statusEl) {
    statusEl.innerText = isTopGear 
      ? 'Modo Top Gear: Set óptimo equipado + todos los objetos de tu mochila.'
      : 'Modo Quick Sim: Solo set óptimo equipado (sin mochila).';
  }

  const quickBtn = document.getElementById('simc-mode-quick-btn');
  const topgearBtn = document.getElementById('simc-mode-topgear-btn');
  const raidbotsBtn = document.getElementById('simc-open-raidbots-btn');
  const raidbotsBtnText = document.getElementById('simc-raidbots-btn-text');

  if (isTopGear) {
    if (quickBtn) {
      quickBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-amber-300 bg-black/40 hover:bg-amber-950/40 border border-wow-border flex items-center gap-1.5 transition';
    }
    if (topgearBtn) {
      topgearBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-sky-300 bg-sky-950/90 border border-sky-500/60 shadow flex items-center gap-1.5 transition';
    }
    if (raidbotsBtn) {
      raidbotsBtn.className = 'px-4 py-1.5 rounded-lg text-xs font-bold text-sky-300 bg-sky-950/90 hover:bg-sky-900 border border-sky-500/60 shadow flex items-center gap-1.5 transition';
    }
    if (raidbotsBtnText) {
      raidbotsBtnText.innerText = 'Abrir en Raidbots (Top Gear)';
    }
  } else {
    if (quickBtn) {
      quickBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-950/90 border border-amber-500/60 shadow flex items-center gap-1.5 transition';
    }
    if (topgearBtn) {
      topgearBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-sky-300 bg-black/40 hover:bg-sky-950/40 border border-wow-border flex items-center gap-1.5 transition';
    }
    if (raidbotsBtn) {
      raidbotsBtn.className = 'px-4 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-950/90 hover:bg-amber-900 border border-amber-500/60 shadow flex items-center gap-1.5 transition';
    }
    if (raidbotsBtnText) {
      raidbotsBtnText.innerText = 'Abrir en Raidbots (Quick Sim)';
    }
  }
}

function exportResultToSimC(resultIndex) {
  currentSimcExportResultIndex = resultIndex;
  const res = (typeof currentOptimizationResults !== 'undefined' ? currentOptimizationResults : window.currentOptimizationResults)?.[resultIndex];
  if (!res) return;

  loadCharacterSimcDataFromStorage();
  switchSimcExportMode(currentSimcExportMode || 'quick');
  document.getElementById('simc-export-modal').classList.remove('hidden');
}

function closeSimcExportModal() {
  document.getElementById('simc-export-modal').classList.add('hidden');
}

function copySimcExportText() {
  const txt = document.getElementById('simc-export-text').value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(() => {
      const statusEl = document.getElementById('simc-copy-status');
      if (statusEl) statusEl.innerText = '¡Copiado con éxito para Raidbots / SimC!';
      showToast('¡Texto SimulationCraft / Raidbots copiado al portapapeles!');
    }).catch(() => {
      showToast('¡Texto SimulationCraft copiado!');
    });
  } else {
    showToast('¡Texto SimulationCraft listo para copiar!');
  }
}

function openCurrentModeInRaidbots() {
  copySimcExportText();
  const isTopGear = currentSimcExportMode === 'topgear';
  const targetUrl = isTopGear 
    ? 'https://www.raidbots.com/simbot/topgear'
    : 'https://www.raidbots.com/simbot/quick';

  showToast(`⚡ ¡SimC copiado! Abriendo Raidbots ${isTopGear ? 'Top Gear' : 'Quick Sim'}...`, 'info');
  window.open(targetUrl, '_blank');
}
