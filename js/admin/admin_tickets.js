// Admin Suite: Missing Tooltips Log & User Feedback Tickets
function renderMissingTooltipsTable() {
  const container = document.getElementById('missing-tooltips-container');
  const badge = document.getElementById('missing-count-badge');
  const tabBadge = document.getElementById('tab-missing-badge');
  const overviewBadge = document.getElementById('overview-missing-badge');
  if (!container) return;

  let logs = [];
  try {
    logs = JSON.parse(localStorage.getItem('wow_missing_tooltips_log') || '[]');
  } catch (e) {
    logs = [];
  }

  if (badge) {
    badge.innerText = `${logs.length} detectados`;
    badge.className = logs.length > 0 
      ? 'font-mono text-xs text-red-200 bg-red-950/80 border border-red-500/60 px-2.5 py-0.5 rounded-full font-bold'
      : 'font-mono text-xs text-emerald-200 bg-emerald-950/80 border border-emerald-500/60 px-2.5 py-0.5 rounded-full font-bold';
  }

  if (tabBadge) {
    tabBadge.innerText = logs.length;
    tabBadge.className = logs.length > 0
      ? 'ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-red-950 text-red-300 border border-red-500/60 font-bold'
      : 'ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-slate-400 border border-slate-700';
  }

  if (overviewBadge) {
    overviewBadge.innerText = logs.length > 0 ? `${logs.length} Fallos Detectados` : '0 Fallos (Saludable)';
    overviewBadge.className = logs.length > 0
      ? 'text-xs px-2.5 py-0.5 rounded-full font-mono bg-red-950/80 border border-red-500/60 text-red-300 font-bold'
      : 'text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold';
  }

  if (logs.length === 0) {
    container.innerHTML = `
      <div class="bg-black/30 p-8 text-center text-xs text-emerald-300">
        <i class="fa-solid fa-circle-check text-2xl mb-2 block text-emerald-400"></i>
        ¡Todo limpio! No se ha detectado ningún tooltip roto o "Not Found" en Wowhead.
      </div>
    `;
    return;
  }

  const filterVal = (document.getElementById('filter-tooltips-input')?.value || '').toLowerCase();
  const filtered = filterVal
    ? logs.filter(l => (l.id && String(l.id).includes(filterVal)) || (l.name && l.name.toLowerCase().includes(filterVal)) || (l.kind && l.kind.toLowerCase().includes(filterVal)))
    : logs;

  container.innerHTML = `
    <table class="w-full text-left text-xs border-collapse">
      <thead>
        <tr class="bg-black/60 border-b border-wow-border text-slate-400 font-bold uppercase tracking-wider text-[10px]">
          <th class="p-3">Tipo</th>
          <th class="p-3">ID</th>
          <th class="p-3">Nombre / Etiqueta</th>
          <th class="p-3 text-center">Incidencias</th>
          <th class="p-3">Última Detección</th>
          <th class="p-3 text-right">Acción</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5 font-mono">
        ${filtered.map(log => `
          <tr class="hover:bg-white/5 transition">
            <td class="p-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${log.kind === 'spell' ? 'bg-purple-950 text-purple-300 border border-purple-500/50' : 'bg-blue-950 text-blue-300 border border-blue-500/50'}">
                ${(log.kind || 'ITEM').toUpperCase()}
              </span>
            </td>
            <td class="p-3 text-amber-300 font-bold">${log.id}</td>
            <td class="p-3 font-sans font-semibold text-slate-200">${log.name || '-'}</td>
            <td class="p-3 text-center text-red-300 font-bold">${log.occurrences || 1}</td>
            <td class="p-3 text-slate-400 text-[10px]">${log.lastSeen ? new Date(log.lastSeen).toLocaleString() : '-'}</td>
            <td class="p-3 text-right">
              <a href="${log.url || 'https://www.wowhead.com/' + log.kind + '=' + log.id}" target="_blank" class="text-amber-400 hover:text-amber-300 underline font-sans text-xs inline-flex items-center gap-1">
                Ver en Wowhead <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function filterTooltipsLog() {
  renderMissingTooltipsTable();
}

function clearMissingTooltipsLog() {
  if (confirm('¿Vaciar el historial de tooltips no encontrados?')) {
    localStorage.removeItem('wow_missing_tooltips_log');
    renderMissingTooltipsTable();
    showToast('Historial de tooltips vaciado', 'info');
  }
}

async function renderTicketsTable() {
  const container = document.getElementById('tickets-container');
  const badge = document.getElementById('tickets-count-badge');
  const tabBadge = document.getElementById('tab-tickets-badge');
  const overviewBadge = document.getElementById('overview-tickets-badge');
  if (!container) return;

  let localTickets = [];
  try {
    localTickets = JSON.parse(localStorage.getItem('wow_admin_tickets') || '[]');
  } catch (e) {
    localTickets = [];
  }

  let githubTickets = [];
  const token = typeof getGitHubToken === 'function' ? getGitHubToken() : '';
  try {
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const repoOwner = (typeof window !== 'undefined' && window.GITHUB_REPO_OWNER) || (typeof GITHUB_REPO_OWNER !== 'undefined' ? GITHUB_REPO_OWNER : 'sephirods');
    const repoName = (typeof window !== 'undefined' && window.GITHUB_REPO_NAME) || (typeof GITHUB_REPO_NAME !== 'undefined' ? GITHUB_REPO_NAME : 'WoWoptimizer');
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues?state=all&per_page=50`, { headers });
    if (res.ok) {
      const issues = await res.json();
      if (Array.isArray(issues)) {
        githubTickets = issues.map(iss => ({
          id: '#' + iss.number,
          title: iss.title,
          desc: iss.body || '',
          type: (iss.labels && iss.labels.length > 0) ? iss.labels[0].name : 'bug',
          contact: iss.user ? ('@' + iss.user.login) : '',
          status: iss.state === 'closed' ? 'resolved' : 'open',
          createdAt: new Date(iss.created_at).getTime(),
          githubUrl: iss.html_url,
          isGithub: true
        }));
      }
    }
  } catch (err) {
    console.warn('Error consultando GitHub Issues:', err);
  }

  const combinedMap = new Map();
  githubTickets.forEach(t => combinedMap.set(t.id, t));
  localTickets.forEach(t => {
    if (!combinedMap.has(t.id)) combinedMap.set(t.id, t);
  });

  const tickets = Array.from(combinedMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const openCount = tickets.filter(t => t.status !== 'resolved').length;

  if (badge) {
    badge.innerText = `${tickets.length} tickets (${openCount} abiertos)`;
    badge.className = openCount > 0
      ? 'font-mono text-xs text-amber-200 bg-amber-950/80 border border-amber-500/60 px-2.5 py-0.5 rounded-full font-bold'
      : 'font-mono text-xs text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full font-bold';
  }

  if (tabBadge) {
    tabBadge.innerText = openCount;
    tabBadge.className = openCount > 0
      ? 'ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-amber-950 text-amber-300 border border-amber-500/60 font-bold'
      : 'ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-slate-400 border border-slate-700';
  }

  if (overviewBadge) {
    overviewBadge.innerText = openCount > 0 ? `${openCount} Abiertos` : '0 Pendientes';
    overviewBadge.className = openCount > 0
      ? 'text-xs px-2.5 py-0.5 rounded-full font-mono bg-amber-950/80 border border-amber-500/60 text-amber-300 font-bold'
      : 'text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold';
  }

  if (tickets.length === 0) {
    container.innerHTML = `
      <div class="bg-black/30 p-8 text-center text-xs text-slate-400">
        <i class="fa-solid fa-inbox text-2xl mb-2 block text-amber-400/60"></i>
        No hay tickets registrados por el momento. La bandeja está limpia.
      </div>
    `;
    return;
  }

  const filterVal = (document.getElementById('filter-tickets-input')?.value || '').toLowerCase().trim();
  const filtered = filterVal
    ? tickets.filter(t => 
        (t.id && t.id.toLowerCase().includes(filterVal)) ||
        (t.title && t.title.toLowerCase().includes(filterVal)) ||
        (t.desc && t.desc.toLowerCase().includes(filterVal)) ||
        (t.type && t.type.toLowerCase().includes(filterVal)) ||
        (t.contact && t.contact.toLowerCase().includes(filterVal))
      )
    : tickets;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-black/30 p-8 text-center text-xs text-slate-400">
        No se encontraron tickets que coincidan con "${filterVal}".
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="divide-y divide-white/5 font-sans">
      ${filtered.map(t => {
        const isResolved = t.status === 'resolved';
        const badgeType = t.type === 'bug' ? 'bg-red-950 text-red-300 border-red-500/50' :
                          t.type === 'item' ? 'bg-blue-950 text-blue-300 border-blue-500/50' :
                          t.type === 'ui' ? 'bg-purple-950 text-purple-300 border-purple-500/50' :
                          'bg-amber-950 text-amber-300 border-amber-500/50';
        const typeLabel = t.type === 'bug' ? 'Bug / Error' :
                          t.type === 'item' ? 'Objeto / Stat' :
                          t.type === 'ui' ? 'Diseño / UI' : 'Sugerencia';

        const formattedDate = t.createdAt ? new Date(t.createdAt).toLocaleString() : '-';
        const dev = t.device || {};

        return `
          <div class="p-4 transition hover:bg-white/[0.02] ${isResolved ? 'opacity-60 bg-black/20' : 'bg-black/30'}">
            <div class="flex items-start justify-between gap-3 flex-wrap">
              <div class="space-y-1.5 flex-1 min-w-[260px]">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-mono text-[11px] font-bold text-amber-400">${t.id}</span>
                  ${t.githubUrl ? `<a href="${t.githubUrl}" target="_blank" class="text-[10px] bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-600 px-2 py-0.5 rounded font-bold transition flex items-center gap-1"><i class="fa-brands fa-github"></i> GitHub Issue <i class="fa-solid fa-arrow-up-right-from-square text-[8px]"></i></a>` : ''}
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${badgeType}">${typeLabel}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded font-bold border ${isResolved ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'}">
                    ${isResolved ? '✓ Resuelto' : '● Pendiente'}
                  </span>
                  <span class="text-[10px] text-slate-500">${formattedDate}</span>
                </div>
                <h4 class="text-sm font-bold text-slate-100 ${isResolved ? 'line-through text-slate-400' : ''}">${t.title || 'Sin título'}</h4>
                <p class="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 font-sans">${t.desc || 'Sin descripción'}</p>
                
                <div class="flex items-center gap-2 flex-wrap pt-1 text-[10px] font-mono text-slate-400">
                  ${t.contact ? `<span class="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300"><i class="fa-solid fa-envelope mr-1 text-amber-400"></i>${t.contact}</span>` : ''}
                  ${dev.currentClass ? `<span class="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300">Clase: ${dev.currentClass} (${dev.currentSpec || '-'})</span>` : ''}
                  ${dev.itemsCount ? `<span class="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300">Items: ${dev.itemsCount}</span>` : ''}
                  ${dev.userAgent ? `<span class="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-slate-400 truncate max-w-xs" title="${dev.userAgent}"><i class="fa-solid fa-laptop mr-1"></i>${dev.userAgent}</span>` : ''}
                </div>
              </div>

              <div class="flex items-center gap-2 self-start">
                <button onclick="toggleTicketStatus('${t.id}')" class="text-xs ${isResolved ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600' : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/60'} px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow">
                  <i class="fa-solid ${isResolved ? 'fa-arrow-rotate-left' : 'fa-check'}"></i> ${isResolved ? 'Reabrir' : 'Marcar Resuelto'}
                </button>
                <button onclick="deleteTicket('${t.id}')" class="text-xs bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/50 p-1.5 px-2.5 rounded-xl transition shadow" title="Eliminar Ticket">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function toggleTicketStatus(ticketId) {
  let tickets = [];
  try {
    tickets = JSON.parse(localStorage.getItem('wow_admin_tickets') || '[]');
  } catch (e) {
    tickets = [];
  }
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.status = ticket.status === 'resolved' ? 'open' : 'resolved';
    localStorage.setItem('wow_admin_tickets', JSON.stringify(tickets));
    renderTicketsTable();
    showToast(`Ticket ${ticketId} actualizado a ${ticket.status === 'resolved' ? 'Resuelto' : 'Abierto'}`, 'info');
  }
}

function deleteTicket(ticketId) {
  if (confirm(`¿Eliminar permanentemente el ticket ${ticketId}?`)) {
    let tickets = [];
    try {
      tickets = JSON.parse(localStorage.getItem('wow_admin_tickets') || '[]');
    } catch (e) {
      tickets = [];
    }
    tickets = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem('wow_admin_tickets', JSON.stringify(tickets));
    renderTicketsTable();
    showToast('Ticket eliminado', 'info');
  }
}

function clearAllTickets() {
  if (confirm('¿Vaciar permanentemente TODOS los tickets de la bandeja?')) {
    localStorage.removeItem('wow_admin_tickets');
    renderTicketsTable();
    showToast('Todos los tickets han sido eliminados', 'info');
  }
}
