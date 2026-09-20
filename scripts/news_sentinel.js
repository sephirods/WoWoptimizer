const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', () => resolve({ status: 500, body: '' }));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ status: 408, body: '' });
    });
  });
}

function isEditorialNewsPost(title, excerpt) {
  const combined = `${title || ''} ${excerpt || ''}`.toLowerCase();
  const nonNewsKeywords = [
    'unable to launch',
    "can't install",
    'cannot install',
    'no wow account selector',
    'disconnects first player',
    'oops! something went wrong',
    'tech supporter',
    'corrupted file',
    'error code',
    'crashing on launch',
    'battle.net app crashed',
    'payment issue',
    'billing question',
    'refund request',
    'authenticator issue',
    'locked account',
    'ticket status'
  ];
  for (const kw of nonNewsKeywords) {
    if (combined.includes(kw)) return false;
  }
  return true;
}

async function checkSentinel() {
  console.log('=== [CENTINELA DE NOTICIAS DE WOW] Verificación Rápida (< 1s) ===');

  // 1. Cargar estado actual de base de datos
  const dbPath = path.join(__dirname, '../js/data/wow_news_data.js');
  let currentDb = { blueTracker: [], blizzardNews: [], recentNews: [] };
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    const fakeWin = {};
    eval(content.replace('window.', 'fakeWin.'));
    if (fakeWin.WOW_NEWS_DATABASE) currentDb = fakeWin.WOW_NEWS_DATABASE;
  } catch (e) {
    console.error('Error leyendo base de datos de producción:', e.message);
    return;
  }

  const existingBlueIds = new Set((currentDb.blueTracker || []).map(x => x.id || `blizz-${x.postId}`));
  const existingBlizzIds = new Set((currentDb.blizzardNews || []).map(x => x.id));
  const existingRecentUrls = new Set((currentDb.recentNews || []).map(x => x.originalUrl));

  let triggerBot1 = false;
  let triggerBot2 = false;
  let triggerBot3 = false;

  // --- REVISIÓN 1: BLUE TRACKER (BLIZZARD FORUMS API) ---
  try {
    const blueRes = await fetchUrl('https://us.forums.blizzard.com/en/wow/groups/blizzard-tracker/posts.json');
    if (blueRes.status === 200 && blueRes.body) {
      const data = JSON.parse(blueRes.body);
      const posts = data.posts || [];
      for (const p of posts.slice(0, 10)) {
        const title = p.topic_title || '';
        const excerpt = p.excerpt || '';
        if (!isEditorialNewsPost(title, excerpt)) continue;
        const isCumulative = /hotfix|tuning|patch notes|update|reset|balance/i.test(title);
        if (p.post_number !== 1 && !isCumulative) continue;

        const candidateId = `blizz-${p.id}`;
        if (!existingBlueIds.has(candidateId)) {
          console.log(`[CENTINELA] ¡Nuevo Blue Post detectado!: "${title}" (${candidateId})`);
          triggerBot1 = true;
          break;
        }
      }
    }
  } catch (err) {
    console.warn('[CENTINELA] Aviso comprobando Blue Tracker:', err.message);
  }

  // --- REVISIÓN 2: BLIZZARD OFFICIAL PORTAL ---
  try {
    const blizzRes = await fetchUrl('https://worldofwarcraft.blizzard.com/en-us/news');
    if (blizzRes.status === 200 && blizzRes.body) {
      const matches = Array.from(blizzRes.body.matchAll(/\/news\/([0-9]{7,9})/g)).map(m => m[1]);
      const uniqueIds = Array.from(new Set(matches));
      // Evaluamos los primeros 15 IDs de la portada para no perder noticias recientes tras banners destacados
      for (const idNum of uniqueIds.slice(0, 15)) {
        const blizzId = `blizz-${idNum}`;
        if (!existingBlizzIds.has(blizzId)) {
          console.log(`[CENTINELA] ¡Nueva Noticia Oficial de Blizzard detectada!: ID ${blizzId}`);
          triggerBot2 = true;
          break;
        }
      }
    }
  } catch (err) {
    console.warn('[CENTINELA] Aviso comprobando Blizzard News:', err.message);
  }

  // --- REVISIÓN 3: WOWHEAD RSS ---
  try {
    const whRes = await fetchUrl('https://www.wowhead.com/news/rss/retail');
    if (whRes.status === 200 && whRes.body) {
      const linkMatch = /<item>[\s\S]*?<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i.exec(whRes.body);
      if (linkMatch && linkMatch[1]) {
        const latestUrl = linkMatch[1].trim();
        if (!existingRecentUrls.has(latestUrl)) {
          console.log(`[CENTINELA] ¡Nueva Noticia de Wowhead detectada!: ${latestUrl}`);
          triggerBot3 = true;
        }
      }
    }
  } catch (err) {
    console.warn('[CENTINELA] Aviso comprobando Wowhead RSS:', err.message);
  }

  // --- EJECUCIÓN INTELIGENTE AISLADA ---
  if (!triggerBot1 && !triggerBot2 && !triggerBot3) {
    console.log('[CENTINELA] ✓ Todo el sistema está al día. 0 cambios requeridos. Fin de ciclo.');
    return;
  }

  if (triggerBot1) {
    console.log('[CENTINELA] -> Ejecutando Bot 1 (Blue Tracker)...');
    try {
      execSync('node build_news_snapshot.js', { stdio: 'inherit' });
    } catch (e) {
      console.error('Error al ejecutar Bot 1:', e.message);
    }
  }

  if (triggerBot2) {
    console.log('[CENTINELA] -> Ejecutando Bot 2 (Blizzard News Crawler)...');
    try {
      execSync('node scripts/blizzard_crawler.js', { stdio: 'inherit' });
    } catch (e) {
      console.error('Error al ejecutar Bot 2:', e.message);
    }
  }

  if (triggerBot3) {
    console.log('[CENTINELA] -> Ejecutando Bot 3 (Wowhead Processor)...');
    try {
      execSync('node scripts/batch_news_processor.js', { stdio: 'inherit' });
    } catch (e) {
      console.error('Error al ejecutar Bot 3:', e.message);
    }
  }

  console.log('[CENTINELA] Proceso de sincronización selectiva completado con éxito.');
}

checkSentinel();
