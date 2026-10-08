const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// We will use regex to find the FAQPage object inside the @graph array
// It starts with {"@type": "FAQPage" and ends with ]} before the closing </script>
const regex = /\{\s*"@type":\s*"FAQPage"[\s\S]*?\}\s*\]\s*\}/;

const replacement = `{
          "@type": "FAQPage",
          "@id": "https://wowtopgear.app/#faq-es",
          "inLanguage": "es",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "¿Qué es WoWTopGear?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "WoWTopGear es una plataforma analítica y optimizador de equipo para World of Warcraft: Midnight Season 2. Permite calcular la combinación óptima de estadísticas secundarias, seleccionar los mejores abalorios para Banda y Míticas+, y exportar perfiles directamente a SimulationCraft sin tiempos de espera."
              }
            },
            {
              "@type": "Question",
              "name": "¿Cómo optimiza WoWTopGear las estadísticas y abalorios de mi personaje?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Utiliza datos estadísticos actualizados extraídos de Archon.gg, Wowhead y simulaciones de Bloodmallet para comparar las 40 especializaciones de clase tanto en entorno de Banda (Raid) como en Míticas+ (Mplus), indicando el reparto ideal de Celeridad, Crítico, Maestría y Versatilidad."
              }
            },
            {
              "@type": "Question",
              "name": "¿Es WoWTopGear gratuito y compatible con SimulationCraft (SimC)?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sí, WoWTopGear es 100% gratuito, funciona directamente en el navegador sin descargas y permite importar y exportar perfiles en formato SimC de forma instantánea."
              }
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://wowtopgear.app/#faq-en",
          "inLanguage": "en",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is WoWTopGear?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "WoWTopGear is an analytical platform and gear optimizer for World of Warcraft: Midnight Season 2. It calculates your optimal secondary stats, selects the best trinkets for Raid and Mythic+, and exports profiles directly to SimulationCraft without queues or wait times."
              }
            },
            {
              "@type": "Question",
              "name": "How does WoWTopGear optimize my character's stats and trinkets?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "It uses up-to-date statistical data from Archon.gg, Wowhead, and Bloodmallet simulations to compare all 40 class specializations in both Raid and Mythic+ environments, recommending the ideal distribution of Haste, Critical Strike, Mastery, and Versatility."
              }
            },
            {
              "@type": "Question",
              "name": "Is WoWTopGear free and compatible with SimulationCraft (SimC)?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, WoWTopGear is 100% free, runs directly in your browser with no downloads, and allows you to instantly import and export SimC profiles."
              }
            }
          ]
        }`;

content = content.replace(regex, replacement);
fs.writeFileSync('index.html', content, 'utf8');
console.log('Done');
