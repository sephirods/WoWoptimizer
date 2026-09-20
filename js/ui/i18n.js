// MULTI-LANGUAGE SYSTEM (i18n: EN / ES / MX)
function detectBrowserLanguage() {
  try {
    const navLang = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || '';
    const lower = navLang.toLowerCase();
    if (lower.startsWith('es-mx') || lower.includes('latin') || lower.includes('419') || lower.startsWith('es-ar') || lower.startsWith('es-co') || lower.startsWith('es-cl')) {
      return 'mx';
    }
    if (lower.startsWith('es')) {
      return 'es';
    }
  } catch (e) {}
  return 'en';
}

let currentLang = 'en';
try {
  const savedLang = localStorage.getItem('wow_lang');
  if (savedLang === 'es' || savedLang === 'mx' || savedLang === 'en') {
    currentLang = savedLang;
  } else {
    currentLang = detectBrowserLanguage();
  }
} catch (e) {
  currentLang = detectBrowserLanguage();
}

const I18N_TRANSLATIONS = {
  en: {
    appName: "WoWTopGear",
    appSubtitle: "SimulationCraft Parser, Track Filtering & Gem Engine",
    homeNav: "Home",
    homeTitle: "Back to Main Portal",
    calculatorNav: "Calculator",
    featuresNav: "Features",
    newsNav: "WoW News",
    communityNav: "Community & Guides",
    launchOptimizerBtn: "Open Optimizer",
    startCalculatorBtn: "Launch Calculator",
    heroLaunchBtn: "Launch Optimizer",
    heroBadge: "CALIBRATED FOR PATCH 12.1 • MIDNIGHT SEASON 2",
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
    communitySubtitle: "We work with the most trusted sources across the World of Warcraft ecosystem to power WoWTopGear.",
    hubBloodmalletDesc: "Mathematical simulations of trinkets, gems, and races computed using SimulationCraft.",
    hubArchonDesc: "Live meta analysis of the world's highest Mythic+ runs and raid kill logs.",
    hubWowheadDesc: "Official class guides, talent calculators, dungeon loot tables, and full database.",
    hubRaidbotsDesc: "Cloud service to process SimC simulations and verify your WoWTopGear gear sets.",
    ctaTitle: "Ready to Perfect Your Character?",
    ctaDesc: "Load your character via the SimulationCraft addon or add your gear manually to discover your optimal setup in seconds.",
    ctaBtn: "Open WoWTopGear Now",
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
    optionsLabel: "Options:",
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
    compareModalSubtitle: "Review piece by piece improvements and stat changes",
    compareFooterNote: "Green stat differences indicate gains over your currently equipped items.",
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
    toastModeMplus: "🗝️ Stats: Mythic+ (M+) loaded",
    guideModalTitle: "Optimizer User Guide",
    guideModalSubtitle: "Step by step to optimize your gear, secondary stats, and vault rewards",
    guideStep1Title: "Download & Install Simulationcraft Addon",
    guideStep1CurseBtn: "CurseForge Addon",
    guideStep1Intro: "To export your character data, you need the official <strong class=\"text-white\">Simulationcraft</strong> in-game addon:",
    guideStep1Li1: "Open the <strong class=\"text-amber-300\">CurseForge App</strong>, search for <code class=\"text-amber-300 font-mono\">Simulationcraft</code> and click <strong>Install</strong> (or download it from <a href=\"https://www.curseforge.com/wow/addons/simulationcraft\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-amber-400 underline hover:text-amber-300\">CurseForge</a> and extract into <code class=\"text-slate-300 font-mono text-[11px]\">_retail_\\Interface\\AddOns\\</code>).",
    guideStep1Li2: "Log into World of Warcraft with your character, type <code class=\"text-amber-300 font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded border border-wow-border\">/simc</code> in the chat box, and press <strong>Enter</strong>.",
    guideStep1Li3: "A window will pop up displaying all your gear, bags, and Great Vault. Press <kbd class=\"bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-white font-mono font-bold\">Ctrl + C</kbd> to copy the text.",
    guideStep2Title: "Load your Gear & Bags",
    guideStep2Desc: "Click <strong class=\"text-emerald-300\"><i class=\"fa-solid fa-file-import\"></i> Import SimC</strong> in the top menu and paste your copied text (<kbd class=\"bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white font-mono text-[10px]\">Ctrl + V</kbd>). The optimizer will automatically load your equipped items, bag gear, and weekly <strong class=\"text-yellow-300\">Great Vault</strong> options.",
    guideStep3Title: "Set Secondary Stat Targets",
    guideStep3Desc: "Enter desired stat goals for <span class=\"text-purple-400 font-semibold\">Mastery</span>, <span class=\"text-blue-400 font-semibold\">Crit</span>, <span class=\"text-slate-300 font-semibold\">Haste</span>, and <span class=\"text-emerald-400 font-semibold\">Versatility</span>, or click any of the <strong class=\"text-amber-300\">Recommended Presets</strong> from Wowhead / Archon to load them instantly.",
    guideStep4Title: "Calculate the Best Setup",
    guideStep4Intro: "Click <strong class=\"text-amber-300\">Calculate Best Setup</strong> to find the mathematically optimal combination among all available items.",
    guideStep4Vault: "<strong class=\"text-yellow-300\"><i class=\"fa-solid fa-vault mr-1\"></i>Great Vault</strong>: See exactly which item from your weekly vault yields the highest stat compliance.",
    guideStep4Lock: "<strong class=\"text-amber-400\"><i class=\"fa-solid fa-lock mr-1\"></i>Lock Items</strong>: Click the padlock icon on any item to force it into the combination.",
    guideStep4Tier: "<strong class=\"text-purple-300\"><i class=\"fa-solid fa-layer-group mr-1\"></i>Tier Set Bonus</strong>: Require 2P or 4P set bonuses.",
    guideStep5Title: "Compare vs Equipped Gear",
    guideStep5Desc: "Click <strong class=\"text-amber-300\"><i class=\"fa-solid fa-code-compare\"></i> Compare vs Equipped</strong> to see a piece-by-piece breakdown: which items to equip, which enchants to apply, and which smart gems to socket for your optimal setup.",
    guideShortcutsTitle: "Keyboard Shortcuts",
    guideRunShortcut: "Run Optimizer",
    guideSearchShortcut: "Search Inventory",
    guideCloseShortcut: "Close Modal",
    guideGotIt: "Got it",
    guideGoToOptimizer: "Go to Optimizer",
    backupTitle: "JSON Backup & Export",
    backupSubtitle: "Save or restore your full inventory and configurations",
    backupDesc: "You can copy this JSON string or paste a previous backup to restore your items.",
    backupCopyBtn: "Copy to Clipboard",
    backupDownloadBtn: "Download .JSON",
    backupClearBtn: "Clear Inventory",
    backupRestoreBtn: "Restore from JSON",
    backupPlaceholder: "Inventory JSON will appear here...",
    showFilterLabel: "Show:",
    filterSocketsLabel: "Sockets",
    filterTierLabel: "Tier Set",
    filterLockedLabel: "Locked",
    filterEnabledLabel: "Enabled Only",
    filterVaultLabel: "Great Vault",
    sortIlvlDesc: "ilvl (High to Low)",
    sortIlvlAsc: "ilvl (Low to High)",
    sortNameAsc: "Name (A-Z)",
    sortCritDesc: "Crit (Highest)",
    sortHasteDesc: "Haste (Highest)",
    sortMasteryDesc: "Mastery (Highest)",
    sortVersDesc: "Versatility (Highest)",
    emptyInvTitle: "Your inventory is empty",
    emptyInvDesc: "Import your items via SimulationCraft string or add items manually.",
    emptyInvImportBtn: "Import SimC",
    heroTreeLabel: "Hero Tree:",
    pureBaseStatsTitle: "PURE BASE STATS (NO GEMS)",
    slotHead: "Head",
    slotNeck: "Neck",
    slotShoulder: "Shoulder",
    slotBack: "Back",
    slotChest: "Chest",
    slotWrist: "Wrist",
    slotHands: "Hands",
    slotWaist: "Waist",
    slotLegs: "Legs",
    slotFeet: "Feet",
    slotFinger: "Finger (Rings)",
    slotTrinket: "Trinkets",
    slotWeapon2h: "2H Weapons",
    slotWeapon1h: "1H Weapons",
    slotShield: "Shields",
    trackMythName: "Mythic (Myth)",
    trackHeroName: "Heroic (Hero)",
    trackChampName: "Champion (Champ)",
    trackVetName: "Veteran (Vet)",
    trackAdvName: "Adventurer",
    addVaultBtn: "+Vault",
    raidMythic: "Mythic Raid",
    mplus: "Mythic+ (M+)",
    weightMastery: "Mastery Weight",
    weightCrit: "Crit Weight",
    weightHaste: "Haste Weight",
    weightVers: "Versatility Weight",
    quickPresetsLabel: "Quick Presets:",
    autoSpecPreset: "Auto Spec",
    presetBalanced: "Balanced (1.0x)",
    presetMasteryFocus: "Mastery Focus",
    presetCritFocus: "Crit Focus",
    presetHasteFocus: "Haste Focus",
    noItemInSlot: "No",
    discordBtn: "Discord",
    discordCopiedToast: "Discord summary copied to clipboard!",
    discordErrorToast: "Error copying summary",
    promptPresetName: "Name for your custom stat preset (e.g. \"Mythic Raid\", \"M+ AoE\"):",
    savePresetTitle: "Save current setup as a custom preset",
    toastPresetSaved: "Preset \"%s\" saved successfully!",
    toastPresetDeleted: "Preset deleted",
    toastPresetApplied: "Preset \"%s\" applied",
    bisEnchantsTitle: "Recommended BiS Enchantments:",
    currentSeason: "Current Season",
    bisConsumablesTitle: "Optimal BiS Consumables:",
    consumablesSubtitle: "Flasks, Potions, Oils & Feasts",
    metaGemBenefit: "Midnight Primary Stat Unique Gem (Thalassian Diamond)."
  },
  es: {
    appName: "WoWTopGear",
    appSubtitle: "Parser de SimulationCraft, Filtrado por Rango y Motor de Gemas",
    homeNav: "Inicio",
    homeTitle: "Volver al Portal Principal",
    calculatorNav: "Calculadora",
    featuresNav: "Características",
    newsNav: "WoW News",
    communityNav: "Comunidad & Guías",
    launchOptimizerBtn: "Abrir Optimizador",
    startCalculatorBtn: "Iniciar Calculadora",
    heroLaunchBtn: "Iniciar Optimizador",
    heroBadge: "CALIBRADO PARA EL PARCHE 12.1 • MIDNIGHT SEASON 2",
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
    communitySubtitle: "Trabajamos con las fuentes más respetadas del ecosistema de World of Warcraft para alimentar el motor de WoWTopGear.",
    hubBloodmalletDesc: "Simulaciones matemáticas de abalorios, gemas y razas calculadas con SimulationCraft.",
    hubArchonDesc: "Análisis meta en vivo de las mejores runs de Mítica+ y registros de bandas del mundo.",
    hubWowheadDesc: "Guías oficiales de clase, calculadoras de talentos, tablas de botín y base de datos completa.",
    hubRaidbotsDesc: "Servicio cloud para procesar simulaciones de SimC y comprobar tus exportaciones de WoWTopGear.",
    ctaTitle: "¿Listo para Perfeccionar tu Personaje?",
    ctaDesc: "Carga tu personaje mediante el addon SimulationCraft o añade tus piezas manualmente para encontrar tu combinación óptima en segundos.",
    ctaBtn: "Abrir WoWTopGear Ahora",
    tabOptimizer: "Optimizador",
    tabInventory: "Inventario",
    shareBtn: "Compartir",
    shareTitle: "Copiar enlace compartible con tu configuración",
    guideBtn: "Guía",
    guideTitle: "Guía de uso y Ayuda",
    importSimcBtn: "Importar SimC",
    addItemBtn: "Añadir Objeto",
    targetStatsTitle: "Estadísticas Objetivo",
    targetStatsSubtitle: "Calcula sobre estadísticas base puras (sin gemas) e integra abalorios de stats secundarios",
    raidMythic: "Banda Mítica",
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
    optionsLabel: "Opciones:",
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
    compareModalSubtitle: "Revisa las mejoras pieza por pieza y los cambios de estadísticas",
    compareFooterNote: "Las diferencias en verde indican ganancias sobre tu equipo equipado actualmente.",
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
    toastModeRaid: "🏛️ Estadísticas: Banda Mítica cargadas",
    toastModeMplus: "🗝️ Estadísticas: Míticas+ (M+) cargadas",
    guideModalTitle: "Guía de Uso del Optimizador",
    guideModalSubtitle: "Paso a paso para optimizar tu equipo, estadísticas secundarias y recompensas de la Gran Cámara",
    guideStep1Title: "Descargar e Instalar Addon Simulationcraft",
    guideStep1CurseBtn: "Addon CurseForge",
    guideStep1Intro: "Para exportar los datos de tu personaje, necesitas el addon oficial de <strong class=\"text-white\">Simulationcraft</strong> dentro del juego:",
    guideStep1Li1: "Abre la aplicación <strong class=\"text-amber-300\">CurseForge</strong>, busca <code class=\"text-amber-300 font-mono\">Simulationcraft</code> y haz clic en <strong>Instalar</strong> (o descárgalo desde <a href=\"https://www.curseforge.com/wow/addons/simulationcraft\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-amber-400 underline hover:text-amber-300\">CurseForge</a> y extráelo en <code class=\"text-slate-300 font-mono text-[11px]\">_retail_\\Interface\\AddOns\\</code>).",
    guideStep1Li2: "Entra a World of Warcraft con tu personaje, escribe <code class=\"text-amber-300 font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded border border-wow-border\">/simc</code> en la ventana de chat y presiona <strong>Enter</strong>.",
    guideStep1Li3: "Aparecerá una ventana con el texto de todo tu equipo, bolsas y opciones de la Gran Cámara. Pulsa <kbd class=\"bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-white font-mono font-bold\">Ctrl + C</kbd> para copiarlo.",
    guideStep2Title: "Cargar tu Equipo y Bolsas",
    guideStep2Desc: "Haz clic en <strong class=\"text-emerald-300\"><i class=\"fa-solid fa-file-import\"></i> Importar SimC</strong> en el menú superior y pega el texto copiado (<kbd class=\"bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white font-mono text-[10px]\">Ctrl + V</kbd>). El optimizador cargará automáticamente tus objetos equipados, los de tus bolsas y las recompensas semanales de la <strong class=\"text-yellow-300\">Gran Cámara</strong>.",
    guideStep3Title: "Definir Estadísticas Objetivo",
    guideStep3Desc: "Introduce las metas deseadas para <span class=\"text-purple-400 font-semibold\">Maestría</span>, <span class=\"text-blue-400 font-semibold\">Crítico</span>, <span class=\"text-slate-300 font-semibold\">Celeridad</span> y <span class=\"text-emerald-400 font-semibold\">Versatilidad</span>, o haz clic en cualquiera de los <strong class=\"text-amber-300\">Presets Recomendados</strong> de Wowhead / Archon para aplicarlos al instante.",
    guideStep4Title: "Calcular la Mejor Combinación",
    guideStep4Intro: "Haz clic en <strong class=\"text-amber-300\">Calcular Mejor Combinación</strong> para encontrar el set matemáticamente óptimo entre todos tus objetos disponibles.",
    guideStep4Vault: "<strong class=\"text-yellow-300\"><i class=\"fa-solid fa-vault mr-1\"></i>Gran Cámara</strong>: Descubre exactamente qué objeto de tu cámara semanal otorga el mayor ajuste de estadísticas.",
    guideStep4Lock: "<strong class=\"text-amber-400\"><i class=\"fa-solid fa-lock mr-1\"></i>Bloquear Objetos</strong>: Haz clic en el candado de cualquier objeto para forzarlo dentro de la combinación.",
    guideStep4Tier: "<strong class=\"text-purple-300\"><i class=\"fa-solid fa-layer-group mr-1\"></i>Bono de Tier Set</strong>: Exige bonos de 2P o 4P piezas de conjunto.",
    guideStep5Title: "Comparar con tu Equipo Actual",
    guideStep5Desc: "Haz clic en <strong class=\"text-amber-300\"><i class=\"fa-solid fa-code-compare\"></i> Comparar vs Equipado</strong> para ver la comparativa pieza por pieza: qué objetos equipar, qué encantamientos aplicar y qué gemas engarzar para alcanzar tu combinación óptima.",
    guideShortcutsTitle: "Atajos de Teclado",
    guideRunShortcut: "Ejecutar Optimizador",
    guideSearchShortcut: "Buscar en Inventario",
    guideCloseShortcut: "Cerrar Ventana",
    guideGotIt: "Entendido",
    guideGoToOptimizer: "Ir al Optimizador",
    backupTitle: "Copia de Seguridad y Exportación JSON",
    backupSubtitle: "Guarda o restaura todo tu inventario y configuraciones",
    backupDesc: "Puedes copiar esta cadena JSON o pegar una copia de seguridad previa para restaurar tus objetos.",
    backupCopyBtn: "Copiar al Portapapeles",
    backupDownloadBtn: "Descargar .JSON",
    backupClearBtn: "Vaciar Inventario",
    backupRestoreBtn: "Restaurar desde JSON",
    backupPlaceholder: "El JSON del inventario aparecerá aquí...",
    showFilterLabel: "Mostrar:",
    filterSocketsLabel: "Ranuras",
    filterTierLabel: "Conjunto de clase",
    filterLockedLabel: "Bloqueados",
    filterEnabledLabel: "Solo habilitados",
    filterVaultLabel: "Gran Cámara",
    sortIlvlDesc: "ilvl (Mayor a Menor)",
    sortIlvlAsc: "ilvl (Menor a Mayor)",
    sortNameAsc: "Nombre (A-Z)",
    sortCritDesc: "Crítico (Mayor)",
    sortHasteDesc: "Celeridad (Mayor)",
    sortMasteryDesc: "Maestría (Mayor)",
    sortVersDesc: "Versatilidad (Mayor)",
    emptyInvTitle: "Tu inventario está vacío",
    emptyInvDesc: "Importa tus piezas mediante la cadena de SimulationCraft o añade objetos manualmente.",
    emptyInvImportBtn: "Importar SimC",
    heroTreeLabel: "Árbol Héroe:",
    pureBaseStatsTitle: "ESTADÍSTICAS BASE PURAS (SIN GEMAS)",
    slotHead: "Cabeza",
    slotNeck: "Cuello",
    slotShoulder: "Hombreras",
    slotBack: "Espalda",
    slotChest: "Pecho",
    slotWrist: "Muñecas",
    slotHands: "Manos",
    slotWaist: "Cintura",
    slotLegs: "Piernas",
    slotFeet: "Pies",
    slotFinger: "Anillos (Dedos)",
    slotTrinket: "Abalorios",
    slotWeapon2h: "Armas 2M",
    slotWeapon1h: "Armas 1M",
    slotShield: "Escudos",
    trackMythName: "Mítico (Myt)",
    trackHeroName: "Heroico (Hero)",
    trackChampName: "Campeón (Champ)",
    trackVetName: "Veterano (Vet)",
    trackAdvName: "Aventurero",
    addVaultBtn: "+Cámara",
    raidMythic: "Banda Mítica",
    mplus: "M+ (Míticas+)",
    weightMastery: "Peso Maestría",
    weightCrit: "Peso Crítico",
    weightHaste: "Peso Celeridad",
    weightVers: "Peso Versatilidad",
    quickPresetsLabel: "Presets Rápidos:",
    autoSpecPreset: "Auto Spec",
    presetBalanced: "Equilibrado (1.0x)",
    presetMasteryFocus: "Foco Maestría",
    presetCritFocus: "Foco Crítico",
    presetHasteFocus: "Foco Celeridad",
    noItemInSlot: "Sin",
    discordBtn: "Discord",
    discordCopiedToast: "¡Resumen para Discord copiado al portapapeles!",
    discordErrorToast: "Error al copiar resumen",
    promptPresetName: "Nombre para tu preset de estadísticas personalizadas (ej. \"Banda Mítica\", \"M+ AoE\"):",
    savePresetTitle: "Guardar configuración actual como preset personalizado",
    toastPresetSaved: "¡Preset \"%s\" guardado con éxito!",
    toastPresetDeleted: "Preset eliminado",
    toastPresetApplied: "Preset \"%s\" aplicado",
    bisEnchantsTitle: "Encantamientos BiS Recomendados:",
    currentSeason: "Temporada Actual",
    bisConsumablesTitle: "Consumibles BiS Óptimos:",
    consumablesSubtitle: "Frascos, Pociones, Aceites y Festines",
    metaGemBenefit: "Gema de Estadística Principal de Medianoche (Thalassian Diamond)."
  }
};

// Global dictionaries for localized WoW classes, specs, and hero trees
const WOW_I18N_CLASSES = {
  paladin: { en: "Paladin", es: "Paladín" },
  warrior: { en: "Warrior", es: "Guerrero" },
  deathknight: { en: "Death Knight", es: "Caballero de la Muerte" },
  hunter: { en: "Hunter", es: "Cazador" },
  shaman: { en: "Shaman", es: "Chamán" },
  rogue: { en: "Rogue", es: "Pícaro" },
  monk: { en: "Monk", es: "Monje" },
  demonhunter: { en: "Demon Hunter", es: "Cazador de Demonios" },
  druid: { en: "Druid", es: "Druida" },
  mage: { en: "Mage", es: "Mago" },
  warlock: { en: "Warlock", es: "Brujo" },
  priest: { en: "Priest", es: "Sacerdote" },
  evoker: { en: "Evoker", es: "Evocador" }
};

const WOW_I18N_SPECS = {
  retribution: { en: "Retribution", es: "Reprensión" },
  protection: { en: "Protection", es: "Protección" },
  holy: { en: "Holy", es: "Sagrado" },
  arms: { en: "Arms", es: "Armas" },
  fury: { en: "Fury", es: "Furia" },
  prot_warrior: { en: "Protection", es: "Protección" },
  blood: { en: "Blood", es: "Sangre" },
  frost_dk: { en: "Frost", es: "Escarcha" },
  unholy: { en: "Unholy", es: "Profano" },
  beast_mastery: { en: "Beast Mastery", es: "Dominio de bestias" },
  marksmanship: { en: "Marksmanship", es: "Puntería" },
  survival: { en: "Survival", es: "Supervivencia" },
  elemental: { en: "Elemental", es: "Elemental" },
  enhancement: { en: "Enhancement", es: "Mejora" },
  restoration_shaman: { en: "Restoration", es: "Restauración" },
  devastation: { en: "Devastation", es: "Devastación" },
  preservation: { en: "Preservation", es: "Preservación" },
  augmentation: { en: "Augmentation", es: "Aumento" },
  assassination: { en: "Assassination", es: "Asesinato" },
  outlaw: { en: "Outlaw", es: "Forajido" },
  subtlety: { en: "Subtlety", es: "Sutileza" },
  brewmaster: { en: "Brewmaster", es: "Maestro cervecero" },
  windwalker: { en: "Windwalker", es: "Viajero del viento" },
  mistweaver: { en: "Mistweaver", es: "Tejedor de niebla" },
  havoc: { en: "Havoc", es: "Devastación" },
  vengeance: { en: "Vengeance", es: "Venganza" },
  devourer: { en: "Devourer", es: "Devorador" },
  balance: { en: "Balance", es: "Equilibrio" },
  feral: { en: "Feral", es: "Feral" },
  guardian: { en: "Guardian", es: "Guardián" },
  restoration_druid: { en: "Restoration", es: "Restauración" },
  arcane: { en: "Arcane", es: "Arcano" },
  fire: { en: "Fire", es: "Fuego" },
  frost_mage: { en: "Frost", es: "Escarcha" },
  affliction: { en: "Affliction", es: "Aflicción" },
  demonology: { en: "Demonology", es: "Demonología" },
  destruction: { en: "Destruction", es: "Destrucción" },
  shadow: { en: "Shadow", es: "Sombras" },
  discipline: { en: "Discipline", es: "Disciplina" },
  holy_priest: { en: "Holy", es: "Sagrado" }
};

const WOW_I18N_HERO_TREES = {
  herald: { en: "Herald of the Sun", es: "Heraldo del Sol" },
  templar: { en: "Templar", es: "Templario" },
  lightsmith: { en: "Lightsmith", es: "Forjador de la Luz" },
  slayer: { en: "Slayer", es: "Verdugo" },
  colossus: { en: "Colossus", es: "Coloso" },
  mountain_thane: { en: "Mountain Thane", es: "Thane de la Montaña" },
  deathbringer: { en: "Deathbringer", es: "Portador de la Muerte" },
  rider: { en: "Rider of the Apocalypse", es: "Jinete del Apocalipsis" },
  sanlayn: { en: "San'layn", es: "San'layn" },
  packleader: { en: "Pack Leader", es: "Líder de la Manada" },
  dark_ranger: { en: "Dark Ranger", es: "Guardabosques Oscuro" },
  sentinel: { en: "Sentinel", es: "Centinela" },
  stormbringer: { en: "Stormbringer", es: "Invocatormentas" },
  farseer: { en: "Farseer", es: "Clarividente" },
  totemic: { en: "Totemic", es: "Totémico" },
  flameshaper: { en: "Flameshaper", es: "Moldeador de Llamas" },
  scalecommander: { en: "Scalecommander", es: "Comandante de Escamas" },
  chronowarden: { en: "Chronowarden", es: "Vigilante del Tiempo" },
  deathstalker: { en: "Deathstalker", es: "Acechador Mortal" },
  fatebound: { en: "Fatebound", es: "Vinculado al Destino" },
  trickster: { en: "Trickster", es: "Bribón" },
  master_of_harmony: { en: "Master of Harmony", es: "Maestro de la Armonía" },
  shado_pan: { en: "Shado-Pan", es: "Shado-Pan" },
  conduit_of_the_celestials: { en: "Conduit of the Celestials", es: "Conducto de los Celestiales" },
  aldrachi_reaver: { en: "Aldrachi Reaver", es: "Segador Aldrachi" },
  fel_scarred: { en: "Fel-Scarred", es: "Cicatrices Viles" },
  elunes_chosen: { en: "Elune's Chosen", es: "Elegido de Elune" },
  keeper_of_the_grove: { en: "Keeper of the Grove", es: "Guardián de la Arboleda" },
  wildstalker: { en: "Wildstalker", es: "Acechador Salvaje" },
  druid_of_the_claw: { en: "Druid of the Claw", es: "Druida de la Zarpa" },
  sunfury: { en: "Sunfury", es: "Furia del Sol" },
  spellslinger: { en: "Spellslinger", es: "Lanzahechizos" },
  frostfire: { en: "Frostfire", es: "Fuegoescarcha" },
  soul_harvester: { en: "Soul Harvester", es: "Cosechador de Almas" },
  hellcaller: { en: "Hellcaller", es: "Convocador Infernal" },
  diabolist: { en: "Diabolist", es: "Diabolista" },
  voidweaver: { en: "Voidweaver", es: "Tejedor del Vacío" },
  archon: { en: "Archon", es: "Arconte" },
  oracle: { en: "Oracle", es: "Oráculo" }
};

const WOW_I18N_SLOTS = {
  head: { en: "Head", es: "Cabeza" },
  helm: { en: "Helm", es: "Casco" },
  neck: { en: "Neck", es: "Cuello" },
  shoulder: { en: "Shoulder", es: "Hombreras" },
  shoulders: { en: "Shoulders", es: "Hombreras" },
  back: { en: "Back", es: "Espalda" },
  chest: { en: "Chest", es: "Pecho" },
  wrist: { en: "Wrist", es: "Muñecas" },
  hands: { en: "Hands", es: "Manos" },
  waist: { en: "Waist", es: "Cintura" },
  legs: { en: "Legs", es: "Piernas" },
  feet: { en: "Feet", es: "Pies" },
  boots: { en: "Boots", es: "Botas" },
  finger: { en: "Finger", es: "Anillo" },
  ring: { en: "Ring", es: "Anillo" },
  trinket: { en: "Trinket", es: "Abalorio" },
  weapon: { en: "Weapon", es: "Arma" },
  weapon_2h: { en: "2H Weapon", es: "Arma 2M" },
  weapon_1h: { en: "1H Weapon", es: "Arma 1M" },
  shield: { en: "Shield", es: "Escudo" }
};

const WOW_I18N_CONSUMABLE_TYPES = {
  'flask': { en: 'Flask', es: 'Frasco' },
  'combat potion': { en: 'Combat Potion', es: 'Poción de Combate' },
  'health potion': { en: 'Health Potion', es: 'Poción de Salud' },
  'weapon buff': { en: 'Weapon Buff', es: 'Mejora de Arma' },
  'augment rune': { en: 'Augment Rune', es: 'Runa de Aumento' },
  'food': { en: 'Food', es: 'Comida' },
  'rune': { en: 'Rune', es: 'Runa' },
  'potion': { en: 'Potion', es: 'Poción' }
};

function getLocalizedConsumableType(typeStr) {
  const lang = (currentLang === 'es' || currentLang === 'mx') ? 'es' : 'en';
  const clean = (typeStr || '').toLowerCase().trim();
  if (WOW_I18N_CONSUMABLE_TYPES[clean] && WOW_I18N_CONSUMABLE_TYPES[clean][lang]) {
    return WOW_I18N_CONSUMABLE_TYPES[clean][lang];
  }
  return typeStr || '';
}

function getLocalizedGemDesc(desc) {
  if (!desc) return '';
  const lang = (currentLang === 'es' || currentLang === 'mx') ? 'es' : 'en';
  if (lang === 'es') return desc;
  return desc
    .replace('Estadística Primaria', 'Primary Stat')
    .replace('Golpe Crítico', 'Critical Strike')
    .replace('Celeridad', 'Haste')
    .replace('Maestría', 'Mastery')
    .replace('Versatilidad', 'Versatility');
}

const WOW_I18N_WEAPON_MODES = {
  '2h': { en: '⚔️ 2-Handed (2H)', es: '⚔️ 2 Manos (2M)' },
  '1h_shield': { en: '🛡️ 1H + Shield', es: '🛡️ 1M + Escudo' },
  'dw_1h': { en: '⚔️ Dual Wield (1H)', es: '⚔️ Doble Empuñadura (1M)' },
  '1h': { en: '🗡️ 1-Handed (1H)', es: '🗡️ 1 Mano (1M)' },
  'staff': { en: '🦯 Staff / 2H Pole', es: '🦯 Bastón / Arma 2M' },
  'wand_offhand': { en: '✨ 1H + Offhand', es: '✨ 1M + Mano Izq' }
};

function getLocalizedWeaponMode(modeId, defaultLabel = '') {
  const lang = (currentLang === 'es' || currentLang === 'mx') ? 'es' : 'en';
  const clean = (modeId || '').toLowerCase().trim();
  if (WOW_I18N_WEAPON_MODES[clean] && WOW_I18N_WEAPON_MODES[clean][lang]) {
    return WOW_I18N_WEAPON_MODES[clean][lang];
  }
  return defaultLabel || modeId || '';
}

function getLocalizedSlotName(slotId) {
  const lang = (currentLang === 'es' || currentLang === 'mx') ? 'es' : 'en';
  const clean = (slotId || '').toLowerCase().trim();
  if (WOW_I18N_SLOTS[clean] && WOW_I18N_SLOTS[clean][lang]) {
    return WOW_I18N_SLOTS[clean][lang];
  }
  return slotId ? slotId.replace('_', ' ') : '';
}

function getLocalizedClassName(classId) {
  const lang = (currentLang === 'es' || currentLang === 'mx') ? 'es' : 'en';
  return WOW_I18N_CLASSES[classId] ? WOW_I18N_CLASSES[classId][lang] : classId;
}

function getLocalizedSpecName(specId) {
  const lang = (currentLang === 'es' || currentLang === 'mx') ? 'es' : 'en';
  return WOW_I18N_SPECS[specId] ? WOW_I18N_SPECS[specId][lang] : specId;
}

function getLocalizedHeroTreeName(treeId, originalName = '') {
  const lang = (currentLang === 'es' || currentLang === 'mx') ? 'es' : 'en';
  const cleanId = (treeId || '').toLowerCase().trim();
  if (WOW_I18N_HERO_TREES[cleanId] && WOW_I18N_HERO_TREES[cleanId][lang]) {
    // preserve original emoji icon if present
    const iconMatch = originalName ? originalName.match(/^([^\w\s]+|\p{Extended_Pictographic}+)\s*/u) : null;
    const prefix = iconMatch ? iconMatch[0] : '';
    return prefix + WOW_I18N_HERO_TREES[cleanId][lang];
  }
  return originalName || treeId;
}

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

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (key && dict && dict[key]) {
      el.innerHTML = dict[key];
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
  if (typeof renderPinnedNews === 'function') renderPinnedNews();
  if (typeof renderBlizzardNews === 'function') renderBlizzardNews();
  if (typeof renderBlueTracker === 'function') renderBlueTracker();
  if (typeof renderRecentNews === 'function') renderRecentNews();
  if (typeof refreshArticleModalLanguage === 'function') refreshArticleModalLanguage();

  if (typeof updateClassDropdownOptions === 'function') updateClassDropdownOptions();
  if (typeof updateSpecDropdown === 'function' && typeof currentSpec !== 'undefined') updateSpecDropdown(currentSpec);
  if (typeof renderPresetsToolbar === 'function') renderPresetsToolbar();
  if (typeof updateTargetDistributionStrip === 'function') updateTargetDistributionStrip();

  if (typeof window !== 'undefined' && window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') {
    window.$WowheadPower.refreshLinks();
  }
}

