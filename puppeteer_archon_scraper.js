const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function run() {
  console.log('Lanzando navegador...');
  const browser = await puppeteer.launch({
    headless: false, // Visible para verificar Turnstile
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  
  console.log('Navegando a Archon...');
  await page.goto('https://www.archon.gg/wow/builds/hunter/survival/raid/overview', { waitUntil: 'domcontentloaded' });

  // Esperar a que pase la verificación de Cloudflare (hasta 15 segundos)
  console.log('Esperando resolución de Cloudflare...');
  for (let i = 0; i < 15; i++) {
    const title = await page.title();
    console.log(`[${i+1}s] Título actual: ${title}`);
    if (!title.includes('Human Verification') && !title.includes('Just a moment')) {
      console.log('✓ Cloudflare superado con éxito!');
      break;
    }
    // Intentar hacer click si hay iframe de turnstile
    const frames = page.frames();
    for (const f of frames) {
      const checkbox = await f.$('input[type="checkbox"], .ctp-checkbox-label, #challenge-stage');
      if (checkbox) {
        try { await checkbox.click(); console.log('Clickeado Turnstile checkbox'); } catch(e){}
      }
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  const finalTitle = await page.title();
  console.log('Título final:', finalTitle);
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log('Texto extraído (muestra):', text.substring(0, 500));
  
  await browser.close();
}

run().catch(console.error);
