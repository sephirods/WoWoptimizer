const fs = require('fs');

const wowheadData = JSON.parse(fs.readFileSync('scripts/latest_scraped_news.json', 'utf8'));
const blizzData = JSON.parse(fs.readFileSync('scripts/latest_blizzard_news.json', 'utf8'));

// Cargar el archivo wow_news_data.js original de forma limpia
const originalContent = fs.readFileSync('js/data/wow_news_data.js', 'utf8');
const fakeWindow = {};
eval(originalContent.replace('window.', 'fakeWindow.'));

const blueTrackerJson = fakeWindow.WOW_NEWS_DATABASE.blueTracker;

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

const blizzardNews = blizzData.map(item => ({
  id: item.id,
  source: 'blizzard',
  author: item.author || 'Blizzard Entertainment',
  dateRaw: item.dateRaw,
  category: item.category || 'Oficial',
  badgeColor: item.badgeColor || 'border-sky-500/60 bg-sky-950/80 text-sky-300',
  title: item.title,
  summary: item.summary,
  imageUrl: item.imageUrl,
  contentHtml: item.contentHtml,
  content: item.contentHtml,
  originalUrl: item.originalUrl,
  originalUrlEs: item.originalUrlEs
}));

const newDb = {
  blueTracker: blueTrackerJson,
  blizzardNews: blizzardNews,
  recentNews: recentNews
};

const newFileContent = '// BASE DE DATOS DE NOTICIAS, BLUE TRACKER Y ARTÍCULOS EN VIVO\nwindow.WOW_NEWS_DATABASE = ' + JSON.stringify(newDb, null, 2) + ';\n';
fs.writeFileSync('js/data/wow_news_data.js', newFileContent, 'utf8');
console.log('Successfully updated js/data/wow_news_data.js with ' + blizzardNews.length + ' blizzard news and ' + recentNews.length + ' wowhead news.');
