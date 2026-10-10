const fs = require('fs');

let targetUi = fs.readFileSync('js/ui/target_ui.js', 'utf8');

function fixBlock(match) {
    return `const specData = cp[specId] || cp[\`\${specId}_\${className}\`] || cp[\`\${className}_\${specId}\`] || cp[specId.split('_')[0]] || cp[specId.replace(/_.*/, '')] ||
                       (specId === 'protection' && (cp['protection_paladin'] || cp['prot_warrior'])) ||
                       (specId === 'holy' && (cp['holy_paladin'] || cp['holy_priest'])) ||
                       (specId === 'frost' && (cp['frost_dk'] || cp['frost_mage'])) ||
                       (specId === 'restoration' && (cp['restoration_druid'] || cp['restoration_shaman'])) ||
                       (specId === 'restoration_shaman' && cp['restoration']) ||
                       (specId === 'restoration_druid' && cp['restoration']) ||
                       (specId === 'prot_warrior' && cp['protection']) ||
                       (specId === 'protection_paladin' && cp['protection']) ||
                       (specId === 'holy_paladin' && cp['holy']) ||
                       (specId === 'holy_priest' && cp['holy']) ||
                       (specId === 'frost_dk' && cp['frost']) ||
                       (specId === 'frost_mage' && cp['frost']);`;
}

targetUi = targetUi.replace(/const specData = cp\[specId\] \|\|[^;]*\(specId === 'restoration_druid' && cp\['restoration'\]\);/g, fixBlock);

function fixBlock2(match) {
    return `const sp = cp[specData.id] || cp[\`\${specData.id}_\${currentClass}\`] || cp[\`\${currentClass}_\${specData.id}\`] || cp[specData.id.split('_')[0]] || cp[specData.id.replace(/_.*/, '')] ||
                 (specData.id === 'protection' && (cp['protection_paladin'] || cp['prot_warrior'])) ||
                 (specData.id === 'holy' && (cp['holy_paladin'] || cp['holy_priest'])) ||
                 (specData.id === 'frost' && (cp['frost_dk'] || cp['frost_mage'])) ||
                 (specData.id === 'restoration' && (cp['restoration_druid'] || cp['restoration_shaman'])) ||
                 (specData.id === 'restoration_shaman' && cp['restoration']) ||
                 (specData.id === 'restoration_druid' && cp['restoration']) ||
                 (specData.id === 'prot_warrior' && cp['protection']) ||
                 (specData.id === 'protection_paladin' && cp['protection']) ||
                 (specData.id === 'holy_paladin' && cp['holy']) ||
                 (specData.id === 'holy_priest' && cp['holy']) ||
                 (specData.id === 'frost_dk' && cp['frost']) ||
                 (specData.id === 'frost_mage' && cp['frost']);`;
}

targetUi = targetUi.replace(/const sp = cp\[specData\.id\] \|\|[^;]*\(specData\.id === 'restoration_druid' && cp\['restoration'\]\);/g, fixBlock2);

function fixBlock3(match) {
    return `const specPreset = cPresets[specData.id] || 
                         cPresets[\`\${specData.id}_\${currentClass}\`] || 
                         cPresets[\`\${currentClass}_\${specData.id}\`] ||
                         cPresets[specData.id.split('_')[0]] ||
                         cPresets[specData.id.replace(/_.*/, '')] ||
                         (specData.id === 'protection' && (cPresets['protection_paladin'] || cPresets['prot_warrior'])) ||
                         (specData.id === 'holy' && (cPresets['holy_paladin'] || cPresets['holy_priest'])) ||
                         (specData.id === 'frost' && (cPresets['frost_dk'] || cPresets['frost_mage'])) ||
                         (specData.id === 'restoration' && (cPresets['restoration_druid'] || cPresets['restoration_shaman'])) ||
                         (specData.id === 'restoration_shaman' && cPresets['restoration']) ||
                         (specData.id === 'restoration_druid' && cPresets['restoration']) ||
                         (specData.id === 'prot_warrior' && cPresets['protection']) ||
                         (specData.id === 'protection_paladin' && cPresets['protection']) ||
                         (specData.id === 'holy_paladin' && cPresets['holy']) ||
                         (specData.id === 'holy_priest' && cPresets['holy']) ||
                         (specData.id === 'frost_dk' && cPresets['frost']) ||
                         (specData.id === 'frost_mage' && cPresets['frost']);`;
}

targetUi = targetUi.replace(/const specPreset = cPresets\[specData\.id\] \|\|[^;]*\(specData\.id === 'restoration_druid' && cPresets\['restoration'\]\);/g, fixBlock3);

fs.writeFileSync('js/ui/target_ui.js', targetUi);
console.log('Fixed target_ui.js all specs');
