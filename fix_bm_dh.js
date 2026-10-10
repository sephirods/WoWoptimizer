const fs = require('fs');

// 1. Fix target_ui.js for beast_mastery
let targetUi = fs.readFileSync('js/ui/target_ui.js', 'utf8');

function fixBm(match) {
    return match.replace(/\} \|\|/, "} ||\n                       (specId === 'beast_mastery' && cp['beastmastery']) ||");
}
targetUi = targetUi.replace(/const specData = cp\[specId\].*?\|\| \{\}/s, fixBm);
targetUi = targetUi.replace(/const specData = cp\[specId\].*?\|\| \{\}/s, fixBm); // No, wait, target_ui doesn't have || {}

function fixBmTarget(match) {
    return match.replace(/;\s*$/, " ||\n                       (specId === 'beast_mastery' && cp['beastmastery']);");
}
targetUi = targetUi.replace(/const specData = cp\[specId\].*?cp\['frost'\]\);/g, fixBmTarget);

function fixBmTarget2(match) {
    return match.replace(/;\s*$/, " ||\n                 (specData.id === 'beast_mastery' && cp['beastmastery']);");
}
targetUi = targetUi.replace(/const sp = cp\[specData\.id\].*?cp\['frost'\]\);/g, fixBmTarget2);

function fixBmTarget3(match) {
    return match.replace(/;\s*$/, " ||\n                         (specData.id === 'beast_mastery' && cPresets['beastmastery']);");
}
targetUi = targetUi.replace(/const specPreset = cPresets\[specData\.id\].*?cPresets\['frost'\]\);/g, fixBmTarget3);

fs.writeFileSync('js/ui/target_ui.js', targetUi);

// 2. Fix spec_guide_ui.js for beast_mastery
let guideUi = fs.readFileSync('js/ui/spec_guide_ui.js', 'utf8');
function fixBmGuide(match) {
    return match.replace(/ \|\| \{\};\s*$/, " ||\n                       (specKey === 'beast_mastery' && classArchon['beastmastery']) || {};");
}
guideUi = guideUi.replace(/const specArchon = classArchon\[specKey\].*?\|\| \{\};/g, fixBmGuide);
fs.writeFileSync('js/ui/spec_guide_ui.js', guideUi);

// 3. Add Annihilator to classes_leather.js
let leather = fs.readFileSync('js/data/classes_leather.js', 'utf8');
leather = leather.replace(
  /"id": "vengeance",[\s\S]*?"heroTrees": \[\s*\{ "id": "aldrachi_reaver"[^}]*\},/,
  `"id": "vengeance",
          "name": "Vengeance",
          "role": "tank",
          "allowedWeps": [
            { "id": "dual_wield", "label": "🗡️ Dual Warglaives / 1H" }
          ],
          "defaultWep": "dual_wield",
          "presets": {
            "raid": { "m": 450, "c": 740, "h": 1290, "v": 580 },
            "mplus": { "m": 390, "c": 680, "h": 1380, "v": 610 }
          },
          "heroTrees": [
            { "id": "annihilator", "name": "💥 Annihilator", "weights": { "m": 1.1, "c": 1.3, "h": 1.6, "v": 1.2 } },
            { "id": "aldrachi_reaver", "name": "🪓 Aldrachi Reaver", "weights": { "m": 0.9, "c": 1.2, "h": 1.5, "v": 1.1 } },`
);

leather = leather.replace(
  /"id": "devourer",[\s\S]*?"heroTrees": \[\s*\{ "id": "fel_scarred"[^}]*\},/,
  `"id": "devourer",
          "name": "Devourer",
          "role": "dps",
          "allowedWeps": [
            { "id": "dual_wield", "label": "🗡️ Dual Warglaives / 1H" },
            { "id": "2h", "label": "🪄 2-Handed Staff" }
          ],
          "defaultWep": "dual_wield",
          "presets": {
            "raid": { "m": 1340, "c": 780, "h": 1020, "v": 140 },
            "mplus": { "m": 1260, "c": 840, "h": 1080, "v": 140 }
          },
          "heroTrees": [
            { "id": "annihilator", "name": "💥 Annihilator", "weights": { "m": 1.7, "c": 1.2, "h": 1.3, "v": 0.6 } },
            { "id": "fel_scarred", "name": "🔥 Fel-Scarred", "weights": { "m": 1.6, "c": 1.3, "h": 1.1, "v": 0.7 } },`
);
fs.writeFileSync('js/data/classes_leather.js', leather);
console.log('Fixed Beast Mastery and added Annihilator to DH');
