// SIMULATIONCRAFT PARSER WITH TRINKETS, TRACK DETECTION & LIVE WOWHEAD API SYNC
let lastImportedSimcText = '';
let characterSimcData = {
  name: 'Hero',
  level: 90,
  race: 'blood_elf',
  region: 'us',
  server: 'ragnaros',
  role: 'attack',
  professions: '',
  talents: '',
  omnium_talents: '',
  hero_talents: ''
};

function loadCharacterSimcDataFromStorage() {
  try {
    const raw = localStorage.getItem('wow_char_simc_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) characterSimcData = { ...characterSimcData, ...parsed };
    }
  } catch (e) {}
}

function saveCharacterSimcDataToStorage() {
  try {
    localStorage.setItem('wow_char_simc_data', JSON.stringify(characterSimcData));
  } catch (e) {}
}

async function parseAndImportSimC() {
  const text = document.getElementById('simc-input').value;
  if (!text.trim()) {
    alert('Por favor, pega el texto de SimulationCraft.');
    return;
  }

  const statusEl = document.getElementById('simc-status');
  if (statusEl) statusEl.innerText = 'Analizando texto de SimulationCraft...';

  lastImportedSimcText = text;
  try {
    localStorage.setItem('wow_last_imported_simc_raw', text);
  } catch (e) {}

  const simcClassRegex = /^(?:#\s*)?(death_knight|deathknight|demon_hunter|demonhunter|druid|evoker|hunter|mage|monk|paladin|priest|rogue|shaman|warlock|warrior)\s*=\s*["']?([^"'\r\n]+)["']?/im;
  const classHeaderMatch = text.match(simcClassRegex);
  if (classHeaderMatch) {
    characterSimcData.name = classHeaderMatch[2].trim();
  }

  const levelMatch = text.match(/^(?:#\s*)?level\s*=\s*(\d+)/im);
  if (levelMatch) characterSimcData.level = parseInt(levelMatch[1]);

  const raceMatch = text.match(/^(?:#\s*)?race\s*=\s*([a-z0-9_]+)/im);
  if (raceMatch) characterSimcData.race = raceMatch[1].toLowerCase().trim();

  const regionMatch = text.match(/^(?:#\s*)?region\s*=\s*([a-z0-9_]+)/im);
  if (regionMatch) characterSimcData.region = regionMatch[1].toLowerCase().trim();

  const serverMatch = text.match(/^(?:#\s*)?server\s*=\s*([^\r\n]+)/im);
  if (serverMatch) characterSimcData.server = serverMatch[1].trim();

  const roleMatch = text.match(/^(?:#\s*)?role\s*=\s*([a-z0-9_]+)/im);
  if (roleMatch) characterSimcData.role = roleMatch[1].toLowerCase().trim();

  const profMatch = text.match(/^(?:#\s*)?professions\s*=\s*([^\r\n]+)/im);
  if (profMatch) characterSimcData.professions = profMatch[1].trim();

  const talentMatch = text.match(/^(?:#\s*)?talents\s*=\s*([^\r\n]+)/im);
  if (talentMatch) characterSimcData.talents = talentMatch[1].trim();

  const omniumTalentMatch = text.match(/^(?:#\s*)?omnium_talents\s*=\s*([^\r\n]+)/im);
  if (omniumTalentMatch) characterSimcData.omnium_talents = omniumTalentMatch[1].trim();

  const heroTalentMatch = text.match(/^(?:#\s*)?hero_talents\s*=\s*([^\r\n]+)/im);
  if (heroTalentMatch) characterSimcData.hero_talents = heroTalentMatch[1].trim();

  saveCharacterSimcDataToStorage();

  const simcClassMap = {
    'death_knight': 'deathknight', 'deathknight': 'deathknight',
    'demon_hunter': 'demonhunter', 'demonhunter': 'demonhunter',
    'druid': 'druid', 'evoker': 'evoker', 'hunter': 'hunter',
    'mage': 'mage', 'monk': 'monk', 'paladin': 'paladin',
    'priest': 'priest', 'rogue': 'rogue', 'shaman': 'shaman',
    'warlock': 'warlock', 'warrior': 'warrior'
  };

  let detectedClass = null;
  for (const [simcKey, appClass] of Object.entries(simcClassMap)) {
    if (new RegExp(`^${simcKey}=`, 'im').test(text)) {
      detectedClass = appClass;
      break;
    }
  }

  const specMatch = text.match(/^spec=([a-z0-9_]+)/im);
  let detectedRawSpec = specMatch ? specMatch[1].toLowerCase().trim() : null;

  if (detectedClass && WOW_CLASSES[detectedClass]) {
    currentClass = detectedClass;
    if (document.getElementById('char-class')) document.getElementById('char-class').value = currentClass;
    updateClassTheme();
    
    const classData = WOW_CLASSES[currentClass];
    const specSelect = document.getElementById('char-spec');
    if (specSelect) specSelect.innerHTML = classData.specs.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    let matchedSpecId = classData.specs[0].id;
    if (detectedRawSpec) {
      const aliasKey = currentClass + '_' + detectedRawSpec.replace(/[^a-z0-9_]/g, '');
      const SPEC_ALIASES = {
        'deathknight_blood': 'blood', 'deathknight_frost': 'frost_dk', 'deathknight_unholy': 'unholy',
        'demonhunter_havoc': 'havoc', 'demonhunter_vengeance': 'vengeance',
        'druid_balance': 'balance', 'druid_feral': 'feral', 'druid_guardian': 'guardian', 'druid_restoration': 'restoration_druid',
        'evoker_devastation': 'devastation', 'evoker_preservation': 'preservation', 'evoker_augmentation': 'augmentation',
        'hunter_beast_mastery': 'beast_mastery', 'hunter_beastmastery': 'beast_mastery', 'hunter_marksmanship': 'marksmanship', 'hunter_survival': 'survival',
        'mage_arcane': 'arcane', 'mage_fire': 'fire', 'mage_frost': 'frost_mage',
        'monk_brewmaster': 'brewmaster', 'monk_windwalker': 'windwalker', 'monk_mistweaver': 'mistweaver',
        'paladin_retribution': 'retribution', 'paladin_protection': 'protection', 'paladin_holy': 'holy',
        'priest_shadow': 'shadow', 'priest_discipline': 'discipline', 'priest_holy': 'holy_priest',
        'rogue_assassination': 'assassination', 'rogue_outlaw': 'outlaw', 'rogue_subtlety': 'subtlety',
        'shaman_elemental': 'elemental', 'shaman_enhancement': 'enhancement', 'shaman_restoration': 'restoration_shaman',
        'warlock_affliction': 'affliction', 'warlock_demonology': 'demonology', 'warlock_destruction': 'destruction',
        'warrior_arms': 'arms', 'warrior_fury': 'fury', 'warrior_protection': 'prot_warrior'
      };
      if (SPEC_ALIASES[aliasKey]) {
        matchedSpecId = SPEC_ALIASES[aliasKey];
      } else {
        const found = classData.specs.find(s => s.id === detectedRawSpec || s.id.includes(detectedRawSpec) || detectedRawSpec.includes(s.id));
        if (found) matchedSpecId = found.id;
      }
    }

    const savedLoadoutIdx = text.indexOf('# Saved Loadout:');
    const gearBagsIdx = text.indexOf('# Gear from Bags');
    const vaultIdx = text.indexOf('Great Vault');
    const weeklyVaultIdx = text.indexOf('Weekly Reward');
    const firstItemIdx = text.search(/^[a-z0-9_]+=,id=\d+/m);
    let cutoff = text.length;
    if (savedLoadoutIdx !== -1 && savedLoadoutIdx < cutoff) cutoff = savedLoadoutIdx;
    if (gearBagsIdx !== -1 && gearBagsIdx < cutoff) cutoff = gearBagsIdx;
    if (vaultIdx !== -1 && vaultIdx < cutoff) cutoff = vaultIdx;
    if (weeklyVaultIdx !== -1 && weeklyVaultIdx < cutoff) cutoff = weeklyVaultIdx;
    if (firstItemIdx !== -1 && firstItemIdx < cutoff) cutoff = firstItemIdx;
    activeHeaderText = text.substring(0, cutoff).toLowerCase();

    const heroTalentMap = {
      'herald': 'herald', 'herald of the sun': 'herald',
      'templar': 'templar',
      'lightsmith': 'lightsmith',
      'sentinel': 'sentinel',
      'pack_leader': 'packleader', 'pack leader': 'packleader', 'packleader': 'packleader',
      'dark_ranger': 'dark_ranger', 'dark ranger': 'dark_ranger',
      'slayer': 'slayer',
      'colossus': 'colossus',
      'mountain_thane': 'mountain_thane', 'mountain thane': 'mountain_thane',
      'deathbringer': 'deathbringer',
      'sanlayn': 'sanlayn',
      'rider': 'rider', 'rider of the apocalypse': 'rider',
      'stormbringer': 'stormbringer',
      'farseer': 'farseer',
      'totemic': 'totemic',
      'deathstalker': 'deathstalker',
      'fatebound': 'fatebound',
      'trickster': 'trickster',
      'shado_pan': 'shado_pan', 'shado-pan': 'shado_pan',
      'master_of_harmony': 'master_of_harmony', 'master of harmony': 'master_of_harmony',
      'conduit': 'conduit_of_the_celestials',
      'aldrachi_reaver': 'aldrachi_reaver', 'aldrachi reaver': 'aldrachi_reaver',
      'fel_scarred': 'fel_scarred', 'fel-scarred': 'fel_scarred', 'fel scarred': 'fel_scarred',
      'elune': 'elunes_chosen',
      'keeper_of_the_grove': 'keeper_of_the_grove', 'keeper of the grove': 'keeper_of_the_grove',
      'wildstalker': 'wildstalker',
      'druid_of_the_claw': 'druid_of_the_claw',
      'sunfury': 'sunfury',
      'frostfire': 'frostfire',
      'spellslinger': 'spellslinger',
      'diabolist': 'diabolist',
      'hellcaller': 'hellcaller',
      'soul_harvester': 'soul_harvester', 'soul harvester': 'soul_harvester',
      'archon': 'archon',
      'oracle': 'oracle',
      'voidweaver': 'voidweaver',
      'chronowarden': 'chronowarden',
      'flameshaper': 'flameshaper',
      'scalecommander': 'scalecommander'
    };

    currentSpec = matchedSpecId;
    if (specSelect) specSelect.value = currentSpec;
    onSpecChange();

    const specObj = classData.specs.find(s => s.id === currentSpec);
    const availableTrees = specObj?.heroTrees || [];

    let detectedHeroTree = null;
    for (const [k, v] of Object.entries(heroTalentMap)) {
      if (activeHeaderText.includes(k)) {
        const isApplicable = availableTrees.some(t => t.id === v || v.includes(t.id) || t.id.includes(v));
        if (isApplicable) {
          detectedHeroTree = v;
          break;
        }
      }
    }
    if (!detectedHeroTree) {
      if (activeHeaderText.includes('136814')) detectedHeroTree = 'sentinel';
      else if (activeHeaderText.includes('136818')) detectedHeroTree = 'packleader';
      else if (activeHeaderText.includes('136817')) detectedHeroTree = 'dark_ranger';
    }

    const activeMeta = getSpecMetaHeroTree(currentClass, currentSpec);
    const resolvedTree = detectedHeroTree || activeMeta || availableTrees[0]?.id;
    if (resolvedTree) {
      applyHeroTree(resolvedTree);
    }
  }

  const lines = text.split('\n');
  const parsedItems = [];
  let currentItemName = '';
  let currentIlvl = 321;

  const slotMapping = {
    'head': 'head', 'neck': 'neck', 'shoulder': 'shoulder', 'back': 'back',
    'chest': 'chest', 'wrist': 'wrist', 'hands': 'hands', 'waist': 'waist',
    'legs': 'legs', 'feet': 'feet', 'finger1': 'finger', 'finger2': 'finger',
    'trinket1': 'trinket', 'trinket2': 'trinket', 'main_hand': 'weapon_2h', 'off_hand': 'shield'
  };

  let inBags = false;
  let inVault = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.includes('End of Weekly Reward Choices') || line.includes('End of Great Vault')) {
      inVault = false;
      inBags = true;
      continue;
    }

    if (line.includes('Great Vault Options') || line.includes('Great Vault') || line.includes('Weekly Reward Choices') || line.includes('Weekly Reward')) {
      inVault = true;
      inBags = true;
      continue;
    }

    if (line.includes('Gear from Bags')) {
      inVault = false;
      inBags = true;
      continue;
    }

    const nameMatch = line.match(/^#\s*([A-Za-z0-9\s',-]+)\s*\((\d+)\)/);
    if (nameMatch) {
      currentItemName = nameMatch[1].trim();
      currentIlvl = parseInt(nameMatch[2]) || 321;
      continue;
    }

    const slotMatch = line.match(/^(?:#\s*)?([a-z0-9_]+)=,id=(\d+)(.*)/i);
    if (slotMatch) {
      const simcSlot = slotMatch[1].toLowerCase();
      const itemId = parseInt(slotMatch[2]);
      const rawSimcOptions = slotMatch[3] ? slotMatch[3].trim() : '';
      let appSlot = slotMapping[simcSlot];

      if (!appSlot) continue;

      if (simcSlot === 'main_hand') {
        appSlot = detectWeaponSlotFromName(currentItemName);
      } else if (simcSlot === 'off_hand') {
        const detected = detectWeaponSlotFromName(currentItemName);
        appSlot = (detected === 'weapon_1h') ? 'weapon_1h' : 'shield';
      }

      let track = 'hero';
      if (currentIlvl >= 325) track = 'myth';
      else if (currentIlvl >= 305) track = 'hero';
      else if (currentIlvl >= 292) track = 'champ';
      else if (currentIlvl >= 279) track = 'vet';
      else track = 'adventurer';

      const cachedMeta = metadataCache[itemId];
      const known = findKnownItemInfo(currentItemName, itemId) || {
        itemId: itemId,
        slot: (simcSlot === 'main_hand' || simcSlot === 'off_hand') ? (cachedMeta?.slot || appSlot) : appSlot,
        track: track,
        baseIlvl: cachedMeta?.baseIlvl || 321,
        crit: (cachedMeta && cachedMeta.crit !== undefined) ? cachedMeta.crit : 0,
        haste: (cachedMeta && cachedMeta.haste !== undefined) ? cachedMeta.haste : 0,
        mastery: (cachedMeta && cachedMeta.mastery !== undefined) ? cachedMeta.mastery : 0,
        vers: (cachedMeta && cachedMeta.vers !== undefined) ? cachedMeta.vers : 0,
        icon: cachedMeta?.icon || SLOT_FALLBACK_ICONS[appSlot] || 'inv_misc_questionmark',
        tier: (cachedMeta && cachedMeta.tier !== undefined) ? cachedMeta.tier : false,
        socket: line.includes('gem_id=') || line.includes('gems=')
      };

      const critMatch = line.match(/(?:crit|crit_rating)\s*=\s*(\d+)/i) || (currentItemName && currentItemName.match(/\+\s*(\d+)\s*(?:crit|c\b)/i));
      const hasteMatch = line.match(/(?:haste|haste_rating)\s*=\s*(\d+)/i) || (currentItemName && currentItemName.match(/\+\s*(\d+)\s*(?:haste|h\b)/i));
      const mastMatch = line.match(/(?:mastery|mast|mastery_rating)\s*=\s*(\d+)/i) || (currentItemName && currentItemName.match(/\+\s*(\d+)\s*(?:mastery|mast|m\b)/i));
      const versMatch = line.match(/(?:vers|versatility|vers_rating)\s*=\s*(\d+)/i) || (currentItemName && currentItemName.match(/\+\s*(\d+)\s*(?:vers|versatility|v\b)/i));

      const hasSocket = line.includes('gem_id=') || 
                        line.includes('gems=') || 
                        line.includes('gem1=') || 
                        line.includes('sock=') ||
                        line.includes('/5666');

      const redirectedMatch = line.match(/redirected_base_stats=(\d+)/i);
      const redirectedStatId = redirectedMatch ? parseInt(redirectedMatch[1]) : null;

      const isTierSlot = ['head', 'shoulder', 'chest', 'hands', 'legs'].includes(appSlot);
      const isTier = isTierSlot && (!!cachedMeta?.tier || (redirectedStatId !== null && isTierSlot) || !!known.tier);

      const baseIlvl = known.baseIlvl || 321;
      let finalCrit = critMatch ? parseInt(critMatch[1]) : scaleStatByIlvl(known.crit || 0, baseIlvl, currentIlvl);
      let finalHaste = hasteMatch ? parseInt(hasteMatch[1]) : scaleStatByIlvl(known.haste || 0, baseIlvl, currentIlvl);
      let finalMast = mastMatch ? parseInt(mastMatch[1]) : scaleStatByIlvl(known.mastery || 0, baseIlvl, currentIlvl);
      let finalVers = versMatch ? parseInt(versMatch[1]) : scaleStatByIlvl(known.vers || 0, baseIlvl, currentIlvl);

      const craftedMatch = line.match(/crafted_stats=(\d+)\/(\d+)/i);
      let hasCraftedStats = false;
      let craftedStatCodes = null;
      if (craftedMatch) {
        hasCraftedStats = true;
        craftedStatCodes = [parseInt(craftedMatch[1]), parseInt(craftedMatch[2])];
      }

      parsedItems.push({
        id: 'simc_' + itemId + '_' + Math.random().toString(36).substr(2, 4),
        name: currentItemName || ('Objeto #' + itemId),
        itemId: itemId,
        rawSimcOptions: rawSimcOptions,
        redirectedStatId: redirectedStatId,
        craftedStatCodes: craftedStatCodes,
        ilvl: currentIlvl,
        slot: (simcSlot === 'main_hand' || simcSlot === 'off_hand') ? (cachedMeta?.slot || appSlot) : appSlot,
        equippedSlot: inBags ? null : simcSlot,
        track: known.track || track,
        icon: cachedMeta?.icon || known.icon || SLOT_FALLBACK_ICONS[appSlot],
        crit: finalCrit,
        haste: finalHaste,
        mastery: finalMast,
        vers: finalVers,
        tier: isTier,
        socket: hasSocket,
        hasCraftedStats: hasCraftedStats,
        isEquipped: !inBags,
        isVault: !!inVault,
        disabled: false
      });

      currentItemName = '';
    }
  }

  if (parsedItems.length === 0) {
    alert('No se detectaron objetos compatibles en el texto.');
    if (statusEl) statusEl.innerText = 'Listo para procesar tu equipo equipado y bolsas.';
    return;
  }

  for (let idx = 0; idx < parsedItems.length; idx++) {
    const it = parsedItems[idx];
    if (statusEl) {
      statusEl.innerText = `Sincronizando con Wowhead (${idx + 1}/${parsedItems.length}): ${it.name}...`;
    }
    try {
      const statSourceId = it.redirectedStatId || it.itemId;
      let itBonus = '';
      if (it.rawSimcOptions) {
        const bm = it.rawSimcOptions.match(/bonus_id=([0-9/]+)/i);
        if (bm) itBonus = bm[1].replace(/\//g, ':');
      }
      let itEnchId = null;
      if (it.rawSimcOptions) {
        const em = it.rawSimcOptions.match(/enchant_id=(\d+)/i);
        if (em) itEnchId = Number(em[1]);
      }
      const statMeta = await fetchWowheadItemMetadata(statSourceId, it.ilvl, itBonus, itEnchId);
      if (statMeta) {
        if (statMeta.track) {
          it.track = statMeta.track;
        }
        const hasDirectStats = (statMeta.crit || 0) > 0 || (statMeta.haste || 0) > 0 || (statMeta.mastery || 0) > 0 || (statMeta.vers || 0) > 0;
        if (hasDirectStats) {
          it.crit = statMeta.crit || 0;
          it.haste = statMeta.haste || 0;
          it.mastery = statMeta.mastery || 0;
          it.vers = statMeta.vers || 0;
        } else if (it.hasCraftedStats && it.craftedStatCodes) {
          const [s1, s2] = it.craftedStatCodes;
          let val1 = statMeta.randomStat1 || 0;
          let val2 = statMeta.randomStat2 || 0;
          if (val1 === 0 && val2 === 0) {
            const slotBudgets = { head: 182, shoulder: 137, chest: 182, back: 104, wrist: 104, hands: 137, waist: 137, legs: 182, feet: 137, neck: 300, finger: 300, trinket: 120, weapon_2h: 198, weapon_1h: 99, shield: 99 };
            const b = scaleStatByIlvl(slotBudgets[it.slot] || 112, 321, it.ilvl);
            val1 = Math.round(b / 2);
            val2 = b - val1;
          }
          it.crit = 0; it.haste = 0; it.mastery = 0; it.vers = 0;
          const addSt = (code, val) => {
            if (code === 32) it.crit += val;
            else if (code === 36) it.haste += val;
            else if (code === 40) it.vers += val;
            else if (code === 49) it.mastery += val;
          };
          addSt(s1, val1);
          addSt(s2, val2);
        } else {
          it.crit = statMeta.crit || 0;
          it.haste = statMeta.haste || 0;
          it.mastery = statMeta.mastery || 0;
          it.vers = statMeta.vers || 0;
        }
      }

      const baseMeta = await fetchWowheadItemMetadata(it.itemId, it.ilvl, itBonus);
      if (baseMeta) {
        if (baseMeta.name && (it.name.startsWith('Objeto #') || !it.name)) it.name = baseMeta.name;
        if (baseMeta.icon) it.icon = baseMeta.icon;
        if (baseMeta.slot && (it.slot === 'weapon_2h' || it.slot === 'weapon_1h' || it.slot === 'shield')) it.slot = baseMeta.slot;
        if (baseMeta.armorType) it.armorType = baseMeta.armorType;
        if (baseMeta.primaryStat) it.primaryStat = baseMeta.primaryStat;
        if (baseMeta.tier !== undefined && ['head', 'shoulder', 'chest', 'hands', 'legs'].includes(it.slot)) it.tier = baseMeta.tier;
      }
      if (!it.armorType) {
        it.armorType = detectArmorTypeFromTooltipHtml('', it.name);
      }
    } catch (e) {}
  }

  const overwrite = document.getElementById('simc-overwrite')?.checked;
  if (overwrite) {
    items = parsedItems;
  } else {
    for (const it of parsedItems) {
      const existingIdx = items.findIndex(x => x.name.toLowerCase() === it.name.toLowerCase() && x.ilvl === it.ilvl && x.slot === it.slot);
      if (existingIdx >= 0) {
        items[existingIdx].rawSimcOptions = it.rawSimcOptions || items[existingIdx].rawSimcOptions;
        items[existingIdx].socket = it.socket;
        items[existingIdx].crit = it.crit;
        items[existingIdx].haste = it.haste;
        items[existingIdx].mastery = it.mastery;
        items[existingIdx].vers = it.vers;
        items[existingIdx].tier = it.tier;
        items[existingIdx].primaryStat = it.primaryStat || items[existingIdx].primaryStat;
        items[existingIdx].isEquipped = it.isEquipped;
        items[existingIdx].isVault = it.isVault !== undefined ? it.isVault : items[existingIdx].isVault;
      } else {
        items.push(it);
      }
    }
  }

  saveState();
  if (typeof closeSimcModal === 'function') closeSimcModal();
  if (typeof renderInventory === 'function') renderInventory();
  if (typeof runOptimizer === 'function') runOptimizer();
  if (typeof resolveAllItemIconsAsync === 'function') resolveAllItemIconsAsync();
  if (typeof showToast === 'function') showToast(`¡Se importaron ${parsedItems.length} objetos con estadísticas reales!`);
}
