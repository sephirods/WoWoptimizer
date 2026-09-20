// OFFICIAL MIDNIGHT SEASON 2 UPGRADE TRACKS & ASCENDANT VENOMSTONES (PTR 12.1)
const MIDNIGHT_UPGRADE_TRACKS = {
  myth: [
    { rank: 'Myth 1/6', ilvl: 318 },
    { rank: 'Myth 2/6', ilvl: 321 },
    { rank: 'Myth 3/6', ilvl: 325 },
    { rank: 'Myth 4/6', ilvl: 328 },
    { rank: 'Myth 5/6', ilvl: 331 },
    { rank: 'Myth 6/6', ilvl: 334 },
    { rank: 'Myth + Venomstone (340)', ilvl: 340 }
  ],
  hero: [
    { rank: 'Hero 1/6', ilvl: 305 },
    { rank: 'Hero 2/6', ilvl: 308 },
    { rank: 'Hero 3/6', ilvl: 312 },
    { rank: 'Hero 4/6', ilvl: 315 },
    { rank: 'Hero 5/6', ilvl: 318 },
    { rank: 'Hero 6/6', ilvl: 321 },
    { rank: 'Hero + Venomstone (328)', ilvl: 328 }
  ],
  champ: [
    { rank: 'Champion 1/6', ilvl: 292 },
    { rank: 'Champion 2/6', ilvl: 295 },
    { rank: 'Champion 3/6', ilvl: 299 },
    { rank: 'Champion 4/6', ilvl: 302 },
    { rank: 'Champion 5/6', ilvl: 305 },
    { rank: 'Champion 6/6', ilvl: 308 }
  ],
  vet: [
    { rank: 'Veteran 1/6', ilvl: 279 },
    { rank: 'Veteran 2/6', ilvl: 282 },
    { rank: 'Veteran 3/6', ilvl: 286 },
    { rank: 'Veteran 4/6', ilvl: 289 },
    { rank: 'Veteran 5/6', ilvl: 292 },
    { rank: 'Veteran 6/6', ilvl: 296 }
  ],
  crafted: [
    { rank: 'Crafted (Hero Crests 318)', ilvl: 318 },
    { rank: 'Crafted Hero + Venomstone (325)', ilvl: 325 },
    { rank: 'Crafted (Myth Crests 331)', ilvl: 331 },
    { rank: 'Crafted Myth + Venomstone (338)', ilvl: 338 }
  ],
  adventurer: [
    { rank: 'Adventurer 1/6', ilvl: 266 },
    { rank: 'Adventurer 2/6', ilvl: 270 },
    { rank: 'Adventurer 3/6', ilvl: 273 },
    { rank: 'Adventurer 4/6', ilvl: 276 },
    { rank: 'Adventurer 5/6', ilvl: 279 },
    { rank: 'Adventurer 6/6', ilvl: 283 }
  ]
};

function isSlotEligibleForVenomstone(slot) {
  const s = (slot || '').toLowerCase();
  return ['weapon_2h', 'weapon_1h', 'shield', 'offhand', 'trinket', 'neck'].includes(s);
}

function getMaxIlvlForTrack(track, currentIlvl = 321, includeVenomstone = false, isCrafted = false) {
  const t = (track || '').toLowerCase();

  if (isCrafted || t === 'crafted') {
    if (includeVenomstone) {
      return (currentIlvl >= 325) ? 338 : 325;
    } else {
      return (currentIlvl >= 325) ? 331 : 318;
    }
  }

  if (includeVenomstone) {
    if (t === 'myth' || currentIlvl >= 325) return Math.max(currentIlvl, 340);
    if (t === 'hero' || currentIlvl >= 305) return Math.max(currentIlvl, 328);
    if (t === 'champ' || currentIlvl >= 292) return Math.max(currentIlvl, 308);
    if (t === 'vet' || currentIlvl >= 279) return Math.max(currentIlvl, 296);
    if (t === 'adventurer' || currentIlvl >= 266) return Math.max(currentIlvl, 283);
    return Math.max(currentIlvl || 0, 328);
  }

  const TRACK_MAX_ILVLS = {
    myth: 334,
    hero: 321,
    champ: 308,
    vet: 296,
    adventurer: 283
  };

  if (t && TRACK_MAX_ILVLS[t]) {
    return Math.max(currentIlvl || 0, TRACK_MAX_ILVLS[t]);
  }

  if (currentIlvl >= 325) return Math.max(currentIlvl, 334);
  if (currentIlvl >= 305) return Math.max(currentIlvl, 321);
  if (currentIlvl >= 292) return Math.max(currentIlvl, 309);
  if (currentIlvl >= 279) return Math.max(currentIlvl, 296);
  if (currentIlvl >= 266) return Math.max(currentIlvl, 283);

  return currentIlvl || 321;
}
