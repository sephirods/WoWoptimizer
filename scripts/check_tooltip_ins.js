const puppeteer = require('puppeteer-extra');
const path = require('path');

async function checkIns() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 1500));

  const debug = await page.evaluate(() => {
    const tip = document.querySelector('.wowhead-tooltip');
    const iconContainer = tip ? tip.querySelector('.whtt-tooltip-icon') : null;
    const ins = iconContainer ? iconContainer.querySelector('ins') : null;
    return {
      tipBounding: tip ? tip.getBoundingClientRect() : null,
      iconContainerBounding: iconContainer ? iconContainer.getBoundingClientRect() : null,
      iconContainerHTML: iconContainer ? iconContainer.outerHTML : null,
      insComputed: ins ? {
        bg: window.getComputedStyle(ins).backgroundImage,
        w: window.getComputedStyle(ins).width,
        h: window.getComputedStyle(ins).height,
        d: window.getComputedStyle(ins).display,
        v: window.getComputedStyle(ins).visibility,
        rect: ins.getBoundingClientRect()
      } : 'no ins'
    };
  });

  console.log('RESULTADO DEBUG:', JSON.stringify(debug, null, 2));
  await browser.close();
}

checkIns();
