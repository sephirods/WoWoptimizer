// Target Configuration Panel, Presets, Hero Trees & Stat Weights
function initClassAndSpecs() {
  const classSelect = document.getElementById('char-class');
  if (classSelect) {
    classSelect.value = currentClass;
    updateClassDropdownOptions();
  }
  updateClassTheme();
  updateSpecDropdown(currentSpec);
}

function updateClassDropdownOptions() {
  const classSelect = document.getElementById('char-class');
  if (!classSelect) return;
  Array.from(classSelect.options).forEach(opt => {
    if (typeof getLocalizedClassName === 'function') {
      opt.innerText = getLocalizedClassName(opt.value);
    }
  });
}

function setContentMode(mode) {
  if (mode !== 'raid' && mode !== 'mplus') mode = 'raid';
  currentContentMode = mode;
  saveState();
  applySpecConfig(currentSpec);
  showToast(mode === 'raid' ? (t('toastModeRaid', '🏛️ Estadísticas: Banda Mítica cargadas')) : (t('toastModeMplus', '🗝️ Estadísticas: Míticas+ (M+) cargadas')), 'info');
  
  // Si la ventana modal de rankings de abalorios está abierta, refrescarla automáticamente
  const bmModal = document.getElementById('bloodmallet-modal');
  if (bmModal && !bmModal.classList.contains('hidden') && typeof renderBloodmalletModalList === 'function') {
    renderBloodmalletModalList();
  }
}

function onClassChange() {
  currentClass = document.getElementById('char-class').value;
  const classData = WOW_CLASSES[currentClass];
  currentSpec = classData ? classData.specs[0].id : 'survival';
  saveState();
  updateClassTheme();
  updateSpecDropdown(currentSpec);
}

function updateClassTheme() {
  const classData = WOW_CLASSES[currentClass];
  if (!classData) return;
  const classSelect = document.getElementById('char-class');
  const avatar = document.getElementById('class-avatar');
  const iconDisplay = document.getElementById('class-icon-display');

  if (classSelect) {
    classSelect.style.color = classData.color;
    classSelect.style.borderColor = `${classData.color}80`;
  }

  if (avatar) {
    avatar.style.borderColor = classData.color;
    avatar.style.backgroundColor = `${classData.color}20`;
    avatar.style.boxShadow = `0 0 12px ${classData.color}30`;
  }
  if (iconDisplay) {
    iconDisplay.className = `fa-solid ${classData.icon} text-xl`;
    iconDisplay.style.color = classData.color;
  }
}

function updateSpecDropdown(preferredSpec = null) {
  const specSelect = document.getElementById('char-spec');
  const classData = WOW_CLASSES[currentClass];
  if (!classData || !specSelect) return;
  specSelect.innerHTML = classData.specs.map(s => {
    const locName = typeof getLocalizedSpecName === 'function' ? getLocalizedSpecName(s.id) : s.name;
    return `<option value="${s.id}">${locName}</option>`;
  }).join('');
  
  const targetSpec = preferredSpec || currentSpec;
  const validSpec = classData.specs.some(s => s.id === targetSpec) ? targetSpec : classData.specs[0].id;
  currentSpec = validSpec;
  specSelect.value = currentSpec;
  onSpecChange();
}

function getUserCustomPresets() {
  try {
    const raw = localStorage.getItem('wow_user_presets');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveUserCustomPreset() {
  const promptMsg = typeof t === 'function' 
    ? t('promptPresetName', 'Nombre para tu preset de estadísticas personalizadas (ej. "Banda Mítica", "M+ AoE"):') 
    : 'Nombre para tu preset de estadísticas personalizadas (ej. "Banda Mítica", "M+ AoE"):';
  const name = prompt(promptMsg);
  if (!name || !name.trim()) return;

  const customPreset = {
    id: 'preset_' + Date.now(),
    name: name.trim(),
    className: currentClass,
    spec: currentSpec,
    m: parseInt(document.getElementById('target-mastery')?.value) || 0,
    c: parseInt(document.getElementById('target-crit')?.value) || 0,
    h: parseInt(document.getElementById('target-haste')?.value) || 0,
    v: parseInt(document.getElementById('target-vers')?.value) || 0,
    wep: document.getElementById('weapon-mode')?.value || '2h',
    tier: document.getElementById('tier-mode')?.value || '4'
  };

  const presets = getUserCustomPresets();
  presets.push(customPreset);
  localStorage.setItem('wow_user_presets', JSON.stringify(presets));
  renderPresetsToolbar();
  const savedMsg = typeof t === 'function' ? t('toastPresetSaved', '¡Preset "%s" guardado con éxito!').replace('%s', customPreset.name) : `Preset "${customPreset.name}" guardado`;
  showToast(savedMsg, 'info');
}

function deleteUserCustomPreset(id, e) {
  if (e) e.stopPropagation();
  let presets = getUserCustomPresets();
  presets = presets.filter(p => p.id !== id);
  localStorage.setItem('wow_user_presets', JSON.stringify(presets));
  renderPresetsToolbar();
  const deletedMsg = typeof t === 'function' ? t('toastPresetDeleted', 'Preset eliminado') : 'Preset eliminado';
  showToast(deletedMsg, 'info');
}

function applyCustomPreset(id) {
  const presets = getUserCustomPresets();
  const p = presets.find(x => x.id === id);
  if (!p) return;

  document.getElementById('target-mastery').value = p.m;
  document.getElementById('target-crit').value = p.c;
  document.getElementById('target-haste').value = p.h;
  document.getElementById('target-vers').value = p.v;
  if (p.wep && document.getElementById('weapon-mode')) document.getElementById('weapon-mode').value = p.wep;
  if (p.tier && document.getElementById('tier-mode')) {
    document.getElementById('tier-mode').value = p.tier;
    const disp = document.getElementById('tier-mode-display');
    if (disp) disp.innerText = p.tier;
  }

  updateTargetDistributionStrip();
  runOptimizer();
  const appliedMsg = typeof t === 'function' ? t('toastPresetApplied', 'Preset "%s" aplicado').replace('%s', p.name) : `Preset "${p.name}" aplicado`;
  showToast(appliedMsg, 'info');
}

function getSpecMetaHeroTree(className, specId) {
  if (window.ARCHON_PRESETS && window.ARCHON_PRESETS[className]) {
    const cp = window.ARCHON_PRESETS[className];
    const specData = cp[specId] || cp[`${specId}_${className}`] || cp[`${className}_${specId}`] ||
                     (specId === 'protection' && (cp['protection_paladin'] || cp['prot_warrior'])) ||
                     (specId === 'holy' && (cp['holy_paladin'] || cp['holy_priest'])) ||
                     (specId === 'frost' && (cp['frost_dk'] || cp['frost_mage'])) ||
                     (specId === 'restoration' && (cp['restoration_druid'] || cp['restoration_shaman']));
    if (specData && specData.metaHeroTree) return specData.metaHeroTree;
  }
  return null;
}

function applyHeroTree(treeId) {
  const classData = WOW_CLASSES[currentClass];
  const specData = classData?.specs.find(s => s.id === currentSpec);
  if (!specData || !specData.heroTrees) return;
  const tree = specData.heroTrees.find(t => t.id === treeId) || specData.heroTrees[0];
  if (!tree) return;

  currentHeroTree = tree.id;
  if (typeof window !== 'undefined') window.currentHeroTree = currentHeroTree;
  const metaTree = getSpecMetaHeroTree(currentClass, currentSpec);
  const isMeta = metaTree ? (tree.id === metaTree || metaTree.includes(tree.id) || tree.id.includes(metaTree)) : (tree === specData.heroTrees[0]);

  let activePreset = null;
  if (window.ARCHON_PRESETS && window.ARCHON_PRESETS[currentClass]) {
    const cp = window.ARCHON_PRESETS[currentClass];
    const sp = cp[specData.id] || cp[`${specData.id}_${currentClass}`] || cp[`${currentClass}_${specData.id}`] ||
               (specData.id === 'protection' && (cp['protection_paladin'] || cp['prot_warrior'])) ||
               (specData.id === 'holy' && (cp['holy_paladin'] || cp['holy_priest'])) ||
               (specData.id === 'frost' && (cp['frost_dk'] || cp['frost_mage'])) ||
               (specData.id === 'restoration' && (cp['restoration_druid'] || cp['restoration_shaman']));
    if (sp) activePreset = sp[currentContentMode] || sp.raid || sp.mplus;
  }
  if (!activePreset) {
    activePreset = (specData.presets && specData.presets[currentContentMode]) 
      ? specData.presets[currentContentMode] 
      : (specData.presets?.raid || specData.presets || { m: 0, c: 0, h: 0, v: 0 });
  }

  if (document.getElementById('target-mastery')) document.getElementById('target-mastery').value = activePreset.m || 0;
  if (document.getElementById('target-crit')) document.getElementById('target-crit').value = activePreset.c || 0;
  if (document.getElementById('target-haste')) document.getElementById('target-haste').value = activePreset.h || 0;
  if (document.getElementById('target-vers')) document.getElementById('target-vers').value = activePreset.v || 0;
  updateTargetDistributionStrip();

  if (isMeta) {
    const specWeights = deriveWeightsFromArchonPreset(activePreset);
    applyWeightPreset(specWeights.m, specWeights.c, specWeights.h, specWeights.v, false);
  } else {
    if (tree.weights) {
      applyWeightPreset(tree.weights.m, tree.weights.c, tree.weights.h, tree.weights.v, false);
    }
  }

  renderPresetsToolbar();
  showToast(isMeta ? `⭐ Árbol META (${tree.name}): Prioridad óptima aplicada` : `🎯 Árbol (${tree.name}): Prioridad recomendada aplicada`, 'info');
  if (typeof runOptimizer === 'function' && items.length > 0) {
    runOptimizer();
  }
}

function renderPresetsToolbar() {
  const presetsDiv = document.getElementById('spec-presets-container');
  if (!presetsDiv) return;

  const classData = WOW_CLASSES[currentClass];
  const specData = classData?.specs.find(s => s.id === currentSpec);
  const customPresets = getUserCustomPresets().filter(p => p.className === currentClass && p.spec === currentSpec);
  const metaTree = getSpecMetaHeroTree(currentClass, currentSpec);

  const modeButtons = `
    <div class="inline-flex rounded-lg p-0.5 bg-black/60 border border-wow-border/80 shadow-inner mr-1">
      <button type="button" onclick="setContentMode('raid')" class="text-xs px-2.5 py-1 rounded-md transition font-bold flex items-center gap-1.5 ${currentContentMode === 'raid' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}">
        <span>🏛️</span> ${t('raidMythic', 'Banda Mítica')}
      </button>
      <button type="button" onclick="setContentMode('mplus')" class="text-xs px-2.5 py-1 rounded-md transition font-bold flex items-center gap-1.5 ${currentContentMode === 'mplus' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}">
        <span>🗝️</span> ${t('mplus', 'M+ (Míticas+)')}
      </button>
    </div>
  `;

  const specButtons = classData.specs.map(s => {
    const locName = typeof getLocalizedSpecName === 'function' ? getLocalizedSpecName(s.id) : s.name;
    return `
    <button type="button" onclick="applySpecConfig('${s.id}')" class="text-xs px-2.5 py-1 rounded-md transition font-medium border ${s.id === currentSpec ? 'bg-amber-500 text-black border-amber-400 font-bold shadow' : 'bg-black/40 text-slate-300 border-wow-border hover:text-white'}">
      ${locName.split(' ')[0]}
    </button>
  `;
  }).join('');

  const heroButtons = (specData?.heroTrees && specData.heroTrees.length > 0) ? `
    <div class="inline-flex rounded-lg p-0.5 bg-purple-950/70 border border-purple-500/50 shadow-inner mr-1">
      <span class="text-[10px] text-purple-300 font-bold px-1.5 self-center">${t('heroTreeLabel', 'Árbol Héroe:')}</span>
      ${specData.heroTrees.map(ht => {
        const isMeta = metaTree ? (ht.id === metaTree || metaTree.includes(ht.id) || ht.id.includes(metaTree)) : (ht === specData.heroTrees[0]);
        const isSelected = (currentHeroTree === ht.id) || (!currentHeroTree && isMeta);
        const locHeroName = typeof getLocalizedHeroTreeName === 'function' ? getLocalizedHeroTreeName(ht.id, ht.name) : ht.name;
        return `
          <button type="button" onclick="applyHeroTree('${ht.id}')" class="text-xs px-2 py-0.5 rounded-md transition font-bold flex items-center gap-1 ${isSelected ? (isMeta ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md' : 'bg-purple-600 text-white shadow-md') : 'text-slate-300 hover:text-white hover:bg-white/10'}">
            <span>${locHeroName}</span>
            ${isMeta ? '<span class="text-[8px] px-1 py-0.2 rounded font-black bg-black/50 text-amber-200 border border-amber-300/40">META</span>' : ''}
          </button>
        `;
      }).join('')}
    </div>
  ` : '';

  const customButtons = customPresets.map(cp => `
    <span class="inline-flex items-center gap-1 bg-purple-950/60 border border-purple-500/50 rounded-md px-2 py-0.5 text-xs text-purple-200">
      <button type="button" onclick="applyCustomPreset('${cp.id}')" class="font-bold hover:text-white">${cp.name}</button>
      <button type="button" onclick="deleteUserCustomPreset('${cp.id}', event)" class="text-slate-400 hover:text-red-400 text-[10px] ml-0.5">×</button>
    </span>
  `).join('');

  presetsDiv.innerHTML = `
    <div class="flex items-center justify-center md:justify-end gap-1.5 flex-wrap w-full">
      ${modeButtons}
      ${specButtons}
      ${heroButtons}
      ${customButtons}
      <button type="button" onclick="saveUserCustomPreset()" class="text-xs px-2 py-1 rounded bg-black/60 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-1" title="${t('savePresetTitle', 'Guardar configuración actual como preset personalizado')}">
        <i class="fa-solid fa-bookmark text-[10px]"></i> ${t('addPreset', '+ Preset')}
      </button>
    </div>
  `;
}

function onSpecChange() {
  const specSelect = document.getElementById('char-spec');
  if (specSelect) currentSpec = specSelect.value;
  const classData = WOW_CLASSES[currentClass];
  const specData = classData ? (classData.specs.find(s => s.id === currentSpec) || classData.specs[0]) : null;
  if (!specData) return;

  const titleEl = document.getElementById('current-spec-title');
  if (titleEl) {
    const locName = typeof getLocalizedSpecName === 'function' ? getLocalizedSpecName(specData.id) : specData.name;
    titleEl.innerText = locName;
    titleEl.style.color = classData.color;
  }

  const wepSelect = document.getElementById('weapon-mode');
  if (wepSelect && specData.allowedWeps) {
    const currentVal = wepSelect.value || specData.defaultWep;
    wepSelect.innerHTML = specData.allowedWeps.map(w => {
      const locLabel = typeof getLocalizedWeaponMode === 'function' ? getLocalizedWeaponMode(w.id, w.label) : w.label;
      return `<option value="${w.id}">${locLabel}</option>`;
    }).join('');
    wepSelect.value = currentVal;
  }
  
  saveState();
  renderPresetsToolbar();
  applySpecConfig(currentSpec);
}

function updateTargetDistributionStrip() {
  const mast = parseInt(document.getElementById('target-mastery')?.value) || 0;
  const crit = parseInt(document.getElementById('target-crit')?.value) || 0;
  const haste = parseInt(document.getElementById('target-haste')?.value) || 0;
  const vers = parseInt(document.getElementById('target-vers')?.value) || 0;

  const total = mast + crit + haste + vers;
  const totalEl = document.getElementById('target-total-pts');
  if (totalEl) totalEl.innerText = total.toLocaleString();

  const isEs = (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'mx'));
  if (document.getElementById('label-ratio-mast')) document.getElementById('label-ratio-mast').innerText = isEs ? 'Maest' : 'Mast';
  if (document.getElementById('label-ratio-crit')) document.getElementById('label-ratio-crit').innerText = 'Crit';
  if (document.getElementById('label-ratio-haste')) document.getElementById('label-ratio-haste').innerText = isEs ? 'Cele' : 'Haste';
  if (document.getElementById('label-ratio-vers')) document.getElementById('label-ratio-vers').innerText = 'Vers';

  if (total > 0) {
    const mastPct = ((mast / total) * 100).toFixed(1);
    const critPct = ((crit / total) * 100).toFixed(1);
    const hastePct = ((haste / total) * 100).toFixed(1);
    const versPct = Math.max(0, 100 - (parseFloat(mastPct) + parseFloat(critPct) + parseFloat(hastePct))).toFixed(1);

    if (document.getElementById('ratio-mast')) document.getElementById('ratio-mast').innerText = `${mastPct}%`;
    if (document.getElementById('ratio-crit')) document.getElementById('ratio-crit').innerText = `${critPct}%`;
    if (document.getElementById('ratio-haste')) document.getElementById('ratio-haste').innerText = `${hastePct}%`;
    if (document.getElementById('ratio-vers')) document.getElementById('ratio-vers').innerText = `${versPct}%`;
  }
}

function adjustTarget(statId, delta) {
  const el = document.getElementById(statId);
  if (el) {
    const cur = parseInt(el.value) || 0;
    el.value = Math.max(0, cur + delta);
    updateTargetDistributionStrip();
  }
}

function deriveWeightsFromArchonPreset(preset) {
  if (!preset) return { m: 1.0, c: 1.0, h: 1.0, v: 1.0 };
  const entries = [
    { stat: 'm', val: Number(preset.m) || 0 },
    { stat: 'c', val: Number(preset.c) || 0 },
    { stat: 'h', val: Number(preset.h) || 0 },
    { stat: 'v', val: Number(preset.v) || 0 }
  ];
  entries.sort((a, b) => b.val - a.val);
  const tiers = [1.6, 1.3, 1.1, 0.7];
  const result = {};
  entries.forEach((item, idx) => {
    result[item.stat] = tiers[idx];
  });
  return result;
}

function applySpecConfig(specId, autoAdjustWeights = true) {
  const classData = WOW_CLASSES[currentClass];
  const specData = classData.specs.find(s => s.id === specId) || classData.specs[0];
  if (!specData) return;

  currentSpec = specData.id;
  const metaTree = getSpecMetaHeroTree(currentClass, specData.id);
  currentHeroTree = metaTree || specData.heroTrees?.[0]?.id || null;

  let activePreset = null;
  if (window.ARCHON_PRESETS && window.ARCHON_PRESETS[currentClass]) {
    const cPresets = window.ARCHON_PRESETS[currentClass];
    const specPreset = cPresets[specData.id] || 
                       cPresets[`${specData.id}_${currentClass}`] || 
                       cPresets[`${currentClass}_${specData.id}`] ||
                       (specData.id === 'protection' && (cPresets['protection_paladin'] || cPresets['prot_warrior'])) ||
                       (specData.id === 'holy' && (cPresets['holy_paladin'] || cPresets['holy_priest'])) ||
                       (specData.id === 'frost' && (cPresets['frost_dk'] || cPresets['frost_mage'])) ||
                       (specData.id === 'restoration' && (cPresets['restoration_druid'] || cPresets['restoration_shaman']));
    if (specPreset) {
      activePreset = specPreset[currentContentMode] || specPreset.raid || specPreset.mplus;
    }
  }
  if (!activePreset) {
    activePreset = (specData.presets && specData.presets[currentContentMode]) 
      ? specData.presets[currentContentMode] 
      : (specData.presets?.raid || specData.presets || { m: 0, c: 0, h: 0, v: 0 });
  }

  if (document.getElementById('target-mastery')) document.getElementById('target-mastery').value = activePreset.m || 0;
  if (document.getElementById('target-crit')) document.getElementById('target-crit').value = activePreset.c || 0;
  if (document.getElementById('target-haste')) document.getElementById('target-haste').value = activePreset.h || 0;
  if (document.getElementById('target-vers')) document.getElementById('target-vers').value = activePreset.v || 0;
  if (document.getElementById('weapon-mode') && specData.defaultWep) {
    document.getElementById('weapon-mode').value = specData.defaultWep;
  }

  if (autoAdjustWeights) {
    const specWeights = deriveWeightsFromArchonPreset(activePreset) || (typeof SPEC_DEFAULT_STAT_WEIGHTS !== 'undefined' ? SPEC_DEFAULT_STAT_WEIGHTS[specData.id] : null) || { m: 1.0, c: 1.0, h: 1.0, v: 1.0 };
    applyWeightPreset(specWeights.m, specWeights.c, specWeights.h, specWeights.v, false);
  }

  if (document.getElementById('char-spec')) document.getElementById('char-spec').value = specData.id;
  if (document.getElementById('current-spec-title')) {
    document.getElementById('current-spec-title').innerText = specData.name;
    document.getElementById('current-spec-title').style.color = classData.color;
  }

  renderPresetsToolbar();
  updateTargetDistributionStrip();
  if (typeof runOptimizer === 'function' && items.length > 0) {
    runOptimizer();
  }
}

function applyWeightPreset(mast, crit, haste, vers, showFeedback = true) {
  const elM = document.getElementById('weight-mastery');
  const elC = document.getElementById('weight-crit');
  const elH = document.getElementById('weight-haste');
  const elV = document.getElementById('weight-vers');

  const numM = parseFloat(mast) || 1.0;
  const numC = parseFloat(crit) || 1.0;
  const numH = parseFloat(haste) || 1.0;
  const numV = parseFloat(vers) || 1.0;

  if (elM) elM.value = numM;
  if (elC) elC.value = numC;
  if (elH) elH.value = numH;
  if (elV) elV.value = numV;

  if (document.getElementById('label-w-mast')) document.getElementById('label-w-mast').innerText = numM.toFixed(1);
  if (document.getElementById('label-w-crit')) document.getElementById('label-w-crit').innerText = numC.toFixed(1);
  if (document.getElementById('label-w-haste')) document.getElementById('label-w-haste').innerText = numH.toFixed(1);
  if (document.getElementById('label-w-vers')) document.getElementById('label-w-vers').innerText = numV.toFixed(1);

  if (showFeedback) {
    const isEs = (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'mx'));
    showToast(isEs ? 'Ponderaciones actualizadas (pulsa Calcular para aplicar)' : 'Weights updated (click Calculate to apply)');
  }
}

function resetWeightsToCurrentSpec() {
  const classData = WOW_CLASSES[currentClass];
  const specData = classData?.specs?.find(s => s.id === currentSpec) || classData?.specs?.[0];
  if (!specData) return;

  let activePreset = null;
  if (window.ARCHON_PRESETS && window.ARCHON_PRESETS[currentClass]) {
    const cPresets = window.ARCHON_PRESETS[currentClass];
    const specPreset = cPresets[specData.id] || 
                       cPresets[`${specData.id}_${currentClass}`] || 
                       cPresets[`${currentClass}_${specData.id}`] ||
                       (specData.id === 'protection' && (cPresets['protection_paladin'] || cPresets['prot_warrior'])) ||
                       (specData.id === 'holy' && (cPresets['holy_paladin'] || cPresets['holy_priest'])) ||
                       (specData.id === 'frost' && (cPresets['frost_dk'] || cPresets['frost_mage'])) ||
                       (specData.id === 'restoration' && (cPresets['restoration_druid'] || cPresets['restoration_shaman']));
    if (specPreset) {
      activePreset = specPreset[currentContentMode] || specPreset.raid || specPreset.mplus;
    }
  }
  if (!activePreset) {
    activePreset = (specData.presets && specData.presets[currentContentMode]) 
      ? specData.presets[currentContentMode] 
      : (specData.presets?.raid || specData.presets || { m: 0, c: 0, h: 0, v: 0 });
  }

  const specWeights = deriveWeightsFromArchonPreset(activePreset) || 
                      (typeof SPEC_DEFAULT_STAT_WEIGHTS !== 'undefined' ? SPEC_DEFAULT_STAT_WEIGHTS[specData.id] : null) || 
                      { m: 1.0, c: 1.0, h: 1.0, v: 1.0 };

  applyWeightPreset(specWeights.m, specWeights.c, specWeights.h, specWeights.v, true);
  if (typeof runOptimizer === 'function' && items && items.length > 0) {
    runOptimizer();
  }
}
