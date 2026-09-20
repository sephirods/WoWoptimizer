const puppeteer = require('puppeteer-extra');
const path = require('path');

async function debugCanvasDraw() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, '../staging/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.click('#news-grid article');
  await new Promise(r => setTimeout(r, 1000));
  await page.hover('#modal-content a[href*="item=280333"]');
  await new Promise(r => setTimeout(r, 1500));

  // Reemplazar el ins con un <img> real
  await page.evaluate(() => {
    const iconBox = document.querySelector('.whtt-tooltip-icon .iconmedium');
    if (iconBox) {
      iconBox.innerHTML = '<img src="https://wow.zamimg.com/images/wow/icons/medium/inv_helm_armor_pirateeyepatch_b_01_darkbrownpirate.jpg" style="width:44px;height:44px;border-radius:4px;display:block;" />';
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.resolve(__dirname, 'img_replacement_test.png') });
  console.log('Screenshot con <img> guardado.');
  await browser.close();
}

debugCanvasDraw();
