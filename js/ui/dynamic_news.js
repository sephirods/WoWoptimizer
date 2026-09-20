// Componente Modular de Noticias (Blue Tracker + Recent News) y Lector Interno de Artículos para Midnight S2
const DEFAULT_PINNED_NEWS_IDS = ['blizz-30111968', 'blizz-24302093'];

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

      <!-- Blizzard Official News Carousel / Cards Section -->
      <div id="blizzard-news-container" class="space-y-4">
        <!-- Rendered dynamically -->
      </div>

      <!-- 2 Columns Grid: Blue Tracker + Recent News -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 bg-transparent border-none">
        
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

    // Cargar siempre la configuración de noticias fijadas fresca del servidor (Zero-Cache)
    if (typeof fetch !== 'undefined') {
      fetch(`js/data/pinned_news.js?_t=${Date.now()}`, { cache: 'no-store' })
        .then(res => res.text())
        .then(code => {
          try {
            // Ejecutar dinámicamente el script fresco
            const fn = new Function(code);
            fn();
            if (typeof renderPinnedNews === 'function') renderPinnedNews();
            if (typeof renderBlizzardNews === 'function') renderBlizzardNews();
          } catch (e) {}
        })
        .catch(() => {});
    }

    // Renderizar contenidos de los feeds
    renderPinnedNews();
    renderBlizzardNews();
    renderBlueTracker();
    renderRecentNews();

    // Generar/actualizar Schema.org JSON-LD (NewsArticle / ItemList) para SEO
    if (typeof injectNewsSeoSchema === 'function') {
      try { injectNewsSeoSchema(); } catch (e) {}
    }
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
let previousScrollY = 0;

// Embellecedor visual para artículos de Wowhead (añade jerarquía, badges y subtítulos estilizados)
function formatWowheadEditorialContent(html) {
  if (!html) return '';
  let res = html;

  // 1. Quitar cajas repetitivas de aviso inicial
  res = res.replace(/<div class="bg-amber-950\/30 border border-amber-500\/40[\s\S]*?<\/div>\s*<\/div>/gi, '');

  // 2. Dar formato a los subtítulos comunes que vienen en etiquetas <p> simples
  const headingPatterns = [
    /^(What’s New|What's New|Bring Your Sea Shanty|Swashbuckling Skyriding Style|Join the Beach Party|WoW Classic|Why Does This Matter\?|Guaranteed Nymrissa Loot|Flexible Mythic Slot|Pirate's Day Guide)/i,
    /^(When|Where)\s*:/i,
    /^(Source|Cost)\s*:/i
  ];

  res = res.replace(/<p>([A-Za-z0-9\s'’\?,—:\!\.]{3,65})<\/p>/g, (match, text) => {
    const trimmed = text.trim();
    if (headingPatterns[0].test(trimmed)) {
      return `<h3 class="font-cinzel text-base sm:text-lg font-bold text-amber-300 pt-3 pb-1 border-b border-amber-500/20 flex items-center gap-2"><i class="fa-solid fa-compass text-xs text-amber-400"></i> ${trimmed}</h3>`;
    }
    return match;
  });

  // 3. Estilizar líneas de metadatos de objetos (Source: ..., Cost: ...)
  res = res.replace(/<p>(Pirate's Eyepatch|[\w\s'’]+)<br>Source:\s*([^<]+)<br>Cost:\s*([^<]*)<\/p>/gi, (match, item, src, cost) => {
    return `
      <div class="my-3 p-3 rounded-xl bg-black/40 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xs">
            <i class="fa-solid fa-shirt"></i>
          </div>
          <div>
            <div class="font-bold text-xs sm:text-sm text-emerald-400">${item}</div>
            <div class="text-[11px] text-slate-400">Fuente: <span class="text-slate-200">${src.trim()}</span></div>
          </div>
        </div>
        ${cost.trim() ? `<div class="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold self-start sm:self-auto">${cost.trim()}</div>` : ''}
      </div>
    `;
  });

  return res;
}

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

// Extraer extracto limpio (~150 caracteres) eliminando HTML, saltos y avisos redundantes
function getArticleExcerpt(item, lang = 'es', maxLength = 160) {
  if (!item) return '';
  
  // 1. Probar campo summary localizado
  const rawSummary = resolveLocalized(item.summary, lang);
  if (rawSummary && rawSummary.trim() && rawSummary.trim() !== '...' && rawSummary.trim().length > 10) {
    let clean = rawSummary.replace(/^\[.*?\]\s*/, '').trim();
    if (clean.length > maxLength) {
      return clean.slice(0, maxLength).trim() + '...';
    }
    return clean;
  }

  // 2. Extraer del contenido HTML (contentHtml o content)
  const rawContent = resolveLocalized(item.contentHtml || item.content, lang) || resolveLocalized(item.content, lang) || '';
  if (rawContent) {
    // Buscar párrafos reales ignorando etiquetas vacías o de sólo imagen
    const plain = rawContent
      .replace(/<aside[\s\S]*?<\/aside>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    if (plain && plain.length > 15) {
      if (plain.length > maxLength) {
        return plain.slice(0, maxLength).trim() + '...';
      }
      return plain;
    }
  }

  // 3. Fallback al título
  return resolveLocalized(item.title, lang) || '';
}

// Formateador robusto de tiempo relativo (soporta ISO 8601 y fechas de texto en español)
function getArticleRelativeTime(dateStr, lang = 'es') {
  if (!dateStr) return lang === 'en' ? 'Recent' : 'Reciente';

  let timestamp = NaN;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    timestamp = d.getTime();
  } else {
    // Parsear formatos comunes de Blizzard en español (ej: "12 de septiembre de 2026")
    const match = String(dateStr).match(/([0-9]{1,2})\s+de\s+([a-zA-Záéíóúñ]+)\s+de\s+([0-9]{4})/i);
    if (match) {
      const months = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
      const mNum = months[match[2].toLowerCase()];
      if (mNum !== undefined) {
        timestamp = new Date(parseInt(match[3]), mNum, parseInt(match[1])).getTime();
      }
    }
  }

  if (isNaN(timestamp)) {
    // Si no se puede parsear a timestamp, retornar el texto original si no es vacío
    return dateStr;
  }

  const diffMs = Date.now() - timestamp;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return lang === 'en' ? 'Just now' : 'Hace un momento';
  } else if (diffHours < 24) {
    return lang === 'en' ? `${diffHours}h ago` : `Hace ${diffHours}h`;
  } else if (diffDays <= 30) {
    return lang === 'en' ? `${diffDays}d ago` : `Hace ${diffDays}d`;
  } else {
    // Si pasaron más de 30 días, mostrar la fecha legible corta
    return new Date(timestamp).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}


function getNewsDatabase() {
  // 1. Si el usuario subió datos personalizados en el panel admin
  try {
    const custom = localStorage.getItem('wow_custom_news_data');
    if (custom) return JSON.parse(custom);
  } catch (e) {}

  // 2. Base de datos oficial local empaquetada (siempre fresca y con traducciones verificadas)
  const baseDb = window.WOW_NEWS_DATABASE || { blueTracker: [], blizzardNews: [], recentNews: [] };

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

    // Asegurar que las noticias Wowhead enriquecidas y verificadas de baseDb se preserven
    const liveNewsList = (window.WOW_LIVE_NEWS_DATA.recentNews && window.WOW_LIVE_NEWS_DATA.recentNews.length > 0) ? window.WOW_LIVE_NEWS_DATA.recentNews : (baseDb.recentNews || []);
    const mergedRecentMap = new Map();
    liveNewsList.forEach(item => { if (item.id) mergedRecentMap.set(item.id, item); });
    (baseDb.recentNews || []).forEach(item => { if (item.id) mergedRecentMap.set(item.id, item); });

    return {
      blueTracker: Array.from(baseMap.values()),
      blizzardNews: baseDb.blizzardNews || [],
      recentNews: Array.from(mergedRecentMap.values())
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
  const allArticles = [...(db.blueTracker || []), ...(db.blizzardNews || []), ...(db.recentNews || [])];
  
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

      <div class="grid grid-cols-1 ${pinnedArticles.length > 1 ? 'md:grid-cols-2' : ''} gap-3 sm:gap-4 bg-transparent border-none">
        ${pinnedArticles.map(item => {
          const itemTitle = resolveLocalized(item.title, lang);
          const itemSummary = getArticleExcerpt(item, lang, 150);
          const isBlizz = item.category === 'Oficial' || (item.id && item.id.startsWith('blizz-24'));
          const isBlue = !isBlizz && (item.source === 'blizzard' || !item.source);
          
          let sourceTag = 'Wowhead News';
          let sourceModal = 'news';
          let tagClass = 'bg-purple-950 text-purple-300 border-purple-500/40';
          
          if (isBlizz) {
            sourceTag = 'Blizzard Oficial';
            sourceModal = 'blizzard';
            tagClass = 'bg-sky-950 text-sky-300 border-sky-500/60';
          } else if (isBlue) {
            sourceTag = 'Blue Post';
            sourceModal = 'blue';
            tagClass = 'bg-sky-950 text-sky-300 border-sky-500/50';
          }

          const timeDisplay = item.dateRaw 
            ? getArticleRelativeTime(item.dateRaw, lang)
            : (resolveLocalized(item.timeAgo, lang) || resolveLocalized(item.date, lang) || 'Reciente');

          return `
            <div onclick="openArticleModal('${item.id}', '${sourceModal}')" class="group cursor-pointer bg-black/50 hover:bg-black/80 border border-amber-500/30 hover:border-amber-400/80 rounded-xl p-3.5 sm:p-4 transition duration-200 shadow-md flex flex-col justify-between gap-2.5 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition"></div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/60 bg-amber-500/20 text-amber-300 flex items-center gap-1 shadow-sm">
                    <i class="fa-solid fa-thumbtack text-[8px]"></i> ${badgeText}
                  </span>
                  <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${tagClass}">
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
      renderBlizzardNews();
    }
  });
  window.addEventListener('wow_pinned_news_updated', () => {
    renderPinnedNews();
    renderBlizzardNews();
  });
}

function renderBlizzardNews() {
  const container = document.getElementById('blizzard-news-container');
  if (!container) return;

  const lang = getActiveLanguage();
  const db = getNewsDatabase();
  const list = db.blizzardNews || [];

  if (list.length === 0) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');

  const titleText = lang === 'en' ? 'Blizzard Official Articles & Features' : 'Artículos Oficiales de Blizzard';
  const badgeText = lang === 'en' ? 'Official' : 'Oficial';
  const readFullText = lang === 'en' ? 'Read full article' : 'Leer artículo completo';

  container.innerHTML = `
    <div class="bg-wow-card border border-sky-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-sky-500/20 gap-3 flex-wrap">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/50 flex items-center justify-center text-sky-400 text-sm font-bold shadow shrink-0">
            <i class="fa-solid fa-scroll"></i>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>${titleText}</span>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300">
                ${list.length}
              </span>
            </h3>
          </div>
        </div>
        <span class="text-[11px] font-mono text-sky-400/80 flex items-center gap-1.5">
          <i class="fa-solid fa-circle-check text-[10px]"></i> ${lang === 'en' ? 'Verified Blizzard Editorial' : 'Editorial Verificada de Blizzard'}
        </span>
      </div>

      <!-- Grid responsive horizontal / 3 columnas en desktop -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 bg-transparent border-none">
        ${list.map(item => {
          const itemTitle = resolveLocalized(item.title, lang);
          const itemSummary = resolveLocalized(item.summary, lang);
          const timeDisplay = item.dateRaw || 'Reciente';
          const coverImg = item.imageUrl || 'https://bnetcmsus-a.akamaihd.net/cms/blog_header/p9/P9HCAU7X9HSV1789250934116.png';

          return `
            <div onclick="openArticleModal('${item.id}', 'blizzard')" class="group cursor-pointer bg-black/40 hover:bg-black/70 border border-sky-500/25 hover:border-sky-400/70 rounded-xl overflow-hidden transition duration-200 shadow-md flex flex-col justify-between">
              <!-- Cover Image -->
              <div class="w-full h-36 sm:h-40 overflow-hidden relative bg-black/60 shrink-0">
                <img src="${coverImg}" alt="${itemTitle}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                <span class="absolute top-2.5 left-2.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-sky-400/60 bg-sky-950/90 text-sky-200 shadow">
                  ${badgeText}
                </span>
              </div>

              <!-- Content details -->
              <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                <div class="space-y-1.5">
                  <div class="text-[10px] text-sky-400 font-mono flex items-center gap-1.5">
                    <i class="fa-regular fa-calendar-days text-[10px]"></i> ${timeDisplay}
                  </div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-sky-300 transition line-clamp-2 leading-snug">
                    ${itemTitle}
                  </h4>
                </div>

                <div class="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-sky-400 group-hover:text-sky-300">
                  <span class="flex items-center gap-1">
                    ${readFullText} <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition"></i>
                  </span>
                  <i class="fa-solid fa-book-open text-xs text-sky-500/60"></i>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Inyectar Schema.org JSON-LD (NewsArticle / ItemList) para posicionamiento orgánico en Google
function injectNewsSeoSchema() {
  if (typeof document === 'undefined') return;
  try {
    const db = getNewsDatabase();
    const lang = getActiveLanguage();
    const articles = [
      ...(db.pinnedHighlights || []),
      ...(db.blizzardNews || []),
      ...(db.blueTracker || []),
      ...(db.recentNews || [])
    ].slice(0, 10);

    if (!articles.length) return;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": lang === 'en' ? "World of Warcraft Midnight News & Balance Updates" : "Noticias y Ajustes de Balance de World of Warcraft Midnight",
      "itemListElement": articles.map((item, idx) => {
        const itemTitle = resolveLocalized(item.title, lang);
        const itemSummary = resolveLocalized(item.summary, lang) || itemTitle;
        let publishedDate = new Date().toISOString();
        if (item.dateRaw) {
          const parsed = new Date(item.dateRaw);
          if (!isNaN(parsed.getTime())) {
            publishedDate = parsed.toISOString();
          } else {
            const match = String(item.dateRaw).match(/([0-9]{1,2})\s+de\s+([a-zA-Záéíóúñ]+)\s+de\s+([0-9]{4})/i);
            if (match) {
              const months = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
              const mNum = months[match[2].toLowerCase()];
              if (mNum !== undefined) {
                publishedDate = new Date(parseInt(match[3]), mNum, parseInt(match[1])).toISOString();
              }
            }
          }
        }
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "NewsArticle",
            "headline": itemTitle,
            "description": itemSummary,
            "datePublished": publishedDate,
            "image": item.imageUrl || "https://bnetcmsus-a.akamaihd.net/cms/blog_header/p9/P9HCAU7X9HSV1789250934116.png",
            "author": {
              "@type": "Organization",
              "name": item.author || "Blizzard Entertainment"
            },
            "publisher": {
              "@type": "Organization",
              "name": "WoWOptimizer",
              "url": "https://wowoptimizer.wasmer.app/"
            },
            "mainEntityOfPage": `https://wowoptimizer.wasmer.app/#news-${item.id}`
          }
        };
      })
    };

    let scriptEl = document.getElementById('news-schema-jsonld');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'news-schema-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaData, null, 2);
  } catch (err) {
    console.warn('Error inyectando NewsArticle Schema:', err);
  }
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

        const coverThumb = item.imageUrl || (item.enclosure && item.enclosure.link) || null;

        return `
          <div onclick="openArticleModal('${item.id}', 'news')" class="p-3.5 hover:bg-amber-950/20 transition cursor-pointer flex items-center justify-between gap-3 group">
            ${coverThumb ? `
              <div class="w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border border-amber-500/30 bg-black/60 shrink-0">
                <img src="${coverThumb}" alt="${itemTitle}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
              </div>
            ` : ''}
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
            <i class="fa-solid fa-chevron-right text-xs text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition shrink-0"></i>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Embellece el contenido de Wowhead RSS dándole formato editorial premium:
 * - Convierte párrafos breves de una línea en subtítulos Cinzel dorados
 * - Formatea cajas de metadatos (Source / Cost / When / Where)
 * - Añade destacados visuales y bullets pulidos
 */
function formatWowheadEditorialContent(html) {
  if (!html) return html;
  let formatted = html;

  // 1. Eliminar la caja duplicada de "Artículo Oficial de Wowhead / Ver en Wowhead" dentro del cuerpo
  formatted = formatted.replace(/<div class="bg-amber-950\/30 border border-amber-500\/40 p-3\.5 rounded-xl text-xs flex items-center justify-between gap-3">[\s\S]*?<\/div>/gi, '');

  // 2. Corregir iconos rotos o artefactos morados en texto inline de clases (ej. Paladin's, Mage's)
  formatted = formatted.replace(/<span[^>]*style="[^"]*background-image:[^"]*class_[^"]*"[^>]*><\/span>/gi, '');
  formatted = formatted.replace(/<span class="c\d+">/gi, '<span class="font-bold text-amber-300">');

  // 2.1 Convertir contenedores wh-youtube en reproductores de YouTube embebidos interactivos
  formatted = formatted.replace(/<div class="[^"]*wh-youtube[^"]*"[^>]*style="[^"]*background:[^"]*url\((?:&quot;|"|')?https?:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/[^"'\)]*(?:&quot;|"|')?\)[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, (match, ytId) => {
    return `
      <div class="my-5 w-full flex justify-center">
        <div class="w-full max-w-2xl aspect-video rounded-xl overflow-hidden border border-amber-500/40 shadow-2xl bg-black">
          <iframe 
            src="https://www.youtube.com/embed/${ytId}?rel=0" 
            title="YouTube video player" 
            class="w-full h-full border-0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen 
            loading="lazy">
          </iframe>
        </div>
      </div>
    `;
  });

  // 3. Estilizar y balancear tablas: ancho 100%, bordes oscuros sutiles, cabecera resaltada y sin huecos negros
  formatted = formatted.replace(/<table[^>]*class="[^"]*grid[^"]*"[^>]*>/gi, '<div class="w-full overflow-x-auto my-4 rounded-xl border border-wow-border bg-[#0b0e17] shadow-lg"><table class="w-full text-left text-xs border-collapse">');
  formatted = formatted.replace(/<\/table>/gi, '</table></div>');
  formatted = formatted.replace(/<tr data-background="[^"]*">/gi, '<tr class="bg-purple-950/40 text-purple-200 border-b border-wow-border font-cinzel font-bold">');
  formatted = formatted.replace(/<tr>/gi, '<tr class="border-b border-white/5 hover:bg-white/[0.02] transition">');
  formatted = formatted.replace(/<td>/gi, '<td class="p-2.5 sm:p-3 text-slate-300">');
  formatted = formatted.replace(/<th>/gi, '<th class="p-2.5 sm:p-3 text-purple-200 font-semibold">');

  // 4. Transformar cajas de notas oficiales / hotfixes / citas en cajas temáticas de Blizzard brillantes
  formatted = formatted.replace(/<div class="box"[^>]*>([\s\S]*?)<\/div>/gi, (match, inner) => {
    return `
      <div class="my-4 p-4 rounded-xl bg-sky-950/30 border border-sky-500/40 text-xs sm:text-sm text-sky-200/95 space-y-2 shadow-lg backdrop-blur-sm relative overflow-hidden">
        <div class="flex items-center gap-2 text-sky-400 font-cinzel font-bold text-sm mb-1 pb-1.5 border-b border-sky-500/20">
          <i class="fa-solid fa-bullhorn text-xs"></i> Actualización Oficial de Balance
        </div>
        <div class="leading-relaxed space-y-2">${inner}</div>
      </div>
    `;
  });

  // 5. Formatear bloques de "Source: ... / Cost: ..." o "When: ... / Where: ..."
  formatted = formatted.replace(
    /<p>([^<]*?(?:Source|Cost|When|Where|Fecha|Lugar|Fuente|Costo):[^<]*?)<\/p>/gi,
    (match, inner) => {
      return `<div class="my-3 p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 font-medium space-y-1 shadow-inner">${inner}</div>`;
    }
  );

  // 6. Formatear párrafos cortos que actúan como encabezados temáticos (ej: <p>Swashbuckling Skyriding Style <br>...</p> o <p>Pirate's Day Guide</p>)
  formatted = formatted.replace(/<p>([A-Z0-9][A-Za-z0-9\s'’:,–—!?-]{3,50})<\/p>/g, (match, heading) => {
    // Evitar si parece un párrafo normal con punto final
    if (heading.endsWith('.') || heading.length > 55) return match;
    return `<h3 class="font-cinzel text-base sm:text-lg font-bold text-amber-300 mt-5 mb-2 pb-1 border-b border-amber-500/20 flex items-center gap-2"><i class="fa-solid fa-angles-right text-xs text-amber-400"></i> ${heading}</h3>`;
  });

  // 7. Formatear subtítulos con saltos de línea al inicio del párrafo (ej: <p>What’s New <br>...</p>)
  formatted = formatted.replace(/<p>([A-Z0-9][A-Za-z0-9\s'’:,–—!?-]{3,45})\s*<br\s*\/?>([\s\S]*?)<\/p>/g, (match, title, rest) => {
    if (title.endsWith('.') || title.length > 45) return match;
    return `
      <div class="mt-4 mb-3">
        <h4 class="font-cinzel text-sm sm:text-base font-bold text-amber-300 mb-1 flex items-center gap-2">
          <i class="fa-solid fa-feather text-amber-400 text-xs"></i> ${title}
        </h4>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${rest}</p>
      </div>
    `;
  });

  return formatted;
}

function openArticleModal(articleId, source = 'auto') {
  const modal = document.getElementById('article-reader-modal');
  if (!modal) return;

  // Si el modal está cerrado, capturar la posición actual de scroll del usuario
  if (modal.classList.contains('hidden')) {
    previousScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
  }

  currentOpenArticleId = articleId;
  currentOpenArticleSource = source;

  const lang = getActiveLanguage();
  const db = getNewsDatabase();

  // Priorizar búsqueda directa por ID exacto en la colección respectiva para evitar colisiones entre foros y artículos oficiales
  let article = null;
  if (source === 'blizzard' || articleId.startsWith('blizz-24')) {
    article = (db.blizzardNews || []).find(x => x.id === articleId);
  } else if (source === 'news' || articleId.startsWith('wh-')) {
    article = (db.recentNews || []).find(x => x.id === articleId);
  }

  if (!article) {
    const allArticles = [...(db.blizzardNews || []), ...(db.recentNews || []), ...(db.blueTracker || [])];
    const groupedArticles = typeof groupCanonicalNews === 'function' ? groupCanonicalNews(allArticles) : allArticles;
    article = allArticles.find(x => x.id === articleId) ||
              groupedArticles.find(x => x.id === articleId || (x.aliasIds && x.aliasIds.includes(articleId)));
  }

  if (!article) return;

  const tagEl = document.getElementById('article-modal-tag');
  const dateEl = document.getElementById('article-modal-date');
  const authorEl = document.getElementById('article-modal-author');
  const titleEl = document.getElementById('article-modal-title');
  const bodyEl = document.getElementById('article-modal-body');

  const titleText = resolveLocalized(article.title, lang);
  const contentText = resolveLocalized(article.contentHtml || article.content, lang) || resolveLocalized(article.content, lang) || (typeof article.contentHtml === 'string' ? article.contentHtml : '');
  const summaryText = resolveLocalized(article.summary, lang);
  
  let dateText = resolveLocalized(article.date, lang) || 'Reciente';
  if (article.dateRaw) {
    if (typeof formatReadableDate === 'function') {
      dateText = formatReadableDate(article.dateRaw, lang);
    } else {
      dateText = article.dateRaw;
    }
  }
  // Si formatReadableDate retornó 'Invalid Date' debido a formato de texto en español (ej. '12 de septiembre de 2026')
  if (!dateText || dateText.includes('Invalid Date')) {
    const rawVal = article.dateRaw || '';
    const match = rawVal.match(/([0-9]{1,2})\s+de\s+([a-zA-Záéíóúñ]+)\s+de\s+([0-9]{4})/i);
    if (match) {
      const months = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
      const mNum = months[match[2].toLowerCase()];
      if (mNum !== undefined) {
        const parsed = new Date(parseInt(match[3]), mNum, parseInt(match[1]));
        dateText = parsed.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
      } else {
        dateText = rawVal;
      }
    } else {
      dateText = rawVal || 'Reciente';
    }
  }

  if (tagEl) {
    tagEl.innerText = article.category || article.tag || 'Noticia Oficial';
    tagEl.className = `text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${article.badgeColor || 'border-purple-500/50 bg-purple-950 text-purple-300'}`;
  }
  if (dateEl) dateEl.innerText = dateText;
  if (authorEl) authorEl.innerText = `${lang === 'en' ? 'By' : 'Por'} ${article.author || 'Blizzard Entertainment'}`;
  if (titleEl) titleEl.innerText = titleText;
  // Detectar si el contenido contiene un enlace a un artículo oficial completo en el portal de noticias de Blizzard
  let targetExternalUrl = article.originalUrl;
  let isBlogArticle = false;
  const blogUrlMatch = contentText ? contentText.match(/href="([^"]*worldofwarcraft\.com\/[^"]*news\/[^"]*)"/i) : null;
  if (blogUrlMatch && blogUrlMatch[1]) {
    targetExternalUrl = blogUrlMatch[1];
    isBlogArticle = true;
  }

  // Si no hay imagen de encabezado en el cuerpo y el artículo tiene imagen de portada, agregarla al inicio del cuerpo
  let finalHtml = contentText;
  if (article.imageUrl && !finalHtml.includes('<img')) {
    finalHtml = `<div class="w-full rounded-xl overflow-hidden mb-4 border border-wow-border bg-black/60 shadow-lg flex items-center justify-center p-1"><img src="${article.imageUrl}" alt="${titleText}" class="w-full max-h-[480px] h-auto object-contain rounded-lg mx-auto" /></div>` + finalHtml;
  }

  // Eliminar enlaces redundantes tipo "Ver artículo completo" del cuerpo para evitar duplicidad
  finalHtml = finalHtml.replace(/<p[^>]*>\s*<a\s+href="[^"]*worldofwarcraft\.com\/[^"]*news\/[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi, '');
  finalHtml = finalHtml.replace(/<a\s+href="[^"]*worldofwarcraft\.com\/[^"]*news\/[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

  // Si el artículo proviene de Wowhead, embellecer la jerarquía editorial, encabezados y cajas de metadatos
  if (article.source === 'wowhead' && finalHtml) {
    finalHtml = formatWowheadEditorialContent(finalHtml);
  }

  if (bodyEl) bodyEl.innerHTML = finalHtml || `<p class="text-slate-300 text-sm leading-relaxed">${summaryText}</p>`;

  // Configurar botón de enlace a la fuente oficial si existe originalUrl o targetExternalUrl
  const extLink = document.getElementById('article-modal-external-link');
  const extLabel = document.getElementById('article-modal-external-label');
  if (extLink) {
    if (targetExternalUrl) {
      extLink.href = targetExternalUrl;
      extLink.classList.remove('hidden');
      if (extLabel) {
        if (isBlogArticle) {
          extLabel.innerText = lang === 'en' ? 'Read Full Article on Blizzard' : 'Leer Artículo Completo en Blizzard';
        } else if (article.source === 'blizzard') {
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

  // Actualizar el hash en la URL del navegador sin saltos de scroll
  try {
    const targetHash = `#news-${article.id}`;
    if (window.location.hash !== targetHash) {
      if (window.history && window.history.replaceState) {
        const urlBase = window.location.href.split('#')[0];
        window.history.replaceState(null, '', urlBase + targetHash);
      } else {
        window.location.hash = targetHash;
      }
    }
  } catch (e) {}

  // Si es un post de Blizzard y no tiene cuerpo completo, intentar traerlo discretamente en segundo plano sin bloquear ni mostrar spinners congelados
  const needsFullFetch = article.source === 'blizzard' && !article.hasFullContent && (article.postId || article.id);
  if (needsFullFetch) {
    const rawPostId = article.postId || (article.id && article.id.startsWith('blizz-') ? article.id.replace('blizz-', '') : null);
    if (rawPostId) {
      const postLangPrefix = (article.postLang === 'es') ? 'es' : 'en';
      const postJsonUrl = `https://${article.forumDomain || 'us.forums.blizzard.com'}/${postLangPrefix}/wow/posts/${rawPostId}.json`;
      
      (async () => {
        try {
          let fullData = null;
          try {
            const directRes = await fetch(postJsonUrl, { signal: AbortSignal.timeout(2500) });
            if (directRes.ok) fullData = await directRes.json();
          } catch (e) {}

          if (!fullData) {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(postJsonUrl)}`;
            try {
              const proxyRes = await fetch(proxyUrl, { signal: AbortSignal.timeout(4500) });
              if (proxyRes.ok) fullData = await proxyRes.json();
            } catch (e) {}
          }

          if (!fullData) {
            const fallbackProxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(postJsonUrl)}`;
            try {
              const fbRes = await fetch(fallbackProxyUrl, { signal: AbortSignal.timeout(4500) });
              if (fbRes.ok) fullData = await fbRes.json();
            } catch (e) {}
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
              let updatedHtml = resolveLocalized(article.content, lang) || fullData.cooked;
              const blogMatch = updatedHtml ? updatedHtml.match(/href="([^"]*worldofwarcraft\.com\/[^"]*news\/[^"]*)"/i) : null;
              if (blogMatch && blogMatch[1] && extLink && extLabel) {
                extLink.href = blogMatch[1];
                extLabel.innerText = lang === 'en' ? 'Read Full Article on Blizzard' : 'Leer Artículo Completo en Blizzard';
              }
              // Eliminar enlace redundante del cuerpo para dejar únicamente el botón de acción inferior
              updatedHtml = updatedHtml.replace(/<p[^>]*>\s*<a\s+href="[^"]*worldofwarcraft\.com\/[^"]*news\/[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi, '');
              updatedHtml = updatedHtml.replace(/<a\s+href="[^"]*worldofwarcraft\.com\/[^"]*news\/[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
              bodyEl.innerHTML = updatedHtml;
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
  const article = (db.blizzardNews || []).find(x => x.id === currentOpenArticleId) ||
                  (db.recentNews || []).find(x => x.id === currentOpenArticleId) ||
                  (db.blueTracker || []).find(x => x.id === currentOpenArticleId);

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

  // Limpiar el hash de la URL si apuntaba a una noticia sin provocar scroll al top
  try {
    if (window.location.hash && window.location.hash.startsWith('#news-')) {
      if (window.history && window.history.replaceState) {
        // history.replaceState funciona tanto en http(s) como en file: en navegadores modernos
        // Evita el salto brusco a # que provoca window.location.hash = ''
        const cleanUrl = window.location.href.split('#')[0];
        window.history.replaceState(null, '', cleanUrl);
      } else {
        window.location.hash = '';
      }
    }
  } catch (e) {}

  // Restaurar la posición de scroll exacta en la que estaba el usuario antes de abrir el modal
  if (typeof previousScrollY === 'number' && previousScrollY > 0) {
    window.scrollTo({
      top: previousScrollY,
      left: 0,
      behavior: 'instant'
    });
    // Respaldo en timeout para navegadores que procesan el desborde en el siguiente tick
    setTimeout(() => {
      window.scrollTo({
        top: previousScrollY,
        left: 0,
        behavior: 'instant'
      });
    }, 10);
  }
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

// Sincronizar Schema SEO al cambiar de idioma o al actualizar datos de noticias
window.addEventListener('languageChanged', () => {
  if (typeof injectNewsSeoSchema === 'function') injectNewsSeoSchema();
});
window.addEventListener('storage', (e) => {
  if (e.key === 'wow_custom_news_data' || e.key === 'wow_lang') {
    if (typeof injectNewsSeoSchema === 'function') injectNewsSeoSchema();
  }
});
