const fs = require('fs');

const path = 'js/ui/i18n.js';
let content = fs.readFileSync(path, 'utf8');

const nameMapEN = {
  affliction: 'Affliction Warlock', arcane: 'Arcane Mage', arms: 'Arms Warrior',
  assassination: 'Assassination Rogue', augmentation: 'Augmentation Evoker', balance: 'Balance Druid',
  beastmastery: 'Beast Mastery Hunter', blood: 'Blood DK', brewmaster: 'Brewmaster Monk',
  deathknight: 'Death Knight', demonhunter: 'Demon Hunter', demonology: 'Demonology Warlock',
  destruction: 'Destruction Warlock', devastation: 'Devastation Evoker', devourer: 'Devourer DH',
  discipline: 'Discipline Priest', druid: 'Druid', elemental: 'Elemental Shaman',
  enhancement: 'Enhancement Shaman', evoker: 'Evoker', feral: 'Feral Druid', fire: 'Fire Mage',
  frost_dk: 'Frost DK', frost_mage: 'Frost Mage', fury: 'Fury Warrior', guardian: 'Guardian Druid',
  havoc: 'Havoc DH', holy_priest: 'Holy Priest', holyPaladin: 'Holy Paladin', hunter: 'Hunter',
  mage: 'Mage', marksmanship: 'Marksmanship Hunter', mistweaver: 'Mistweaver Monk', monk: 'Monk',
  outlaw: 'Outlaw Rogue', paladin: 'Paladin', preservation: 'Preservation Evoker', priest: 'Priest',
  protection_warrior: 'Protection Warrior', protPaladin: 'Protection Paladin', restoration_druid: 'Resto Druid',
  restoration_shaman: 'Resto Shaman', retPaladin: 'Ret Paladin', rogue: 'Rogue', shadow: 'Shadow Priest',
  shaman: 'Shaman', subtlety: 'Subtlety Rogue', survival: 'Survival Hunter', unholy: 'Unholy DK',
  vengeance: 'Vengeance DH', warlock: 'Warlock', warrior: 'Warrior', windwalker: 'Windwalker Monk',
  classes: 'WoW Classes'
};

const nameMapES = {
  affliction: 'Brujo Aflicción', arcane: 'Mago Arcano', arms: 'Guerrero Armas',
  assassination: 'Pícaro Asesinato', augmentation: 'Evocador Aumento', balance: 'Druida Equilibrio',
  beastmastery: 'Cazador Bestias', blood: 'DK Sangre', brewmaster: 'Monje Maestro Cervecero',
  deathknight: 'Caballero de la Muerte', demonhunter: 'Cazador de Demonios', demonology: 'Brujo Demonología',
  destruction: 'Brujo Destrucción', devastation: 'Evocador Devastación', devourer: 'DH Devorador',
  discipline: 'Sacerdote Disciplina', druid: 'Druida', elemental: 'Chamán Elemental',
  enhancement: 'Chamán Mejora', evoker: 'Evocador', feral: 'Druida Feral', fire: 'Mago Fuego',
  frost_dk: 'DK Escarcha', frost_mage: 'Mago Escarcha', fury: 'Guerrero Furia', guardian: 'Druida Guardián',
  havoc: 'DH Devastación', holy_priest: 'Sacerdote Sagrado', holyPaladin: 'Paladín Sagrado', hunter: 'Cazador',
  mage: 'Mago', marksmanship: 'Cazador Puntería', mistweaver: 'Monje Tejedor de Niebla', monk: 'Monje',
  outlaw: 'Pícaro Forajido', paladin: 'Paladín', preservation: 'Evocador Preservación', priest: 'Sacerdote',
  protection_warrior: 'Guerrero Protección', protPaladin: 'Paladín Protección', restoration_druid: 'Druida Restauración',
  restoration_shaman: 'Chamán Restauración', retPaladin: 'Paladín Reprensión', rogue: 'Pícaro', shadow: 'Sacerdote Sombras',
  shaman: 'Chamán', subtlety: 'Pícaro Sutileza', survival: 'Cazador Supervivencia', unholy: 'DK Profano',
  vengeance: 'DH Venganza', warlock: 'Brujo', warrior: 'Guerrero', windwalker: 'Monje Viajero del Viento',
  classes: 'Clases WoW'
};

const regex = /([a-zA-Z0-9_]+)PageTitle:\s*"([^"]+)"/g;

content = content.replace(regex, (match, prefix, oldTitle) => {
  const isSpanish = oldTitle.includes('Gua') || oldTitle.includes('Guía') || oldTitle.includes('Temporada') || oldTitle.includes('Clases');
  
  if (prefix === 'classes') {
    if (isSpanish) {
      return `${prefix}PageTitle: "Mejores Clases y Builds (12.1) | WoWTopGear"`;
    } else {
      return `${prefix}PageTitle: "Best Classes & Builds (12.1) | WoWTopGear"`;
    }
  }

  const name = isSpanish ? (nameMapES[prefix] || prefix) : (nameMapEN[prefix] || prefix);
  const isBaseClass = ['deathknight','demonhunter','druid','evoker','hunter','mage','monk','paladin','priest','rogue','shaman','warlock','warrior'].includes(prefix);
  
  let newTitle = '';
  if (isSpanish) {
    newTitle = isBaseClass 
      ? `Guía BiS ${name} (12.1) | WoWTopGear` 
      : `BiS & Talentos ${name} (12.1) | WoWTopGear`;
  } else {
    newTitle = isBaseClass 
      ? `${name} BiS Guide (12.1) | WoWTopGear` 
      : `${name} BiS Gear & Talents (12.1) | WoWTopGear`;
  }

  return `${prefix}PageTitle: "${newTitle}"`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated i18n titles!');
