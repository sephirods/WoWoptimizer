const https = require('https');

function fetchUrl(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Demasiadas redirecciones'));
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = 'https://www.wowhead.com' + redirectUrl;
        }
        return resolve(fetchUrl(redirectUrl, redirectCount + 1));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function parseRss(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    const titleMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i.exec(itemContent);
    const linkMatch = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i.exec(itemContent);
    const pubDateMatch = /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i.exec(itemContent);
    const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i.exec(itemContent);
    const enclosureMatch = /<enclosure[^>]*url=["']([^"']+)["']/i.exec(itemContent);
    const mediaThumbnail = /<media:thumbnail[^>]*url=["']([^"']+)["']/i.exec(itemContent);

    // Extraer imagenes dentro de la descripcion
    let img = null;
    if (enclosureMatch) img = enclosureMatch[1];
    else if (mediaThumbnail) img = mediaThumbnail[1];
    else if (descMatch) {
      const imgInDesc = /<img[^>]+src=["']([^"']+)["']/i.exec(descMatch[1]);
      if (imgInDesc) img = imgInDesc[1];
    }

    // Extraer iconos de wowhead o blizzard si existen
    const iconMatch = /icons\/(?:small|medium|large)\/([a-zA-Z0-9_\-]+)\.(?:jpg|png|webp)/i.exec(itemContent);
    const icon = iconMatch ? iconMatch[1] : null;

    items.push({
      title: titleMatch ? titleMatch[1].trim() : 'Sin título',
      link: linkMatch ? linkMatch[1].trim() : '',
      pubDate: pubDateMatch ? pubDateMatch[1].trim() : '',
      image: img,
      icon: icon,
      snippet: descMatch ? descMatch[1].replace(/<[^>]+>/g, '').slice(0, 180).trim() + '...' : ''
    });
  }
  return items;
}

async function testFeeds() {
  console.log('--- Probando Feeds de Noticias (Blizzard & Wowhead) ---');
  
  // 1. Wowhead News Feed
  try {
    console.log('\n[1] Consultando Wowhead RSS...');
    const whRes = await fetchUrl('https://www.wowhead.com/news/rss/all');
    console.log(`Status Wowhead: ${whRes.status}, Longitud: ${whRes.body.length} bytes`);
    const whItems = parseRss(whRes.body);
    console.log(`Total noticias Wowhead detectadas: ${whItems.length}`);
    if (whItems.length > 0) {
      console.log('Muestra de Noticia Wowhead 1:');
      console.log(JSON.stringify(whItems[0], null, 2));
    }
  } catch (err) {
    console.error('Error Wowhead RSS:', err.message);
  }

  // 2. Blizzard Official WoW News RSS
  try {
    console.log('\n[2] Consultando Blizzard Official News RSS...');
    const blizzRes = await fetchUrl('https://worldofwarcraft.blizzard.com/en-us/news/rss');
    console.log(`Status Blizzard: ${blizzRes.status}, Longitud: ${blizzRes.body.length} bytes`);
    const blizzItems = parseRss(blizzRes.body);
    console.log(`Total noticias Blizzard detectadas: ${blizzItems.length}`);
    if (blizzItems.length > 0) {
      console.log('Muestra de Noticia Blizzard 1:');
      console.log(JSON.stringify(blizzItems[0], null, 2));
    }
  } catch (err) {
    console.error('Error Blizzard RSS:', err.message);
  }
}

async function extractArticleDetails(url) {
  try {
    const res = await fetchUrl(url);
    console.log('Status code obtenido:', res ? res.status : 'undefined');
    if (!res || res.status !== 200) return null;
    const html = res.body;

    // 1. Imagen principal de portada (og:image)
    const ogImgMatch = /property=["']og:image["']\s+content=["']([^"']+)["']/i.exec(html) ||
                       /content=["']([^"']+)["']\s+property=["']og:image["']/i.exec(html);
    const mainImage = ogImgMatch ? ogImgMatch[1] : null;

    // 2. Iconos presentes en el articulo
    const iconRegex = /zamimg\.com\/images\/wow\/icons\/(?:small|medium|large)\/([a-zA-Z0-9_\-]+)\.(?:jpg|png|webp)/gi;
    const icons = new Set();
    let m;
    while ((m = iconRegex.exec(html)) !== null) {
      icons.add(m[1]);
    }

    // 3. Model Viewer IDs (display-id o WH.ModelViewer)
    const modelRegex = /(?:data-model-viewer-display-id=["']([0-9]+)["']|displayId:\s*([0-9]+))/gi;
    const models = new Set();
    while ((m = modelRegex.exec(html)) !== null) {
      if (m[1]) models.add(m[1]);
      if (m[2]) models.add(m[2]);
    }

    console.log('Status de respuesta:', res.status, 'Longitud HTML:', html.length);
    return {
      mainImage,
      icons: Array.from(icons).slice(0, 10),
      models3D: Array.from(models)
    };
  } catch (e) {
    console.error('Error en extractArticleDetails:', e.message);
    return null;
  }
}

async function runDemo() {
  console.log('--- Extrayendo Noticia Enriquecida con Media ---');
  const sampleUrl = 'https://www.wowhead.com/news=383003/it-be-pirate-s-day-get-ye-a-new-transmog-fer-yer-peeper';
  console.log('Procesando URL:', sampleUrl);
  
  const details = await extractArticleDetails(sampleUrl);
  console.log('\n[RESULTADO DE LA EXTRACCIÓN]:');
  console.log(JSON.stringify(details, null, 2));
}

runDemo();
