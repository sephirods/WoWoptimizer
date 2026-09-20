const puppeteer = require('puppeteer-extra');
const path = require('path');

async function debugAllTips() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 2000));

  const allTips = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('*')).filter(el => {
      const cls = el.className;
      return typeof cls === 'string' && (cls.includes('tooltip') || cls.includes('iconmedium'));
    });
    return list.map(el => ({ tag: el.tagName, class: el.className, html: el.outerHTML.slice(0, 200) }));
  });

  console.log('ALL TIPS ELEMENTS:', JSON.stringify(allTips, null, 2));
  await browser.close();
}

debugAllTips();
