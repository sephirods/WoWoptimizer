// BASE DE DATOS DE NOTICIAS, BLUE TRACKER Y ARTÍCULOS DE WORLD OF WARCRAFT: MIDNIGHT SEASON 2
window.WOW_NEWS_DATABASE = {
  blueTracker: [
    {
      id: "blue-1",
      region: "US",
      timeAgo: "3h",
      date: "19 Sep 2026",
      title: "Class Tuning Incoming for Midnight Season 2 — September 23",
      author: "Blizzard Entertainment",
      tag: "Blue Post",
      category: "Balance",
      badgeColor: "border-sky-500/60 bg-sky-950/80 text-sky-300",
      summary: "Afinaciones directas al daño de especializaciones mágicas, aumento a la supervivencia de tanques en M+ y rebalanceo de bonos de conjunto 4P.",
      content: `
        <div class="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          <div class="bg-blue-950/40 border border-blue-500/40 p-4 rounded-xl space-y-2">
            <h4 class="font-bold text-amber-400 text-sm flex items-center gap-2">
              <i class="fa-solid fa-bullhorn text-sky-400"></i> What's New & Executive Summary
            </h4>
            <p class="text-xs text-slate-300">
              With weekly maintenance on Tuesday, September 23, we will be implementing targeted class tuning adjustments for Midnight Season 2 raid and Mythic+ content. Our primary focus is bringing lagging DPS specs up to the median while normalizing outlier tier set synergies.
            </p>
          </div>

          <h3 class="text-base font-bold text-white border-b border-white/10 pb-1.5 pt-2">Death Knight</h3>
          <ul class="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Frost:</strong> Obliterate and Frost Strike damage increased by 6%.</li>
            <li><strong>Unholy:</strong> Death Coil and Festering Strike damage increased by 4%.</li>
            <li><strong>San'layn Hero Tree:</strong> Vampiric Strike damage increased by 8%.</li>
          </ul>

          <h3 class="text-base font-bold text-white border-b border-white/10 pb-1.5 pt-2">Paladin</h3>
          <ul class="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Retribution:</strong> Final Verdict and Blade of Justice damage increased by 5%.</li>
            <li><strong>Herald of the Sun:</strong> Dawnlight explosion damage normalized across high target counts.</li>
            <li><strong>Protection:</strong> Word of Glory healing increased by 10% when cast on self.</li>
          </ul>

          <h3 class="text-base font-bold text-white border-b border-white/10 pb-1.5 pt-2">Shaman</h3>
          <ul class="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Elemental:</strong> Lightning Bolt and Chain Lightning damage increased by 7%.</li>
            <li><strong>Stormbringer:</strong> Tempest critical strike damage bonus increased to 35% (was 30%).</li>
          </ul>

          <div class="bg-black/50 p-4 rounded-xl border border-wow-border text-xs text-slate-400 italic">
            "These numbers are subject to further iteration based on weekend testing in the Midnight Public Test Realm."
          </div>
        </div>
      `
    },
    {
      id: "blue-2",
      region: "US",
      timeAgo: "6h",
      date: "19 Sep 2026",
      title: "Leap Aboard the Pirate's Day Celebration — September 19!",
      author: "Blizzard Entertainment",
      tag: "Event",
      category: "World Event",
      badgeColor: "border-amber-500/60 bg-amber-950/80 text-amber-300",
      summary: "Dread Captain DeMeza ha regresado a Booty Bay con nuevas apariencias cosméticas y juguetes temáticos.",
      content: `
        <div class="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          <div class="bg-amber-950/30 border border-amber-500/40 p-4 rounded-xl">
            <h4 class="font-bold text-amber-400 text-sm mb-1">Ahoy, Mateys!</h4>
            <p class="text-xs text-slate-300">
              Hoist sail and make way for Booty Bay because Pirate's Day is here! Filled with treasures, grog, and finery galore, Dread Captain DeMeza awaits all hardy adventurers.
            </p>
          </div>
          <h3 class="text-base font-bold text-white pt-2">Recompensas Exclusivas:</h3>
          <ul class="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Pirate's Eyepatch Transmog:</strong> Nueva pieza cosmética por 1000g.</li>
            <li><strong>Petey (Avian Companion):</strong> Mascota de hombro temporal para surcar los mares.</li>
            <li><strong>Ol'Eary Shark Hunt:</strong> Enfrenta al temible escualo gigante en las aguas de la bahía.</li>
          </ul>
        </div>
      `
    },
    {
      id: "blue-3",
      region: "EU",
      timeAgo: "1d",
      date: "18 Sep 2026",
      title: "HOTFIX 3 — Midnight Season 2 Dungeon Encounter Fixes",
      author: "Blizzard Entertainment",
      tag: "Hotfix",
      category: "Fixes",
      badgeColor: "border-emerald-500/60 bg-emerald-950/80 text-emerald-300",
      summary: "Ajustes de dificultad en los jefes de las 8 mazmorras de la rotación M+ de Midnight.",
      content: `
        <div class="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          <p>
            Los siguientes hotfixes han sido desplegados en los servidores en vivo para mitigar picos de daño desproporcionados en llaves superiores a +12.
          </p>
          <ul class="list-disc list-inside space-y-2 pl-2 text-slate-300">
            <li><strong>Algeth'ar Academy:</strong> El sangrado de Vexamus ahora escala un 15% menos por nivel de piedra.</li>
            <li><strong>The Nokhud Offensive:</strong> La velocidad de proyectil de los arqueros centauros se redujo un 20%.</li>
            <li><strong>Grim Batol:</strong> Reducido el daño de área de Lava Burst en el encuentro con Drahga Shadowburner.</li>
          </ul>
        </div>
      `
    },
    {
      id: "blue-4",
      region: "US",
      timeAgo: "1d",
      date: "18 Sep 2026",
      title: "Great Vault Guarantee & Track Progression Clarifications",
      author: "Blizzard Entertainment",
      tag: "Announcement",
      category: "Systems",
      badgeColor: "border-purple-500/60 bg-purple-950/80 text-purple-300",
      summary: "Aclaraciones sobre las opciones de la Gran Cámara entre Mythic 1/6 (ilvl 321) y Mythic 6/6 (ilvl 334).",
      content: `
        <div class="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-300">
          <p>
            Queremos reiterar cómo opera la Gran Cámara durante la Temporada 2 de Midnight. Completar mazmorras de nivel +10 garantiza una opción del rango Mythic (ilvl 321 base, mejorable hasta ilvl 334 con Blazon crests).
          </p>
          <p>
            Los abalorios obtenidos a través de la Cámara cuentan con soporte nativo completo para sockets de gema prismática.
          </p>
        </div>
      `
    }
  ],

  recentNews: [
    {
      id: "news-1",
      timeAgo: "2h",
      date: "19 Sep 2026",
      title: "Midnight Season 2 Stat Diminishing Returns Breakdown",
      category: "Theorycrafting",
      author: "WoWOptimizer Analytics",
      badgeColor: "border-purple-500/60 bg-purple-950/80 text-purple-300",
      summary: "Análisis matemático a fondo de los umbrales de penalización de Maestría, Celeridad, Crítico y Versatilidad en Season 2.",
      content: `
        <div class="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          <div class="bg-purple-950/40 border border-purple-500/40 p-4 rounded-xl space-y-2">
            <h4 class="font-bold text-amber-400 text-sm">Resumen de Curvas de Penalización S2</h4>
            <p class="text-xs text-slate-300">
              En Midnight Season 2, acumular más del 30% de una estadística secundaria impone una penalización progresiva para incentivar la diversificación de equipo.
            </p>
          </div>

          <h3 class="text-base font-bold text-white pt-2">Tramos Oficiales de Reducción:</h3>
          <div class="overflow-x-auto rounded-xl border border-wow-border">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-black/60 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th class="p-2.5">Rango de Estadística</th>
                  <th class="p-2.5">Penalización</th>
                  <th class="p-2.5">Efecto Real</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 bg-wow-subcard">
                <tr><td class="p-2.5 text-emerald-400 font-bold">0% a 30%</td><td class="p-2.5">0%</td><td class="p-2.5 text-slate-300">100% valor de rating</td></tr>
                <tr><td class="p-2.5 text-amber-400 font-bold">30% a 39%</td><td class="p-2.5">10%</td><td class="p-2.5 text-slate-300">90% valor de rating</td></tr>
                <tr><td class="p-2.5 text-orange-400 font-bold">39% a 47%</td><td class="p-2.5">20%</td><td class="p-2.5 text-slate-300">80% valor de rating</td></tr>
                <tr><td class="p-2.5 text-red-400 font-bold">47% a 54%</td><td class="p-2.5">30%</td><td class="p-2.5 text-slate-300">70% valor de rating</td></tr>
                <tr><td class="p-2.5 text-purple-400 font-bold">&gt; 54%</td><td class="p-2.5">40% a 50%</td><td class="p-2.5 text-slate-300">Saturación extrema</td></tr>
              </tbody>
            </table>
          </div>

          <p class="text-xs text-slate-400">
            El algoritmo de WoWOptimizer calcula dinámicamente estos tramos en cada combinación para evitar que desperdicies presupuesto de stats al equipar piezas de ilvl alto.
          </p>
        </div>
      `
    },
    {
      id: "news-2",
      timeAgo: "5h",
      date: "19 Sep 2026",
      title: "Top 10 Abalorios para Mítica+ y Banda en Midnight S2",
      category: "Tier List",
      author: "Bloodmallet & Archon Hub",
      badgeColor: "border-red-500/60 bg-red-950/80 text-red-300",
      summary: "Descubre los abalorios con mayor tasa de victoria y simulaciones de DPS más altas de la temporada.",
      content: `
        <div class="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          <p>
            Basándonos en las últimas simulaciones de CastingPatchwerk de Bloodmallet y los logs de llaves +15 en Archon.gg, estos son los abalorios que dominan el meta actual:
          </p>
          <ul class="list-disc list-inside space-y-2 pl-2 text-slate-300">
            <li><strong class="text-amber-300">Keeper's Seething Core:</strong> El mejor abalorio pasivo de fuerza/agilidad, otorgando hasta 12,500 de daño crítico acumulativo.</li>
            <li><strong class="text-purple-300">Ovi'nax's Mercurial Egg:</strong> Abalorio híbrido de stat primario y secundario con mayor tasa de selección en raids míticos.</li>
            <li><strong class="text-blue-300">Treacherous Transmitter:</strong> Para burst en fases de apertura con Heroísmo/Lust.</li>
          </ul>
        </div>
      `
    },
    {
      id: "news-3",
      timeAgo: "1d",
      date: "18 Sep 2026",
      title: "Guía de Artesanía: Missives y Embellishments para Midnight",
      category: "Crafting",
      author: "WoWhead Guides",
      badgeColor: "border-amber-500/60 bg-amber-950/80 text-amber-300",
      summary: "Cómo craftear tus piezas BiS con los bonus IDs exactos para que el optimizador las equipe a la perfección.",
      content: `
        <div class="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          <p>
            Las piezas fabricadas con Spark of Omens permiten fijar exactamente las dos estadísticas deseadas mediante Missives y añadir un embellecimiento activo.
          </p>
          <div class="bg-black/40 p-3.5 rounded-xl border border-wow-border text-xs">
            <span class="text-emerald-400 font-bold">Consejo de Simulación:</span> En WoWOptimizer, al importar tu perfil de SimulationCraft, tus missives de artesanía se reconocen con fidelidad total (por ejemplo, muñecas 56 Haste / 56 Mastery).
          </div>
        </div>
      `
    }
  ]
};
