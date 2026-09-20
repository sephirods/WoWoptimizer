const puppeteer = require('puppeteer-extra');
const path = require('path');

async function debugNetwork() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('request', req => {
    if (req.url().includes('icons/')) {
      console.log('REQ:', req.url());
    }
  });
  page.on('response', res => {
    if (res.url().includes('icons/')) {
      console.log('RES:', res.status(), res.url());
    }
  });

  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 2000));

  await browser.close();
}

debugNetwork();
