const puppeteer = require('puppeteer-extra');
const path = require('path');

async function checkMatchedRules() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 1500));

  const result = await page.evaluate(() => {
    const el = document.querySelector('.whtt-tooltip-icon ins');
    if (!el) return 'No element';
    return {
      inlineStyle: el.getAttribute('style'),
      delSibling: el.parentElement.querySelector('del')?.outerHTML,
      iconMediumClasses: el.parentElement.className
    };
  });

  console.log('RESULT:', JSON.stringify(result, null, 2));
  await browser.close();
}

checkMatchedRules();
