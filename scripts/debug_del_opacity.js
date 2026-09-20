const puppeteer = require('puppeteer-extra');
const path = require('path');

async function debugDelOpacity() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 1500));

  // Ocultar del para ver si del estaba tapando con negro
  await page.evaluate(() => {
    const del = document.querySelector('.whtt-tooltip-icon del');
    if (del) del.style.display = 'none';
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: path.resolve(__dirname, 'no_del_test.png') });
  console.log('Screenshot sin del guardado.');
  await browser.close();
}

debugDelOpacity();
