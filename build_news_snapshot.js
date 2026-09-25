const fs = require('fs');

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
  "Unable to launch": "No se puede iniciar",
  "Known Issues": "Problemas Conocidos",
  "Now Live": "Ya Disponible"
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

const WOW_BALANCE_GLOSSARY = [
  [/Developers' notes:/gi, 'Notas de los desarrolladores:'],
  [/Developer's notes:/gi, 'Notas de los desarrolladores:'],
  [/Our tuning pass this week is mostly targeted at low performers across Mythic\+, Raid, and PvP\./gi, 'Nuestra ronda de ajustes de esta semana está dirigida principalmente a las especializaciones con menor rendimiento en Míticas+, Banda y JcJ.'],
  [/In addition to helping low performers, we are looking at some hero talent disparity to see if we can create a little more competitive balance between the options to better facilitate more gameplay options\./gi, 'Además de ayudar a las ramas de menor rendimiento, estamos analizando las disparidades entre talentos de héroe para fomentar un balance competitivo y habilitar más opciones de juego.'],
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

function autoTranslateHeadline(textEn) {
  if (!textEn) return '';
  let translated = textEn;
  for (const [en, es] of Object.entries(HEADLINE_TRANSLATIONS)) {
    translated = translated.replace(new RegExp(en, 'gi'), es);
  }
  return translated;
}

function isEditorialNewsPost(title, excerpt) {
  const combined = `${title || ''} ${excerpt || ''}`.toLowerCase();
  const nonNewsKeywords = [
    'unable to launch',
    "can't install",
    'cannot install',
    'no wow account selector',
    'disconnects first player',
    'oops! something went wrong',
    'tech supporter',
    'corrupted file',
    'error code',
    'crashing on launch',
    'battle.net app crashed',
    'payment issue',
    'billing question',
    'refund request',
    'authenticator issue',
    'locked account',
    'ticket status'
  ];
  for (const kw of nonNewsKeywords) {
    if (combined.includes(kw)) return false;
  }
  return true;
}

function translateCookedContent(cookedHtml) {
  if (!cookedHtml) return '';
  let res = cookedHtml;
  for (const [en, es] of CLASS_NAME_TRANSLATIONS) {
    res = res.replace(new RegExp('<strong>' + en + '</strong>', 'gi'), '<strong>' + es + '</strong>');
    res = res.replace(new RegExp('<h2>' + en + '</h2>', 'gi'), '<h2>' + es + '</h2>');
    res = res.replace(new RegExp('<h3>' + en + '</h3>', 'gi'), '<h3>' + es + '</h3>');
  }
  for (const [pattern, replacement] of WOW_BALANCE_GLOSSARY) {
    res = res.replace(pattern, replacement);
  }
  return res;
}

async function buildData() {
  console.log('Iniciando construcción de snapshot de noticias...');

  // 1. Cargar base de datos existente para preservar siempre las 9 noticias oficiales de Blizzard
  let existingBlizzardNews = [];
  let existingRecentNews = [];
  try {
    const currentDbCode = fs.readFileSync('js/data/wow_news_data.js', 'utf8');
    const fakeWin = {};
    eval(currentDbCode.replace('window.', 'fakeWin.'));
    if (fakeWin.WOW_NEWS_DATABASE) {
      existingBlizzardNews = fakeWin.WOW_NEWS_DATABASE.blizzardNews || [];
      existingRecentNews = fakeWin.WOW_NEWS_DATABASE.recentNews || [];
    }
  } catch (e) {
    try {
      existingBlizzardNews = JSON.parse(fs.readFileSync('scripts/latest_blizzard_news.json', 'utf8'));
    } catch (_) {}
  }

  const eps = [
    { region: 'US', lang: 'en', url: 'https://us.forums.blizzard.com/en/wow/groups/blizzard-tracker/posts.json' },
    { region: 'EU', lang: 'es', url: 'https://eu.forums.blizzard.com/es/wow/groups/blizzard-tracker/posts.json' },
    { region: 'EU', lang: 'en', url: 'https://eu.forums.blizzard.com/en/wow/groups/blizzard-tracker/posts.json' }
  ];

  const blueTracker = [];

  for (const ep of eps) {
    try {
      const res = await fetch(ep.url);
      const data = await res.json();
      const posts = data.posts || [];

      // Filtrar posts: descartar soporte técnico y aceptar post_number 1 o posts de hotfixes/tuning acumulativos
      const filteredPosts = posts.filter(p => {
        const title = p.topic_title || '';
        const excerpt = p.excerpt || '';
        if (!isEditorialNewsPost(title, excerpt)) return false;
        const isCumulativeUpdate = /hotfix|tuning|patch notes|update|reset|balance/i.test(title);
        return p.post_number === 1 || isCumulativeUpdate;
      });

      for (const p of filteredPosts.slice(0, 8)) {
        const domain = ep.region.toLowerCase() === 'us' ? 'us.forums.blizzard.com' : 'eu.forums.blizzard.com';
        const pUrl = `https://${domain}${ep.lang === 'es' ? '/es' : '/en'}/wow/posts/${p.id}.json`;
        let cooked = p.cooked || '';
        try {
          const pRes = await fetch(pUrl);
          if (pRes.ok) {
            const pData = await pRes.json();
            if (pData.cooked) cooked = pData.cooked;
          }
        } catch (e) {}

        const excerpt = (p.excerpt || '').replace(/<[^>]+>/g, '').trim();
        const titleEn = p.topic_title;
        const titleEs = ep.lang === 'es' ? titleEn : autoTranslateHeadline(titleEn);

        blueTracker.push({
          id: `blizz-${p.id}`,
          postId: p.id,
          topicId: p.topic_id,
          forumDomain: domain,
          region: ep.region,
          postLang: ep.lang,
          source: 'blizzard',
          author: `${p.user?.name || p.username || 'Blizzard'} (${p.user_title || 'Community Manager'})`,
          dateRaw: p.created_at,
          tag: 'Blue Post',
          category: 'Blizzard Tracker',
          badgeColor: 'border-sky-500/60 bg-sky-950/80 text-sky-300',
          title: { en: titleEn, es: titleEs },
          summary: { en: excerpt.slice(0, 180) + '...', es: (ep.lang === 'es' ? excerpt : autoTranslateHeadline(excerpt)).slice(0, 180) + '...' },
          content: {
            en: `<div class="blizzard-full-post space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">${cooked || excerpt}</div>`,
            es: `<div class="blizzard-full-post space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">${translateCookedContent(cooked || excerpt)}</div>`
          },
          hasFullContent: !!cooked,
          originalUrl: (() => {
            let path = p.url || '';
            if (path.startsWith('/t/')) {
              path = `/${ep.lang === 'es' ? 'es' : 'en'}/wow${path}`;
            }
            return `https://${domain}${path}`;
          })()
        });
      }
    } catch (err) {
      console.error('Error fetching ep:', ep.url, err.message);
    }
  }

  // Leer de nuevo js/data/wow_news_data.js justo antes de guardar para asegurar que no pisamos nada
  let currentBlizzardNews = existingBlizzardNews;
  let currentRecentNews = existingRecentNews;
  let existingBlueTracker = [];
  try {
    const freshDb = fs.readFileSync('js/data/wow_news_data.js', 'utf8');
    const freshWin = {};
    eval(freshDb.replace('window.', 'freshWin.'));
    if (freshWin.WOW_NEWS_DATABASE) {
      if (Array.isArray(freshWin.WOW_NEWS_DATABASE.blizzardNews)) {
        currentBlizzardNews = freshWin.WOW_NEWS_DATABASE.blizzardNews;
      }
      if (Array.isArray(freshWin.WOW_NEWS_DATABASE.recentNews)) {
        currentRecentNews = freshWin.WOW_NEWS_DATABASE.recentNews;
      }
      if (Array.isArray(freshWin.WOW_NEWS_DATABASE.blueTracker)) {
        existingBlueTracker = freshWin.WOW_NEWS_DATABASE.blueTracker;
      }
    }
  } catch (e) {}

  // Combinar posts nuevos con el histórico existente preservando hasta 50 publicaciones
  const mergedBlue = [];
  const seenIds = new Set();
  for (const p of blueTracker) {
    if (p && p.id && !seenIds.has(p.id)) {
      seenIds.add(p.id);
      mergedBlue.push(p);
    }
  }
  for (const p of existingBlueTracker) {
    if (p && p.id && !seenIds.has(p.id)) {
      seenIds.add(p.id);
      mergedBlue.push(p);
    }
  }
  const finalBlueTracker = mergedBlue.slice(0, 50);

  // Bot 1: Blue Tracker actualiza EXCLUSIVAMENTE su propiedad blueTracker
  const outputDb = {
    blueTracker: finalBlueTracker,
    blizzardNews: currentBlizzardNews,
    recentNews: currentRecentNews
  };

  const output = '// BASE DE DATOS DE NOTICIAS, BLUE TRACKER Y ARTÍCULOS EN VIVO\nwindow.WOW_NEWS_DATABASE = ' + JSON.stringify(outputDb, null, 2) + ';\n';
  fs.writeFileSync('js/data/wow_news_data.js', output, 'utf8');
  console.log('[BOT 1 - BLUE TRACKER] Éxito: Se consolidaron ' + finalBlueTracker.length + ' blue posts (histórico preservado). Blizzard News (' + outputDb.blizzardNews.length + ') y Recent News (' + outputDb.recentNews.length + ') preservadas intactas.');
}

buildData();


