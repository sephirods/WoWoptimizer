// WOWHEAD TOOLTIPS & ICON RESOLUTION
const SLOT_SVG_COLORS = {
  head: '#a855f7',
  neck: '#38bdf8',
  shoulder: '#ec4899',
  back: '#94a3b8',
  chest: '#3b82f6',
  wrist: '#6366f1',
  hands: '#10b981',
  waist: '#f59e0b',
  legs: '#eab308',
  feet: '#f97316',
  finger: '#06b6d4',
  trinket: '#d946ef',
  weapon_2h: '#ef4444',
  weapon_1h: '#f43f5e',
  shield: '#8b5cf6'
};

function getSlotPlaceholderSvg(slot) {
  const color = SLOT_SVG_COLORS[slot] || '#a855f7';
  const label = (slot || 'item').toUpperCase().replace('WEAPON_', '').substring(0, 4);
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="8" fill="#0f1422" stroke="${color}" stroke-width="2"/>
      <circle cx="32" cy="24" r="10" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="1.5"/>
      <text x="32" y="48" fill="${color}" font-family="sans-serif" font-weight="bold" font-size="9" text-anchor="middle">${label}</text>
    </svg>
  `);
}

let metadataCache = {};
try {
  metadataCache = JSON.parse(localStorage.getItem('wow_metadata_cache_v10')) || {};
} catch (e) {
  metadataCache = {};
}

function getWowheadBaseUrl() {
  if (typeof currentLang === 'undefined') return 'https://www.wowhead.com';
  if (currentLang === 'mx') return 'https://www.wowhead.com/mx';
  if (currentLang === 'es') return 'https://www.wowhead.com/es';
  return 'https://www.wowhead.com';
}

function getWowheadDomainParam() {
  if (typeof currentLang === 'undefined') return '';
  if (currentLang === 'mx') return '&domain=mx';
  if (currentLang === 'es') return '&domain=es';
  return '';
}

function recordMissingTooltipEntity(entityInfo) {
  if (!entityInfo || !entityInfo.id) return;
  try {
    let logs = JSON.parse(localStorage.getItem('wow_missing_tooltips_log') || '[]');
    const existing = logs.find(x => String(x.id) === String(entityInfo.id) && x.kind === entityInfo.kind);
    if (existing) {
      existing.occurrences = (existing.occurrences || 1) + 1;
      existing.lastSeen = new Date().toISOString();
      if (entityInfo.name && !existing.name) existing.name = entityInfo.name;
    } else {
      logs.unshift({
        id: entityInfo.id,
        kind: entityInfo.kind || 'item',
        name: entityInfo.name || 'Desconocido',
        url: entityInfo.url || '',
        occurrences: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      });
      // Mantener máx 100 registros
      if (logs.length > 100) logs = logs.slice(0, 100);
    }
    localStorage.setItem('wow_missing_tooltips_log', JSON.stringify(logs));
  } catch (e) {}
}

function initTooltipNotFoundDetector() {
  if (typeof document === 'undefined') return;
  
  // Observar cuando Wowhead inyecta tooltips con "not found"
  let checkTimer = null;
  const checkForNotFound = () => {
    const tooltips = document.querySelectorAll('.wowhead-tooltip, [id^="wowhead-tooltip"]');
    tooltips.forEach(tt => {
      const text = (tt.textContent || '').toLowerCase();
      if (text.includes('not found') || text.includes('no se encontró') || text.includes('no encontrado')) {
        // Encontrar qué link lo disparó
        const activeLink = document.querySelector('a:hover[data-wowhead], a:hover[href*="wowhead.com"]');
        if (activeLink) {
          const href = activeLink.getAttribute('href') || '';
          const matchItem = href.match(/item=(\d+)/i);
          const matchSpell = href.match(/spell=(\d+)/i);
          const name = activeLink.textContent?.trim() || activeLink.getAttribute('title') || '';
          if (matchItem) {
            recordMissingTooltipEntity({ id: parseInt(matchItem[1], 10), kind: 'item', name, url: href });
          } else if (matchSpell) {
            recordMissingTooltipEntity({ id: parseInt(matchSpell[1], 10), kind: 'spell', name, url: href });
          }
        }
      }
    });
  };

  document.addEventListener('mouseover', (e) => {
    if (checkTimer) clearTimeout(checkTimer);
    checkTimer = setTimeout(checkForNotFound, 400);
  }, true);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltipNotFoundDetector);
  } else {
    initTooltipNotFoundDetector();
  }
}

function isSpellEntity(id, type, name = '') {
  if (type === 'spell' || type === 'Weapon Buff') return true;
  if (id === 382021) return true; // Earthliving Weapon
  if (name && (name.toLowerCase().includes('weapon imbue') || name.toLowerCase().includes('earthliving weapon'))) return true;
  return false;
}

function getWowheadEntityUrl(id, type, name = '') {
  const base = getWowheadBaseUrl();
  const kind = isSpellEntity(id, type, name) ? 'spell' : 'item';
  return `${base}/${kind}=${id}`;
}

function getWowheadEntityDataAttr(id, type, name = '') {
  if (!id) return '';
  const domainParam = getWowheadDomainParam();
  const kind = isSpellEntity(id, type, name) ? 'spell' : 'item';
  return `data-wowhead="${kind}=${id}${domainParam}"`;
}

function getWowheadItemDataAttr(itemId) {
  return getWowheadEntityDataAttr(itemId, 'item');
}

function getItemWowheadAttr(it) {
  if (!it || !it.itemId) return '';
  const domainParam = getWowheadDomainParam();
  let params = `item=${it.itemId}${domainParam}`;
  if (it.ilvl) params += `&ilvl=${it.ilvl}`;
  
  let bonusStr = it.bonus || '';
  if (!bonusStr && it.bonus_id) {
    bonusStr = String(it.bonus_id).replace(/\//g, ':');
  } else if (!bonusStr && it.rawSimcOptions) {
    const bm = it.rawSimcOptions.match(/bonus_id=([0-9/]+)/i);
    if (bm) bonusStr = bm[1].replace(/\//g, ':');
  }
  if (bonusStr) params += `&bonus=${bonusStr}`;

  if (it.rawSimcOptions) {
    const em = it.rawSimcOptions.match(/enchant_id=(\d+)/i);
    if (em) params += `&ench=${em[1]}`;
    const gm = it.rawSimcOptions.match(/gem_id=(\d+)/i);
    if (gm) params += `&gems=${gm[1]}`;
  } else if (it.gemItemId) {
    params += `&gems=${it.gemItemId}`;
  }

  if (it.craftedStatCodes && it.craftedStatCodes.length === 2) {
    params += `&crafted_stats=${it.craftedStatCodes[0]}:${it.craftedStatCodes[1]}`;
  }

  return `data-wowhead="${params}" data-item-uid="${it.id || ''}"`;
}

function getWowheadIconUrl(iconName, slot, itemId) {
  if (itemId) {
    if (window.BLOODMALLET_ITEM_ICONS && window.BLOODMALLET_ITEM_ICONS[itemId]) {
      return `https://wow.zamimg.com/images/wow/icons/large/${window.BLOODMALLET_ITEM_ICONS[itemId]}.jpg`;
    }
    if (metadataCache[itemId]?.icon) {
      return `https://wow.zamimg.com/images/wow/icons/large/${metadataCache[itemId].icon}.jpg`;
    }
  }
  return `https://wow.zamimg.com/images/wow/icons/large/${iconName || SLOT_FALLBACK_ICONS[slot] || 'inv_misc_questionmark'}.jpg`;
}

function detectSlotFromTooltipHtml(html, name = '') {
  const fullHtml = html || '';
  const invSlotMatch = fullHtml.match(/<!--inventorySlot(\d+)-->/i);
  if (invSlotMatch) {
    const sId = parseInt(invSlotMatch[1]);
    const map = {
      1: 'head', 2: 'neck', 3: 'shoulder', 4: 'shirt', 5: 'chest', 20: 'chest',
      6: 'waist', 7: 'legs', 8: 'feet', 9: 'wrist', 10: 'hands', 11: 'finger',
      12: 'trinket', 13: 'weapon_1h', 14: 'shield', 15: 'weapon_2h', 16: 'back',
      17: 'weapon_2h', 21: 'weapon_1h', 22: 'shield', 23: 'shield', 26: 'weapon_2h'
    };
    if (map[sId]) return map[sId];
  }

  const h = fullHtml.split(/Set:|<!--set|<table class="tooltip-set/i)[0];
  if (h.includes('Head') || h.includes('Helm') || h.includes('Crown') || h.includes('Gaze')) return 'head';
  if (h.includes('Shoulder') || h.includes('Pauldrons') || h.includes('Mantle')) return 'shoulder';
  if (h.includes('Chest') || h.includes('Robe') || h.includes('Vestment') || h.includes('Tunic') || h.includes('Hauberk') || h.includes('Breastplate')) return 'chest';
  if (h.includes('Back') || h.includes('Cloak') || h.includes('Cape') || h.includes('Shroud')) return 'back';
  if (h.includes('Wrist') || h.includes('Bracers') || h.includes('Cuffs') || h.includes('Armbands')) return 'wrist';
  if (h.includes('Hands') || h.includes('Gloves') || h.includes('Gauntlets') || h.includes('Grips')) return 'hands';
  if (h.includes('Waist') || h.includes('Belt') || h.includes('Girdle') || h.includes('Clasp')) return 'waist';
  if (h.includes('Legs') || h.includes('Pants') || h.includes('Leggings') || h.includes('Breeches') || h.includes('Trousers')) return 'legs';
  if (h.includes('Feet') || h.includes('Boots') || h.includes('Warboots') || h.includes('Sabatons') || h.includes('Striders')) return 'feet';
  if (h.includes('Neck') || h.includes('Pendant') || h.includes('Choker') || h.includes('Amulet')) return 'neck';
  if (h.includes('Finger') || h.includes('Ring') || h.includes('Band') || h.includes('Signet')) return 'finger';
  if (h.includes('Trinket')) return 'trinket';
  if (h.includes('Two-Hand') || h.includes('Polearm') || h.includes('Staff') || h.includes('Bow') || h.includes('Crossbow') || h.includes('Gun')) return 'weapon_2h';
  if (h.includes('One-Hand') || h.includes('Dagger') || h.includes('Main Hand') || h.includes('Fist Weapon')) return 'weapon_1h';
  if (h.includes('Shield') || h.includes('Off Hand') || h.includes('Held In Off-hand')) return 'shield';
  
  return null;
}

async function fetchWowheadItemMetadata(itemId, targetIlvl = 321, bonusStr = '', enchantId = null) {
  if (!itemId) return null;
  const cacheKey = `${itemId}_${targetIlvl}_${bonusStr || 'none'}_${enchantId || 'none'}`;
  if (metadataCache[cacheKey] && metadataCache[cacheKey].crit !== undefined && metadataCache[cacheKey].primaryStat !== undefined) {
    return metadataCache[cacheKey];
  }

  try {
    let url = `https://nether.wowhead.com/tooltip/item/${itemId}${targetIlvl ? `?ilvl=${targetIlvl}` : ''}`;
    if (bonusStr) {
      url += (url.includes('?') ? '&' : '?') + `bonus=${bonusStr}`;
    }
    if (enchantId) {
      url += (url.includes('?') ? '&' : '?') + `ench=${enchantId}`;
    }
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data) {
        const html = data.tooltip || '';
        const detectedSlot = detectSlotFromTooltipHtml(html, data.name || '');
        const detectedArmorType = detectArmorTypeFromTooltipHtml(html, data.name || '');

        if (enchantId) {
          const enchMatch = html.match(/<!--ee[0-9:]+-->([^<]+)/i) || 
                            html.match(/<span class="q2">(?:<!--[^>]+-->)?(Enchant [^<]+|Forest Hunter[^<]+|Blood Knight[^<]+|Sunfire Silk[^<]+|Arcanoweave[^<]+|Chant of [^<]+|Greater Inscription[^<]+|Flight of the Eagle|Amirdrassil[^<]+|Akil'zon[^<]+|Silvermoon[^<]+|Lynx's[^<]+|Shaladrassil[^<]+|Farstrider[^<]+|Eyes of the Eagle|Zul'jin's[^<]+|Nature's Fury|Empowered Rune[^<]+|Empowered Hex[^<]+|Empowered Blessing[^<]+|Mark of the[^<]+|Rite of the[^<]+|Jan'alai[^<]+|Berserker[^<]+|Acuity of the[^<]+|Rune of [^<]+|Stonebound[^<]+|Culmination[^<]+|Cavalry[^<]+|Defender[^<]+|Pyrium[^<]+)/i);
          if (enchMatch) {
            if (!window.enchantNameCache) window.enchantNameCache = {};
            window.enchantNameCache[Number(enchantId)] = enchMatch[1].trim();
          }
        }

        const rawText = html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ');
        const ilvlMatch = rawText.match(/Item\s+Level\s+(\d+)/i);
        const fetchedIlvl = ilvlMatch ? parseInt(ilvlMatch[1]) : targetIlvl;

        const critMatch = html.match(/rtg32-->\+?([0-9,]+)/i) || rawText.match(/\+\s*([0-9,]+)\s+Critical\s+Strike/i);
        const hasteMatch = html.match(/rtg36-->\+?([0-9,]+)/i) || rawText.match(/\+\s*([0-9,]+)\s+Haste/i);
        const masteryMatch = html.match(/rtg49-->\+?([0-9,]+)/i) || rawText.match(/\+\s*([0-9,]+)\s+Mastery/i);
        const versMatch = html.match(/rtg40-->\+?([0-9,]+)/i) || rawText.match(/\+\s*([0-9,]+)\s+Versatility/i);

        const rtg24Match = html.match(/rtg24-->\+?([0-9,]+)/i);
        const rtg25Match = html.match(/rtg25-->\+?([0-9,]+)/i);
        const randomStat1 = rtg24Match ? parseInt(rtg24Match[1].replace(/,/g, '')) : 0;
        const randomStat2 = rtg25Match ? parseInt(rtg25Match[1].replace(/,/g, '')) : 0;

        const isTier = ['head', 'shoulder', 'chest', 'hands', 'legs'].includes(detectedSlot) && (html.includes('item-set=') || html.includes('(0/5)') || html.includes('(2) Set') || html.includes('(4) Set') || html.includes('Set:'));

        let detectedTrack = null;
        let detectedRank = null;
        const trackMatch = html.match(/Upgrade\s+Level:\s*([A-Za-z]+)(?:\s*(\d+\/\d+))?/i) || rawText.match(/Upgrade\s+Level:\s*([A-Za-z]+)(?:\s*(\d+\/\d+))?/i);
        if (trackMatch) {
          const tName = trackMatch[1].toLowerCase();
          if (tName.includes('myth')) detectedTrack = 'myth';
          else if (tName.includes('hero')) detectedTrack = 'hero';
          else if (tName.includes('champ')) detectedTrack = 'champ';
          else if (tName.includes('vet')) detectedTrack = 'vet';
          else if (tName.includes('advent')) detectedTrack = 'adventurer';
          else if (tName.includes('explor')) detectedTrack = 'adventurer';
          if (trackMatch[2]) detectedRank = trackMatch[2];
        }

        const detectedPrimaryStat = detectPrimaryStatFromTooltip(html, rawText);

        const meta = {
          icon: data.icon || null,
          slot: detectedSlot,
          armorType: detectedArmorType,
          primaryStat: detectedPrimaryStat,
          name: data.name || null,
          ilvl: fetchedIlvl,
          track: detectedTrack,
          rank: detectedRank,
          crit: critMatch ? parseInt(critMatch[1].replace(/,/g, '')) : 0,
          haste: hasteMatch ? parseInt(hasteMatch[1].replace(/,/g, '')) : 0,
          mastery: masteryMatch ? parseInt(masteryMatch[1].replace(/,/g, '')) : 0,
          vers: versMatch ? parseInt(versMatch[1].replace(/,/g, '')) : 0,
          randomStat1: randomStat1,
          randomStat2: randomStat2,
          tier: isTier
        };

        metadataCache[cacheKey] = meta;
        metadataCache[itemId] = meta;
        try {
          localStorage.setItem('wow_metadata_cache_v10', JSON.stringify(metadataCache));
        } catch (e) {}
        return meta;
      }
    }
  } catch (e) {}
  return null;
}

function resolveAllItemIconsAsync() {
  let needsSave = false;
  items.forEach((it) => {
    if (!it.itemId) return;
    const iconFromBm = window.BLOODMALLET_ITEM_ICONS ? window.BLOODMALLET_ITEM_ICONS[it.itemId] : null;
    const meta = metadataCache[it.itemId];
    const targetIcon = iconFromBm || meta?.icon;
    if (targetIcon && it.icon !== targetIcon) {
      it.icon = targetIcon;
      updateItemImageElements(it.itemId, targetIcon);
      needsSave = true;
    }
    if (meta?.slot && (it.slot === 'weapon_2h' || it.slot === 'weapon_1h' || it.slot === 'shield') && it.slot !== meta.slot) {
      it.slot = meta.slot;
      needsSave = true;
    }
    const resolvedArmor = meta?.armorType || it.armorType || detectArmorTypeFromTooltipHtml('', it.name);
    if (resolvedArmor && it.armorType !== resolvedArmor) {
      it.armorType = resolvedArmor;
      needsSave = true;
    }
  });
  if (needsSave && typeof saveState === 'function') {
    saveState();
  }
}

function updateItemImageElements(itemId, iconName) {
  if (!itemId || !iconName) return;
  const imgs = document.querySelectorAll(`img[data-item-id="${itemId}"]`);
  imgs.forEach(img => {
    const targetSrc = `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
    if (img.src !== targetSrc) {
      img.src = targetSrc;
    }
  });
}

function handleImageError(img, slot) {
  img.onerror = null;
  const fallback = SLOT_FALLBACK_ICONS[slot] || 'inv_misc_questionmark';
  img.src = `https://wow.zamimg.com/images/wow/icons/large/${fallback}.jpg`;
}
