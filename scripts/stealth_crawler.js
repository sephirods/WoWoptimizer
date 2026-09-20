const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function extractWithStealth(url) {
  console.log('Iniciando navegador con Stealth Plugin...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    console.log('Navegando a la noticia:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const data = await page.evaluate(() => {
      // 1. Imagen principal
      const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                    document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');

      // 2. Titulo
      const title = document.querySelector('h1')?.innerText?.trim() || document.title;

      // 3. Iconos detectados
      const iconImgs = Array.from(document.querySelectorAll('ins[style*="background-image"], img[src*="icons"]'));
      const icons = new Set();
      iconImgs.forEach(el => {
        const bg = el.style.backgroundImage || el.src || '';
        const match = bg.match(/icons\/(?:small|medium|large)\/([a-zA-Z0-9_\-]+)\.(?:jpg|png|webp)/i);
        if (match) icons.add(match[1]);
      });

      // 4. Modelos 3D
      const models = new Set();
      document.querySelectorAll('[data-model-viewer-display-id], [data-display-id]').forEach(el => {
        const id = el.getAttribute('data-model-viewer-display-id') || el.getAttribute('data-display-id');
        if (id) models.add(id);
      });

      // 5. Snippet / Resumen inicial
      const firstParagraph = document.querySelector('.news-post-content p, article p')?.innerText?.trim();

      return {
        title,
        mainImage: ogImg,
        icons: Array.from(icons).slice(0, 10),
        models3D: Array.from(models),
        summary: firstParagraph ? firstParagraph.slice(0, 200) + '...' : ''
      };
    });

    console.log('\n[EXTRACCIÓN STEALTH EXITOSA]:');
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error('Error con Stealth:', err.message);
  } finally {
    await browser.close();
  }
}

const sampleUrl = 'https://www.wowhead.com/news/it-be-pirate-s-day-get-ye-a-new-transmog-fer-yer-peeper-383003';
extractWithStealth(sampleUrl);
