const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function inspectLiveTooltip() {
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto('https://www.wowhead.com/news/it-be-pirate-s-day-get-ye-a-new-transmog-fer-yer-peeper-383003', { waitUntil: 'domcontentloaded' });

    console.log('Haciendo hover en el enlace de Wowhead...');
    await page.waitForSelector('a[href*="item=280333"]', { timeout: 15000 });
    await page.hover('a[href*="item=280333"]');
    await new Promise(r => setTimeout(r, 2000));

    const result = await page.evaluate(() => {
      const tip = document.querySelector('.wowhead-tooltip');
      if (!tip) return 'No tooltip encontrado';

      const iconBox = tip.querySelector('.whtt-tooltip-icon, .iconmedium, [style*="background-image"]');
      return {
        outerHTML: tip.outerHTML.slice(0, 400),
        iconBoxHTML: iconBox ? iconBox.outerHTML : null,
        computedStyles: iconBox ? {
          display: window.getComputedStyle(iconBox).display,
          width: window.getComputedStyle(iconBox).width,
          height: window.getComputedStyle(iconBox).height,
          backgroundImage: window.getComputedStyle(iconBox).backgroundImage,
          visibility: window.getComputedStyle(iconBox).visibility
        } : null
      };
    });

    console.log('\n[INSPECCIÓN TOOLTIP WOWHEAD REAL]:');
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Error inspeccionando:', e.message);
  } finally {
    await browser.close();
  }
}

inspectLiveTooltip();
