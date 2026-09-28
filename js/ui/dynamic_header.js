// Componente Modular de Encabezado (Header Dinámico) para Portada y Páginas de Clases/Guías
(function initDynamicHeader() {
  const WOW_CLASSES_MENU = [
    {
      id: 'paladin',
      color: '#F48CBA',
      icon: 'classicon_paladin.jpg',
      name: { en: 'Paladin', es: 'Paladín' },
      specs: [
        { id: 'retribution', name: { en: 'Retribution', es: 'Reprensión' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'protection', name: { en: 'Protection', es: 'Protección' }, role: 'Tank', roleColor: 'text-blue-400' },
        { id: 'holy', name: { en: 'Holy', es: 'Sagrado' }, role: 'Healer', roleColor: 'text-emerald-400' }
      ]
    },
    {
      id: 'warrior',
      color: '#C79C6E',
      icon: 'classicon_warrior.jpg',
      name: { en: 'Warrior', es: 'Guerrero' },
      specs: [
        { id: 'arms', name: { en: 'Arms', es: 'Armas' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'fury', name: { en: 'Fury', es: 'Furia' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'protection', name: { en: 'Protection', es: 'Protección' }, role: 'Tank', roleColor: 'text-blue-400' }
      ]
    },
    {
      id: 'deathknight',
      color: '#C41E3A',
      icon: 'classicon_deathknight.jpg',
      name: { en: 'Death Knight', es: 'Caballero de la Muerte' },
      specs: [
        { id: 'blood', name: { en: 'Blood', es: 'Sangre' }, role: 'Tank', roleColor: 'text-blue-400' },
        { id: 'frost', name: { en: 'Frost', es: 'Escarcha' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'unholy', name: { en: 'Unholy', es: 'Profano' }, role: 'DPS', roleColor: 'text-red-400' }
      ]
    },
    {
      id: 'hunter',
      color: '#AAD372',
      icon: 'classicon_hunter.jpg',
      name: { en: 'Hunter', es: 'Cazador' },
      specs: [
        { id: 'beast-mastery', name: { en: 'Beast Mastery', es: 'Bestias' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'marksmanship', name: { en: 'Marksmanship', es: 'Puntería' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'survival', name: { en: 'Survival', es: 'Supervivencia' }, role: 'DPS', roleColor: 'text-red-400' }
      ]
    },
    {
      id: 'rogue',
      color: '#FFF468',
      icon: 'classicon_rogue.jpg',
      name: { en: 'Rogue', es: 'Pícaro' },
      specs: [
        { id: 'assassination', name: { en: 'Assassination', es: 'Asesinato' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'outlaw', name: { en: 'Outlaw', es: 'Forajido' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'subtlety', name: { en: 'Subtlety', es: 'Sutileza' }, role: 'DPS', roleColor: 'text-red-400' }
      ]
    },
    {
      id: 'priest',
      color: '#FFFFFF',
      icon: 'classicon_priest.jpg',
      name: { en: 'Priest', es: 'Sacerdote' },
      specs: [
        { id: 'discipline', name: { en: 'Discipline', es: 'Disciplina' }, role: 'Healer', roleColor: 'text-emerald-400' },
        { id: 'holy', name: { en: 'Holy', es: 'Sagrado' }, role: 'Healer', roleColor: 'text-emerald-400' },
        { id: 'shadow', name: { en: 'Shadow', es: 'Sombras' }, role: 'DPS', roleColor: 'text-red-400' }
      ]
    },
    {
      id: 'shaman',
      color: '#0070DD',
      icon: 'classicon_shaman.jpg',
      name: { en: 'Shaman', es: 'Chamán' },
      specs: [
        { id: 'elemental', name: { en: 'Elemental', es: 'Elemental' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'enhancement', name: { en: 'Enhancement', es: 'Mejora' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'restoration', name: { en: 'Restoration', es: 'Restauración' }, role: 'Healer', roleColor: 'text-emerald-400' }
      ]
    },
    {
      id: 'mage',
      color: '#3FC7EB',
      icon: 'classicon_mage.jpg',
      name: { en: 'Mage', es: 'Mago' },
      specs: [
        { id: 'arcane', name: { en: 'Arcane', es: 'Arcano' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'fire', name: { en: 'Fire', es: 'Fuego' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'frost', name: { en: 'Frost', es: 'Escarcha' }, role: 'DPS', roleColor: 'text-red-400' }
      ]
    },
    {
      id: 'warlock',
      color: '#8788EE',
      icon: 'classicon_warlock.jpg',
      name: { en: 'Warlock', es: 'Brujo' },
      specs: [
        { id: 'affliction', name: { en: 'Affliction', es: 'Aflicción' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'demonology', name: { en: 'Demonology', es: 'Demonología' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'destruction', name: { en: 'Destruction', es: 'Destrucción' }, role: 'DPS', roleColor: 'text-red-400' }
      ]
    },
    {
      id: 'monk',
      color: '#00FF98',
      icon: 'classicon_monk.jpg',
      name: { en: 'Monk', es: 'Monje' },
      specs: [
        { id: 'brewmaster', name: { en: 'Brewmaster', es: 'Maestro Cervecero' }, role: 'Tank', roleColor: 'text-blue-400' },
        { id: 'mistweaver', name: { en: 'Mistweaver', es: 'Tejedor de Niebla' }, role: 'Healer', roleColor: 'text-emerald-400' },
        { id: 'windwalker', name: { en: 'Windwalker', es: 'Viajero del Viento' }, role: 'DPS', roleColor: 'text-red-400' }
      ]
    },
    {
      id: 'druid',
      color: '#FF7C0A',
      icon: 'classicon_druid.jpg',
      name: { en: 'Druid', es: 'Druida' },
      specs: [
        { id: 'balance', name: { en: 'Balance', es: 'Equilibrio' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'feral', name: { en: 'Feral', es: 'Feral' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'guardian', name: { en: 'Guardian', es: 'Guardián' }, role: 'Tank', roleColor: 'text-blue-400' },
        { id: 'restoration', name: { en: 'Restoration', es: 'Restauración' }, role: 'Healer', roleColor: 'text-emerald-400' }
      ]
    },
    {
      id: 'demonhunter',
      color: '#A330C9',
      icon: 'classicon_demonhunter.jpg',
      name: { en: 'Demon Hunter', es: 'Cazador de Demonios' },
      specs: [
        { id: 'havoc', name: { en: 'Havoc', es: 'Devastación' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'vengeance', name: { en: 'Vengeance', es: 'Venganza' }, role: 'Tank', roleColor: 'text-blue-400' },
        { id: 'devourer', name: { en: 'Devourer', es: 'Devorador' }, role: 'DPS', roleColor: 'text-red-400' }
      ]
    },
    {
      id: 'evoker',
      color: '#33937F',
      icon: 'classicon_evoker.jpg',
      name: { en: 'Evoker', es: 'Evocador' },
      specs: [
        { id: 'devastation', name: { en: 'Devastation', es: 'Devastación' }, role: 'DPS', roleColor: 'text-red-400' },
        { id: 'preservation', name: { en: 'Preservation', es: 'Preservación' }, role: 'Healer', roleColor: 'text-emerald-400' },
        { id: 'augmentation', name: { en: 'Augmentation', es: 'Aumento' }, role: 'Support', roleColor: 'text-purple-400' }
      ]
    }
  ];

  function renderHeader() {
    const container = document.getElementById('app-header-container');
    if (!container) return;

    let basePath = container.dataset.basePath;
    if (basePath === undefined) {
      if (window.location.pathname.match(/\/(classes|guides)\/[^\/]+\//)) {
        basePath = '../../';
      } else if (window.location.pathname.includes('/classes/') || window.location.pathname.includes('/guides/')) {
        basePath = '../';
      } else {
        basePath = '';
      }
    }

    const isEs = (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'mx'));

    // Generar items de escritorio para el menú desplegable de Clases con sub-menú a la derecha
    const desktopClassesHtml = WOW_CLASSES_MENU.map(c => {
      const cName = isEs ? c.name.es : c.name.en;
      const specsHtml = c.specs.map(s => {
        const sName = isEs ? s.name.es : s.name.en;
        return `
          <a href="${basePath}classes/${c.id}/${s.id}/" class="flex items-center justify-between px-3.5 py-2 hover:bg-white/10 rounded-lg text-slate-200 hover:text-white transition group/spec text-xs">
            <span class="font-medium group-hover/spec:translate-x-1 transition duration-150">${sName}</span>
            <span class="text-[9px] font-mono font-bold uppercase ${s.roleColor} bg-black/40 px-1.5 py-0.5 rounded border border-white/5">${s.role}</span>
          </a>
        `;
      }).join('');

      return `
        <div class="relative group/classitem class-menu-item">
          <div class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white cursor-pointer transition">
            <a href="${basePath}classes/${c.id}/" class="flex items-center gap-2.5 flex-grow">
              <img src="https://wow.zamimg.com/images/wow/icons/small/${c.icon}" alt="${cName}" class="w-5 h-5 rounded-md object-cover border border-white/20 shrink-0" onerror="this.src='https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg'"/>
              <span class="text-xs font-semibold" style="color: ${c.color}">${cName}</span>
            </a>
            <i class="fa-solid fa-chevron-right text-[10px] text-slate-500 group-hover/classitem:text-amber-400 group-hover/classitem:translate-x-0.5 transition shrink-0 ml-2"></i>
          </div>

          <!-- SUB-DROPDOWN A LA DERECHA (SPECS) -->
          <div class="class-submenu absolute left-full top-0 pl-1.5 w-52 hidden group-hover/classitem:block z-50 pointer-events-auto">
            <div class="bg-[#0f1422] border border-wow-border rounded-xl shadow-2xl p-2 backdrop-blur-xl">
              <div class="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 border-b border-white/10 mb-1 flex items-center justify-between">
                <span>${cName}</span>
                <span class="text-amber-400 font-bold">${c.specs.length} Specs</span>
              </div>
              <div class="space-y-0.5">
                ${specsHtml}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Generar acordeón táctil para móvil
    const mobileClassesAccordionHtml = WOW_CLASSES_MENU.map(c => {
      const cName = isEs ? c.name.es : c.name.en;
      const specsHtml = c.specs.map(s => {
        const sName = isEs ? s.name.es : s.name.en;
        return `
          <a href="${basePath}classes/${c.id}/${s.id}/" class="flex items-center justify-between py-2 px-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-200 hover:text-white active:bg-white/10 transition">
            <span class="font-medium">${sName}</span>
            <span class="text-[9px] font-mono font-bold uppercase ${s.roleColor}">${s.role}</span>
          </a>
        `;
      }).join('');

      return `
        <div class="border-b border-white/5 last:border-b-0">
          <button type="button" onclick="window.toggleMobileClassSubmenu('${c.id}')" class="w-full flex items-center justify-between py-2.5 px-3 text-left hover:bg-white/5 rounded-lg transition min-h-[38px]">
            <div class="flex items-center gap-2.5">
              <img src="https://wow.zamimg.com/images/wow/icons/small/${c.icon}" alt="${cName}" class="w-5 h-5 rounded-md object-cover border border-white/20 shrink-0" onerror="this.src='https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg'"/>
              <span class="text-xs font-bold" style="color: ${c.color}">${cName}</span>
            </div>
            <i id="mob-chevron-${c.id}" class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition transform"></i>
          </button>
          <div id="mob-specs-${c.id}" class="hidden pl-4 pr-1 py-1.5 space-y-1.5 bg-black/20 rounded-lg my-1">
            <a href="${basePath}classes/${c.id}/" class="block text-[11px] font-bold text-amber-400 hover:underline py-1 px-3">
              ${isEs ? `Ver visión general de ${cName} →` : `View ${cName} Overview →`}
            </a>
            ${specsHtml}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <style>
        .class-menu-item:hover > .class-submenu {
          display: block !important;
        }
      </style>
      <header class="bg-[#0b0e17]/95 backdrop-blur border-b border-wow-border sticky top-0 z-40 shadow-2xl">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          <!-- Brand Logo -->
          <a href="${basePath}index.html" class="flex items-center gap-2 sm:gap-3 group shrink min-w-0">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-amber-400/60 flex items-center justify-center shadow-lg shadow-purple-950/60 group-hover:border-amber-300 transition shrink-0 bg-[#0c101d]">
              <img src="${basePath}img/logo.webp" alt="WoWTopGear Logo" class="w-full h-full object-cover group-hover:scale-110 transition duration-200" width="40" height="40" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 truncate" style="font-family: 'Cinzel', serif;">
                  WoWTopGear
                </span>
                <span class="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 font-bold shrink-0">
                  S2
                </span>
              </div>
              <p class="text-[9px] sm:text-[10px] text-slate-400 tracking-wide truncate hidden min-[380px]:block">Gear Engine & Optimization</p>
            </div>
          </a>

          <!-- Quick Nav Links (Desktop) -->
          <nav class="hidden lg:flex items-center gap-6 text-xs font-semibold">
            <a href="${basePath}gearsim" class="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition">
              <i class="fa-solid fa-calculator"></i> <span data-i18n="calculatorNav">Calculadora</span>
            </a>

            <!-- DROPDOWN MULTI-NIVEL DE GUÍAS DE CLASES -->
            <div class="relative group/maindropdown py-2">
              <a href="${basePath}classes/index.html" class="text-slate-200 hover:text-amber-400 flex items-center gap-1.5 transition cursor-pointer">
                <i class="fa-solid fa-book-journal-whills text-amber-400"></i>
                <span data-i18n="classGuidesNav">Guías de Clases</span>
                <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 group-hover/maindropdown:rotate-180 transition"></i>
              </a>

              <!-- MENÚ DESPLEGABLE PRINCIPAL (13 CLASES) -->
              <div class="absolute left-0 top-full pt-1.5 w-60 hidden group-hover/maindropdown:block z-50">
                <div class="bg-[#0f1422] border border-wow-border rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl space-y-1">
                  <a href="${basePath}classes/index.html" class="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs transition mb-1.5">
                    <span data-i18n="allClassesLink">Ver Todas las Clases</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                  <div class="border-t border-white/10 pt-1.5 space-y-0.5 overflow-visible">
                    ${desktopClassesHtml}
                  </div>
                </div>
              </div>
            </div>

            <a href="${basePath}index.html#features" class="text-slate-300 hover:text-white transition" data-i18n="featuresNav">Características</a>
            <a href="${basePath}index.html#news" class="text-slate-300 hover:text-white transition" data-i18n="newsNav">WoW News</a>
            <a href="${basePath}index.html#community" class="text-slate-300 hover:text-white transition" data-i18n="communityNav">Comunidad & Guías</a>
          </nav>

          <!-- CTA & Language Selector & Mobile Trigger -->
          <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <!-- Language Selector Dropdown -->
            <div class="relative inline-block">
              <select id="lang-select" onchange="setLanguage(this.value)" class="bg-black/60 hover:bg-black text-amber-300 text-xs font-bold pl-2 pr-5 sm:pr-6 py-1.5 rounded-lg border border-wow-border focus:outline-none focus:border-amber-400 cursor-pointer appearance-none shadow-sm transition min-h-[36px]">
                <option value="en" class="bg-slate-900 text-slate-200">🇺🇸 EN</option>
                <option value="es" class="bg-slate-900 text-slate-200">🇪🇸 ES</option>
                <option value="mx" class="bg-slate-900 text-slate-200">🇲🇽 MX</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-amber-400 text-[10px]">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Botón Optimizador -->
            <div class="relative inline-flex items-center">
              <a href="${basePath}gearsim" class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg shadow-amber-950/40 border border-amber-300/60 flex items-center gap-1.5 sm:gap-2 transition min-h-[36px]">
                <i class="fa-solid fa-play text-xs"></i> <span class="hidden min-[480px]:inline" data-i18n="launchOptimizerBtn">Abrir Optimizador</span><span class="inline min-[480px]:hidden">Optimizador</span>
              </a>
              <button type="button" onclick="if(typeof openHelpModal==='function')openHelpModal();" class="absolute -top-2 -right-2 w-5 h-5 rounded-full shadow-md flex items-center justify-center transition transform hover:scale-110 active:scale-95 z-10 cursor-pointer" style="background-color: #000000 !important; border: none !important; padding: 0 !important; line-height: 1 !important;" data-i18n-title="guideTitle" title="User Guide & Help">
                <span style="color: #fbbf24 !important; font-size: 11px; font-weight: 900; font-family: sans-serif; line-height: 1; user-select: none;">?</span>
              </button>
            </div>

            <!-- BOTÓN MENÚ MÓVIL (HAMBURGUESA) -->
            <button type="button" onclick="window.toggleMobileDrawer()" class="lg:hidden p-2 rounded-xl bg-wow-card border border-wow-border text-slate-300 hover:text-white hover:border-amber-400 min-h-[36px] min-w-[36px] flex items-center justify-center" aria-label="Abrir Menú">
              <i id="mob-menu-icon" class="fa-solid fa-bars text-base"></i>
            </button>
          </div>

        </div>

        <!-- DRAWER MÓVIL DESPLEGABLE -->
        <div id="app-mobile-drawer" class="hidden lg:hidden border-t border-wow-border bg-[#0b0e17]/98 px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto">
          <div class="space-y-1">
            <a href="${basePath}gearsim" class="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-bold min-h-[38px]">
              <i class="fa-solid fa-calculator text-amber-400"></i>
              <span data-i18n="calculatorNav">Calculadora</span>
            </a>

            <!-- Acordeón Móvil de Guías de Clase -->
            <div class="border border-wow-border rounded-xl bg-wow-subcard overflow-hidden">
              <div class="p-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
                <a href="${basePath}classes/index.html" class="flex items-center gap-2 text-xs font-bold text-white hover:text-amber-400">
                  <i class="fa-solid fa-book-journal-whills text-amber-400"></i>
                  <span data-i18n="classGuidesNav">Guías de Clases (Todas)</span>
                </a>
                <span class="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded">13 Clases</span>
              </div>
              <div class="p-2 max-h-[50vh] overflow-y-auto">
                ${mobileClassesAccordionHtml}
              </div>
            </div>

            <a href="${basePath}index.html#features" class="flex items-center gap-2 py-2.5 px-3 rounded-lg text-slate-300 hover:text-white text-xs font-semibold min-h-[38px]" data-i18n="featuresNav">
              <i class="fa-solid fa-bolt text-slate-500"></i> Características
            </a>
            <a href="${basePath}index.html#news" class="flex items-center gap-2 py-2.5 px-3 rounded-lg text-slate-300 hover:text-white text-xs font-semibold min-h-[38px]" data-i18n="newsNav">
              <i class="fa-solid fa-newspaper text-slate-500"></i> WoW News
            </a>
            <a href="${basePath}index.html#community" class="flex items-center gap-2 py-2.5 px-3 rounded-lg text-slate-300 hover:text-white text-xs font-semibold min-h-[38px]" data-i18n="communityNav">
              <i class="fa-solid fa-users text-slate-500"></i> Comunidad & Guías
            </a>
          </div>
        </div>
      </header>
    `;

    // Funciones globales de interacción móvil
    window.toggleMobileDrawer = function() {
      const drawer = document.getElementById('app-mobile-drawer');
      const icon = document.getElementById('mob-menu-icon');
      if (!drawer) return;
      if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
        if (icon) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        }
      } else {
        drawer.classList.add('hidden');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    };

    window.toggleMobileClassSubmenu = function(classId) {
      const menu = document.getElementById(`mob-specs-${classId}`);
      const chevron = document.getElementById(`mob-chevron-${classId}`);
      if (!menu) return;
      if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
      } else {
        menu.classList.add('hidden');
        if (chevron) chevron.classList.remove('rotate-180');
      }
    };

    if (typeof currentLang !== 'undefined') {
      const select = document.getElementById('lang-select');
      if (select) select.value = currentLang;
    }
    if (typeof updateLanguageUI === 'function') {
      updateLanguageUI();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeader);
  } else {
    renderHeader();
  }
})();
