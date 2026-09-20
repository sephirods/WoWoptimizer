const puppeteer = require('puppeteer-extra');
const path = require('path');

async function debugCanvas() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Probar cargar la imagen en un elemento <img> dentro de la pagina para ver si file:// bloquea o si hay error
  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ loaded: true, w: img.width, h: img.height });
      img.onerror = (e) => resolve({ loaded: false, error: 'img load failed' });
      img.src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_helm_armor_pirateeyepatch_b_01_darkbrownpirate.jpg';
    });
  });

  console.log('RESULTADO IMAGE LOAD:', result);
  await browser.close();
}

debugCanvas();
