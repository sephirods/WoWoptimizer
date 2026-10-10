const fs = require('fs');
let code = fs.readFileSync('js/engine/optimizer.js', 'utf8');

const targetStr = `const checkId = it.itemId ? parseInt(it.itemId) : (it.id ? parseInt(it.id.toString().replace('simc_', '')) : 0);
      if (CANTRIP_IDS.includes(checkId)) {`;

const newStr = `const checkId = it.itemId ? parseInt(it.itemId) : (it.id ? parseInt(it.id.toString().replace('simc_', '')) : 0);
      const isCantrip = CANTRIP_IDS.includes(checkId) || (it.redirectedStatId && CANTRIP_IDS.includes(parseInt(it.redirectedStatId)));
      if (isCantrip) {`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('js/engine/optimizer.js', code);
