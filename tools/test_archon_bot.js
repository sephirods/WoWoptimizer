// tools/test_archon_bot.js
// Prueba aislada de extracción de Archon.gg desde GitHub Actions sin modificar datos del sitio.

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 [Test] Iniciando navegador Chromium en GitHub Actions...');
  
  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US'
  });

  const page = await context.newPage();

  const testSpecs = [
    { name: 'Paladín Retribución (Raid)', url: 'https://www.archon.gg/wow/builds/retribution/paladin/raid/overview/mythic/all-bosses' },
    { name: 'DK Sangre (Mítica+)', url: 'https://www.archon.gg/wow/builds/blood/death-knight/mythic-plus/overview/high-keys/all-dungeons/this-week' }
  ];

  let successCount = 0;

  for (const item of testSpecs) {
    console.log(`\n🔍 [Test] Consultando: ${item.name}`);
    console.log(`   URL: ${item.url}`);

    try {
      const response = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const status = response ? response.status() : 'No response';
      console.log(`   HTTP Status: ${status}`);

      // Esperar brevemente a que el DOM cargue componentes dinámicos
      await page.waitForTimeout(4000);

      const title = await page.title();
      console.log(`   Título de página: "${title}"`);

      const content = await page.content();

      // Comprobar si Cloudflare arrojó pantalla de desafío
      if (content.includes('cf-browser-verification') || content.includes('Just a moment...') || content.includes('challenge-running')) {
        console.warn('   ❌ BLOQUEO: Cloudflare mostró un reto antibot (Turnstile/Challenge).');
        continue;
      }

      // Buscar si el contenedor de estadísticas de Archon está presente
      const hasStatsSection = await page.$('.builds-stat-priority-section__container, [class*="stat-priority"]');
      if (hasStatsSection) {
        console.log('   ✅ ÉXITO: Sección de estadísticas encontrada en el DOM sin bloqueo.');
        successCount++;
      } else {
        console.log('   ⚠️ La página cargó sin bloqueo de Cloudflare, analizando estructura de datos...');
        if (content.includes('builds-stat-priority') || content.includes('statAverages')) {
          console.log('   ✅ ÉXITO: Datos de estadísticas localizados en el HTML.');
          successCount++;
        } else {
          console.log('   ℹ️ Revisar selector (página cargada exitosamente sin reto antibot).');
        }
      }
    } catch (err) {
      console.error(`   ❌ Error al consultar ${item.name}:`, err.message);
    }
  }

  await browser.close();

  console.log(`\n📊 [Resultado Final] Exitosos: ${successCount}/${testSpecs.length}`);
  if (successCount > 0) {
    console.log('🎉 PRUEBA SUPERADA: GitHub Actions puede acceder a Archon.gg sin bloqueo de Cloudflare.');
  } else {
    console.log('⚠️ PRUEBA CON OBSERVACIONES: Revisar los logs detallados arriba.');
  }
})();
