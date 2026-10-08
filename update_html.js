const fs = require('fs');
const path = require('path');

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

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.html')) {
      callback(dirPath);
    }
  });
}

let count = 0;
walkDir('classes', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const titleRegex = /<title data-i18n="([a-zA-Z0-9_]+)PageTitle">([^<]+)<\/title>/g;
  let matched = false;
  
  content = content.replace(titleRegex, (match, prefix) => {
    matched = true;
    const name = nameMapEN[prefix] || prefix;
    const isBaseClass = ['deathknight','demonhunter','druid','evoker','hunter','mage','monk','paladin','priest','rogue','shaman','warlock','warrior'].includes(prefix);
    
    let newTitle = '';
    if (prefix === 'classes') {
      newTitle = "Best Classes & Builds (12.1.5) | WoWTopGear";
    } else {
      newTitle = isBaseClass 
        ? `${name} BiS Guide (12.1.5) | WoWTopGear` 
        : `${name} BiS Gear & Talents (12.1.5) | WoWTopGear`;
    }
    
    return `<title data-i18n="${prefix}PageTitle">${newTitle}</title>`;
  });
  
  const ogTitleRegex = /<meta property="og:title" content="([^"]+)"\s*\/>/g;
  content = content.replace(ogTitleRegex, (match) => {
     let newTitleMatch = content.match(/<title data-i18n="[a-zA-Z0-9_]+PageTitle">([^<]+)<\/title>/);
     if (newTitleMatch) {
         return `<meta property="og:title" content="${newTitleMatch[1]}" />`;
     }
     return match;
  });

  if (matched) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
  }
});

// Check root index.html
const rootIndex = 'index.html';
if (fs.existsSync(rootIndex)) {
  let content = fs.readFileSync(rootIndex, 'utf8');
  const titleRegex = /<title>([^<]+)<\/title>/g;
  content = content.replace(titleRegex, `<title>WoW Midnight BiS Gear Optimizer & Guides (12.1.5) | WoWTopGear</title>`);
  
  const ogTitleRegex = /<meta property="og:title" content="([^"]+)"\s*\/>/g;
  content = content.replace(ogTitleRegex, `<meta property="og:title" content="WoW Midnight BiS Gear Optimizer & Guides (12.1.5) | WoWTopGear" />`);
  fs.writeFileSync(rootIndex, content, 'utf8');
}

console.log(`Successfully updated ${count} spec/class HTML files.`);
