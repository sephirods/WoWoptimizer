const puppeteer = require('puppeteer-extra');
const path = require('path');

async function debugInlineStyle() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 1500));

  const info = await page.evaluate(() => {
    const ins = document.querySelector('.whtt-tooltip-icon ins');
    if (!ins) return 'no ins';
    return {
      cssText: ins.style.cssText,
      bgInline: ins.style.backgroundImage,
      outerHTML: ins.outerHTML
    };
  });

  console.log('INS RAW:', JSON.stringify(info, null, 2));
  await browser.close();
}

debugInlineStyle();
