// SISTEMA DE RENDERIZADO DE NOTICIAS, BLUE TRACKER Y LECTOR INTERNO DE ARTÍCULOS
let activeBlueRegionFilter = 'ALL';

function getNewsDatabase() {
  try {
    const custom = localStorage.getItem('wow_custom_news_data');
    if (custom) return JSON.parse(custom);
  } catch (e) {}
  return window.WOW_NEWS_DATABASE || { blueTracker: [], recentNews: [] };
}

function setBlueRegionFilter(region) {
  activeBlueRegionFilter = region;
  document.querySelectorAll('.blue-filter-btn').forEach(btn => {
    btn.className = 'blue-filter-btn px-2.5 py-0.5 rounded text-[10px] font-bold transition text-slate-400 hover:text-white border border-transparent';
  });
  const activeBtn = document.getElementById(`btn-blue-filter-${region.toLowerCase()}`);
  if (activeBtn) {
    activeBtn.className = 'blue-filter-btn px-2.5 py-0.5 rounded text-[10px] font-bold transition text-white bg-sky-900/80 border border-sky-500/60 shadow';
  }
  renderBlueTracker();
}

function renderBlueTracker() {
  const container = document.getElementById('blue-tracker-feed');
  if (!container) return;

  const db = getNewsDatabase();
  const list = db.blueTracker || [];

  const filtered = activeBlueRegionFilter === 'ALL'
    ? list
    : list.filter(item => item.region.toUpperCase() === activeBlueRegionFilter.toUpperCase());

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-500">
        No hay publicaciones en el Blue Tracker para esta región.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="divide-y divide-white/5">
      ${filtered.map(item => `
        <div onclick="openArticleModal('${item.id}', 'blue')" class="p-3.5 hover:bg-sky-950/20 transition cursor-pointer flex items-start justify-between gap-3 group">
          <div class="space-y-1 flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${item.region === 'US' ? 'bg-red-950 text-red-300 border-red-500/40' : 'bg-blue-950 text-blue-300 border-blue-500/40'}">
                ${item.region}
              </span>
              <span class="text-[10px] font-bold text-sky-400 flex items-center gap-1">
                <i class="fa-solid fa-bullhorn text-[9px]"></i> ${item.tag || 'Blizzard'}
              </span>
              <span class="text-[10px] text-slate-500">${item.timeAgo || item.date}</span>
            </div>
            <h4 class="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition line-clamp-2">
              ${item.title}
            </h4>
            <p class="text-[11px] text-slate-400 line-clamp-1">
              ${item.summary || ''}
            </p>
          </div>
          <i class="fa-solid fa-chevron-right text-xs text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition shrink-0 mt-2"></i>
        </div>
      `).join('')}
    </div>
  `;
}

function renderRecentNews() {
  const container = document.getElementById('recent-news-feed');
  if (!container) return;

  const db = getNewsDatabase();
  const list = db.recentNews || [];

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-500">
        No hay noticias editoriales en este momento.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="divide-y divide-white/5">
      ${list.map(item => `
        <div onclick="openArticleModal('${item.id}', 'news')" class="p-3.5 hover:bg-amber-950/20 transition cursor-pointer flex items-start justify-between gap-3 group">
          <div class="space-y-1 flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border bg-purple-950 text-purple-300 border-purple-500/40">
                ${item.category || 'Season 2'}
              </span>
              <span class="text-[10px] text-slate-500">${item.timeAgo || item.date}</span>
            </div>
            <h4 class="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition line-clamp-2">
              ${item.title}
            </h4>
            <p class="text-[11px] text-slate-400 line-clamp-1">
              ${item.summary || ''}
            </p>
          </div>
          <i class="fa-solid fa-chevron-right text-xs text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition shrink-0 mt-2"></i>
        </div>
      `).join('')}
    </div>
  `;
}

function openArticleModal(articleId, source = 'auto') {
  const modal = document.getElementById('article-reader-modal');
  if (!modal) return;

  const db = getNewsDatabase();
  let article = null;

  if (source === 'blue') {
    article = (db.blueTracker || []).find(x => x.id === articleId);
  } else if (source === 'news') {
    article = (db.recentNews || []).find(x => x.id === articleId);
  } else {
    article = (db.blueTracker || []).find(x => x.id === articleId) ||
              (db.recentNews || []).find(x => x.id === articleId);
  }

  if (!article) return;

  // Llenar campos del lector interno
  const tagEl = document.getElementById('article-modal-tag');
  const dateEl = document.getElementById('article-modal-date');
  const authorEl = document.getElementById('article-modal-author');
  const titleEl = document.getElementById('article-modal-title');
  const bodyEl = document.getElementById('article-modal-body');

  if (tagEl) {
    tagEl.innerText = article.category || article.tag || 'Noticia Oficial';
    tagEl.className = `text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${article.badgeColor || 'border-purple-500/50 bg-purple-950 text-purple-300'}`;
  }
  if (dateEl) dateEl.innerText = article.date || 'Reciente';
  if (authorEl) authorEl.innerText = `Por ${article.author || 'Blizzard Entertainment'}`;
  if (titleEl) titleEl.innerText = article.title;
  if (bodyEl) bodyEl.innerHTML = article.content || `<p class="text-slate-300 text-sm">${article.summary || ''}</p>`;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const modal = document.getElementById('article-reader-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeArticleModal();
});

document.addEventListener('DOMContentLoaded', () => {
  renderBlueTracker();
  renderRecentNews();
});
