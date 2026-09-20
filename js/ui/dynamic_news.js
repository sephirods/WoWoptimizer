// Componente Modular de Noticias (Blue Tracker + Recent News) y Lector Interno de Artículos para Midnight S2
const DEFAULT_PINNED_NEWS_IDS = ['blizz-30111968'];

(function initDynamicNews() {
  const NEWS_HTML = `
  <!-- SECTION: BLUE TRACKER & RECENT NEWS (MOBILE-FIRST) -->
  <section id="news" class="py-12 sm:py-16 px-3 sm:px-6 bg-[#0a0d16] border-y border-wow-border">
    <div class="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 sm:gap-4">
        <div>
          <div class="text-[10px] sm:text-xs font-mono text-purple-400 font-bold uppercase tracking-wider mb-1" data-i18n="newsBulletinBadge">Boletín Oficial</div>
          <h2 class="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-white" data-i18n="newsSectionTitle">Noticias de Midnight: Temporada 2</h2>
        </div>
        <span class="text-[11px] sm:text-xs text-slate-400 font-mono" data-i18n="newsSectionSubtitle">Actualizado continuamente con cada parche de balance</span>
      </div>

      <!-- Pinned News Highlights Section (Mobile-First) -->
      <div id="pinned-news-container" class="space-y-4 hidden">
        <!-- Rendered dynamically -->
      </div>

      <!-- 2 Columns Grid: Blue Tracker + Recent News -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        <!-- Column 1: Blue Tracker -->
        <div class="bg-wow-card border border-sky-500/30 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-wow-border gap-2 flex-wrap sm:flex-nowrap">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/50 flex items-center justify-center text-sky-400 text-sm font-bold shadow shrink-0">
                <i class="fa-solid fa-bullhorn"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white flex items-center gap-1.5 sm:gap-2">
                  Blue Tracker <span class="text-[10px] font-normal text-slate-400 hidden min-[400px]:inline">Oficial Blizzard</span>
                </h3>
              </div>
            </div>
            
            <!-- Filter Tabs: ALL, US, EU (Mobile Touch Targets) -->
            <div class="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-wow-border shrink-0 ml-auto">
              <button id="btn-blue-filter-all" onclick="setBlueRegionFilter('ALL')" class="blue-filter-btn px-3 py-1 rounded text-[11px] font-bold transition text-white bg-sky-900/80 border border-sky-500/60 shadow min-h-[30px]">ALL</button>
              <button id="btn-blue-filter-us" onclick="setBlueRegionFilter('US')" class="blue-filter-btn px-3 py-1 rounded text-[11px] font-bold transition text-slate-400 hover:text-white border border-transparent min-h-[30px]">US</button>
              <button id="btn-blue-filter-eu" onclick="setBlueRegionFilter('EU')" class="blue-filter-btn px-3 py-1 rounded text-[11px] font-bold transition text-slate-400 hover:text-white border border-transparent min-h-[30px]">EU</button>
            </div>
          </div>

          <!-- Feed Container -->
          <div id="blue-tracker-feed" class="bg-black/30 rounded-xl border border-wow-border divide-y divide-white/5 max-h-[460px] overflow-y-auto scrollbar-thin">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Column 2: Recent News & Theorycrafting -->
        <div class="bg-wow-card border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-wow-border gap-2">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 text-sm font-bold shadow shrink-0">
                <i class="fa-solid fa-newspaper"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white flex items-center gap-1.5 sm:gap-2">
                  Recent News <span class="text-[10px] font-normal text-slate-400 hidden min-[400px]:inline">& Guides S2</span>
                </h3>
              </div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300 font-bold shrink-0">
              Editorial Hub
            </span>
          </div>

          <!-- Feed Container -->
          <div id="recent-news-feed" class="bg-black/30 rounded-xl border border-wow-border divide-y divide-white/5 max-h-[460px] overflow-y-auto scrollbar-thin">
            <!-- Rendered dynamically -->
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- MODAL: LECTOR INTERNO DE ARTÍCULOS Y BLUE POSTS (MOBILE-FIRST & STICKY HEADER) -->
  <div id="article-reader-modal" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-6 hidden">
    <div class="bg-wow-panel border border-purple-500/40 rounded-2xl max-w-3xl w-full shadow-2xl max-h-[92vh] overflow-hidden relative flex flex-col">
      
      <!-- Sticky Top Bar (Permanece siempre fija arriba al hacer scroll) -->
      <div class="bg-[#10131d]/95 backdrop-blur border-b border-wow-border px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-3 shrink-0 z-10">
        <div class="flex items-center gap-2 flex-wrap min-w-0">
          <span id="article-modal-tag" class="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-purple-500/50 bg-purple-950 text-purple-300 shrink-0">
            Blue Post
          </span>
          <span id="article-modal-date" class="text-[11px] sm:text-xs text-slate-400 font-mono shrink-0">
            Reciente
          </span>
          <span class="text-slate-600 hidden min-[380px]:inline">&bull;</span>
          <span id="article-modal-author" class="text-[11px] sm:text-xs text-amber-400 font-semibold truncate hidden min-[320px]:inline">
            Por Blizzard Entertainment
          </span>
        </div>
        
        <!-- Acciones: Botón Compartir + Botón Cerrar (Sticky) -->
        <div class="flex items-center gap-2 shrink-0">
          <button id="btn-share-article" onclick="shareCurrentArticle()" title="Compartir Noticia" class="px-3 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-300 hover:text-white flex items-center gap-1.5 transition text-xs font-semibold min-h-[34px] active:scale-95 shadow">
            <i class="fa-solid fa-share-nodes text-xs"></i>
            <span id="btn-share-article-label" class="hidden min-[450px]:inline">Compartir</span>
          </button>
          <button onclick="closeArticleModal()" title="Cerrar (Esc)" class="w-8 h-8 rounded-lg bg-black/50 hover:bg-red-950/70 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-500/40 flex items-center justify-center transition min-h-[34px] min-w-[34px] shadow active:scale-95">
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        </div>
      </div>

      <!-- Contenido Scrollable -->
      <div class="overflow-y-auto scrollbar-thin p-4 sm:p-8 space-y-4 sm:space-y-5 flex-1">
        <!-- Título Principal -->
        <h2 id="article-modal-title" class="font-cinzel text-lg sm:text-2xl font-black text-white leading-snug break-words">
          Título de la Noticia
        </h2>

        <!-- Cuerpo del Artículo -->
        <div id="article-modal-body" class="space-y-3 sm:space-y-4 py-2 border-b border-wow-border text-xs sm:text-sm">
          <!-- Inyectado dinámicamente -->
        </div>

        <!-- Pie del Lector -->
        <div class="flex items-center justify-between pt-2 flex-wrap gap-2.5">
          <div class="flex items-center gap-2">
            <a id="article-modal-external-link" href="#" target="_blank" rel="noopener noreferrer" class="hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/70 hover:bg-sky-900 border border-sky-500/50 text-sky-300 hover:text-white text-xs font-semibold transition min-h-[36px]">
              <span id="article-modal-external-label">Ver en Foro Oficial</span> <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
            <span class="text-[10px] sm:text-[11px] text-slate-500">
              WoW: Midnight S2 &bull; News Hub
            </span>
          </div>
          <button onclick="closeArticleModal()" class="w-full min-[400px]:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition min-h-[38px] flex items-center justify-center">
            Cerrar
          </button>
        </div>
      </div>

    </div>
  </div>

  `;

  // Montar sección en el contenedor designado #app-news-container
  function mountNewsComponent() {
    const container = document.getElementById('app-news-container');
    if (!container) return; // Si esta URL/página no solicita noticias, no hace nada

    container.innerHTML = NEWS_HTML;

    // Actualizar i18n en los nuevos nodos si está disponible
    if (typeof updateLanguageUI === 'function') {
      try { updateLanguageUI(); } catch (e) {}
    }

    // Renderizar contenidos de los feeds
    renderPinnedNews();
    renderBlueTracker();
    renderRecentNews();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountNewsComponent);
  } else {
    mountNewsComponent();
  }
})();

// Control de Filtros, Idioma y Datos del Lector
let activeBlueRegionFilter = 'ALL';
let currentOpenArticleId = null;
let currentOpenArticleSource = 'auto';

function getActiveLanguage() {
  if (typeof currentLang !== 'undefined' && (currentLang === 'en' || currentLang === 'es' || currentLang === 'mx')) {
    return currentLang === 'en' ? 'en' : 'es';
  }
  try {
    const saved = localStorage.getItem('wow_lang');
    if (saved === 'en') return 'en';
  } catch (e) {}
  return 'es';
}

function resolveLocalized(field, lang) {
  if (!field) return '';
  if (typeof field === 'object' && !Array.isArray(field)) {
    return field[lang] || field['en'] || field['es'] || '';
  }
  return String(field);
}

function getNewsDatabase() {
  // 1. Si el usuario subió datos personalizados en el panel admin
  try {
    const custom = localStorage.getItem('wow_custom_news_data');
    if (custom) return JSON.parse(custom);
  } catch (e) {}

  // 2. Base de datos oficial local empaquetada (siempre fresca y con traducciones verificadas)
  const baseDb = window.WOW_NEWS_DATABASE || { blueTracker: [], recentNews: [] };

  // 3. Si el sincronizador en vivo descargó nuevos hilos más recientes, fusionarlos
  // sin pisar nunca los contenidos completos ni las traducciones nativas verificadas
  if (window.WOW_LIVE_NEWS_DATA && window.WOW_LIVE_NEWS_DATA.blueTracker && window.WOW_LIVE_NEWS_DATA.blueTracker.length > 0) {
    const liveBlues = window.WOW_LIVE_NEWS_DATA.blueTracker;
    const baseMap = new Map();
    (baseDb.blueTracker || []).forEach(b => { if (b.id) baseMap.set(b.id, b); });

    // Enriquecer o incorporar nuevos
    liveBlues.forEach(lb => {
      if (baseMap.has(lb.id)) {
        const existing = baseMap.get(lb.id);
        // Si el baseDb tiene contenido completo, protegerlo
        if (existing.hasFullContent) {
          lb.content = existing.content;
          lb.hasFullContent = true;
        }
        if (existing.originalUrl) {
          lb.originalUrl = existing.originalUrl;
        }
      }
      baseMap.set(lb.id, lb);
    });

    return {
      blueTracker: Array.from(baseMap.values()),
      recentNews: (window.WOW_LIVE_NEWS_DATA.recentNews && window.WOW_LIVE_NEWS_DATA.recentNews.length > 0) ? window.WOW_LIVE_NEWS_DATA.recentNews : (baseDb.recentNews || [])
    };
  }

  return baseDb;
}

function setBlueRegionFilter(region) {
  activeBlueRegionFilter = region;
  document.querySelectorAll('.blue-filter-btn').forEach(btn => {
    btn.className = 'blue-filter-btn px-3 py-1 rounded text-[11px] font-bold transition text-slate-400 hover:text-white border border-transparent min-h-[30px]';
  });
  const activeBtn = document.getElementById(`btn-blue-filter-${region.toLowerCase()}`);
  if (activeBtn) {
    activeBtn.className = 'blue-filter-btn px-3 py-1 rounded text-[11px] font-bold transition text-white bg-sky-900/80 border border-sky-500/60 shadow min-h-[30px]';
  }
  renderBlueTracker();
}

function getPinnedNewsIds() {
  try {
    const raw = localStorage.getItem('wow_pinned_news_ids');
    if (raw === null) return DEFAULT_PINNED_NEWS_IDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_PINNED_NEWS_IDS;
  } catch (e) {
    return DEFAULT_PINNED_NEWS_IDS;
  }
}

function renderPinnedNews() {
  const container = document.getElementById('pinned-news-container');
  if (!container) return;

  const pinnedIds = getPinnedNewsIds();
  if (pinnedIds.length === 0) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const lang = getActiveLanguage();
  const db = getNewsDatabase();
  const allArticles = [...(db.blueTracker || []), ...(db.recentNews || [])];
  
  // Agrupar canónicamente para evitar que fijar US y EU duplique la misma tarjeta
  const groupedArticles = typeof groupCanonicalNews === 'function' ? groupCanonicalNews(allArticles) : allArticles;

  // Filtrar los artículos fijados que coincidan por ID principal o por alguno de sus alias
  const isPinnedArticle = (item) => {
    if (!item) return false;
    if (pinnedIds.includes(item.id)) return true;
    if (item.aliasIds && item.aliasIds.some(aid => pinnedIds.includes(aid))) return true;
    return false;
  };

  const pinnedArticles = groupedArticles.filter(isPinnedArticle);

  if (pinnedArticles.length === 0) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');

  const titleText = lang === 'en' ? 'Pinned Highlights' : 'Noticias Destacadas';
  const badgeText = lang === 'en' ? 'Featured' : 'Destacado';
  const readFullText = lang === 'en' ? 'Read full post' : 'Leer publicación completa';

  container.innerHTML = `
    <div class="bg-gradient-to-r from-amber-950/40 via-purple-950/20 to-sky-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden space-y-4">
      <div class="flex items-center justify-between gap-3 border-b border-amber-500/20 pb-3 flex-wrap">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-sm shadow shrink-0">
            <i class="fa-solid fa-thumbtack"></i>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
              <span>${titleText}</span>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                ${pinnedArticles.length}
              </span>
            </h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 ${pinnedArticles.length > 1 ? 'md:grid-cols-2' : ''} gap-3 sm:gap-4">
        ${pinnedArticles.map(item => {
          const itemTitle = resolveLocalized(item.title, lang);
          const itemSummary = resolveLocalized(item.summary, lang);
          const isBlue = (item.source === 'blizzard' || !item.source);
          const sourceTag = isBlue 
            ? 'Blue Post' 
            : 'Wowhead News';
          const timeDisplay = item.dateRaw 
            ? (typeof getRelativeTimeString === 'function' ? getRelativeTimeString(item.dateRaw, lang) : (typeof formatReadableDate === 'function' ? formatReadableDate(item.dateRaw, lang) : new Date(item.dateRaw).toLocaleDateString()))
            : (resolveLocalized(item.timeAgo, lang) || resolveLocalized(item.date, lang) || 'Reciente');

          return `
            <div onclick="openArticleModal('${item.id}', '${isBlue ? 'blue' : 'news'}')" class="group cursor-pointer bg-black/50 hover:bg-black/80 border border-amber-500/30 hover:border-amber-400/80 rounded-xl p-3.5 sm:p-4 transition duration-200 shadow-md flex flex-col justify-between gap-2.5 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition"></div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/60 bg-amber-500/20 text-amber-300 flex items-center gap-1 shadow-sm">
                    <i class="fa-solid fa-thumbtack text-[8px]"></i> ${badgeText}
                  </span>
                  <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${isBlue ? 'border-sky-500/50 bg-sky-950 text-sky-300' : 'bg-purple-950 text-purple-300 border-purple-500/40'}">
                    ${sourceTag}
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">${timeDisplay}</span>
                </div>
                <h4 class="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                  ${itemTitle}
                </h4>
                <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  ${itemSummary}
                </p>
              </div>
              <div class="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] font-semibold text-amber-400/90 group-hover:text-amber-300">
                <span class="flex items-center gap-1">
                  ${readFullText} <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition"></i>
                </span>
                <span class="text-[10px] text-slate-500 font-mono">${item.author || 'Blizzard'}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Escuchar cambios de noticias fijadas entre pestañas y panel admin
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'wow_pinned_news_ids' || e.key === 'wow_custom_news_data') {
      renderPinnedNews();
    }
  });
  window.addEventListener('wow_pinned_news_updated', () => {
    renderPinnedNews();
  });
}

function renderBlueTracker() {
  const container = document.getElementById('blue-tracker-feed');
  if (!container) return;

  const lang = getActiveLanguage();
  const db = getNewsDatabase();
  let list = (db.blueTracker || []).slice();
  list.sort((a, b) => new Date(b.dateRaw || 0) - new Date(a.dateRaw || 0));

  const filtered = activeBlueRegionFilter === 'ALL'
    ? list
    : list.filter(item => (item.region || 'US').toUpperCase() === activeBlueRegionFilter.toUpperCase());

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-500">
        ${lang === 'en' ? 'No Blue Tracker posts found for this region.' : 'No hay publicaciones en el Blue Tracker para esta región.'}
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="divide-y divide-white/5">
      ${filtered.map(item => {
        const itemTitle = resolveLocalized(item.title, lang);
        const itemSummary = resolveLocalized(item.summary, lang);
        const timeDisplay = item.dateRaw 
          ? (typeof getRelativeTimeString === 'function' ? getRelativeTimeString(item.dateRaw, lang) : formatReadableDate(item.dateRaw, lang))
          : (resolveLocalized(item.timeAgo, lang) || resolveLocalized(item.date, lang) || 'Reciente');

        return `
          <div onclick="openArticleModal('${item.id}', 'blue')" class="p-3.5 hover:bg-sky-950/20 transition cursor-pointer flex items-start justify-between gap-3 group">
            <div class="space-y-1 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${item.region === 'US' ? 'bg-red-950 text-red-300 border-red-500/40' : 'bg-blue-950 text-blue-300 border-blue-500/40'}">
                  ${item.region || 'US'}
                </span>
                <span class="text-[10px] font-bold text-sky-400 flex items-center gap-1">
                  <i class="fa-solid fa-bullhorn text-[9px]"></i> ${item.tag || 'Blizzard'}
                </span>
                <span class="text-[10px] text-slate-500">${timeDisplay}</span>
              </div>
              <h4 class="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition line-clamp-2 leading-relaxed">
                ${itemTitle}
              </h4>
              <p class="text-[11px] text-slate-400 line-clamp-1">
                ${itemSummary}
              </p>
            </div>
            <i class="fa-solid fa-chevron-right text-xs text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition shrink-0 mt-2"></i>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderRecentNews() {
  const container = document.getElementById('recent-news-feed');
  if (!container) return;

  const lang = getActiveLanguage();
  const db = getNewsDatabase();
  const list = db.recentNews || [];

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-500">
        ${lang === 'en' ? 'No recent news articles at this moment.' : 'No hay noticias editoriales en este momento.'}
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="divide-y divide-white/5">
      ${list.map(item => {
        const itemTitle = resolveLocalized(item.title, lang);
        const itemSummary = resolveLocalized(item.summary, lang);
        const timeDisplay = item.dateRaw 
          ? (typeof getRelativeTimeString === 'function' ? getRelativeTimeString(item.dateRaw, lang) : formatReadableDate(item.dateRaw, lang))
          : (resolveLocalized(item.timeAgo, lang) || resolveLocalized(item.date, lang) || 'Reciente');

        return `
          <div onclick="openArticleModal('${item.id}', 'news')" class="p-3.5 hover:bg-amber-950/20 transition cursor-pointer flex items-start justify-between gap-3 group">
            <div class="space-y-1 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border bg-purple-950 text-purple-300 border-purple-500/40">
                  ${item.category || 'Retail News'}
                </span>
                <span class="text-[10px] text-slate-500">${timeDisplay}</span>
              </div>
              <h4 class="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition line-clamp-2 leading-relaxed">
                ${itemTitle}
              </h4>
              <p class="text-[11px] text-slate-400 line-clamp-1">
                ${itemSummary}
              </p>
            </div>
            <i class="fa-solid fa-chevron-right text-xs text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition shrink-0 mt-2"></i>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function openArticleModal(articleId, source = 'auto') {
  currentOpenArticleId = articleId;
  currentOpenArticleSource = source;

  const modal = document.getElementById('article-reader-modal');
  if (!modal) return;

  const lang = getActiveLanguage();
  const db = getNewsDatabase();
  const allArticles = [...(db.blueTracker || []), ...(db.recentNews || [])];
  const groupedArticles = typeof groupCanonicalNews === 'function' ? groupCanonicalNews(allArticles) : allArticles;

  article = groupedArticles.find(x => x.id === articleId || (x.aliasIds && x.aliasIds.includes(articleId))) ||
            allArticles.find(x => x.id === articleId);

  if (!article) return;

  const tagEl = document.getElementById('article-modal-tag');
  const dateEl = document.getElementById('article-modal-date');
  const authorEl = document.getElementById('article-modal-author');
  const titleEl = document.getElementById('article-modal-title');
  const bodyEl = document.getElementById('article-modal-body');

  const titleText = resolveLocalized(article.title, lang);
  const contentText = resolveLocalized(article.content, lang);
  const summaryText = resolveLocalized(article.summary, lang);
  const dateText = article.dateRaw
    ? (typeof formatReadableDate === 'function' ? formatReadableDate(article.dateRaw, lang) : article.dateRaw)
    : (resolveLocalized(article.date, lang) || 'Reciente');

  if (tagEl) {
    tagEl.innerText = article.category || article.tag || 'Noticia Oficial';
    tagEl.className = `text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${article.badgeColor || 'border-purple-500/50 bg-purple-950 text-purple-300'}`;
  }
  if (dateEl) dateEl.innerText = dateText;
  if (authorEl) authorEl.innerText = `${lang === 'en' ? 'By' : 'Por'} ${article.author || 'Blizzard Entertainment'}`;
  if (titleEl) titleEl.innerText = titleText;
  if (bodyEl) bodyEl.innerHTML = contentText || `<p class="text-slate-300 text-sm leading-relaxed">${summaryText}</p>`;

  // Configurar botón de enlace a la fuente oficial si existe originalUrl
  const extLink = document.getElementById('article-modal-external-link');
  const extLabel = document.getElementById('article-modal-external-label');
  if (extLink) {
    if (article.originalUrl) {
      extLink.href = article.originalUrl;
      extLink.classList.remove('hidden');
      if (extLabel) {
        if (article.source === 'blizzard') {
          extLabel.innerText = lang === 'en' ? 'View Official Forum Thread' : 'Ver en Foro Oficial';
        } else if (article.source === 'wowhead') {
          extLabel.innerText = lang === 'en' ? 'View on Wowhead' : 'Ver en Wowhead';
        } else {
          extLabel.innerText = lang === 'en' ? 'Official Source' : 'Fuente Oficial';
        }
      }
    } else {
      extLink.classList.add('hidden');
    }
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Actualizar el hash en la URL del navegador sin recargar para que refleje la noticia abierta
  try {
    const targetHash = `#news-${article.id}`;
    if (window.location.hash !== targetHash) {
      if (window.location.protocol === 'file:') {
        window.location.hash = targetHash;
      } else {
        history.replaceState(null, '', window.location.pathname + window.location.search + targetHash);
      }
    }
  } catch (e) {}

  // Si es un post de Blizzard y no tiene cuerpo completo, intentar traerlo discretamente en segundo plano sin bloquear ni mostrar spinners congelados
  const needsFullFetch = article.source === 'blizzard' && !article.hasFullContent && (article.postId || article.id);
  if (needsFullFetch) {
    const rawPostId = article.postId || (article.id && article.id.startsWith('blizz-') ? article.id.replace('blizz-', '') : null);
    if (rawPostId) {
      const postJsonUrl = `https://${article.forumDomain || 'us.forums.blizzard.com'}/en/wow/posts/${rawPostId}.json`;
      
      (async () => {
        try {
          let fullData = null;
          try {
            const directRes = await fetch(postJsonUrl, { signal: AbortSignal.timeout(2500) });
            if (directRes.ok) fullData = await directRes.json();
          } catch (e) {}

          if (!fullData) {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(postJsonUrl)}`;
            const proxyRes = await fetch(proxyUrl, { signal: AbortSignal.timeout(3500) });
            if (proxyRes.ok) fullData = await proxyRes.json();
          }

          if (fullData && fullData.cooked) {
            const translatedCooked = typeof translateCookedContent === 'function' ? translateCookedContent(fullData.cooked) : fullData.cooked;
            article.content = {
              en: `<div class="blizzard-full-post space-y-4 text-xs sm:text-sm leading-relaxed">${fullData.cooked}</div>`,
              es: `<div class="blizzard-full-post space-y-4 text-xs sm:text-sm leading-relaxed">${translatedCooked}</div>`
            };
            article.hasFullContent = true;

            // Si el modal sigue abierto con este artículo, actualizarlo limpiamente
            if (currentOpenArticleId === articleId && !modal.classList.contains('hidden')) {
              bodyEl.innerHTML = resolveLocalized(article.content, lang) || fullData.cooked;
            }
          }
        } catch (err) {
          // Si falla o se demora, se mantiene intacto el resumen existente sin bloquear al usuario
        }
      })();
    }
  }
}

function shareCurrentArticle() {
  const lang = getActiveLanguage();
  const db = getNewsDatabase();
  const article = (db.blueTracker || []).find(x => x.id === currentOpenArticleId) ||
                  (db.recentNews || []).find(x => x.id === currentOpenArticleId);

  if (!article) return;

  // Construir URL limpia
  let shareUrl = '';
  if (window.location.protocol === 'file:') {
    shareUrl = `${window.location.href.split('#')[0]}#news-${article.id}`;
  } else {
    shareUrl = `${window.location.origin}${window.location.pathname}#news-${article.id}`;
  }

  const btnLabel = document.getElementById('btn-share-article-label');
  const btnShare = document.getElementById('btn-share-article');

  const showCopiedFeedback = () => {
    if (btnLabel) btnLabel.innerText = lang === 'en' ? 'Copied!' : '¡Copiado!';
    if (btnShare) {
      btnShare.classList.add('bg-emerald-950/80', 'border-emerald-500/60', 'text-emerald-300');
      btnShare.classList.remove('bg-purple-950/70', 'border-purple-500/40', 'text-purple-300');
    }
    setTimeout(() => {
      if (btnLabel) btnLabel.innerText = lang === 'en' ? 'Share' : 'Compartir';
      if (btnShare) {
        btnShare.classList.remove('bg-emerald-950/80', 'border-emerald-500/60', 'text-emerald-300');
        btnShare.classList.add('bg-purple-950/70', 'border-purple-500/40', 'text-purple-300');
      }
    }, 2200);
  };

  // Copiar directamente al portapapeles (evitando navigator.share de Chrome que crashea en file://)
  copyToClipboard(shareUrl, showCopiedFeedback);
}

function copyToClipboard(text, onSuccess) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
      fallbackCopy(text, onSuccess);
    });
  } else {
    fallbackCopy(text, onSuccess);
  }
}

function fallbackCopy(text, onSuccess) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    if (onSuccess) onSuccess();
  } catch (e) {}
  document.body.removeChild(input);
}

function closeArticleModal() {
  currentOpenArticleId = null;
  const modal = document.getElementById('article-reader-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  // Limpiar el hash de la URL si apuntaba a una noticia
  try {
    if (window.location.hash && window.location.hash.startsWith('#news-')) {
      if (window.location.protocol === 'file:') {
        window.location.hash = '';
      } else {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  } catch (e) {}
}

// Abrir artículo directo desde hash de URL (p. ej. index.html#news-blizz-30111968)
function checkUrlHashForArticle() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#news-')) {
    const articleId = hash.replace('#news-', '');
    setTimeout(() => {
      if (typeof openArticleModal === 'function') {
        openArticleModal(articleId);
      }
    }, 200);
  }
}

// Re-sincronizar el modal abierto al conmutar idioma
function refreshArticleModalLanguage() {
  if (currentOpenArticleId) {
    const modal = document.getElementById('article-reader-modal');
    if (modal && !modal.classList.contains('hidden')) {
      openArticleModal(currentOpenArticleId, currentOpenArticleSource);
    }
  }
}

// Escuchar cambios de hash en la URL (por ejemplo si el usuario pega un enlace directo o usa atrás/adelante)
window.addEventListener('hashchange', checkUrlHashForArticle);

// Al cargar la página, comprobar si viene con hash de noticia
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkUrlHashForArticle, 350);
  });
} else {
  setTimeout(checkUrlHashForArticle, 350);
}

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeArticleModal();
});



