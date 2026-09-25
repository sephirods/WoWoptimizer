const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

async function scrapeBlizzardNews() {
  console.log('=== Iniciando Scraper Dual (EN + ES) de Noticias Oficiales de Blizzard ===');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const articles = [];

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    console.log('Navegando a Blizzard News (EN)...');
    await page.goto('https://worldofwarcraft.blizzard.com/en-us/news', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 2000));

    // Extraer enlaces a las ultimas noticias oficiales
    const newsLinks = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('a[href*="/news/"]'))
        .filter(a => /\/news\/[0-9]+/.test(a.href));
      
      const unique = [];
      const seen = new Set();
      for (const a of cards) {
        const url = a.href.split('?')[0];
        if (!seen.has(url)) {
          seen.add(url);
          unique.push(url);
        }
      }
      return unique.slice(0, 15);
    });

    console.log(`Se detectaron ${newsLinks.length} noticias oficiales de Blizzard:`, newsLinks);

    // Función auxiliar para extraer datos de una página de noticia dada
    async function extractArticlePage(targetUrl) {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));

      return await page.evaluate(() => {
        const title = document.querySelector('h1')?.innerText?.trim() || document.title;
        const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
        
        const dateEl = document.querySelector('time, [class*="date"], [class*="publish"]');
        const date = dateEl ? dateEl.innerText.trim() : 'Reciente';

        const contentEl = document.querySelector('#blog .Blog .detail') || 
                          document.querySelector('.Blog-content') ||
                          document.querySelector('.NewsBlog-content') || 
                          document.querySelector('article');
        
        let contentHtml = '';
        if (contentEl) {
          const clone = contentEl.cloneNode(true);
          
          clone.querySelectorAll('header, .Pane--underSiteNav, .SocialButtons, .CommentTotal, .Button--social, script, style, iframe, button').forEach(e => e.remove());
          clone.querySelectorAll('a[href^="/"]').forEach(a => a.href = 'https://worldofwarcraft.blizzard.com' + a.getAttribute('href'));
          clone.querySelectorAll('img[src^="/"]').forEach(img => img.src = 'https://worldofwarcraft.blizzard.com' + img.getAttribute('src'));
          
          clone.querySelectorAll('img[src*=".svg"], svg').forEach(s => {
            s.style.maxWidth = '20px';
            s.style.maxHeight = '20px';
            s.style.display = 'inline-block';
          });

          contentHtml = clone.innerHTML;
        }

        let firstP = '';
        if (contentEl) {
          const ps = contentEl.querySelectorAll('p');
          for (const p of ps) {
            const txt = p.innerText?.trim() || '';
            if (txt.length > 25 && !txt.startsWith('Ver artículo completo') && !txt.startsWith('View Full Article')) {
              firstP = txt;
              break;
            }
          }
          if (!firstP) {
            firstP = contentEl.innerText?.trim()?.split('\n')?.[0] || '';
          }
        }

        return {
          title,
          imageUrl: ogImg,
          date,
          summary: firstP ? (firstP.slice(0, 180) + '...') : '...',
          contentHtml
        };
      });
    }

    for (const rawLink of newsLinks) {
      const idMatch = rawLink.match(/\/news\/([0-9]+)/);
      const postId = idMatch ? idMatch[1] : null;
      const id = postId ? `blizz-${postId}` : `blizz-${Date.now()}`;
      const linkEn = postId ? `https://worldofwarcraft.blizzard.com/en-us/news/${postId}` : rawLink;
      const linkEs = postId ? `https://worldofwarcraft.blizzard.com/es-es/news/${postId}` : rawLink;

      console.log(`\nExtrayendo: ${id}`);

      try {
        // 1. Extraer versión en inglés forzando locale en-us
        await page.setCookie({ name: 'preferred_locale', value: 'en-us', domain: '.blizzard.com' });
        console.log(`  -> Obteniendo versión en inglés (${linkEn})...`);
        const dataEn = await extractArticlePage(linkEn);

        // 2. Extraer versión oficial en español forzando locale es-es
        let dataEs = null;
        try {
          await page.setCookie({ name: 'preferred_locale', value: 'es-es', domain: '.blizzard.com' });
          console.log(`  -> Obteniendo versión oficial en español (${linkEs})...`);
          dataEs = await extractArticlePage(linkEs);
        } catch (esErr) {
          console.warn(`  ! No se pudo obtener versión en español para ${id}, usando inglés.`);
        }

        function isErrorTitle(t) {
          if (!t || typeof t !== 'string') return true;
          return /error\s*(500|404|403)|page not found|página no encontrada|not found|\b(500|404)\s*-\s*wow/i.test(t);
        }

        const isEsValid = dataEs && dataEs.title && !isErrorTitle(dataEs.title);

        articles.push({
          id,
          source: 'blizzard',
          author: 'Blizzard Entertainment',
          dateRaw: isEsValid ? (dataEs?.date || dataEn.date) : dataEn.date,
          category: 'Oficial',
          badgeColor: 'border-sky-500/60 bg-sky-950/80 text-sky-300',
          title: {
            en: dataEn.title,
            es: isEsValid ? dataEs.title : dataEn.title
          },
          summary: {
            en: dataEn.summary,
            es: (isEsValid && dataEs.summary && dataEs.summary.length > 5) ? dataEs.summary : dataEn.summary
          },
          imageUrl: dataEn.imageUrl || dataEs?.imageUrl || '',
          contentHtml: {
            en: dataEn.contentHtml,
            es: (isEsValid && dataEs.contentHtml && dataEs.contentHtml.length > 50) ? dataEs.contentHtml : dataEn.contentHtml
          },
          originalUrl: linkEn,
          originalUrlEs: linkEs
        });

        console.log(`✓ Extraída noticia oficial [EN/ES]: ${id} ("${articles[articles.length - 1].title.es}")`);
      } catch (err) {
        console.error(`✗ Error extrayendo ${linkEn}:`, err.message);
      }
    }
  } finally {
    await browser.close();
  }

  // Bot 2: Integrar noticias oficiales a producción preservando histórico (hasta 50 noticias)
  let finalBlizzardNews = articles;
  try {
    const prodPath = path.join(__dirname, '../js/data/wow_news_data.js');
    const prodContent = fs.readFileSync(prodPath, 'utf8');
    const fakeWin = {};
    eval(prodContent.replace('window.', 'fakeWin.'));

    const currentDb = fakeWin.WOW_NEWS_DATABASE || { blueTracker: [], blizzardNews: [], recentNews: [] };
    const blueTracker = currentDb.blueTracker || [];
    const recentNews = currentDb.recentNews || [];
    const existingBlizz = currentDb.blizzardNews || [];

    // Combinar nuevas noticias con las existentes preservando histórico sin duplicados
    const merged = [];
    const seenIds = new Set();
    for (const art of articles) {
      if (art && art.id && !seenIds.has(art.id)) {
        seenIds.add(art.id);
        merged.push(art);
      }
    }
    for (const art of existingBlizz) {
      if (art && art.id && !seenIds.has(art.id)) {
        seenIds.add(art.id);
        merged.push(art);
      }
    }
    finalBlizzardNews = merged.slice(0, 50);

    const newDb = {
      blueTracker: blueTracker,
      blizzardNews: finalBlizzardNews,
      recentNews: recentNews
    };

    const newContent = '// BASE DE DATOS DE NOTICIAS, BLUE TRACKER Y ARTÍCULOS EN VIVO\nwindow.WOW_NEWS_DATABASE = ' + JSON.stringify(newDb, null, 2) + ';\n';
    fs.writeFileSync(prodPath, newContent, 'utf8');
    console.log(`[BOT 2 - BLIZZARD NEWS] Éxito: Se consolidaron ${finalBlizzardNews.length} noticias oficiales de Blizzard (histórico preservado). Blue Tracker (${blueTracker.length}) y Recent News (${recentNews.length}) intactas.`);
  } catch (err) {
    console.error('Error sincronizando Blizzard con producción:', err.message);
  }

  // Guardar snapshots actualizados de Blizzard
  const outJson = path.join(__dirname, 'latest_blizzard_news.json');
  fs.writeFileSync(outJson, JSON.stringify(finalBlizzardNews, null, 2), 'utf-8');
  console.log(`✓ Guardado snapshot de Blizzard en: ${outJson}`);

  const stagingJs = path.join(__dirname, '../staging/mock_blizzard_data.js');
  fs.writeFileSync(stagingJs, 'window.STAGING_BLIZZARD_DATA = ' + JSON.stringify(finalBlizzardNews, null, 2) + ';', 'utf-8');
  console.log(`✓ Sincronizado automáticamente en: ${stagingJs}`);

  console.log('=== Fin Scraper Blizzard ===');
}

scrapeBlizzardNews();

