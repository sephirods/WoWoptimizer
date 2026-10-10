/**
 * Spec Guide Dynamic UI Renderer
 * Renders complete dynamic spec guides (BiS Gear, Talents, Stat Priorities, Consumables & Enchants)
 * for World of Warcraft: Midnight Season 2 (Patch 12.1.5).
 */

const SLOT_NAMES = {
  0: { en: 'Head', es: 'Cabeza' },
  1: { en: 'Neck', es: 'Cuello' },
  2: { en: 'Shoulders', es: 'Hombreras' },
  3: { en: 'Back', es: 'Capa' },
  4: { en: 'Chest', es: 'Pechera' },
  5: { en: 'Wrist', es: 'Brazales' },
  6: { en: 'Hands', es: 'Guantes' },
  7: { en: 'Waist', es: 'Cinturón' },
  8: { en: 'Legs', es: 'Pantalones' },
  9: { en: 'Feet', es: 'Botas' },
  10: { en: 'Finger 1', es: 'Anillo 1' },
  11: { en: 'Finger 2', es: 'Anillo 2' },
  12: { en: 'Weapon', es: 'Arma' },
  13: { en: 'Off-Hand / Shield', es: 'Mano Izquierda / Escudo' },
  14: { en: 'Trinket 1', es: 'Abalorio 1' },
  15: { en: 'Trinket 2', es: 'Abalorio 2' }
};

const ENCHANT_SLOTS_ES = {
  'Weapon': 'Arma',
  'Main Hand': 'Mano Principal',
  'Off Hand': 'Mano Izquierda',
  'Shoulder': 'Hombreras',
  'Shoulders': 'Hombreras',
  'Chest': 'Pechera',
  'Head': 'Cabeza',
  'Helm': 'Cabeza',
  'Legs': 'Pantalones',
  'Boots': 'Botas',
  'Feet': 'Botas',
  'Ring': 'Anillo',
  'Finger': 'Anillo',
  'Cloak': 'Capa',
  'Back': 'Capa',
  'Wrist': 'Brazales',
  'Bracer': 'Brazales'
};

const CONSUMABLE_TYPES_ES = {
  'Flask': 'Frasco',
  'Phial': 'Frasco',
  'Combat Potion': 'Poción de Combate',
  'Potion': 'Poción',
  'Health Potion': 'Poción de Salud',
  'Weapon Buff': 'Mejora de Arma / Aceite',
  'Oil': 'Aceite de Arma',
  'Augment Rune': 'Runa de Aumento',
  'Food': 'Comida / Festín',
  'Feast': 'Festín'
};

const HERO_TREE_NAMES_ES = {
  'Lightsmith': 'Forjador de Luz',
  'Herald of the Sun': 'Heraldo del Sol',
  'Templar': 'Templario',
  'Colossus': 'Coloso',
  'Mountain Thane': 'Thane de la Montaña',
  'Slayer': 'Exterminador',
  'San\'layn': 'San\'layn',
  'Deathbringer': 'Portador de la Muerte',
  'Rider of the Apocalypse': 'Jinete del Apocalipsis',
  'Aldrachi Reaver': 'Atracador Aldrachi',
  'Fel-Scarred': 'Marcado por el Caos',
  'Elune\'s Chosen': 'Elegido de Elune',
  'Keeper of the Grove': 'Guardián de la Arboleda',
  'Wildstalker': 'Acechador Salvaje',
  'Druid of the Claw': 'Druida de la Zarpa',
  'Chronowarden': 'Vigía del Tiempo',
  'Flameshaper': 'Moldeallamas',
  'Scalecommander': 'Comandante de Escama',
  'Pack Leader': 'Líder de la Manada',
  'Dark Ranger': 'Guardabosques Oscuro',
  'Sentinel': 'Centinela',
  'Frostfire': 'Fuegoescarcha',
  'Spellslinger': 'Tiraconjuros',
  'Sunfury': 'Furia Solar',
  'Master of Harmony': 'Maestro de la Harmonía',
  'Shado-Pan': 'Shado-Pan',
  'Conduit of the Celestials': 'Conducto de los Celestiales',
  'Archon': 'Arconte',
  'Oracle': 'Oráculo',
  'Voidweaver': 'Tejedordelvacío',
  'Deathstalker': 'Acechador Mortal',
  'Fatebound': 'Vinculado al Destino',
  'Trickster': 'Bribón',
  'Farseer': 'Clarividente',
  'Stormbringer': 'Clamatormentas',
  'Totemic': 'Totémico',
  'Diabolist': 'Diabolista',
  'Hellcaller': 'Clamaencantos',
  'Soul Harvester': 'Cosechador de Almas'
};

const CLASS_NAMES_MAP = {
  'deathknight': { en: 'Death Knight', es: 'Caballero de la Muerte', color: '#C41E3A' },
  'demonhunter': { en: 'Demon Hunter', es: 'Cazador de Demonios', color: '#A330C9' },
  'druid': { en: 'Druid', es: 'Druida', color: '#FF7C0A' },
  'evoker': { en: 'Evoker', es: 'Evocador', color: '#33937F' },
  'hunter': { en: 'Hunter', es: 'Cazador', color: '#AAD372' },
  'mage': { en: 'Mage', es: 'Mago', color: '#3FC7EB' },
  'monk': { en: 'Monk', es: 'Monje', color: '#00FF98' },
  'paladin': { en: 'Paladin', es: 'Paladín', color: '#F48CBA' },
  'priest': { en: 'Priest', es: 'Sacerdote', color: '#FFFFFF' },
  'rogue': { en: 'Rogue', es: 'Pícaro', color: '#FFF468' },
  'shaman': { en: 'Shaman', es: 'Chamán', color: '#0070DD' },
  'warlock': { en: 'Warlock', es: 'Brujo', color: '#8788EE' },
  'warrior': { en: 'Warrior', es: 'Guerrero', color: '#C69B6D' }
};

const SPEC_NAMES_MAP = {
  'blood': { en: 'Blood', es: 'Sangre' },
  'frost_dk': { en: 'Frost', es: 'Escarcha' },
  'unholy': { en: 'Unholy', es: 'Profano' },
  'havoc': { en: 'Havoc', es: 'Devastación' },
  'vengeance': { en: 'Vengeance', es: 'Venganza' },
  'devourer': { en: 'Devourer', es: 'Devorador' },
  'balance': { en: 'Balance', es: 'Equilibrio' },
  'feral': { en: 'Feral', es: 'Feral' },
  'guardian': { en: 'Guardian', es: 'Guardián' },
  'restoration_druid': { en: 'Restoration', es: 'Restauración' },
  'devastation': { en: 'Devastation', es: 'Devastación' },
  'preservation': { en: 'Preservation', es: 'Preservación' },
  'augmentation': { en: 'Augmentation', es: 'Aumento' },
  'beastmastery': { en: 'Beast Mastery', es: 'Bestias' },
  'marksmanship': { en: 'Marksmanship', es: 'Puntería' },
  'survival': { en: 'Survival', es: 'Supervivencia' },
  'arcane': { en: 'Arcane', es: 'Arcano' },
  'fire': { en: 'Fire', es: 'Fuego' },
  'frost_mage': { en: 'Frost', es: 'Escarcha' },
  'brewmaster': { en: 'Brewmaster', es: 'Maestro Cervecero' },
  'mistweaver': { en: 'Mistweaver', es: 'Tejedor de Niebla' },
  'windwalker': { en: 'Windwalker', es: 'Viajero del Viento' },
  'holy_paladin': { en: 'Holy', es: 'Sagrado' },
  'protection_paladin': { en: 'Protection', es: 'Protección' },
  'retribution': { en: 'Retribution', es: 'Reprensión' },
  'discipline': { en: 'Discipline', es: 'Disciplina' },
  'holy_priest': { en: 'Holy', es: 'Sagrado' },
  'shadow': { en: 'Shadow', es: 'Sombras' },
  'assassination': { en: 'Assassination', es: 'Asesinato' },
  'outlaw': { en: 'Outlaw', es: 'Forajido' },
  'subtlety': { en: 'Subtlety', es: 'Sutileza' },
  'elemental': { en: 'Elemental', es: 'Elemental' },
  'enhancement': { en: 'Enhancement', es: 'Mejora' },
  'restoration_shaman': { en: 'Restoration', es: 'Restauración' },
  'affliction': { en: 'Affliction', es: 'Aflicción' },
  'demonology': { en: 'Demonology', es: 'Demonología' },
  'destruction': { en: 'Destruction', es: 'Destrucción' },
  'arms': { en: 'Arms', es: 'Armas' },
  'fury': { en: 'Fury', es: 'Furia' },
  'protection_warrior': { en: 'Protection', es: 'Protección' }
};

window._lastSpecGuideArgs = null;

window.renderCurrentSpecGuide = function() {
  if (window._lastSpecGuideArgs && typeof window.renderSpecGuide === 'function') {
    const [cId, cKey, sKey, aMode] = window._lastSpecGuideArgs;
    window.renderSpecGuide(cId, cKey, sKey, aMode);
  }
};

window.renderSpecGuide = function (containerId, classKey, specKey, activeMode = 'raid') {
  window._lastSpecGuideArgs = [containerId, classKey, specKey, activeMode];
  const container = document.getElementById(containerId);
  if (!container) return;

  let basePath = container.dataset.basePath;
  if (basePath === undefined) {
    if (typeof window !== 'undefined' && window.location.pathname.match(/\/(classes|guides)\/[^\/]+\/[^\/]+/)) {
      basePath = '../../../';
    } else if (typeof window !== 'undefined' && window.location.pathname.match(/\/(classes|guides)\/[^\/]+/)) {
      basePath = '../../';
    } else if (typeof window !== 'undefined' && (window.location.pathname.includes('/classes/') || window.location.pathname.includes('/guides/'))) {
      basePath = '../';
    } else {
      basePath = '';
    }
  }

  const isEs = (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'mx'));

  // Nombres de Clase y Especialización
  const clsData = CLASS_NAMES_MAP[classKey] || { en: classKey, es: classKey, color: '#F48CBA' };
  const spData = SPEC_NAMES_MAP[specKey] || { en: specKey, es: specKey };
  const className = isEs ? clsData.es : clsData.en;
  const specName = isEs ? spData.es : spData.en;
  const fullSpecName = isEs ? `${className} ${specName}` : `${specName} ${className}`;
  const modeName = activeMode === 'raid' ? (isEs ? 'Banda Mítica' : 'Mythic Raid') : (isEs ? 'Míticas+ (High Keys)' : 'Mythic+ (High Keys)');

  // 1. Obtener Datos de Archon y Wowhead
  const archonSpecs = (typeof window.ARCHON_PRESETS !== 'undefined') ? window.ARCHON_PRESETS : {};
  const classArchon = archonSpecs[classKey] || {};
  const specArchon = classArchon[specKey] || classArchon[`${specKey}_${classKey}`] || classArchon[`${classKey}_${specKey}`] || classArchon[specKey.split('_')[0]] || classArchon[specKey.replace(/_.*/, '')] ||
                       (specKey === 'protection' && (classArchon['protection_paladin'] || classArchon['prot_warrior'])) ||
                       (specKey === 'holy' && (classArchon['holy_paladin'] || classArchon['holy_priest'])) ||
                       (specKey === 'frost' && (classArchon['frost_dk'] || classArchon['frost_mage'])) ||
                       (specKey === 'restoration' && (classArchon['restoration_druid'] || classArchon['restoration_shaman'])) ||
                       (specKey === 'restoration_shaman' && classArchon['restoration']) ||
                       (specKey === 'restoration_druid' && classArchon['restoration']) ||
                       (specKey === 'prot_warrior' && classArchon['protection']) ||
                       (specKey === 'protection_paladin' && classArchon['protection']) ||
                       (specKey === 'holy_paladin' && classArchon['holy']) ||
                       (specKey === 'holy_priest' && classArchon['holy']) ||
                       (specKey === 'frost_dk' && classArchon['frost']) ||
                       (specKey === 'frost_mage' && classArchon['frost']) || {};
  const modeData = specArchon[activeMode] || specArchon.raid || { m: 0, c: 0, h: 0, v: 0, talents: '', heroTree: '', bisGear: [] };

  const wowheadData = (typeof window.WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES !== 'undefined') 
    ? window.WOWHEAD_SPEC_ENCHANTS_AND_CONSUMABLES[classKey]?.[specKey] || {} 
    : {};
  const enchants = wowheadData.enchants || [];
  const consumables = wowheadData.consumables || [];

  const rawHeroName = modeData.heroTree || '';
  const heroNameTranslated = (isEs && rawHeroName && HERO_TREE_NAMES_ES[rawHeroName]) ? HERO_TREE_NAMES_ES[rawHeroName] : rawHeroName;
  const heroName = heroNameTranslated || (isEs ? 'Recomendado' : 'Recommended');
  const talentsString = modeData.talents || '';

  // Determinar stat principal y orden de secundarias para el texto dinámico de SEO
  const intelSpecs = ['holy_paladin', 'balance', 'restoration_druid', 'devastation', 'preservation', 'augmentation', 'arcane', 'fire', 'frost_mage', 'mistweaver', 'discipline', 'holy_priest', 'shadow', 'elemental', 'restoration_shaman', 'affliction', 'demonology', 'destruction'];
  const agiSpecs = ['havoc', 'vengeance', 'devourer', 'feral', 'guardian', 'beastmastery', 'marksmanship', 'survival', 'brewmaster', 'windwalker', 'assassination', 'outlaw', 'subtlety', 'enhancement'];
  let primaryName = isEs ? 'Fuerza' : 'Strength';
  if (intelSpecs.includes(specKey)) primaryName = isEs ? 'Intelecto' : 'Intellect';
  else if (agiSpecs.includes(specKey)) primaryName = isEs ? 'Agilidad' : 'Agility';

  const orderedSecNames = [
    { name: isEs ? 'Celeridad' : 'Haste', val: modeData.h || 0 },
    { name: isEs ? 'Golpe Crítico' : 'Critical Strike', val: modeData.c || 0 },
    { name: isEs ? 'Maestría' : 'Mastery', val: modeData.m || 0 },
    { name: isEs ? 'Versatilidad' : 'Versatility', val: modeData.v || 0 }
  ].sort((a, b) => b.val - a.val).map(x => x.name);

  const statsOrderString = `${primaryName} > ${orderedSecNames.join(' > ')}`;

  // Cálculo dinámico del tiempo transcurrido desde la última actualización real de datos
  const lastSyncIso = (typeof window !== 'undefined' && window.ARCHON_LAST_UPDATED) 
    || (typeof localStorage !== 'undefined' ? localStorage.getItem('archon_last_sync') : null) 
    || '2026-09-28T02:00:00Z';
  
  const getRelativeTimeText = () => {
    try {
      const past = new Date(lastSyncIso).getTime();
      const diffMs = Math.max(0, Date.now() - past);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMins < 2) return isEs ? 'hace unos momentos' : 'just now';
      if (diffMins < 60) return isEs ? `hace ${diffMins} minutos` : `${diffMins} minutes ago`;
      if (diffHours < 24) return isEs ? `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}` : `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      return isEs ? `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}` : `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } catch (e) {
      return isEs ? 'hace poco' : 'recently';
    }
  };
  const lastUpdatedString = getRelativeTimeText();

  // Render HTML
  container.innerHTML = `
    <div class="space-y-8">
      
      <!-- ENCABEZADO PRINCIPAL DE LA GUÍA (SEO DINÁMICO ARCHON 1:1) -->
      <section class="bg-wow-card border border-wow-border p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center md:items-center justify-between gap-6 text-center md:text-left">
        <div class="space-y-2 max-w-3xl flex flex-col items-center md:items-start">
          <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start flex-wrap gap-2.5">
            <span style="color: ${clsData.color};">${fullSpecName}</span>
            <span class="text-slate-200">${activeMode === 'raid' ? (isEs ? 'Build de Banda Mítica' : 'Mythic Raid Build') : (isEs ? 'Build de Míticas+ (High Keys)' : 'Mythic+ (High Keys) Build')}</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed text-center md:text-left">
            ${isEs 
              ? `La build más popular de <strong class="text-white">${fullSpecName}</strong> en WoW: Midnight. Configuraciones basadas en datos y actualizadas a diario para la Temporada 2 en Midnight 12.1.`
              : `The most popular <strong class="text-white">${fullSpecName}</strong> Build in WoW - Midnight. Data-driven builds updated daily for Season 2 in Midnight 12.1.`}
          </p>
          <div class="flex items-center justify-center md:justify-start gap-3 pt-1 text-[11px] text-slate-400 flex-wrap">
            <span class="flex items-center gap-1.5"><i class="fa-regular fa-clock text-amber-400"></i> ${isEs ? `Actualizado: <strong>${lastUpdatedString}</strong>` : `Last updated: <strong>${lastUpdatedString}</strong>`}</span>
            <span class="text-slate-600">•</span>
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-chart-line text-purple-400"></i> ${activeMode === 'raid' ? (isEs ? 'Muestra: <strong>Banda Mítica (últimos 14 días)</strong>' : 'Sample: <strong>Mythic Raid (last 14 days)</strong>') : (isEs ? 'Muestra: <strong>Míticas+ High Keys (todas las mazmorras)</strong>' : 'Sample: <strong>High Keys (all dungeons)</strong>')}</span>
          </div>
        </div>

        <!-- Selector de Modo (Banda vs Míticas+) -->
        <div class="inline-flex rounded-xl bg-wow-panel border border-wow-border p-1 gap-1 shrink-0 mx-auto md:mx-0">
          <button onclick="window.renderSpecGuide('${containerId}', '${classKey}', '${specKey}', 'raid')" 
            class="px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${activeMode === 'raid' ? 'bg-amber-400 text-black shadow-lg font-extrabold' : 'text-slate-400 hover:text-white'}">
            <i class="fa-solid fa-dungeon"></i> ${isEs ? 'Banda' : 'Raid'}
          </button>
          <button onclick="window.renderSpecGuide('${containerId}', '${classKey}', '${specKey}', 'mplus')" 
            class="px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${activeMode === 'mplus' ? 'bg-amber-400 text-black shadow-lg font-extrabold' : 'text-slate-400 hover:text-white'}">
            <i class="fa-solid fa-key"></i> ${isEs ? 'Míticas+ (High Keys)' : 'Mythic+ (High Keys)'}
          </button>
        </div>
      </section>

      <!-- SECCIÓN 1: TALENTOS & ÁRBOL HÉROE -->
      <section id="talents" class="bg-wow-card border border-wow-border rounded-2xl p-6 shadow-xl space-y-6 scroll-mt-24">
        <div class="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-wow-border/60">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 text-lg shadow">
              <i class="fa-solid fa-diagram-project"></i>
            </div>
            <div>
              <div class="flex items-center flex-wrap gap-2.5">
                <h2 class="text-base sm:text-lg font-bold text-white leading-tight">
                  ${isEs ? 'Build de Talentos Meta' : 'Meta Talent Build'}
                </h2>
                <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold bg-purple-950/80 border border-purple-500/60 text-purple-300 whitespace-nowrap shrink-0">
                  <i class="fa-solid fa-crown text-amber-400 text-[10px]"></i>
                  <span>${heroName}</span>
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1">
                ${isEs ? 'Configuración más óptima y popular según los mejores registros de Archon.gg.' : 'Most optimal talent setup based on top parses from Archon.gg.'}
              </p>
            </div>
          </div>
        </div>

        <!-- PÁRRAFO DINÁMICO SEO ARCHON 1:1 (TALENTOS) -->
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/30 border border-white/5 p-3.5 rounded-xl">
          ${isEs 
            ? `Esta es la build de talentos más recomendada para <strong class="text-white">${fullSpecName}</strong> en <strong class="text-amber-400">${modeName}</strong>. Nuestra recomendación se basa en la popularidad combinada de los árboles de Especialización y Árbol de Héroe (${heroName}), y en la popularidad de los árboles de Clase que usan dichos árboles.`
            : `This is the most recommended <strong class="text-white">${fullSpecName}</strong> talent build for <strong class="text-amber-400">${modeName}</strong>. Our recommendation is based on the combined popularity of the Spec & Hero Trees (${heroName}) and by the popularity of Class Trees that use those trees.`}
        </p>

        <!-- BARRA DESTACADA DE RENDIMIENTO (DPS / HPS & TOP LOG WARCRAFT LOGS) -->
        <div class="flex items-center justify-between flex-wrap gap-4 bg-wow-subcard border border-wow-border p-3.5 sm:p-4 rounded-xl shadow-lg">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg shadow">
              <i class="fa-solid ${modeData.dpsLabel === 'HPS' ? 'fa-heart-pulse text-emerald-400' : 'fa-bolt text-amber-400'}"></i>
            </div>
            <div>
              <div class="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1.5">
                <span>${isEs ? 'Rendimiento Registrado:' : 'Logged Performance:'}</span>
                <span class="text-amber-400 font-mono font-bold">${modeData.dpsLabel || (specKey === 'holy_paladin' || (classKey === 'priest' && (specKey === 'holy_priest' || specKey === 'discipline')) || specKey.includes('restoration') || specKey.includes('mistweaver') || specKey.includes('preservation') ? 'HPS' : 'DPS')}</span>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="text-xl sm:text-2xl font-black font-mono text-[#ff8000] tracking-tight">
                  ${modeData.dps || (isEs ? 'En recopilación' : 'Collecting')}
                </span>
                <span class="text-xs text-slate-400 font-medium hidden sm:inline">
                  ${isEs ? 'promedio en logs míticos' : 'average in mythic logs'}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <span class="text-xs font-mono px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-slate-300 flex items-center justify-center sm:justify-start whitespace-nowrap order-1 sm:order-2">
              <i class="fa-solid fa-crosshairs text-amber-400 mr-1.5 shrink-0"></i>
              <span>${isEs ? 'Modalidad: ' : 'Mode: '}</span>
              <strong class="text-white ml-1">${activeMode === 'raid' ? (isEs ? 'Banda Mítica' : 'Mythic Raid') : (isEs ? 'Míticas+ (High Keys)' : 'Mythic+ (High Keys)')}</strong>
            </span>

            ${modeData.topLogUrl ? `
              <a href="${modeData.topLogUrl}" target="_blank" rel="noopener noreferrer"
                class="px-4 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-white transition flex items-center justify-center gap-2.5 shadow-lg hover:scale-105 hover:border-purple-400 order-2 sm:order-1 w-full sm:w-auto whitespace-nowrap">
                <img src="https://assets.rpglogs.com/img/warcraft/favicon.png?v=4" alt="Warcraft Logs" class="w-4 h-4 object-contain rounded-full shadow shrink-0" onerror="this.style.display='none'"/>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] uppercase tracking-wider font-extrabold text-purple-300">Warcraft Logs:</span>
                  <span class="text-xs font-bold text-white flex items-center gap-1">
                    ${isEs ? 'Ver Top Log Oficial' : 'Open Top Log'} <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-purple-300"></i>
                  </span>
                </div>
              </a>
            ` : `
              <span class="text-xs text-slate-500 italic order-2 sm:order-1 text-center sm:text-left">
                ${isEs ? 'Reporte en sincronización' : 'Report syncing'}
              </span>
            `}
          </div>
        </div>

        <!-- Visor Visual Gráfico del Árbol de Talentos (1:1 Archon Oficial) -->
        <div class="talent-tree-wrapper bg-black/60 border border-white/10 rounded-2xl p-2.5 sm:p-6 shadow-2xl">
          ${modeData.talentTreeHtml || (specKey === 'protection_paladin' ? window.ARCHON_PROT_PALADIN_TREE_HTML : '') || `
            <div class="text-center py-12 text-slate-400">
              <i class="fa-solid fa-spinner fa-spin text-2xl text-amber-400 mb-2"></i>
              <p>${isEs ? 'Cargando árbol de talentos oficial...' : 'Loading official talent tree...'}</p>
            </div>
          `}
        </div>
      </section>

      <!-- SECCIÓN 2: PRIORIDAD DE ESTADÍSTICAS -->
      <section id="stats" class="bg-wow-card border border-wow-border rounded-2xl p-6 shadow-xl space-y-6 scroll-mt-24">
        <div class="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-wow-border/60">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 text-lg shadow">
              <i class="fa-solid fa-arrow-trend-up"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-white">
                ${isEs ? 'Prioridad de Estadísticas' : 'Stat Priority Order'}
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                ${isEs ? 'Jerarquía óptima de atributos y valores acumulados por los mejores jugadores en este modo.' : 'Optimal stat weights and average ratings gathered from top parses in this mode.'}
              </p>
            </div>
          </div>
        </div>

        <!-- PÁRRAFO DINÁMICO SEO ARCHON 1:1 (STATS) -->
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/30 border border-white/5 p-3.5 rounded-xl">
          ${isEs 
            ? `Según los datos de las últimas 2 semanas, la prioridad de estadísticas para <strong class="text-white">${fullSpecName}</strong> parece ser <strong class="text-amber-400">${statsOrderString}</strong>. Sin embargo, puede existir cierto sesgo según el equipo disponible para los jugadores.`
            : `Based on data in the last 2 weeks, the stat priority for <strong class="text-white">${fullSpecName}</strong> looks to be <strong class="text-amber-400">${statsOrderString}</strong>. However, there may be bias based on what gear is available to players.`}
        </p>

        <!-- Cadena de Prioridad: Vertical en móvil (flecha abajo), Horizontal en PC (flecha derecha) -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3.5 py-3">
          ${(() => {
            // Determinar stat principal por spec
            const intelSpecs = ['holy_paladin', 'balance', 'restoration_druid', 'devastation', 'preservation', 'augmentation', 'arcane', 'fire', 'frost_mage', 'mistweaver', 'discipline', 'holy_priest', 'shadow', 'elemental', 'restoration_shaman', 'affliction', 'demonology', 'destruction'];
            const agiSpecs = ['havoc', 'vengeance', 'devourer', 'feral', 'guardian', 'beastmastery', 'marksmanship', 'survival', 'brewmaster', 'windwalker', 'assassination', 'outlaw', 'subtlety', 'enhancement'];
            let primaryName = isEs ? 'Fuerza' : 'Strength';
            if (intelSpecs.includes(specKey)) primaryName = isEs ? 'Intelecto' : 'Intellect';
            else if (agiSpecs.includes(specKey)) primaryName = isEs ? 'Agilidad' : 'Agility';

            // Ordenar secundarias de mayor a menor según los valores reales de Archon
            const secondaries = [
              { key: 'h', name: isEs ? 'Celeridad' : 'Haste', val: modeData.h || 0, color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
              { key: 'c', name: isEs ? 'Golpe Crítico' : 'Critical Strike', val: modeData.c || 0, color: 'border-sky-500/40 bg-sky-950/40 text-sky-400', badgeColor: 'bg-sky-500/20 text-sky-300' },
              { key: 'm', name: isEs ? 'Maestría' : 'Mastery', val: modeData.m || 0, color: 'border-purple-500/40 bg-purple-950/40 text-purple-400', badgeColor: 'bg-purple-500/20 text-purple-300' },
              { key: 'v', name: isEs ? 'Versatilidad' : 'Versatility', val: modeData.v || 0, color: 'border-slate-500/40 bg-slate-900/60 text-slate-300', badgeColor: 'bg-slate-500/20 text-slate-300' }
            ].sort((a, b) => b.val - a.val);

            // Armar toda la cadena: Primaria + Secundarias ordenadas
            const fullChain = [
              { name: primaryName, val: null, color: 'border-amber-500/50 bg-gradient-to-r from-amber-950/60 to-amber-900/40 text-amber-300 font-extrabold', badgeColor: null },
              ...secondaries
            ];

            return fullChain.map((st, i) => `
              <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-3.5 w-full sm:w-auto">
                <div class="border ${st.color} px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between sm:justify-start gap-2.5 min-h-[42px] w-full sm:w-auto transition hover:scale-[1.02]">
                  <span class="text-xs sm:text-sm font-bold uppercase tracking-wider">${st.name}</span>
                  ${st.val !== null ? `
                    <span class="px-2 py-0.5 rounded-md text-xs font-mono font-black ${st.badgeColor} border border-white/5">
                      ${st.val}
                    </span>
                  ` : ''}
                </div>
                ${i < fullChain.length - 1 ? `
                  <i class="fa-solid fa-chevron-down sm:hidden text-amber-400/80 text-xs my-0.5"></i>
                  <i class="fa-solid fa-chevron-right hidden sm:inline text-slate-500 text-xs sm:text-sm"></i>
                ` : ''}
              </div>
            `).join('');
          })()}
        </div>

        <!-- CTA A LA CALCULADORA CON BOTÓN DE AYUDA (?) -->
        <div class="pt-4 border-t border-wow-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-wow-subcard/80 p-4 rounded-xl shadow-inner">
          <div class="space-y-0.5 text-center sm:text-left">
            <h4 class="text-xs sm:text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <i class="fa-solid fa-calculator text-amber-400"></i>
              ${isEs ? '¿Quieres alcanzar esta distribución exacta de estadísticas?' : 'Want to reach this exact stat distribution?'}
            </h4>
            <p class="text-[11px] sm:text-xs text-slate-400">
              ${isEs ? 'Carga tu personaje en WoWTopGear para combinar tu equipo y gemas con precisión matemática.' : 'Load your character in WoWTopGear to balance your gear, enchants, and gems mathematically.'}
            </p>
          </div>
          <div class="relative inline-flex items-center shrink-0">
            <a href="${basePath}gearsim?class=${classKey}&spec=${specKey}" 
              class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs sm:text-sm font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-amber-950/40 border border-amber-300/60 flex items-center gap-2 transition hover:scale-105 active:scale-95 min-h-[40px]">
              <i class="fa-solid fa-play text-xs"></i>
              <span>${isEs ? 'Optimizar en Calculadora' : 'Open in Calculator'}</span>
            </a>
            <button type="button" onclick="if(typeof openHelpModal==='function')openHelpModal();" class="absolute -top-2 -right-2 w-5 h-5 rounded-full shadow-md flex items-center justify-center transition transform hover:scale-110 active:scale-95 z-10 cursor-pointer" style="background-color: #000000 !important; border: none !important; padding: 0 !important; line-height: 1 !important;" data-i18n-title="guideTitle" title="User Guide & Help">
              <span style="color: #fbbf24 !important; font-size: 11px; font-weight: 900; font-family: sans-serif; line-height: 1; user-select: none;">?</span>
            </button>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 3: EQUIPAMIENTO BIS (SLOT POR SLOT) -->
      <section id="gear" class="bg-wow-card border border-wow-border rounded-2xl p-6 shadow-xl space-y-6 scroll-mt-24">
        <div class="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-wow-border/60">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 text-lg shadow">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-white">
                ${isEs ? 'Equipamiento BiS (Best in Slot)' : 'Best in Slot (BiS) Gear'}
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                ${isEs ? 'Piezas de equipo más utilizadas por slot con porcentajes de popularidad oficial.' : 'Most equipped items per slot with real-time popularity percentage from Archon.'}
              </p>
            </div>
          </div>
        </div>

        <!-- PÁRRAFO DINÁMICO SEO ARCHON 1:1 (GEAR OVERVIEW) -->
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/30 border border-white/5 p-3.5 rounded-xl">
          ${isEs 
            ? `El equipo más popular para <strong class="text-white">${fullSpecName}</strong> según todos los datos de las últimas 2 semanas. Esto representa un conjunto de equipo óptimo para este momento de la Temporada 2 (Parche 12.1.5) cercano a Best in Slot, con piezas de conjunto hasta la bonificación máxima.`
            : `The most popular <strong class="text-white">${fullSpecName}</strong> gear based on all data across the last 2 weeks. This represents a strong set of gear for this point in 12.1 that is close to Best in Slot with tier pieces up to the maximum set bonus.`}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          ${(modeData.bisGear || []).map((item, idx) => {
            const slotName = SLOT_NAMES[idx] ? (isEs ? SLOT_NAMES[idx].es : SLOT_NAMES[idx].en) : `Slot ${idx + 1}`;
            const itemParams = item.params ? item.params.replace(/^\?/, '') : '';
            const wowheadDataAttr = itemParams 
              ? `item=${item.id}&${itemParams}&domain=${isEs ? 'es' : 'en'}`
              : `item=${item.id}&domain=${isEs ? 'es' : 'en'}`;
            const itemUrl = itemParams
              ? `https://${isEs ? 'es' : 'www'}.wowhead.com/item=${item.id}?${itemParams}`
              : `https://${isEs ? 'es' : 'www'}.wowhead.com/item=${item.id}`;
            return `
              <div class="bg-wow-subcard border border-wow-border hover:border-amber-400/50 rounded-xl p-3.5 flex items-center justify-between gap-3 transition">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-lg bg-black/80 border border-wow-border flex items-center justify-center shrink-0 overflow-hidden relative shadow" id="bis-icon-box-${item.id}">
                    <a href="${itemUrl}" rel="${itemParams}" data-wowhead="${wowheadDataAttr}" target="_blank" class="block w-full h-full"></a>
                  </div>
                  <div class="min-w-0">
                    <span class="text-[10px] uppercase font-bold text-amber-400 block tracking-wide">${slotName}</span>
                    <a href="${itemUrl}" id="bis-name-${item.id}" rel="${itemParams}" data-bis-id="${item.id}" data-bis-params="${itemParams}" data-wowhead="${wowheadDataAttr}" target="_blank" class="text-xs font-bold text-white hover:underline truncate block">
                      ${item.name || `Item #${item.id}`}
                    </a>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <span class="text-xs font-bold font-mono text-emerald-400 block">${item.popularity}%</span>
                  <span class="text-[10px] text-slate-400 block">${item.parses || 0} parses</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- CTA A LA CALCULADORA AL FINAL DEL EQUIPAMIENTO BIS CON BOTÓN (?) -->
        <div class="pt-4 border-t border-wow-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-wow-subcard/80 p-4 rounded-xl shadow-inner">
          <div class="space-y-0.5 text-center sm:text-left">
            <h4 class="text-xs sm:text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <i class="fa-solid fa-shield-halved text-purple-400"></i>
              ${isEs ? '¿Quieres comparar tu equipo actual contra este conjunto BiS?' : 'Want to compare your equipped gear against this BiS setup?'}
            </h4>
            <p class="text-[11px] sm:text-xs text-slate-400">
              ${isEs ? 'Simula tu personaje en WoWTopGear y descubre qué piezas de tu inventario o bóveda semanal te otorgan mayor rendimiento.' : 'Simulate your character in WoWTopGear to find the highest-performing gear from your bags and Great Vault.'}
            </p>
          </div>
          <div class="relative inline-flex items-center shrink-0">
            <a href="${basePath}gearsim?class=${classKey}&spec=${specKey}" 
              class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs sm:text-sm font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-amber-950/40 border border-amber-300/60 flex items-center gap-2 transition hover:scale-105 active:scale-95 min-h-[40px]">
              <i class="fa-solid fa-calculator text-xs"></i>
              <span>${isEs ? 'Simular en Calculadora' : 'Simulate in Calculator'}</span>
            </a>
            <button type="button" onclick="if(typeof openHelpModal==='function')openHelpModal();" class="absolute -top-2 -right-2 w-5 h-5 rounded-full shadow-md flex items-center justify-center transition transform hover:scale-110 active:scale-95 z-10 cursor-pointer" style="background-color: #000000 !important; border: none !important; padding: 0 !important; line-height: 1 !important;" data-i18n-title="guideTitle" title="User Guide & Help">
              <span style="color: #fbbf24 !important; font-size: 11px; font-weight: 900; font-family: sans-serif; line-height: 1; user-select: none;">?</span>
            </button>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 4: ENCANTAMIENTOS & CONSUMIBLES -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Encantamientos -->
        <section id="enchants" class="bg-wow-card border border-wow-border rounded-2xl p-6 shadow-xl space-y-4 scroll-mt-24">
          <h3 class="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-wow-border/60">
            <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i> ${isEs ? 'Encantamientos Recomendados' : 'Best Enchants'}
          </h3>
          <!-- PÁRRAFO DINÁMICO SEO ARCHON 1:1 (ENCANTAMIENTOS) -->
          <p class="text-xs text-slate-300 leading-relaxed bg-black/30 border border-white/5 p-3 rounded-xl">
            ${isEs 
              ? `Los encantamientos óptimos para <strong class="text-white">${fullSpecName}</strong> en Midnight 12.1.5 están seleccionados para potenciar prioritariamente <strong class="text-amber-400">${orderedSecNames[0]}</strong> y tu atributo principal (<strong class="text-white">${primaryName}</strong>), garantizando el mayor rendimiento por slot de equipo.`
              : `The optimal enchants for <strong class="text-white">${fullSpecName}</strong> in Midnight 12.1.5 are chosen to prioritize <strong class="text-amber-400">${orderedSecNames[0]}</strong> and your primary stat (<strong class="text-white">${primaryName}</strong>), delivering maximum throughput per gear slot.`}
          </p>
          <div class="space-y-2.5">
            ${enchants.map(enc => {
              const slotTranslated = isEs ? (ENCHANT_SLOTS_ES[enc.slot] || enc.slot) : enc.slot;
              const encIcon = enc.icon || 'inv_misc_enchantedscroll';
              const entityKind = enc.entityKind || 'item';
              const encUrl = `https://${isEs ? 'es' : 'www'}.wowhead.com/${entityKind}=${enc.id}`;
              const dataAttr = `${entityKind}=${enc.id}&domain=${isEs ? 'es' : 'en'}`;
              return `
                <div class="bg-wow-subcard border border-wow-border rounded-xl p-3 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <a href="${encUrl}" data-wowhead="${dataAttr}" target="_blank" class="block shrink-0">
                      <img src="https://wow.zamimg.com/images/wow/icons/medium/${encIcon}.jpg" alt="${enc.name}" class="w-8 h-8 rounded-lg border border-amber-400/40 shadow object-cover hover:border-amber-300 transition" onerror="this.src='https://wow.zamimg.com/images/wow/icons/medium/inv_misc_enchantedscroll.jpg'"/>
                    </a>
                    <div class="min-w-0">
                      <span class="text-[10px] uppercase font-bold text-amber-400 block">${slotTranslated}</span>
                      <a href="${encUrl}" data-item-id="${enc.id}" data-wowhead="${dataAttr}" target="_blank" class="spec-auto-translate text-xs text-white hover:underline truncate font-medium block">
                        ${enc.name}
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Consumibles -->
        <section id="consumables" class="bg-wow-card border border-wow-border rounded-2xl p-6 shadow-xl space-y-4 scroll-mt-24">
          <h3 class="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-wow-border/60">
            <i class="fa-solid fa-flask text-emerald-400"></i> ${isEs ? 'Consumibles Óptimos' : 'Best Consumables'}
          </h3>
          <!-- PÁRRAFO DINÁMICO SEO ARCHON 1:1 (CONSUMIBLES) -->
          <p class="text-xs text-slate-300 leading-relaxed bg-black/30 border border-white/5 p-3 rounded-xl">
            ${isEs 
              ? `Guía de consumibles recomendados para <strong class="text-white">${fullSpecName}</strong> en Banda Mítica y Míticas+ (High Keys). Incluye los mejores frascos, pociones de combate, aceites y comidas de la Temporada 2 de Midnight (Parche 12.1.5).`
              : `Recommended consumable setup for <strong class="text-white">${fullSpecName}</strong> in Mythic Raid and Mythic+ (High Keys). Covers top tier flasks, combat potions, oils, and food for Midnight Season 2 (Patch 12.1.5).`}
          </p>
          <div class="space-y-2.5">
            ${consumables.map(con => {
              const typeTranslated = isEs ? (CONSUMABLE_TYPES_ES[con.type] || con.type) : con.type;
              const conIcon = con.icon || 'inv_potion_51';
              const entityKind = con.entityKind || (con.type === 'spell' ? 'spell' : 'item');
              const conUrl = `https://${isEs ? 'es' : 'www'}.wowhead.com/${entityKind}=${con.id}`;
              const dataAttr = `${entityKind}=${con.id}&domain=${isEs ? 'es' : 'en'}`;
              return `
                <div class="bg-wow-subcard border border-wow-border rounded-xl p-3 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <a href="${conUrl}" data-wowhead="${dataAttr}" target="_blank" class="block shrink-0">
                      <img src="https://wow.zamimg.com/images/wow/icons/medium/${conIcon}.jpg" alt="${con.name}" class="w-8 h-8 rounded-lg border border-emerald-400/40 shadow object-cover hover:border-emerald-300 transition" onerror="this.src='https://wow.zamimg.com/images/wow/icons/medium/inv_potion_51.jpg'"/>
                    </a>
                    <div class="min-w-0">
                      <span class="text-[10px] uppercase font-bold text-emerald-400 block">${typeTranslated}</span>
                      <a href="${conUrl}" data-item-id="${con.id}" data-wowhead="${dataAttr}" target="_blank" class="spec-auto-translate text-xs text-white hover:underline truncate font-medium block">
                        ${con.name}
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

      </div>

      <!-- SECCIÓN 5: BANNER CTA DESTACADO A LA CALCULADORA -->
      <section class="bg-gradient-to-r from-purple-950/80 via-wow-card to-amber-950/60 border border-purple-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div class="space-y-2 max-w-2xl mx-auto">
          <h3 class="font-cinzel text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-2">
            <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
            <span>${isEs ? `¿Listo para Optimizar tu ${fullSpecName}?` : `Ready to Optimize your ${fullSpecName}?`}</span>
          </h3>
          <p class="text-xs sm:text-sm text-slate-300">
            ${isEs 
              ? 'Importa tu personaje mediante SimulationCraft (/simc) o añade tus piezas para calcular el mejor equipamiento, gemas y encantamientos al instante.' 
              : 'Import your character via SimulationCraft (/simc) or enter your items to find your highest-performing gear, enchants, and smart gems in seconds.'}
          </p>
        </div>
        <div class="flex justify-center pt-1">
          <div class="relative inline-flex items-center justify-center">
            <a href="${basePath}gearsim?class=${classKey}&spec=${specKey}" 
              class="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-950/60 transition transform active:scale-95 hover:scale-105 min-h-[42px]">
              <i class="fa-solid fa-play text-xs"></i>
              <span>${isEs ? 'Abrir en la Calculadora' : 'Open in Calculator'}</span>
            </a>
            <button type="button" onclick="if(typeof openHelpModal==='function')openHelpModal();" class="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110 active:scale-95 z-10 cursor-pointer" style="background-color: #000000 !important; border: none !important; padding: 0 !important; line-height: 1 !important;" data-i18n-title="guideTitle" title="User Guide & Help">
              <span style="color: #fbbf24 !important; font-size: 13px; font-weight: 900; font-family: sans-serif; line-height: 1; user-select: none;">?</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  `;

  // Conectar listener, textos y dominio de idioma al árbol de Archon
  const treeContainer = container.querySelector('.talent-tree-wrapper');
  if (treeContainer) {
    // 0. Eliminar la sección inferior de 'Alternative Class Talents Trees'
    const altTrees = treeContainer.querySelectorAll('.builds-talent-tree-build-section__talent-tree-alternatives, [class*="talent-tree-alternatives"]');
    altTrees.forEach(el => el.remove());

    // 0.1 Sustituir insignias de sprite distorsionadas de Clase y Spec por iconos oficiales
    const classIconContainer = treeContainer.querySelector('.talent-tree__container--class .talent-tree__description__icon');
    if (classIconContainer) {
      classIconContainer.innerHTML = `<img class="w-10 h-10 rounded-full border-2 border-amber-400/80 shadow-md object-cover" src="https://wow.zamimg.com/images/wow/icons/large/classicon_${classKey}.jpg" alt="${classKey}" style="width:2.5rem;height:2.5rem;border-radius:9999px;border:2px solid #f59e0b;object-fit:cover;display:block;" onerror="this.src='https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'"/>`;
    }

    const specIconContainer = treeContainer.querySelector('.talent-tree__container--spec .talent-tree__description__icon');
    if (specIconContainer) {
      // Buscar icono oficial de spec si existe en el DOM de la página o fallback oficial
      const pageSpecImg = document.querySelector('img[alt*="Protection"], img[alt*="protección"], .spec-header-icon');
      const specImgSrc = pageSpecImg ? pageSpecImg.src : 'https://wow.zamimg.com/images/wow/icons/large/ability_paladin_shieldofthetemplar.jpg';
      specIconContainer.innerHTML = `<img class="w-10 h-10 rounded-full border-2 border-amber-400/80 shadow-md object-cover" src="${specImgSrc}" alt="${specKey}" style="width:2.5rem;height:2.5rem;border-radius:9999px;border:2px solid #f59e0b;object-fit:cover;display:block;" onerror="this.src='https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'"/>`;
    }

    // 1. Traducir etiquetas de clase y especialización si existen
    const classLabelGeneric = treeContainer.querySelector('.talent-tree__container--class .talent-tree__description__label--generic');
    const classLabelKind = treeContainer.querySelector('.talent-tree__container--class .talent-tree__description__label--kind');
    if (classLabelGeneric) classLabelGeneric.textContent = isEs ? 'Talentos' : 'Talents';
    if (classLabelKind) classLabelKind.textContent = isEs ? 'Clase' : 'Class';

    const specLabelGeneric = treeContainer.querySelector('.talent-tree__container--spec .talent-tree__description__label--generic');
    const specLabelKind = treeContainer.querySelector('.talent-tree__container--spec .talent-tree__description__label--kind');
    if (specLabelGeneric) specLabelGeneric.textContent = isEs ? 'Talentos' : 'Talents';
    if (specLabelKind) specLabelKind.textContent = isEs ? 'Especialización' : 'Spec';

    // 1.1 Traducir Título del Árbol de Talentos Heroicos central (p.ej. Lightsmith -> Forjador de Luz)
    const heroTitleEl = treeContainer.querySelector('.talent-tree__hero-title');
    if (heroTitleEl) {
      const origTitle = heroTitleEl.textContent.trim();
      if (isEs && HERO_TREE_NAMES_ES[origTitle]) {
        heroTitleEl.textContent = HERO_TREE_NAMES_ES[origTitle];
      }
    }

    // 2. Botón Export
    const copyBtn = treeContainer.querySelector('.talent-tree__interactions-export__copy-button');
    if (copyBtn) {
      const copySpan = copyBtn.querySelector('span');
      if (copySpan) copySpan.textContent = isEs ? 'Exportar' : 'Export';
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.copyTalentExportString(talentsString, copyBtn);
      });
    }

    // 3. Botón Edit
    const editBtn = treeContainer.querySelector('.talent-tree__interactions-export__external-link');
    if (editBtn) {
      const editSpan = editBtn.querySelector('span');
      if (editSpan) editSpan.textContent = isEs ? 'Editar' : 'Edit';
      // Redirigir dominio Wowhead según idioma
      const baseCalc = editBtn.getAttribute('href') || '';
      if (isEs && !baseCalc.includes('es.wowhead.com')) {
        editBtn.setAttribute('href', baseCalc.replace('www.wowhead.com', 'es.wowhead.com'));
      } else if (!isEs && baseCalc.includes('es.wowhead.com')) {
        editBtn.setAttribute('href', baseCalc.replace('es.wowhead.com', 'www.wowhead.com'));
      }
    }

    // 4. Dotar de soporte bilingüe a todos los nodos de Wowhead dentro del árbol
    const treeLinks = treeContainer.querySelectorAll('a[href*="wowhead.com"]');
    treeLinks.forEach(link => {
      const domain = isEs ? 'es' : 'en';
      link.setAttribute('data-wowhead', `domain=${domain}`);
      let currentHref = link.getAttribute('href') || '';
      if (isEs && currentHref.includes('www.wowhead.com')) {
        link.setAttribute('href', currentHref.replace('www.wowhead.com', 'es.wowhead.com'));
      } else if (!isEs && currentHref.includes('es.wowhead.com')) {
        link.setAttribute('href', currentHref.replace('es.wowhead.com', 'www.wowhead.com'));
      }
    });

    // 4.1 En móvil (< 1024px), insertar físicamente los botones Exportar/Editar al principio del todo
    const exportBtns = treeContainer.querySelector('.talent-tree__interactions-export');
    const mainTreesContainer = treeContainer.querySelector('.builds-talent-tree-build-section__talent-trees') || treeContainer;
    if (exportBtns && mainTreesContainer && window.innerWidth < 1024) {
      mainTreesContainer.insertBefore(exportBtns, mainTreesContainer.firstChild);
    }
  }

  // 5. Decoración automática e inmediata de nombres e iconos oficiales vía Wowhead API
  const itemLinks = container.querySelectorAll('[data-bis-id]');
  itemLinks.forEach(async (linkEl) => {
    const itemId = linkEl.getAttribute('data-bis-id');
    const itemParams = linkEl.getAttribute('data-bis-params') || '';
    if (!itemId) return;
    const localeCode = isEs ? 'es' : '0';
    try {
      const res = await fetch(`https://nether.wowhead.com/tooltip/item/${itemId}?locale=${localeCode}`);
      if (res.ok) {
        const itemData = await res.json();
        if (itemData.name) {
          linkEl.textContent = itemData.name;
          linkEl.classList.remove('text-white');
          linkEl.style.color = '#a335ee'; // Épico oficial
        }
        if (itemData.icon) {
          const iconBox = document.getElementById(`bis-icon-box-${itemId}`);
          if (iconBox) {
            const wowheadDataAttr = itemParams
              ? `item=${itemId}&${itemParams}&domain=${isEs ? 'es' : 'en'}`
              : `item=${itemId}&domain=${isEs ? 'es' : 'en'}`;
            const itemUrl = itemParams
              ? `https://${isEs ? 'es' : 'www'}.wowhead.com/item=${itemId}?${itemParams}`
              : `https://${isEs ? 'es' : 'www'}.wowhead.com/item=${itemId}`;
            iconBox.innerHTML = `
              <a href="${itemUrl}" rel="${itemParams}" data-wowhead="${wowheadDataAttr}" target="_blank" class="block w-full h-full">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/${itemData.icon}.jpg" alt="${itemData.name || ''}" class="w-full h-full object-cover rounded-md" onerror="this.src='https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg'"/>
              </a>
            `;
          }
        }
      }
    } catch (e) {}
  });

  // 6. Si estamos en español (es / mx), traducir nombres de encantamientos y consumibles automáticamente
  if (isEs) {
    const localeCode = (typeof currentLang !== 'undefined' && currentLang === 'mx') ? 'mx' : 'es';
    const autoTranslateLinks = container.querySelectorAll('.spec-auto-translate');
    autoTranslateLinks.forEach(async (linkEl) => {
      const itemId = linkEl.getAttribute('data-item-id');
      if (!itemId) return;
      try {
        const res = await fetch(`https://nether.wowhead.com/tooltip/item/${itemId}?locale=${localeCode}`);
        if (res.ok) {
          const itemData = await res.json();
          if (itemData.name) {
            linkEl.textContent = itemData.name;
          }
        }
      } catch (e) {}
    });
  }

  // Actualizar tooltips de Wowhead en toda la página
  if (typeof $WowheadPower !== 'undefined' && typeof $WowheadPower.refreshLinks === 'function') {
    $WowheadPower.refreshLinks();
  }
};

window.copyTalentExportString = function (str, btnElement) {
  if (!str) return;
  const isEs = (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'mx'));
  navigator.clipboard.writeText(str).then(() => {
    if (btnElement) {
      const originalHtml = btnElement.innerHTML;
      btnElement.innerHTML = `<span>${isEs ? '¡Copiado!' : 'Copied!'}</span> <i class="fa-solid fa-check text-emerald-400 ml-1"></i>`;
      btnElement.classList.add('talent-tree__interactions-export__copy-button--copied');
      setTimeout(() => {
        btnElement.innerHTML = originalHtml;
        btnElement.classList.remove('talent-tree__interactions-export__copy-button--copied');
      }, 2500);
    } else {
      alert(isEs ? '¡String de talentos copiado al portapapeles!' : 'Talent string copied to clipboard!');
    }
  }).catch(() => {});
};


