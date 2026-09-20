const fs = require('fs');
const path = require('path');
const vm = require('vm');

function extractCleanParagraph(html, maxLen = 160) {
  if (!html) return '';
  const plain = html
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length > maxLen) {
    return plain.slice(0, maxLen).trim() + '...';
  }
  return plain;
}

const targetFiles = [
  path.join(__dirname, '../js/data/wow_news_data.js'),
  path.join(__dirname, '../staging/mock_blizzard_data.js'),
  path.join(__dirname, 'latest_blizzard_news.json')
];

// 1. Actualizar latest_blizzard_news.json
const jsonPath = path.join(__dirname, 'latest_blizzard_news.json');
if (fs.existsSync(jsonPath)) {
  const list = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  list.forEach(item => {
    if (item.contentHtml) {
      const exEs = extractCleanParagraph(item.contentHtml.es || item.contentHtml.en);
      const exEn = extractCleanParagraph(item.contentHtml.en || item.contentHtml.es);
      if (!item.summary || item.summary.es === '...' || !item.summary.es) {
        item.summary = item.summary || {};
        item.summary.es = exEs || item.summary.es || '...';
        item.summary.en = exEn || item.summary.en || '...';
      }
    }
  });
  fs.writeFileSync(jsonPath, JSON.stringify(list, null, 2), 'utf-8');
  console.log('✓ Actualizado latest_blizzard_news.json');
}

// 2. Actualizar mock_blizzard_data.js
const mockPath = path.join(__dirname, '../staging/mock_blizzard_data.js');
if (fs.existsSync(mockPath)) {
  const content = fs.readFileSync(mockPath, 'utf-8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);
  const list = sandbox.window.STAGING_BLIZZARD_DATA || [];
  list.forEach(item => {
    if (item.contentHtml) {
      const exEs = extractCleanParagraph(item.contentHtml.es || item.contentHtml.en);
      const exEn = extractCleanParagraph(item.contentHtml.en || item.contentHtml.es);
      if (!item.summary || item.summary.es === '...' || !item.summary.es) {
        item.summary = item.summary || {};
        item.summary.es = exEs || item.summary.es || '...';
        item.summary.en = exEn || item.summary.en || '...';
      }
    }
  });
  fs.writeFileSync(mockPath, 'window.STAGING_BLIZZARD_DATA = ' + JSON.stringify(list, null, 2) + ';', 'utf-8');
  console.log('✓ Actualizado mock_blizzard_data.js');
}

// 3. Actualizar wow_news_data.js
const wowNewsPath = path.join(__dirname, '../js/data/wow_news_data.js');
if (fs.existsSync(wowNewsPath)) {
  const content = fs.readFileSync(wowNewsPath, 'utf-8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);
  const db = sandbox.window.WOW_NEWS_DATABASE || {};
  (db.blizzardNews || []).forEach(item => {
    if (item.contentHtml) {
      const exEs = extractCleanParagraph(item.contentHtml.es || item.contentHtml.en);
      const exEn = extractCleanParagraph(item.contentHtml.en || item.contentHtml.es);
      if (!item.summary || item.summary.es === '...' || !item.summary.es) {
        item.summary = item.summary || {};
        item.summary.es = exEs || item.summary.es || '...';
        item.summary.en = exEn || item.summary.en || '...';
      }
    }
  });
  fs.writeFileSync(wowNewsPath, '// BASE DE DATOS DE NOTICIAS, BLUE TRACKER Y ARTÍCULOS EN VIVO\nwindow.WOW_NEWS_DATABASE = ' + JSON.stringify(db, null, 2) + ';\n', 'utf-8');
  console.log('✓ Actualizado wow_news_data.js');
}
