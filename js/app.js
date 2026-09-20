// App Initialization, Hash State, LZ Compressor & Global Event Listeners

function loadCustomDatasetsFromStorage() {
  try {
    const customArchon = localStorage.getItem('wow_custom_archon_data');
    if (customArchon) {
      window.ARCHON_PRESETS = JSON.parse(customArchon);
    }
  } catch (e) {
    console.warn('Error cargando archon personalizado:', e);
  }

  try {
    const customArchonHealers = localStorage.getItem('wow_custom_archon_healers');
    if (customArchonHealers) {
      window.ARCHON_HEALER_TRINKETS = JSON.parse(customArchonHealers);
    }
  } catch (e) {
    console.warn('Error cargando abalorios healer personalizados:', e);
  }

  try {
    const customWowhead = localStorage.getItem('wow_custom_wowhead_data');
    if (customWowhead) {
      window.WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES = JSON.parse(customWowhead);
    }
  } catch (e) {
    console.warn('Error cargando wowhead personalizado:', e);
  }

  try {
    const customBloodmallet = localStorage.getItem('wow_custom_bloodmallet_data');
    if (customBloodmallet) {
      window.BLOODMALLET_DATA = JSON.parse(customBloodmallet);
    }
  } catch (e) {
    console.warn('Error cargando bloodmallet personalizado:', e);
  }

  try {
    const customStatPriorities = localStorage.getItem('wow_custom_stat_priorities_data');
    if (customStatPriorities) {
      window.WOWHEAD_STAT_PRIORITIES = JSON.parse(customStatPriorities);
    }
  } catch (e) {
    console.warn('Error cargando stat priorities personalizado:', e);
  }
}

// Track Filter Quick Presets
function applyTrackPreset(preset) {
  const mythCb = document.getElementById('track-myth');
  const heroCb = document.getElementById('track-hero');
  const champCb = document.getElementById('track-champ');
  const vetCb = document.getElementById('track-vet');

  if (preset === 'all') {
    if (mythCb) mythCb.checked = true;
    if (heroCb) heroCb.checked = true;
    if (champCb) champCb.checked = true;
    if (vetCb) vetCb.checked = true;
    showToast('Filtro: Todos los tracks activados', 'info');
  } else if (preset === 'myth-hero') {
    if (mythCb) mythCb.checked = true;
    if (heroCb) heroCb.checked = true;
    if (champCb) champCb.checked = false;
    if (vetCb) vetCb.checked = false;
    showToast('Filtro: Solo Mítico y Heroico', 'info');
  } else if (preset === 'myth-only') {
    if (mythCb) mythCb.checked = true;
    if (heroCb) heroCb.checked = false;
    if (champCb) champCb.checked = false;
    if (vetCb) vetCb.checked = false;
    showToast('Filtro: Solo Mítico', 'info');
  }
  runOptimizer();
}

// Reset Data
function resetToDefaultData() {
  if (confirm('¿Restaurar todo el inventario a la base de datos de ejemplo inicial?')) {
    items = [...INITIAL_ITEMS];
    saveState();
    renderInventory();
    runOptimizer();
    showToast('Inventario restaurado a valores por defecto');
  }
}

// Global Keyboard Shortcuts
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof closeItemModal === 'function') closeItemModal();
      if (typeof closeSimcModal === 'function') closeSimcModal();
      if (typeof closeBackupModal === 'function') closeBackupModal();
      if (typeof closeSimcExportModal === 'function') closeSimcExportModal();
      if (typeof closeCompareModal === 'function') closeCompareModal();
      if (typeof closeHelpModal === 'function') closeHelpModal();
      if (typeof closeBloodmalletModal === 'function') closeBloodmalletModal();
      if (typeof closeDevExtractModal === 'function') closeDevExtractModal();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runOptimizer();
      showToast('¡Optimizador ejecutado! (Ctrl+Enter)', 'info');
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      switchTab('inventory');
      const searchInput = document.getElementById('search-inventory');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}

// ==========================================
// LZ-String URL Compression & Share Engine
// ==========================================
const LZCompressor = (function() {
  const f = String.fromCharCode;
  const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
  const baseReverseDic = {};
  function getBaseValue(alphabet, character) {
    if (!baseReverseDic[alphabet]) {
      baseReverseDic[alphabet] = {};
      for (let i = 0; i < alphabet.length; i++) {
        baseReverseDic[alphabet][alphabet.charAt(i)] = i;
      }
    }
    return baseReverseDic[alphabet][character];
  }
  return {
    compress: function(input) {
      if (input == null) return "";
      return LZCompressor._compress(input, 6, function(a) { return keyStrUriSafe.charAt(a); });
    },
    decompress: function(input) {
      if (input == null) return "";
      if (input === "") return null;
      input = input.replace(/ /g, "+");
      return LZCompressor._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
    },
    _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
      if (uncompressed == null) return "";
      let i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0;
      for (let ii = 0; ii < uncompressed.length; ii += 1) {
        context_c = uncompressed.charAt(ii);
        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
          context_dictionary[context_c] = context_dictSize++;
          context_dictionaryToCreate[context_c] = true;
        }
        context_wc = context_w + context_c;
        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
          context_w = context_wc;
        } else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = (context_data_val << 1);
                  if (context_data_position === bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else { context_data_position++; }
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 8; i++) {
                  context_data_val = (context_data_val << 1) | (value & 1);
                  if (context_data_position === bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else { context_data_position++; }
                  value = value >> 1;
                }
              } else {
                value = 1;
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = (context_data_val << 1) | value;
                  if (context_data_position === bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else { context_data_position++; }
                  value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 16; i++) {
                  context_data_val = (context_data_val << 1) | (value & 1);
                  if (context_data_position === bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else { context_data_position++; }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn === 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];
              for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position === bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else { context_data_position++; }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn === 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            context_dictionary[context_wc] = context_dictSize++;
            context_w = String(context_c);
          }
        }
        if (context_w !== "") {
          if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0) < 256) {
              for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1);
                if (context_data_position === bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else { context_data_position++; }
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 8; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position === bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else { context_data_position++; }
                value = value >> 1;
              }
            } else {
              value = 1;
              for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | value;
                if (context_data_position === bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else { context_data_position++; }
                value = 0;
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 16; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position === bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else { context_data_position++; }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn === 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
          } else {
            value = context_dictionary[context_w];
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position === bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else { context_data_position++; }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn === 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
        }
      value = 2;
      for (i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value & 1);
        if (context_data_position === bitsPerChar - 1) {
          context_data_position = 0;
          context_data.push(getCharFromInt(context_data_val));
          context_data_val = 0;
        } else { context_data_position++; }
        value = value >> 1;
      }
      while (true) {
        context_data_val = (context_data_val << 1);
        if (context_data_position === bitsPerChar - 1) {
          context_data.push(getCharFromInt(context_data_val));
          break;
        } else { context_data_position++; }
      }
      return context_data.join("");
    },
    _decompress: function(length, resetValue, getNextValue) {
      let dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
      for (i = 0; i < 3; i += 1) { dictionary[i] = i; }
      bits = 0; maxpower = Math.pow(2, 2); power = 1;
      while (power !== maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position === 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      switch (next = bits) {
        case 0:
          bits = 0; maxpower = Math.pow(2, 8); power = 1;
          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 1:
          bits = 0; maxpower = Math.pow(2, 16); power = 1;
          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 2:
          return "";
      }
      dictionary[3] = c;
      w = c;
      result.push(c);
      while (true) {
        if (data.index > length) { return ""; }
        bits = 0; maxpower = Math.pow(2, numBits); power = 1;
        while (power !== maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        switch (c = bits) {
          case 0:
            bits = 0; maxpower = Math.pow(2, 8); power = 1;
            while (power !== maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position === 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 1:
            bits = 0; maxpower = Math.pow(2, 16); power = 1;
            while (power !== maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position === 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 2:
            return result.join("");
        }
        if (enlargeIn === 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
        if (dictionary[c]) {
          entry = dictionary[c];
        } else {
          if (c === dictSize) {
            entry = w + w.charAt(0);
          } else {
            return null;
          }
        }
        result.push(entry);
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;
        w = entry;
        if (enlargeIn === 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
      }
    }
  };
})();

// Shareable Link & URL Hash State Loader
function copyShareableLink() {
  const payload = {
    c: currentClass,
    s: currentSpec,
    m: parseInt(document.getElementById('target-mastery')?.value) || 0,
    cr: parseInt(document.getElementById('target-crit')?.value) || 0,
    h: parseInt(document.getElementById('target-haste')?.value) || 0,
    v: parseInt(document.getElementById('target-vers')?.value) || 0,
    w: document.getElementById('weapon-mode')?.value || '2h',
    tm: document.getElementById('tier-mode')?.value || '4',
    wm: parseFloat(document.getElementById('weight-mastery')?.value) || 1.0,
    wc: parseFloat(document.getElementById('weight-crit')?.value) || 1.0,
    wh: parseFloat(document.getElementById('weight-haste')?.value) || 1.0,
    wv: parseFloat(document.getElementById('weight-vers')?.value) || 1.0,
    maxIlvl: document.getElementById('toggle-max-ilvl')?.checked || false,
    venom: document.getElementById('toggle-venomstone')?.checked || false,
    cm: currentContentMode || 'raid',
    simcHeader: simcHeaderData || null,
    simc: lastImportedSimcText || null,
    charSimc: characterSimcData || null,
    items: (items || []).map(it => ({
      id: it.id,
      name: it.name,
      slot: it.slot,
      ilvl: it.ilvl,
      baseIlvl: it.baseIlvl,
      mastery: it.mastery,
      crit: it.crit,
      haste: it.haste,
      vers: it.vers,
      baseMastery: it.baseMastery,
      baseCrit: it.baseCrit,
      baseHaste: it.baseHaste,
      baseVers: it.baseVers,
      socket: it.socket,
      tier: it.tier,
      track: it.track,
      icon: it.icon,
      itemId: it.itemId,
      enchant_id: it.enchant_id,
      gem_id: it.gem_id,
      gemItemId: it.gemItemId,
      bonus: it.bonus,
      bonus_id: it.bonus_id,
      rawSimcOptions: it.rawSimcOptions,
      craftedStatCodes: it.craftedStatCodes,
      isEquipped: it.isEquipped,
      isBag: it.isBag,
      locked: it.locked
    }))
  };

  try {
    const jsonStr = JSON.stringify(payload);
    const compressed = LZCompressor.compress(jsonStr);
    const shareUrl = window.location.origin + window.location.pathname + '#lz:' + compressed;
    
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('¡Enlace con tu inventario completo y configuración copiado al portapapeles!');
      }).catch(() => {
        prompt('Copia este enlace para compartir tu equipo y configuración:', shareUrl);
      });
    } else {
      prompt('Copia este enlace para compartir tu equipo y configuración:', shareUrl);
    }
  } catch (err) {
    showToast('Error al generar enlace compartible', 'error');
  }
}

function loadStateFromUrlHash() {
  try {
    if (!window.location.hash || window.location.hash.length < 5) return false;
    let hash = window.location.hash.substring(1).trim();
    try {
      hash = decodeURIComponent(hash);
    } catch (e) {}

    let decoded = null;

    if (hash.startsWith('lz:')) {
      const lzData = hash.substring(3);
      const decompressed = LZCompressor.decompress(lzData);
      if (decompressed) {
        try { decoded = JSON.parse(decompressed); } catch(e) {}
      }
    }

    if (!decoded) {
      const decompressed = LZCompressor.decompress(hash);
      if (decompressed && decompressed.startsWith('{')) {
        try { decoded = JSON.parse(decompressed); } catch(e) {}
      }
    }

    if (!decoded) {
      const cleanHash = hash.replace(/ /g, '+');
      let decodedJson = null;
      try {
        decodedJson = decodeURIComponent(atob(cleanHash));
      } catch (e1) {
        try {
          decodedJson = atob(cleanHash);
        } catch (e2) {
          decodedJson = cleanHash;
        }
      }
      if (decodedJson && decodedJson.startsWith('{')) {
        try { decoded = JSON.parse(decodedJson); } catch(e) {}
      }
    }

    if (decoded && decoded.c && WOW_CLASSES[decoded.c]) {
      currentClass = decoded.c;
      const classSelect = document.getElementById('char-class');
      if (classSelect) classSelect.value = currentClass;
      updateClassTheme();

      const specSelect = document.getElementById('char-spec');
      const classData = WOW_CLASSES[currentClass];
      if (classData && specSelect) {
        specSelect.innerHTML = classData.specs.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
      }

      if (decoded.s) {
        currentSpec = decoded.s;
        if (specSelect) specSelect.value = currentSpec;
      } else if (classData) {
        currentSpec = classData.specs[0].id;
        if (specSelect) specSelect.value = currentSpec;
      }

      const specData = classData ? (classData.specs.find(s => s.id === currentSpec) || classData.specs[0]) : null;
      const titleEl = document.getElementById('current-spec-title');
      if (titleEl && specData) {
        titleEl.innerText = specData.name;
        titleEl.style.color = classData.color;
      }

      const wepSelect = document.getElementById('weapon-mode');
      if (wepSelect && specData && specData.allowedWeps) {
        wepSelect.innerHTML = specData.allowedWeps.map(w => `<option value="${w.id}">${w.label}</option>`).join('');
        wepSelect.value = decoded.w || specData.defaultWep;
      }

      if (decoded.cm) {
        currentContentMode = decoded.cm;
      }

      if (decoded.m !== undefined && document.getElementById('target-mastery')) document.getElementById('target-mastery').value = decoded.m;
      if (decoded.cr !== undefined && document.getElementById('target-crit')) document.getElementById('target-crit').value = decoded.cr;
      if (decoded.h !== undefined && document.getElementById('target-haste')) document.getElementById('target-haste').value = decoded.h;
      if (decoded.v !== undefined && document.getElementById('target-vers')) document.getElementById('target-vers').value = decoded.v;

      if (decoded.tm && document.getElementById('tier-mode')) document.getElementById('tier-mode').value = decoded.tm;
      if (decoded.maxIlvl !== undefined && document.getElementById('toggle-max-ilvl')) document.getElementById('toggle-max-ilvl').checked = !!decoded.maxIlvl;
      if (decoded.venom !== undefined && document.getElementById('toggle-venomstone')) document.getElementById('toggle-venomstone').checked = !!decoded.venom;

      if (decoded.wm !== undefined && document.getElementById('weight-mastery')) {
        document.getElementById('weight-mastery').value = decoded.wm;
        if (document.getElementById('label-w-mast')) document.getElementById('label-w-mast').innerText = decoded.wm;
      }
      if (decoded.wc !== undefined && document.getElementById('weight-crit')) {
        document.getElementById('weight-crit').value = decoded.wc;
        if (document.getElementById('label-w-crit')) document.getElementById('label-w-crit').innerText = decoded.wc;
      }
      if (decoded.wh !== undefined && document.getElementById('weight-haste')) {
        document.getElementById('weight-haste').value = decoded.wh;
        if (document.getElementById('label-w-haste')) document.getElementById('label-w-haste').innerText = decoded.wh;
      }
      if (decoded.wv !== undefined && document.getElementById('weight-vers')) {
        document.getElementById('weight-vers').value = decoded.wv;
        if (document.getElementById('label-w-vers')) document.getElementById('label-w-vers').innerText = decoded.wv;
      }

      if (decoded.simcHeader) simcHeaderData = decoded.simcHeader;
      if (decoded.simc) lastImportedSimcText = decoded.simc;
      if (decoded.charSimc && typeof decoded.charSimc === 'object') {
        characterSimcData = { ...characterSimcData, ...decoded.charSimc };
        saveCharacterSimcDataToStorage();
      }

      if (decoded.items && Array.isArray(decoded.items) && decoded.items.length > 0) {
        items = decoded.items;
        const badge = document.getElementById('total-items-badge');
        if (badge) badge.innerText = items.length;
        renderInventory();
      }

      renderPresetsToolbar();
      updateTargetDistributionStrip();
      saveState();
      if (items.length > 0) {
        runOptimizer();
      }
      showToast('¡Inventario (' + items.length + ' objetos) y configuración cargados con éxito!', 'info');
      return true;
    }
  } catch (err) {
    console.warn('Could not parse URL hash:', err);
  }
  return false;
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    loadStateFromUrlHash();
  });
}

// =========================================================================
// DYNAMIC TOOLTIP ENHANCER
// =========================================================================
let currentHoveredItemUid = null;
let ttPollInterval = null;
let ttPollCount = 0;

const updateTooltipLeafNodes = () => {
  if (!currentHoveredItemUid) return;
  const it = items.find(x => x.id === currentHoveredItemUid);
  if (!it) return;

  const tooltips = document.querySelectorAll('.wowhead-tooltip, [id^="wowhead-tooltip"]');
  tooltips.forEach(tt => {
    const textContent = (tt.textContent || '').toLowerCase();
    const cleanName = (it.name || '').trim().toLowerCase();
    
    if (!cleanName || !textContent.includes(cleanName.substring(0, Math.min(cleanName.length, 12)))) return;

    const activeStats = [];
    if (it.mastery) activeStats.push({ type: 'Mastery', val: it.mastery });
    if (it.crit) activeStats.push({ type: 'Critical Strike', val: it.crit });
    if (it.haste) activeStats.push({ type: 'Haste', val: it.haste });
    if (it.vers) activeStats.push({ type: 'Versatility', val: it.vers });

    const allSpans = Array.from(tt.querySelectorAll('span'));
    const secondarySpans = allSpans.filter(s => {
      const txt = s.textContent || '';
      return txt.includes('+') && (
        txt.includes('Random Stat') || 
        txt.includes('Critical') || 
        txt.includes('Haste') || 
        txt.includes('Mastery') || 
        txt.includes('Versatility')
      );
    });

    if (activeStats.length > 0 && (it.tier || it.track === 'crafted' || textContent.includes('random stat'))) {
      secondarySpans.forEach((span, i) => {
        if (activeStats[i]) {
          span.textContent = `+${activeStats[i].val} ${activeStats[i].type}`;
          span.className = 'q2';
          span.style.display = '';
        } else {
          span.textContent = '';
          span.style.display = 'none';
        }
      });
    }

    const td = tt.querySelector('td');
    if (!td) return;

    if (it.tier && !tt.querySelector('.whtt-custom-tier')) {
      const tierContainer = document.createElement('div');
      tierContainer.className = 'whtt-custom-tier';
      tierContainer.style.marginTop = '6px';
      tierContainer.style.paddingTop = '4px';
      tierContainer.style.borderTop = '1px solid rgba(199, 156, 255, 0.35)';
      tierContainer.innerHTML = `
        <div style="color: #ffd100; font-weight: bold; font-size: 11px;">
          <i class="fa-solid fa-crown" style="margin-right: 4px; color: #ffd100;"></i>Set: Conjunto de Clase (Tier Set)
        </div>
        <div style="color: #a335ee; font-size: 10px; margin-top: 1px;">(2) Set: Bono 2 Piezas de Especialización</div>
        <div style="color: #a335ee; font-size: 10px;">(4) Set: Bono 4 Piezas de Especialización</div>
      `;
      td.appendChild(tierContainer);
    }

    if (it.socket && !tt.querySelector('.whtt-custom-socket')) {
      const socketEl = document.createElement('div');
      socketEl.className = 'whtt-custom-socket';
      socketEl.style.color = '#ffd100';
      socketEl.style.fontSize = '11px';
      socketEl.style.marginTop = '4px';
      socketEl.innerHTML = '<span style="display:inline-block;width:9px;height:9px;background:#ffd100;border-radius:2px;margin-right:4px;vertical-align:middle;"></span>Prismatic Socket';
      td.appendChild(socketEl);
    }
  });
};

if (typeof document !== 'undefined') {
  document.addEventListener('mouseover', (e) => {
    const link = e.target?.closest ? e.target.closest('[data-item-uid]') : null;
    if (link) {
      currentHoveredItemUid = link.getAttribute('data-item-uid');
      if (ttPollInterval) clearInterval(ttPollInterval);
      ttPollCount = 0;
      ttPollInterval = setInterval(() => {
        ttPollCount++;
        updateTooltipLeafNodes();
        if (ttPollCount >= 15) {
          clearInterval(ttPollInterval);
          ttPollInterval = null;
        }
      }, 30);
      updateTooltipLeafNodes();
    } else {
      currentHoveredItemUid = null;
      if (ttPollInterval) {
        clearInterval(ttPollInterval);
        ttPollInterval = null;
      }
    }
  }, true);

  document.addEventListener('mouseout', (e) => {
    const link = e.target?.closest ? e.target.closest('[data-item-uid]') : null;
    if (link) {
      currentHoveredItemUid = null;
      if (ttPollInterval) {
        clearInterval(ttPollInterval);
        ttPollInterval = null;
      }
    }
  }, true);
}

// App Initialization
function initApp() {
  loadCustomDatasetsFromStorage();
  loadCharacterSimcDataFromStorage();
  initClassAndSpecs();
  const loadedFromHash = loadStateFromUrlHash();
  if (!loadedFromHash) {
    updateTargetDistributionStrip();
  }
  setInventoryViewMode(currentInventoryViewMode);
  if (items.length > 0) {
    renderInventory();
  }
  saveState();
  if (items.length > 0) {
    runOptimizer();
  }
  resolveAllItemIconsAsync();
  openCookieConsent();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
