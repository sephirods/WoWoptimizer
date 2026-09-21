// Modals UI: Backup/JSON, SimC Modal, Help & Guides, Dev Extractor, Legal & Cookie Consent

function openSimcModal() {
  const input = document.getElementById('simc-input');
  if (input) input.value = '';
  const status = document.getElementById('simc-status');
  if (status) status.innerText = 'Listo para procesar tu equipo equipado y bolsas.';
  const modal = document.getElementById('simc-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeSimcModal() {
  const modal = document.getElementById('simc-modal');
  if (modal) modal.classList.add('hidden');
}

// Modal: Bloodmallet & Archon Official Trinket Rankings
function onBloodmalletToggle() {
  if (typeof runOptimizer === 'function') runOptimizer();
  if (typeof renderInventory === 'function') renderInventory();
}

function openBloodmalletModal() {
  const c = typeof currentClass !== 'undefined' ? currentClass : 'hunter';
  const s = typeof currentSpec !== 'undefined' ? currentSpec : 'survival';
  const { wowClass, wowSpec } = getBloodmalletClassSpec(c, s);
  
  const badge = document.getElementById('bm-modal-spec-badge');
  if (badge) {
    badge.innerText = `${wowClass.toUpperCase()} — ${wowSpec.toUpperCase()}`;
    badge.className = 'text-xs px-2 py-0.5 rounded font-mono transition-all ' + (isHealerSpec(c, s) ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50' : 'bg-red-950/80 text-red-300 border border-red-500/50');
  }

  const iconBox = document.getElementById('bm-modal-icon-box');
  const icon = document.getElementById('bm-modal-icon');
  if (iconBox && icon) {
    if (isHealerSpec(c, s)) {
      iconBox.className = 'w-8 h-8 rounded bg-emerald-950/80 border border-emerald-500 flex items-center justify-center text-emerald-400 transition-all shadow';
      icon.className = 'fa-solid fa-heart-pulse';
    } else {
      iconBox.className = 'w-8 h-8 rounded bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 transition-all shadow';
      icon.className = 'fa-solid fa-fire';
    }
  }

  const modal = document.getElementById('bloodmallet-modal');
  if (modal) modal.classList.remove('hidden');
  renderBloodmalletModalList();
}

function closeBloodmalletModal() {
  const modal = document.getElementById('bloodmallet-modal');
  if (modal) modal.classList.add('hidden');
}

function renderBloodmalletModalList() {
  const c = typeof currentClass !== 'undefined' ? currentClass : 'hunter';
  const s = typeof currentSpec !== 'undefined' ? currentSpec : 'survival';
  const container = document.getElementById('bm-modal-content');
  if (!container) return;

  const search = (document.getElementById('bm-modal-search')?.value || '').toLowerCase().trim();
  const playerTrinkets = (typeof items !== 'undefined' ? items : []).filter(it => it.slot === 'trinket');

  // Caso 1: Especialización Healer (Datos Archon.gg)
  if (isHealerSpec(c, s)) {
    const isRaid = typeof currentContentMode !== 'undefined' && currentContentMode === 'raid';
    const modeKey = isRaid ? 'raid' : 'mplus';
    const modeLabel = isRaid ? 'Mythic Raid' : 'Mythic+ (M+)';

    const metaEl = document.getElementById('bm-modal-meta');
    if (metaEl) {
      metaEl.innerText = `Fuente: Archon.gg ${modeLabel} Meta Rankings (Healer Spec)`;
    }

    const archonSpec = (typeof getArchonHealerSpecData === 'function') 
      ? getArchonHealerSpecData(c, s) 
      : ((window.ARCHON_HEALER_TRINKETS && window.ARCHON_HEALER_TRINKETS[c] && window.ARCHON_HEALER_TRINKETS[c][s]) || null);

    const modeList = (archonSpec && archonSpec[modeKey]) ? archonSpec[modeKey] : [];

    // Deduplicar abalorios por itemId seleccionando la entrada con mayor popularidad y nombre válido
    const uniqueMap = new Map();
    for (const item of modeList) {
      if (!item || !item.itemId) continue;
      const id = Number(item.itemId);
      const existing = uniqueMap.get(id);
      const pop = Number(item.popularity) || 0;
      if (!existing || pop > (Number(existing.popularity) || 0)) {
        uniqueMap.set(id, {
          ...item,
          name: item.name || (existing && existing.name) || `Item #${id}`
        });
      } else if (!existing.name && item.name) {
        existing.name = item.name;
      }
    }
    let entries = Array.from(uniqueMap.values());
    if (search) {
      entries = entries.filter(e => e.name && e.name.toLowerCase().includes(search));
    }

    entries.sort((a, b) => (Number(b.popularity) || 0) - (Number(a.popularity) || 0));

    if (entries.length === 0) {
      container.innerHTML = `
        <div class="bg-black/40 border border-wow-border rounded-xl p-8 text-center text-slate-400 text-xs">
          No se encontraron abalorios para ${modeLabel} con el filtro "${search}".
        </div>
      `;
      return;
    }

    container.innerHTML = entries.map((entry, idx) => {
      const ownedItems = playerTrinkets.filter(it => it.itemId === entry.itemId || (it.name && it.name.toLowerCase().trim() === entry.name.toLowerCase().trim()));
      const isOwned = ownedItems.length > 0;
      const pct = Math.min(100, Math.max(5, entry.popularity));

      return `
        <div class="bg-wow-panel border ${isOwned ? 'border-amber-500/80 bg-amber-950/20 shadow-md ring-1 ring-amber-500/30' : 'border-wow-border hover:border-emerald-500/50'} rounded-lg p-3 transition space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="text-xs font-black text-slate-500 w-5 text-right flex-shrink-0">#${idx + 1}</span>
              <a href="https://www.wowhead.com/item=${entry.itemId}" target="_blank" data-wowhead="item=${entry.itemId}" class="flex-shrink-0">
                <img src="${typeof getWowheadIconUrl === 'function' ? getWowheadIconUrl(null, 'trinket', entry.itemId) : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'}" data-item-id="${entry.itemId}" referrerpolicy="no-referrer" loading="lazy" class="w-8 h-8 rounded border ${isOwned ? 'border-amber-400' : 'border-emerald-500/40'} object-cover">
              </a>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <a href="https://www.wowhead.com/item=${entry.itemId}" target="_blank" data-wowhead="item=${entry.itemId}" class="font-bold text-xs ${isOwned ? 'text-amber-300 hover:text-amber-200' : 'text-emerald-300 hover:text-emerald-200'} truncate">${entry.name}</a>
                  <span class="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/40">Popularidad: ${entry.popularity}%</span>
                  ${entry.maxKey ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">${entry.maxKey}</span>` : ''}
                  ${isOwned ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-black font-black flex items-center gap-1"><i class="fa-solid fa-check"></i> En tu Inventario (${ownedItems.map(x => 'ilvl ' + x.ilvl).join(', ')})</span>` : ''}
                </div>
              </div>
            </div>

            <div class="text-right flex-shrink-0">
              <div class="text-xs font-black text-emerald-400">${entry.popularity}% Pick</div>
              <div class="text-[10px] text-slate-500">Meta Healer</div>
            </div>
          </div>

          <div class="space-y-1">
            <div class="w-full bg-black/80 rounded-full h-2 overflow-hidden border border-white/10">
              <div style="width: ${pct}%" class="${isOwned ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-gradient-to-r from-emerald-600 to-teal-400'} h-full rounded-full transition-all"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') window.$WowheadPower.refreshLinks();
    if (typeof resolveAllItemIconsAsync === 'function') resolveAllItemIconsAsync();
    return;
  }

  // Caso 2: DPS / Tank (Datos Bloodmallet)
  const { wowClass, wowSpec } = getBloodmalletClassSpec(c, s);
  const isMplus = typeof currentContentMode !== 'undefined' && currentContentMode === 'mplus';
  const fightStyle = isMplus ? 'castingpatchwerk5' : 'castingpatchwerk';
  const modeLabel = isMplus ? '5 Targets (Mythic+ / AoE)' : '1 Target (Mythic Raid)';

  let cacheKey = `${wowClass}_${wowSpec}_${fightStyle}`;

  if (!bloodmalletDataCache[cacheKey] && window.BLOODMALLET_DATA && window.BLOODMALLET_DATA[cacheKey]) {
    bloodmalletDataCache[cacheKey] = window.BLOODMALLET_DATA[cacheKey];
  }

  // Fallback a 1 target si castingpatchwerk5 aún no está disponible
  if ((!bloodmalletDataCache[cacheKey] || !bloodmalletDataCache[cacheKey].data) && isMplus) {
    const fallbackKey = `${wowClass}_${wowSpec}_castingpatchwerk`;
    if (!bloodmalletDataCache[fallbackKey] && window.BLOODMALLET_DATA && window.BLOODMALLET_DATA[fallbackKey]) {
      bloodmalletDataCache[fallbackKey] = window.BLOODMALLET_DATA[fallbackKey];
    }
    if (bloodmalletDataCache[fallbackKey] && bloodmalletDataCache[fallbackKey].data) {
      cacheKey = fallbackKey;
    }
  }

  // Fallback para specs
  if ((!bloodmalletDataCache[cacheKey] || !bloodmalletDataCache[cacheKey].data) && window.BLOODMALLET_DATA) {
    if (window.BLOODMALLET_DATA['demon_hunter_devourer_castingpatchwerk']) {
      bloodmalletDataCache[cacheKey] = window.BLOODMALLET_DATA['demon_hunter_devourer_castingpatchwerk'];
    } else if (window.BLOODMALLET_DATA['priest_shadow_castingpatchwerk']) {
      bloodmalletDataCache[cacheKey] = window.BLOODMALLET_DATA['priest_shadow_castingpatchwerk'];
    }
  }

  const bmData = bloodmalletDataCache[cacheKey];
  if (!bmData || !bmData.data) {
    container.innerHTML = `
      <div class="bg-black/40 border border-wow-border rounded-xl p-8 text-center space-y-3">
        <i class="fa-solid fa-spinner fa-spin text-2xl text-amber-400"></i>
        <p class="text-xs text-slate-300">Descargando datos oficiales de simulación para ${wowClass}/${wowSpec} (${modeLabel}) desde bloodmallet.com...</p>
        <button type="button" onclick="syncBloodmalletData(true)" class="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-900 hover:bg-red-800 border border-red-500/50">Forzar Sincronización</button>
      </div>
    `;
    return;
  }

  const metaEl = document.getElementById('bm-modal-meta');
  if (metaEl) {
    const simcVer = bmData.metadata?.SimulationCraft || '66096c1';
    const upDate = bmData.metadata?.timestamp?.split(' ')[0] || 'Reciente';
    metaEl.innerText = `Fuente: Bloodmallet.com ${modeLabel} | SimC: ${simcVer} | Actualizado: ${upDate}`;
  }

  const baseline = Object.values(bmData.data.baseline || {})[0] || 0;
  const entries = [];
  const keys = bmData.sorted_data_keys || Object.keys(bmData.data);

  for (const name of keys) {
    if (name === 'baseline') continue;
    const ilvlMap = bmData.data[name];
    if (!ilvlMap) continue;

    const source = (bmData.data_sources && bmData.data_sources[name]) || 'Dungeon / Raid';
    const isActive = (bmData.data_active && bmData.data_active[name]) || false;
    const itemId = (bmData.item_ids && bmData.item_ids[name]) || 0;

    if (search && !name.toLowerCase().includes(search) && !source.toLowerCase().includes(search)) {
      continue;
    }

    const ilvls = Object.keys(ilvlMap).map(Number).sort((a, b) => b - a);
    const maxIlvl = ilvls[0];
    const maxDps = ilvlMap[maxIlvl];
    const maxGain = baseline > 0 ? Math.max(0, maxDps - baseline) : maxDps;

    const ownedItems = playerTrinkets.filter(it => {
      if (it.itemId && itemId && it.itemId === itemId) return true;
      return it.name && it.name.toLowerCase().trim() === name.toLowerCase().trim();
    });

    entries.push({
      name,
      itemId,
      source,
      isActive,
      ilvls,
      ilvlMap,
      maxIlvl,
      maxDps,
      maxGain,
      ownedItems
    });
  }

  entries.sort((a, b) => b.maxGain - a.maxGain);

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="bg-black/40 border border-wow-border rounded-xl p-8 text-center text-slate-400 text-xs">
        No se encontraron abalorios con el filtro "${search}".
      </div>
    `;
    return;
  }

  const maxChartGain = entries[0]?.maxGain || 1;

  container.innerHTML = entries.map((entry, idx) => {
    const pct = Math.min(100, Math.max(5, (entry.maxGain / maxChartGain) * 100));
    const isOwned = entry.ownedItems.length > 0;

    return `
      <div class="bg-wow-panel border ${isOwned ? 'border-amber-500/80 bg-amber-950/20 shadow-md ring-1 ring-amber-500/30' : 'border-wow-border hover:border-red-500/50'} rounded-lg p-3 transition space-y-2">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-xs font-black text-slate-500 w-5 text-right flex-shrink-0">#${idx + 1}</span>
            <a href="https://www.wowhead.com/item=${entry.itemId}" target="_blank" data-wowhead="item=${entry.itemId}" class="flex-shrink-0">
              <img src="${typeof getWowheadIconUrl === 'function' ? getWowheadIconUrl(null, 'trinket', entry.itemId) : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'}" data-item-id="${entry.itemId}" referrerpolicy="no-referrer" loading="lazy" class="w-8 h-8 rounded border ${isOwned ? 'border-amber-400' : 'border-red-500/40'} object-cover">
            </a>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <a href="https://www.wowhead.com/item=${entry.itemId}" target="_blank" data-wowhead="item=${entry.itemId}" class="font-bold text-xs ${isOwned ? 'text-amber-300 hover:text-amber-200' : 'text-purple-300 hover:text-purple-200'} truncate">${entry.name}</a>
                <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">${entry.source}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded ${entry.isActive ? 'bg-amber-950 text-amber-300 border border-amber-600/50' : 'bg-cyan-950 text-cyan-300 border border-cyan-600/50'} font-semibold">${entry.isActive ? 'On-Use' : 'Pasivo'}</span>
                ${isOwned ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-black font-black flex items-center gap-1"><i class="fa-solid fa-check"></i> En tu Inventario (${entry.ownedItems.map(x => 'ilvl ' + x.ilvl).join(', ')})</span>` : ''}
              </div>
            </div>
          </div>

          <div class="text-right flex-shrink-0">
            <div class="text-xs font-black text-red-400">+${entry.maxGain.toLocaleString()} DPS</div>
            <div class="text-[10px] text-slate-500">ilvl ${entry.maxIlvl} máx</div>
          </div>
        </div>

        <div class="space-y-1">
          <div class="w-full bg-black/80 rounded-full h-2 overflow-hidden border border-white/10">
            <div style="width: ${pct}%" class="${isOwned ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-gradient-to-r from-red-600 to-amber-500'} h-full rounded-full transition-all"></div>
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto text-[10px] pt-1">
            <span class="text-slate-500 font-semibold flex-shrink-0">Escalado ilvl:</span>
            ${entry.ilvls.slice().reverse().map(lvl => {
              const dps = entry.ilvlMap[lvl];
              const gain = baseline > 0 ? Math.max(0, dps - baseline) : dps;
              const matchingOwned = entry.ownedItems.find(o => o.ilvl === lvl);
              return `
                <span class="px-1.5 py-0.5 rounded ${matchingOwned ? 'bg-amber-500 text-black font-black ring-1 ring-amber-300' : 'bg-black/50 text-slate-400 border border-wow-border/60'} flex-shrink-0" title="ilvl ${lvl}: +${gain.toLocaleString()} DPS (${dps.toLocaleString()} total)">
                  ${lvl}: +${(gain >= 1000 ? (gain / 1000).toFixed(1) + 'k' : gain)}
                </span>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') window.$WowheadPower.refreshLinks();
  if (typeof resolveAllItemIconsAsync === 'function') resolveAllItemIconsAsync();
}

// Modal: Backup & JSON Export/Import
function openBackupModal() {
  const area = document.getElementById('backup-json-text');
  if (area) area.value = JSON.stringify(typeof items !== 'undefined' ? items : [], null, 2);
  const modal = document.getElementById('backup-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeBackupModal() {
  const modal = document.getElementById('backup-modal');
  if (modal) modal.classList.add('hidden');
}

function copyBackupToClipboard() {
  const area = document.getElementById('backup-json-text');
  const txt = area ? area.value : '';
  navigator.clipboard.writeText(txt).then(() => {
    showToast('¡Copia de seguridad copiada al portapapeles!');
  }).catch(() => {
    showToast('Error al copiar al portapapeles', 'error');
  });
}

function downloadBackupFile() {
  const area = document.getElementById('backup-json-text');
  const txt = area ? area.value : '';
  const blob = new Blob([txt], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wow_optimizer_backup_${typeof currentClass !== 'undefined' ? currentClass : 'class'}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Archivo JSON descargado');
}

function restoreBackupFromJson() {
  try {
    const raw = document.getElementById('backup-json-text')?.value || '';
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('El formato debe ser una lista (array) de objetos.');
    }
    items = parsed;
    saveState();
    closeBackupModal();
    renderInventory();
    runOptimizer();
    showToast(`¡Restaurados ${items.length} objetos correctamente!`);
  } catch (err) {
    alert('Error al procesar el JSON: ' + err.message);
  }
}

function confirmClearInventory() {
  if (confirm('¿Estás seguro de que deseas vaciar todo el inventario? Esta acción no se puede deshacer a menos que tengas un respaldo JSON.')) {
    items = [];
    saveState();
    closeBackupModal();
    renderInventory();
    runOptimizer();
    showToast('Inventario vaciado por completo');
  }
}

// Modal: Help & Guide
function openHelpModal() {
  const modal = document.getElementById('help-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeHelpModal() {
  const modal = document.getElementById('help-modal');
  if (modal) modal.classList.add('hidden');
}

// Legal Modals & Cookie Banner Control
function openPrivacyModal() {
  const m = document.getElementById('privacy-modal');
  if (m) m.classList.remove('hidden');
}
function closePrivacyModal() {
  const m = document.getElementById('privacy-modal');
  if (m) m.classList.add('hidden');
}
function openTermsModal() {
  const m = document.getElementById('terms-modal');
  if (m) m.classList.remove('hidden');
}
function closeTermsModal() {
  const m = document.getElementById('terms-modal');
  if (m) m.classList.add('hidden');
}
function openContactModal() {
  const m = document.getElementById('contact-modal');
  if (m) m.classList.remove('hidden');
}
function closeContactModal() {
  const m = document.getElementById('contact-modal');
  if (m) m.classList.add('hidden');
}
function openCookieConsent(forceOpen = false) {
  const banner = document.getElementById('cookie-consent-banner');
  if (!banner) return;
  if (forceOpen || !localStorage.getItem('wowopt_cookie_consent')) {
    banner.classList.remove('hidden');
  }
}
function acceptCookieConsent() {
  localStorage.setItem('wowopt_cookie_consent', 'accepted');
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) banner.classList.add('hidden');
}
