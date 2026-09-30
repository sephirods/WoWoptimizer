// Gear Set Comparator UI Modal & Enchant / Gem Inspector

const MIDNIGHT_GEM_STATS_MAP = {
  240983: { primary: 32, crit: 0, haste: 0, mast: 0, vers: 0 }, // Meta Diamond
  240904: { crit: 20, haste: 0, mast: 0, vers: 0 }, // Pure Crit
  240888: { crit: 0, haste: 20, mast: 0, vers: 0 }, // Pure Haste
  240896: { crit: 0, haste: 0, mast: 20, vers: 0 }, // Pure Mast
  240912: { crit: 0, haste: 0, mast: 0, vers: 20 }, // Pure Vers
  240906: { crit: 16, haste: 7, mast: 0, vers: 0 }, // Crit + Haste
  240908: { crit: 16, haste: 0, mast: 7, vers: 0 }, // Crit + Mast
  240910: { crit: 16, haste: 0, mast: 0, vers: 7 }, // Crit + Vers
  240890: { crit: 7, haste: 16, mast: 0, vers: 0 }, // Haste + Crit
  240892: { crit: 0, haste: 16, mast: 7, vers: 0 }, // Haste + Mast
  240894: { crit: 0, haste: 16, mast: 0, vers: 7 }, // Haste + Vers
  240898: { crit: 7, haste: 0, mast: 16, vers: 0 }, // Mast + Crit
  240900: { crit: 0, haste: 7, mast: 16, vers: 0 }, // Mast + Haste
  240902: { crit: 0, haste: 0, mast: 16, vers: 7 }, // Mast + Vers
  240914: { crit: 7, haste: 0, mast: 0, vers: 16 }, // Vers + Crit
  240916: { crit: 0, haste: 7, mast: 0, vers: 16 }, // Vers + Haste
  240918: { crit: 0, haste: 0, mast: 7, vers: 16 }  // Vers + Mast
};

function getItemGemId(it) {
  if (!it) return null;
  if (it.gem_id) return Number(it.gem_id);
  if (it.gemItemId) return Number(it.gemItemId);
  if (it.rawSimcOptions) {
    const gm = it.rawSimcOptions.match(/gem_id=(\d+)/i) || 
              it.rawSimcOptions.match(/gems=([\d/]+)/i) || 
              it.rawSimcOptions.match(/gem1=(\d+)/i);
    if (gm) return Number(gm[1].split('/')[0]);
  }
  return null;
}

function getItemGemStats(it) {
  if (!it || !it.socket) return { crit: 0, haste: 0, mast: 0, vers: 0, gemId: null };
  const gemId = getItemGemId(it);
  if (gemId && MIDNIGHT_GEM_STATS_MAP[gemId]) {
    return { ...MIDNIGHT_GEM_STATS_MAP[gemId], gemId };
  }
  return { crit: 0, haste: 0, mast: 0, vers: 0, gemId };
}

// OFFICIAL MIDNIGHT SEASON 2 ENCHANTS DATABASE
const MIDNIGHT_ENCHANTS_DB = {
  // Head
  7958: { id: 7958, name: "Enchant Helm - Hex of Leeching", slot: "Head" },
  7959: { id: 7959, name: "Enchant Helm - Hex of Leeching", slot: "Head" },
  7960: { id: 7960, name: "Enchant Helm - Empowered Hex of Leeching", slot: "Head" },
  7961: { id: 7961, name: "Enchant Helm - Empowered Hex of Leeching", slot: "Head" },
  7988: { id: 7988, name: "Enchant Helm - Blessing of Speed", slot: "Head" },
  7989: { id: 7989, name: "Enchant Helm - Blessing of Speed", slot: "Head" },
  7990: { id: 7990, name: "Enchant Helm - Empowered Blessing of Speed", slot: "Head" },
  7991: { id: 7991, name: "Enchant Helm - Empowered Blessing of Speed", slot: "Head" },
  8014: { id: 8014, name: "Enchant Helm - Rune of Avoidance", slot: "Head" },
  8015: { id: 8015, name: "Enchant Helm - Rune of Avoidance", slot: "Head" },
  8016: { id: 8016, name: "Enchant Helm - Empowered Rune of Avoidance", slot: "Head" },
  8017: { id: 8017, name: "Enchant Helm - Empowered Rune of Avoidance", slot: "Head" },
  // Shoulder
  7970: { id: 7970, name: "Enchant Shoulders - Flight of the Eagle", slot: "Shoulder" },
  7971: { id: 7971, name: "Enchant Shoulders - Flight of the Eagle", slot: "Shoulder" },
  7972: { id: 7972, name: "Enchant Shoulders - Akil'zon's Swiftness", slot: "Shoulder" },
  7973: { id: 7973, name: "Enchant Shoulders - Akil'zon's Swiftness", slot: "Shoulder" },
  7998: { id: 7998, name: "Enchant Shoulders - Nature's Grace", slot: "Shoulder" },
  7999: { id: 7999, name: "Enchant Shoulders - Nature's Grace", slot: "Shoulder" },
  8000: { id: 8000, name: "Enchant Shoulders - Amirdrassil's Grace", slot: "Shoulder" },
  8001: { id: 8001, name: "Enchant Shoulders - Amirdrassil's Grace", slot: "Shoulder" },
  8028: { id: 8028, name: "Enchant Shoulders - Thalassian Recovery", slot: "Shoulder" },
  8029: { id: 8029, name: "Enchant Shoulders - Thalassian Recovery", slot: "Shoulder" },
  8030: { id: 8030, name: "Enchant Shoulders - Silvermoon's Mending", slot: "Shoulder" },
  8031: { id: 8031, name: "Enchant Shoulders - Silvermoon's Mending", slot: "Shoulder" },
  // Chest
  7956: { id: 7956, name: "Enchant Chest - Mark of Nalorakk", slot: "Chest" },
  7957: { id: 7957, name: "Enchant Chest - Mark of Nalorakk", slot: "Chest" },
  7984: { id: 7984, name: "Enchant Chest - Mark of the Rootwarden", slot: "Chest" },
  7985: { id: 7985, name: "Enchant Chest - Mark of the Rootwarden", slot: "Chest" },
  7986: { id: 7986, name: "Enchant Chest - Mark of the Worldsoul", slot: "Chest" },
  7987: { id: 7987, name: "Enchant Chest - Mark of the Worldsoul", slot: "Chest" },
  8012: { id: 8012, name: "Enchant Chest - Mark of the Magister", slot: "Chest" },
  8013: { id: 8013, name: "Enchant Chest - Mark of the Magister", slot: "Chest" },
  // Legs
  7934: { id: 7934, name: "Sunfire Silk Spellthread", slot: "Legs" },
  7935: { id: 7935, name: "Sunfire Silk Spellthread", slot: "Legs" },
  7936: { id: 7936, name: "Arcanoweave Spellthread", slot: "Legs" },
  7937: { id: 7937, name: "Arcanoweave Spellthread", slot: "Legs" },
  8150: { id: 8150, name: "Stormbound Armor Kit", slot: "Legs" },
  8151: { id: 8151, name: "Stormbound Armor Kit", slot: "Legs" },
  8152: { id: 8152, name: "Stormbound Armor Kit", slot: "Legs" },
  8153: { id: 8153, name: "Stormbound Armor Kit", slot: "Legs" },
  8154: { id: 8154, name: "Stormbound Armor Kit", slot: "Legs" },
  8155: { id: 8155, name: "Stormbound Armor Kit", slot: "Legs" },
  8156: { id: 8156, name: "Stormbound Armor Kit", slot: "Legs" },
  8157: { id: 8157, name: "Stormbound Armor Kit", slot: "Legs" },
  8158: { id: 8158, name: "Forest Hunter's Armor Kit", slot: "Legs" },
  8159: { id: 8159, name: "Forest Hunter's Armor Kit", slot: "Legs" },
  8160: { id: 8160, name: "Stormbound Armor Kit", slot: "Legs" },
  8161: { id: 8161, name: "Stormbound Armor Kit", slot: "Legs" },
  8162: { id: 8162, name: "Blood Knight's Armor Kit", slot: "Legs" },
  8163: { id: 8163, name: "Blood Knight's Armor Kit", slot: "Legs" },
  // Feet
  7962: { id: 7962, name: "Enchant Boots - Lynx's Dexterity", slot: "Feet" },
  7963: { id: 7963, name: "Enchant Boots - Lynx's Dexterity", slot: "Feet" },
  7992: { id: 7992, name: "Enchant Boots - Shaladrassil's Roots", slot: "Feet" },
  7993: { id: 7993, name: "Enchant Boots - Shaladrassil's Roots", slot: "Feet" },
  8018: { id: 8018, name: "Enchant Boots - Farstrider's Hunt", slot: "Feet" },
  8019: { id: 8019, name: "Enchant Boots - Farstrider's Hunt", slot: "Feet" },
  // Ring
  7964: { id: 7964, name: "Enchant Ring - Amani Mastery", slot: "Ring" },
  7965: { id: 7965, name: "Enchant Ring - Amani Mastery", slot: "Ring" },
  7966: { id: 7966, name: "Enchant Ring - Eyes of the Eagle", slot: "Ring" },
  7967: { id: 7967, name: "Enchant Ring - Eyes of the Eagle", slot: "Ring" },
  7968: { id: 7968, name: "Enchant Ring - Zul'jin's Mastery", slot: "Ring" },
  7969: { id: 7969, name: "Enchant Ring - Zul'jin's Mastery", slot: "Ring" },
  7994: { id: 7994, name: "Enchant Ring - Nature's Wrath", slot: "Ring" },
  7995: { id: 7995, name: "Enchant Ring - Nature's Wrath", slot: "Ring" },
  7996: { id: 7996, name: "Enchant Ring - Nature's Fury", slot: "Ring" },
  7997: { id: 7997, name: "Enchant Ring - Nature's Fury", slot: "Ring" },
  8020: { id: 8020, name: "Enchant Ring - Thalassian Haste", slot: "Ring" },
  8021: { id: 8021, name: "Enchant Ring - Thalassian Haste", slot: "Ring" },
  8022: { id: 8022, name: "Enchant Ring - Thalassian Versatility", slot: "Ring" },
  8023: { id: 8023, name: "Enchant Ring - Thalassian Versatility", slot: "Ring" },
  8024: { id: 8024, name: "Enchant Ring - Silvermoon's Alacrity", slot: "Ring" },
  8025: { id: 8025, name: "Enchant Ring - Silvermoon's Alacrity", slot: "Ring" },
  8026: { id: 8026, name: "Enchant Ring - Silvermoon's Tenacity", slot: "Ring" },
  8027: { id: 8027, name: "Enchant Ring - Silvermoon's Tenacity", slot: "Ring" },
  // Weapon
  3368: { id: 3368, name: "Rune of the Fallen Crusader", slot: "Weapon" },
  3370: { id: 3370, name: "Rune of Razorice", slot: "Weapon" },
  3847: { id: 3847, name: "Rune of the Stoneskin Gargoyle", slot: "Weapon" },
  6241: { id: 6241, name: "Rune of Sanguination", slot: "Weapon" },
  6242: { id: 6242, name: "Rune of the Apocalypse", slot: "Weapon" },
  6243: { id: 6243, name: "Rune of Hysteria", slot: "Weapon" },
  6244: { id: 6244, name: "Rune of Unending Thirst", slot: "Weapon" },
  6245: { id: 6245, name: "Rune of Spellwarding", slot: "Weapon" },
  7978: { id: 7978, name: "Enchant Weapon - Strength of Halazzi", slot: "Weapon" },
  7979: { id: 7979, name: "Enchant Weapon - Strength of Halazzi", slot: "Weapon" },
  7980: { id: 7980, name: "Enchant Weapon - Jan'alai's Precision", slot: "Weapon" },
  7981: { id: 7981, name: "Enchant Weapon - Jan'alai's Precision", slot: "Weapon" },
  7982: { id: 7982, name: "Enchant Weapon - Berserker's Rage", slot: "Weapon" },
  7983: { id: 7983, name: "Enchant Weapon - Berserker's Rage", slot: "Weapon" },
  8006: { id: 8006, name: "Enchant Weapon - Worldsoul Cradle", slot: "Weapon" },
  8007: { id: 8007, name: "Enchant Weapon - Worldsoul Cradle", slot: "Weapon" },
  8008: { id: 8008, name: "Enchant Weapon - Worldsoul Aegis", slot: "Weapon" },
  8009: { id: 8009, name: "Enchant Weapon - Worldsoul Aegis", slot: "Weapon" },
  8010: { id: 8010, name: "Enchant Weapon - Worldsoul Tenacity", slot: "Weapon" },
  8011: { id: 8011, name: "Enchant Weapon - Worldsoul Tenacity", slot: "Weapon" },
  8036: { id: 8036, name: "Enchant Weapon - Flames of the Sin'dorei", slot: "Weapon" },
  8037: { id: 8037, name: "Enchant Weapon - Flames of the Sin'dorei", slot: "Weapon" },
  8038: { id: 8038, name: "Enchant Weapon - Acuity of the Ren'dorei", slot: "Weapon" },
  8039: { id: 8039, name: "Enchant Weapon - Acuity of the Ren'dorei", slot: "Weapon" },
  8040: { id: 8040, name: "Enchant Weapon - Arcane Mastery", slot: "Weapon" },
  8041: { id: 8041, name: "Enchant Weapon - Arcane Mastery", slot: "Weapon" },
  8688: { id: 8688, name: "Enchant Weapon - Rite of the Hash'ey", slot: "Weapon" },
  8689: { id: 8689, name: "Enchant Weapon - Rite of the Hash'ey", slot: "Weapon" },
  8697: { id: 8697, name: "Venomcoil", slot: "Weapon" },
  // Wrist
  7947: { id: 7947, name: "Chant of Armored Avoidance", slot: "Wrist" },
  7948: { id: 7948, name: "Chant of Armored Leech", slot: "Wrist" },
  7949: { id: 7949, name: "Chant of Armored Speed", slot: "Wrist" },
  7950: { id: 7950, name: "Chant of Armored Avoidance", slot: "Wrist" },
  7951: { id: 7951, name: "Chant of Armored Leech", slot: "Wrist" },
  7952: { id: 7952, name: "Chant of Armored Speed", slot: "Wrist" },
  8200: { id: 8200, name: "Chant of Armored Avoidance", slot: "Wrist" },
  // Back
  7955: { id: 7955, name: "Chant of Armored Leech", slot: "Back" },
  // Tool
  7974: { id: 7974, name: "Enchant Tool - Amani Perception", slot: "Tool" },
  7975: { id: 7975, name: "Enchant Tool - Amani Perception", slot: "Tool" },
  7976: { id: 7976, name: "Enchant Tool - Amani Resourcefulness", slot: "Tool" },
  7977: { id: 7977, name: "Enchant Tool - Amani Resourcefulness", slot: "Tool" },
  8002: { id: 8002, name: "Enchant Tool - Haranir Finesse", slot: "Tool" },
  8003: { id: 8003, name: "Enchant Tool - Haranir Finesse", slot: "Tool" },
  8004: { id: 8004, name: "Enchant Tool - Haranir Multicrafting", slot: "Tool" },
  8005: { id: 8005, name: "Enchant Tool - Haranir Multicrafting", slot: "Tool" },
  8032: { id: 8032, name: "Enchant Tool - Sin'dorei Deftness", slot: "Tool" },
  8033: { id: 8033, name: "Enchant Tool - Sin'dorei Deftness", slot: "Tool" },
  8034: { id: 8034, name: "Enchant Tool - Ren'dorei Ingenuity", slot: "Tool" },
  8035: { id: 8035, name: "Enchant Tool - Ren'dorei Ingenuity", slot: "Tool" },
  // Cosmetic
  8042: { id: 8042, name: "Illusory Adornment - Blooming Light", slot: "Cosmetic" },
  8043: { id: 8043, name: "Illusory Adornment - Blooming Light", slot: "Cosmetic" },
  8044: { id: 8044, name: "Illusory Adornment - Nature's Embrace", slot: "Cosmetic" },
  8045: { id: 8045, name: "Illusory Adornment - Nature's Embrace", slot: "Cosmetic" },
  8046: { id: 8046, name: "Illusory Adornment - Voidtouched", slot: "Cosmetic" },
  8047: { id: 8047, name: "Illusory Adornment - Voidtouched", slot: "Cosmetic" },
  // Other
  7930: { id: 7930, name: "Greater Twisted Appendage", slot: "Other" },
  7931: { id: 7931, name: "Lesser Void Ritual", slot: "Other" },
  7933: { id: 7933, name: "Greater Void Ritual", slot: "Other" },
  7938: { id: 7938, name: "+16 Intellect", slot: "Other" },
  7939: { id: 7939, name: "+24 Intellect", slot: "Other" },
  8684: { id: 8684, name: "+23 Primary Stat and opponent's failed interrupt attempts grant Precognition", slot: "Other" },
  8685: { id: 8685, name: "+23 Primary Stat and +5% Damage Reduction when affected by Crowd Control", slot: "Other" },
  8686: { id: 8686, name: "+23 Primary Stat and getting snared increases damage of your next attack by", slot: "Other" }
};

function resolveEnchantEffectToName(str) {
  if (!str) return '';
  if (/^enchant\s+/i.test(str) || /^greater\s+inscription/i.test(str) || /spellthread/i.test(str) || /armor\s+kit/i.test(str)) {
    return str;
  }
  const lower = str.toLowerCase();
  if (lower.includes('mana') && (lower.includes('intellect') || lower.includes('primary') || lower.includes('arcanoweave') || lower.includes('daybreak'))) {
    return 'Arcanoweave Spellthread';
  }
  if (lower.includes('stamina') && (lower.includes('intellect') || lower.includes('primary') || lower.includes('sunfire') || lower.includes('sunset'))) {
    return 'Sunfire Silk Spellthread';
  }
  if (lower.includes('agility') && lower.includes('stamina')) {
    return "Forest Hunter's Armor Kit";
  }
  if (lower.includes('strength') && lower.includes('stamina')) {
    return "Blood Knight's Armor Kit";
  }
  if (lower.includes('armor') && lower.includes('stamina')) {
    return "Stormbound Armor Kit";
  }
  if (lower.includes('avoidance') && (lower.includes('wrist') || lower.includes('cloak') || lower.includes('chant'))) {
    return "Chant of Armored Avoidance";
  }
  if (lower.includes('leech') && (lower.includes('wrist') || lower.includes('cloak') || lower.includes('chant'))) {
    return "Chant of Armored Leech";
  }
  if (lower.includes('speed') && (lower.includes('wrist') || lower.includes('cloak') || lower.includes('chant'))) {
    return "Chant of Armored Speed";
  }
  return str;
}

function getEnchantName(enchantId) {
  if (!enchantId) return null;
  const id = Number(enchantId);
  if (MIDNIGHT_ENCHANTS_DB[id]) return MIDNIGHT_ENCHANTS_DB[id].name;
  if (typeof window !== 'undefined' && window.enchantNameCache && window.enchantNameCache[id]) {
    return resolveEnchantEffectToName(window.enchantNameCache[id]);
  }
  return `Encantamiento #${id}`;
}

function openCompareModal() {
  const best = (typeof currentOptimizationResults !== 'undefined' ? currentOptimizationResults : window.currentOptimizationResults)?.[0];
  if (!best) {
    alert(t('comparePrompt', 'Please run an optimization first.'));
    return;
  }

  const equipped = (typeof items !== 'undefined' ? items : []).filter(it => it.isEquipped);
  const eqBaseCrit = equipped.reduce((a, b) => a + (b.crit || 0), 0);
  const eqBaseHaste = equipped.reduce((a, b) => a + (b.haste || 0), 0);
  const eqBaseMast = equipped.reduce((a, b) => a + (b.mastery || 0), 0);
  const eqBaseVers = equipped.reduce((a, b) => a + (b.vers || 0), 0);

  let eqGemCrit = 0, eqGemHaste = 0, eqGemMast = 0, eqGemVers = 0;
  equipped.forEach(it => {
    const gs = getItemGemStats(it);
    eqGemCrit += gs.crit;
    eqGemHaste += gs.haste;
    eqGemMast += gs.mast;
    eqGemVers += gs.vers;
  });

  const totalEqCrit = eqBaseCrit + eqGemCrit;
  const totalEqHaste = eqBaseHaste + eqGemHaste;
  const totalEqMast = eqBaseMast + eqGemMast;
  const totalEqVers = eqBaseVers + eqGemVers;

  const optTotalCrit = best.gemData?.projected?.totCrit ?? best.totCrit;
  const optTotalHaste = best.gemData?.projected?.totHaste ?? best.totHaste;
  const optTotalMast = best.gemData?.projected?.totMast ?? best.totMast;
  const optTotalVers = best.gemData?.projected?.totVers ?? best.totVers;

  const optGemCrit = optTotalCrit - best.totCrit;
  const optGemHaste = optTotalHaste - best.totHaste;
  const optGemMast = optTotalMast - best.totMast;
  const optGemVers = optTotalVers - best.totVers;

  const dCrit = optTotalCrit - totalEqCrit;
  const dHaste = optTotalHaste - totalEqHaste;
  const dMast = optTotalMast - totalEqMast;
  const dVers = optTotalVers - totalEqVers;

  const formatDelta = (val) => {
    if (val > 0) return `<span class="text-emerald-400 font-bold">+${val}</span>`;
    if (val < 0) return `<span class="text-red-400 font-bold">${val}</span>`;
    return `<span class="text-slate-400">0</span>`;
  };

  const content = document.getElementById('compare-content');
  if (content) {
    content.innerHTML = `
      <div class="bg-black/50 p-4 rounded-xl border border-wow-border space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-wow-border/50 pb-2">
          <h4 class="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-chart-simple text-amber-400"></i>
            ${t('compareSummaryTitle', 'Stat Comparison (Currently Equipped ➔ Optimal Set)')}
          </h4>
          <span class="text-[11px] text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <i class="fa-solid fa-gem text-emerald-400"></i> ${t('compareGemsNote', 'Includes current gems and recommended gems')}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <!-- Mastery -->
          <div class="bg-wow-panel/90 p-3 rounded-lg border border-purple-500/40 shadow-sm space-y-1.5">
            <div class="text-xs font-bold text-purple-400 text-center pb-0.5 border-b border-purple-500/20">${t('statMastery', 'Mastery')}</div>
            <div class="flex items-center justify-between text-xs px-2 py-1 bg-black/40 rounded border border-white/5 font-mono">
              <span class="text-slate-400 font-sans text-[11px]">${t('statActual', 'Current:')}</span>
              <span class="text-slate-200 font-bold" title="${eqBaseMast} base + ${eqGemMast} gems">${totalEqMast}</span>
            </div>
            <div class="flex items-center justify-between text-xs px-2 py-1 bg-purple-950/40 rounded border border-purple-500/30 font-mono">
              <span class="text-purple-300 font-sans text-[11px]">${t('statOptimal', 'Optimal:')}</span>
              <span class="text-white font-bold" title="${best.totMast} base + ${optGemMast} gems">${optTotalMast}</span>
            </div>
            <div class="flex items-center justify-between text-xs px-2 pt-0.5">
              <span class="text-slate-400 text-[11px]">${t('statTotalChange', 'Total Change:')}</span>
              <div>${formatDelta(dMast)}</div>
            </div>
          </div>

          <!-- Crit -->
          <div class="bg-wow-panel/90 p-3 rounded-lg border border-blue-500/40 shadow-sm space-y-1.5">
            <div class="text-xs font-bold text-blue-400 text-center pb-0.5 border-b border-blue-500/20">${t('statCrit', 'Crit')}</div>
            <div class="flex items-center justify-between text-xs px-2 py-1 bg-black/40 rounded border border-white/5 font-mono">
              <span class="text-slate-400 font-sans text-[11px]">${t('statActual', 'Current:')}</span>
              <span class="text-slate-200 font-bold" title="${eqBaseCrit} base + ${eqGemCrit} gems">${totalEqCrit}</span>
            </div>
            <div class="flex items-center justify-between text-xs px-2 py-1 bg-blue-950/40 rounded border border-blue-500/30 font-mono">
              <span class="text-blue-300 font-sans text-[11px]">${t('statOptimal', 'Optimal:')}</span>
              <span class="text-white font-bold" title="${best.totCrit} base + ${optGemCrit} gems">${optTotalCrit}</span>
            </div>
            <div class="flex items-center justify-between text-xs px-2 pt-0.5">
              <span class="text-slate-400 text-[11px]">${t('statTotalChange', 'Total Change:')}</span>
              <div>${formatDelta(dCrit)}</div>
            </div>
          </div>

          <!-- Haste -->
          <div class="bg-wow-panel/90 p-3 rounded-lg border border-slate-400/40 shadow-sm space-y-1.5">
            <div class="text-xs font-bold text-slate-300 text-center pb-0.5 border-b border-slate-500/20">${t('statHaste', 'Haste')}</div>
            <div class="flex items-center justify-between text-xs px-2 py-1 bg-black/40 rounded border border-white/5 font-mono">
              <span class="text-slate-400 font-sans text-[11px]">${t('statActual', 'Current:')}</span>
              <span class="text-slate-200 font-bold" title="${eqBaseHaste} base + ${eqGemHaste} gems">${totalEqHaste}</span>
            </div>
            <div class="flex items-center justify-between text-xs px-2 py-1 bg-slate-800/40 rounded border border-slate-500/30 font-mono">
              <span class="text-slate-300 font-sans text-[11px]">${t('statOptimal', 'Optimal:')}</span>
              <span class="text-white font-bold" title="${best.totHaste} base + ${optGemHaste} gems">${optTotalHaste}</span>
            </div>
            <div class="flex items-center justify-between text-xs px-2 pt-0.5">
              <span class="text-slate-400 text-[11px]">${t('statTotalChange', 'Total Change:')}</span>
              <div>${formatDelta(dHaste)}</div>
            </div>
          </div>

          <!-- Versatility -->
          <div class="bg-wow-panel/90 p-3 rounded-lg border border-emerald-500/40 shadow-sm space-y-1.5">
            <div class="text-xs font-bold text-emerald-400 text-center pb-0.5 border-b border-emerald-500/20">${t('statVers', 'Versatility')}</div>
            <div class="flex items-center justify-between text-xs px-2 py-1 bg-black/40 rounded border border-white/5 font-mono">
              <span class="text-slate-400 font-sans text-[11px]">${t('statActual', 'Current:')}</span>
              <span class="text-slate-200 font-bold" title="${eqBaseVers} base + ${eqGemVers} gems">${totalEqVers}</span>
            </div>
            <div class="flex items-center justify-between text-xs px-2 py-1 bg-emerald-950/40 rounded border border-emerald-500/30 font-mono">
              <span class="text-emerald-300 font-sans text-[11px]">${t('statOptimal', 'Optimal:')}</span>
              <span class="text-white font-bold" title="${best.totVers} base + ${optGemVers} gems">${optTotalVers}</span>
            </div>
            <div class="flex items-center justify-between text-xs px-2 pt-0.5">
              <span class="text-slate-400 text-[11px]">${t('statTotalChange', 'Total Change:')}</span>
              <div>${formatDelta(dVers)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- DESKTOP TABLE VIEW (md:block) -->
      <div class="hidden md:block bg-black/40 rounded-xl border border-wow-border overflow-x-auto min-w-0">
        <table class="w-full text-xs text-left min-w-[620px]">
          <thead class="bg-black/70 text-slate-400 border-b border-wow-border uppercase font-semibold text-[10px]">
            <tr>
              <th class="p-2.5">${t('colSlot', 'SLOT')}</th>
              <th class="p-2.5">${t('colCurrentlyEquipped', 'CURRENTLY EQUIPPED')}</th>
              <th class="p-2.5">${t('colOptimalRecommendation', 'OPTIMAL RECOMMENDATION')}</th>
              <th class="p-2.5 text-center">${t('colStatus', 'STATUS')}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-wow-border/50">
            ${(() => {
              const singleSlots = ['head', 'neck', 'shoulder', 'back', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet'];
              const rows = [];

              for (const slot of singleSlots) {
                const optItem = best.items.find(x => x.slot === slot);
                if (!optItem) continue;
                const curItem = equipped.find(x => x.slot === slot) || { name: t('noneLabel', 'None'), ilvl: '-', icon: SLOT_FALLBACK_ICONS[slot] };
                const isSame = (curItem.id && optItem.id && curItem.id === optItem.id) || 
                               (curItem.name === optItem.name && curItem.ilvl === optItem.ilvl && 
                                (curItem.mastery || 0) === (optItem.mastery || 0) && 
                                (curItem.crit || 0) === (optItem.crit || 0) && 
                                (curItem.haste || 0) === (optItem.haste || 0) && 
                                (curItem.vers || 0) === (optItem.vers || 0));
                const localizedSlot = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(slot) : slot.replace('_', ' ');
                rows.push({
                  slotLabel: localizedSlot,
                  optItem,
                  curItem,
                  isSame
                });
              }

              function pairMultiSlot(slotKey, labelPrefix) {
                const optList = best.items.filter(x => x.slot === slotKey);
                const eqList = equipped.filter(x => x.slot === slotKey);
                const remainingEq = [...eqList];
                const remainingOpt = [];

                for (const opt of optList) {
                  const matchIdx = remainingEq.findIndex(eq => 
                    (eq.id && opt.id && eq.id === opt.id) || 
                    (eq.name === opt.name && eq.ilvl === opt.ilvl && 
                     (eq.mastery || 0) === (opt.mastery || 0) && 
                     (eq.crit || 0) === (opt.crit || 0) && 
                     (eq.haste || 0) === (opt.haste || 0) && 
                     (eq.vers || 0) === (opt.vers || 0))
                  );
                  if (matchIdx !== -1) {
                    rows.push({
                      slotLabel: `${labelPrefix} ${rows.filter(r => r.slotLabel.startsWith(labelPrefix)).length + 1}`,
                      optItem: opt,
                      curItem: remainingEq[matchIdx],
                      isSame: true
                    });
                    remainingEq.splice(matchIdx, 1);
                  } else {
                    remainingOpt.push(opt);
                  }
                }

                for (let i = 0; i < remainingOpt.length; i++) {
                  const opt = remainingOpt[i];
                  const cur = remainingEq[i] || { name: t('noneLabel', 'None'), ilvl: '-', icon: SLOT_FALLBACK_ICONS[slotKey] };
                  rows.push({
                    slotLabel: `${labelPrefix} ${rows.filter(r => r.slotLabel.startsWith(labelPrefix)).length + 1}`,
                    optItem: opt,
                    curItem: cur,
                    isSame: false
                  });
                }
              }

              const ringLabel = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName('finger') : 'Finger';
              const trinketLabel = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName('trinket') : 'Trinket';
              pairMultiSlot('finger', ringLabel);
              pairMultiSlot('trinket', trinketLabel);

              const optWeapons = best.items.filter(x => x.slot === 'weapon_2h' || x.slot === 'weapon_1h' || x.slot === 'shield');
              const eqWeapons = equipped.filter(x => x.slot === 'weapon_2h' || x.slot === 'weapon_1h' || x.slot === 'shield');
              const remainingEqWep = [...eqWeapons];
              const remainingOptWep = [];
              const weaponPrefix = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName('weapon') : 'Weapon';

              for (const opt of optWeapons) {
                const matchIdx = remainingEqWep.findIndex(eq => 
                  (eq.id && opt.id && eq.id === opt.id) || 
                  (eq.name === opt.name && eq.ilvl === opt.ilvl && 
                   (eq.mastery || 0) === (opt.mastery || 0) && 
                   (eq.crit || 0) === (opt.crit || 0) && 
                   (eq.haste || 0) === (opt.haste || 0) && 
                   (eq.vers || 0) === (opt.vers || 0))
                );
                if (matchIdx !== -1) {
                  const label = optWeapons.length > 1 ? `${weaponPrefix} ${rows.filter(r => r.slotLabel.startsWith(weaponPrefix)).length + 1}` : (typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(opt.slot) : opt.slot.replace('_', ' '));
                  rows.push({
                    slotLabel: label,
                    optItem: opt,
                    curItem: remainingEqWep[matchIdx],
                    isSame: true
                  });
                  remainingEqWep.splice(matchIdx, 1);
                } else {
                  remainingOptWep.push(opt);
                }
              }

              for (let i = 0; i < remainingOptWep.length; i++) {
                const opt = remainingOptWep[i];
                const cur = remainingEqWep[i] || { name: t('noneLabel', 'None'), ilvl: '-', icon: SLOT_FALLBACK_ICONS[opt.slot] };
                const label = optWeapons.length > 1 ? `${weaponPrefix} ${rows.filter(r => r.slotLabel.startsWith(weaponPrefix)).length + 1}` : (typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(opt.slot) : opt.slot.replace('_', ' '));
                rows.push({
                  slotLabel: label,
                  optItem: opt,
                  curItem: cur,
                  isSame: false
                });
              }

              const specData = resolveWowheadSpecData(currentClass, currentSpec);
              const specEnchants = specData?.enchants || [];

              function normalizeEnch(str) {
                if (!str) return '';
                let s = resolveEnchantEffectToName(str).toLowerCase();
                s = s.replace(/^enchant\s+[a-z_]+\s*-\s*/i, '')
                     .replace(/^formula:\s*/i, '')
                     .replace(/^empowered\s+(rune|hex|blessing)\s+of\s+/i, '')
                     .replace(/^greater\s+inscription\s+of\s+(the\s+)?spire/i, 'silvermoonsmending')
                     .replace(/\s+armor\s+kit$/i, '')
                     .replace(/\s+spellthread$/i, '')
                     .replace(/[^a-z0-9]/g, '');
                return s;
              }

              function getSlotBiSEnchant(slotKey) {
                const s = (slotKey || '').toLowerCase();
                if (s.includes('head') || s.includes('cabeza') || s.includes('helm')) return specEnchants.find(e => /head|cabeza|helm/i.test(e.slot));
                if (s.includes('shoulder') || s.includes('hombro')) return specEnchants.find(e => /shoulder|hombro/i.test(e.slot));
                if (s.includes('chest') || s.includes('pecho')) return specEnchants.find(e => /chest|pecho/i.test(e.slot));
                if (s.includes('wrist') || s.includes('muñeca')) return specEnchants.find(e => /wrist|muñeca/i.test(e.slot));
                if (s.includes('legs') || s.includes('pierna')) return specEnchants.find(e => /legs|pierna/i.test(e.slot));
                if (s.includes('feet') || s.includes('pie') || s.includes('bota') || s.includes('boot')) return specEnchants.find(e => /feet|pie|bota|boot/i.test(e.slot));
                if (s.includes('back') || s.includes('capa') || s.includes('espalda') || s.includes('cloak')) return specEnchants.find(e => /back|capa|espalda|cloak/i.test(e.slot));
                if (s.includes('finger') || s.includes('anillo') || s.includes('ring')) return specEnchants.find(e => /finger|anillo|ring/i.test(e.slot));
                if (s.includes('weapon') || s.includes('arma') || s.includes('main_hand') || s.includes('off_hand')) return specEnchants.find(e => /weapon|arma/i.test(e.slot));
                return null;
              }

              function formatItemStatsLine(it) {
                if (!it) return '';
                const parts = [];
                if (it.mastery) parts.push(`<span class="text-purple-300 font-semibold">+${it.mastery} Mast</span>`);
                if (it.crit) parts.push(`<span class="text-blue-300 font-semibold">+${it.crit} Crit</span>`);
                if (it.haste) parts.push(`<span class="text-slate-300 font-semibold">+${it.haste} Haste</span>`);
                if (it.vers) parts.push(`<span class="text-emerald-300 font-semibold">+${it.vers} Vers</span>`);
                return parts.length > 0 ? `<div class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">${parts.join(' ')}</div>` : '';
              }

              return rows.map(({ slotLabel, optItem, curItem, isSame }) => {
                const optGemRec = best.gemData?.recommendations?.find(r => r.item.id === optItem.id || (r.item.name === optItem.name && r.item.slot === optItem.slot));
                const recGemStats = optGemRec?.gemItemId ? MIDNIGHT_GEM_STATS_MAP[optGemRec.gemItemId] : null;

                const curGemStats = getItemGemStats(curItem);
                const curGemId = curGemStats.gemId;
                const curGemObj = curGemId ? Object.values(MIDNIGHT_GEMS_CATALOG).find(g => g.id === curGemId) : null;
                const curGemMatches = optGemRec && curGemId && (
                  curGemId === optGemRec.gemItemId ||
                  (recGemStats && curGemStats.crit === recGemStats.crit && curGemStats.haste === recGemStats.haste && curGemStats.mast === recGemStats.mast && curGemStats.vers === recGemStats.vers)
                );
                const curGemNeedsChange = curItem.socket && optGemRec && !curGemMatches;

                const optCurrentGemStats = getItemGemStats(optItem);
                const optCurrentGemId = optCurrentGemStats.gemId;
                const optCurrentGemObj = optCurrentGemId ? Object.values(MIDNIGHT_GEMS_CATALOG).find(g => g.id === optCurrentGemId) : null;
                const optGemMatches = optGemRec && optCurrentGemId && (
                  optCurrentGemId === optGemRec.gemItemId ||
                  (recGemStats && optCurrentGemStats.crit === recGemStats.crit && optCurrentGemStats.haste === recGemStats.haste && optCurrentGemStats.mast === recGemStats.mast && optCurrentGemStats.vers === recGemStats.vers)
                );
                const optGemNeedsChange = optItem.socket && optGemRec && !optGemMatches;

                const bisEnch = getSlotBiSEnchant(optItem.slot);
                const curEnchMatch = curItem.rawSimcOptions ? curItem.rawSimcOptions.match(/enchant_id=(\d+)/i) : null;
                const curEnchId = curEnchMatch ? Number(curEnchMatch[1]) : (curItem.enchant_id ? Number(curItem.enchant_id) : null);
                const curEnchName = curEnchId ? getEnchantName(curEnchId) : null;

                const normCur = normalizeEnch(curEnchName);
                const normBis = normalizeEnch(bisEnch?.name);
                const isEnchantMatching = (normCur && normBis && (normCur === normBis || normCur.includes(normBis) || normBis.includes(normCur))) || (curEnchId && bisEnch && bisEnch.id === curEnchId);
                const enchantNeedsApply = bisEnch && !curEnchId;
                const enchantCanOptimize = bisEnch && curEnchId && !isEnchantMatching;

                const optEnchMatch = optItem.rawSimcOptions ? optItem.rawSimcOptions.match(/enchant_id=(\d+)/i) : null;
                const optEnchId = optEnchMatch ? Number(optEnchMatch[1]) : (optItem.enchant_id ? Number(optItem.enchant_id) : null);
                const optEnchName = optEnchId ? getEnchantName(optEnchId) : null;
                const normOpt = normalizeEnch(optEnchName);
                const isOptEnchMatching = (normOpt && normBis && (normOpt === normBis || normOpt.includes(normBis) || normBis.includes(normOpt))) || (optEnchId && bisEnch && bisEnch.id === optEnchId);
                const optEnchantNeedsApply = bisEnch && !optEnchId;
                const optEnchantCanOptimize = bisEnch && optEnchId && !isOptEnchMatching;

                const hasActions = !isSame || (isSame ? (curGemNeedsChange || enchantNeedsApply || enchantCanOptimize) : (optGemNeedsChange || optEnchantNeedsApply || optEnchantCanOptimize));

                return `
                  <tr class="${!isSame ? 'bg-amber-500/10 border-l-2 border-amber-400' : (hasActions ? 'bg-purple-950/20' : 'bg-transparent')} hover:bg-white/5 transition">
                    <td class="p-2.5 font-bold text-slate-300 capitalize">${slotLabel}</td>
                    
                    <!-- Equipado Actualmente -->
                    <td class="p-2.5 text-slate-400">
                      <div class="flex items-start gap-2">
                        ${curItem.itemId ? `
                          <a href="${getWowheadBaseUrl()}/item=${curItem.itemId}" target="_blank" ${getItemWowheadAttr(curItem)} class="flex-shrink-0 mt-0.5">
                            <img src="${getWowheadIconUrl(curItem.icon, optItem.slot, curItem.itemId)}" data-item-id="${curItem.itemId || ''}" referrerpolicy="no-referrer" loading="lazy" onerror="handleImageError(this, '${optItem.slot}')" class="w-7 h-7 rounded border border-slate-600 object-cover shadow-sm">
                          </a>
                        ` : `
                          <img src="${getWowheadIconUrl(curItem.icon, optItem.slot, curItem.itemId)}" data-item-id="${curItem.itemId || ''}" referrerpolicy="no-referrer" loading="lazy" onerror="handleImageError(this, '${optItem.slot}')" class="w-7 h-7 rounded border border-slate-600 object-cover flex-shrink-0 mt-0.5">
                        `}
                        <div class="min-w-0">
                          ${curItem.itemId ? `
                            <a href="${getWowheadBaseUrl()}/item=${curItem.itemId}" target="_blank" ${getItemWowheadAttr(curItem)} class="font-semibold text-slate-300 hover:text-white truncate max-w-[200px] block">${curItem.name}</a>
                          ` : `
                            <div class="font-semibold text-slate-300 truncate max-w-[200px]">${curItem.name}</div>
                          `}
                          <div class="text-[10px] text-slate-400 font-mono">ilvl ${curItem.ilvl || '-'} ${curItem.socket ? `• <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> ${t('badgeSocket', 'Socket')}` : ''}</div>
                          ${formatItemStatsLine(curItem)}
                          ${curItem.socket ? `
                            <div class="text-[10px] text-slate-400 mt-0.5">
                              <div class="truncate">
                                <i class="fa-solid fa-gem text-[8px] text-slate-500"></i> ${t('gemLabel', 'Gem')}: 
                                ${curGemObj ? `
                                  <a href="${getWowheadBaseUrl()}/item=${curGemObj.id}" target="_blank" ${getWowheadItemDataAttr(curGemObj.id)} class="text-slate-300 hover:text-purple-300 font-medium">${curGemObj.name}</a>
                                ` : `
                                  <span class="${curGemId ? 'text-slate-300' : 'text-slate-500 italic'}">${curGemId ? 'Gem ID ' + curGemId : t('ungemmed', 'No gem')}</span>
                                `}
                              </div>
                              ${curGemObj?.desc ? `<div class="text-[9px] text-amber-400/90 font-mono pl-3 truncate">${typeof getLocalizedGemDesc === 'function' ? getLocalizedGemDesc(curGemObj.desc) : curGemObj.desc}</div>` : ''}
                            </div>
                          ` : ''}
                          ${(curEnchId || bisEnch) ? (() => {
                            let enchItemId = null;
                            if (curEnchName && typeof window !== 'undefined' && window.WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES) {
                              const normCur = normalizeEnch(curEnchName);
                              for (const cKey in window.WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES) {
                                const clsData = window.WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES[cKey];
                                for (const sKey in clsData) {
                                  const encList = clsData[sKey]?.enchants || [];
                                  const found = encList.find(e => normalizeEnch(e.name) === normCur);
                                  if (found && found.id) {
                                    enchItemId = found.id;
                                    break;
                                  }
                                }
                                if (enchItemId) break;
                              }
                            }
                            return `
                            <div class="text-[10px] text-slate-400 truncate mt-0.5">
                              <i class="fa-solid fa-wand-magic-sparkles text-[8px] text-slate-500"></i> ${t('enchantLabel', 'Enchant')}: 
                              ${enchItemId ? `
                                <a href="${getWowheadBaseUrl()}/item=${enchItemId}" target="_blank" ${getWowheadItemDataAttr(enchItemId)} class="text-slate-300 hover:text-blue-300 font-medium hover:underline">${curEnchName}</a>
                              ` : `
                                <span class="${curEnchName ? 'text-slate-300 font-medium' : 'text-slate-500 italic'}">${curEnchName || (curEnchId ? 'Enchant #' + curEnchId : t('unenchanted', 'Unenchanted'))}</span>
                              `}
                            </div>
                            `;
                          })() : ''}
                        </div>
                      </div>
                    </td>

                    <!-- Recomendación Óptima -->
                    <td class="p-2.5 text-purple-300">
                      <div class="flex items-start gap-2">
                        <a href="${getWowheadBaseUrl()}/item=${optItem.itemId || 0}" target="_blank" ${getItemWowheadAttr(optItem)} class="flex-shrink-0 mt-0.5">
                          <img src="${getWowheadIconUrl(optItem.icon, optItem.slot, optItem.itemId)}" data-item-id="${optItem.itemId || ''}" referrerpolicy="no-referrer" loading="lazy" onerror="handleImageError(this, '${optItem.slot}')" class="w-7 h-7 rounded border border-purple-500/50 object-cover shadow-sm">
                        </a>
                        <div class="min-w-0">
                          <a href="${getWowheadBaseUrl()}/item=${optItem.itemId || 0}" target="_blank" ${getItemWowheadAttr(optItem)} class="font-bold text-purple-300 hover:text-purple-200 truncate max-w-[200px] block">${optItem.name}</a>
                          <div class="text-[10px] text-amber-300 font-semibold font-mono">ilvl ${optItem.ilvl} ${optItem.socket ? `• <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> ${t('badgeSocket', 'Socket')}` : ''} ${optItem.tier ? `• <span class="text-purple-300">${t('badgeTier', 'Tier')}</span>` : ''}</div>
                          ${formatItemStatsLine(optItem)}
                          ${optGemRec ? `
                            <div class="text-[10px] text-amber-300 font-medium mt-0.5">
                              ${(!isSame && optCurrentGemObj && optCurrentGemId !== optGemRec.gemItemId) ? `
                                <div class="text-[9px] text-slate-400 truncate"><i class="fa-solid fa-gem text-[8px] text-slate-500"></i> ${t('gemCurrentInBag', 'Current gem in bag:')} <span class="line-through text-slate-400">${optCurrentGemObj.name}</span></div>
                              ` : ''}
                              <div class="truncate">
                                <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> ${t('gemToUse', 'Gem to use:')} 
                                <a href="${getWowheadBaseUrl()}/item=${optGemRec.gemItemId}" target="_blank" ${getWowheadItemDataAttr(optGemRec.gemItemId)} class="font-bold text-amber-200 hover:text-amber-100 hover:underline">${optGemRec.gemName}</a>
                              </div>
                              ${optGemRec.gemDesc ? `<div class="text-[9px] text-emerald-400/90 font-mono font-normal pl-3 truncate">${typeof getLocalizedGemDesc === 'function' ? getLocalizedGemDesc(optGemRec.gemDesc) : optGemRec.gemDesc}</div>` : ''}
                            </div>
                          ` : ''}
                          ${bisEnch ? `
                            <div class="text-[10px] text-blue-300 font-medium truncate mt-0.5">
                              <i class="fa-solid fa-wand-magic-sparkles text-[8px] text-blue-400"></i> ${t('enchantLabel', 'Enchant')}: 
                              <a href="${getWowheadBaseUrl()}/item=${bisEnch.id}" target="_blank" ${getWowheadItemDataAttr(bisEnch.id)} class="font-bold text-blue-200 hover:text-blue-100 hover:underline">${bisEnch.name}</a>
                            </div>
                          ` : ''}
                        </div>
                      </div>
                    </td>

                    <!-- Estado / Acción Requerida -->
                    <td class="p-2.5 text-center align-middle">
                      <div class="flex flex-col gap-1.5 items-center justify-center min-w-[125px]">
                        ${!isSame ? 
                          `<span class="w-28 py-1 rounded bg-amber-950/90 text-amber-300 border border-amber-500/60 text-[10px] font-bold shadow-sm inline-flex items-center justify-center gap-1.5 transition">⚡ ${t('equipAction', 'Equip Item')}</span>` : ''
                        }
                        ${(!isSame ? optGemNeedsChange : curGemNeedsChange) ? 
                          `<span class="w-28 py-1 rounded bg-purple-950/90 text-purple-300 border border-purple-500/60 text-[10px] font-bold inline-flex items-center justify-center gap-1.5 shadow-sm transition">💎 ${(!isSame ? optCurrentGemId : curGemId) ? t('changeGem', 'Change Gem') : t('socketGem', 'Socket Gem')}</span>` : ''
                        }
                        ${(!isSame ? (optEnchantNeedsApply || optEnchantCanOptimize) : (enchantNeedsApply || enchantCanOptimize)) ? 
                          `<span class="w-28 py-1 rounded bg-blue-950/90 text-blue-300 border border-blue-500/60 text-[10px] font-bold inline-flex items-center justify-center gap-1.5 shadow-sm transition">✨ ${(!isSame ? optEnchId : curEnchId) ? t('reEnchant', 'Re-enchant') : t('applyEnchant', 'Enchant')}</span>` : ''
                        }
                        ${!hasActions ? 
                          `<span class="w-28 py-1 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60 text-[10px] font-semibold inline-flex items-center justify-center gap-1.5 transition">✓ ${t('keepAction', 'Keep')}</span>` : ''
                        }
                      </div>
                    </td>
                  </tr>
                `;
              }).join('');
            })()}
          </tbody>
        </table>
      </div>

      <!-- MOBILE STACKED CARDS VIEW (block md:hidden) -->
      <div class="block md:hidden space-y-3">
        ${(() => {
          const singleSlots = ['head', 'neck', 'shoulder', 'back', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet'];
          const rows = [];

          for (const slot of singleSlots) {
            const optItem = best.items.find(x => x.slot === slot);
            if (!optItem) continue;
            const curItem = equipped.find(x => x.slot === slot) || { name: t('noneLabel', 'None'), ilvl: '-', icon: SLOT_FALLBACK_ICONS[slot] };
            const isSame = (curItem.id && optItem.id && curItem.id === optItem.id) || 
                           (curItem.name === optItem.name && curItem.ilvl === optItem.ilvl && 
                            (curItem.mastery || 0) === (optItem.mastery || 0) && 
                            (curItem.crit || 0) === (optItem.crit || 0) && 
                            (curItem.haste || 0) === (optItem.haste || 0) && 
                            (curItem.vers || 0) === (optItem.vers || 0));
            const localizedSlot = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(slot) : slot.replace('_', ' ');
            rows.push({ slotLabel: localizedSlot, optItem, curItem, isSame });
          }

          function pairMultiSlotMobile(slotKey, labelPrefix) {
            const optList = best.items.filter(x => x.slot === slotKey);
            const eqList = equipped.filter(x => x.slot === slotKey);
            const remainingEq = [...eqList];
            const remainingOpt = [];

            for (const opt of optList) {
              const matchIdx = remainingEq.findIndex(eq => 
                (eq.id && opt.id && eq.id === opt.id) || 
                (eq.name === opt.name && eq.ilvl === opt.ilvl && 
                 (eq.mastery || 0) === (opt.mastery || 0) && 
                 (eq.crit || 0) === (opt.crit || 0) && 
                 (eq.haste || 0) === (opt.haste || 0) && 
                 (eq.vers || 0) === (opt.vers || 0))
              );
              if (matchIdx !== -1) {
                rows.push({
                  slotLabel: `${labelPrefix} ${rows.filter(r => r.slotLabel.startsWith(labelPrefix)).length + 1}`,
                  optItem: opt,
                  curItem: remainingEq[matchIdx],
                  isSame: true
                });
                remainingEq.splice(matchIdx, 1);
              } else {
                remainingOpt.push(opt);
              }
            }

            for (let i = 0; i < remainingOpt.length; i++) {
              const opt = remainingOpt[i];
              const cur = remainingEq[i] || { name: t('noneLabel', 'None'), ilvl: '-', icon: SLOT_FALLBACK_ICONS[slotKey] };
              rows.push({
                slotLabel: `${labelPrefix} ${rows.filter(r => r.slotLabel.startsWith(labelPrefix)).length + 1}`,
                optItem: opt,
                curItem: cur,
                isSame: false
              });
            }
          }

          const ringLabel = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName('finger') : 'Finger';
          const trinketLabel = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName('trinket') : 'Trinket';
          pairMultiSlotMobile('finger', ringLabel);
          pairMultiSlotMobile('trinket', trinketLabel);

          const optWeapons = best.items.filter(x => x.slot === 'weapon_2h' || x.slot === 'weapon_1h' || x.slot === 'shield');
          const eqWeapons = equipped.filter(x => x.slot === 'weapon_2h' || x.slot === 'weapon_1h' || x.slot === 'shield');
          const remainingEqWep = [...eqWeapons];
          const remainingOptWep = [];
          const weaponPrefix = typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName('weapon') : 'Weapon';

          for (const opt of optWeapons) {
            const matchIdx = remainingEqWep.findIndex(eq => 
              (eq.id && opt.id && eq.id === opt.id) || 
              (eq.name === opt.name && eq.ilvl === opt.ilvl && 
               (eq.mastery || 0) === (opt.mastery || 0) && 
               (eq.crit || 0) === (opt.crit || 0) && 
               (eq.haste || 0) === (opt.haste || 0) && 
               (eq.vers || 0) === (opt.vers || 0))
            );
            if (matchIdx !== -1) {
              const label = optWeapons.length > 1 ? `${weaponPrefix} ${rows.filter(r => r.slotLabel.startsWith(weaponPrefix)).length + 1}` : (typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(opt.slot) : opt.slot.replace('_', ' '));
              rows.push({ slotLabel: label, optItem: opt, curItem: remainingEqWep[matchIdx], isSame: true });
              remainingEqWep.splice(matchIdx, 1);
            } else {
              remainingOptWep.push(opt);
            }
          }

          for (let i = 0; i < remainingOptWep.length; i++) {
            const opt = remainingOptWep[i];
            const cur = remainingEqWep[i] || { name: t('noneLabel', 'None'), ilvl: '-', icon: SLOT_FALLBACK_ICONS[opt.slot] };
            const label = optWeapons.length > 1 ? `${weaponPrefix} ${rows.filter(r => r.slotLabel.startsWith(weaponPrefix)).length + 1}` : (typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(opt.slot) : opt.slot.replace('_', ' '));
            rows.push({ slotLabel: label, optItem: opt, curItem: cur, isSame: false });
          }

          const specData = resolveWowheadSpecData(currentClass, currentSpec);
          const specEnchants = specData?.enchants || [];

          function normalizeEnch(str) {
            if (!str) return '';
            let s = resolveEnchantEffectToName(str).toLowerCase();
            return s.replace(/^enchant\s+[a-z_]+\s*-\s*/i, '').replace(/^formula:\s*/i, '').replace(/[^a-z0-9]/g, '');
          }

          function getSlotBiSEnchant(slotKey) {
            const s = (slotKey || '').toLowerCase();
            if (s.includes('head') || s.includes('cabeza') || s.includes('helm')) return specEnchants.find(e => /head|cabeza|helm/i.test(e.slot));
            if (s.includes('shoulder') || s.includes('hombro')) return specEnchants.find(e => /shoulder|hombro/i.test(e.slot));
            if (s.includes('chest') || s.includes('pecho')) return specEnchants.find(e => /chest|pecho/i.test(e.slot));
            if (s.includes('wrist') || s.includes('muñeca')) return specEnchants.find(e => /wrist|muñeca/i.test(e.slot));
            if (s.includes('legs') || s.includes('pierna')) return specEnchants.find(e => /legs|pierna/i.test(e.slot));
            if (s.includes('feet') || s.includes('pie') || s.includes('bota') || s.includes('boot')) return specEnchants.find(e => /feet|pie|bota|boot/i.test(e.slot));
            if (s.includes('back') || s.includes('capa') || s.includes('espalda') || s.includes('cloak')) return specEnchants.find(e => /back|capa|espalda|cloak/i.test(e.slot));
            if (s.includes('finger') || s.includes('anillo') || s.includes('ring')) return specEnchants.find(e => /finger|anillo|ring/i.test(e.slot));
            if (s.includes('weapon') || s.includes('arma') || s.includes('main_hand') || s.includes('off_hand')) return specEnchants.find(e => /weapon|arma/i.test(e.slot));
            return null;
          }

          function formatItemStatsLine(it) {
            if (!it) return '';
            const parts = [];
            if (it.mastery) parts.push(`<span class="text-purple-300 font-semibold">+${it.mastery} Mast</span>`);
            if (it.crit) parts.push(`<span class="text-blue-300 font-semibold">+${it.crit} Crit</span>`);
            if (it.haste) parts.push(`<span class="text-slate-300 font-semibold">+${it.haste} Haste</span>`);
            if (it.vers) parts.push(`<span class="text-emerald-300 font-semibold">+${it.vers} Vers</span>`);
            return parts.length > 0 ? `<div class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">${parts.join(' ')}</div>` : '';
          }

          return rows.map(({ slotLabel, optItem, curItem, isSame }) => {
            const optGemRec = best.gemData?.recommendations?.find(r => r.item.id === optItem.id || (r.item.name === optItem.name && r.item.slot === optItem.slot));
            const recGemStats = optGemRec?.gemItemId ? MIDNIGHT_GEM_STATS_MAP[optGemRec.gemItemId] : null;

            const curGemStats = getItemGemStats(curItem);
            const curGemId = curGemStats.gemId;
            const curGemObj = curGemId ? Object.values(MIDNIGHT_GEMS_CATALOG).find(g => g.id === curGemId) : null;
            const curGemMatches = optGemRec && curGemId && (
              curGemId === optGemRec.gemItemId ||
              (recGemStats && curGemStats.crit === recGemStats.crit && curGemStats.haste === recGemStats.haste && curGemStats.mast === recGemStats.mast && curGemStats.vers === recGemStats.vers)
            );
            const curGemNeedsChange = curItem.socket && optGemRec && !curGemMatches;

            const optCurrentGemStats = getItemGemStats(optItem);
            const optCurrentGemId = optCurrentGemStats.gemId;
            const optCurrentGemObj = optCurrentGemId ? Object.values(MIDNIGHT_GEMS_CATALOG).find(g => g.id === optCurrentGemId) : null;
            const optGemMatches = optGemRec && optCurrentGemId && (
              optCurrentGemId === optGemRec.gemItemId ||
              (recGemStats && optCurrentGemStats.crit === recGemStats.crit && optCurrentGemStats.haste === recGemStats.haste && optCurrentGemStats.mast === recGemStats.mast && optCurrentGemStats.vers === recGemStats.vers)
            );
            const optGemNeedsChange = optItem.socket && optGemRec && !optGemMatches;

            const bisEnch = getSlotBiSEnchant(optItem.slot);
            const curEnchMatch = curItem.rawSimcOptions ? curItem.rawSimcOptions.match(/enchant_id=(\d+)/i) : null;
            const curEnchId = curEnchMatch ? Number(curEnchMatch[1]) : (curItem.enchant_id ? Number(curItem.enchant_id) : null);
            const curEnchName = curEnchId ? getEnchantName(curEnchId) : null;

            const normCur = normalizeEnch(curEnchName);
            const normBis = normalizeEnch(bisEnch?.name);
            const isEnchantMatching = (normCur && normBis && (normCur === normBis || normCur.includes(normBis) || normBis.includes(normCur))) || (curEnchId && bisEnch && bisEnch.id === curEnchId);
            const enchantNeedsApply = bisEnch && !curEnchId;
            const enchantCanOptimize = bisEnch && curEnchId && !isEnchantMatching;

            const optEnchMatch = optItem.rawSimcOptions ? optItem.rawSimcOptions.match(/enchant_id=(\d+)/i) : null;
            const optEnchId = optEnchMatch ? Number(optEnchMatch[1]) : (optItem.enchant_id ? Number(optItem.enchant_id) : null);
            const optEnchName = optEnchId ? getEnchantName(optEnchId) : null;
            const normOpt = normalizeEnch(optEnchName);
            const isOptEnchMatching = (normOpt && normBis && (normOpt === normBis || normOpt.includes(normBis) || normBis.includes(normOpt))) || (optEnchId && bisEnch && bisEnch.id === optEnchId);
            const optEnchantNeedsApply = bisEnch && !optEnchId;
            const optEnchantCanOptimize = bisEnch && optEnchId && !isOptEnchMatching;

            const hasActions = !isSame || (isSame ? (curGemNeedsChange || enchantNeedsApply || enchantCanOptimize) : (optGemNeedsChange || optEnchantNeedsApply || optEnchantCanOptimize));

            return `
              <div class="bg-wow-panel/90 rounded-xl border ${!isSame ? 'border-amber-500/70 bg-amber-950/20' : (hasActions ? 'border-purple-500/50 bg-purple-950/20' : 'border-wow-border/80')} p-3 space-y-2.5 shadow">
                <!-- Header: Slot & Status -->
                <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span class="font-bold text-xs text-amber-300 uppercase tracking-wide flex items-center gap-1.5">${slotLabel}</span>
                  <div class="flex items-center gap-1 flex-wrap justify-end">
                    ${!isSame ? `<span class="px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/60 text-[10px] font-bold">⚡ ${t('equipAction', 'Equip Item')}</span>` : ''}
                    ${(!isSame ? optGemNeedsChange : curGemNeedsChange) ? `<span class="px-2 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-500/60 text-[10px] font-bold">💎 ${(!isSame ? optCurrentGemId : curGemId) ? t('changeGem', 'Change Gem') : t('socketGem', 'Socket Gem')}</span>` : ''}
                    ${(!isSame ? (optEnchantNeedsApply || optEnchantCanOptimize) : (enchantNeedsApply || enchantCanOptimize)) ? `<span class="px-2 py-0.5 rounded bg-blue-950/90 text-blue-300 border border-blue-500/60 text-[10px] font-bold">✨ ${(!isSame ? optEnchId : curEnchId) ? t('reEnchant', 'Re-enchant') : t('applyEnchant', 'Enchant')}</span>` : ''}
                    ${!hasActions ? `<span class="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60 text-[10px] font-semibold">✓ ${t('keepAction', 'Keep')}</span>` : ''}
                  </div>
                </div>

                <!-- Equipado Actualmente -->
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">${t('colCurrentlyEquipped', 'CURRENTLY EQUIPPED')}</span>
                  <div class="flex items-start gap-2 bg-black/40 p-2 rounded-lg border border-white/5">
                    ${curItem.itemId ? `
                      <a href="${getWowheadBaseUrl()}/item=${curItem.itemId}" target="_blank" ${getItemWowheadAttr(curItem)} class="shrink-0 mt-0.5">
                        <img src="${getWowheadIconUrl(curItem.icon, optItem.slot, curItem.itemId)}" data-item-id="${curItem.itemId || ''}" referrerpolicy="no-referrer" loading="lazy" onerror="handleImageError(this, '${optItem.slot}')" class="w-7 h-7 rounded border border-slate-600 object-cover shadow-sm">
                      </a>
                    ` : `
                      <img src="${getWowheadIconUrl(curItem.icon, optItem.slot, curItem.itemId)}" data-item-id="${curItem.itemId || ''}" referrerpolicy="no-referrer" loading="lazy" onerror="handleImageError(this, '${optItem.slot}')" class="w-7 h-7 rounded border border-slate-600 object-cover shrink-0 mt-0.5">
                    `}
                    <div class="min-w-0 flex-1">
                      ${curItem.itemId ? `
                        <a href="${getWowheadBaseUrl()}/item=${curItem.itemId}" target="_blank" ${getItemWowheadAttr(curItem)} class="font-semibold text-xs text-slate-200 hover:text-white truncate block">${curItem.name}</a>
                      ` : `
                        <div class="font-semibold text-xs text-slate-300 truncate">${curItem.name}</div>
                      `}
                      <div class="text-[10px] text-slate-400 font-mono">ilvl ${curItem.ilvl || '-'} ${curItem.socket ? `• <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> ${t('badgeSocket', 'Socket')}` : ''}</div>
                      ${formatItemStatsLine(curItem)}
                      ${curItem.socket ? `
                        <div class="text-[10px] text-slate-400 mt-0.5">
                          <span class="text-slate-400">${t('gemLabel', 'Gem')}: </span>
                          ${curGemObj ? `<a href="${getWowheadBaseUrl()}/item=${curGemObj.id}" target="_blank" ${getWowheadItemDataAttr(curGemObj.id)} class="text-slate-300 font-medium">${curGemObj.name}</a>` : `<span class="${curGemId ? 'text-slate-300' : 'text-slate-500 italic'}">${curGemId ? 'Gem ID ' + curGemId : t('ungemmed', 'No gem')}</span>`}
                        </div>
                      ` : ''}
                      ${(curEnchId || bisEnch) ? `
                        <div class="text-[10px] text-slate-400 mt-0.5">
                          <span class="text-slate-400">${t('enchantLabel', 'Enchant')}: </span>
                          <span class="${curEnchName ? 'text-slate-300 font-medium' : 'text-slate-500 italic'}">${curEnchName || (curEnchId ? 'Enchant #' + curEnchId : t('unenchanted', 'Unenchanted'))}</span>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                </div>

                <!-- Recomendación Óptima -->
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">${t('colOptimalRecommendation', 'OPTIMAL RECOMMENDATION')}</span>
                  <div class="flex items-start gap-2 bg-purple-950/40 p-2 rounded-lg border border-purple-500/30">
                    <a href="${getWowheadBaseUrl()}/item=${optItem.itemId || 0}" target="_blank" ${getItemWowheadAttr(optItem)} class="shrink-0 mt-0.5">
                      <img src="${getWowheadIconUrl(optItem.icon, optItem.slot, optItem.itemId)}" data-item-id="${optItem.itemId || ''}" referrerpolicy="no-referrer" loading="lazy" onerror="handleImageError(this, '${optItem.slot}')" class="w-7 h-7 rounded border border-purple-500/60 object-cover shadow-sm">
                    </a>
                    <div class="min-w-0 flex-1">
                      <a href="${getWowheadBaseUrl()}/item=${optItem.itemId || 0}" target="_blank" ${getItemWowheadAttr(optItem)} class="font-bold text-xs text-purple-300 hover:text-purple-200 truncate block">${optItem.name}</a>
                      <div class="text-[10px] text-amber-300 font-semibold font-mono">ilvl ${optItem.ilvl} ${optItem.socket ? `• <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> ${t('badgeSocket', 'Socket')}` : ''} ${optItem.tier ? `• <span class="text-purple-300">${t('badgeTier', 'Tier')}</span>` : ''}</div>
                      ${formatItemStatsLine(optItem)}
                      ${optGemRec ? `
                        <div class="text-[10px] text-amber-300 font-medium mt-0.5">
                          <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> ${t('gemToUse', 'Gem to use:')} 
                          <a href="${getWowheadBaseUrl()}/item=${optGemRec.gemItemId}" target="_blank" ${getWowheadItemDataAttr(optGemRec.gemItemId)} class="font-bold text-amber-200 hover:text-amber-100 hover:underline">${optGemRec.gemName}</a>
                        </div>
                      ` : ''}
                      ${bisEnch ? `
                        <div class="text-[10px] text-blue-300 font-medium mt-0.5">
                          <i class="fa-solid fa-wand-magic-sparkles text-[8px] text-blue-400"></i> ${t('enchantLabel', 'Enchant')}: 
                          <a href="${getWowheadBaseUrl()}/item=${bisEnch.id}" target="_blank" ${getWowheadItemDataAttr(bisEnch.id)} class="font-bold text-blue-200 hover:text-blue-100 hover:underline">${bisEnch.name}</a>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        })()}
      </div>
    `;
  }

  const compareModal = document.getElementById('compare-modal');
  if (compareModal) compareModal.classList.remove('hidden');
  if (window.$WowheadPower) window.$WowheadPower.refreshLinks();
  setTimeout(() => {
    if (window.$WowheadPower) window.$WowheadPower.refreshLinks();
  }, 100);
}

function closeCompareModal() {
  const compareModal = document.getElementById('compare-modal');
  if (compareModal) compareModal.classList.add('hidden');
}

function applyCompareSetAndClose() {
  applyResultAsEquipped(0);
  closeCompareModal();
}
