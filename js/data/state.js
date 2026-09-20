// Global State & Browser Persistence Manager
let items = [];
try {
  const savedItems = localStorage.getItem('wow_items_db');
  if (savedItems) {
    items = JSON.parse(savedItems) || [];
  }
} catch (e) {
  items = [];
}

let currentClass = 'hunter';
let currentSpec = 'survival';
let currentContentMode = 'raid'; // 'raid' | 'mplus'
let currentHeroTree = null;
let currentOptimizationResults = [];
let lockedSlots = {};
let simcHeaderData = null;

try {
  const savedClass = localStorage.getItem('wow_active_class');
  if (savedClass) currentClass = savedClass;
  const savedSpec = localStorage.getItem('wow_active_spec');
  if (savedSpec) currentSpec = savedSpec;
  const savedMode = localStorage.getItem('wow_active_content_mode');
  if (savedMode) currentContentMode = savedMode;
} catch (e) {}

// Mirror to window for global access and backwards-compatibility
window.items = items;
window.currentClass = currentClass;
window.currentSpec = currentSpec;
window.currentContentMode = currentContentMode;
window.currentHeroTree = currentHeroTree;
window.currentOptimizationResults = currentOptimizationResults;
window.lockedSlots = lockedSlots;

function saveState() {
  try {
    localStorage.setItem('wow_items_db', JSON.stringify(items));
    localStorage.setItem('wow_active_class', currentClass);
    localStorage.setItem('wow_active_spec', currentSpec);
    localStorage.setItem('wow_active_content_mode', currentContentMode);
  } catch (e) {}
  window.items = items;
  window.currentClass = currentClass;
  window.currentSpec = currentSpec;
  window.currentContentMode = currentContentMode;
  window.currentHeroTree = currentHeroTree;
  window.currentOptimizationResults = currentOptimizationResults;
  window.lockedSlots = lockedSlots;
  const badge = document.getElementById('total-items-badge');
  if (badge) badge.innerText = items.length;
  updateSimcOnboardingUI();
}

function updateSimcOnboardingUI() {
  const btn = document.getElementById('btn-nav-import-simc');
  const hint = document.getElementById('simc-floating-hint');
  const hintText = document.getElementById('simc-hint-text');
  
  const hasItems = Array.isArray(items) && items.length > 0;
  
  if (btn) {
    if (!hasItems) {
      btn.classList.add('simc-attention-pulse');
    } else {
      btn.classList.remove('simc-attention-pulse');
    }
  }

  if (hint) {
    if (!hasItems) {
      hint.classList.remove('hidden');
      if (hintText && typeof t === 'function') {
        hintText.innerText = t('simcHintText', 'Start here! Import your SimC');
      }
    } else {
      hint.classList.add('hidden');
    }
  }
}

function loadState() {
  try {
    const savedItems = localStorage.getItem('wow_items_db');
    if (savedItems) items = JSON.parse(savedItems) || [];
    const savedClass = localStorage.getItem('wow_active_class');
    if (savedClass) currentClass = savedClass;
    const savedSpec = localStorage.getItem('wow_active_spec');
    if (savedSpec) currentSpec = savedSpec;
    const savedMode = localStorage.getItem('wow_active_content_mode');
    if (savedMode) currentContentMode = savedMode;
  } catch (e) {}
  saveState();
}
