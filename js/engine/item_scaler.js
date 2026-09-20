// Item Scaling, Track Detection & Usability by Spec
const CLASS_ARMOR_TYPE = {
  warrior: 'plate',
  paladin: 'plate',
  deathknight: 'plate',
  hunter: 'mail',
  shaman: 'mail',
  evoker: 'mail',
  rogue: 'leather',
  druid: 'leather',
  monk: 'leather',
  demonhunter: 'leather',
  mage: 'cloth',
  warlock: 'cloth',
  priest: 'cloth'
};

const TIER_CLASS_RESTRICTIONS = {
  'skulking viper': 'hunter',
  'skyborne predator': 'hunter',
  'flame-wreathed': 'hunter',
  'consecrated flame': 'paladin',
  'heartfire': 'paladin',
  'zealot': 'paladin',
  'risen sacrifice': 'deathknight',
  'skullguard': 'deathknight',
  'exhumed centurion': 'deathknight',
  'ironbreaker': 'warrior',
  'warscythe': 'warrior',
  'molten vanguard': 'warrior',
  'deepest wilds': 'druid',
  'greatlynx': 'druid',
  'deathstalker': 'rogue',
  'spectral shadow': 'rogue',
  'aldrachi': 'demonhunter',
  'fel-scarred': 'demonhunter',
  'stormbringer': 'shaman',
  'totemic': 'shaman',
  'farseer': 'shaman',
  'weyrn': 'evoker',
  'flameshaper': 'evoker',
  'scalecommander': 'evoker',
  'wayward chronomancer': 'mage',
  'spellslinger': 'mage',
  'arcane tempest': 'mage',
  'diabolic': 'warlock',
  'hexflame': 'warlock',
  'hellcaller': 'warlock',
  'virtuous sun': 'priest',
  'benediction': 'priest'
};

function isRangedWeapon(name, it) {
  if (!name && !it?.name) return false;
  const n = (name || it?.name || '').toLowerCase();
  return n.includes('greatbow') || n.includes('longbow') || n.includes('shortbow') || n.includes('recurve') || 
         n.includes('bow') || n.includes('crossbow') || n.includes('arbalest') || 
         n.includes('gun') || n.includes('rifle') || n.includes('musket') || n.includes('blaster') || 
         n.includes('carbine') || n.includes('boomstick') || n.includes('firearm') ||
         it?.weaponType === 'ranged' || it?.weaponType === 'bow' || it?.weaponType === 'gun' || it?.weaponType === 'crossbow';
}

function detectArmorTypeFromTooltipHtml(html, name = '') {
  const h = html || '';
  const n = (name || '').toLowerCase();
  
  if (h.includes('scstart4:1') || h.includes('>Cloth<') || h.includes(' Cloth<') || h.includes('>Tela<')) return 'cloth';
  if (h.includes('scstart4:2') || h.includes('>Leather<') || h.includes(' Leather<') || h.includes('>Cuero<')) return 'leather';
  if (h.includes('scstart4:3') || h.includes('>Mail<') || h.includes(' Mail<') || h.includes('>Malla<')) return 'mail';
  if (h.includes('scstart4:4') || h.includes('>Plate<') || h.includes(' Plate<') || h.includes('>Placas<')) return 'plate';
  
  if (n.includes('plate') || n.includes('placas') || n.includes('cuirass') || n.includes('sabatons') || n.includes('pauldrons') || n.includes('greatbelt') || n.includes('zealot') || n.includes('consecrated') || n.includes('skullguard') || n.includes('ironbreaker') || n.includes('plated')) return 'plate';
  if (n.includes('mail') || n.includes('chainmail') || n.includes('hauberk') || n.includes('ringmail') || n.includes('scale') || n.includes('viper') || n.includes('chain') || n.includes('coiled legwraps') || n.includes('weeping fangs') || n.includes('hidepiercers')) return 'mail';
  if (n.includes('leather') || n.includes('cuero') || n.includes('tunic') || n.includes('jerkin') || n.includes('breeches') || n.includes('boots') || n.includes('grips') || n.includes('vest') || n.includes('breeches')) return 'leather';
  if (n.includes('cloth') || n.includes('silk') || n.includes('robe') || n.includes('vestment') || n.includes('satin') || n.includes('linen') || n.includes('cowl') || n.includes('mantle') || n.includes('shawl')) return 'cloth';
  
  return null;
}

function getSpecPrimaryStat(cls, specId) {
  const s = (specId || '').toLowerCase();
  if (cls === 'paladin') {
    if (s === 'holy' || s === 'holy_paladin') return 'int';
    return 'str';
  }
  if (cls === 'druid') {
    if (s === 'feral' || s === 'guardian') return 'agi';
    return 'int';
  }
  if (cls === 'shaman') {
    if (s === 'enhancement') return 'agi';
    return 'int';
  }
  if (cls === 'monk') {
    if (s === 'mistweaver') return 'int';
    return 'agi';
  }
  if (cls === 'warrior' || cls === 'deathknight') return 'str';
  if (cls === 'hunter' || cls === 'rogue' || cls === 'demonhunter') return 'agi';
  if (cls === 'mage' || cls === 'warlock' || cls === 'priest' || cls === 'evoker') return 'int';
  return 'int';
}

function detectPrimaryStatFromTooltip(html = '', rawText = '') {
  const h = (html || '') + ' ' + (rawText || '');
  const hasStrength = /<!--stat4-->|\+\s*[0-9,]+\s+Strength\b/i.test(h) || /\bStrength\b/i.test(h);
  const hasAgility = /<!--stat3-->|\+\s*[0-9,]+\s+Agility\b/i.test(h) || /\bAgility\b/i.test(h);
  const hasIntellect = /<!--stat5-->|\+\s*[0-9,]+\s+Intellect\b/i.test(h) || /\bIntellect\b/i.test(h);

  if (hasIntellect && hasStrength && hasAgility) return 'all';
  if (hasStrength && hasAgility && !hasIntellect) return 'str_agi';
  if (hasIntellect && hasAgility && !hasStrength) return 'int_agi';
  if (hasIntellect && hasStrength && !hasAgility) return 'int_str';
  if (hasIntellect && !hasStrength && !hasAgility) return 'int';
  if (hasStrength && !hasIntellect && !hasAgility) return 'str';
  if (hasAgility && !hasIntellect && !hasStrength) return 'agi';
  return null;
}

function isItemCrafted(it) {
  if (!it) return false;
  if (it.track === 'crafted') return true;
  if (it.craftedStatCodes && it.craftedStatCodes.length > 0) return true;
  if (it.rawSimcOptions && (it.rawSimcOptions.includes('crafted_stats=') || it.rawSimcOptions.includes('crafting_quality='))) return true;
  return false;
}

function isItemUsableBySpec(it, cls, specId) {
  if (!it) return true;

  const isCrafted = isItemCrafted(it);
  if (!isCrafted) {
    const specPrimary = getSpecPrimaryStat(cls, specId);
    const itemPrimary = it.primaryStat || (typeof metadataCache !== 'undefined' && it.itemId && metadataCache[it.itemId]?.primaryStat);

    if (itemPrimary && (it.slot === 'weapon_2h' || it.slot === 'weapon_1h' || it.slot === 'shield' || it.slot === 'trinket')) {
      if (specPrimary === 'int') {
        if (itemPrimary === 'str' || itemPrimary === 'agi' || itemPrimary === 'str_agi') return false;
      } else if (specPrimary === 'str') {
        if (itemPrimary === 'int' || itemPrimary === 'agi' || itemPrimary === 'int_agi') return false;
      } else if (specPrimary === 'agi') {
        if (itemPrimary === 'int' || itemPrimary === 'str' || itemPrimary === 'int_str') return false;
      }
    }
  }

  const ARMOR_SLOTS = ['head', 'shoulder', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet'];
  if (ARMOR_SLOTS.includes(it.slot)) {
    const n = (it.name || '').toLowerCase();
    for (const [tierKeyword, tierClass] of Object.entries(TIER_CLASS_RESTRICTIONS)) {
      if (n.includes(tierKeyword)) {
        if (cls !== tierClass) return false;
      }
    }

    const classArmor = CLASS_ARMOR_TYPE[cls];
    const itemArmor = it.armorType || (typeof metadataCache !== 'undefined' && it.itemId && metadataCache[it.itemId]?.armorType) || detectArmorTypeFromTooltipHtml('', it.name);
    if (classArmor && itemArmor && itemArmor !== classArmor) {
      return false;
    }
    return true;
  }

  if (it.slot !== 'weapon_2h' && it.slot !== 'weapon_1h' && it.slot !== 'shield') return true;

  const n = (it.name || '').toLowerCase();
  const isRanged = isRangedWeapon(it.name, it);
  const isShield = it.slot === 'shield' || n.includes('shield') || n.includes('buckler') || n.includes('bulwark') || n.includes('aegis') || n.includes('barricade') || n.includes('targe') || n.includes('pavise');
  const isOffhand = it.slot === 'shield' && !isShield;
  const is2H = it.slot === 'weapon_2h';
  const isStaffOrPolearm = n.includes('staff') || n.includes('stave') || n.includes('spire') || n.includes('polearm') || n.includes('spear') || n.includes('halberd') || n.includes('pike') || n.includes('glaive') || n.includes('scythe') || n.includes('lance');
  const isDagger = n.includes('dagger') || n.includes('knife') || n.includes('kris') || n.includes('shiv') || n.includes('dirk') || n.includes('shank') || n.includes('razor') || n.includes('skewer') || n.includes('scalpel');
  const isWand = n.includes('wand') || n.includes('baton');

  if (isRanged) {
    return cls === 'hunter' && (specId === 'beast_mastery' || specId === 'marksmanship');
  }

  if (cls === 'hunter' && (specId === 'beast_mastery' || specId === 'marksmanship')) {
    return false;
  }

  if (cls === 'hunter' && specId === 'survival') {
    if (isShield || isOffhand || isWand) return false;
    return true;
  }

  if (cls === 'rogue') {
    if (is2H || isShield || isOffhand || isWand) return false;
    return true;
  }

  if (cls === 'demonhunter') {
    if (is2H || isShield || isOffhand || isDagger || isWand) return false;
    return true;
  }

  if (cls === 'paladin') {
    if (isWand || isDagger) return false;
    if (specId === 'retribution') {
      if (!is2H || isShield || isOffhand) return false;
      return true;
    }
    if (specId === 'protection' || specId === 'protection_paladin') {
      if (is2H || isOffhand) return false;
      return true;
    }
    if (specId === 'holy' || specId === 'holy_paladin') {
      if (isOffhand || is2H) return false;
      return true;
    }
  }

  if (cls === 'warrior') {
    if (isWand || isOffhand) return false;
    if (specId === 'arms') {
      if (!is2H || isShield) return false;
      return true;
    }
    if (specId === 'fury') {
      if (isShield) return false;
      return true;
    }
    if (specId === 'prot_warrior' || specId === 'protection') {
      if (is2H) return false;
      return true;
    }
  }

  if (cls === 'deathknight') {
    if (isShield || isOffhand || isWand || isDagger) return false;
    if (specId === 'blood' || specId === 'unholy') {
      if (!is2H) return false;
      return true;
    }
    return true;
  }

  if (cls === 'mage' || cls === 'warlock' || cls === 'priest') {
    if (isShield) return false;
    if (is2H && !n.includes('staff') && !n.includes('stave') && !n.includes('spire')) return false;
    return true;
  }

  if (cls === 'druid') {
    if (isShield || isWand) return false;
    if (specId === 'feral' || specId === 'guardian') {
      if (!is2H || isOffhand) return false;
      return true;
    }
    return true;
  }

  if (cls === 'monk') {
    if (isShield || isWand || isDagger) return false;
    if (is2H && !isStaffOrPolearm) return false;
    return true;
  }

  if (cls === 'shaman') {
    if (isWand) return false;
    if (specId === 'enhancement') {
      if (is2H || isShield || isOffhand) return false;
      return true;
    }
    if (specId === 'elemental' || specId === 'restoration_shaman' || specId === 'restoration') {
      if (is2H && !n.includes('staff') && !n.includes('stave') && !n.includes('spire')) return false;
      return true;
    }
  }

  if (cls === 'evoker') {
    if (isShield || isWand) return false;
    if (is2H && !n.includes('staff') && !n.includes('stave') && !n.includes('spire')) return false;
    return true;
  }

  return true;
}

function scaleStatByIlvl(baseStat, baseIlvl = 321, targetIlvl = 321) {
  if (!baseStat || baseIlvl === targetIlvl || !targetIlvl) return baseStat || 0;
  const factor = Math.pow(1.0115, targetIlvl - baseIlvl);
  return Math.round(baseStat * factor);
}

function findKnownItemInfo(name, itemId) {
  return null;
}
