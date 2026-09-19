(async function extractWowheadBis() {
  console.log("%c🚀 Iniciando Extracción Oficial con ICONOS EXACTOS DE TOOLTIPS (40 Specs)...", "color: #f59e0b; font-size: 15px; font-weight: bold;");

  const SPECS = [
    // Paladín
    { classKey: 'paladin', specKey: 'retribution', urlSlug: 'paladin/retribution/enchants-gems-pve-dps' },
    { classKey: 'paladin', specKey: 'holy_paladin', urlSlug: 'paladin/holy/enchants-gems-pve-healer' },
    { classKey: 'paladin', specKey: 'protection_paladin', urlSlug: 'paladin/protection/enchants-gems-pve-tank' },
    // Guerrero
    { classKey: 'warrior', specKey: 'arms', urlSlug: 'warrior/arms/enchants-gems-pve-dps' },
    { classKey: 'warrior', specKey: 'fury', urlSlug: 'warrior/fury/enchants-gems-pve-dps' },
    { classKey: 'warrior', specKey: 'protection_warrior', urlSlug: 'warrior/protection/enchants-gems-pve-tank' },
    // DK
    { classKey: 'deathknight', specKey: 'blood', urlSlug: 'death-knight/blood/enchants-gems-pve-tank' },
    { classKey: 'deathknight', specKey: 'frost_dk', urlSlug: 'death-knight/frost/enchants-gems-pve-dps' },
    { classKey: 'deathknight', specKey: 'unholy', urlSlug: 'death-knight/unholy/enchants-gems-pve-dps' },
    // Cazador
    { classKey: 'hunter', specKey: 'beastmastery', urlSlug: 'hunter/beast-mastery/enchants-gems-pve-dps' },
    { classKey: 'hunter', specKey: 'marksmanship', urlSlug: 'hunter/marksmanship/enchants-gems-pve-dps' },
    { classKey: 'hunter', specKey: 'survival', urlSlug: 'hunter/survival/enchants-gems-pve-dps' },
    // Chamán
    { classKey: 'shaman', specKey: 'elemental', urlSlug: 'shaman/elemental/enchants-gems-pve-dps' },
    { classKey: 'shaman', specKey: 'enhancement', urlSlug: 'shaman/enhancement/enchants-gems-pve-dps' },
    { classKey: 'shaman', specKey: 'restoration_shaman', urlSlug: 'shaman/restoration/enchants-gems-pve-healer' },
    // Pícaro
    { classKey: 'rogue', specKey: 'assassination', urlSlug: 'rogue/assassination/enchants-gems-pve-dps' },
    { classKey: 'rogue', specKey: 'outlaw', urlSlug: 'rogue/outlaw/enchants-gems-pve-dps' },
    { classKey: 'rogue', specKey: 'subtlety', urlSlug: 'rogue/subtlety/enchants-gems-pve-dps' },
    // Monje
    { classKey: 'monk', specKey: 'brewmaster', urlSlug: 'monk/brewmaster/enchants-gems-pve-tank' },
    { classKey: 'monk', specKey: 'windwalker', urlSlug: 'monk/windwalker/enchants-gems-pve-dps' },
    { classKey: 'monk', specKey: 'mistweaver', urlSlug: 'monk/mistweaver/enchants-gems-pve-healer' },
    // DH
    { classKey: 'demonhunter', specKey: 'havoc', urlSlug: 'demon-hunter/havoc/enchants-gems-pve-dps' },
    { classKey: 'demonhunter', specKey: 'vengeance', urlSlug: 'demon-hunter/vengeance/enchants-gems-pve-tank' },
    { classKey: 'demonhunter', specKey: 'devourer', urlSlug: 'demon-hunter/devourer/enchants-gems-pve-dps' },
    // Druida
    { classKey: 'druid', specKey: 'balance', urlSlug: 'druid/balance/enchants-gems-pve-dps' },
    { classKey: 'druid', specKey: 'feral', urlSlug: 'druid/feral/enchants-gems-pve-dps' },
    { classKey: 'druid', specKey: 'guardian', urlSlug: 'druid/guardian/enchants-gems-pve-tank' },
    { classKey: 'druid', specKey: 'restoration_druid', urlSlug: 'druid/restoration/enchants-gems-pve-healer' },
    // Mago
    { classKey: 'mage', specKey: 'arcane', urlSlug: 'mage/arcane/enchants-gems-pve-dps' },
    { classKey: 'mage', specKey: 'fire', urlSlug: 'mage/fire/enchants-gems-pve-dps' },
    { classKey: 'mage', specKey: 'frost_mage', urlSlug: 'mage/frost/enchants-gems-pve-dps' },
    // Brujo
    { classKey: 'warlock', specKey: 'affliction', urlSlug: 'warlock/affliction/enchants-gems-pve-dps' },
    { classKey: 'warlock', specKey: 'demonology', urlSlug: 'warlock/demonology/enchants-gems-pve-dps' },
    { classKey: 'warlock', specKey: 'destruction', urlSlug: 'warlock/destruction/enchants-gems-pve-dps' },
    // Sacerdote
    { classKey: 'priest', specKey: 'discipline', urlSlug: 'priest/discipline/enchants-gems-pve-healer' },
    { classKey: 'priest', specKey: 'holy_priest', urlSlug: 'priest/holy/enchants-gems-pve-healer' },
    { classKey: 'priest', specKey: 'shadow', urlSlug: 'priest/shadow/enchants-gems-pve-dps' },
    // Evocador
    { classKey: 'evoker', specKey: 'devastation', urlSlug: 'evoker/devastation/enchants-gems-pve-dps' },
    { classKey: 'evoker', specKey: 'preservation', urlSlug: 'evoker/preservation/enchants-gems-pve-healer' },
    { classKey: 'evoker', specKey: 'augmentation', urlSlug: 'evoker/augmentation/enchants-gems-pve-dps' }
  ];

  const iconCache = {};
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  async function fetchRealIcon(id, type) {
    if (!id) return 'inv_misc_questionmark';
    if (iconCache[id]) return iconCache[id];
    try {
      const endpoint = type === 'spell' 
        ? `https://nether.wowhead.com/tooltip/spell/${id}`
        : `https://nether.wowhead.com/tooltip/item/${id}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (data && data.icon) {
          iconCache[id] = data.icon;
          return data.icon;
        }
      }
    } catch (e) {}
    return 'inv_misc_questionmark';
  }

  function parseTablesFromHtml(html) {
    const normalizedHtml = html.replace(/<tr>\s*([^<]+)<\/td>/gi, '<tr><td>$1</td>');
    const parser = new DOMParser();
    const doc = parser.parseFromString(normalizedHtml, "text/html");
    let tables = Array.from(doc.querySelectorAll("table"));

    if (tables.length === 0) {
      doc.querySelectorAll("noscript").forEach(ns => {
        const subDoc = parser.parseFromString(ns.textContent || ns.innerHTML || "", "text/html");
        tables.push(...subDoc.querySelectorAll("table"));
      });
    }

    const rawItems = [];

    tables.forEach((table) => {
      const heading = table.previousElementSibling?.innerText || table.closest("section")?.querySelector("h2, h3")?.innerText || "";
      const rows = table.querySelectorAll("tr");

      rows.forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length < 2) return;

        const label = cols[0].innerText.trim();
        const links = Array.from(cols[1].querySelectorAll("a[href*='/item='], a[href*='/spell=']"));
        if (links.length === 0) {
          const fallbackLink = cols[1].querySelector("a");
          if (fallbackLink) links.push(fallbackLink);
        }
        if (links.length === 0) return;

        links.forEach(link => {
          const name = link.innerText.trim();
          if (!name) return;
          const href = link.getAttribute("href") || "";
          const matchItem = href.match(/item=(\d+)/);
          const matchSpell = href.match(/spell=(\d+)/);
          const id = matchItem ? parseInt(matchItem[1]) : (matchSpell ? parseInt(matchSpell[1]) : 0);
          const entityType = matchSpell ? 'spell' : 'item';

          const isConsumable = /flask|potion|food|rune|oil|weapon buff|feast/i.test(label) || /consumable/i.test(heading);
          const isEnchant = /weapon|chest|cloak|back|wrist|bracer|boots|feet|legs|ring|finger|helm|head|shoulder|hand|main hand|off hand/i.test(label) || /enchant/i.test(heading) || /^enchant\s/i.test(name);

          if (isConsumable) {
            rawItems.push({ category: 'consumable', type: label, id, entityType, name, desc: name });
          } else if (isEnchant) {
            const slotName = /main hand|off hand/i.test(label) ? `Weapon (${label})` : label;
            rawItems.push({ category: 'enchant', slot: slotName, id, entityType, name, desc: name });
          }
        });
      });
    });

    // Fallback para frascos de Evoker Preservación
    if (!rawItems.some(i => i.category === 'consumable' && /flask/i.test(i.type))) {
      const flaskLinks = Array.from(doc.querySelectorAll("a[href*='flask-']"));
      flaskLinks.forEach(link => {
        const name = link.innerText.trim();
        const matchId = (link.getAttribute("href") || "").match(/item=(\d+)/);
        if (name && matchId) {
          const id = parseInt(matchId[1]);
          if (!rawItems.some(i => i.id === id)) {
            rawItems.unshift({ category: 'consumable', type: 'Flask', id, entityType: 'item', name, desc: name });
          }
        }
      });
    }

    return rawItems;
  }

  const results = {};

  for (let i = 0; i < SPECS.length; i++) {
    const s = SPECS[i];
    if (!results[s.classKey]) results[s.classKey] = {};

    const url = `https://www.wowhead.com/guide/classes/${s.urlSlug}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const html = await res.text();
        const rawItems = parseTablesFromHtml(html);
        
        const enchants = [];
        const consumables = [];

        for (const item of rawItems) {
          const icon = await fetchRealIcon(item.id, item.entityType);
          if (item.category === 'enchant') {
            enchants.push({ slot: item.slot, id: item.id, name: item.name, icon, desc: item.desc });
          } else {
            consumables.push({ type: item.type, id: item.id, name: item.name, icon, desc: item.desc });
          }
        }

        results[s.classKey][s.specKey] = { enchants, consumables };
        console.log(`[${i + 1}/${SPECS.length}] ✓ ${s.classKey} - ${s.specKey}: ${enchants.length} encantamientos y ${consumables.length} consumibles (iconos oficiales obtenidos).`);
      }
    } catch (e) {
      console.error(`Error en ${url}:`, e);
    }

    await sleep(200);
  }

  // Descargar archivo oficial con iconos reales de Wowhead
  const jsContent = `// ENCANTAMIENTOS Y CONSUMIBLES OFICIALES EXTRAÍDOS\nwindow.WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES = ${JSON.stringify(results, null, 2)};\n`;
  const blob = new Blob([jsContent], { type: "application/javascript" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "wowhead_data.js";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log("%c✅ ¡Extracción completada! Se descargó wowhead_data.js con TODOS los iconos reales extraídos directamente de los tooltips.", "color: #10b981; font-size: 16px; font-weight: bold;");
  return results;
})();
