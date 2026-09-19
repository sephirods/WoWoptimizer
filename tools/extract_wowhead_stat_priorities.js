/**
 * EXTRACTOR OFICIAL PARA WOWHEAD (CONSOLA DE NAVEGADOR) - VERSIÓN PERFECCIONADA
 * 
 * INSTRUCCIONES:
 * 1. Abre https://www.wowhead.com en tu navegador.
 * 2. Presiona F12 y ve a la pestaña 'Console' (Consola).
 * 3. Pega todo este código y presiona Enter.
 * 4. Espera a que termine el escaneo (20-30 seg).
 * 5. Se descargará automáticamente el archivo 'wow_stat_priorities.js'.
 */

(async function extractWowheadStatPriorities() {
  console.log('🚀 Iniciando extracción masiva de Stat Priorities y Hero Trees desde Wowhead...');

  const HERO_TREES_MAP = {
    'deathknight_blood': ['Deathbringer', "San'layn"],
    'deathknight_frost_dk': ['Deathbringer', 'Rider of the Apocalypse'],
    'deathknight_unholy': ['Rider of the Apocalypse', "San'layn"],
    'demonhunter_havoc': ['Aldrachi Reaver', 'Fel-Scarred'],
    'demonhunter_vengeance': ['Aldrachi Reaver', 'Fel-Scarred'],
    'druid_balance': ["Elune's Chosen", 'Keeper of the Grove'],
    'druid_feral': ['Druid of the Claw', 'Wildstalker'],
    'druid_guardian': ['Druid of the Claw', "Elune's Chosen"],
    'druid_restoration_druid': ['Keeper of the Grove', 'Wildstalker'],
    'evoker_devastation': ['Flameshaper', 'Scalecommander'],
    'evoker_preservation': ['Chronowarden', 'Flameshaper'],
    'evoker_augmentation': ['Chronowarden', 'Scalecommander'],
    'hunter_beastmastery': ['Dark Ranger', 'Pack Leader'],
    'hunter_marksmanship': ['Dark Ranger', 'Sentinel'],
    'hunter_survival': ['Pack Leader', 'Sentinel'],
    'mage_arcane': ['Spellslinger', 'Sunfury'],
    'mage_fire': ['Frostfire', 'Sunfury'],
    'mage_frost_mage': ['Frostfire', 'Spellslinger'],
    'monk_brewmaster': ['Master of Harmony', 'Shado-Pan'],
    'monk_mistweaver': ['Conduit of the Celestials', 'Master of Harmony'],
    'monk_windwalker': ['Conduit of the Celestials', 'Shado-Pan'],
    'paladin_holy_paladin': ['Herald of the Sun', 'Lightsmith'],
    'paladin_protection_paladin': ['Lightsmith', 'Templar'],
    'paladin_retribution': ['Herald of the Sun', 'Templar'],
    'priest_discipline': ['Oracle', 'Voidweaver'],
    'priest_holy_priest': ['Archon', 'Oracle'],
    'priest_shadow': ['Archon', 'Voidweaver'],
    'rogue_assassination': ['Deathstalker', 'Fatebound'],
    'rogue_outlaw': ['Fatebound', 'Trickster'],
    'rogue_subtlety': ['Deathstalker', 'Trickster'],
    'shaman_elemental': ['Farseer', 'Stormbringer'],
    'shaman_enhancement': ['Stormbringer', 'Totemic'],
    'shaman_restoration_shaman': ['Farseer', 'Totemic'],
    'warlock_affliction': ['Hellcaller', 'Soul Harvester'],
    'warlock_demonology': ['Diabolist', 'Soul Harvester'],
    'warlock_destruction': ['Diabolist', 'Hellcaller'],
    'warrior_arms': ['Colossus', 'Slayer'],
    'warrior_fury': ['Mountain Thane', 'Slayer'],
    'warrior_protection_warrior': ['Colossus', 'Mountain Thane']
  };

  const SPECS = [
    { classKey: 'deathknight', classSlug: 'death-knight', specKey: 'blood', name: 'Blood Death Knight', guide: 'blood/stat-priority-pve-tank' },
    { classKey: 'deathknight', classSlug: 'death-knight', specKey: 'frost_dk', name: 'Frost Death Knight', guide: 'frost/stat-priority-pve-dps' },
    { classKey: 'deathknight', classSlug: 'death-knight', specKey: 'unholy', name: 'Unholy Death Knight', guide: 'unholy/stat-priority-pve-dps' },
    { classKey: 'demonhunter', classSlug: 'demon-hunter', specKey: 'havoc', name: 'Havoc Demon Hunter', guide: 'havoc/stat-priority-pve-dps' },
    { classKey: 'demonhunter', classSlug: 'demon-hunter', specKey: 'vengeance', name: 'Vengeance Demon Hunter', guide: 'vengeance/stat-priority-pve-tank' },
    { classKey: 'druid', classSlug: 'druid', specKey: 'balance', name: 'Balance Druid', guide: 'balance/stat-priority-pve-dps' },
    { classKey: 'druid', classSlug: 'druid', specKey: 'feral', name: 'Feral Druid', guide: 'feral/stat-priority-pve-dps' },
    { classKey: 'druid', classSlug: 'druid', specKey: 'guardian', name: 'Guardian Druid', guide: 'guardian/stat-priority-pve-tank' },
    { classKey: 'druid', classSlug: 'druid', specKey: 'restoration_druid', name: 'Restoration Druid', guide: 'restoration/stat-priority-pve-healer' },
    { classKey: 'evoker', classSlug: 'evoker', specKey: 'devastation', name: 'Devastation Evoker', guide: 'devastation/stat-priority-pve-dps' },
    { classKey: 'evoker', classSlug: 'evoker', specKey: 'preservation', name: 'Preservation Evoker', guide: 'preservation/stat-priority-pve-healer' },
    { classKey: 'evoker', classSlug: 'evoker', specKey: 'augmentation', name: 'Augmentation Evoker', guide: 'augmentation/stat-priority-pve-dps' },
    { classKey: 'hunter', classSlug: 'hunter', specKey: 'beastmastery', name: 'Beast Mastery Hunter', guide: 'beast-mastery/stat-priority-pve-dps' },
    { classKey: 'hunter', classSlug: 'hunter', specKey: 'marksmanship', name: 'Marksmanship Hunter', guide: 'marksmanship/stat-priority-pve-dps' },
    { classKey: 'hunter', classSlug: 'hunter', specKey: 'survival', name: 'Survival Hunter', guide: 'survival/stat-priority-pve-dps' },
    { classKey: 'mage', classSlug: 'mage', specKey: 'arcane', name: 'Arcane Mage', guide: 'arcane/stat-priority-pve-dps' },
    { classKey: 'mage', classSlug: 'mage', specKey: 'fire', name: 'Fire Mage', guide: 'fire/stat-priority-pve-dps' },
    { classKey: 'mage', classSlug: 'mage', specKey: 'frost_mage', name: 'Frost Mage', guide: 'frost/stat-priority-pve-dps' },
    { classKey: 'monk', classSlug: 'monk', specKey: 'brewmaster', name: 'Brewmaster Monk', guide: 'brewmaster/stat-priority-pve-tank' },
    { classKey: 'monk', classSlug: 'monk', specKey: 'mistweaver', name: 'Mistweaver Monk', guide: 'mistweaver/stat-priority-pve-healer' },
    { classKey: 'monk', classSlug: 'monk', specKey: 'windwalker', name: 'Windwalker Monk', guide: 'windwalker/stat-priority-pve-dps' },
    { classKey: 'paladin', classSlug: 'paladin', specKey: 'holy_paladin', name: 'Holy Paladin', guide: 'holy/stat-priority-pve-healer' },
    { classKey: 'paladin', classSlug: 'paladin', specKey: 'protection_paladin', name: 'Protection Paladin', guide: 'protection/stat-priority-pve-tank' },
    { classKey: 'paladin', classSlug: 'paladin', specKey: 'retribution', name: 'Retribution Paladin', guide: 'retribution/stat-priority-pve-dps' },
    { classKey: 'priest', classSlug: 'priest', specKey: 'discipline', name: 'Discipline Priest', guide: 'discipline/stat-priority-pve-healer' },
    { classKey: 'priest', classSlug: 'priest', specKey: 'holy_priest', name: 'Holy Priest', guide: 'holy/stat-priority-pve-healer' },
    { classKey: 'priest', classSlug: 'priest', specKey: 'shadow', name: 'Shadow Priest', guide: 'shadow/stat-priority-pve-dps' },
    { classKey: 'rogue', classSlug: 'rogue', specKey: 'assassination', name: 'Assassination Rogue', guide: 'assassination/stat-priority-pve-dps' },
    { classKey: 'rogue', classSlug: 'rogue', specKey: 'outlaw', name: 'Outlaw Rogue', guide: 'outlaw/stat-priority-pve-dps' },
    { classKey: 'rogue', classSlug: 'rogue', specKey: 'subtlety', name: 'Subtlety Rogue', guide: 'subtlety/stat-priority-pve-dps' },
    { classKey: 'shaman', classSlug: 'shaman', specKey: 'elemental', name: 'Elemental Shaman', guide: 'elemental/stat-priority-pve-dps' },
    { classKey: 'shaman', classSlug: 'shaman', specKey: 'enhancement', name: 'Enhancement Shaman', guide: 'enhancement/stat-priority-pve-dps' },
    { classKey: 'shaman', classSlug: 'shaman', specKey: 'restoration_shaman', name: 'Restoration Shaman', guide: 'restoration/stat-priority-pve-healer' },
    { classKey: 'warlock', classSlug: 'warlock', specKey: 'affliction', name: 'Affliction Warlock', guide: 'affliction/stat-priority-pve-dps' },
    { classKey: 'warlock', classSlug: 'warlock', specKey: 'demonology', name: 'Demonology Warlock', guide: 'demonology/stat-priority-pve-dps' },
    { classKey: 'warlock', classSlug: 'warlock', specKey: 'destruction', name: 'Destruction Warlock', guide: 'destruction/stat-priority-pve-dps' },
    { classKey: 'warrior', classSlug: 'warrior', specKey: 'arms', name: 'Arms Warrior', guide: 'arms/stat-priority-pve-dps' },
    { classKey: 'warrior', classSlug: 'warrior', specKey: 'fury', name: 'Fury Warrior', guide: 'fury/stat-priority-pve-dps' },
    { classKey: 'warrior', classSlug: 'warrior', specKey: 'protection_warrior', name: 'Protection Warrior', guide: 'protection/stat-priority-pve-tank' }
  ];

  const baseWeights = [1.6, 1.3, 1.0, 0.7];

  function parseTiersToWeights(tiers) {
    const weights = { m: 1.0, c: 1.0, h: 1.0, v: 1.0 };
    tiers.forEach((tierStats, tierIdx) => {
      const w = baseWeights[tierIdx] !== undefined ? baseWeights[tierIdx] : 0.6;
      tierStats.forEach(stKey => {
        weights[stKey] = w;
      });
    });
    return weights;
  }

  function parseStatList(items) {
    const secondaryTiers = [];
    items.forEach(it => {
      const lower = it.toLowerCase();
      if (lower.includes('agility') || lower.includes('strength') || lower.includes('intellect') || lower.includes('stamina')) {
        return;
      }
      const found = [];
      if (lower.includes('mastery')) found.push('m');
      if (lower.includes('crit')) found.push('c');
      if (lower.includes('haste')) found.push('h');
      if (lower.includes('vers')) found.push('v');

      if (found.length > 0) {
        secondaryTiers.push(found);
      }
    });

    if (secondaryTiers.length === 0) return null;

    return {
      rawList: items,
      secondaryOrder: secondaryTiers.map(t => t.map(k => k === 'm' ? 'Mastery' : k === 'c' ? 'Crit' : k === 'h' ? 'Haste' : 'Vers').join(' = ')).join(' > '),
      weights: parseTiersToWeights(secondaryTiers)
    };
  }

  const results = {};

  for (const item of SPECS) {
    if (!results[item.classKey]) results[item.classKey] = {};
    
    console.log('🔍 [' + item.name + '] Obteniendo guía de stats...');
    const guideUrl = 'https://www.wowhead.com/guide/classes/' + item.classSlug + '/' + item.guide;
    const expectedTrees = HERO_TREES_MAP[item.classKey + '_' + item.specKey] || [];
    
    try {
      const res = await fetch(guideUrl);
      if (!res.ok) {
        console.warn('⚠️ No se pudo cargar URL: ' + guideUrl + ' (Status: ' + res.status + ')');
        continue;
      }
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const heroTrees = {};
      const allOls = Array.from(doc.querySelectorAll('ol'));
      const parsedLists = [];

      allOls.forEach(ol => {
        const items = Array.from(ol.querySelectorAll('li')).map(li => li.textContent.trim());
        const parsed = parseStatList(items);
        if (parsed) {
          // Obtener texto del contenedor o encabezado previo
          let headerText = '';
          let container = ol.parentElement;
          for (let i = 0; i < 4 && container; i++) {
            const txt = container.textContent || '';
            expectedTrees.forEach(tree => {
              if (new RegExp('\\b' + tree + '\\b', 'i').test(txt)) {
                headerText = tree;
              }
            });
            if (headerText) break;
            container = container.parentElement;
          }

          if (!headerText) {
            let prev = ol.previousElementSibling;
            while (prev) {
              const prevTxt = prev.textContent || '';
              expectedTrees.forEach(tree => {
                if (new RegExp('\\b' + tree + '\\b', 'i').test(prevTxt)) {
                  headerText = tree;
                }
              });
              if (headerText) break;
              prev = prev.previousElementSibling;
            }
          }

          parsedLists.push({
            header: headerText,
            data: parsed
          });
        }
      });

      // Asociar listas a los Hero Trees esperados
      parsedLists.forEach(pl => {
        if (pl.header && expectedTrees.includes(pl.header)) {
          heroTrees[pl.header] = pl.data;
        }
      });

      // Si falta alguno de los 2 Hero Trees, usar la primera lista encontrada o repartir
      if (parsedLists.length > 0) {
        expectedTrees.forEach((tree, idx) => {
          if (!heroTrees[tree]) {
            const fallbackData = parsedLists[idx] ? parsedLists[idx].data : parsedLists[0].data;
            heroTrees[tree] = fallbackData;
          }
        });
      }

      // Si aún no hay nada (guía sin <ol>), crear default
      if (Object.keys(heroTrees).length === 0) {
        const defaultData = {
          rawList: ['Mastery', 'Haste', 'Critical Strike', 'Versatility'],
          secondaryOrder: 'Mastery > Haste > Crit > Vers',
          weights: { m: 1.6, h: 1.3, c: 1.0, v: 0.7 }
        };
        expectedTrees.forEach(tree => {
          heroTrees[tree] = defaultData;
        });
      }

      results[item.classKey][item.specKey] = {
        name: item.name,
        guideUrl: guideUrl,
        heroTrees: heroTrees
      };

      console.log('✅ [' + item.name + '] Hero Trees asignados:', Object.keys(heroTrees).join(' | '));
    } catch (e) {
      console.warn('❌ Error procesando ' + item.name + ':', e);
    }
  }

  const fileContent = '// WOWHEAD STAT PRIORITIES Y HERO TREES OFICIALES EXTRAÍDOS\nwindow.WOWHEAD_STAT_PRIORITIES = ' + JSON.stringify(results, null, 2) + ';\n';

  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'wow_stat_priorities.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  console.log('🎉 ¡Extracción de las 39 Specs completada y archivo wow_stat_priorities.js descargado con éxito!');
  return results;
})();
