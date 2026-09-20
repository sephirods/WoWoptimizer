// Main Classes Aggregator & Slot Configuration
window.WOW_CLASSES = {
  ...(window.WOW_CLASSES_PLATE || {}),
  ...(window.WOW_CLASSES_MAIL || {}),
  ...(window.WOW_CLASSES_LEATHER || {}),
  ...(window.WOW_CLASSES_CLOTH || {})
};

const WOW_CLASSES = window.WOW_CLASSES;

const SLOT_FALLBACK_ICONS = {
  head: 'inv_helmet_03',
  neck: 'inv_jewelry_necklace_07',
  shoulder: 'inv_shoulder_02',
  back: 'inv_misc_cape_18',
  chest: 'inv_chest_chain_05',
  wrist: 'inv_bracer_07',
  hands: 'inv_gauntlets_05',
  waist: 'inv_belt_03',
  legs: 'inv_pants_03',
  feet: 'inv_boots_01',
  finger: 'inv_jewelry_ring_03',
  trinket: 'inv_jewelry_talisman_07',
  weapon_2h: 'inv_axe_02',
  weapon_1h: 'inv_sword_04',
  shield: 'inv_shield_06'
};

function detectWeaponSlotFromName(name) {
  if (!name) return 'weapon_2h';
  const lower = name.toLowerCase();
  if (lower.includes('shield') || lower.includes('escudo') || lower.includes('barrier') || lower.includes('barrera')) return 'shield';
  if (lower.includes('dagger') || lower.includes('daga') || lower.includes('knife') || lower.includes('cuchillo')) return 'weapon_1h';
  if (lower.includes('wand') || lower.includes('varita') || lower.includes('scepter') || lower.includes('cetro')) return 'weapon_1h';
  if (lower.includes('axe') || lower.includes('hacha') || lower.includes('sword') || lower.includes('espada') || lower.includes('mace') || lower.includes('maza')) {
    if (lower.includes('great') || lower.includes('gran ') || lower.includes('halberd') || lower.includes('alabarda') || lower.includes('polearm') || lower.includes('asta') || lower.includes('claymore') || lower.includes('blade') || lower.includes('hoja')) {
      return 'weapon_2h';
    }
  }
  if (lower.includes('staff') || lower.includes('bastón') || lower.includes('baston') || lower.includes('polearm') || lower.includes('spear') || lower.includes('lanza') || lower.includes('glaive') || lower.includes('halberd')) return 'weapon_2h';
  if (lower.includes('bow') || lower.includes('arco') || lower.includes('gun') || lower.includes('rifle') || lower.includes('crossbow') || lower.includes('ballesta')) return 'weapon_2h';
  return 'weapon_2h';
}
