// MULTI-LANGUAGE SYSTEM (i18n: EN / ES / MX)
let currentLang = 'en';
try {
  const savedLang = localStorage.getItem('wow_lang');
  if (savedLang === 'es' || savedLang === 'mx' || savedLang === 'en') currentLang = savedLang;
} catch (e) {}

const I18N_TRANSLATIONS = {
  en: {
    appName: "WoW Optimizer",
    appSubtitle: "SimulationCraft Parser, Track Filtering & Gem Engine",
    homeNav: "Home",
    calculatorNav: "Calculator",
    featuresNav: "Features",
    newsNav: "S2 News",
    communityNav: "Community & Guides",
    launchOptimizerBtn: "Open Optimizer",
    startCalculatorBtn: "Launch Calculator",
    heroBadge: "CALIBRATED FOR LIVE PATCH • MIDNIGHT SEASON 2",
    heroTitlePrefix: "Forge your Meta Gear in",
    heroDesc: "The ultimate analytical suite to optimize stats, trinkets, and Top Gear combinations for Mythic+ and Raid with zero queues and real-time mathematical precision.",
    heroStatExportLabel: "Export",
    heroStatExportValue: "100% SimC Fidelity",
    heroStatSimsLabel: "Simulations",
    heroStatSimsValue: "Direct Bloodmallet",
    heroStatExecLabel: "Execution",
    heroStatExecValue: "Zero Wait / Local",
    heroStatMetaLabel: "Meta Data",
    heroStatMetaValue: "Archon.gg Presets",
    featuresTitle: "Architecture Built for Demanding Players",
    featuresSubtitle: "Pure mathematical optimization technology. All calculations occur instantly on your processor.",
    feature1Title: "SimC Top Gear Full-Fidelity",
    feature1Desc: "Generate SimulationCraft scripts with exact bonus IDs, extra sockets, Midnight enchants, crafting missives, and Great Vault flags ready to paste into your simulator.",
    feature1Badge: "Official SimC Addon 12.1.0 format",
    feature2Title: "S2 Diminishing Returns",
    feature2Desc: "The engine applies official penalty brackets on secondary stats (Mastery, Haste, Crit, Versatility) to prevent inefficient stat saturation.",
    feature2Badge: "Curves calibrated for Midnight Season 2",
    feature3Title: "100% Private & Serverless",
    feature3Desc: "No accounts, sign-ups, or suspicious downloads required. Your inventory and setups are stored exclusively in your browser's private local storage.",
    feature3Badge: "Zero invasive telemetry",
    newsBulletinBadge: "Official Bulletin",
    newsSectionTitle: "Midnight: Season 2 News",
    newsSectionSubtitle: "Continuously updated with every balance patch",
    news1Tag: "PATCH 12.1.0",
    news1Date: "Sep 18, 2026",
    news1Title: "Mastery Curve Adjustments and New Raid Trinkets",
    news1Desc: "Secondary stat penalty thresholds were recalibrated for spellcasting specializations and official Bloodmallet simulations have been integrated.",
    news1Status: "Applied in Optimizer",
    news1Action: "Simulate →",
    news2Tag: "MYTHIC+ ROTATION",
    news2Date: "Sep 14, 2026",
    news2Title: "Midnight Season 2 Dungeon Loot Tables",
    news2Desc: "The Great Vault calculator now supports the full upgrade track (Hero 6/6 and ilvl 334 Mythic) with crafted BoE item support.",
    news2Status: "8 M+ Dungeons",
    news2Action: "View →",
    news3Tag: "TOOLTIP MONITOR",
    news3Date: "Automatic",
    news3Title: "Real-Time Spell, Buff & Item Resolution",
    news3Desc: "The suite now actively monitors Wowhead links whenever a special Midnight buff or enchant needs to be handled as a spell rather than an item.",
    news3Status: "Wowhead API",
    news3Action: "Monitor →",
    communityPreTitle: "Connected Ecosystem",
    communityTitle: "Community Resources & Direct Links",
    communitySubtitle: "We work with the most trusted sources across the World of Warcraft ecosystem to power WoWOptimizer.",
    hubBloodmalletDesc: "Mathematical simulations of trinkets, gems, and races computed using SimulationCraft.",
    hubArchonDesc: "Live meta analysis of the world's highest Mythic+ runs and raid kill logs.",
    hubWowheadDesc: "Official class guides, talent calculators, dungeon loot tables, and full database.",
    hubRaidbotsDesc: "Cloud service to process SimC simulations and verify your WoWOptimizer gear sets.",
    ctaTitle: "Ready to Perfect Your Character?",
    ctaDesc: "Load your character via the SimulationCraft addon or add your gear manually to discover your optimal setup in seconds.",
    ctaBtn: "Open WoWOptimizer Now",
    tabOptimizer: "Optimizer",
    tabInventory: "Inventory",
    shareBtn: "Share",
    shareTitle: "Copy shareable link with your setup",
    guideBtn: "Guide",
    guideTitle: "User Guide & Help",
    importSimcBtn: "Import SimC",
    addItemBtn: "Add Item",
    targetStatsTitle: "Target Stats",
    targetStatsSubtitle: "Calculates on pure base stats (excluding gems) and integrates secondary stat trinkets",
    raidMythic: "Mythic Raid",
    mplus: "Mythic+",
    heroTree: "Hero Tree",
    addPreset: "+ Preset",
    statMastery: "Mastery",
    statCrit: "Critical Strike",
    statHaste: "Haste",
    statVers: "Versatility",
    weaponMode: "Weapon Mode",
    weapon2h: "2H Weapon",
    weapon1hShield: "1H + Shield / Offhand",
    weaponDual: "Dual Wield",
    targetBudget: "Target Budget",
    trackQuality: "Track / Quality",
    trackMyth: "Mythic",
    trackHero: "Heroic",
    trackChamp: "Champion",
    trackVet: "Veteran / Other",
    trackAll: "All",
    trackMythHero: "Myth+Hero",
    trackMythOnly: "Only Myth",
    minIlvl: "Min ilvl",
    statWeightsTitle: "Stat Weights & Priority Scaling (Advanced)",
    tierSetMode: "Tier Set",
    tierAny: "0+ Any",
    tier2p: "2+ Pieces",
    tier4p: "4+ Pieces",
    simMaxIlvl: "Max ilvl",
    simVenomstones: "Venomstones",
    trinketRankings: "Trinket Rankings",
    compareVsEquipped: "Compare vs Equipped",
    calcBestSetup: "Calculate Best Setup",
    calculating: "Calculating...",
    bestComboFound: "🏆 Best Combination Found",
    altCombo: "Alternative",
    tierBadge4p: "Tier: 4/5 (4P Bonus)",
    tierBadge2p: "Tier: 2/5 (2P Bonus)",
    tierBadge0p: "Tier: 0/5 (No Tier)",
    metaBadge: "Meta",
    socketsBadge: "Sockets",
    exportSimC: "Export SimC",
    pureBaseStats: "PURE BASE STATS (EXCLUDING GEMS):",
    withGems: "With Gems:",
    secStatDistribution: "Secondary Stat Distribution:",
    vsMeta: "vs target",
    itemsInSet: "ITEMS IN THIS SET:",
    smartGemRecs: "SMART GEM RECOMMENDATIONS:",
    projectedWithGems: "Projected Final Stats with Socketed Gems:",
    compareModalTitle: "Equipped Gear vs Optimal Setup Comparison",
    colSlot: "SLOT",
    colCurrentlyEquipped: "CURRENTLY EQUIPPED",
    colOptimalRecommendation: "OPTIMAL RECOMMENDATION",
    colStatus: "STATUS",
    enchantLabel: "Enchant",
    gemLabel: "Gem",
    socketLabel: "Socket",
    unenchanted: "Unenchanted",
    ungemmed: "No gem",
    reEnchant: "Re-enchant",
    applyEnchant: "Enchant",
    changeGem: "Change Gem",
    socketGem: "Socket Gem",
    keepAction: "Keep",
    equipAction: "Equip Item",
    noneLabel: "None",
    comparePrompt: "Please run an optimization first.",
    compareSummaryTitle: "Stat Comparison (Currently Equipped ➔ Optimal Set)",
    compareGemsNote: "Includes current gems and recommended gems",
    statActual: "Current:",
    statOptimal: "Optimal:",
    statTotalChange: "Total Change:",
    gemCurrentInBag: "Current gem in bag:",
    gemToUse: "Gem to use:",
    totalChangesEquipping: "TOTAL STAT CHANGES WHEN EQUIPPING:",
    closeModal: "Close",
    trinketModalTitle: "Official Trinket Rankings",
    trinketSearchPlaceholder: "Filter trinket by name or source...",
    prioritizeMetaRanking: "Prioritize Meta Rankings",
    inInventory: "In Your Inventory",
    onUse: "On-Use",
    passive: "Passive",
    pickRate: "Pick Rate",
    maxKey: "Max Key",
    archonTopLogs: "Archon Top Logs",
    trinketFooterNote: "Trinkets highlighted in yellow are currently in your inventory.",
    invTitle: "Bag Inventory",
    invSearchPlaceholder: "Search item by name...",
    invFilterAllSlots: "All Slots",
    ignoreAll: "Ignore All",
    lockEquipped: "Lock Equipped",
    unlockAll: "Unlock All",
    enableAll: "Enable All",
    badgeEquipped: "Equipped",
    badgeLocked: "Locked",
    badgeIgnored: "Ignored",
    badgeVault: "Great Vault",
    badgeTier: "Tier",
    badgeSocket: "Socket",
    addItemModalTitle: "Add New Item",
    editItemModalTitle: "Edit Item",
    itemNameLabel: "Item Name",
    itemSlotLabel: "Slot",
    itemTrackLabel: "Upgrade Track",
    itemIlvlLabel: "Item Level (ilvl)",
    itemHasSocket: "Has Prismatic Socket",
    itemIsTier: "Is Tier Set Piece",
    saveItemBtn: "Save Item",
    cancelBtn: "Cancel",
    reportIssue: "Found an Issue / Bug",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contactUs: "Contact & Support",
    cookieSettings: "Cookie Settings",
    cookieTitle: "Cookie & Privacy Preferences:",
    cookieDesc: "We use local storage to save your character preferences and non-intrusive cookies to improve user experience.",
    learnMore: "Learn More",
    acceptCookies: "Accept & Continue",
    toastLinkCopied: "Configuration link copied to clipboard!",
    toastItemSaved: "Item saved successfully!",
    toastItemDeleted: "Item deleted.",
    toastSimcImported: "SimC profile imported successfully!",
    toastModeRaid: "🏛️ Stats: Mythic Raid loaded",
    toastModeMplus: "🗝️ Stats: Mythic+ (M+) loaded"
  },
  es: {
    appName: "WoW Optimizer",
    appSubtitle: "Parser de SimulationCraft, Filtrado por Rango y Motor de Gemas",
    homeNav: "Inicio",
    calculatorNav: "Calculadora",
    featuresNav: "Características",
    newsNav: "Noticias S2",
    communityNav: "Comunidad & Guías",
    launchOptimizerBtn: "Abrir Optimizador",
    startCalculatorBtn: "Iniciar Calculadora",
    heroBadge: "CALIBRADO PARA EL PARCHE ACTUAL • MIDNIGHT SEASON 2",
    heroTitlePrefix: "Forja tu Equipo Meta en",
    heroDesc: "La suite analítica definitiva para optimizar estadísticas, abalorios y combinaciones Top Gear de Mítica+ y Banda sin colas y con precisión matemática en tiempo real.",
    heroStatExportLabel: "Exportación",
    heroStatExportValue: "100% SimC Fidelidad",
    heroStatSimsLabel: "Simulaciones",
    heroStatSimsValue: "Bloodmallet Directo",
    heroStatExecLabel: "Ejecución",
    heroStatExecValue: "Cero Espera / Local",
    heroStatMetaLabel: "Datos Meta",
    heroStatMetaValue: "Presets Archon.gg",
    featuresTitle: "Arquitectura Diseñada para Jugadores Exigentes",
    featuresSubtitle: "Tecnología de optimización matemática sin intermediarios. Todo el cálculo ocurre en tu procesador.",
    feature1Title: "SimC Top Gear Full-Fidelity",
    feature1Desc: "Genera scripts de SimulationCraft con bonus IDs exactos, sockets adicionales, enchants de Midnight, missives de artesanía y Great Vault flags listos para pegar en tu simulador.",
    feature1Badge: "Formato oficial SimC Addon 12.1.0",
    feature2Title: "Rendimientos Decrecientes S2",
    feature2Desc: "El motor aplica los tramos oficiales de penalización de estadísticas secundarias (Mastery, Haste, Crit, Versatility) para evitar saturación de stats ineficientes.",
    feature2Badge: "Curvas escaladas a Midnight Season 2",
    feature3Title: "100% Privado & Sin Servidores",
    feature3Desc: "No requiere cuentas, registros ni descargas de ejecutables sospechosos. Tu inventario y configuraciones se guardan exclusivamente en el almacenamiento seguro de tu navegador.",
    feature3Badge: "Cero telemetría invasiva",
    newsBulletinBadge: "Boletín Oficial",
    newsSectionTitle: "Noticias de Midnight: Temporada 2",
    newsSectionSubtitle: "Actualizado continuamente con cada parche de balance",
    news1Tag: "PARCHE 12.1.0",
    news1Date: "18 Sep 2026",
    news1Title: "Ajuste a las Curvas de Maestría y Nuevos Abalorios de Banda",
    news1Desc: "Se recalibraron los umbrales de penalización de estadísticas secundarias para las especializaciones de daño mágico y se integraron las simulaciones oficiales de Bloodmallet.",
    news1Status: "Aplicado en el Optimizador",
    news1Action: "Simular →",
    news2Tag: "ROTACIÓN MÍTICA+",
    news2Date: "14 Sep 2026",
    news2Title: "Tabla de Botín de Mazmorras de Midnight Season 2",
    news2Desc: "El calculador de Great Vault ahora admite el rango completo de mejora (Hero 6/6 e ilvl 334 Mythic) con soporte para objetos vinculados al equipar de artesanía.",
    news2Status: "8 Mazmorras M+",
    news2Action: "Ver →",
    news3Tag: "TOOLTIP MONITOR",
    news3Date: "Automático",
    news3Title: "Resolución de Hechizos, Buffs y Objetos en Tiempo Real",
    news3Desc: "La suite ahora monitorea automáticamente enlaces de Wowhead cuando un buff o encantamiento especial de Midnight debe registrarse como hechizo en lugar de objeto.",
    news3Status: "API Wowhead",
    news3Action: "Monitor →",
    communityPreTitle: "Ecosistema Conectado",
    communityTitle: "Recursos de la Comunidad y Enlaces Directos",
    communitySubtitle: "Trabajamos con las fuentes más respetadas del ecosistema de World of Warcraft para alimentar el motor de WoWOptimizer.",
    hubBloodmalletDesc: "Simulaciones matemáticas de abalorios, gemas y razas calculadas con SimulationCraft.",
    hubArchonDesc: "Análisis meta en vivo de las mejores runs de Mítica+ y registros de bandas del mundo.",
    hubWowheadDesc: "Guías oficiales de clase, calculadoras de talentos, tablas de botín y base de datos completa.",
    hubRaidbotsDesc: "Servicio cloud para procesar simulaciones de SimC y comprobar tus exportaciones de WoWOptimizer.",
    ctaTitle: "¿Listo para Perfeccionar tu Personaje?",
    ctaDesc: "Carga tu personaje mediante el addon SimulationCraft o añade tus piezas manualmente para encontrar tu combinación óptima en segundos.",
    ctaBtn: "Abrir WoWOptimizer Ahora",
    tabOptimizer: "Optimizador",
    tabInventory: "Inventario",
    shareBtn: "Compartir",
    shareTitle: "Copiar enlace compartible con tu configuración",
    guideBtn: "Guía",
    guideTitle: "Guía de uso y Ayuda",
    importSimcBtn: "Importar SimC",
    addItemBtn: "Añadir Objeto",
    targetStatsTitle: "Estadísticas Objetivo (Target Stats)",
    targetStatsSubtitle: "Calcula sobre estadísticas base puras (sin gemas) e integra abalorios de stats secundarios",
    raidMythic: "Raid Mítico",
    mplus: "M+ (Míticas+)",
    heroTree: "Árbol Héroe",
    addPreset: "+ Preset",
    statMastery: "Maestría",
    statCrit: "Crítico",
    statHaste: "Celeridad",
    statVers: "Versatilidad",
    weaponMode: "Modo Arma",
    weapon2h: "Arma 2M",
    weapon1hShield: "1M + Escudo / Offhand",
    weaponDual: "Doble Empuñadura",
    targetBudget: "Presupuesto Meta",
    trackQuality: "Calidad / Track",
    trackMyth: "Mítico",
    trackHero: "Heroico",
    trackChamp: "Campeón",
    trackVet: "Vet / Otros",
    trackAll: "Todos",
    trackMythHero: "Myt+Hero",
    trackMythOnly: "Solo Myt",
    minIlvl: "ilvl Mín",
    statWeightsTitle: "Ponderación / Pesos de Estadísticas (Avanzado)",
    tierSetMode: "Tier Set",
    tierAny: "0+ Cualquier",
    tier2p: "2+ Piezas",
    tier4p: "4+ Piezas",
    simMaxIlvl: "Max ilvl",
    simVenomstones: "Venomstones",
    trinketRankings: "Ranking Abalorios",
    compareVsEquipped: "Comparar vs Equipado",
    calcBestSetup: "Calcular Mejor Combinación",
    calculating: "Calculando...",
    bestComboFound: "🏆 Mejor Combinación Encontrada",
    altCombo: "Alternativa",
    tierBadge4p: "Tier: 4/5 (Bono 4P)",
    tierBadge2p: "Tier: 2/5 (Bono 2P)",
    tierBadge0p: "Tier: 0/5 (Sin Tier)",
    metaBadge: "Meta",
    socketsBadge: "Ranuras",
    exportSimC: "Exportar SimC",
    pureBaseStats: "ESTADÍSTICAS BASE PURAS (SIN GEMAS):",
    withGems: "Con Gemas:",
    secStatDistribution: "Distribución de Secundarias:",
    vsMeta: "vs meta",
    itemsInSet: "PIEZAS QUE COMPONEN ESTE SET:",
    smartGemRecs: "RECOMENDACIÓN INTELIGENTE DE GEMAS:",
    projectedWithGems: "Proyección Final con Gemas Engarzadas:",
    compareModalTitle: "Comparación de Equipo Equipado vs Recomendación Óptima",
    colSlot: "CASILLA",
    colCurrentlyEquipped: "EQUIPADO ACTUALMENTE",
    colOptimalRecommendation: "RECOMENDACIÓN ÓPTIMA",
    colStatus: "ESTADO",
    enchantLabel: "Encant",
    gemLabel: "Gema",
    socketLabel: "Ranura",
    unenchanted: "Sin encantar",
    ungemmed: "Sin gema",
    reEnchant: "Re-encantar",
    applyEnchant: "Encantar",
    changeGem: "Cambiar Gema",
    socketGem: "Engarzar Gema",
    keepAction: "Mantener",
    equipAction: "Equipar Pieza",
    noneLabel: "Ninguno",
    comparePrompt: "Por favor ejecuta una optimización primero.",
    compareSummaryTitle: "Comparativa de Estadísticas (Actual Equipado ➔ Set Óptimo)",
    compareGemsNote: "Incluye gemas actuales y gemas recomendadas",
    statActual: "Actual:",
    statOptimal: "Óptimo:",
    statTotalChange: "Cambio Total:",
    gemCurrentInBag: "Gema actual en bolsa:",
    gemToUse: "Gema a usar:",
    totalChangesEquipping: "CAMBIOS TOTALES AL EQUIPAR:",
    closeModal: "Cerrar",
    trinketModalTitle: "Ranking Oficial de Abalorios",
    trinketSearchPlaceholder: "Filtrar abalorio por nombre o procedencia...",
    prioritizeMetaRanking: "Priorizar Ranking Meta",
    inInventory: "En tu Inventario",
    onUse: "Uso",
    passive: "Pasivo",
    pickRate: "Pick Rate",
    maxKey: "Max Key",
    archonTopLogs: "Archon Top Logs",
    trinketFooterNote: "Los abalorios resaltados en amarillo son los que posees actualmente en tu inventario.",
    invTitle: "Inventario de Bolsa",
    invSearchPlaceholder: "Buscar objeto por nombre...",
    invFilterAllSlots: "Todas las casillas",
    ignoreAll: "Ignorar Todos",
    lockEquipped: "Bloquear Equipados",
    unlockAll: "Desbloquear",
    enableAll: "Habilitar Todos",
    badgeEquipped: "Equipado",
    badgeLocked: "Bloqueado",
    badgeIgnored: "Ignorado",
    badgeVault: "Gran Cámara",
    badgeTier: "Tier",
    badgeSocket: "Ranura",
    addItemModalTitle: "Añadir Nuevo Objeto",
    editItemModalTitle: "Editar Objeto",
    itemNameLabel: "Nombre del Objeto",
    itemSlotLabel: "Casilla",
    itemTrackLabel: "Rango de Mejora (Track)",
    itemIlvlLabel: "Nivel de Objeto (ilvl)",
    itemHasSocket: "Tiene Ranura Prismática",
    itemIsTier: "Es Pieza de Tier Set",
    saveItemBtn: "Guardar Objeto",
    cancelBtn: "Cancelar",
    reportIssue: "Encontré un Problema",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    contactUs: "Contacto y Soporte",
    cookieSettings: "Ajustes de Cookies",
    cookieTitle: "Preferencias de Cookies y Privacidad:",
    cookieDesc: "Utilizamos almacenamiento local para guardar tus preferencias de personaje y cookies no invasivas para mejorar la experiencia de usuario.",
    learnMore: "Más información",
    acceptCookies: "Aceptar y Continuar",
    toastLinkCopied: "¡Enlace de configuración copiado al portapapeles!",
    toastItemSaved: "¡Objeto guardado con éxito!",
    toastItemDeleted: "Objeto eliminado.",
    toastSimcImported: "¡Perfil de SimC importado con éxito!",
    toastModeRaid: "🏛️ Estadísticas: Raid Mítico cargadas",
    toastModeMplus: "🗝️ Estadísticas: Míticas+ (M+) cargadas"
  }
};

function t(key, fallback = '') {
  let lang = currentLang || 'en';
  if (lang === 'mx') lang = 'es';
  if (I18N_TRANSLATIONS[lang] && I18N_TRANSLATIONS[lang][key] !== undefined) {
    return I18N_TRANSLATIONS[lang][key];
  }
  if (I18N_TRANSLATIONS['en'] && I18N_TRANSLATIONS['en'][key] !== undefined) {
    return I18N_TRANSLATIONS['en'][key];
  }
  return fallback || key;
}

function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'es' && lang !== 'mx') lang = 'en';
  currentLang = lang;
  try {
    localStorage.setItem('wow_lang', lang);
  } catch (e) {}
  updateLanguageUI();
}

function toggleLanguage() {
  let nextLang = 'es';
  if (currentLang === 'en') nextLang = 'es';
  else if (currentLang === 'es') nextLang = 'mx';
  else if (currentLang === 'mx') nextLang = 'en';
  setLanguage(nextLang);
}

function updateLanguageUI() {
  const lang = currentLang || 'en';
  document.documentElement.lang = (lang === 'en') ? 'en' : (lang === 'mx' ? 'es-MX' : 'es-ES');

  const langSelect = document.getElementById('lang-select');
  if (langSelect && langSelect.value !== lang) {
    langSelect.value = lang;
  }

  const flagEl = document.getElementById('lang-flag');
  const codeEl = document.getElementById('lang-code');
  if (flagEl) {
    flagEl.innerText = (lang === 'en') ? '🇺🇸' : (lang === 'mx' ? '🇲🇽' : '🇪🇸');
  }
  if (codeEl) {
    codeEl.innerText = (lang === 'en') ? 'EN' : (lang === 'mx' ? 'MX' : 'ES');
  }

  const dict = (lang === 'en') ? I18N_TRANSLATIONS['en'] : I18N_TRANSLATIONS['es'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && dict && dict[key]) {
      el.innerText = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key && dict && dict[key]) {
      el.title = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && dict && dict[key]) {
      el.placeholder = dict[key];
    }
  });

  if (typeof whTooltips !== 'undefined') {
    whTooltips.locale = (lang === 'mx') ? 'mx' : (lang === 'es' ? 'es' : 'en');
  }
  if (typeof renderInventory === 'function') renderInventory();
  if (typeof runOptimizer === 'function' && typeof currentOptimizationResults !== 'undefined' && currentOptimizationResults.length > 0) {
    runOptimizer();
  }
  if (typeof renderBlueTracker === 'function') renderBlueTracker();
  if (typeof renderRecentNews === 'function') renderRecentNews();
  if (typeof refreshArticleModalLanguage === 'function') refreshArticleModalLanguage();

  if (typeof window !== 'undefined' && window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') {
    window.$WowheadPower.refreshLinks();
  }
}

