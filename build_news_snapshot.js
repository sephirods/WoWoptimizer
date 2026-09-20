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
      for (const p of (data.posts || []).slice(0, 6)) {
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
          originalUrl: `https://${domain}${p.url || ''}`
        });
      }
    } catch (err) {
      console.error('Error fetching ep:', ep.url, err.message);
    }
  }

  // Wowhead RSS
  const whRes = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://www.wowhead.com/news/rss/retail'));
  const whData = await whRes.json();
  const recentNews = (whData.items || []).map((item, idx) => {
    const rawContent = item.content || item.description || '';
    const summaryText = (item.description || item.content || '').replace(/<[^>]+>/g, '').trim().slice(0, 180) + '...';
    const titleEn = item.title;
    const titleEs = autoTranslateHeadline(titleEn);
    return {
      id: `wh-${idx + 1}`,
      source: 'wowhead',
      dateRaw: item.pubDate,
      author: item.author || 'Wowhead Staff',
      category: (item.categories && item.categories[0]) || 'Retail News',
      badgeColor: 'border-amber-500/60 bg-amber-950/80 text-amber-300',
      title: { en: titleEn, es: titleEs },
      summary: { en: summaryText, es: autoTranslateHeadline(summaryText) },
      content: {
        en: `<div class="space-y-3 leading-relaxed text-slate-300"><div class="bg-amber-950/30 border border-amber-500/40 p-3.5 rounded-xl text-xs flex items-center justify-between gap-3"><span class="text-amber-300 font-bold"><i class="fa-solid fa-newspaper mr-1.5"></i> Wowhead Official Article</span><a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-xs text-amber-400 hover:text-white underline font-semibold flex items-center gap-1">View on Wowhead <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></a></div><div class="text-xs sm:text-sm space-y-3">${rawContent}</div></div>`,
        es: `<div class="space-y-3 leading-relaxed text-slate-300"><div class="bg-amber-950/30 border border-amber-500/40 p-3.5 rounded-xl text-xs flex items-center justify-between gap-3"><span class="text-amber-300 font-bold"><i class="fa-solid fa-newspaper mr-1.5"></i> Artículo Oficial de Wowhead</span><a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-xs text-amber-400 hover:text-white underline font-semibold flex items-center gap-1">Ver en Wowhead <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></a></div><div class="text-xs sm:text-sm space-y-3">${translateCookedContent(rawContent)}</div></div>`
      },
      originalUrl: item.link
    };
  });

  const output = '// BASE DE DATOS DE NOTICIAS, BLUE TRACKER Y ARTÍCULOS EN VIVO\nwindow.WOW_NEWS_DATABASE = ' + JSON.stringify({ blueTracker, recentNews }, null, 2) + ';\n';
  fs.writeFileSync('js/data/wow_news_data.js', output, 'utf8');
  console.log('SUCCESS! Wrote', blueTracker.length, 'blues and', recentNews.length, 'news with full bilingual translations to wow_news_data.js');
}

buildData();
