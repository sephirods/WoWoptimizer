// Modal for Manual Item Creation & Editing
const TIER_ELIGIBLE_SLOTS = ['head', 'shoulder', 'chest', 'hands', 'legs'];

function updateTierCheckboxVisibility(slot) {
  const tierWrapper = document.getElementById('item-tier-wrapper');
  const tierCheckbox = document.getElementById('item-tier');
  const isTierEligible = TIER_ELIGIBLE_SLOTS.includes(slot);
  
  if (tierWrapper) {
    if (isTierEligible) {
      tierWrapper.style.display = 'flex';
    } else {
      tierWrapper.style.display = 'none';
      if (tierCheckbox) tierCheckbox.checked = false;
    }
  }
}

function populateIlvlDropdown(track, selectedIlvl = null, slotOverride = null) {
  const select = document.getElementById('item-ilvl');
  if (!select) return;

  const slotSelect = document.getElementById('item-slot');
  const currentSlot = slotOverride || (slotSelect ? slotSelect.value : null);
  const canUseVenom = typeof isSlotEligibleForVenomstone === 'function' ? isSlotEligibleForVenomstone(currentSlot) : true;

  let steps = [...(MIDNIGHT_UPGRADE_TRACKS[track] || MIDNIGHT_UPGRADE_TRACKS.hero)];
  if (!canUseVenom) {
    steps = steps.filter(s => !s.rank.toLowerCase().includes('venomstone'));
  }

  const lang = (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'mx')) ? 'es' : 'en';

  const numSelected = selectedIlvl !== null ? Number(selectedIlvl) : null;
  if (numSelected && !steps.some(s => s.ilvl === numSelected)) {
    steps.push({ rank: lang === 'es' ? `Especial / Muy Raro (${numSelected})` : `Special / Very Rare (${numSelected})`, ilvl: numSelected });
    steps.sort((a, b) => a.ilvl - b.ilvl);
  }

  select.innerHTML = steps.map(s => {
    let rankLabel = s.rank;
    if (lang === 'es') {
      rankLabel = rankLabel
        .replace(/Myth\b/gi, 'Mito')
        .replace(/Mythic\b/gi, 'Mítico')
        .replace(/Hero\b/gi, 'Hero')
        .replace(/Heroic\b/gi, 'Heroico')
        .replace(/Champion\b/gi, 'Campeón')
        .replace(/Veteran\b/gi, 'Veterano')
        .replace(/Adventurer\b/gi, 'Aventurero')
        .replace(/Crafted\b/gi, 'Fabricado')
        .replace(/Crests\b/gi, 'Blasones');
    }
    return `
    <option value="${s.ilvl}" ${(numSelected !== null && numSelected === s.ilvl) ? 'selected' : ''}>
      ${rankLabel} (${s.ilvl})
    </option>
  `;
  }).join('');

  if (numSelected !== null && steps.some(s => s.ilvl === numSelected)) {
    select.value = numSelected;
  } else {
    select.value = steps[0].ilvl;
  }
}

function onItemSlotChange() {
  const slot = document.getElementById('item-slot')?.value || 'head';
  const track = document.getElementById('item-track')?.value || 'hero';
  const curIlvl = document.getElementById('item-ilvl')?.value;
  updateTierCheckboxVisibility(slot);
  populateIlvlDropdown(track, curIlvl, slot);
  onItemIlvlChange();
}

function onItemTrackChange() {
  const track = document.getElementById('item-track')?.value || 'hero';
  const slot = document.getElementById('item-slot')?.value || 'head';
  populateIlvlDropdown(track, null, slot);
  onItemIlvlChange();
}

let currentModalBaseStats = {
  baseIlvl: 305,
  mastery: 0,
  crit: 0,
  haste: 0,
  vers: 0,
  icon: null
};

let wowheadUrlDebounce = null;
function onWowheadUrlInput(val) {
  if (wowheadUrlDebounce) clearTimeout(wowheadUrlDebounce);
  wowheadUrlDebounce = setTimeout(() => {
    triggerWowheadUrlFetch(val);
  }, 250);
}

async function triggerWowheadUrlFetch(inputVal = null) {
  const urlInput = document.getElementById('item-wowhead-url');
  const val = (inputVal !== null ? inputVal : (urlInput ? urlInput.value : '')).trim();
  const statusEl = document.getElementById('wowhead-fetch-status');
  const previewCard = document.getElementById('item-wowhead-preview');
  const previewIcon = document.getElementById('item-preview-icon');
  const previewName = document.getElementById('item-preview-name');
  const previewSlot = document.getElementById('item-preview-slot');
  const previewDetails = document.getElementById('item-preview-details');

  if (!val) {
    if (statusEl) statusEl.innerHTML = 'Pega un enlace para auto-rellenar';
    if (previewCard) previewCard.classList.add('hidden');
    return;
  }

  const match = val.match(/item=(\d+)/i) || val.match(/^(\d+)$/);
  if (!match) {
    if (statusEl) statusEl.innerHTML = '<span class="text-amber-400">Introduce un ID o enlace válido de Wowhead</span>';
    return;
  }

  const itemId = parseInt(match[1]);
  const ilvlParam = val.match(/[?&]ilvl=(\d+)/i);
  const requestedIlvl = ilvlParam ? parseInt(ilvlParam[1]) : 321;

  if (statusEl) statusEl.innerHTML = '<span class="text-amber-400"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Consultando Wowhead...</span>';

  try {
    const meta = await fetchWowheadItemMetadata(itemId, requestedIlvl);
    if (meta && meta.name) {
      document.getElementById('item-name').value = meta.name;
      document.getElementById('item-wowhead-id').value = itemId;
      
      const finalSlot = meta.slot || 'head';
      const slotSelect = document.getElementById('item-slot');
      if (slotSelect) {
        slotSelect.value = finalSlot;
        slotSelect.disabled = true;
      }
      
      updateTierCheckboxVisibility(finalSlot);

      if (meta.tier && TIER_ELIGIBLE_SLOTS.includes(finalSlot)) {
        document.getElementById('item-tier').checked = true;
      } else {
        document.getElementById('item-tier').checked = false;
      }

      const baseIlvl = meta.ilvl || requestedIlvl || 305;
      currentModalBaseStats = {
        baseIlvl: baseIlvl,
        mastery: meta.mastery || 0,
        crit: meta.crit || 0,
        haste: meta.haste || 0,
        vers: meta.vers || 0,
        armorType: meta.armorType || null,
        icon: meta.icon || null
      };

      let autoTrack = meta.track || 'hero';
      if (!meta.track) {
        if (baseIlvl >= 328) autoTrack = 'myth';
        else if (baseIlvl >= 311) autoTrack = 'hero';
        else if (baseIlvl >= 298) autoTrack = 'champ';
        else if (baseIlvl >= 285) autoTrack = 'vet';
      }
      
      const trackSelect = document.getElementById('item-track');
      if (trackSelect) trackSelect.value = autoTrack;

      populateIlvlDropdown(autoTrack, baseIlvl, finalSlot);
      onItemIlvlChange();

      if (previewCard) previewCard.classList.remove('hidden');
      if (previewIcon) {
        previewIcon.src = getWowheadIconUrl(meta.icon, finalSlot, itemId);
      }
      if (previewName) previewName.innerText = meta.name;
      if (previewSlot) previewSlot.innerText = finalSlot.replace('_', ' ');
      if (previewDetails) {
        const statsArr = [];
        if (meta.mastery) statsArr.push(`Mastery: +${meta.mastery}`);
        if (meta.crit) statsArr.push(`Crit: +${meta.crit}`);
        if (meta.haste) statsArr.push(`Haste: +${meta.haste}`);
        if (meta.vers) statsArr.push(`Vers: +${meta.vers}`);
        previewDetails.innerText = `ilvl ${baseIlvl} • ${statsArr.join(' • ') || 'Sin secundarias fijas'}`;
      }

      if (statusEl) statusEl.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-check mr-1"></i> ¡Cargado con éxito!</span>';
      updateItemModalStatSum();
      return;
    }
  } catch (err) {
    console.warn('Error fetching Wowhead item:', err);
  }

  const known = findKnownItemInfo('', itemId);
  if (known) {
    document.getElementById('item-name').value = known.name || ('Objeto #' + itemId);
    document.getElementById('item-wowhead-id').value = itemId;
    document.getElementById('item-slot').value = known.slot || 'head';
    updateTierCheckboxVisibility(known.slot || 'head');
    if (known.tier && TIER_ELIGIBLE_SLOTS.includes(known.slot)) {
      document.getElementById('item-tier').checked = true;
    }
    currentModalBaseStats = {
      baseIlvl: known.baseIlvl || 321,
      mastery: known.mastery || 0,
      crit: known.crit || 0,
      haste: known.haste || 0,
      vers: known.vers || 0,
      icon: known.icon || null
    };
    populateIlvlDropdown(known.track || 'hero', known.baseIlvl || 321, known.slot || 'head');
    onItemIlvlChange();
    if (previewCard) previewCard.classList.remove('hidden');
    if (previewIcon) previewIcon.src = getWowheadIconUrl(known.icon, known.slot, itemId);
    if (previewName) previewName.innerText = known.name;
    if (previewSlot) previewSlot.innerText = (known.slot || 'head').replace('_', ' ');
    if (statusEl) statusEl.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-check mr-1"></i> ¡Cargado desde catálogo!</span>';
    updateItemModalStatSum();
    return;
  }

  if (statusEl) statusEl.innerHTML = '<span class="text-amber-400">ID ' + itemId + ' detectado (cargando datos...)</span>';
  document.getElementById('item-wowhead-id').value = itemId;
}

function onItemIlvlChange() {
  const newIlvl = parseInt(document.getElementById('item-ilvl')?.value) || 305;
  const editId = document.getElementById('edit-item-id')?.value;

  if (editId) {
    const it = items.find(x => x.id === editId);
    if (it) {
      if (!it.baseIlvl) {
        it.baseIlvl = it.ilvl || 305;
        it.baseMastery = (it.mastery !== undefined) ? it.baseMastery : (it.mastery || 0);
        it.baseCrit = (it.crit !== undefined) ? it.baseCrit : (it.crit || 0);
        it.baseHaste = (it.haste !== undefined) ? it.baseHaste : (it.haste || 0);
        it.baseVers = (it.vers !== undefined) ? it.baseVers : (it.vers || 0);
      }
      const scaledM = scaleStatByIlvl(it.baseMastery, it.baseIlvl, newIlvl);
      const scaledC = scaleStatByIlvl(it.baseCrit, it.baseIlvl, newIlvl);
      const scaledH = scaleStatByIlvl(it.baseHaste, it.baseIlvl, newIlvl);
      const scaledV = scaleStatByIlvl(it.baseVers, it.baseIlvl, newIlvl);

      if (document.getElementById('item-mastery')) document.getElementById('item-mastery').value = scaledM;
      if (document.getElementById('item-crit')) document.getElementById('item-crit').value = scaledC;
      if (document.getElementById('item-haste')) document.getElementById('item-haste').value = scaledH;
      if (document.getElementById('item-vers')) document.getElementById('item-vers').value = scaledV;
    }
  } else if (currentModalBaseStats && currentModalBaseStats.baseIlvl) {
    const scaledM = scaleStatByIlvl(currentModalBaseStats.mastery, currentModalBaseStats.baseIlvl, newIlvl);
    const scaledC = scaleStatByIlvl(currentModalBaseStats.crit, currentModalBaseStats.baseIlvl, newIlvl);
    const scaledH = scaleStatByIlvl(currentModalBaseStats.haste, currentModalBaseStats.baseIlvl, newIlvl);
    const scaledV = scaleStatByIlvl(currentModalBaseStats.vers, currentModalBaseStats.baseIlvl, newIlvl);

    if (document.getElementById('item-mastery')) document.getElementById('item-mastery').value = scaledM;
    if (document.getElementById('item-crit')) document.getElementById('item-crit').value = scaledC;
    if (document.getElementById('item-haste')) document.getElementById('item-haste').value = scaledH;
    if (document.getElementById('item-vers')) document.getElementById('item-vers').value = scaledV;
  }

  updateItemModalStatSum();
}

function updateItemModalStatSum() {
  const m = parseInt(document.getElementById('item-mastery')?.value) || 0;
  const c = parseInt(document.getElementById('item-crit')?.value) || 0;
  const h = parseInt(document.getElementById('item-haste')?.value) || 0;
  const v = parseInt(document.getElementById('item-vers')?.value) || 0;
  const total = m + c + h + v;
  const badge = document.getElementById('item-modal-stats-total');
  if (badge) badge.innerText = `Total: ${total} pts`;
}

function openNewItemModal() {
  document.getElementById('modal-title').innerText = t('addItemModalTitle', 'Añadir Nuevo Objeto');
  document.getElementById('edit-item-id').value = '';
  
  const lookupBox = document.getElementById('wowhead-lookup-box');
  if (lookupBox) lookupBox.classList.remove('hidden');
  const urlInput = document.getElementById('item-wowhead-url');
  if (urlInput) urlInput.value = '';
  const statusEl = document.getElementById('wowhead-fetch-status');
  if (statusEl) statusEl.innerHTML = 'Pega un enlace para auto-rellenar';
  const previewCard = document.getElementById('item-wowhead-preview');
  if (previewCard) previewCard.classList.add('hidden');

  currentModalBaseStats = {
    baseIlvl: 305,
    mastery: 0,
    crit: 0,
    haste: 0,
    vers: 0,
    icon: null
  };

  const nameInput = document.getElementById('item-name');
  nameInput.value = '';
  nameInput.readOnly = true;
  nameInput.className = "w-full bg-black/50 border border-wow-border/50 rounded px-3 py-1.5 text-sm text-slate-300 cursor-not-allowed select-none focus:outline-none";

  const slotSelect = document.getElementById('item-slot');
  slotSelect.value = 'head';
  slotSelect.disabled = true;
  slotSelect.className = "w-full bg-black/50 border border-wow-border/50 rounded px-2.5 py-1.5 text-sm text-slate-300 cursor-not-allowed select-none focus:outline-none";

  const trackSelect = document.getElementById('item-track');
  trackSelect.value = 'hero';
  trackSelect.className = "w-full bg-wow-input border border-wow-border rounded px-2.5 py-1.5 text-sm text-white focus:outline-none cursor-pointer";

  updateTierCheckboxVisibility(null);
  populateIlvlDropdown('hero', 305, 'head');

  const idInput = document.getElementById('item-wowhead-id');
  idInput.value = '';
  idInput.readOnly = true;
  idInput.className = "w-full bg-black/50 border border-wow-border/50 rounded px-2.5 py-1.5 text-sm text-slate-300 cursor-not-allowed select-none font-mono focus:outline-none";

  ['item-mastery', 'item-crit', 'item-haste', 'item-vers'].forEach(sId => {
    const el = document.getElementById(sId);
    if (el) {
      el.value = 0;
      el.readOnly = false;
      el.className = "w-full bg-wow-input border border-wow-border rounded px-2 py-1 text-sm text-white text-center font-bold";
    }
  });

  document.getElementById('item-tier').checked = false;
  document.getElementById('item-socket').checked = false;
  const vaultEl = document.getElementById('item-vault');
  if (vaultEl) vaultEl.checked = false;
  updateItemModalStatSum();
  document.getElementById('item-modal').classList.remove('hidden');
}

function editItem(id) {
  const it = items.find(x => x.id === id);
  if (!it) return;

  if (!it.baseIlvl) {
    it.baseIlvl = it.ilvl || 305;
    it.baseMastery = (it.baseMastery !== undefined) ? it.baseMastery : (it.mastery || 0);
    it.baseCrit = (it.baseCrit !== undefined) ? it.baseCrit : (it.crit || 0);
    it.baseHaste = (it.baseHaste !== undefined) ? it.baseHaste : (it.haste || 0);
    it.baseVers = (it.baseVers !== undefined) ? it.baseVers : (it.vers || 0);
  }

  document.getElementById('modal-title').innerText = t('editItemModalTitle', 'Editar Objeto');
  document.getElementById('edit-item-id').value = it.id;

  const lookupBox = document.getElementById('wowhead-lookup-box');
  if (lookupBox) lookupBox.classList.add('hidden');

  const nameInput = document.getElementById('item-name');
  nameInput.value = it.name;
  nameInput.readOnly = true;
  nameInput.className = "w-full bg-black/50 border border-wow-border/50 rounded px-3 py-1.5 text-sm text-slate-400 cursor-not-allowed select-none";

  const slotSelect = document.getElementById('item-slot');
  slotSelect.value = it.slot;
  slotSelect.disabled = true;
  slotSelect.className = "w-full bg-black/50 border border-wow-border/50 rounded px-2.5 py-1.5 text-sm text-slate-400 cursor-not-allowed select-none";

  const idInput = document.getElementById('item-wowhead-id');
  idInput.value = it.itemId || '';
  idInput.readOnly = true;
  idInput.className = "w-full bg-black/50 border border-wow-border/50 rounded px-2.5 py-1.5 text-sm text-slate-400 cursor-not-allowed select-none font-mono";

  document.getElementById('item-mastery').value = it.mastery || 0;
  document.getElementById('item-crit').value = it.crit || 0;
  document.getElementById('item-haste').value = it.haste || 0;
  document.getElementById('item-vers').value = it.vers || 0;

  const trackSelect = document.getElementById('item-track');
  const itemTrack = it.track || 'hero';
  trackSelect.value = MIDNIGHT_UPGRADE_TRACKS[itemTrack] ? itemTrack : 'hero';
  trackSelect.className = "w-full bg-wow-input border border-amber-400/60 rounded px-2.5 py-1.5 text-sm text-amber-300 font-bold focus:outline-none";

  updateTierCheckboxVisibility(it.slot);
  populateIlvlDropdown(trackSelect.value, it.ilvl, it.slot);

  document.getElementById('item-tier').checked = !!(it.tier && TIER_ELIGIBLE_SLOTS.includes(it.slot));
  document.getElementById('item-socket').checked = !!it.socket;
  const editVaultEl = document.getElementById('item-vault');
  if (editVaultEl) editVaultEl.checked = !!it.isVault;

  updateItemModalStatSum();
  document.getElementById('item-modal').classList.remove('hidden');
}

function closeItemModal() {
  document.getElementById('item-modal').classList.add('hidden');
}

function saveItem(e) {
  e.preventDefault();
  const id = document.getElementById('edit-item-id').value || ('item_' + Date.now());
  const slot = document.getElementById('item-slot').value || 'head';
  const customId = parseInt(document.getElementById('item-wowhead-id').value) || 0;
  const name = document.getElementById('item-name').value.trim();
  const ilvl = parseInt(document.getElementById('item-ilvl').value) || 305;
  const track = document.getElementById('item-track').value;
  const mastery = parseInt(document.getElementById('item-mastery').value) || 0;
  const crit = parseInt(document.getElementById('item-crit').value) || 0;
  const haste = parseInt(document.getElementById('item-haste').value) || 0;
  const vers = parseInt(document.getElementById('item-vers').value) || 0;
  const isTierEligible = TIER_ELIGIBLE_SLOTS.includes(slot);
  const tier = isTierEligible ? document.getElementById('item-tier').checked : false;
  const socket = document.getElementById('item-socket').checked;
  const isVault = document.getElementById('item-vault')?.checked || false;

  const existingIdx = items.findIndex(x => x.id === id);
  if (existingIdx >= 0) {
    const it = items[existingIdx];
    it.ilvl = ilvl;
    it.track = track;
    it.mastery = mastery;
    it.crit = crit;
    it.haste = haste;
    it.vers = vers;
    it.tier = tier;
    it.socket = socket;
    it.isVault = isVault;
  } else {
    if (!name && !customId) {
      showToast('Pega un enlace o ID de Wowhead para cargar el objeto', 'error');
      return;
    }

    const fallbackIcon = (customId && metadataCache[customId]?.icon) || currentModalBaseStats.icon || (customId && window.BLOODMALLET_ITEM_ICONS && window.BLOODMALLET_ITEM_ICONS[customId]) || SLOT_FALLBACK_ICONS[slot] || 'inv_misc_questionmark';
    const itemArmorType = currentModalBaseStats.armorType || detectArmorTypeFromTooltipHtml('', name);

    const newItem = {
      id,
      name: name || `Objeto ${customId || 'Personalizado'}`,
      itemId: customId || 0,
      ilvl,
      baseIlvl: currentModalBaseStats.baseIlvl || ilvl,
      baseMastery: currentModalBaseStats.mastery !== undefined ? currentModalBaseStats.mastery : mastery,
      baseCrit: currentModalBaseStats.crit !== undefined ? currentModalBaseStats.crit : crit,
      baseHaste: currentModalBaseStats.haste !== undefined ? currentModalBaseStats.haste : haste,
      baseVers: currentModalBaseStats.vers !== undefined ? currentModalBaseStats.vers : vers,
      slot,
      armorType: itemArmorType,
      track,
      icon: fallbackIcon,
      crit,
      haste,
      mastery,
      vers,
      tier,
      socket,
      isVault,
      isBag: true
    };
    items.push(newItem);
  }

  saveState();
  renderInventory();
  closeItemModal();
  if (items.length > 0) {
    runOptimizer();
  }
  showToast(existingIdx >= 0 ? t('toastItemSaved', 'Objeto guardado con éxito') : t('toastItemSaved', '¡Objeto añadido al inventario!'), 'info');
}
