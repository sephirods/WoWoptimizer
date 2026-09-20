// Inventory Grid & Table View UI Controller
let currentInventoryViewMode = localStorage.getItem('wow_inv_view_mode') || 'cards';

function switchTab(tab) {
  const optView = document.getElementById('view-optimizer');
  const invView = document.getElementById('view-inventory');
  const optBtn = document.getElementById('tab-opt-btn');
  const invBtn = document.getElementById('tab-inv-btn');
  if (tab === 'optimizer') {
    if (optView) optView.classList.remove('hidden');
    if (invView) invView.classList.add('hidden');
    if (optBtn) optBtn.className = 'px-4 py-1.5 rounded-md text-sm font-semibold transition bg-amber-500 text-black shadow';
    if (invBtn) invBtn.className = 'px-4 py-1.5 rounded-md text-sm font-semibold transition text-slate-300 hover:text-white';
  } else {
    if (optView) optView.classList.add('hidden');
    if (invView) invView.classList.remove('hidden');
    if (invBtn) invBtn.className = 'px-4 py-1.5 rounded-md text-sm font-semibold transition bg-amber-500 text-black shadow';
    if (optBtn) optBtn.className = 'px-4 py-1.5 rounded-md text-sm font-semibold transition text-slate-300 hover:text-white';
    renderInventory();
  }
}

function setInventoryViewMode(mode) {
  currentInventoryViewMode = mode;
  localStorage.setItem('wow_inv_view_mode', mode);
  const cardBtn = document.getElementById('view-mode-cards-btn');
  const tableBtn = document.getElementById('view-mode-table-btn');
  if (cardBtn && tableBtn) {
    if (mode === 'cards') {
      cardBtn.className = 'px-2.5 py-1 rounded bg-amber-500 text-black font-bold transition';
      tableBtn.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white transition';
    } else {
      tableBtn.className = 'px-2.5 py-1 rounded bg-amber-500 text-black font-bold transition';
      cardBtn.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white transition';
    }
  }
  renderInventory();
}

function toggleItemLock(id) {
  const it = items.find(x => x.id === id);
  if (it) {
    it.locked = !it.locked;
    saveState();
    renderInventory();
    runOptimizer();
  }
}

function toggleItemDisabled(id) {
  const it = items.find(x => x.id === id);
  if (it) {
    it.disabled = !it.disabled;
    saveState();
    renderInventory();
    runOptimizer();
  }
}

function deleteItem(id) {
  items = items.filter(it => it.id !== id);
  saveState();
  renderInventory();
  runOptimizer();
  showToast('Objeto eliminado');
}

function cloneItem(id) {
  const it = items.find(x => x.id === id);
  if (!it) return;
  const copy = {
    ...it,
    id: 'clone_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: it.name + ' (Copia)',
    isEquipped: false,
    locked: false
  };
  items.push(copy);
  saveState();
  renderInventory();
  runOptimizer();
  showToast(`Objeto duplicado: ${it.name}`);
}

function bulkEnableAll(enable) {
  items.forEach(x => x.disabled = !enable);
  saveState();
  renderInventory();
  runOptimizer();
}

function bulkLockEquipped() {
  items.forEach(x => {
    if (x.isEquipped) x.locked = true;
  });
  saveState();
  renderInventory();
  runOptimizer();
}

function bulkUnlockAll() {
  items.forEach(x => {
    x.locked = false;
  });
  saveState();
  renderInventory();
  runOptimizer();
}

function toggleItemSocket(id) {
  const it = items.find(x => x.id === id);
  if (it) {
    it.socket = !it.socket;
    saveState();
    renderInventory();
    runOptimizer();
    showToast(`${it.name}: ${it.socket ? 'Ranura añadida' : 'Ranura retirada'}`);
  }
}

function toggleItemTier(id) {
  const it = items.find(x => x.id === id);
  if (it) {
    it.tier = !it.tier;
    saveState();
    renderInventory();
    runOptimizer();
    showToast(`${it.name}: ${it.tier ? 'Marcado como Tier' : 'Desmarcado de Tier'}`);
  }
}

function toggleItemEquipped(id) {
  const it = items.find(x => x.id === id);
  if (it) {
    it.isEquipped = !it.isEquipped;
    saveState();
    renderInventory();
    showToast(`${it.name}: ${it.isEquipped ? 'Marcado como Equipado' : 'Guardado en Bolsa'}`);
  }
}

function toggleItemVault(id) {
  const it = items.find(x => x.id === id);
  if (it) {
    it.isVault = !it.isVault;
    saveState();
    renderInventory();
    runOptimizer();
    showToast(it.isVault ? `${it.name}: Marcado como Gran Cámara (Vault)` : `${it.name}: Desmarcado de Gran Cámara`);
  }
}

function downloadInventoryCSV() {
  if (!items || items.length === 0) {
    showToast('No hay objetos en el inventario para exportar', 'error');
    return;
  }
  const headers = ['ID', 'Nombre', 'Casilla', 'Track', 'ilvl', 'Maestria', 'Critico', 'Celeridad', 'Versatilidad', 'Ranura', 'Tier', 'Equipado', 'Gran_Camara', 'Bloqueado', 'Deshabilitado', 'Wowhead_ID'];
  const rows = items.map(it => [
    `"${it.id}"`,
    `"${(it.name || '').replace(/"/g, '""')}"`,
    `"${it.slot || ''}"`,
    `"${it.track || ''}"`,
    it.ilvl || 0,
    it.mastery || 0,
    it.crit || 0,
    it.haste || 0,
    it.vers || 0,
    it.socket ? 'SI' : 'NO',
    it.tier ? 'SI' : 'NO',
    it.isEquipped ? 'SI' : 'NO',
    it.isVault ? 'SI' : 'NO',
    it.locked ? 'SI' : 'NO',
    it.disabled ? 'SI' : 'NO',
    it.itemId || 0
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wow_inventory_${currentClass}_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('¡Inventario exportado a CSV con éxito!');
}

function toggleSearchClearBtn() {
  const val = document.getElementById('search-inventory')?.value || '';
  const btn = document.getElementById('search-clear-btn');
  if (btn) {
    if (val.length > 0) btn.classList.remove('hidden');
    else btn.classList.add('hidden');
  }
}

function clearInventorySearch() {
  const input = document.getElementById('search-inventory');
  if (input) {
    input.value = '';
    toggleSearchClearBtn();
    renderInventory();
  }
}

function renderInventory() {
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;
  const search = (document.getElementById('search-inventory')?.value || '').toLowerCase();
  const slotFilter = document.getElementById('filter-slot')?.value || 'all';
  const sortOption = document.getElementById('sort-inventory')?.value || 'ilvl-desc';

  const filterSockets = document.getElementById('inv-filter-sockets')?.checked;
  const filterTier = document.getElementById('inv-filter-tier')?.checked;
  const filterLocked = document.getElementById('inv-filter-locked')?.checked;
  const filterActive = document.getElementById('inv-filter-active')?.checked;
  const filterVault = document.getElementById('inv-filter-vault')?.checked;

  let filtered = items.filter(it => {
    const matchSearch = it.name.toLowerCase().includes(search) || (it.note && it.note.toLowerCase().includes(search));
    const matchSlot = slotFilter === 'all' || it.slot === slotFilter;
    if (!matchSearch || !matchSlot) return false;

    if (filterSockets && !it.socket) return false;
    if (filterTier && !it.tier) return false;
    if (filterLocked && !it.locked) return false;
    if (filterActive && it.disabled) return false;
    if (filterVault && !it.isVault) return false;

    return true;
  });

  const statsStrip = document.getElementById('inventory-stats-strip');
  if (statsStrip) {
    const totalCount = items.length;
    const mythCount = items.filter(x => x.track === 'myth').length;
    const heroCount = items.filter(x => x.track === 'hero').length;
    const champCount = items.filter(x => x.track === 'champ').length;
    const vetCount = items.filter(x => x.track === 'vet' || x.track === 'crafted').length;
    const socketCount = items.filter(x => x.socket).length;
    const tierCount = items.filter(x => x.tier).length;
    const lockedCount = items.filter(x => x.locked).length;
    const vaultCount = items.filter(x => x.isVault).length;

    const lang = (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'mx')) ? 'es' : 'en';
    const txtShowing = lang === 'es' ? 'Mostrando' : 'Showing';
    const txtOf = lang === 'es' ? 'de' : 'of';
    const txtMyth = lang === 'es' ? 'Mítico' : 'Mythic';
    const txtSockets = lang === 'es' ? 'Ranuras' : 'Sockets';
    const txtVault = lang === 'es' ? 'Gran Cámara' : 'Great Vault';

    statsStrip.innerHTML = `
      <span>${txtShowing}: <strong class="text-amber-300">${filtered.length}</strong> ${txtOf} <strong class="text-white">${totalCount}</strong></span>
      <span class="text-slate-600">•</span>
      <span class="text-purple-400 font-semibold">${txtMyth}: ${mythCount}</span>
      <span class="text-blue-400 font-semibold">Hero: ${heroCount}</span>
      <span class="text-emerald-400 font-semibold">Champ: ${champCount}</span>
      <span class="text-amber-400 font-semibold">Vet: ${vetCount}</span>
      <span class="text-slate-600">•</span>
      <span class="text-amber-300 font-semibold"><i class="fa-solid fa-gem text-[9px] mr-0.5"></i> ${socketCount} ${txtSockets}</span>
      <span class="text-purple-300 font-semibold">${tierCount} Tier</span>
      ${vaultCount > 0 ? `<span class="text-yellow-300 font-bold bg-yellow-950/60 border border-yellow-500/50 px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1"><i class="fa-solid fa-vault text-[9px] text-yellow-400"></i> ${vaultCount} ${txtVault}</span>` : ''}
      ${lockedCount > 0 ? `<span class="text-amber-400 font-bold bg-amber-950/40 border border-amber-500/40 px-1 rounded"><i class="fa-solid fa-lock text-[9px]"></i> ${lockedCount}</span>` : ''}
    `;
  }

  filtered.sort((a, b) => {
    if (sortOption === 'ilvl-desc') return b.ilvl - a.ilvl;
    if (sortOption === 'ilvl-asc') return a.ilvl - b.ilvl;
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'crit-desc') return (b.crit || 0) - (a.crit || 0);
    if (sortOption === 'haste-desc') return (b.haste || 0) - (a.haste || 0);
    if (sortOption === 'mastery-desc') return (b.mastery || 0) - (a.mastery || 0);
    if (sortOption === 'vers-desc') return (b.vers || 0) - (a.vers || 0);
    return 0;
  });

  const isEs = (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'mx'));

  const trackBadges = {
    myth: `<span class="text-[10px] bg-purple-950 text-purple-300 border border-purple-600 px-1 rounded font-bold">${isEs ? 'Mítico' : 'Mythic'}</span>`,
    hero: '<span class="text-[10px] bg-blue-950 text-blue-300 border border-blue-600 px-1 rounded font-bold">Hero</span>',
    champ: `<span class="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600 px-1 rounded font-bold">${isEs ? 'Camp' : 'Champ'}</span>`,
    vet: '<span class="text-[10px] bg-amber-950 text-amber-300 border border-amber-600 px-1 rounded font-bold">Vet</span>',
    adventurer: `<span class="text-[10px] bg-slate-800 text-slate-300 border border-slate-600 px-1 rounded font-bold">${isEs ? 'Avent' : 'Adv'}</span>`,
    crafted: `<span class="text-[10px] bg-orange-950 text-orange-300 border border-orange-600 px-1 rounded font-bold">${isEs ? 'Fabricado' : 'Crafted'}</span>`
  };

  if (items.length === 0) {
    grid.className = 'grid grid-cols-1 gap-4';
    grid.innerHTML = `
      <div class="col-span-full bg-wow-panel border border-wow-border/60 rounded-xl p-10 text-center space-y-4">
        <div class="w-14 h-14 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
          <i class="fa-solid fa-box-open text-2xl"></i>
        </div>
        <div>
          <h4 class="text-base font-bold text-white">${t('emptyInvTitle', 'Tu inventario está vacío')}</h4>
          <p class="text-xs text-slate-400 max-w-md mx-auto mt-1">${t('emptyInvDesc', 'Importa tus piezas mediante la cadena de SimulationCraft o añade objetos manualmente.')}</p>
        </div>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button onclick="openSimcModal()" class="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 flex items-center gap-1.5 shadow">
            <i class="fa-solid fa-file-import"></i> ${t('emptyInvImportBtn', 'Importar SimC')}
          </button>
        </div>
      </div>
    `;
    const b = document.getElementById('total-items-badge');
    if (b) b.innerText = 0;
    return;
  }

  if (filtered.length === 0) {
    grid.className = 'grid grid-cols-1 gap-4';
    grid.innerHTML = `
      <div class="col-span-full bg-wow-panel border border-wow-border/60 rounded-xl p-8 text-center space-y-2">
        <i class="fa-solid fa-filter-circle-xmark text-3xl text-slate-500"></i>
        <h4 class="text-sm font-bold text-white">No se encontraron objetos con los filtros actuales</h4>
      </div>
    `;
    const b = document.getElementById('total-items-badge');
    if (b) b.innerText = items.length;
    return;
  }

  if (currentInventoryViewMode === 'table') {
    grid.className = 'block';
    grid.innerHTML = `
      <div class="bg-wow-panel border border-wow-border rounded-xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-black/70 text-slate-400 border-b border-wow-border uppercase text-[10px] font-bold">
              <tr>
                <th class="p-3">Objeto</th>
                <th class="p-3">Casilla</th>
                <th class="p-3">Track</th>
                <th class="p-3 text-center">ilvl</th>
                <th class="p-3">Estadísticas</th>
                <th class="p-3 text-center">Ranura</th>
                <th class="p-3 text-center">Tier</th>
                <th class="p-3 text-center">Estado</th>
                <th class="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-wow-border/50">
              ${filtered.map(it => {
                const itemStatSum = (it.mastery || 0) + (it.crit || 0) + (it.haste || 0) + (it.vers || 0);
                return `
                <tr class="${it.disabled ? 'opacity-40 bg-red-950/10' : it.locked ? 'bg-amber-950/20' : 'hover:bg-white/5'} transition">
                  <td class="p-3">
                    <div class="flex items-center gap-2.5">
                      <a href="${getWowheadBaseUrl()}/item=${it.itemId || 0}" target="_blank" ${getItemWowheadAttr(it)} class="flex-shrink-0">
                        <img src="${getWowheadIconUrl(it.icon, it.slot, it.itemId)}" data-item-id="${it.itemId || ''}" referrerpolicy="no-referrer" loading="lazy" onerror="handleImageError(this, '${it.slot}')" class="w-8 h-8 rounded border ${it.locked ? 'border-amber-400' : 'border-purple-500/40'} object-cover">
                      </a>
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <a href="${getWowheadBaseUrl()}/item=${it.itemId || 0}" target="_blank" ${getItemWowheadAttr(it)} class="font-bold ${it.disabled ? 'text-slate-500 line-through' : 'text-purple-300 hover:text-purple-200'} truncate block max-w-[220px]">${it.name}</a>
                          ${it.isVault ? `<span class="text-[9px] bg-yellow-950/90 text-yellow-300 border border-yellow-500/60 px-1.5 py-0.2 rounded font-bold inline-flex items-center gap-1 shadow-sm"><i class="fa-solid fa-vault text-[8px] text-yellow-400"></i> ${t('badgeVault', 'Gran Cámara')}</span>` : ''}
                        </div>
                        ${it.locked ? '<span class="text-[9px] text-amber-400 font-bold flex items-center gap-1"><i class="fa-solid fa-lock"></i> Bloqueado</span>' : ''}
                      </div>
                    </div>
                  </td>
                  <td class="p-3 font-semibold text-slate-300 capitalize">${typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(it.slot) : it.slot.replace('_', ' ')}</td>
                  <td class="p-3">${trackBadges[it.track] || trackBadges.hero}</td>
                  <td class="p-3 text-center font-bold text-amber-400">${it.ilvl}</td>
                  <td class="p-3 font-mono text-[11px]">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      ${it.mastery ? `<span class="text-purple-300 font-semibold">+${it.mastery}M</span>` : ''}
                      ${it.crit ? `<span class="text-blue-300 font-semibold">+${it.crit}C</span>` : ''}
                      ${it.haste ? `<span class="text-slate-300 font-semibold">+${it.haste}H</span>` : ''}
                      ${it.vers ? `<span class="text-emerald-300 font-semibold">+${it.vers}V</span>` : ''}
                      ${it.slot === 'trinket' ? getTrinketBloodmalletBadge(it) : ''}
                      <span class="text-[10px] text-amber-400 font-bold bg-amber-950/40 px-1 rounded border border-amber-500/20 font-sans">(${itemStatSum} pts)</span>
                    </div>
                  </td>
                  <td class="p-3 text-center">
                    <button onclick="toggleItemSocket('${it.id}')" class="text-xs transition ${it.socket ? 'text-amber-400 font-bold' : 'text-slate-600 hover:text-slate-400'}">
                      <i class="fa-solid fa-gem"></i>
                    </button>
                  </td>
                  <td class="p-3 text-center">
                    ${TIER_ELIGIBLE_SLOTS.includes(it.slot) ? `
                      <button onclick="toggleItemTier('${it.id}')" class="text-[10px] px-1.5 py-0.5 rounded font-bold transition ${it.tier ? 'bg-purple-950 text-purple-300 border border-purple-500' : 'text-slate-600 hover:text-purple-300'}">
                        ${it.tier ? 'Tier' : '-'}
                      </button>
                    ` : '<span class="text-slate-600">-</span>'}
                  </td>
                  <td class="p-3 text-center">
                    <button onclick="toggleItemEquipped('${it.id}')" class="text-[10px] px-2 py-0.5 rounded font-bold transition ${it.isEquipped ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'bg-slate-900 text-slate-500 border border-slate-700/40'}">
                      ${it.isEquipped ? 'Equipado' : 'Bolsa'}
                    </button>
                  </td>
                  <td class="p-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button onclick="toggleItemLock('${it.id}')" title="${it.locked ? 'Desbloquear' : 'Bloquear'}" class="p-1 text-xs ${it.locked ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'}">
                        <i class="fa-solid ${it.locked ? 'fa-lock' : 'fa-lock-open'}"></i>
                      </button>
                      <button onclick="cloneItem('${it.id}')" title="Duplicar" class="text-slate-400 hover:text-indigo-300 p-1 text-xs"><i class="fa-solid fa-clone"></i></button>
                      <button onclick="toggleItemDisabled('${it.id}')" title="${it.disabled ? 'Habilitar' : 'Ignorar'}" class="p-1 text-xs ${it.disabled ? 'text-red-400 hover:text-green-400' : 'text-slate-400 hover:text-red-400'}">
                        <i class="fa-solid ${it.disabled ? 'fa-eye-slash' : 'fa-eye'}"></i>
                      </button>
                      <button onclick="editItem('${it.id}')" title="Editar" class="text-slate-400 hover:text-amber-400 p-1 text-xs"><i class="fa-solid fa-pen"></i></button>
                      <button onclick="deleteItem('${it.id}')" title="Eliminar" class="text-slate-400 hover:text-red-400 p-1 text-xs"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    grid.innerHTML = filtered.map(it => {
      const itemStatSum = (it.mastery || 0) + (it.crit || 0) + (it.haste || 0) + (it.vers || 0);
      return `
      <div class="bg-wow-panel border ${it.disabled ? 'border-red-900/40 opacity-50' : it.locked ? 'border-amber-400/80 ring-1 ring-amber-400/30' : 'border-wow-border hover:border-purple-500/60'} transition rounded-xl p-3.5 flex gap-3 shadow-md group relative">
        <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border ${it.locked ? 'border-amber-400' : 'border-purple-500/40'} bg-black/60 shadow relative">
          <a href="${getWowheadBaseUrl()}/item=${it.itemId || 0}" target="_blank" ${getItemWowheadAttr(it)}>
            <img src="${getWowheadIconUrl(it.icon, it.slot, it.itemId)}" data-item-id="${it.itemId || ''}" alt="${it.name}" referrerpolicy="no-referrer" loading="lazy" onerror="handleImageError(this, '${it.slot}')" class="w-full h-full object-cover">
          </a>
          ${it.locked ? '<span class="absolute bottom-0 right-0 bg-amber-500 text-black text-[9px] px-1 rounded-tl font-black"><i class="fa-solid fa-lock"></i></span>' : ''}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-1">
            <a href="${getWowheadBaseUrl()}/item=${it.itemId || 0}" target="_blank" ${getItemWowheadAttr(it)} class="text-sm font-bold ${it.disabled ? 'text-slate-500 line-through' : 'text-purple-400 hover:text-purple-300'} truncate">${it.name}</a>
            <span class="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">${it.ilvl}</span>
          </div>
          <div class="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 capitalize flex-wrap">
            <span class="font-medium">${typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(it.slot) : it.slot.replace('_', ' ')}</span>
            ${trackBadges[it.track] || trackBadges.hero}
            <button onclick="toggleItemEquipped('${it.id}')" title="Alternar entre Equipado y Bolsa" class="text-[10px] px-1.5 py-0.5 rounded font-bold transition ${it.isEquipped ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60' : 'bg-slate-900/60 text-slate-500 border border-slate-700/40 hover:text-slate-300'}">
              ${it.isEquipped ? 'Equipado' : 'Bolsa'}
            </button>
            ${it.isVault ? 
              `<button onclick="toggleItemVault('${it.id}')" title="Clic para alternar Gran Cámara" class="text-[10px] bg-yellow-950/90 text-yellow-300 border border-yellow-500/80 px-1.5 py-0.5 rounded font-bold flex items-center gap-1 shadow-sm ring-1 ring-yellow-400/30 transition"><i class="fa-solid fa-vault text-[9px] text-yellow-400"></i> ${t('badgeVault', 'Gran Cámara')}</button>` : 
              `<button onclick="toggleItemVault('${it.id}')" title="Clic para marcar como Gran Cámara" class="text-[10px] text-slate-500 hover:text-yellow-300 border border-slate-700/40 px-1 rounded opacity-50 hover:opacity-100 transition">${t('addVaultBtn', '+Cámara')}</button>`
            }
            ${it.tier ? 
              `<button onclick="toggleItemTier('${it.id}')" title="Clic para alternar Tier" class="text-[10px] bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-600 px-1.5 py-0.5 rounded font-semibold transition">Tier</button>` : 
              (TIER_ELIGIBLE_SLOTS.includes(it.slot) ? `<button onclick="toggleItemTier('${it.id}')" title="Clic para marcar como Tier" class="text-[10px] text-slate-500 hover:text-purple-300 border border-slate-700/40 px-1 rounded opacity-50 hover:opacity-100 transition">+Tier</button>` : '')
            }
            ${it.socket ? 
              `<button onclick="toggleItemSocket('${it.id}')" title="Clic para alternar Ranura" class="text-[10px] bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/50 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 transition"><i class="fa-solid fa-gem text-[9px]"></i> Ranura</button>` : 
              `<button onclick="toggleItemSocket('${it.id}')" title="Clic para añadir Ranura" class="text-[10px] text-slate-500 hover:text-amber-300 border border-slate-700/40 px-1 rounded opacity-50 hover:opacity-100 transition">+Ranura</button>`
            }
            ${it.locked ? '<span class="text-[10px] bg-amber-950 text-amber-300 border border-amber-500 px-1 rounded font-bold"><i class="fa-solid fa-lock text-[9px]"></i> Bloqueado</span>' : ''}
            ${!isItemUsableBySpec(it, currentClass, currentSpec) ? '<span class="text-[10px] bg-red-950/80 text-red-400 border border-red-500/40 px-1 rounded font-bold" title="Incompatible con tu especialización activa"><i class="fa-solid fa-ban text-[9px]"></i> Incompatible</span>' : ''}
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs">
            <div class="flex items-center gap-2 flex-wrap">
              ${it.mastery ? `<span class="text-purple-300 font-medium">+${it.mastery} Mast</span>` : ''}
              ${it.crit ? `<span class="text-blue-300 font-medium">+${it.crit} Crit</span>` : ''}
              ${it.haste ? `<span class="text-slate-300 font-medium">+${it.haste} Haste</span>` : ''}
              ${it.vers ? `<span class="text-emerald-300 font-medium">+${it.vers} Vers</span>` : ''}
              ${it.slot === 'trinket' ? getTrinketBloodmalletBadge(it) : ''}
            </div>
            ${itemStatSum > 0 ? `<span class="text-[10px] text-amber-300 font-bold bg-amber-950/40 border border-amber-500/20 px-1.5 py-0.5 rounded">${itemStatSum} pts</span>` : ''}
          </div>
        </div>
        <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onclick="toggleItemLock('${it.id}')" title="${it.locked ? 'Desbloquear' : 'Bloquear'}" class="p-1 text-xs ${it.locked ? 'text-amber-400 hover:text-slate-400' : 'text-slate-400 hover:text-amber-400'}">
            <i class="fa-solid ${it.locked ? 'fa-lock' : 'fa-lock-open'}"></i>
          </button>
          <button onclick="cloneItem('${it.id}')" title="Duplicar Objeto" class="text-slate-400 hover:text-indigo-300 p-1 text-xs"><i class="fa-solid fa-clone"></i></button>
          <button onclick="toggleItemDisabled('${it.id}')" title="${it.disabled ? 'Habilitar' : 'Ignorar'}" class="p-1 text-xs ${it.disabled ? 'text-red-400 hover:text-green-400' : 'text-slate-400 hover:text-red-400'}">
            <i class="fa-solid ${it.disabled ? 'fa-eye-slash' : 'fa-eye'}"></i>
          </button>
          <button onclick="editItem('${it.id}')" title="Editar" class="text-slate-400 hover:text-amber-400 p-1 text-xs"><i class="fa-solid fa-pen"></i></button>
          <button onclick="deleteItem('${it.id}')" title="Eliminar" class="text-slate-400 hover:text-red-400 p-1 text-xs"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
    }).join('');
  }

  const b = document.getElementById('total-items-badge');
  if (b) b.innerText = items.length;
  if (window.$WowheadPower) window.$WowheadPower.refreshLinks();
}
