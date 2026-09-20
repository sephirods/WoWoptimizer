const puppeteer = require('puppeteer-extra');
const path = require('path');

async function debugExactIcon() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 2000));

  const info = await page.evaluate(() => {
    const box = document.querySelector('.whtt-tooltip-icon');
    if (!box) return 'no box';
    const ins = box.querySelector('ins');
    const del = box.querySelector('del');
    return {
      boxStyle: box.getAttribute('style'),
      boxComputed: {
        pos: window.getComputedStyle(box).position,
        left: window.getComputedStyle(box).left,
        top: window.getComputedStyle(box).top,
        w: window.getComputedStyle(box).width,
        h: window.getComputedStyle(box).height,
        bg: window.getComputedStyle(box).background
      },
      insComputed: ins ? {
        bg: window.getComputedStyle(ins).backgroundImage,
        w: window.getComputedStyle(ins).width,
        h: window.getComputedStyle(ins).height,
        pos: window.getComputedStyle(ins).position,
        top: window.getComputedStyle(ins).top,
        left: window.getComputedStyle(ins).left
      } : null,
      delComputed: del ? {
        bg: window.getComputedStyle(del).backgroundImage,
        w: window.getComputedStyle(del).width,
        h: window.getComputedStyle(del).height,
        pos: window.getComputedStyle(del).position
      } : null
    };
  });

  console.log('EXACT ICON DEBUG:', JSON.stringify(info, null, 2));
  await browser.close();
}

debugExactIcon();
