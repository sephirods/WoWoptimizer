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
