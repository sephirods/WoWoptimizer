// Optimization Combinatorial Engine & Smart Gem Solver


// SMART GEM RECOMMENDATION ENGINE WITH AUTHENTIC WOWHEAD GEMS & TOOLTIPS
function calculateSmartGemRecommendations(itemsInSet, targets, baseStats) {
  const socketedItems = itemsInSet.filter(it => it.socket);
  const socketCount = socketedItems.length;
  if (socketCount === 0) return { recommendations: [], projected: baseStats };

  const defMast = Math.max(0, targets.targetMastery - baseStats.totMast);
  const defCrit = Math.max(0, targets.targetCrit - baseStats.totCrit);
  const defHaste = Math.max(0, targets.targetHaste - baseStats.totHaste);
  const defVers = Math.max(0, targets.targetVers - baseStats.totVers);

  let addCrit = 0;
  let addHaste = 0;
  let addMast = 0;
  let addVers = 0;

  const recommendations = [];
  let metaAssigned = false;

  // Assign unique Thalassian Meta Diamond to Neck if socketed, otherwise first socketed item
  const neckSocketItem = socketedItems.find(it => it.slot === 'neck' || it.metaSocket || it.slot === 'meta_gem');
  const metaTargetItem = neckSocketItem || socketedItems[0];

  socketedItems.forEach(it => {
    if (!metaAssigned && it === metaTargetItem) {
      metaAssigned = true;
      const meta = MIDNIGHT_GEMS_CATALOG.meta_indecipherable;
      recommendations.push({
        item: it,
        gemItemId: meta.id,
        gemName: meta.name,
        gemIcon: meta.icon,
        gemDesc: meta.desc,
        benefit: 'Gema de Estadística Principal de Medianoche (Thalassian Diamond).'
      });
      return;
    }

    const deficits = [
      { stat: 'crit', val: defCrit - addCrit, name: 'Crítico' },
      { stat: 'haste', val: defHaste - addHaste, name: 'Celeridad' },
      { stat: 'mast', val: defMast - addMast, name: 'Maestría' },
      { stat: 'vers', val: defVers - addVers, name: 'Versatilidad' }
    ].sort((a, b) => b.val - a.val);

    const primaryStat = deficits[0];
    const secondaryStat = deficits[1] || deficits[0];

    let chosenGem = null;
    const usePure = (secondaryStat.val <= 0 && primaryStat.val > 0);

    if (usePure) {
      const pureKey = `pure_${primaryStat.stat}`;
      chosenGem = MIDNIGHT_GEMS_CATALOG[pureKey] || MIDNIGHT_GEMS_CATALOG.pure_crit;
      
      if (primaryStat.stat === 'crit') addCrit += 20;
      else if (primaryStat.stat === 'haste') addHaste += 20;
      else if (primaryStat.stat === 'mast') addMast += 20;
      else if (primaryStat.stat === 'vers') addVers += 20;
    } else {
      const hybridKey = `${primaryStat.stat}_${secondaryStat.stat}`;
      chosenGem = MIDNIGHT_GEMS_CATALOG[hybridKey] || MIDNIGHT_GEMS_CATALOG[`pure_${primaryStat.stat}`] || MIDNIGHT_GEMS_CATALOG.crit_haste;

      if (primaryStat.stat === 'mast') addMast += 16;
      else if (primaryStat.stat === 'crit') addCrit += 16;
      else if (primaryStat.stat === 'haste') addHaste += 16;
      else if (primaryStat.stat === 'vers') addVers += 16;
      
      if (secondaryStat.stat === 'mast') addMast += 7;
      else if (secondaryStat.stat === 'crit') addCrit += 7;
      else if (secondaryStat.stat === 'haste') addHaste += 7;
      else if (secondaryStat.stat === 'vers') addVers += 7;
    }

    recommendations.push({
      item: it,
      gemItemId: chosenGem.id,
      gemName: chosenGem.name,
      gemIcon: chosenGem.icon,
      gemDesc: chosenGem.desc,
      benefit: usePure ? `Cubre el déficit faltante de ${primaryStat.name} con gema pura (+20).` : `Maximiza estadísticas (+23 total) balanceando ${primaryStat.name} (+16) y ${secondaryStat.name} (+7).`
    });
  });

  const projected = {
    totCrit: baseStats.totCrit + addCrit,
    totHaste: baseStats.totHaste + addHaste,
    totMast: baseStats.totMast + addMast,
    totVers: baseStats.totVers + addVers
  };

  return { recommendations, projected };
}

function onCalculateBtnClick() {
  const btn = document.getElementById('btn-run-optimizer');
  const btnText = document.getElementById('btn-calc-text');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('opacity-80', 'ring-2', 'ring-amber-300');
    if (btnText) btnText.innerText = 'Calculando...';
  }
  
  setTimeout(() => {
    runOptimizer(true);
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-80', 'ring-2', 'ring-amber-300');
      if (btnText) btnText.innerText = 'Calcular Mejor Combinación';
    }
    const container = document.getElementById('results-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 40);
}

// Optimization Algorithm Engine (High-Performance Zero-Heap DFS)
function runOptimizer(isManualClick = false) {
  const targetMastery = parseInt(document.getElementById('target-mastery')?.value) || 0;
  const targetCrit = parseInt(document.getElementById('target-crit')?.value) || 0;
  const targetHaste = parseInt(document.getElementById('target-haste')?.value) || 0;
  const targetVers = parseInt(document.getElementById('target-vers')?.value) || 0;
  const weaponMode = document.getElementById('weapon-mode')?.value || '2h';
  const tierMode = document.getElementById('tier-mode')?.value ?? '4';

  // Weights
  const wMast = parseFloat(document.getElementById('weight-mastery')?.value) || 1.0;
  const wCrit = parseFloat(document.getElementById('weight-crit')?.value) || 1.0;
  const wHaste = parseFloat(document.getElementById('weight-haste')?.value) || 1.0;
  const wVers = parseFloat(document.getElementById('weight-vers')?.value) || 1.0;

  // Track filters
  const allowMyth = document.getElementById('track-myth')?.checked ?? true;
  const allowHero = document.getElementById('track-hero')?.checked ?? true;
  const allowChamp = document.getElementById('track-champ')?.checked ?? true;
  const allowVet = document.getElementById('track-vet')?.checked ?? true;
  const minIlvl = parseInt(document.getElementById('filter-min-ilvl')?.value) || 0;
  const simMaxIlvl = document.getElementById('toggle-max-ilvl')?.checked ?? false;
  const simVaultAutoScale = document.getElementById('toggle-vault-auto-scale')?.checked ?? true;
  const simVenomstone = document.getElementById('toggle-venomstone')?.checked ?? false;

  const t0 = performance.now();
  let combinationsEvaluated = 0;

  // Filter active items (and scale stats if toggle-max-ilvl, toggle-vault-auto-scale, or toggle-venomstone is active)
  const activeItems = (typeof items !== 'undefined' ? items : []).filter(it => {
    if (it.disabled) return false;
    if (!isItemUsableBySpec(it, currentClass, currentSpec)) return false;
    if (minIlvl > 0 && (it.ilvl || 0) < minIlvl) return false;
    const track = it.track || 'hero';
    if (track === 'myth' && !allowMyth) return false;
    if (track === 'hero' && !allowHero) return false;
    if (track === 'champ' && !allowChamp) return false;
    if ((track === 'vet' || track === 'crafted') && !allowVet) return false;
    return true;
  }).map(it => {
    const isCrafted = isItemCrafted(it);
    const canUseVenom = simVenomstone && isSlotEligibleForVenomstone(it.slot);
    let targetIlvl = (simMaxIlvl || simVenomstone) ? getMaxIlvlForTrack(it.track, it.ilvl, canUseVenom, isCrafted) : (it.ilvl || 0);

    if (!simMaxIlvl && !simVenomstone && simVaultAutoScale && it.isVault) {
      const allItemsList = typeof items !== 'undefined' ? items : [];
      const highestOwned = getHighestOwnedIlvlForSlot(it.slot, allItemsList);
      const trackMax = getMaxIlvlForTrack(it.track, it.ilvl, false, isCrafted);
      if (highestOwned > 0) {
        targetIlvl = Math.max(it.ilvl || 0, Math.min(highestOwned, trackMax));
      }
    }

    if (targetIlvl > (it.ilvl || 0)) {
      const baseIlvl = it.baseIlvl || it.ilvl || 321;
      const baseM = (it.baseMastery !== undefined) ? it.baseMastery : (it.mastery || 0);
      const baseC = (it.baseCrit !== undefined) ? it.baseCrit : (it.crit || 0);
      const baseH = (it.baseHaste !== undefined) ? it.baseHaste : (it.haste || 0);
      const baseV = (it.baseVers !== undefined) ? it.baseVers : (it.vers || 0);

      return {
        ...it,
        ilvl: targetIlvl,
        mastery: scaleStatByIlvl(baseM, baseIlvl, targetIlvl),
        crit: scaleStatByIlvl(baseC, baseIlvl, targetIlvl),
        haste: scaleStatByIlvl(baseH, baseIlvl, targetIlvl),
        vers: scaleStatByIlvl(baseV, baseIlvl, targetIlvl),
        isMaxScaled: !canUseVenom && simMaxIlvl,
        isVenomstoneScaled: canUseVenom,
        isVaultScaled: !simMaxIlvl && !simVenomstone && simVaultAutoScale && !!it.isVault,
        originalIlvl: it.ilvl
      };
    }
    return it;
  });

  const lockedItems = activeItems.filter(it => it.locked);
  const lockedIds = new Set(lockedItems.map(it => it.id));
  const lockedTierCount = lockedItems.filter(it => it.tier).length;

  // Minimum Tier Pieces Constraint (0+, 2+, 4+)
  const minTier = (tierMode === '4') ? 4 : (tierMode === '2') ? 2 : 0;

  const bySlot = {
    head: activeItems.filter(x => x.slot === 'head'),
    shoulder: activeItems.filter(x => x.slot === 'shoulder'),
    chest: activeItems.filter(x => x.slot === 'chest'),
    back: activeItems.filter(x => x.slot === 'back'),
    wrist: activeItems.filter(x => x.slot === 'wrist'),
    hands: activeItems.filter(x => x.slot === 'hands'),
    waist: activeItems.filter(x => x.slot === 'waist'),
    legs: activeItems.filter(x => x.slot === 'legs'),
    feet: activeItems.filter(x => x.slot === 'feet'),
    neck: activeItems.filter(x => x.slot === 'neck'),
    finger: activeItems.filter(x => x.slot === 'finger'),
    trinket: activeItems.filter(x => x.slot === 'trinket')
  };

  // Weapons
  let weaponsCombos = [];
  if (weaponMode === '2h') {
    const w2h = activeItems.filter(x => x.slot === 'weapon_2h');
    weaponsCombos = w2h.map(w => [w]);
  } else if (weaponMode === '1h_shield') {
    const w1h = activeItems.filter(x => x.slot === 'weapon_1h');
    const shields = activeItems.filter(x => x.slot === 'shield');
    for (const w of w1h) {
      for (const sh of shields) {
        weaponsCombos.push([w, sh]);
      }
    }
  } else {
    // Dual Wield
    const w1h = activeItems.filter(x => x.slot === 'weapon_1h');
    if (w1h.length === 1) {
      weaponsCombos.push([w1h[0], w1h[0]]);
    } else {
      for (let i = 0; i < w1h.length; i++) {
        for (let j = i + 1; j < w1h.length; j++) {
          weaponsCombos.push([w1h[i], w1h[j]]);
        }
      }
    }
  }
  if (weaponsCombos.length === 0) weaponsCombos = [[]];

  const isSameUniqueItem = (a, b) => {
    if (!a || !b) return false;
    if (a.id && b.id && a.id === b.id) return true;
    if (a.itemId && b.itemId && a.itemId === b.itemId) return true;
    if (a.name && b.name && a.name.trim().toLowerCase() === b.name.trim().toLowerCase()) return true;
    return false;
  };

  // Rings
  const ringCombos = [];
  if (bySlot.finger.length === 1) {
    ringCombos.push([bySlot.finger[0]]);
  } else {
    for (let i = 0; i < bySlot.finger.length; i++) {
      for (let j = i + 1; j < bySlot.finger.length; j++) {
        if (!isSameUniqueItem(bySlot.finger[i], bySlot.finger[j])) {
          ringCombos.push([bySlot.finger[i], bySlot.finger[j]]);
        }
      }
    }
  }
  if (ringCombos.length === 0 && bySlot.finger.length > 0) ringCombos.push([bySlot.finger[0]]);
  if (ringCombos.length === 0) ringCombos.push([]);

  // Trinkets (Strict Bloodmallet DPS Ranking Priority & Unique Item Validation)
  const useBloodmallet = document.getElementById('use-bloodmallet-scoring')?.checked ?? true;
  let trinketPool = [...bySlot.trinket];
  if (trinketPool.length > 1) {
    trinketPool.sort((a, b) => {
      if (a.locked !== b.locked) return a.locked ? -1 : 1;
      if (useBloodmallet) {
        const scoreB = getTrinketDpsScore(b, currentClass, currentSpec);
        const scoreA = getTrinketDpsScore(a, currentClass, currentSpec);
        if (scoreB !== scoreA) return scoreB - scoreA;
      }
      return (b.ilvl || 0) - (a.ilvl || 0);
    });
  }

  const trinketCombos = [];
  if (trinketPool.length === 1) {
    trinketCombos.push([trinketPool[0]]);
  } else if (trinketPool.length >= 2) {
    const lockedTrinkets = trinketPool.filter(t => t.locked);
    if (lockedTrinkets.length >= 2) {
      if (!isSameUniqueItem(lockedTrinkets[0], lockedTrinkets[1])) {
        trinketCombos.push([lockedTrinkets[0], lockedTrinkets[1]]);
      } else {
        trinketCombos.push([lockedTrinkets[0]]);
      }
    } else if (lockedTrinkets.length === 1) {
      const others = trinketPool.filter(t => !isSameUniqueItem(lockedTrinkets[0], t));
      if (others.length > 0) {
        others.forEach(oth => trinketCombos.push([lockedTrinkets[0], oth]));
      } else {
        trinketCombos.push([lockedTrinkets[0]]);
      }
    } else if (useBloodmallet) {
      const t1 = trinketPool[0];
      const validSeconds = trinketPool.slice(1).filter(t2 => !isSameUniqueItem(t1, t2));
      if (validSeconds.length > 0) {
        trinketCombos.push([t1, validSeconds[0]]);
        if (validSeconds.length > 1) {
          trinketCombos.push([t1, validSeconds[1]]);
        }
      } else {
        trinketCombos.push([t1]);
      }
    } else {
      for (let i = 0; i < trinketPool.length; i++) {
        for (let j = i + 1; j < trinketPool.length; j++) {
          if (!isSameUniqueItem(trinketPool[i], trinketPool[j])) {
            trinketCombos.push([trinketPool[i], trinketPool[j]]);
          }
        }
      }
    }
  }
  if (trinketCombos.length === 0 && trinketPool.length > 0) trinketCombos.push([trinketPool[0]]);
  if (trinketCombos.length === 0) trinketCombos.push([]);

  // Item power scoring helper
  const getItemPowerScore = (it) => {
    if (!it) return 0;
    const ilvl = it.ilvl || 0;
    let slotWeight = 14;
    if (it.slot === 'weapon_2h') {
      slotWeight = 55;
    } else if (it.slot === 'weapon_1h' || it.slot === 'shield' || it.slot === 'offhand') {
      slotWeight = 28;
    } else if (['head', 'chest', 'legs'].includes(it.slot)) {
      slotWeight = 24;
    } else if (['shoulder', 'hands', 'waist', 'feet'].includes(it.slot)) {
      slotWeight = 18;
    } else if (['wrist', 'back'].includes(it.slot)) {
      slotWeight = 14;
    } else if (['finger', 'neck'].includes(it.slot)) {
      slotWeight = 6;
    } else if (it.slot === 'trinket') {
      slotWeight = 18;
    }

    let power = ilvl * slotWeight;
    if (it.socket) power += 50;
    if (it.slot === 'trinket' && typeof getTrinketDpsScore === 'function') {
      const useBm = document.getElementById('use-bloodmallet-scoring')?.checked ?? true;
      if (useBm && currentClass && currentSpec) {
        power += (getTrinketDpsScore(it, currentClass, currentSpec) || 0) * 0.2;
      }
    }
    return power;
  };

  const scoreCandidate = (it) => {
    if (!it) return 0;
    const stats = (it.mastery || 0) * wMast + (it.crit || 0) * wCrit + (it.haste || 0) * wHaste + (it.vers || 0) * wVers;
    return getItemPowerScore(it) + stats;
  };

  weaponsCombos.sort((a, b) => {
    const sA = a.reduce((sum, item) => sum + scoreCandidate(item), 0);
    const sB = b.reduce((sum, item) => sum + scoreCandidate(item), 0);
    return sB - sA;
  });

  ringCombos.sort((a, b) => {
    const sA = a.reduce((sum, item) => sum + scoreCandidate(item), 0);
    const sB = b.reduce((sum, item) => sum + scoreCandidate(item), 0);
    return sB - sA;
  });

  const singleSlots = ['head', 'shoulder', 'chest', 'back', 'wrist', 'hands', 'waist', 'legs', 'feet', 'neck'];
  const tierSlots = new Set(['head', 'shoulder', 'chest', 'hands', 'legs']);

  const slotGroups = singleSlots.map(s => {
    let list = bySlot[s] || [];
    if (list.length === 0) {
      return [[{ 
        id: 'missing_' + s,
        name: (typeof t === 'function' ? `${t('noItemInSlot', 'Sin')} ${typeof getLocalizedSlotName === 'function' ? getLocalizedSlotName(s) : s}` : 'Sin ' + s),
        slot: s, 
        ilvl: '-', 
        crit: 0, 
        haste: 0, 
        mastery: 0, 
        vers: 0, 
        tier: false,
        isMissing: true
      }]];
    }
    
    const lockedInSlot = list.filter(x => x.locked);
    if (lockedInSlot.length > 0) {
      return lockedInSlot.map(it => [it]);
    }

    list.sort((a, b) => {
      if (a.socket !== b.socket) return a.socket ? -1 : 1;
      return scoreCandidate(b) - scoreCandidate(a);
    });
    return list.map(it => [it]);
  });

  slotGroups.push(ringCombos);
  slotGroups.push(trinketCombos);
  slotGroups.push(weaponsCombos);

  const MAX_TOP_RESULTS = 10;
  const topResults = [];
  const currentSelection = new Array(slotGroups.length);

  function explore(depth, curCrit, curHaste, curMast, curVers, curTier, curVault = 0) {
    if (combinationsEvaluated > 40000) return;
    if (curVault > 1) return;

    if (depth === slotGroups.length) {
      combinationsEvaluated++;

      if (curTier < minTier) return;

      if (lockedIds.size > 0) {
        let foundCount = 0;
        for (let i = 0; i < currentSelection.length; i++) {
          const grp = currentSelection[i];
          for (let k = 0; k < grp.length; k++) {
            if (grp[k] && lockedIds.has(grp[k].id)) foundCount++;
          }
        }
        if (foundCount < lockedIds.size) return;
      }

      let totIlvl = 0;
      let totBasePower = 0;
      const resultItems = [];
      for (let i = 0; i < currentSelection.length; i++) {
        const grp = currentSelection[i];
        for (let k = 0; k < grp.length; k++) {
          if (grp[k]) {
            resultItems.push(grp[k]);
            totIlvl += (grp[k].ilvl || 0);
            totBasePower += getItemPowerScore(grp[k]);
          }
        }
      }

      const secValue = (curHaste * wHaste * 1.1) + (curCrit * wCrit * 1.1) + (curMast * wMast * 1.1) + (curVers * wVers * 1.1);

      const diffHaste = curHaste - targetHaste;
      const diffCrit = curCrit - targetCrit;
      const diffMast = curMast - targetMastery;
      const diffVers = curVers - targetVers;

      const penaltyHaste = Math.abs(diffHaste) * wHaste * 0.55;
      const penaltyCrit = Math.abs(diffCrit) * wCrit * 0.55;
      const penaltyMast = Math.abs(diffMast) * wMast * 0.55;
      const penaltyVers = Math.abs(diffVers) * wVers * 0.55;

      const distanceScore = penaltyHaste + penaltyCrit + penaltyMast + penaltyVers;
      const totalScore = totBasePower + secValue - distanceScore;

      const resultObj = {
        items: resultItems,
        totCrit: curCrit,
        totHaste: curHaste,
        totMast: curMast,
        totVers: curVers,
        diffCrit,
        diffHaste,
        diffMast,
        diffVers,
        tierCount: curTier,
        totIlvl,
        avgIlvl: Math.round(totIlvl / resultItems.length),
        distanceScore,
        totalScore
      };

      if (topResults.length < MAX_TOP_RESULTS) {
        topResults.push(resultObj);
        topResults.sort((a, b) => b.totalScore - a.totalScore);
      } else if (totalScore > topResults[topResults.length - 1].totalScore) {
        topResults[topResults.length - 1] = resultObj;
        topResults.sort((a, b) => b.totalScore - a.totalScore);
      }

      return;
    }

    const remainingSlots = slotGroups.length - depth;
    if (curTier + remainingSlots < minTier) return;

    const choices = slotGroups[depth];
    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i];
      currentSelection[depth] = choice;

      let dCrit = 0, dHaste = 0, dMast = 0, dVers = 0, dTier = 0, dVault = 0;
      for (let k = 0; k < choice.length; k++) {
        const it = choice[k];
        if (it) {
          dCrit += (it.crit || 0);
          dHaste += (it.haste || 0);
          dMast += (it.mastery || 0);
          dVers += (it.vers || 0);
          if (it.tier) dTier++;
          if (it.isVault) dVault++;
        }
      }

      if (curVault + dVault > 1) continue;

      explore(depth + 1, curCrit + dCrit, curHaste + dHaste, curMast + dMast, curVers + dVers, curTier + dTier, curVault + dVault);
    }
  }

  explore(0, 0, 0, 0, 0, 0, 0);

  topResults.forEach(res => {
    res.gemData = calculateSmartGemRecommendations(
      res.items,
      { targetMastery, targetCrit, targetHaste, targetVers },
      { totCrit: res.totCrit, totHaste: res.totHaste, totMast: res.totMast, totVers: res.totVers }
    );
  });

  const durationMs = Math.round(performance.now() - t0);
  renderResults(topResults.slice(0, 1), { targetMastery, targetCrit, targetHaste, targetVers }, { count: combinationsEvaluated, duration: durationMs });

  if (isManualClick) {
    showToast(`⚡ ¡Cálculo completado! (${combinationsEvaluated.toLocaleString()} combinaciones en ${durationMs}ms)`, 'info');
  }
}
