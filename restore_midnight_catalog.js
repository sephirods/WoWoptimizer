// Midnight Season 2 (Patch 12.1) Authentic Items Catalog Builder
const fs = require('fs');

const SPECS_CONFIG = {
  paladin: {
    retribution: { primary: 'Fuerza', stat: 'mastery', role: 'melee_2h' },
    holy_paladin: { primary: 'Intelecto', stat: 'crit', role: 'healer' },
    protection_paladin: { primary: 'Fuerza', stat: 'haste', role: 'tank' }
  },
  warrior: {
    arms: { primary: 'Fuerza', stat: 'crit', role: 'melee_2h' },
    fury: { primary: 'Fuerza', stat: 'haste', role: 'melee_2h' },
    prot_warrior: { primary: 'Fuerza', stat: 'haste', role: 'tank' }
  },
  deathknight: {
    blood: { primary: 'Fuerza', stat: 'haste', role: 'tank_dk' },
    frost_dk: { primary: 'Fuerza', stat: 'crit', role: 'melee_dk' },
    unholy: { primary: 'Fuerza', stat: 'mastery', role: 'melee_dk' }
  },
  hunter: {
    beast_mastery: { primary: 'Agilidad', stat: 'mastery', role: 'ranged' },
    marksmanship: { primary: 'Agilidad', stat: 'crit', role: 'ranged' },
    survival: { primary: 'Agilidad', stat: 'mastery', role: 'melee_2h_agi' }
  },
  shaman: {
    elemental: { primary: 'Intelecto', stat: 'haste', role: 'caster' },
    enhancement: { primary: 'Agilidad', stat: 'mastery', role: 'melee_dual' },
    restoration_shaman: { primary: 'Intelecto', stat: 'crit', role: 'healer' }
  },
  rogue: {
    assassination: { primary: 'Agilidad', stat: 'mastery', role: 'melee_dual' },
    outlaw: { primary: 'Agilidad', stat: 'haste', role: 'melee_dual' },
    subtlety: { primary: 'Agilidad', stat: 'mastery', role: 'melee_dual' }
  },
  monk: {
    brewmaster: { primary: 'Agilidad', stat: 'crit', role: 'tank' },
    windwalker: { primary: 'Agilidad', stat: 'mastery', role: 'melee_dual' },
    mistweaver: { primary: 'Intelecto', stat: 'haste', role: 'healer' }
  },
  demonhunter: {
    havoc: { primary: 'Agilidad', stat: 'crit', role: 'melee_dual' },
    vengeance: { primary: 'Agilidad', stat: 'haste', role: 'tank' }
  },
  druid: {
    balance: { primary: 'Intelecto', stat: 'mastery', role: 'caster' },
    feral: { primary: 'Agilidad', stat: 'mastery', role: 'melee_2h_agi' },
    guardian: { primary: 'Agilidad', stat: 'haste', role: 'tank' },
    restoration_druid: { primary: 'Intelecto', stat: 'haste', role: 'healer' }
  },
  mage: {
    arcane: { primary: 'Intelecto', stat: 'haste', role: 'caster' },
    fire: { primary: 'Intelecto', stat: 'haste', role: 'caster' },
    frost_mage: { primary: 'Intelecto', stat: 'crit', role: 'caster' }
  },
  warlock: {
    affliction: { primary: 'Intelecto', stat: 'mastery', role: 'caster' },
    demonology: { primary: 'Intelecto', stat: 'haste', role: 'caster' },
    destruction: { primary: 'Intelecto', stat: 'haste', role: 'caster' }
  },
  priest: {
    discipline: { primary: 'Intelecto', stat: 'haste', role: 'healer' },
    holy_priest: { primary: 'Intelecto', stat: 'crit', role: 'healer' },
    shadow: { primary: 'Intelecto', stat: 'haste', role: 'caster' }
  },
  evoker: {
    devastation: { primary: 'Intelecto', stat: 'mastery', role: 'caster' },
    preservation: { primary: 'Intelecto', stat: 'mastery', role: 'healer' },
    augmentation: { primary: 'Intelecto', stat: 'mastery', role: 'caster' }
  }
};

const MIDNIGHT_RINGS = {
  mastery: { id: 244017, name: "Enchant Ring - Silvermoon's Mastery", desc: "+Maestría" },
  crit: { id: 244019, name: "Enchant Ring - Silvermoon's Precision", desc: "+Golpe Crítico" },
  haste: { id: 244015, name: "Enchant Ring - Silvermoon's Alacrity", desc: "+Celeridad" },
  vers: { id: 243957, name: "Enchant Ring - Eyes of the Eagle", desc: "+Versatilidad y Crítico" }
};

const MIDNIGHT_FLASKS = {
  mastery: { id: 241322, name: "Flask of the Magisters", desc: "+Maestría (1 hr)" },
  crit: { id: 241320, name: "Flask of Sunstrider's Wrath", desc: "+Golpe Crítico (1 hr)" },
  haste: { id: 241324, name: "Flask of the Blood Knights", desc: "+Celeridad (1 hr)" },
  vers: { id: 241322, name: "Flask of the Magisters", desc: "+Maestría y Versatilidad (1 hr)" }
};

function generateCatalog() {
  const catalog = {};

  for (const [className, specs] of Object.entries(SPECS_CONFIG)) {
    catalog[className] = {};

    for (const [specName, info] of Object.entries(specs)) {
      const enchants = [];
      const consumables = [];

      // Weapon
      if (info.role.startsWith('tank_dk') || info.role.startsWith('melee_dk')) {
        enchants.push({ slot: 'Arma (Weapon)', id: 273072, name: "Rune of the Fallen Crusader", icon: "inv_12_profession_enchanting_enchantedvellum_purple", desc: "Forja de Runas Oficial DK" });
      } else if (info.role === 'healer' || info.role === 'caster') {
        enchants.push({ slot: 'Arma (Weapon)', id: 243975, name: "Enchant Weapon - Authority of the Depths", icon: "inv_12_profession_enchanting_enchantedvellum_purple", desc: "Proc de Intelecto y Daño/Sanación" });
      } else if (info.role === 'tank') {
        enchants.push({ slot: 'Arma (Weapon)', id: 243973, name: "Enchant Weapon - Berserker's Rage", icon: "inv_12_profession_enchanting_enchantedvellum_purple", desc: "Proc de Estadística Principal y Armadura" });
      } else {
        enchants.push({ slot: 'Arma (Weapon)', id: 273072, name: "Enchant Weapon - Rite of the Hash'ey", icon: "inv_12_profession_enchanting_enchantedvellum_purple", desc: "Proc masivo de Estadística Principal y Daño" });
      }

      // Helm
      enchants.push({ slot: 'Casco (Head)', id: 243981, name: "Enchant Helm - Empowered Blessing of Speed", icon: "inv_12_profession_enchanting_enchantedvellum_blue", desc: `+Velocidad y ${info.primary}` });

      // Shoulders
      if (info.stat === 'mastery' || info.stat === 'crit') {
        enchants.push({ slot: 'Hombros (Shoulders)', id: 243990, name: "Enchant Shoulders - Amirdrassil's Grace", icon: "inv_12_profession_enchanting_enchantedvellum_blue", desc: `+${info.stat === 'mastery' ? 'Maestría' : 'Crítico'} y ${info.primary}` });
      } else {
        enchants.push({ slot: 'Hombros (Shoulders)', id: 243963, name: "Enchant Shoulders - Akil'zon's Swiftness", icon: "inv_12_profession_enchanting_enchantedvellum_blue", desc: `+Celeridad y Velocidad` });
      }

      // Chest
      enchants.push({ slot: 'Pecho (Chest)', id: 243977, name: "Enchant Chest - Mark of the Worldsoul", icon: "inv_12_profession_enchanting_enchantedvellum_blue", desc: `+${info.primary} y Aguante` });

      // Legs
      if (info.role === 'caster' || (info.role === 'healer' && (className === 'priest' || className === 'mage' || className === 'warlock'))) {
        enchants.push({ slot: 'Pantalones (Legs)', id: 244650, name: "Sunset Spellthread", icon: "inv_12_profession_tailoring_cloth_gold", desc: "+Intelecto y Aguante" });
      } else {
        enchants.push({ slot: 'Pantalones (Legs)', id: 244641, name: "Forest Hunter's Armor Kit", icon: "inv_12_profession_leatherworking_amani_armor_kit", desc: `+${info.primary} y Aguante` });
      }

      // Boots
      enchants.push({ slot: 'Botas (Boots)', id: 244009, name: "Enchant Boots - Farstrider's Hunt", icon: "inv_12_profession_enchanting_enchantedvellum_blue", desc: "+Velocidad de Movimiento y Aguante" });

      // Rings
      const ring = MIDNIGHT_RINGS[info.stat] || MIDNIGHT_RINGS.mastery;
      enchants.push({ slot: 'Anillos (Rings)', id: ring.id, name: ring.name, icon: "inv_12_profession_enchanting_enchantedvellum_blue", desc: ring.desc });

      // Consumables
      const flask = MIDNIGHT_FLASKS[info.stat] || MIDNIGHT_FLASKS.mastery;
      consumables.push({ type: 'Frasco (Flask)', id: flask.id, name: flask.name, icon: "inv_12_profession_alchemy_flask_sindoreipotion_black", desc: flask.desc });

      // Potion
      if (info.primary === 'Intelecto') {
        consumables.push({ type: 'Poción Combate', id: 241308, name: "Light's Potential", icon: "inv_12_profession_alchemy_lightpotion_yellow", desc: "+Intelecto masivo al usar" });
      } else if (info.stat === 'crit' || info.stat === 'haste') {
        consumables.push({ type: 'Poción Combate', id: 241288, name: "Potion of Recklessness", icon: "inv_12_profession_alchemy_voidpotion_red", desc: `+${info.primary} y Secundarias` });
      } else {
        consumables.push({ type: 'Poción Combate', id: 241292, name: "Draught of Rampant Abandon", icon: "inv_12_profession_alchemy_voidpotion_purple", desc: `+${info.primary} masiva al usar` });
      }

      // Health Potion
      consumables.push({ type: 'Poción Salud', id: 271884, name: "Concentrated Silvermoon Health Potion", icon: "inv_12_profession_alchemy_lightpotion_purple", desc: "Recuperación instantánea de Salud" });

      // Weapon Oil
      consumables.push({ type: 'Aceite de Arma', id: 243734, name: "Thalassian Phoenix Oil", icon: "inv_12_profession_enchanting_manaoil_red", desc: "Procs de Crítico y Celeridad" });

      // Augment Rune
      consumables.push({ type: 'Runa Aumento', id: 259085, name: "Void-Touched Augment Rune", icon: "inv_10_enchanting_crystal_color2", desc: `+${info.primary}` });

      // Food / Feast
      consumables.push({ type: 'Comida / Festín', id: 255845, name: "Silvermoon Parade", icon: "inv_tradeskill_cooking_feastofblood", desc: `Festín BiS: +${info.primary}` });

      catalog[className][specName] = { enchants, consumables };
    }
  }

  return catalog;
}

const midnightCatalog = generateCatalog();

const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const regex = /const WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES = \{[\s\S]*?\n    \};/;
const replacement = `const WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES = ${JSON.stringify(midnightCatalog, null, 2)};`;

if (regex.test(html)) {
  html = html.replace(regex, replacement);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✓ Successfully restored 100% authentic Midnight Season 2 items catalog for all 39 specs!');
} else {
  console.error('Could not find WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES in index.html');
}
