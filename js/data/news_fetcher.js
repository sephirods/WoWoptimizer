// MOTOR AUTOMATIZADO DE SINCRONIZACIÓN EN VIVO: BLIZZARD BLUE TRACKER Y WOWHEAD NEWS
// Obtiene publicaciones oficiales en tiempo real de Blizzard Forums (API Discourse) y Wowhead Retail RSS

const WOW_NEWS_CACHE_KEY = 'wow_live_news_cache_v5';
const WOW_NEWS_CACHE_TTL = 30 * 60 * 1000; // 30 minutos

// Limpiar tags HTML simples para resúmenes
function stripHtmlTags(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

// Calcular tiempo relativo
function getRelativeTimeString(dateStr, lang = 'es') {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (lang === 'en') {
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } else {
      if (diffHours < 1) return 'Hace un momento';
      if (diffHours < 24) return `Hace ${diffHours}h`;
      return `Hace ${diffDays}d`;
    }
  } catch (e) {
    return dateStr;
  }
}

// Formateador de fecha legible
function formatReadableDate(dateStr, lang = 'es') {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

// Normalizador y agrupador de noticias idénticas (US y EU Blue Posts)
function getCanonicalNewsKey(item) {
  if (!item) return '';
  if (item.source === 'wowhead') return `wowhead-${item.id}`;
  
  // Extraer el título en inglés o español como base
  const rawTitle = ((item.title && (item.title.en || item.title.es)) || item.title || '').toLowerCase();
  
  // Normalizar fechas y variaciones regionales (ej: "22 September" vs "September 22")
  let clean = rawTitle
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/[’'\"“”]/g, '')
    .replace(/--|—|-/g, ' ')
    .replace(/\b(us|eu|es)\b/gi, ' ')
    .replace(/\b(esta semana en wow|this week in wow|wow weekly)\b/gi, 'weekly')
    .replace(/\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/gi, '$2')
    .replace(/\b(january|february|march|april|may|june|july|august|september|october|november|december|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+(\d{1,2})\b/gi, '$1')
    .replace(/[^a-z0-9]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return clean.slice(0, 50);
}

function groupCanonicalNews(articles) {
  if (!Array.isArray(articles)) return [];
  const groups = new Map();

  for (const article of articles) {
    const key = getCanonicalNewsKey(article);
    if (!groups.has(key)) {
      // Clonar y preparar artículo unificado
      const unified = {
        ...article,
        aliasIds: [article.id],
        regions: [article.region || 'US'],
        title: {
          en: (article.title && article.title.en) || (typeof article.title === 'string' ? article.title : ''),
          es: (article.title && article.title.es) || (typeof article.title === 'string' ? article.title : '')
        },
        summary: {
          en: (article.summary && article.summary.en) || (typeof article.summary === 'string' ? article.summary : ''),
          es: (article.summary && article.summary.es) || (typeof article.summary === 'string' ? article.summary : '')
        },
        content: {
          en: (article.content && article.content.en) || (typeof article.content === 'string' ? article.content : ''),
          es: (article.content && article.content.es) || (typeof article.content === 'string' ? article.content : '')
        }
      };
      groups.set(key, unified);
    } else {
      const existing = groups.get(key);
      if (article.id && !existing.aliasIds.includes(article.id)) {
        existing.aliasIds.push(article.id);
      }
      if (article.region && !existing.regions.includes(article.region)) {
        existing.regions.push(article.region);
      }
      // Si el duplicado tiene una versión en español nativa, fusionarla
      if (article.postLang === 'es' || (article.title && article.title.es && article.title.es !== existing.title.es)) {
        if (article.title && article.title.es) existing.title.es = article.title.es;
        if (article.summary && article.summary.es) existing.summary.es = article.summary.es;
        if (article.content && article.content.es) existing.content.es = article.content.es;
      }
      // Si el duplicado tiene mejor contenido o fecha más reciente
      if (!existing.hasFullContent && article.hasFullContent) {
        existing.content = article.content;
        existing.hasFullContent = true;
      }
    }
  }

  return Array.from(groups.values());
}

// Diccionario de traducción rápida para titulares y términos frecuentes
const HEADLINE_TRANSLATIONS = {
  "Class Tuning": "Ajustes de Balance de Clases",
  "Incoming": "Próximamente",
  "Hotfixes": "Correcciones en Vivo",
  "Great Vault": "Gran Cámara",
  "Mythic+": "Mítica+",
  "Raid": "Banda",
  "Dungeon": "Mazmorra",
  "Tier Set": "Conjunto de Tier",
  "Patch Notes": "Notas del Parche",
  "Weekly Reset": "Reinicio Semanal",
  "Pirate's Day": "Día de los Piratas",
  "Celebration": "Celebración",
  "Guide": "Guía",
  "Season 2": "Temporada 2",
  "Season 3": "Temporada 3",
  "Midnight": "Midnight",
  "Maintenance": "Mantenimiento",
  "Developer Update": "Actualización de Desarrolladores",
  "This Week in WoW": "Esta semana en WoW",
  "Blizzcon 2026, WoW Forever Beta, Midnight S3, and More in This Week’s Wow Weekly": "BlizzCon 2026, WoW Forever Beta, Midnight T3 y más en las noticias semanales",
  "Blizzcon 2026, WoW Forever Beta, Midnight S3, and More in This Week's Wow Weekly": "BlizzCon 2026, WoW Forever Beta, Midnight T3 y más en las noticias semanales",
  "The World of Warcraft: Forever Beta Now Live": "World of Warcraft: Forever Beta ya disponible",
  "Now Live": "Ya disponible",
  "Known Issues": "Problemas Conocidos",
  "Unable to launch": "No se puede iniciar",
  "We can’t install": "No se puede instalar",
  "We can't install": "No se puede instalar",
  "No WoW Account Selector": "Sin selector de cuenta de WoW",
  "This Week's Wow Weekly": "Resumen Semanal de WoW",
  "This Week’s Wow Weekly": "Resumen Semanal de WoW"
};

const CLASS_NAME_TRANSLATIONS = [
  ['CLASS CHANGES', 'CAMBIOS DE CLASE'],
  ['PLAYER VERSUS PLAYER', 'JUGADOR CONTRA JUGADOR (JcJ)'],
  ['DEATH KNIGHT', 'CABALLERO DE LA MUERTE'],
  ['DEMON HUNTER', 'CAZADOR DE DEMONIOS'],
  ['DRUID', 'DRUIDA'],
  ['EVOKER', 'EVOCADOR'],
  ['HUNTER', 'CAZADOR'],
  ['MAGE', 'MAGO'],
  ['MONK', 'MONJE'],
  ['PALADIN', 'PALADÍN'],
  ['PRIEST', 'SACERDOTE'],
  ['ROGUE', 'PÍCARO'],
  ['SHAMAN', 'CHAMÁN'],
  ['WARLOCK', 'BRUJO'],
  ['WARRIOR', 'GUERRERO']
];

function autoTranslateHeadline(textEn) {
  if (!textEn) return '';
  let translated = textEn;
  for (const [en, es] of Object.entries(HEADLINE_TRANSLATIONS)) {
    translated = translated.replace(new RegExp(en, 'gi'), es);
  }
  return translated;
}

const WOW_BALANCE_GLOSSARY = [
  // Términos generales y notas de desarrollador
  [/Developers' notes:/gi, 'Notas de los desarrolladores:'],
  [/Developer's notes:/gi, 'Notas de los desarrolladores:'],
  [/Our tuning pass this week is mostly targeted at low performers across Mythic\+, Raid, and PvP\./gi, 'Nuestra ronda de ajustes de esta semana está dirigida principalmente a las especializaciones con menor rendimiento en Míticas+, Banda y JcJ.'],
  [/In addition to helping low performers, we are looking at some hero talent disparity to see if we can create a little more competitive balance between the options to better facilitate more gameplay options\./gi, 'Además de ayudar a las ramas de menor rendimiento, estamos analizando las disparidades entre talentos de héroe para fomentar un balance competitivo y habilitar más opciones de juego.'],
  
  // Patrones frecuentes de balance de combate
  [/All ability and minion damage reduced by (\d+)%/gi, 'Daño de todas las facultades y esbirros reducido un $1%'],
  [/All ability and minion damage increased by (\d+)%/gi, 'Daño de todas las facultades y esbirros aumentado un $1%'],
  [/All damage dealt increased by (\d+)%/gi, 'Todo el daño infligido aumentado un $1%'],
  [/All damage dealt reduced by (\d+)%/gi, 'Todo el daño infligido reducido un $1%'],
  [/damage increased by (\d+)%/gi, 'daño aumentado un $1%'],
  [/damage reduced by (\d+)%/gi, 'daño reducido un $1%'],
  [/healing increased by (\d+)%/gi, 'sanación aumentada un $1%'],
  [/healing reduced by (\d+)%/gi, 'sanación reducida un $1%'],
  [/cooldown reduced by (\d+)/gi, 'tiempo de reutilización reducido en $1'],
  [/cooldown increased by (\d+)/gi, 'tiempo de reutilización aumentado en $1'],
  [/effectiveness reduced by (\d+)%/gi, 'efectividad reducida un $1%'],
  [/effectiveness increased by (\d+)%/gi, 'efectividad aumentada un $1%'],
  [/now increases/gi, 'ahora aumenta'],
  [/now reduces/gi, 'ahora reduce'],
  [/now causes/gi, 'ahora causa'],
  [/is now/gi, 'ahora es'],
  [/was (\d+)%/gi, 'antes era $1%'],

  // Especializaciones de clase
  [/\bBlood\b/g, 'Sangre'],
  [/\bFrost\b/g, 'Escarcha'],
  [/\bUnholy\b/g, 'Profano'],
  [/\bHavoc\b/g, 'Devastación'],
  [/\bVengeance\b/g, 'Venganza'],
  [/\bBalance\b/g, 'Equilibrio'],
  [/\bFeral\b/g, 'Feral'],
  [/\bGuardian\b/g, 'Guardián'],
  [/\bRestoration\b/g, 'Restauración'],
  [/\bAugmentation\b/g, 'Aumento'],
  [/\bDevastation\b/g, 'Devastación'],
  [/\bPreservation\b/g, 'Preservación'],
  [/\bBeast Mastery\b/g, 'Dominio de bestias'],
  [/\bMarksmanship\b/g, 'Puntería'],
  [/\bSurvival\b/g, 'Supervivencia'],
  [/\bArcane\b/g, 'Arcano'],
  [/\bFire\b/g, 'Fuego'],
  [/\bBrewmaster\b/g, 'Maestro cervecero'],
  [/\bMistweaver\b/g, 'Tejedor de niebla'],
  [/\bWindwalker\b/g, 'Viajero del viento'],
  [/\bHoly\b/g, 'Sagrado'],
  [/\bProtection\b/g, 'Protección'],
  [/\bRetribution\b/g, 'Reprensión'],
  [/\bDiscipline\b/g, 'Disciplina'],
  [/\bShadow\b/g, 'Sombras'],
  [/\bAssassination\b/g, 'Asesinato'],
  [/\bOutlaw\b/g, 'Forajido'],
  [/\bSubtlety\b/g, 'Sutileza'],
  [/\bElemental\b/g, 'Elemental'],
  [/\bEnhancement\b/g, 'Mejora'],
  [/\bAffliction\b/g, 'Aflicción'],
  [/\bDemonology\b/g, 'Demonología'],
  [/\bDestruction\b/g, 'Destrucción'],
  [/\bArms\b/g, 'Armas'],
  [/\bFury\b/g, 'Furia']
];

function translateCookedContent(cookedHtml) {
  if (!cookedHtml) return '';
  let res = cookedHtml;

  // 1. Traducir títulos y clases
  for (const [en, es] of CLASS_NAME_TRANSLATIONS) {
    res = res.replace(new RegExp('<strong>' + en + '</strong>', 'gi'), '<strong>' + es + '</strong>');
    res = res.replace(new RegExp('<h2>' + en + '</h2>', 'gi'), '<h2>' + es + '</h2>');
    res = res.replace(new RegExp('<h3>' + en + '</h3>', 'gi'), '<h3>' + es + '</h3>');
  }

  // 2. Aplicar glosario de términos de combate y notas de desarrollador
  for (const [pattern, replacement] of WOW_BALANCE_GLOSSARY) {
    res = res.replace(pattern, replacement);
  }

  return res;
}

// Descargar post individual para obtener cooked (contenido completo)
async function fetchPostCookedContent(domain, postId, lang = 'en') {
  if (!postId) return null;
  const postUrl = `https://${domain}/${lang === 'es' ? 'es' : 'en'}/wow/posts/${postId}.json`;
  try {
    let data = null;
    try {
      const res = await fetch(postUrl, { signal: AbortSignal.timeout(3500) });
      if (res.ok) data = await res.json();
    } catch (e) {}

    if (!data) {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(postUrl)}`;
      const proxyRes = await fetch(proxyUrl, { signal: AbortSignal.timeout(4500) });
      if (proxyRes.ok) data = await proxyRes.json();
    }

    if (data && data.cooked) {
      return data.cooked;
    }
  } catch (err) {
    // Si falla, se conservará el resumen
  }
  return null;
}

// Obtener Blue Posts reales de Blizzard (US, EU, ES)
async function fetchBlizzardTrackerPosts() {
  const endpoints = [
    { region: 'US', lang: 'en', url: 'https://us.forums.blizzard.com/en/wow/groups/blizzard-tracker/posts.json' },
    { region: 'EU', lang: 'en', url: 'https://eu.forums.blizzard.com/en/wow/groups/blizzard-tracker/posts.json' },
    { region: 'EU', lang: 'es', url: 'https://eu.forums.blizzard.com/es/wow/groups/blizzard-tracker/posts.json' }
  ];

  const results = [];

  for (const ep of endpoints) {
    try {
      // Intentar fetch directo, y si falla por CORS usar proxy allorigins
      let data = null;
      try {
        const directRes = await fetch(ep.url, { signal: AbortSignal.timeout(4000) });
        if (directRes.ok) data = await directRes.json();
      } catch (e) {}

      if (!data) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(ep.url)}`;
        const proxyRes = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
        if (proxyRes.ok) data = await proxyRes.json();
      }

      if (data && data.posts && Array.isArray(data.posts)) {
        const domain = ep.region.toLowerCase() === 'us' ? 'us.forums.blizzard.com' : 'eu.forums.blizzard.com';
        const postList = data.posts.slice(0, 10);

        for (const post of postList) {
          const rawExcerpt = stripHtmlTags(post.excerpt || post.raw || '');
          const postDate = post.created_at || new Date().toISOString();
          const authorName = post.user?.name || post.username || 'Blizzard';
          const authorRole = post.user_title || post.primary_group_name || 'Community Manager';
          const titleText = post.topic_title || post.topic?.title || 'Blizzard Official Post';
          
          results.push({
            id: `blizz-${post.id || post.topic_id}`,
            postId: post.id,
            topicId: post.topic_id,
            forumDomain: domain,
            region: ep.region,
            postLang: ep.lang,
            source: 'blizzard',
            author: `${authorName} (${authorRole})`,
            dateRaw: postDate,
            tag: 'Blue Post',
            category: 'Blizzard Tracker',
            badgeColor: 'border-sky-500/60 bg-sky-950/80 text-sky-300',
            title: {
              en: ep.lang === 'en' ? titleText : titleText,
              es: ep.lang === 'es' ? titleText : autoTranslateHeadline(titleText)
            },
            summary: {
              en: rawExcerpt.slice(0, 180) + '...',
              es: (ep.lang === 'es' ? rawExcerpt : autoTranslateHeadline(rawExcerpt)).slice(0, 180) + '...'
            },
            content: {
              en: post.cooked ? `<div class="blizzard-full-post space-y-4 text-xs sm:text-sm leading-relaxed">${post.cooked}</div>` : `<p class="text-slate-300 text-sm leading-relaxed">${rawExcerpt}</p>`,
              es: post.cooked ? `<div class="blizzard-full-post space-y-4 text-xs sm:text-sm leading-relaxed">${translateCookedContent(post.cooked)}</div>` : `<p class="text-slate-300 text-sm leading-relaxed">${rawExcerpt}</p>`
            },
            hasFullContent: !!post.cooked,
            originalUrl: (() => {
              const baseDomain = `https://${ep.region.toLowerCase()}.forums.blizzard.com`;
              let path = post.url || '';
              if (path.startsWith('/t/')) {
                path = `/${ep.lang === 'es' ? 'es' : 'en'}/wow${path}`;
              }
              return `${baseDomain}${path}`;
            })()
          });
        }
      }
    } catch (err) {
      console.warn(`[NewsFetcher] Error al conectar con Blizzard Tracker (${ep.region}-${ep.lang}):`, err.message);
    }
  }

  // Ordenar por fecha más reciente
  results.sort((a, b) => new Date(b.dateRaw) - new Date(a.dateRaw));

  // Pre-descargar el contenido completo (cooked) para los 4 posts principales de Blizzard
  const topBlizzPosts = results.slice(0, 4);
  await Promise.allSettled(
    topBlizzPosts.map(async (item) => {
      if (!item.hasFullContent && item.postId) {
        const cooked = await fetchPostCookedContent(item.forumDomain, item.postId, item.postLang || 'en');
        if (cooked) {
          item.content = {
            en: `<div class="blizzard-full-post space-y-4 text-xs sm:text-sm leading-relaxed">${cooked}</div>`,
            es: `<div class="blizzard-full-post space-y-4 text-xs sm:text-sm leading-relaxed">${translateCookedContent(cooked)}</div>`
          };
          item.hasFullContent = true;
        }
      }
    })
  );

  return results;
}

// Obtener Recent News reales de Wowhead Retail RSS
async function fetchWowheadRecentNews() {
  const wowheadRssUrl = 'https://www.wowhead.com/news/rss/retail';
  const apiEndpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(wowheadRssUrl)}`;

  try {
    const res = await fetch(apiEndpoint, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data && data.status === 'ok' && Array.isArray(data.items)) {
      return data.items.map((item, idx) => {
        const rawContent = item.content || item.description || '';
        const summaryText = stripHtmlTags(item.description || item.content || '').slice(0, 180) + '...';
        const titleEn = item.title;
        const titleEs = autoTranslateHeadline(titleEn);

        return {
          id: `wh-${idx + 1}-${item.guid ? item.guid.replace(/[^a-zA-Z0-9]/g, '') : idx}`,
          source: 'wowhead',
          dateRaw: item.pubDate,
          author: item.author || 'Wowhead Staff',
          category: (item.categories && item.categories[0]) || 'Retail News',
          badgeColor: 'border-amber-500/60 bg-amber-950/80 text-amber-300',
          title: {
            en: titleEn,
            es: titleEs
          },
          summary: {
            en: summaryText,
            es: summaryText
          },
          content: {
            en: `
              <div class="space-y-3 leading-relaxed text-slate-300">
                <div class="bg-amber-950/30 border border-amber-500/40 p-3.5 rounded-xl text-xs flex items-center justify-between gap-3">
                  <span class="text-amber-300 font-bold"><i class="fa-solid fa-newspaper mr-1.5"></i> Artículo Oficial de Wowhead</span>
                  <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-xs text-amber-400 hover:text-white underline font-semibold flex items-center gap-1">
                    Ver en Wowhead <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
                <div class="text-xs sm:text-sm space-y-3">
                  ${rawContent}
                </div>
              </div>
            `,
            es: `
              <div class="space-y-3 leading-relaxed text-slate-300">
                <div class="bg-amber-950/30 border border-amber-500/40 p-3.5 rounded-xl text-xs flex items-center justify-between gap-3">
                  <span class="text-amber-300 font-bold"><i class="fa-solid fa-newspaper mr-1.5"></i> Artículo Oficial de Wowhead</span>
                  <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-xs text-amber-400 hover:text-white underline font-semibold flex items-center gap-1">
                    Ver en Wowhead <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
                <div class="text-xs sm:text-sm space-y-3">
                  ${rawContent}
                </div>
              </div>
            `
          },
          originalUrl: item.link
        };
      });
    }
  } catch (err) {
    console.warn('[NewsFetcher] Error al conectar con Wowhead RSS:', err.message);
  }
  return [];
}

// Sincronizador Principal
async function syncLiveNews(force = false) {
  try {
    // 1. Verificar si hay datos cacheados válidos
    if (!force) {
      const cached = localStorage.getItem(WOW_NEWS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < WOW_NEWS_CACHE_TTL && parsed.data?.blueTracker?.length > 0) {
          window.WOW_LIVE_NEWS_DATA = parsed.data;
          return parsed.data;
        }
      }
    }

    // 2. Fetch en paralelo de Blizzard Tracker y Wowhead News
    const [blues, news] = await Promise.all([
      fetchBlizzardTrackerPosts(),
      fetchWowheadRecentNews()
    ]);

    const fallbackDb = window.WOW_NEWS_DATABASE || { blueTracker: [], recentNews: [] };

    // Fusionar de forma inteligente para que NUNCA se pierdan posts ni contenidos completos pre-traducidos
    const existingBlues = fallbackDb.blueTracker || [];
    const blueMap = new Map();
    // Primero agregar los existentes
    existingBlues.forEach(item => { if (item.id) blueMap.set(item.id, item); });
    // Luego actualizar con los nuevos descargados, pero si el existente ya tiene hasFullContent, conservarlo
    blues.forEach(item => { 
      if (item.id) {
        if (blueMap.has(item.id)) {
          const existing = blueMap.get(item.id);
          if (existing.hasFullContent && !item.hasFullContent) {
            item.content = existing.content;
            item.hasFullContent = true;
          }
        }
        blueMap.set(item.id, item); 
      }
    });
    const finalBlues = Array.from(blueMap.values());
    // Ordenar estrictamente por fecha descendente
    finalBlues.sort((a, b) => new Date(b.dateRaw || 0) - new Date(a.dateRaw || 0));

    // Fusionar noticias Wowhead
    const existingNews = fallbackDb.recentNews || [];
    const newsMap = new Map();
    existingNews.forEach(item => { if (item.id) newsMap.set(item.id, item); });
    news.forEach(item => { if (item.id) newsMap.set(item.id, item); });
    const finalNews = Array.from(newsMap.values());
    finalNews.sort((a, b) => new Date(b.dateRaw || 0) - new Date(a.dateRaw || 0));

    const mergedData = {
      blueTracker: finalBlues.length > 0 ? finalBlues : fallbackDb.blueTracker,
      recentNews: finalNews.length > 0 ? finalNews : fallbackDb.recentNews,
      lastUpdated: new Date().toISOString()
    };

    // Guardar en caché local
    localStorage.setItem(WOW_NEWS_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: mergedData
    }));

    window.WOW_LIVE_NEWS_DATA = mergedData;

    // Disparar re-renderizado si la UI de noticias está lista
    if (typeof renderPinnedNews === 'function') renderPinnedNews();
    if (typeof renderBlueTracker === 'function') renderBlueTracker();
    if (typeof renderRecentNews === 'function') renderRecentNews();

    return mergedData;
  } catch (err) {
    console.error('[NewsFetcher] Error general en syncLiveNews:', err);
    return window.WOW_NEWS_DATABASE;
  }
}

// Inicialización automática
if (typeof window !== 'undefined') {
  window.syncLiveNews = syncLiveNews;
  // Cargar datos del caché inmediatamente si existen
  try {
    const cached = localStorage.getItem(WOW_NEWS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.data) window.WOW_LIVE_NEWS_DATA = parsed.data;
    }
  } catch (e) {}

  // Sincronizar en segundo plano sin bloquear la página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(syncLiveNews, 100));
  } else {
    setTimeout(syncLiveNews, 100);
  }
}
