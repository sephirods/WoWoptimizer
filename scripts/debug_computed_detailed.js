const puppeteer = require('puppeteer-extra');
const path = require('path');

async function debugComputedDetailed() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 1500));

  const details = await page.evaluate(() => {
    const box = document.querySelector('.whtt-tooltip-icon');
    const ins = box ? box.querySelector('ins') : null;
    const del = box ? box.querySelector('del') : null;
    return {
      boxHTML: box ? box.innerHTML : null,
      insBgComputed: ins ? window.getComputedStyle(ins).backgroundImage : null,
      insW: ins ? window.getComputedStyle(ins).width : null,
      insH: ins ? window.getComputedStyle(ins).height : null,
      delBgComputed: del ? window.getComputedStyle(del).backgroundImage : null
    };
  });

  console.log('DETAILS:', JSON.stringify(details, null, 2));
  await browser.close();
}

debugComputedDetailed();
