const fs = require('fs');

let targetUi = fs.readFileSync('js/ui/target_ui.js', 'utf8');

const regex = /const specData = cp\[specId\] \|\| cp\[`\$\{specId\}_\$\{className\}`\] \|\| cp\[`\$\{className\}_\$\{specId\}`\] \|\|[\s\S]*?\(specId === 'restoration' && \(cp\['restoration_druid'\] \|\| cp\['restoration_shaman'\]\)\);/g;

const replacement = `const specData = cp[specId] || cp[\`\${specId}_\${className}\`] || cp[\`\${className}_\${specId}\`] || cp[specId.split('_')[0]] || cp[specId.replace(/_.*/, '')] ||
                       (specId === 'protection' && (cp['protection_paladin'] || cp['prot_warrior'])) ||
                       (specId === 'holy' && (cp['holy_paladin'] || cp['holy_priest'])) ||
                       (specId === 'frost' && (cp['frost_dk'] || cp['frost_mage'])) ||
                       (specId === 'restoration' && (cp['restoration_druid'] || cp['restoration_shaman'])) ||
                       (specId === 'restoration_shaman' && cp['restoration']) ||
                       (specId === 'restoration_druid' && cp['restoration']);`;

targetUi = targetUi.replace(regex, replacement);

const regex2 = /const sp = cp\[specData\.id\] \|\| cp\[`\$\{specData\.id\}_\$\{currentClass\}`\] \|\| cp\[`\$\{currentClass\}_\$\{specData\.id\}`\] \|\|[\s\S]*?\(specData\.id === 'restoration' && \(cp\['restoration_druid'\] \|\| cp\['restoration_shaman'\]\)\);/g;
const replacement2 = `const sp = cp[specData.id] || cp[\`\${specData.id}_\${currentClass}\`] || cp[\`\${currentClass}_\${specData.id}\`] || cp[specData.id.split('_')[0]] ||
                 (specData.id === 'protection' && (cp['protection_paladin'] || cp['prot_warrior'])) ||
                 (specData.id === 'holy' && (cp['holy_paladin'] || cp['holy_priest'])) ||
                 (specData.id === 'frost' && (cp['frost_dk'] || cp['frost_mage'])) ||
                 (specData.id === 'restoration' && (cp['restoration_druid'] || cp['restoration_shaman'])) ||
                 (specData.id === 'restoration_shaman' && cp['restoration']) ||
                 (specData.id === 'restoration_druid' && cp['restoration']);`;

targetUi = targetUi.replace(regex2, replacement2);

const regex3 = /const specPreset = cPresets\[specData\.id\] \|\|[\s\S]*?\(specData\.id === 'restoration' && \(cPresets\['restoration_druid'\] \|\| cPresets\['restoration_shaman'\]\)\);/g;
const replacement3 = `const specPreset = cPresets[specData.id] || 
                         cPresets[\`\${specData.id}_\${currentClass}\`] || 
                         cPresets[\`\${currentClass}_\${specData.id}\`] ||
                         cPresets[specData.id.split('_')[0]] ||
                         (specData.id === 'protection' && (cPresets['protection_paladin'] || cPresets['prot_warrior'])) ||
                         (specData.id === 'holy' && (cPresets['holy_paladin'] || cPresets['holy_priest'])) ||
                         (specData.id === 'frost' && (cPresets['frost_dk'] || cPresets['frost_mage'])) ||
                         (specData.id === 'restoration' && (cPresets['restoration_druid'] || cPresets['restoration_shaman'])) ||
                         (specData.id === 'restoration_shaman' && cPresets['restoration']) ||
                         (specData.id === 'restoration_druid' && cPresets['restoration']);`;

targetUi = targetUi.replace(regex3, replacement3);


fs.writeFileSync('js/ui/target_ui.js', targetUi);
console.log('Fixed target_ui.js');
