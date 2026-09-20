const puppeteer = require('puppeteer-extra');
const path = require('path');

async function debugDelCover() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 1500));

  const info = await page.evaluate(() => {
    const iconBox = document.querySelector('.whtt-tooltip-icon');
    const ins = iconBox ? iconBox.querySelector('ins') : null;
    const del = iconBox ? iconBox.querySelector('del') : null;
    return {
      delStyles: del ? {
        display: window.getComputedStyle(del).display,
        bg: window.getComputedStyle(del).background,
        pos: window.getComputedStyle(del).position,
        zIndex: window.getComputedStyle(del).zIndex,
        w: window.getComputedStyle(del).width,
        h: window.getComputedStyle(del).height
      } : null,
      insComputedBg: ins ? window.getComputedStyle(ins).backgroundImage : null
    };
  });

  console.log('DEL AND INS INFO:', JSON.stringify(info, null, 2));
  await browser.close();
}

debugDelCover();
