const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const https = require('https');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

function fetchRss(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseFeedItems(xml) {
  const items = [];
  const regex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const block = match[1];
    const linkMatch = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i.exec(block);
    const titleMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i.exec(block);
    const pubDateMatch = /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i.exec(block);
    if (linkMatch) {
      items.push({
        title: titleMatch ? titleMatch[1].trim() : '',
        link: linkMatch[1].trim(),
        pubDate: pubDateMatch ? pubDateMatch[1].trim() : ''
      });
    }
  }
  return items;
}

// Mapeo específico de títulos conocidos y términos de WoW
const exactTitleTranslations = {
  "It Be Pirate’s Day - Get Ye a New Transmog Fer Yer Peeper": "Es el Día de los Piratas - Consigue una nueva transfiguración para tu ojo",
  "Behind the Scenes of the WoW: Forever Beta Issues - Tom Ellis Explains on X": "Entre bastidores de los problemas de la beta de WoW: Forever - Tom Ellis lo explica en X",
  "Mythic Nymrissa May Guarantee Great Vault Loot Slots": "Nymrissa Mítica podría garantizar casillas de botín en la Gran Cámara",
  "New Phasing Notification in WoW: Forever - Changing Phases Safely": "Nueva notificación de cambio de fase en WoW: Forever - Cambiando de fase de forma segura",
  "Augmentation Evoker Buff - Class Tuning Incoming": "Mejora al Evocador Aumento - Próximos ajustes de balance de clases",
  "Ula'tek Buffed - Tank Debuff Can No Longer Be Outranged": "Mejora a Ula'tek - El perjuicio para tanques ya no se puede eludir por distancia",
  "What We Know About the Open World So Far in WoW: Forever": "Lo que sabemos hasta ahora sobre el mundo abierto en WoW: Forever"
};

const exactSummaryTranslations = {
  "It Be Pirate’s Day - Get Ye a New Transmog Fer Yer Peeper...": "¡Día de los Piratas en Azeroth! Consigue una nueva apariencia de parche ocular con la Capitana DeMeza en Bahía del Botín.",
  "Behind the Scenes of the WoW: Forever Beta Issues - Tom Ellis Explains on X...": "El productor senior de WoW, Tom Ellis, explica las razones técnicas tras las caídas de servidores y colas en el lanzamiento de la beta.",
  "Mythic Nymrissa May Guarantee Great Vault Loot Slots...": "La comunidad descubre una mecánica en la Gran Cámara que podría forzar recompensas garantizadas al derrotar a Nymrissa Mítica.",
  "New Phasing Notification in WoW: Forever - Changing Phases Safely...": "WoW: Forever añade una alerta previa de 5 minutos antes de cambiar de fase o capa para proteger a los personajes en dificultades extremas.",
  "Augmentation Evoker Buff - Class Tuning Incoming...": "Blizzard anuncia ajustes de balance para la próxima semana con mejoras para Evocador Aumento y varias clases.",
  "Ula'tek Buffed - Tank Debuff Can No Longer Be Outranged...": "Una corrección en vivo incrementa el rango de 'Stone Venom' de Ula'tek a 50.000 metros para impedir que se anule alejándose.",
  "What We Know About the Open World So Far in WoW: Forever...": "Un repaso detallado a las nuevas 4 zonas de nivelación, nuevos puertos de viaje, profesiones y filosofía de mundo abierto en WoW: Forever."
};

const wowTerms = [
  [/It Be Pirate’s Day/gi, 'Es el Día de los Piratas'],
  [/Get Ye a New Transmog Fer Yer Peeper/gi, 'Consigue una Nueva Transfiguración para tu Ojo'],
  [/Class Tuning Incoming/gi, 'Ajustes de Balance de Clases en Camino'],
  [/Hotfixes/gi, 'Correcciones en Vivo (Hotfixes)'],
  [/Beta Known Issues/gi, 'Problemas Conocidos de la Beta'],
  [/Patch Notes/gi, 'Notas del Parche'],
  [/Great Vault/gi, 'Gran Cámara'],
  [/Loot Slots/gi, 'Casillas de Botín'],
  [/Tank Debuff/gi, 'Perjuicio para Tanques'],
  [/Can No Longer Be Outranged/gi, 'Ya No Se Puede Eludir por Distancia'],
  [/Behind the Scenes/gi, 'Entre Bastidores'],
  [/Changing Phases Safely/gi, 'Cambiando de Fase de Forma Segura'],
  [/What We Know About/gi, 'Lo que Sabemos Sobre'],
  [/Open World/gi, 'Mundo Abierto'],
  [/So Far in/gi, 'Hasta Ahora en'],
  [/Raid/gi, 'Banda'],
  [/Mythic\+/gi, 'Mítica+'],
  [/Mythic/gi, 'Mítica'],
  [/Heroic/gi, 'Heroico'],
  [/Dungeon/gi, 'Mazmorra'],
  [/Mount/gi, 'Montura'],
  [/Transmog/gi, 'Transfiguración'],
  [/Paladin/gi, 'Paladín'],
  [/Hunter/gi, 'Cazador'],
  [/Death Knight/gi, 'Caballero de la Muerte'],
  [/Warrior/gi, 'Guerrero'],
  [/Priest/gi, 'Sacerdote'],
  [/Rogue/gi, 'Pícaro'],
  [/Mage/gi, 'Mago'],
  [/Warlock/gi, 'Brujo'],
  [/Druid/gi, 'Druida'],
  [/Shaman/gi, 'Chamán'],
  [/Monk/gi, 'Monje'],
  [/Demon Hunter/gi, 'Cazador de Demonios'],
  [/Augmentation Evoker/gi, 'Evocador Aumento'],
  [/Evoker/gi, 'Evocador'],
  [/Buffed/gi, 'Mejorado/a'],
  [/Buff/gi, 'Mejora']
];

async function fetchOnlineTranslation(text) {
  if (!text || text.trim().length === 0) return text;
  return new Promise((resolve) => {
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text.trim()) + '&langpair=en|es';
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.responseData && parsed.responseData.translatedText) {
            let resText = parsed.responseData.translatedText;
            // Corregir términos de WoW sobre la traducción
            for (const [pattern, rep] of wowTerms) {
              resText = resText.replace(pattern, rep);
            }
            return resolve(resText);
          }
        } catch (e) {}
        resolve(null);
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(4000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function translateTitle(enTitle) {
  if (exactTitleTranslations[enTitle.trim()]) {
    return exactTitleTranslations[enTitle.trim()];
  }
  const online = await fetchOnlineTranslation(enTitle);
  if (online) return online;

  let es = enTitle;
  for (const [pattern, rep] of wowTerms) {
    es = es.replace(pattern, rep);
  }
  return es;
}

async function translateSummary(enSummary) {
  if (exactSummaryTranslations[enSummary.trim()]) {
    return exactSummaryTranslations[enSummary.trim()];
  }
  const online = await fetchOnlineTranslation(enSummary);
  if (online) return online;

  let es = enSummary;
  for (const [pattern, rep] of wowTerms) {
    es = es.replace(pattern, rep);
  }
  return es;
}

async function runBatch() {
  console.log('=== Iniciando Procesador de Noticias Autónomo ===');
  
  // 1. Obtener feed RSS
  console.log('1. Consultando feed RSS...');
  const rssXml = await fetchRss('https://www.wowhead.com/news/rss/all');
  const feedItems = parseFeedItems(rssXml).slice(0, 7);
  console.log(`Se procesarán las últimas ${feedItems.length} noticias.`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const processedArticles = [];

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    for (const item of feedItems) {
      console.log(`\nProcesando: ${item.title}`);
      console.log(`URL: ${item.link}`);
      
      try {
        await page.goto(item.link, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const articleData = await page.evaluate(() => {
          const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                        document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

          // Contenedor principal nativo de la noticia
          const contentEl = document.querySelector('.news-post-content') || document.querySelector('article') || document.querySelector('.post-body');
          let fullHtml = '';
          if (contentEl) {
            const clone = contentEl.cloneNode(true);
            // Solo quitar scripts y anuncios externos intrusivos
            clone.querySelectorAll('.ad, script, style, .social-share, .comments, iframe').forEach(el => el.remove());
            
            // Garantizar que URLs relativas apunten a wowhead
            clone.querySelectorAll('a[href^="/"]').forEach(a => a.href = 'https://www.wowhead.com' + a.getAttribute('href'));
            clone.querySelectorAll('img[src^="/"]').forEach(img => img.src = 'https://www.wowhead.com' + img.getAttribute('src'));
            
            fullHtml = clone.innerHTML;
          }

          // Extraer iconos sueltos para metadata
          const iconNodes = Array.from(document.querySelectorAll('ins[style*="background-image"], img[src*="icons"]'));
          const icons = new Set();
          iconNodes.forEach(el => {
            const bg = el.style.backgroundImage || el.src || '';
            const m = bg.match(/icons\/(?:small|medium|large)\/([a-zA-Z0-9_\-]+)\.(?:jpg|png|webp)/i);
            if (m) icons.add(m[1]);
          });

          // Párrafos para resumen
          const paragraphs = Array.from(document.querySelectorAll('.news-post-content p, article p'))
            .map(p => p.innerText.trim())
            .filter(t => t.length > 20);

          return {
            mainImage: ogImg,
            icons: Array.from(icons).slice(0, 8),
            models3D: [],
            fullHtml: fullHtml,
            paragraphs: paragraphs.slice(0, 4)
          };
        });

        const idMatch = item.link.match(/news(?:=|\/.*?-)([0-9]+)/);
        const articleId = idMatch ? `wh-${idMatch[1]}` : `wh-${Date.now()}`;

        const titleEs = await translateTitle(item.title);
        const summaryEn = articleData.paragraphs[0] || item.title;
        const summaryEs = await translateSummary(summaryEn.slice(0, 180) + '...') || titleEs;

        processedArticles.push({
          id: articleId,
          source: 'wowhead',
          dateRaw: item.pubDate,
          author: 'Wowhead Staff',
          category: 'Live',
          badgeColor: 'border-amber-500/60 bg-amber-950/80 text-amber-300',
          title: {
            en: item.title,
            es: titleEs
          },
          summary: {
            en: summaryEn.slice(0, 180) + '...',
            es: summaryEs
          },
          contentHtml: articleData.fullHtml,
          imageUrl: articleData.mainImage,
          icons: articleData.icons,
          models3D: articleData.models3D,
          originalUrl: item.link
        });

        console.log(`✓ Extraído completo: ${articleId} (Longitud HTML: ${articleData.fullHtml.length} caracteres)`);
      } catch (err) {
        console.error(`✗ Error procesando ${item.link}:`, err.message);
      }
    }
  } finally {
    await browser.close();
  }

  // 1. Guardar snapshot JSON
  const outputPath = path.join(__dirname, 'latest_scraped_news.json');
  fs.writeFileSync(outputPath, JSON.stringify(processedArticles, null, 2), 'utf-8');
  console.log(`\n✓ Snapshot JSON guardado en: ${outputPath}`);

  // 2. Sincronizar automáticamente con Staging para visualización inmediata
  const stagingJsPath = path.join(__dirname, '../staging/mock_news_data.js');
  fs.writeFileSync(stagingJsPath, 'window.STAGING_NEWS_DATA = ' + JSON.stringify(processedArticles, null, 2) + ';', 'utf-8');
  console.log(`✓ Sincronizado automáticamente con Staging en: ${stagingJsPath}`);

  // 3. Fusionar directamente con el entorno de producción (js/data/wow_news_data.js)
  try {
    const { execSync } = require('child_process');
    execSync('node ' + path.join(__dirname, 'merge_news_to_production.js'), { stdio: 'inherit' });
    console.log('✓ Base de datos de producción sincronizada con éxito.');
  } catch (mergeErr) {
    console.warn('! Aviso al fusionar con producción:', mergeErr.message);
  }

  console.log('=== Proceso Completado con Éxito ===');
}

runBatch();
