const fs = require('fs');

const wowheadData = JSON.parse(fs.readFileSync('scripts/latest_scraped_news.json', 'utf8'));
const blizzData = JSON.parse(fs.readFileSync('scripts/latest_blizzard_news.json', 'utf8'));

// Cargar el archivo wow_news_data.js existente para respetar lo que ya hay
const originalContent = fs.readFileSync('js/data/wow_news_data.js', 'utf8');
const fakeWindow = {};
eval(originalContent.replace('window.', 'fakeWindow.'));

const currentDb = fakeWindow.WOW_NEWS_DATABASE || { blueTracker: [], blizzardNews: [], recentNews: [] };
const blueTrackerJson = currentDb.blueTracker || [];
// Preservar blizzardNews si ya existen en la base, de lo contrario usar fallback de archivo
let blizzardNewsJson = currentDb.blizzardNews && currentDb.blizzardNews.length > 0 ? currentDb.blizzardNews : [];
if (blizzardNewsJson.length === 0 && fs.existsSync('scripts/latest_blizzard_news.json')) {
  try {
    const raw = JSON.parse(fs.readFileSync('scripts/latest_blizzard_news.json', 'utf8'));
    if (Array.isArray(raw) && raw.length > 0) blizzardNewsJson = raw;
  } catch (e) {}
}

const recentNews = wowheadData.map(item => ({
  id: item.id,
  source: 'wowhead',
  dateRaw: item.dateRaw,
  author: item.author || 'Wowhead Staff',
  category: item.category || 'Live',
  badgeColor: item.badgeColor || 'border-amber-500/60 bg-amber-950/80 text-amber-300',
  title: item.title,
  summary: item.summary,
  contentHtml: item.contentHtml,
  content: {
    en: item.contentHtml,
    es: item.contentHtml
  },
  imageUrl: item.imageUrl,
  icons: item.icons || [],
  models3D: item.models3D || [],
  originalUrl: item.originalUrl
}));

const existingRecent = currentDb.recentNews || [];
const mergedRecent = [];
const seenIds = new Set();
for (const item of recentNews) {
  if (item && item.id && !seenIds.has(item.id)) {
    seenIds.add(item.id);
    mergedRecent.push(item);
  }
}
for (const item of existingRecent) {
  if (item && item.id && !seenIds.has(item.id)) {
    seenIds.add(item.id);
    mergedRecent.push(item);
  }
}
const finalRecentNews = mergedRecent.slice(0, 50);

const newDb = {
  blueTracker: blueTrackerJson,
  blizzardNews: blizzardNewsJson,
  recentNews: finalRecentNews
};

const newFileContent = '// BASE DE DATOS DE NOTICIAS, BLUE TRACKER Y ARTÍCULOS EN VIVO\nwindow.WOW_NEWS_DATABASE = ' + JSON.stringify(newDb, null, 2) + ';\n';
fs.writeFileSync('js/data/wow_news_data.js', newFileContent, 'utf8');
console.log('[BOT 3 - WOWHEAD NEWS] Éxito: Se consolidaron ' + finalRecentNews.length + ' noticias de Wowhead (histórico preservado). Blue Tracker (' + blueTrackerJson.length + ') y Blizzard News (' + blizzardNewsJson.length + ') preservadas.');

