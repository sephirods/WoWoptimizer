const puppeteer = require('puppeteer-extra');
const path = require('path');

async function checkImageDirect() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const res = await page.goto('https://wow.zamimg.com/images/wow/icons/medium/inv_helm_armor_pirateeyepatch_b_01_darkbrownpirate.jpg');
  console.log('STATUS:', res.status());
  console.log('BUFFER LENGTH:', (await res.buffer()).length);
  await browser.close();
}

checkImageDirect();
