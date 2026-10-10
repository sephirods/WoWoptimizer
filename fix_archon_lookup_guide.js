const fs = require('fs');

let specGuideUi = fs.readFileSync('js/ui/spec_guide_ui.js', 'utf8');

const regex = /const specArchon = classArchon\[specKey\] \|\| classArchon\[`\$\{specKey\}_\$\{classKey\}`\] \|\| classArchon\[`\$\{classKey\}_\$\{specKey\}`\] \|\| \{\};/g;
const replacement = `const specArchon = classArchon[specKey] || classArchon[\`\${specKey}_\${classKey}\`] || classArchon[\`\${classKey}_\${specKey}\`] || classArchon[specKey.split('_')[0]] || classArchon[specKey.replace(/_.*/, '')] ||
                       (specKey === 'protection' && (classArchon['protection_paladin'] || classArchon['prot_warrior'])) ||
                       (specKey === 'holy' && (classArchon['holy_paladin'] || classArchon['holy_priest'])) ||
                       (specKey === 'frost' && (classArchon['frost_dk'] || classArchon['frost_mage'])) ||
                       (specKey === 'restoration' && (classArchon['restoration_druid'] || classArchon['restoration_shaman'])) ||
                       (specKey === 'restoration_shaman' && classArchon['restoration']) ||
                       (specKey === 'restoration_druid' && classArchon['restoration']) ||
                       (specKey === 'prot_warrior' && classArchon['protection']) ||
                       (specKey === 'protection_paladin' && classArchon['protection']) ||
                       (specKey === 'holy_paladin' && classArchon['holy']) ||
                       (specKey === 'holy_priest' && classArchon['holy']) ||
                       (specKey === 'frost_dk' && classArchon['frost']) ||
                       (specKey === 'frost_mage' && classArchon['frost']) || {};`;

specGuideUi = specGuideUi.replace(regex, replacement);

fs.writeFileSync('js/ui/spec_guide_ui.js', specGuideUi);
console.log('Fixed spec_guide_ui.js');
