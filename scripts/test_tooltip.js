const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
puppeteer.use(StealthPlugin());

async function runVisualTest() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
    console.log('Cargando Staging:', filePath);
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    // 1. Abrir la primera noticia
    console.log('Haciendo clic en la noticia de los piratas...');
    await page.click('#news-grid article');
    await new Promise(r => setTimeout(r, 1000));

    // 2. Localizar el enlace de Pirate's Eyepatch
    const linkSelector = '#modal-content a[href*="item=280333"]';
    await page.waitForSelector(linkSelector);

    // 3. Hover sobre el item para disparar el tooltip
    console.log('Hover sobre Pirate\'s Eyepatch...');
    await page.hover(linkSelector);
    await new Promise(r => setTimeout(r, 1500));

    // 4. Inspeccionar el DOM del tooltip generado
    const tooltipData = await page.evaluate(() => {
      const tooltip = document.querySelector('.wowhead-tooltip') || document.querySelector('[class*="tooltip"]');
      if (!tooltip) return { found: false };
      
      const iconEl = tooltip.querySelector('[style*="background-image"], .icon, img');
      return {
        found: true,
        html: tooltip.innerHTML.slice(0, 300),
        iconStyle: iconEl ? iconEl.getAttribute('style') : null,
        iconTag: iconEl ? iconEl.tagName : null,
        iconSrc: iconEl ? iconEl.src : null
      };
    });

    console.log('\n[DATOS DEL TOOLTIP EN VIVO]:');
    console.log(JSON.stringify(tooltipData, null, 2));

    // 5. Captura de pantalla
    const screenshotPath = path.resolve(__dirname, 'tooltip_test_result.png');
    await page.screenshot({ path: screenshotPath });
    console.log('Screenshot guardado en:', screenshotPath);

  } catch (err) {
    console.error('Error en prueba visual:', err);
  } finally {
    await browser.close();
  }
}

runVisualTest();
