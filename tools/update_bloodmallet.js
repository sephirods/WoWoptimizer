/**
 * ACTUALIZADOR AUTOM?TICO DE BLOODMALLET (NODE.JS - SIN NAVEGADOR)
 * 
 * INSTRUCCIONES:
 * Ejecuta en la terminal de tu proyecto:
 *   node tools/update_bloodmallet.js
 */

const fs = require('fs');

async function updateBloodmallet() {
  console.log('?? Descargando datos oficiales de simulaciones de Bloodmallet...');
  
  const SPECS = [
    { classKey: 'deathknight', specKey: 'blood', slug: 'death_knight_blood' },
    { classKey: 'deathknight', specKey: 'frost_dk', slug: 'death_knight_frost' },
    { classKey: 'deathknight', specKey: 'unholy', slug: 'death_knight_unholy' },
    { classKey: 'demonhunter', specKey: 'havoc', slug: 'demon_hunter_havoc' },
    { classKey: 'demonhunter', specKey: 'vengeance', slug: 'demon_hunter_vengeance' },
    { classKey: 'druid', specKey: 'balance', slug: 'druid_balance' },
    { classKey: 'druid', specKey: 'feral', slug: 'druid_feral' },
    { classKey: 'druid', specKey: 'guardian', slug: 'druid_guardian' },
    { classKey: 'druid', specKey: 'restoration_druid', slug: 'druid_restoration' },
    { classKey: 'evoker', specKey: 'devastation', slug: 'evoker_devastation' },
    { classKey: 'evoker', specKey: 'preservation', slug: 'evoker_preservation' },
    { classKey: 'evoker', specKey: 'augmentation', slug: 'evoker_augmentation' },
    { classKey: 'hunter', specKey: 'beastmastery', slug: 'hunter_beast_mastery' },
    { classKey: 'hunter', specKey: 'marksmanship', slug: 'hunter_marksmanship' },
    { classKey: 'hunter', specKey: 'survival', slug: 'hunter_survival' },
    { classKey: 'mage', specKey: 'arcane', slug: 'mage_arcane' },
    { classKey: 'mage', specKey: 'fire', slug: 'mage_fire' },
    { classKey: 'mage', specKey: 'frost_mage', slug: 'mage_frost' },
    { classKey: 'monk', specKey: 'brewmaster', slug: 'monk_brewmaster' },
    { classKey: 'monk', specKey: 'mistweaver', slug: 'monk_mistweaver' },
    { classKey: 'monk', specKey: 'windwalker', slug: 'monk_windwalker' },
    { classKey: 'paladin', specKey: 'holy_paladin', slug: 'paladin_holy' },
    { classKey: 'paladin', specKey: 'protection_paladin', slug: 'paladin_protection' },
    { classKey: 'paladin', specKey: 'retribution', slug: 'paladin_retribution' },
    { classKey: 'priest', specKey: 'discipline', slug: 'priest_discipline' },
    { classKey: 'priest', specKey: 'holy_priest', slug: 'priest_holy' },
    { classKey: 'priest', specKey: 'shadow', slug: 'priest_shadow' },
    { classKey: 'rogue', specKey: 'assassination', slug: 'rogue_assassination' },
    { classKey: 'rogue', specKey: 'outlaw', slug: 'rogue_outlaw' },
    { classKey: 'rogue', specKey: 'subtlety', slug: 'rogue_subtlety' },
    { classKey: 'shaman', specKey: 'elemental', slug: 'shaman_elemental' },
    { classKey: 'shaman', specKey: 'enhancement', slug: 'shaman_enhancement' },
    { classKey: 'shaman', specKey: 'restoration_shaman', slug: 'shaman_restoration' },
    { classKey: 'warlock', specKey: 'affliction', slug: 'warlock_affliction' },
    { classKey: 'warlock', specKey: 'demonology', slug: 'warlock_demonology' },
    { classKey: 'warlock', specKey: 'destruction', slug: 'warlock_destruction' },
    { classKey: 'warrior', specKey: 'arms', slug: 'warrior_arms' },
    { classKey: 'warrior', specKey: 'fury', slug: 'warrior_fury' },
    { classKey: 'warrior', specKey: 'protection_warrior', slug: 'warrior_protection' }
  ];

  const dataset = {};
  const icons = {};

  for (const item of SPECS) {
    console.log("?? Descargando Bloodmallet para " + item.classKey + " - " + item.specKey + "...");
    try {
      const url = "https://bloodmallet.com/data/trinkets/castingpatchwerk/" + item.slug + ".json";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        dataset[item.slug] = json;
      }
    } catch(e) {
      console.warn("Fallo al descargar " + item.slug + ": ", e.message);
    }
  }

  const outputJs = "// BLOODMALLET BUNDLED DATASET\nwindow.BLOODMALLET_ITEM_ICONS = " + JSON.stringify(icons, null, 2) + ";\nwindow.BLOODMALLET_DATA = " + JSON.stringify(dataset, null, 2) + ";\n";
  fs.writeFileSync('bloodmallet_data.js', outputJs, 'utf8');
  console.log('? ?Archivo bloodmallet_data.js actualizado correctamente!');
}

updateBloodmallet();
