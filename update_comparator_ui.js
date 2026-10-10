const fs = require('fs');
let code = fs.readFileSync('js/ui/comparator_ui.js', 'utf8');

// The original desktop gem replacement block:
const desktopGemOriginal = `                            \${optGemRec ? \`
                              <div class="text-[10px] text-amber-300 font-medium mt-0.5">
                                \${(!isSame && optCurrentGemObj && optCurrentGemId !== optGemRec.gemItemId) ? \`
                                  <div class="text-[9px] text-slate-400 truncate"><i class="fa-solid fa-gem text-[8px] text-slate-500"></i> \${t('gemCurrentInBag', 'Current gem in bag:')} <span class="line-through text-slate-400">\${optCurrentGemObj.name}</span></div>
                                \` : ''}
                                <div class="truncate">
                                  <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> \${t('gemToUse', 'Gem to use:')} 
                                  <a href="\${getWowheadBaseUrl()}/item=\${optGemRec.gemItemId}" data-item-id="\${optGemRec.gemItemId}" target="_blank" \${getWowheadItemDataAttr(optGemRec.gemItemId)} class="spec-auto-translate font-bold text-amber-200 hover:text-amber-100 hover:underline">\${optGemRec.gemName}</a>
                                </div>
                                \${optGemRec.gemDesc ? \`<div class="text-[9px] text-emerald-400/90 font-mono font-normal pl-3 truncate">\${typeof getLocalizedGemDesc === 'function' ? getLocalizedGemDesc(optGemRec.gemDesc) : optGemRec.gemDesc}</div>\` : ''}
                              </div>
                            \` : ''}`;

const desktopGemNew = `                            \${optGemRecs.length > 0 ? optGemRecs.map(optGemRec => \`
                              <div class="text-[10px] text-amber-300 font-medium mt-0.5">
                                <div class="truncate">
                                  <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> \${t('gemToUse', 'Gem to use:')} 
                                  <a href="\${getWowheadBaseUrl()}/item=\${optGemRec.gemItemId}" data-item-id="\${optGemRec.gemItemId}" target="_blank" \${getWowheadItemDataAttr(optGemRec.gemItemId)} class="spec-auto-translate font-bold text-amber-200 hover:text-amber-100 hover:underline">\${optGemRec.gemName}</a>
                                </div>
                                \${optGemRec.gemDesc ? \`<div class="text-[9px] text-emerald-400/90 font-mono font-normal pl-3 truncate">\${typeof getLocalizedGemDesc === 'function' ? getLocalizedGemDesc(optGemRec.gemDesc) : optGemRec.gemDesc}</div>\` : ''}
                              </div>
                            \`).join('') : ''}`;

code = code.replace(desktopGemOriginal, desktopGemNew);

// Mobile optimal gem replacement block:
const mobileGemOriginal = `                        \${optGemRec ? \`
                          <div class="text-[10px] text-amber-300 font-medium mt-0.5">
                            <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> \${t('gemToUse', 'Gem to use:')} 
                            <a href="\${getWowheadBaseUrl()}/item=\${optGemRec.gemItemId}" data-item-id="\${optGemRec.gemItemId}" target="_blank" \${getWowheadItemDataAttr(optGemRec.gemItemId)} class="spec-auto-translate font-bold text-amber-200 hover:text-amber-100 hover:underline">\${optGemRec.gemName}</a>
                          </div>
                        \` : ''}`;

const mobileGemNew = `                        \${optGemRecs.length > 0 ? optGemRecs.map(optGemRec => \`
                          <div class="text-[10px] text-amber-300 font-medium mt-0.5">
                            <i class="fa-solid fa-gem text-[8px] text-amber-400"></i> \${t('gemToUse', 'Gem to use:')} 
                            <a href="\${getWowheadBaseUrl()}/item=\${optGemRec.gemItemId}" data-item-id="\${optGemRec.gemItemId}" target="_blank" \${getWowheadItemDataAttr(optGemRec.gemItemId)} class="spec-auto-translate font-bold text-amber-200 hover:text-amber-100 hover:underline">\${optGemRec.gemName}</a>
                          </div>
                        \`).join('') : ''}`;

code = code.replace(mobileGemOriginal, mobileGemNew);

// Desktop equipped gem (left column)
const desktopEquippedOriginal = `                              <div class="text-[10px] text-slate-400 mt-0.5">
                                <div class="truncate">
                                  <i class="fa-solid fa-gem text-[8px] text-slate-500"></i> \${t('gemLabel', 'Gem')}: 
                                  \${curGemObj ? \`
                                    <a href="\${getWowheadBaseUrl()}/item=\${curGemObj.id}" target="_blank" \${getWowheadItemDataAttr(curGemObj.id)} class="text-slate-300 hover:text-purple-300 font-medium">\${curGemObj.name}</a>
                                  \` : \`
                                    <span class="\${curGemId ? 'text-slate-300' : 'text-slate-500 italic'}">\${curGemId ? 'Gem ID ' + curGemId : t('ungemmed', 'No gem')}</span>
                                  \`}
                                </div>
                                \${curGemObj?.desc ? \`<div class="text-[9px] text-amber-400/90 font-mono pl-3 truncate">\${typeof getLocalizedGemDesc === 'function' ? getLocalizedGemDesc(curGemObj.desc) : curGemObj.desc}</div>\` : ''}
                              </div>`;

const desktopEquippedNew = `                              <div class="text-[10px] text-slate-400 mt-0.5">
                                <div class="truncate">
                                  <i class="fa-solid fa-gem text-[8px] text-slate-500"></i> \${t('gemLabel', 'Gem')}: 
                                  \${curGemObjs.length > 0 ? curGemObjs.map(g => \`
                                    <a href="\${getWowheadBaseUrl()}/item=\${g.id}" target="_blank" \${getWowheadItemDataAttr(g.id)} class="text-slate-300 hover:text-purple-300 font-medium block">\${g.name}</a>
                                    \${g.desc ? \`<div class="text-[9px] text-amber-400/90 font-mono pl-2 truncate">\${typeof getLocalizedGemDesc === 'function' ? getLocalizedGemDesc(g.desc) : g.desc}</div>\` : ''}
                                  \`).join('') : \`
                                    <span class="text-slate-500 italic">\${t('ungemmed', 'No gem')}</span>
                                  \`}
                                </div>
                              </div>`;

code = code.replace(desktopEquippedOriginal, desktopEquippedNew);

// Mobile equipped gem
const mobileEquippedOriginal = `                          <div class="text-[10px] text-slate-400 mt-0.5">
                            <span class="text-slate-400">\${t('gemLabel', 'Gem')}: </span>
                            \${curGemObj ? \`<a href="\${getWowheadBaseUrl()}/item=\${curGemObj.id}" target="_blank" \${getWowheadItemDataAttr(curGemObj.id)} class="text-slate-300 font-medium">\${curGemObj.name}</a>\` : \`<span class="\${curGemId ? 'text-slate-300' : 'text-slate-500 italic'}">\${curGemId ? 'Gem ID ' + curGemId : t('ungemmed', 'No gem')}</span>\`}
                          </div>`;

const mobileEquippedNew = `                          <div class="text-[10px] text-slate-400 mt-0.5">
                            <span class="text-slate-400">\${t('gemLabel', 'Gem')}: </span>
                            \${curGemObjs.length > 0 ? curGemObjs.map(g => \`<a href="\${getWowheadBaseUrl()}/item=\${g.id}" target="_blank" \${getWowheadItemDataAttr(g.id)} class="text-slate-300 font-medium block">\${g.name}</a>\`).join('') : \`<span class="text-slate-500 italic">\${t('ungemmed', 'No gem')}</span>\`}
                          </div>`;

code = code.replace(mobileEquippedOriginal, mobileEquippedNew);


fs.writeFileSync('js/ui/comparator_ui.js', code);
