const fs = require('fs');
let code = fs.readFileSync('js/ui/comparator_ui.js', 'utf8');

code = code.replace(
  /\$\{optGemRec \? \`([\s\S]*?)\` : \'\'\}/g,
  "${optGemRecs.length > 0 ? optGemRecs.map(optGemRec => `$1`).join('') : ''}"
);

code = code.replace(
  /\$\{\(!isSame && optCurrentGemObj && optCurrentGemId !== optGemRec\.gemItemId\) \? \`([\s\S]*?)\` : \'\'\}/g,
  ""
);

code = code.replace(
  /\$\{curGemObj \? \`<a href="\$\{getWowheadBaseUrl\(\)\}\/item=\$\{curGemObj\.id\}" target="_blank" \$\{getWowheadItemDataAttr\(curGemObj\.id\)\} class="text-slate-300 hover:text-purple-300 font-medium">\$\{curGemObj\.name\}<\/a>\n\s*` : `\n\s*<span class="\$\{curGemId \? 'text-slate-300' : 'text-slate-500 italic'\}">\$\{curGemId \? 'Gem ID ' \+ curGemId : t\('ungemmed', 'No gem'\)\}<\/span>\n\s*`\}/g,
  "${curGemObjs.length > 0 ? curGemObjs.map(g => `<a href=\"${getWowheadBaseUrl()}/item=${g.id}\" target=\"_blank\" ${getWowheadItemDataAttr(g.id)} class=\"text-slate-300 hover:text-purple-300 font-medium block\">${g.name}</a>`).join('') : `<span class=\"text-slate-500 italic\">${t('ungemmed', 'No gem')}</span>`}"
);

code = code.replace(
  /\$\{curGemObj \? \`<a href="\$\{getWowheadBaseUrl\(\)\}\/item=\$\{curGemObj\.id\}" target="_blank" \$\{getWowheadItemDataAttr\(curGemObj\.id\)\} class="text-slate-300 font-medium">\$\{curGemObj\.name\}<\/a>` : `<span class="\$\{curGemId \? 'text-slate-300' : 'text-slate-500 italic'\}">\$\{curGemId \? 'Gem ID ' \+ curGemId : t\('ungemmed', 'No gem'\)\}<\/span>`\}/g,
  "${curGemObjs.length > 0 ? curGemObjs.map(g => `<a href=\"${getWowheadBaseUrl()}/item=${g.id}\" target=\"_blank\" ${getWowheadItemDataAttr(g.id)} class=\"text-slate-300 font-medium block\">${g.name}</a>`).join('') : `<span class=\"text-slate-500 italic\">${t('ungemmed', 'No gem')}</span>`}"
);

fs.writeFileSync('js/ui/comparator_ui.js', code);
