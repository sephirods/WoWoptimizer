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
