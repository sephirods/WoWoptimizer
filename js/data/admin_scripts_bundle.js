window.ARCHON_EXTRACTOR_SCRIPT_CODE = "/**\r\n * EXTRACTOR OFICIAL PARA ARCHON.GG (CONSOLA DE NAVEGADOR)\r\n * \r\n * INSTRUCCIONES:\r\n * 1. Abre https://www.archon.gg/wow en tu navegador (Chrome, Edge, Firefox).\r\n * 2. Presiona F12 y ve a la pestaña 'Console' (Consola).\r\n * 3. Pega todo este código y presiona Enter.\r\n * 4. Espera a que termine de escanear las 39 specs (tardará unos 15-20 segundos).\r\n * 5. Se descargará automáticamente el archivo 'archon_data.js' listo para reemplazar el de tu proyecto.\r\n */\r\n\r\n(async function extractArchonData() {\r\n  console.log('🚀 Iniciando extracción de datos de Archon.gg...');\r\n\r\n  const SPECS = [\r\n    { classKey: 'deathknight', specKey: 'blood', classSlug: 'death-knight', specSlug: 'blood' },\r\n    { classKey: 'deathknight', specKey: 'frost_dk', classSlug: 'death-knight', specSlug: 'frost' },\r\n    { classKey: 'deathknight', specKey: 'unholy', classSlug: 'death-knight', specSlug: 'unholy' },\r\n    { classKey: 'demonhunter', specKey: 'havoc', classSlug: 'demon-hunter', specSlug: 'havoc' },\r\n    { classKey: 'demonhunter', specKey: 'vengeance', classSlug: 'demon-hunter', specSlug: 'vengeance' },\r\n    { classKey: 'druid', specKey: 'balance', classSlug: 'druid', specSlug: 'balance' },\r\n    { classKey: 'druid', specKey: 'feral', classSlug: 'druid', specSlug: 'feral' },\r\n    { classKey: 'druid', specKey: 'guardian', classSlug: 'druid', specSlug: 'guardian' },\r\n    { classKey: 'druid', specKey: 'restoration_druid', classSlug: 'druid', specSlug: 'restoration' },\r\n    { classKey: 'evoker', specKey: 'devastation', classSlug: 'evoker', specSlug: 'devastation' },\r\n    { classKey: 'evoker', specKey: 'preservation', classSlug: 'evoker', specSlug: 'preservation' },\r\n    { classKey: 'evoker', specKey: 'augmentation', classSlug: 'evoker', specSlug: 'augmentation' },\r\n    { classKey: 'hunter', specKey: 'beastmastery', classSlug: 'hunter', specSlug: 'beast-mastery' },\r\n    { classKey: 'hunter', specKey: 'marksmanship', classSlug: 'hunter', specSlug: 'marksmanship' },\r\n    { classKey: 'hunter', specKey: 'survival', classSlug: 'hunter', specSlug: 'survival' },\r\n    { classKey: 'mage', specKey: 'arcane', classSlug: 'mage', specSlug: 'arcane' },\r\n    { classKey: 'mage', specKey: 'fire', classSlug: 'mage', specSlug: 'fire' },\r\n    { classKey: 'mage', specKey: 'frost_mage', classSlug: 'mage', specSlug: 'frost' },\r\n    { classKey: 'monk', specKey: 'brewmaster', classSlug: 'monk', specSlug: 'brewmaster' },\r\n    { classKey: 'monk', specKey: 'mistweaver', classSlug: 'monk', specSlug: 'mistweaver' },\r\n    { classKey: 'monk', specKey: 'windwalker', classSlug: 'monk', specSlug: 'windwalker' },\r\n    { classKey: 'paladin', specKey: 'holy_paladin', classSlug: 'paladin', specSlug: 'holy' },\r\n    { classKey: 'paladin', specKey: 'protection_paladin', classSlug: 'paladin', specSlug: 'protection' },\r\n    { classKey: 'paladin', specKey: 'retribution', classSlug: 'paladin', specSlug: 'retribution' },\r\n    { classKey: 'priest', specKey: 'discipline', classSlug: 'priest', specSlug: 'discipline' },\r\n    { classKey: 'priest', specKey: 'holy_priest', classSlug: 'priest', specSlug: 'holy' },\r\n    { classKey: 'priest', specKey: 'shadow', classSlug: 'priest', specSlug: 'shadow' },\r\n    { classKey: 'rogue', specKey: 'assassination', classSlug: 'rogue', specSlug: 'assassination' },\r\n    { classKey: 'rogue', specKey: 'outlaw', classSlug: 'rogue', specSlug: 'outlaw' },\r\n    { classKey: 'rogue', specKey: 'subtlety', classSlug: 'rogue', specSlug: 'subtlety' },\r\n    { classKey: 'shaman', specKey: 'elemental', classSlug: 'shaman', specSlug: 'elemental' },\r\n    { classKey: 'shaman', specKey: 'enhancement', classSlug: 'shaman', specSlug: 'enhancement' },\r\n    { classKey: 'shaman', specKey: 'restoration_shaman', classSlug: 'shaman', specSlug: 'restoration' },\r\n    { classKey: 'warlock', specKey: 'affliction', classSlug: 'warlock', specSlug: 'affliction' },\r\n    { classKey: 'warlock', specKey: 'demonology', classSlug: 'warlock', specSlug: 'demonology' },\r\n    { classKey: 'warlock', specKey: 'destruction', classSlug: 'warlock', specSlug: 'destruction' },\r\n    { classKey: 'warrior', specKey: 'arms', classSlug: 'warrior', specSlug: 'arms' },\r\n    { classKey: 'warrior', specKey: 'fury', classSlug: 'warrior', specSlug: 'fury' },\r\n    { classKey: 'warrior', specKey: 'protection_warrior', classSlug: 'warrior', specSlug: 'protection' }\r\n  ];\r\n\r\n  const results = {};\r\n  let currentIdx = 0;\r\n\r\n  for (const item of SPECS) {\r\n    currentIdx++;\r\n    if (!results[item.classKey]) results[item.classKey] = {};\r\n    results[item.classKey][item.specKey] = {\r\n      raid: { m: 0, c: 0, h: 0, v: 0 },\r\n      mplus: { m: 0, c: 0, h: 0, v: 0 }\r\n    };\r\n\r\n    console.log(`[${currentIdx}/${SPECS.length}] 🔍 Escaneando ${item.classKey} (${item.specKey})...`);\r\n\r\n    for (const mode of ['raid', 'mythic-plus']) {\r\n      const modeKey = mode === 'raid' ? 'raid' : 'mplus';\r\n      \r\n      const url = mode === 'raid'\r\n        ? `https://www.archon.gg/wow/builds/${item.specSlug}/${item.classSlug}/raid/overview/mythic/all-bosses`\r\n        : `https://www.archon.gg/wow/builds/${item.specSlug}/${item.classSlug}/mythic-plus/overview/high-keys/all-dungeons/this-week`;\r\n\r\n      try {\r\n        const res = await fetch(url);\r\n        if (!res.ok) {\r\n          console.warn(`   ⚠️ ${modeKey.toUpperCase()} HTTP ${res.status} en ${url}`);\r\n          continue;\r\n        }\r\n\r\n        const htmlText = await res.text();\r\n        let data = null;\r\n\r\n        // 1. Extraer Next.js __NEXT_DATA__\r\n        const match = htmlText.match(/<script id=\"__NEXT_DATA__\" type=\"application\\/json\">(.*?)<\\/script>/);\r\n        if (match) {\r\n          try {\r\n            const parsed = JSON.parse(match[1]);\r\n            data = parsed.props?.pageProps || parsed;\r\n          } catch (e) {}\r\n        }\r\n\r\n        // 2. Extraer streaming RSC chunks\r\n        if (!data) {\r\n          const rscMatches = [...htmlText.matchAll(/self\\.__next_f\\.push\\(\\[[\\d]+,\\s*\"(.*?)\"\\]\\)/gs)];\r\n          let combinedRsc = '';\r\n          for (const rm of rscMatches) {\r\n            combinedRsc += rm[1].replace(/\\\\\"/g, '\"').replace(/\\\\\\\\/g, '\\\\');\r\n          }\r\n          if (combinedRsc) {\r\n            try {\r\n              const statJson = combinedRsc.match(/\\{[^{}]*\"(?:mastery|statAverages)\"[^{}]*\\}/g);\r\n              if (statJson && statJson.length > 0) {\r\n                data = { rawRsc: combinedRsc, foundStats: JSON.parse(statJson[0]) };\r\n              }\r\n            } catch (e) {}\r\n          }\r\n        }\r\n\r\n        let m = 0, c = 0, h = 0, v = 0;\r\n\r\n        // Extraer cada bloque de estadística individualmente dentro de su propio contenedor\r\n        const containerRegex = /<div class=\"builds-stat-priority-section__container\">([\\s\\S]*?)<\\/span><\\/div><\\/div><\\/div>/gi;\r\n        let containerMatch;\r\n        while ((containerMatch = containerRegex.exec(htmlText)) !== null) {\r\n          const chunk = containerMatch[1];\r\n          const labelMatch = chunk.match(/class=\"[^\"]*builds-stat-priority-section__container__stat-box__label\"[^>]*>\\s*([^<]+)\\s*<\\/div>/i);\r\n          const valMatch = chunk.match(/class=\"[^\"]*builds-stat-priority-section__container__stat-box__value\"[^>]*>\\s*([\\d,]+)\\s*<\\/div>/i);\r\n          \r\n          if (labelMatch && valMatch) {\r\n            const label = labelMatch[1].trim().toLowerCase();\r\n            const val = parseInt(valMatch[1].replace(/,/g, ''), 10);\r\n            \r\n            if (label.includes('mast') || label.includes('maestr')) m = val;\r\n            else if (label.includes('crit')) c = val;\r\n            else if (label.includes('hast') || label.includes('celer')) h = val;\r\n            else if (label.includes('vers')) v = val;\r\n          }\r\n        }\r\n\r\n        // Respaldo secundario si los contenedores cambian\r\n        if (m === 0 || c === 0 || h === 0 || v === 0) {\r\n          const allLabels = [...htmlText.matchAll(/class=\"[^\"]*builds-stat-priority-section__container__stat-box__label\"[^>]*>\\s*([^<]+)\\s*<\\/div>/gi)].map(x => x[1].trim().toLowerCase());\r\n          const allVals = [...htmlText.matchAll(/class=\"[^\"]*builds-stat-priority-section__container__stat-box__value\"[^>]*>\\s*([\\d,]+)\\s*<\\/div>/gi)].map(x => parseInt(x[1].replace(/,/g, ''), 10));\r\n          \r\n          // Las estadísticas primarias (Strength/Agility/Intellect) van primero y no tienen valor\r\n          const secondaryLabels = allLabels.filter(l => !l.includes('strength') && !l.includes('agility') && !l.includes('intellect') && !l.includes('fuerza') && !l.includes('agilidad') && !l.includes('intelecto'));\r\n          \r\n          for (let i = 0; i < secondaryLabels.length && i < allVals.length; i++) {\r\n            const l = secondaryLabels[i];\r\n            const val = allVals[i];\r\n            if ((l.includes('mast') || l.includes('maestr')) && m === 0) m = val;\r\n            else if (l.includes('crit') && c === 0) c = val;\r\n            else if ((l.includes('hast') || l.includes('celer')) && h === 0) h = val;\r\n            else if (l.includes('vers') && v === 0) v = val;\r\n          }\r\n        }\r\n\r\n        if (m > 0 || c > 0 || h > 0 || v > 0) {\r\n          results[item.classKey][item.specKey][modeKey] = { m, c, h, v };\r\n          console.log(`   ✅ ${modeKey.toUpperCase()} Extraído: M:${m} C:${c} H:${h} V:${v}`);\r\n        } else {\r\n          console.warn(`   ⚠️ ${modeKey.toUpperCase()} no devolvió estadísticas numéricas.`);\r\n        }\r\n\r\n        // Extraer y normalizar Árbol Héroe Meta exacto\r\n        const heroMatch = htmlText.match(/class=\"[^\"]*talent-tree__hero-title[^\"]*\"[^>]*>\\s*([^<]+)\\s*<\\/div>/i);\r\n        if (heroMatch) {\r\n          let rawHeroName = heroMatch[1].trim().toLowerCase()\r\n            .replace(/&#x27;/g, '')\r\n            .replace(/'/g, '')\r\n            .replace(/_of_the_apocalypse/g, '')\r\n            .replace(/_of_the_sun/g, '')\r\n            .replace(/_chosen/g, '')\r\n            .replace(/_of_the_claw/g, '')\r\n            .replace(/[^a-z0-9]/g, '_')\r\n            .replace(/_+/g, '_')\r\n            .replace(/_$/, '')\r\n            .replace(/^_+/, '');\r\n\r\n          if (rawHeroName.includes('san_layn') || rawHeroName.includes('sanlayn')) rawHeroName = 'sanlayn';\r\n          if (rawHeroName.includes('pack_leader')) rawHeroName = 'packleader';\r\n          if (rawHeroName.includes('elune')) rawHeroName = 'elunes_chosen';\r\n          if (rawHeroName.includes('herald')) rawHeroName = 'herald';\r\n          if (rawHeroName.includes('rider')) rawHeroName = 'rider';\r\n\r\n          results[item.classKey][item.specKey][modeKey].metaHeroTree = rawHeroName;\r\n          if (!results[item.classKey][item.specKey].metaHeroTree || typeof results[item.classKey][item.specKey].metaHeroTree !== 'object') {\r\n            results[item.classKey][item.specKey].metaHeroTree = {};\r\n          }\r\n          results[item.classKey][item.specKey].metaHeroTree[modeKey] = rawHeroName;\r\n        }\r\n      } catch (err) {\r\n        console.warn(`   ❌ Error en ${item.specKey} (${modeKey}):`, err.message);\r\n      }\r\n    }\r\n  }\r\n\r\n  const fileContent = \"// Archon.gg Presets Oficiales Extraídos\\nwindow.ARCHON_PRESETS = \" + JSON.stringify(results, null, 2) + \";\\n\";\r\n\r\n  const blob = new Blob([fileContent], { type: 'text/javascript' });\r\n  const downloadUrl = URL.createObjectURL(blob);\r\n  const a = document.createElement('a');\r\n  a.href = downloadUrl;\r\n  a.download = 'archon_data.js';\r\n  document.body.appendChild(a);\r\n  a.click();\r\n  document.body.removeChild(a);\r\n  URL.revokeObjectURL(downloadUrl);\r\n\r\n  console.log('🎉 ¡Extracción completada con éxito! Archivo archon_data.js descargado.');\r\n  console.table(results);\r\n  return results;\r\n})();\r\n";
window.WOWHEAD_EXTRACTOR_SCRIPT_CODE = "(async function extractWowheadBis() {\n  console.log(\"%c🚀 Iniciando Extracción Oficial con ICONOS EXACTOS DE TOOLTIPS (40 Specs)...\", \"color: #f59e0b; font-size: 15px; font-weight: bold;\");\n\n  const SPECS = [\n    // Paladín\n    { classKey: 'paladin', specKey: 'retribution', urlSlug: 'paladin/retribution/enchants-gems-pve-dps' },\n    { classKey: 'paladin', specKey: 'holy_paladin', urlSlug: 'paladin/holy/enchants-gems-pve-healer' },\n    { classKey: 'paladin', specKey: 'protection_paladin', urlSlug: 'paladin/protection/enchants-gems-pve-tank' },\n    // Guerrero\n    { classKey: 'warrior', specKey: 'arms', urlSlug: 'warrior/arms/enchants-gems-pve-dps' },\n    { classKey: 'warrior', specKey: 'fury', urlSlug: 'warrior/fury/enchants-gems-pve-dps' },\n    { classKey: 'warrior', specKey: 'protection_warrior', urlSlug: 'warrior/protection/enchants-gems-pve-tank' },\n    // DK\n    { classKey: 'deathknight', specKey: 'blood', urlSlug: 'death-knight/blood/enchants-gems-pve-tank' },\n    { classKey: 'deathknight', specKey: 'frost_dk', urlSlug: 'death-knight/frost/enchants-gems-pve-dps' },\n    { classKey: 'deathknight', specKey: 'unholy', urlSlug: 'death-knight/unholy/enchants-gems-pve-dps' },\n    // Cazador\n    { classKey: 'hunter', specKey: 'beastmastery', urlSlug: 'hunter/beast-mastery/enchants-gems-pve-dps' },\n    { classKey: 'hunter', specKey: 'marksmanship', urlSlug: 'hunter/marksmanship/enchants-gems-pve-dps' },\n    { classKey: 'hunter', specKey: 'survival', urlSlug: 'hunter/survival/enchants-gems-pve-dps' },\n    // Chamán\n    { classKey: 'shaman', specKey: 'elemental', urlSlug: 'shaman/elemental/enchants-gems-pve-dps' },\n    { classKey: 'shaman', specKey: 'enhancement', urlSlug: 'shaman/enhancement/enchants-gems-pve-dps' },\n    { classKey: 'shaman', specKey: 'restoration_shaman', urlSlug: 'shaman/restoration/enchants-gems-pve-healer' },\n    // Pícaro\n    { classKey: 'rogue', specKey: 'assassination', urlSlug: 'rogue/assassination/enchants-gems-pve-dps' },\n    { classKey: 'rogue', specKey: 'outlaw', urlSlug: 'rogue/outlaw/enchants-gems-pve-dps' },\n    { classKey: 'rogue', specKey: 'subtlety', urlSlug: 'rogue/subtlety/enchants-gems-pve-dps' },\n    // Monje\n    { classKey: 'monk', specKey: 'brewmaster', urlSlug: 'monk/brewmaster/enchants-gems-pve-tank' },\n    { classKey: 'monk', specKey: 'windwalker', urlSlug: 'monk/windwalker/enchants-gems-pve-dps' },\n    { classKey: 'monk', specKey: 'mistweaver', urlSlug: 'monk/mistweaver/enchants-gems-pve-healer' },\n    // DH\n    { classKey: 'demonhunter', specKey: 'havoc', urlSlug: 'demon-hunter/havoc/enchants-gems-pve-dps' },\n    { classKey: 'demonhunter', specKey: 'vengeance', urlSlug: 'demon-hunter/vengeance/enchants-gems-pve-tank' },\n    { classKey: 'demonhunter', specKey: 'devourer', urlSlug: 'demon-hunter/devourer/enchants-gems-pve-dps' },\n    // Druida\n    { classKey: 'druid', specKey: 'balance', urlSlug: 'druid/balance/enchants-gems-pve-dps' },\n    { classKey: 'druid', specKey: 'feral', urlSlug: 'druid/feral/enchants-gems-pve-dps' },\n    { classKey: 'druid', specKey: 'guardian', urlSlug: 'druid/guardian/enchants-gems-pve-tank' },\n    { classKey: 'druid', specKey: 'restoration_druid', urlSlug: 'druid/restoration/enchants-gems-pve-healer' },\n    // Mago\n    { classKey: 'mage', specKey: 'arcane', urlSlug: 'mage/arcane/enchants-gems-pve-dps' },\n    { classKey: 'mage', specKey: 'fire', urlSlug: 'mage/fire/enchants-gems-pve-dps' },\n    { classKey: 'mage', specKey: 'frost_mage', urlSlug: 'mage/frost/enchants-gems-pve-dps' },\n    // Brujo\n    { classKey: 'warlock', specKey: 'affliction', urlSlug: 'warlock/affliction/enchants-gems-pve-dps' },\n    { classKey: 'warlock', specKey: 'demonology', urlSlug: 'warlock/demonology/enchants-gems-pve-dps' },\n    { classKey: 'warlock', specKey: 'destruction', urlSlug: 'warlock/destruction/enchants-gems-pve-dps' },\n    // Sacerdote\n    { classKey: 'priest', specKey: 'discipline', urlSlug: 'priest/discipline/enchants-gems-pve-healer' },\n    { classKey: 'priest', specKey: 'holy_priest', urlSlug: 'priest/holy/enchants-gems-pve-healer' },\n    { classKey: 'priest', specKey: 'shadow', urlSlug: 'priest/shadow/enchants-gems-pve-dps' },\n    // Evocador\n    { classKey: 'evoker', specKey: 'devastation', urlSlug: 'evoker/devastation/enchants-gems-pve-dps' },\n    { classKey: 'evoker', specKey: 'preservation', urlSlug: 'evoker/preservation/enchants-gems-pve-healer' },\n    { classKey: 'evoker', specKey: 'augmentation', urlSlug: 'evoker/augmentation/enchants-gems-pve-dps' }\n  ];\n\n  const iconCache = {};\n  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));\n\n  async function fetchRealIcon(id, type) {\n    if (!id) return 'inv_misc_questionmark';\n    if (iconCache[id]) return iconCache[id];\n    try {\n      const endpoint = type === 'spell' \n        ? `https://nether.wowhead.com/tooltip/spell/${id}`\n        : `https://nether.wowhead.com/tooltip/item/${id}`;\n      const res = await fetch(endpoint);\n      if (res.ok) {\n        const data = await res.json();\n        if (data && data.icon) {\n          iconCache[id] = data.icon;\n          return data.icon;\n        }\n      }\n    } catch (e) {}\n    return 'inv_misc_questionmark';\n  }\n\n  function parseTablesFromHtml(html) {\n    const normalizedHtml = html.replace(/<tr>\\s*([^<]+)<\\/td>/gi, '<tr><td>$1</td>');\n    const parser = new DOMParser();\n    const doc = parser.parseFromString(normalizedHtml, \"text/html\");\n    let tables = Array.from(doc.querySelectorAll(\"table\"));\n\n    if (tables.length === 0) {\n      doc.querySelectorAll(\"noscript\").forEach(ns => {\n        const subDoc = parser.parseFromString(ns.textContent || ns.innerHTML || \"\", \"text/html\");\n        tables.push(...subDoc.querySelectorAll(\"table\"));\n      });\n    }\n\n    const rawItems = [];\n\n    tables.forEach((table) => {\n      const heading = table.previousElementSibling?.innerText || table.closest(\"section\")?.querySelector(\"h2, h3\")?.innerText || \"\";\n      const rows = table.querySelectorAll(\"tr\");\n\n      rows.forEach((row) => {\n        const cols = row.querySelectorAll(\"td\");\n        if (cols.length < 2) return;\n\n        const label = cols[0].innerText.trim();\n        const links = Array.from(cols[1].querySelectorAll(\"a[href*='/item='], a[href*='/spell=']\"));\n        if (links.length === 0) {\n          const fallbackLink = cols[1].querySelector(\"a\");\n          if (fallbackLink) links.push(fallbackLink);\n        }\n        if (links.length === 0) return;\n\n        links.forEach(link => {\n          const name = link.innerText.trim();\n          if (!name) return;\n          const href = link.getAttribute(\"href\") || \"\";\n          const matchItem = href.match(/item=(\\d+)/);\n          const matchSpell = href.match(/spell=(\\d+)/);\n          const id = matchItem ? parseInt(matchItem[1]) : (matchSpell ? parseInt(matchSpell[1]) : 0);\n          const entityType = matchSpell ? 'spell' : 'item';\n\n          const isConsumable = /flask|potion|food|rune|oil|weapon buff|feast/i.test(label) || /consumable/i.test(heading);\n          const isEnchant = /weapon|chest|cloak|back|wrist|bracer|boots|feet|legs|ring|finger|helm|head|shoulder|hand|main hand|off hand/i.test(label) || /enchant/i.test(heading) || /^enchant\\s/i.test(name);\n\n          if (isConsumable) {\n            rawItems.push({ category: 'consumable', type: label, id, entityType, name, desc: name });\n          } else if (isEnchant) {\n            const slotName = /main hand|off hand/i.test(label) ? `Weapon (${label})` : label;\n            rawItems.push({ category: 'enchant', slot: slotName, id, entityType, name, desc: name });\n          }\n        });\n      });\n    });\n\n    // Fallback para frascos de Evoker Preservación\n    if (!rawItems.some(i => i.category === 'consumable' && /flask/i.test(i.type))) {\n      const flaskLinks = Array.from(doc.querySelectorAll(\"a[href*='flask-']\"));\n      flaskLinks.forEach(link => {\n        const name = link.innerText.trim();\n        const matchId = (link.getAttribute(\"href\") || \"\").match(/item=(\\d+)/);\n        if (name && matchId) {\n          const id = parseInt(matchId[1]);\n          if (!rawItems.some(i => i.id === id)) {\n            rawItems.unshift({ category: 'consumable', type: 'Flask', id, entityType: 'item', name, desc: name });\n          }\n        }\n      });\n    }\n\n    return rawItems;\n  }\n\n  const results = {};\n\n  for (let i = 0; i < SPECS.length; i++) {\n    const s = SPECS[i];\n    if (!results[s.classKey]) results[s.classKey] = {};\n\n    const url = `https://www.wowhead.com/guide/classes/${s.urlSlug}`;\n    try {\n      const res = await fetch(url);\n      if (res.ok) {\n        const html = await res.text();\n        const rawItems = parseTablesFromHtml(html);\n        \n        const enchants = [];\n        const consumables = [];\n\n        for (const item of rawItems) {\n          const icon = await fetchRealIcon(item.id, item.entityType);\n          if (item.category === 'enchant') {\n            enchants.push({ slot: item.slot, id: item.id, name: item.name, icon, desc: item.desc });\n          } else {\n            consumables.push({ type: item.type, id: item.id, name: item.name, icon, desc: item.desc });\n          }\n        }\n\n        results[s.classKey][s.specKey] = { enchants, consumables };\n        console.log(`[${i + 1}/${SPECS.length}] ✓ ${s.classKey} - ${s.specKey}: ${enchants.length} encantamientos y ${consumables.length} consumibles (iconos oficiales obtenidos).`);\n      }\n    } catch (e) {\n      console.error(`Error en ${url}:`, e);\n    }\n\n    await sleep(200);\n  }\n\n  // Descargar archivo oficial con iconos reales de Wowhead\n  const jsContent = `// ENCANTAMIENTOS Y CONSUMIBLES OFICIALES EXTRAÍDOS\\nwindow.WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES = ${JSON.stringify(results, null, 2)};\\n`;\n  const blob = new Blob([jsContent], { type: \"application/javascript\" });\n  const link = document.createElement(\"a\");\n  link.href = URL.createObjectURL(blob);\n  link.download = \"wowhead_data.js\";\n  document.body.appendChild(link);\n  link.click();\n  document.body.removeChild(link);\n\n  console.log(\"%c✅ ¡Extracción completada! Se descargó wowhead_data.js con TODOS los iconos reales extraídos directamente de los tooltips.\", \"color: #10b981; font-size: 16px; font-weight: bold;\");\n  return results;\n})();\n";
window.WOW_NEWS_EXTRACTOR_SCRIPT_CODE = `/**
 * EXTRACTOR OFICIAL DE NOTICIAS Y BLUE TRACKER DESDE WOWHEAD (CONSOLA)
 * 
 * INSTRUCCIONES:
 * 1. Abre https://www.wowhead.com en tu navegador.
 * 2. Presiona F12 y ve a la pestaña 'Console'.
 * 3. Pega este código y presiona Enter.
 * 4. El script extraerá los titulares y resúmenes del Blue Tracker y Recent News de Wowhead.
 * 5. Se descargará el archivo 'wow_news_data.js' listo para subirlo al panel admin.
 */

(async function extractWowheadNews() {
  console.log('📰 Extrayendo noticias y Blue Tracker de Wowhead...');
  
  const blueTracker = [];
  const recentNews = [];

  // Extraer Blue Tracker
  document.querySelectorAll('.news-list-card, [data-news-type="blue"], .bluetracker li, a[href*="/news="]').forEach((el, idx) => {
    const title = el.innerText.trim();
    const href = el.getAttribute('href') || '';
    if (title.length > 10 && blueTracker.length < 10) {
      blueTracker.push({
        id: 'blue-' + (idx + 1),
        region: title.includes('EU') ? 'EU' : 'US',
        timeAgo: 'Reciente',
        date: new Date().toLocaleDateString(),
        title: title.slice(0, 100),
        author: 'Blizzard Entertainment',
        tag: 'Blue Post',
        category: 'Balance',
        badgeColor: 'border-sky-500/60 bg-sky-950/80 text-sky-300',
        summary: title,
        content: '<p class=\"text-sm text-slate-300 leading-relaxed\">' + title + '</p>'
      });
    }
  });

  const dataset = { blueTracker, recentNews };
  const fileContent = '// BASE DE DATOS DE NOTICIAS WOWHEAD EXTRAÍDAS\\nwindow.WOW_NEWS_DATABASE = ' + JSON.stringify(dataset, null, 2) + ';\\n';
  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'wow_news_data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  console.log('✅ wow_news_data.js descargado con éxito.');
  return dataset;
})();`;

window.ARCHON_HEALER_EXTRACTOR_SCRIPT_CODE = `/**
 * EXTRACTOR OFICIAL DE ABALORIOS HEALER PARA ARCHON.GG (CONSOLA DE NAVEGADOR)
 * 
 * INSTRUCCIONES:
 * 1. Abre https://www.archon.gg/wow en tu navegador (Chrome, Edge, Firefox).
 * 2. Presiona F12 y ve a la pestaña 'Console' (Consola).
 * 3. Pega todo este código y presiona Enter.
 * 4. Espera a que termine de escanear los 7 healers en Mítica+ y Banda.
 * 5. Se descargará automáticamente el archivo 'archon_healers.js' listo para subirlo en el Panel Admin.
 */

(async () => {
  console.log('%c🚀 INICIANDO EXTRACCIÓN DE TODOS LOS HEALERS DE ARCHON...', 'color: #38bdf8; font-weight: bold; font-size: 14px;');

  const HEALER_TARGETS = [
    { classKey: 'paladin', specKey: 'holy', urlPath: 'holy/paladin' },
    { classKey: 'priest', specKey: 'discipline', urlPath: 'discipline/priest' },
    { classKey: 'priest', specKey: 'holy_priest', urlPath: 'holy/priest' },
    { classKey: 'shaman', specKey: 'restoration_shaman', urlPath: 'restoration/shaman' },
    { classKey: 'druid', specKey: 'restoration_druid', urlPath: 'restoration/druid' },
    { classKey: 'monk', specKey: 'mistweaver', urlPath: 'mistweaver/monk' },
    { classKey: 'evoker', specKey: 'preservation', urlPath: 'preservation/evoker' }
  ];

  const MODES = [
    { key: 'mplus', urlSub: 'mythic-plus/trinkets/high-keys/all-dungeons/this-week' },
    { key: 'raid', urlSub: 'raid/trinkets/mythic/all-bosses' }
  ];

  const masterData = {};

  function parseHtmlTrinkets(htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const rows = [];

    doc.querySelectorAll('table.react-table tbody tr').forEach(tr => {
      const link = tr.querySelector('a[href*="wowhead.com/item="]');
      if (!link) return;
      const itemMatch = link.href.match(/item=(\\d+)/);
      if (!itemMatch) return;
      const itemId = parseInt(itemMatch[1]);
      
      const nameEl = tr.querySelector('.icon__label, a[href*="wowhead.com/item="] span span');
      const name = nameEl ? nameEl.innerText.trim() : ('Item ' + itemId);
      
      const popEl = tr.querySelector('.react-table__cell--popularityAndReportLink span, .react-table__cell--popularity span');
      const popText = popEl ? popEl.innerText.trim() : '0%';
      const popMatch = popText.match(/([0-9.]+)%/);
      const popularity = popMatch ? parseFloat(popMatch[1]) : 0;
      
      const maxKeyEl = tr.querySelector('.react-table__cell--maxKey span');
      const maxKey = maxKeyEl ? maxKeyEl.innerText.trim() : '';
      
      const imgEl = tr.querySelector('img.icon__image');
      let icon = '';
      if (imgEl && imgEl.src) {
        const im = imgEl.src.match(/\\/abilities\\/([^.]+)/);
        if (im) icon = im[1];
      }
      
      rows.push({ itemId, name, popularity, maxKey, icon });
    });

    return rows;
  }

  for (const h of HEALER_TARGETS) {
    if (!masterData[h.classKey]) masterData[h.classKey] = {};
    if (!masterData[h.classKey][h.specKey]) masterData[h.classKey][h.specKey] = {};

    for (const m of MODES) {
      const url = \`https://www.archon.gg/wow/builds/\${h.urlPath}/\${m.urlSub}\`;
      console.log(\`Descargando (\${h.classKey} - \${h.specKey} - \${m.key})...\`);
      try {
        const resp = await fetch(url);
        if (resp.ok) {
          const html = await resp.text();
          const trinkets = parseHtmlTrinkets(html);
          masterData[h.classKey][h.specKey][m.key] = trinkets;
          console.log(\`  ✓ \${trinkets.length} abalorios encontrados.\`);
        } else {
          console.warn(\`  ✗ HTTP \${resp.status} en \${url}\`);
          masterData[h.classKey][h.specKey][m.key] = [];
        }
      } catch (e) {
        console.error(\`  ✗ Error en \${url}:\`, e);
        masterData[h.classKey][h.specKey][m.key] = [];
      }
      await new Promise(r => setTimeout(r, 400));
    }
  }

  const finalOutput = JSON.stringify(masterData, null, 2);
  const fileContent = '// Archon.gg Top Healer Trinkets\\nwindow.ARCHON_HEALER_TRINKETS = ' + finalOutput + ';\\n';

  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'archon_healers.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  console.log('%c✅ ¡EXTRACCIÓN COMPLETA! Se descargó archon_healers.js y se copió al portapapeles.', 'color: #22c55e; font-weight: bold; font-size: 16px;');
  
  if (typeof copy === 'function') {
    copy(finalOutput);
  }
  
  return masterData;
})();
`;
