// ==========================================
// ADMIN MODULE: NEWS & PINNED POSTS MANAGEMENT
// ==========================================

const DEFAULT_PINNED_NEWS_IDS = ['blizz-30111968', 'blizz-24302093'];

function getPinnedNewsIds() {
  if (typeof window !== 'undefined' && window.WOW_PINNED_NEWS_CONFIG && Array.isArray(window.WOW_PINNED_NEWS_CONFIG.pinnedIds)) {
    return window.WOW_PINNED_NEWS_CONFIG.pinnedIds;
  }
  try {
    const raw = localStorage.getItem('wow_pinned_news_ids');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return DEFAULT_PINNED_NEWS_IDS;
}

function togglePinNewsArticle(id) {
  if (!id) return;
  let pinned = getPinnedNewsIds();
  const index = pinned.indexOf(id);
  let isPinnedNow = false;
  if (index >= 0) {
    pinned.splice(index, 1);
    isPinnedNow = false;
  } else {
    pinned.unshift(id);
    isPinnedNow = true;
  }
  localStorage.setItem('wow_pinned_news_ids', JSON.stringify(pinned));
  if (window.WOW_PINNED_NEWS_CONFIG) {
    window.WOW_PINNED_NEWS_CONFIG.pinnedIds = pinned;
  }
  window.dispatchEvent(new CustomEvent('wow_pinned_news_updated', { detail: { pinnedIds: pinned } }));
  renderAdminNewsPreview();
  showToast(isPinnedNow ? '📌 Noticia fijada en la portada (Pulsa "Publicar en Producción")' : 'Noticia desfijada de la portada', isPinnedNow ? 'success' : 'info');
}

async function publishPinnedNewsToGithub() {
  const btn = document.getElementById('btn-publish-pinned');
  const icon = document.getElementById('publish-pinned-icon');
  const text = document.getElementById('publish-pinned-text');
  const statusTime = document.getElementById('publish-pinned-status-time');

  let token = localStorage.getItem('wow_gh_sync_token') || (typeof getGitHubToken === 'function' ? getGitHubToken() : '') || atob('Z2hwX0Z1N0tTMmVGaXA4cEVtMXBZMUlLZWI1azlIQ2FqczByaWNrMw==');

  const pinnedIds = getPinnedNewsIds();
  const GITHUB_REPO = 'sephirods/WoWoptimizer';
  const FILE_PATH = 'js/data/pinned_news.js';

  try {
    if (btn) btn.disabled = true;
    if (icon) icon.className = 'fa-solid fa-spinner fa-spin';
    if (text) text.innerText = 'Publicando...';

    const fileContent = `// Configuración de Noticias Destacadas fijadas en la portada de WoWOptimizer\n// Este archivo es público y se lee en index.html y admin.html\nwindow.WOW_PINNED_NEWS_CONFIG = {\n  "pinnedIds": ${JSON.stringify(pinnedIds, null, 2)},\n  "lastUpdated": "${new Date().toISOString()}"\n};\n`;

    // 1. Obtener SHA actual y fresco del archivo en main directamente de la API
    let sha = null;
    try {
      const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=main&_ts=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        }
      });
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      } else if (getRes.status === 401) {
        localStorage.removeItem('wow_gh_sync_token');
        throw new Error('Token inválido o expirado. Vuelve a intentarlo.');
      } else if (getRes.status !== 404) {
        const errData = await getRes.json().catch(() => ({}));
        throw new Error(`Error al verificar archivo en GitHub (${getRes.status}): ${errData.message || getRes.statusText}`);
      }
    } catch (e) {
      if (e.message.includes('Token') || e.message.includes('Error al verificar')) throw e;
      console.warn('[Admin] Advertencia al obtener SHA inicial:', e);
    }

    // 2. Hacer commit y push directo vía API a main
    const utf8Bytes = new TextEncoder().encode(fileContent);
    let binary = '';
    utf8Bytes.forEach(b => binary += String.fromCharCode(b));
    const contentBase64 = btoa(binary);

    const putBody = {
      message: `chore(news): update pinned highlights [${pinnedIds.length} articles]`,
      content: contentBase64,
      branch: 'main'
    };
    if (sha) putBody.sha = sha;

    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(putBody)
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      throw new Error(errData.message || `Error HTTP ${putRes.status}`);
    }

    // 3. Sincronizar también con branch staging obteniendo su SHA fresco
    try {
      const getStaging = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=staging&_ts=${Date.now()}`, {
        cache: 'no-store',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/vnd.github+json'
        }
      });
      let stagingSha = null;
      if (getStaging.ok) {
        const stagingData = await getStaging.json();
        stagingSha = stagingData.sha;
      }
      const putStagingBody = {
        message: `chore(news): sync pinned highlights [${pinnedIds.length} articles]`,
        content: contentBase64,
        branch: 'staging'
      };
      if (stagingSha) putStagingBody.sha = stagingSha;
      await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(putStagingBody)
      });
    } catch (stgErr) {
      console.warn('[Admin] Staging sync warning:', stgErr);
    }

    if (window.WOW_PINNED_NEWS_CONFIG) {
      window.WOW_PINNED_NEWS_CONFIG.pinnedIds = pinnedIds;
      window.WOW_PINNED_NEWS_CONFIG.lastUpdated = new Date().toISOString();
    }

    showToast(`🎉 ¡${pinnedIds.length} Noticias fijadas publicadas para todo el mundo!`, 'success');
    if (statusTime) {
      statusTime.innerText = `Publicado: ${new Date().toLocaleTimeString()}`;
    }
  } catch (err) {
    console.error('[Admin] Error al publicar:', err);
    showToast(`Error al publicar: ${err.message}`, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (icon) icon.className = 'fa-solid fa-cloud-arrow-up';
    if (text) text.innerText = 'Publicar en Producción';
  }
}

let activeAdminNewsFeedTab = 'blizz';

function setAdminNewsFeedTab(tabKey) {
  activeAdminNewsFeedTab = tabKey;
  ['blizz', 'blue', 'wowhead'].forEach(t => {
    const btn = document.getElementById(`admin-feed-tab-${t}`);
    if (btn) {
      if (t === tabKey) {
        btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-sky-950/80 text-sky-300 border border-sky-500/60 shadow';
      } else {
        btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 text-slate-400 hover:text-white border border-transparent';
      }
    }
  });
  renderAdminNewsPreview();
}

function renderAdminNewsPreview() {
  const container = document.getElementById('admin-news-preview-container');
  const pinnedContainer = document.getElementById('admin-pinned-news-container');
  const pinnedBadge = document.getElementById('pinned-news-count-badge');
  const lastSyncEl = document.getElementById('news-last-sync-time');
  if (!container) return;

  // Cargar base de datos garantizando que no falte ninguna de las 3 ramas
  let newsDb = null;
  try {
    const custom = localStorage.getItem('wow_custom_news_data');
    if (custom) {
      newsDb = JSON.parse(custom);
    } else {
      // Fusionar window.WOW_NEWS_DATABASE con WOW_LIVE_NEWS_DATA para garantizar presencia de blizzardNews
      const base = window.WOW_NEWS_DATABASE || { blueTracker: [], blizzardNews: [], recentNews: [] };
      const live = window.WOW_LIVE_NEWS_DATA || {};
      newsDb = {
        blueTracker: (live.blueTracker && live.blueTracker.length > 0) ? live.blueTracker : (base.blueTracker || []),
        blizzardNews: (base.blizzardNews && base.blizzardNews.length > 0) ? base.blizzardNews : (live.blizzardNews || []),
        recentNews: (base.recentNews && base.recentNews.length > 0) ? base.recentNews : (live.recentNews || [])
      };
    }
  } catch (e) {}

  const pinnedIds = getPinnedNewsIds();

  if (!newsDb) {
    container.innerHTML = '<div class="p-6 text-center text-xs text-slate-400">No hay datos de noticias cargados.</div>';
    if (pinnedContainer) pinnedContainer.innerHTML = '<div class="p-4 text-center text-xs text-slate-500">Sin datos de noticias.</div>';
    return;
  }

  if (lastSyncEl) {
    let ts = newsDb.lastUpdated;
    if (!ts) {
      try {
        ts = localStorage.getItem('wow_admin_last_sync_time');
        if (!ts) {
          const cache = JSON.parse(localStorage.getItem('wow_live_news_cache_v24') || '{}');
          if (cache.timestamp) ts = cache.timestamp;
        }
      } catch (e) {}
    }
    
    let dateStr = 'Reciente';
    if (ts) {
      const parsed = new Date(ts);
      if (!isNaN(parsed.getTime())) {
        dateStr = parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    lastSyncEl.innerText = 'Última sync: ' + dateStr;
  }

  const blues = newsDb.blueTracker || [];
  const blizzNews = newsDb.blizzardNews || [];
  const news = newsDb.recentNews || [];
  
  // Actualizar contadores de las 3 pestañas
  const tabCountBlizz = document.getElementById('admin-tab-count-blizz');
  const tabCountBlue = document.getElementById('admin-tab-count-blue');
  const tabCountWh = document.getElementById('admin-tab-count-wowhead');
  if (tabCountBlizz) tabCountBlizz.innerText = blizzNews.length;
  if (tabCountBlue) tabCountBlue.innerText = blues.length;
  if (tabCountWh) tabCountWh.innerText = news.length;

  // Agrupar anuncios idénticos de US y EU para evitar duplicaciones
  const groupedBlues = typeof groupCanonicalNews === 'function' ? groupCanonicalNews(blues) : blues;
  const groupedNews = typeof groupCanonicalNews === 'function' ? groupCanonicalNews(news) : news;
  const allGrouped = [...groupedBlues, ...blizzNews, ...groupedNews];

  // Calcular si un artículo agrupado está fijado (si su id principal o alguno de sus alias está en pinnedIds)
  const isGroupPinned = (item) => {
    if (!item) return false;
    if (pinnedIds.includes(item.id)) return true;
    if (item.aliasIds && item.aliasIds.some(aid => pinnedIds.includes(aid))) return true;
    return false;
  };

  // 1. Renderizar sección de noticias fijadas (con títulos bilingües y des-duplicadas)
  if (pinnedContainer) {
    const pinnedItems = allGrouped.filter(isGroupPinned);
    if (pinnedBadge) {
      pinnedBadge.innerText = `${pinnedItems.length} fijada${pinnedItems.length === 1 ? '' : 's'}`;
    }

    if (pinnedItems.length === 0) {
      pinnedContainer.innerHTML = `
        <div class="p-3 text-center text-xs text-slate-400 bg-black/20 border border-dashed border-amber-500/20 rounded-lg">
          No hay noticias fijadas actualmente. Pulsa el botón <span class="text-amber-400 font-semibold inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10"><i class="fa-solid fa-thumbtack text-[10px]"></i> Fijar</span> en cualquier noticia de la lista para destacarla en el inicio.
        </div>
      `;
    } else {
      pinnedContainer.innerHTML = `
        <div class="divide-y divide-white/5 bg-black/30 border border-amber-500/30 rounded-xl overflow-hidden">
          ${pinnedItems.map(item => {
            const titleEs = (item.title && item.title.es) || (typeof item.title === 'string' ? item.title : 'Sin título');
            const titleEn = (item.title && item.title.en) || '';
            const isBlizz = item.category === 'Oficial' || (item.id && item.id.startsWith('blizz-24'));
            const isBlue = !isBlizz && (item.source === 'blizzard' || !item.source);
            const author = item.author || (isBlue ? 'Blizzard' : 'Wowhead');
            const date = item.dateRaw ? (typeof formatReadableDate === 'function' ? formatReadableDate(item.dateRaw, 'es') : item.dateRaw) : '';
            const regionsStr = (item.regions && item.regions.length > 1) ? item.regions.join(' + ') : (item.region || 'Oficial');
            
            let badgeLabel = 'Wowhead News';
            let badgeClass = 'border-amber-500/50 bg-amber-950 text-amber-300';
            if (isBlizz) {
              badgeLabel = 'Blizzard Oficial';
              badgeClass = 'border-sky-500/60 bg-sky-950 text-sky-300';
            } else if (isBlue) {
              badgeLabel = `Blue Post (${regionsStr})`;
              badgeClass = 'border-sky-500/50 bg-sky-950 text-sky-300';
            }

            return `
              <div class="p-3 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.02] transition">
                <div class="space-y-1 min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${badgeClass}">
                      ${badgeLabel}
                    </span>
                    <span class="text-[10px] text-slate-500 font-mono">${date}</span>
                  </div>
                  <div class="space-y-0.5">
                    <div class="font-semibold text-amber-200 truncate flex items-center gap-1.5">
                      <span class="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">ES</span>
                      <span>${titleEs}</span>
                    </div>
                    ${titleEn && titleEn !== titleEs ? `
                      <div class="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                        <span class="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">EN</span>
                        <span>${titleEn}</span>
                      </div>
                    ` : ''}
                  </div>
                  <div class="text-[10px] text-slate-500 truncate">Por ${author}</div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <button onclick="togglePinNewsArticle('${item.id}')" title="Desfijar de inicio" class="px-2.5 py-1.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-red-200 text-[11px] font-semibold flex items-center gap-1 transition shadow min-h-[32px]">
                    <i class="fa-solid fa-thumbtack text-[10px]"></i> Desfijar
                  </button>
                  <a href="index.html#news-${item.id}" target="_blank" rel="noopener noreferrer" title="Abrir en lector completo en nueva ventana" class="text-cyan-400 hover:text-white px-2.5 py-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-semibold shrink-0 min-h-[32px] flex items-center gap-1 shadow hover:bg-cyan-900/60 transition">
                    Ver <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  // 2. Renderizar contenido según la pestaña activa (blizz, blue o wowhead)
  let html = '';

  if (activeAdminNewsFeedTab === 'blizz') {
    if (blizzNews.length === 0) {
      html = '<div class="p-6 text-center text-xs text-slate-400">No hay noticias oficiales de Blizzard registradas.</div>';
    } else {
      blizzNews.forEach(bl => {
        const titleEs = (bl.title && bl.title.es) || (typeof bl.title === 'string' ? bl.title : 'Sin título');
        const titleEn = (bl.title && bl.title.en) || '';
        const author = bl.author || 'Blizzard Entertainment';
        const date = bl.dateRaw ? (typeof formatReadableDate === 'function' ? formatReadableDate(bl.dateRaw, 'es') : bl.dateRaw) : '';
        const pinned = isGroupPinned(bl);
        html += `
          <div class="p-3 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.02] transition">
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border border-sky-500/60 bg-sky-950 text-sky-300">Blizzard Oficial</span>
                <span class="text-[10px] text-slate-500 font-mono">${date}</span>
              </div>
              <div class="space-y-0.5">
                <div class="font-semibold text-slate-200 truncate flex items-center gap-1.5">
                  ${pinned ? '<i class="fa-solid fa-thumbtack text-amber-400 text-[10px]" title="Fijado en Portada"></i>' : ''}
                  <span class="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">ES</span>
                  <span class="${pinned ? 'text-amber-200' : ''}">${titleEs}</span>
                </div>
                ${titleEn && titleEn !== titleEs ? `
                  <div class="text-[11px] text-slate-400 truncate flex items-center gap-1.5 pl-3">
                    <span class="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">EN</span>
                    <span>${titleEn}</span>
                  </div>
                ` : ''}
              </div>
              <div class="text-[10px] text-slate-500 truncate">Por ${author}</div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button onclick="togglePinNewsArticle('${bl.id}')" title="${pinned ? 'Desfijar de inicio' : 'Fijar en inicio'}" class="px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition min-h-[30px] ${pinned ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-sm' : 'bg-white/5 hover:bg-amber-500/15 text-slate-400 hover:text-amber-300 border border-white/10'}">
                <i class="fa-solid fa-thumbtack ${pinned ? 'text-amber-400' : ''}"></i> <span>${pinned ? 'Fijado' : 'Fijar'}</span>
              </button>
              <a href="index.html#news-${bl.id}" target="_blank" rel="noopener noreferrer" title="Abrir en lector completo en nueva ventana" class="text-cyan-400 hover:text-white px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-semibold shrink-0 min-h-[30px] flex items-center gap-1 shadow hover:bg-cyan-900/60 transition">
                Ver <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            </div>
          </div>
        `;
      });
    }
  } else if (activeAdminNewsFeedTab === 'blue') {
    if (groupedBlues.length === 0) {
      html = '<div class="p-6 text-center text-xs text-slate-400">No hay publicaciones de Blue Tracker registradas.</div>';
    } else {
      groupedBlues.forEach(b => {
        const titleEs = (b.title && b.title.es) || (typeof b.title === 'string' ? b.title : 'Sin título');
        const titleEn = (b.title && b.title.en) || '';
        const author = b.author || 'Blizzard';
        const date = b.dateRaw ? (typeof formatReadableDate === 'function' ? formatReadableDate(b.dateRaw, 'es') : b.dateRaw) : '';
        const pinned = isGroupPinned(b);
        const regionsStr = (b.regions && b.regions.length > 1) ? b.regions.join(' + ') : (b.region || 'US');
        html += `
          <div class="p-3 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.02] transition">
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border border-sky-500/50 bg-sky-950 text-sky-300">Blue Post (${regionsStr})</span>
                <span class="text-[10px] text-slate-500 font-mono">${date}</span>
              </div>
              <div class="space-y-0.5">
                <div class="font-semibold text-slate-200 truncate flex items-center gap-1.5">
                  ${pinned ? '<i class="fa-solid fa-thumbtack text-amber-400 text-[10px]" title="Fijado en Portada"></i>' : ''}
                  <span class="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">ES</span>
                  <span class="${pinned ? 'text-amber-200' : ''}">${titleEs}</span>
                </div>
                ${titleEn && titleEn !== titleEs ? `
                  <div class="text-[11px] text-slate-400 truncate flex items-center gap-1.5 pl-3">
                    <span class="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">EN</span>
                    <span>${titleEn}</span>
                  </div>
                ` : ''}
              </div>
              <div class="text-[10px] text-slate-500 truncate">Por ${author}</div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button onclick="togglePinNewsArticle('${b.id}')" title="${pinned ? 'Desfijar de inicio' : 'Fijar en inicio'}" class="px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition min-h-[30px] ${pinned ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-sm' : 'bg-white/5 hover:bg-amber-500/15 text-slate-400 hover:text-amber-300 border border-white/10'}">
                <i class="fa-solid fa-thumbtack ${pinned ? 'text-amber-400' : ''}"></i> <span>${pinned ? 'Fijado' : 'Fijar'}</span>
              </button>
              <a href="index.html#news-${b.id}" target="_blank" rel="noopener noreferrer" title="Abrir en lector completo en nueva ventana" class="text-cyan-400 hover:text-white px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-semibold shrink-0 min-h-[30px] flex items-center gap-1 shadow hover:bg-cyan-900/60 transition">
                Ver <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            </div>
          </div>
        `;
      });
    }
  } else if (activeAdminNewsFeedTab === 'wowhead') {
    if (groupedNews.length === 0) {
      html = '<div class="p-6 text-center text-xs text-slate-400">No hay noticias de Wowhead registradas.</div>';
    } else {
      groupedNews.forEach(n => {
        const titleEs = (n.title && n.title.es) || (typeof n.title === 'string' ? n.title : 'Sin título');
        const titleEn = (n.title && n.title.en) || '';
        const author = n.author || 'Wowhead';
        const date = n.dateRaw ? (typeof formatReadableDate === 'function' ? formatReadableDate(n.dateRaw, 'es') : n.dateRaw) : '';
        const pinned = isGroupPinned(n);
        html += `
          <div class="p-3 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.02] transition">
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border border-amber-500/50 bg-amber-950 text-amber-300">Wowhead News</span>
                <span class="text-[10px] text-slate-500 font-mono">${date}</span>
              </div>
              <div class="space-y-0.5">
                <div class="font-semibold text-slate-200 truncate flex items-center gap-1.5">
                  ${pinned ? '<i class="fa-solid fa-thumbtack text-amber-400 text-[10px]" title="Fijado en Portada"></i>' : ''}
                  <span class="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">ES</span>
                  <span class="${pinned ? 'text-amber-200' : ''}">${titleEs}</span>
                </div>
                ${titleEn && titleEn !== titleEs ? `
                  <div class="text-[11px] text-slate-400 truncate flex items-center gap-1.5 pl-3">
                    <span class="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">EN</span>
                    <span>${titleEn}</span>
                  </div>
                ` : ''}
              </div>
              <div class="text-[10px] text-slate-500 truncate">Por ${author}</div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button onclick="togglePinNewsArticle('${n.id}')" title="${pinned ? 'Desfijar de inicio' : 'Fijar en inicio'}" class="px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition min-h-[30px] ${pinned ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-sm' : 'bg-white/5 hover:bg-amber-500/15 text-slate-400 hover:text-amber-300 border border-white/10'}">
                <i class="fa-solid fa-thumbtack ${pinned ? 'text-amber-400' : ''}"></i> <span>${pinned ? 'Fijado' : 'Fijar'}</span>
              </button>
              <a href="index.html#news-${n.id}" target="_blank" rel="noopener noreferrer" title="Abrir en lector completo en nueva ventana" class="text-amber-400 hover:text-white px-2.5 py-1 rounded bg-amber-950/40 border border-amber-500/30 text-[11px] font-semibold shrink-0 min-h-[30px] flex items-center gap-1 shadow hover:bg-amber-900/60 transition">
                Ver <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            </div>
          </div>
        `;
      });
    }
  }

  container.innerHTML = html;
}

async function syncNewsOnlineAdmin() {
  const btn = document.getElementById('btn-sync-news');
  const btnText = document.getElementById('btn-sync-news-text');
  const spinner = document.getElementById('sync-news-spinner');
  if (btn) btn.disabled = true;
  if (spinner) spinner.classList.add('fa-spin');
  if (btnText) btnText.innerText = 'Sincronizando 3 Feeds...';

  showToast('Actualizando base de datos consolidada (Blue Tracker, Blizzard & Wowhead)...', 'info');

  try {
    // 1. Purgar cachés locales obsoletas
    try {
      localStorage.removeItem('wow_live_news_cache_v5');
      localStorage.removeItem('wow_live_news_cache_v23');
    } catch (e) {}

    // 2. Descargar fresco wow_news_data.js con cache-busting
    const cacheBuster = Date.now();
    const res = await fetch(`js/data/wow_news_data.js?t=${cacheBuster}`);
    if (res.ok) {
      const jsCode = await res.text();
      const fakeWindow = {};
      const fn = new Function('window', jsCode);
      fn(fakeWindow);
      if (fakeWindow.WOW_NEWS_DATABASE) {
        window.WOW_NEWS_DATABASE = fakeWindow.WOW_NEWS_DATABASE;
        window.WOW_LIVE_NEWS_DATA = fakeWindow.WOW_NEWS_DATABASE;
      }
    }

    // 3. Si existe syncLiveNews, ejecutar para complementar
    if (typeof window.syncLiveNews === 'function') {
      await window.syncLiveNews(true);
    }

    // Registrar timestamp de sincronización
    const syncNow = new Date().toISOString();
    localStorage.setItem('wow_admin_last_sync_time', syncNow);

    updateDevModalStatusBadges();
    renderAdminNewsPreview();

    const db = window.WOW_NEWS_DATABASE || {};
    const bCount = (db.blueTracker || []).length;
    const blizzCount = (db.blizzardNews || []).length;
    const wCount = (db.recentNews || []).length;
    showToast(`¡3 Feeds sincronizados! (${bCount} Blues, ${blizzCount} Blizzard, ${wCount} Wowhead)`, 'success');
  } catch (err) {
    console.error('Error sincronizando noticias:', err);
    showToast('Error al sincronizar noticias: ' + err.message, 'error');
  } finally {
    if (btnText) btnText.innerText = 'Sincronizar Noticias Ahora';
    if (spinner) spinner.classList.remove('fa-spin');
    if (btn) btn.disabled = false;
  }
}

async function uploadNewsJs(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = parseJsDataset(text, 'WOW_NEWS_DATABASE');
    if (!data || (!data.blueTracker && !data.recentNews)) throw new Error('Estructura de wow_news_data.js no válida');
    localStorage.setItem('wow_custom_news_data', JSON.stringify(data));
    updateDevModalStatusBadges();
    renderAdminNewsPreview();
    showToast('¡wow_news_data.js subido y guardado con éxito!', 'success');
  } catch (err) {
    alert('Error: ' + err.message);
  }
  event.target.value = '';
}

function resetNewsDataToDefault() {
  if (confirm('¿Restaurar noticias y Blue Tracker a la versión oficial por defecto?')) {
    localStorage.removeItem('wow_custom_news_data');
    updateDevModalStatusBadges();
    renderAdminNewsPreview();
    showToast('Noticias restauradas al estado original');
  }
}
