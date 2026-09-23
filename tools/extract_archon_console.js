/**
 * EXTRACTOR OFICIAL PARA ARCHON.GG (CONSOLA DE NAVEGADOR)
 * 
 * INSTRUCCIONES:
 * 1. Abre https://www.archon.gg/wow en tu navegador (Chrome, Edge, Firefox).
 * 2. Presiona F12 y ve a la pestaña 'Console' (Consola).
 * 3. Pega todo este código y presiona Enter.
 * 4. Espera a que termine de escanear las 39 specs (tardará unos 15-20 segundos).
 * 5. Se descargará automáticamente el archivo 'archon_data.js' listo para reemplazar el de tu proyecto.
 */

(async function extractArchonData() {
  console.log('🚀 Iniciando extracción de datos de Archon.gg...');

  const SPECS = [
    { classKey: 'deathknight', specKey: 'blood', classSlug: 'death-knight', specSlug: 'blood' },
    { classKey: 'deathknight', specKey: 'frost_dk', classSlug: 'death-knight', specSlug: 'frost' },
    { classKey: 'deathknight', specKey: 'unholy', classSlug: 'death-knight', specSlug: 'unholy' },
    { classKey: 'demonhunter', specKey: 'havoc', classSlug: 'demon-hunter', specSlug: 'havoc' },
    { classKey: 'demonhunter', specKey: 'vengeance', classSlug: 'demon-hunter', specSlug: 'vengeance' },
    { classKey: 'druid', specKey: 'balance', classSlug: 'druid', specSlug: 'balance' },
    { classKey: 'druid', specKey: 'feral', classSlug: 'druid', specSlug: 'feral' },
    { classKey: 'druid', specKey: 'guardian', classSlug: 'druid', specSlug: 'guardian' },
    { classKey: 'druid', specKey: 'restoration_druid', classSlug: 'druid', specSlug: 'restoration' },
    { classKey: 'evoker', specKey: 'devastation', classSlug: 'evoker', specSlug: 'devastation' },
    { classKey: 'evoker', specKey: 'preservation', classSlug: 'evoker', specSlug: 'preservation' },
    { classKey: 'evoker', specKey: 'augmentation', classSlug: 'evoker', specSlug: 'augmentation' },
    { classKey: 'hunter', specKey: 'beastmastery', classSlug: 'hunter', specSlug: 'beast-mastery' },
    { classKey: 'hunter', specKey: 'marksmanship', classSlug: 'hunter', specSlug: 'marksmanship' },
    { classKey: 'hunter', specKey: 'survival', classSlug: 'hunter', specSlug: 'survival' },
    { classKey: 'mage', specKey: 'arcane', classSlug: 'mage', specSlug: 'arcane' },
    { classKey: 'mage', specKey: 'fire', classSlug: 'mage', specSlug: 'fire' },
    { classKey: 'mage', specKey: 'frost_mage', classSlug: 'mage', specSlug: 'frost' },
    { classKey: 'monk', specKey: 'brewmaster', classSlug: 'monk', specSlug: 'brewmaster' },
    { classKey: 'monk', specKey: 'mistweaver', classSlug: 'monk', specSlug: 'mistweaver' },
    { classKey: 'monk', specKey: 'windwalker', classSlug: 'monk', specSlug: 'windwalker' },
    { classKey: 'paladin', specKey: 'holy_paladin', classSlug: 'paladin', specSlug: 'holy' },
    { classKey: 'paladin', specKey: 'protection_paladin', classSlug: 'paladin', specSlug: 'protection' },
    { classKey: 'paladin', specKey: 'retribution', classSlug: 'paladin', specSlug: 'retribution' },
    { classKey: 'priest', specKey: 'discipline', classSlug: 'priest', specSlug: 'discipline' },
    { classKey: 'priest', specKey: 'holy_priest', classSlug: 'priest', specSlug: 'holy' },
    { classKey: 'priest', specKey: 'shadow', classSlug: 'priest', specSlug: 'shadow' },
    { classKey: 'rogue', specKey: 'assassination', classSlug: 'rogue', specSlug: 'assassination' },
    { classKey: 'rogue', specKey: 'outlaw', classSlug: 'rogue', specSlug: 'outlaw' },
    { classKey: 'rogue', specKey: 'subtlety', classSlug: 'rogue', specSlug: 'subtlety' },
    { classKey: 'shaman', specKey: 'elemental', classSlug: 'shaman', specSlug: 'elemental' },
    { classKey: 'shaman', specKey: 'enhancement', classSlug: 'shaman', specSlug: 'enhancement' },
    { classKey: 'shaman', specKey: 'restoration_shaman', classSlug: 'shaman', specSlug: 'restoration' },
    { classKey: 'warlock', specKey: 'affliction', classSlug: 'warlock', specSlug: 'affliction' },
    { classKey: 'warlock', specKey: 'demonology', classSlug: 'warlock', specSlug: 'demonology' },
    { classKey: 'warlock', specKey: 'destruction', classSlug: 'warlock', specSlug: 'destruction' },
    { classKey: 'warrior', specKey: 'arms', classSlug: 'warrior', specSlug: 'arms' },
    { classKey: 'warrior', specKey: 'fury', classSlug: 'warrior', specSlug: 'fury' },
    { classKey: 'warrior', specKey: 'protection_warrior', classSlug: 'warrior', specSlug: 'protection' }
  ];

  const results = {};
  let currentIdx = 0;

  for (const item of SPECS) {
    currentIdx++;
    if (!results[item.classKey]) results[item.classKey] = {};
    results[item.classKey][item.specKey] = {
      raid: { m: 0, c: 0, h: 0, v: 0 },
      mplus: { m: 0, c: 0, h: 0, v: 0 }
    };

    console.log(`[${currentIdx}/${SPECS.length}] 🔍 Escaneando ${item.classKey} (${item.specKey})...`);

    for (const mode of ['raid', 'mythic-plus']) {
      const modeKey = mode === 'raid' ? 'raid' : 'mplus';
      
      const url = mode === 'raid'
        ? `https://www.archon.gg/wow/builds/${item.specSlug}/${item.classSlug}/raid/overview/mythic/all-bosses`
        : `https://www.archon.gg/wow/builds/${item.specSlug}/${item.classSlug}/mythic-plus/overview/high-keys/all-dungeons/this-week`;

      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`   ⚠️ ${modeKey.toUpperCase()} HTTP ${res.status} en ${url}`);
          continue;
        }

        const htmlText = await res.text();
        let data = null;

        // 1. Extraer Next.js __NEXT_DATA__
        const match = htmlText.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
        if (match) {
          try {
            const parsed = JSON.parse(match[1]);
            data = parsed.props?.pageProps || parsed;
          } catch (e) {}
        }

        // 2. Extraer streaming RSC chunks
        if (!data) {
          const rscMatches = [...htmlText.matchAll(/self\.__next_f\.push\(\[[\d]+,\s*"(.*?)"\]\)/gs)];
          let combinedRsc = '';
          for (const rm of rscMatches) {
            combinedRsc += rm[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          }
          if (combinedRsc) {
            try {
              const statJson = combinedRsc.match(/\{[^{}]*"(?:mastery|statAverages)"[^{}]*\}/g);
              if (statJson && statJson.length > 0) {
                data = { rawRsc: combinedRsc, foundStats: JSON.parse(statJson[0]) };
              }
            } catch (e) {}
          }
        }

        let m = 0, c = 0, h = 0, v = 0;

        // Extraer cada bloque de estadística individualmente dentro de su propio contenedor
        const containerRegex = /<div class="builds-stat-priority-section__container">([\s\S]*?)<\/span><\/div><\/div><\/div>/gi;
        let containerMatch;
        while ((containerMatch = containerRegex.exec(htmlText)) !== null) {
          const chunk = containerMatch[1];
          const labelMatch = chunk.match(/class="[^"]*builds-stat-priority-section__container__stat-box__label"[^>]*>\s*([^<]+)\s*<\/div>/i);
          const valMatch = chunk.match(/class="[^"]*builds-stat-priority-section__container__stat-box__value"[^>]*>\s*([\d,]+)\s*<\/div>/i);
          
          if (labelMatch && valMatch) {
            const label = labelMatch[1].trim().toLowerCase();
            const val = parseInt(valMatch[1].replace(/,/g, ''), 10);
            
            if (label.includes('mast') || label.includes('maestr')) m = val;
            else if (label.includes('crit')) c = val;
            else if (label.includes('hast') || label.includes('celer')) h = val;
            else if (label.includes('vers')) v = val;
          }
        }

        // Respaldo secundario si los contenedores cambian
        if (m === 0 || c === 0 || h === 0 || v === 0) {
          const allLabels = [...htmlText.matchAll(/class="[^"]*builds-stat-priority-section__container__stat-box__label"[^>]*>\s*([^<]+)\s*<\/div>/gi)].map(x => x[1].trim().toLowerCase());
          const allVals = [...htmlText.matchAll(/class="[^"]*builds-stat-priority-section__container__stat-box__value"[^>]*>\s*([\d,]+)\s*<\/div>/gi)].map(x => parseInt(x[1].replace(/,/g, ''), 10));
          
          // Las estadísticas primarias (Strength/Agility/Intellect) van primero y no tienen valor
          const secondaryLabels = allLabels.filter(l => !l.includes('strength') && !l.includes('agility') && !l.includes('intellect') && !l.includes('fuerza') && !l.includes('agilidad') && !l.includes('intelecto'));
          
          for (let i = 0; i < secondaryLabels.length && i < allVals.length; i++) {
            const l = secondaryLabels[i];
            const val = allVals[i];
            if ((l.includes('mast') || l.includes('maestr')) && m === 0) m = val;
            else if (l.includes('crit') && c === 0) c = val;
            else if ((l.includes('hast') || l.includes('celer')) && h === 0) h = val;
            else if (l.includes('vers') && v === 0) v = val;
          }
        }

        if (m > 0 || c > 0 || h > 0 || v > 0) {
          results[item.classKey][item.specKey][modeKey] = { m, c, h, v };
          console.log(`   ✅ ${modeKey.toUpperCase()} Extraído: M:${m} C:${c} H:${h} V:${v}`);
        } else {
          console.warn(`   ⚠️ ${modeKey.toUpperCase()} no devolvió estadísticas numéricas.`);
        }

        // Extraer y normalizar Árbol Héroe Meta exacto
        const heroMatch = htmlText.match(/class="[^"]*talent-tree__hero-title[^"]*"[^>]*>\s*([^<]+)\s*<\/div>/i);
        if (heroMatch) {
          let rawHeroName = heroMatch[1].trim().toLowerCase()
            .replace(/&#x27;/g, '')
            .replace(/'/g, '')
            .replace(/_of_the_apocalypse/g, '')
            .replace(/_of_the_sun/g, '')
            .replace(/_chosen/g, '')
            .replace(/_of_the_claw/g, '')
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/_$/, '')
            .replace(/^_+/, '');

          if (rawHeroName.includes('san_layn') || rawHeroName.includes('sanlayn')) rawHeroName = 'sanlayn';
          if (rawHeroName.includes('pack_leader')) rawHeroName = 'packleader';
          if (rawHeroName.includes('elune')) rawHeroName = 'elunes_chosen';
          if (rawHeroName.includes('herald')) rawHeroName = 'herald';
          if (rawHeroName.includes('rider')) rawHeroName = 'rider';

          results[item.classKey][item.specKey][modeKey].metaHeroTree = rawHeroName;
          if (!results[item.classKey][item.specKey].metaHeroTree || typeof results[item.classKey][item.specKey].metaHeroTree !== 'object') {
            results[item.classKey][item.specKey].metaHeroTree = {};
          }
          results[item.classKey][item.specKey].metaHeroTree[modeKey] = rawHeroName;
        }
      } catch (err) {
        console.warn(`   ❌ Error en ${item.specKey} (${modeKey}):`, err.message);
      }
    }
  }

  const fileContent = "// Archon.gg Presets Oficiales Extraídos\nwindow.ARCHON_PRESETS = " + JSON.stringify(results, null, 2) + ";\n";

  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'archon_data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  console.log('🎉 ¡Extracción completada con éxito! Archivo archon_data.js descargado.');
  console.table(results);
  return results;
})();
