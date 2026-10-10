const fs = require('fs');
let code = fs.readFileSync('js/ui/comparator_ui.js', 'utf8');

// Fix curGemNeedsChange logic (Desktop & Mobile)
code = code.replace(
  /const curGemNeedsChange = false; \/\/ logic simplified for array/g,
  "const curGemNeedsChange = optGemRecs.length > 0 && JSON.stringify([...curGemIds].sort()) !== JSON.stringify(optGemRecs.map(r => r.gemItemId).sort());"
);

// Fix optGemNeedsChange logic (Desktop & Mobile)
code = code.replace(
  /const optGemNeedsChange = false; \/\/ logic simplified for array/g,
  "const optGemNeedsChange = optGemRecs.length > 0 && JSON.stringify([...optCurrentGemIds].sort()) !== JSON.stringify(optGemRecs.map(r => r.gemItemId).sort());"
);

// Fix button labels (Desktop & Mobile)
code = code.replace(
  /\$\{\(\!isSame \? optCurrentGemId : curGemId\) \? t\('changeGem', 'Change Gem'\) : t\('socketGem', 'Socket Gem'\)\}/g,
  "${(!isSame ? optCurrentGemIds.length > 0 : curGemIds.length > 0) ? t('changeGem', 'Change Gem') : t('socketGem', 'Socket Gem')}"
);

fs.writeFileSync('js/ui/comparator_ui.js', code);
