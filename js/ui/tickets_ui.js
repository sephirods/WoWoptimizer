// Sistema de Reporte de Problemas / Tickets de Bugs con Anti-Bot y Rate Limiting

let bugCaptchaAnswer = 0;

function openBugReportModal() {
  const modal = document.getElementById('bug-report-modal');
  if (!modal) return;

  // Generar nuevo desafío matemático anti-bot
  generateBugCaptcha();

  // Limpiar campos y feedback
  const titleInput = document.getElementById('bug-title');
  const descInput = document.getElementById('bug-desc');
  const typeSelect = document.getElementById('bug-type');
  const honeyInput = document.getElementById('bug-hp-website');
  const captchaInput = document.getElementById('bug-captcha');
  const statusEl = document.getElementById('bug-submit-status');

  if (titleInput) titleInput.value = '';
  if (descInput) descInput.value = '';
  if (honeyInput) honeyInput.value = '';
  if (captchaInput) captchaInput.value = '';
  if (typeSelect) typeSelect.selectedIndex = 0;
  if (statusEl) {
    statusEl.className = 'hidden text-xs font-semibold p-2.5 rounded-xl text-center';
    statusEl.innerHTML = '';
  }

  // Pre-llenar contexto técnico del usuario
  const metaBadge = document.getElementById('bug-env-meta');
  if (metaBadge) {
    const cls = typeof currentClass !== 'undefined' ? currentClass : 'Desconocida';
    const spc = typeof currentSpec !== 'undefined' ? currentSpec : 'Desconocida';
    const itemsCount = (typeof items !== 'undefined' && Array.isArray(items)) ? items.length : 0;
    metaBadge.innerText = `Clase: ${cls} | Spec: ${spc} | Objetos: ${itemsCount}`;
  }

  // Guardar timestamp para detectar sumisiones instantáneas de bots (< 3 segundos)
  modal.setAttribute('data-opened-at', Date.now().toString());
  modal.classList.remove('hidden');
}

function closeBugReportModal() {
  const modal = document.getElementById('bug-report-modal');
  if (modal) modal.classList.add('hidden');
}

function generateBugCaptcha() {
  const num1 = Math.floor(Math.random() * 8) + 2; // 2 a 9
  const num2 = Math.floor(Math.random() * 7) + 1; // 1 a 7
  bugCaptchaAnswer = num1 + num2;
  const questionEl = document.getElementById('bug-captcha-question');
  if (questionEl) {
    questionEl.innerText = `¿Cuánto es ${num1} + ${num2}?`;
  }
}

function submitBugReport(event) {
  event.preventDefault();
  const statusEl = document.getElementById('bug-submit-status');
  const submitBtn = document.getElementById('bug-submit-btn');

  function showFeedback(msg, isError = true) {
    if (!statusEl) return;
    statusEl.className = isError 
      ? 'text-xs font-semibold p-3 rounded-xl text-center bg-red-950/80 border border-red-500/60 text-red-300 block'
      : 'text-xs font-semibold p-3 rounded-xl text-center bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 block';
    statusEl.innerHTML = (isError ? '<i class="fa-solid fa-triangle-exclamation mr-1.5"></i>' : '<i class="fa-solid fa-circle-check mr-1.5"></i>') + msg;
  }

  // 1. FILTRO ANTI-BOT: Honeypot oculto
  const honey = document.getElementById('bug-hp-website')?.value || '';
  if (honey.trim().length > 0) {
    // Es un bot automatizado que llenó el campo oculto
    console.warn('Bot submission blocked via honeypot.');
    showFeedback('Tu reporte no pudo ser procesado.', true);
    return;
  }

  // 2. FILTRO ANTI-BOT: Tiempo mínimo de llenado (Time-trap, mín 3 seg)
  const modal = document.getElementById('bug-report-modal');
  const openedAt = parseInt(modal?.getAttribute('data-opened-at') || '0', 10);
  const elapsedSeconds = (Date.now() - openedAt) / 1000;
  if (elapsedSeconds < 2.5) {
    showFeedback('Envío demasiado rápido. Por favor tómate un momento para describir el problema.', true);
    return;
  }

  // 3. RATE LIMITING: Máximo 3 tickets por minuto / mínimo 15 segundos entre envíos
  const lastSubmitTime = parseInt(localStorage.getItem('wow_last_ticket_submit_time') || '0', 10);
  const cooldownSec = Math.round((Date.now() - lastSubmitTime) / 1000);
  if (cooldownSec < 15) {
    showFeedback(`Por favor espera ${15 - cooldownSec} segundos antes de enviar otro reporte.`, true);
    return;
  }

  // 4. CAPTCHA MATEMÁTICO
  const userCaptcha = parseInt(document.getElementById('bug-captcha')?.value || '', 10);
  if (isNaN(userCaptcha) || userCaptcha !== bugCaptchaAnswer) {
    showFeedback('Respuesta de verificación incorrecta. Resuelve la suma para continuar.', true);
    generateBugCaptcha();
    return;
  }

  // 5. SANITIZACIÓN & VALIDACIÓN DE CONTENIDO
  const title = (document.getElementById('bug-title')?.value || '').trim();
  const desc = (document.getElementById('bug-desc')?.value || '').trim();
  const type = (document.getElementById('bug-type')?.value || 'bug').trim();
  const contact = (document.getElementById('bug-contact')?.value || '').trim();

  if (title.length < 4) {
    showFeedback('Por favor ingresa un título o resumen claro (mínimo 4 caracteres).', true);
    return;
  }
  if (desc.length < 10) {
    showFeedback('Por favor proporciona una descripción más detallada del problema (mínimo 10 caracteres).', true);
    return;
  }

  // Deshabilitar botón mientras se guarda
  if (submitBtn) submitBtn.disabled = true;

  // 6. CREACIÓN DEL TICKET
  const ticketId = 'TKT-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 899 + 100);
  
  const ticket = {
    id: ticketId,
    title: title.slice(0, 120),
    desc: desc.slice(0, 2000),
    type: type,
    contact: contact.slice(0, 80),
    status: 'open',
    createdAt: Date.now(),
    device: {
      url: window.location.href,
      userAgent: navigator.userAgent ? navigator.userAgent.slice(0, 150) : 'Desconocido',
      currentClass: typeof currentClass !== 'undefined' ? currentClass : null,
      currentSpec: typeof currentSpec !== 'undefined' ? currentSpec : null,
      lang: typeof currentLang !== 'undefined' ? currentLang : 'en',
      itemsCount: (typeof items !== 'undefined' && Array.isArray(items)) ? items.length : 0
    }
  };

  try {
    let tickets = [];
    try {
      tickets = JSON.parse(localStorage.getItem('wow_admin_tickets') || '[]');
    } catch (e) {
      tickets = [];
    }

    // Límite razonable de almacenamiento local: guardar los últimos 200 tickets
    tickets.unshift(ticket);
    if (tickets.length > 200) tickets = tickets.slice(0, 200);

    localStorage.setItem('wow_admin_tickets', JSON.stringify(tickets));
    localStorage.setItem('wow_last_ticket_submit_time', Date.now().toString());

    // Éxito
    showFeedback(`¡Gracias! Ticket <strong>${ticketId}</strong> registrado correctamente. Lo revisaremos en el panel de administración.`, false);
    
    setTimeout(() => {
      closeBugReportModal();
      if (typeof showToast === 'function') {
        showToast(`Ticket ${ticketId} enviado con éxito. ¡Gracias por tu reporte!`, 'success');
      }
      if (submitBtn) submitBtn.disabled = false;
    }, 2000);

  } catch (err) {
    showFeedback('Error al guardar el ticket: ' + err.message, true);
    if (submitBtn) submitBtn.disabled = false;
  }
}
