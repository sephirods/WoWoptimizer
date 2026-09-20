// Componente Modular de Pie de Página (Footer Dinámico), Banners Legales y Modales de Soporte / Reporte de Bugs

(function initDynamicFooter() {
  const FOOTER_HTML = `
  <!-- FOOTER DINÁMICO (MOBILE-FIRST) -->
  <footer class="mt-auto border-t border-wow-border bg-[#0a0c12] py-6 px-3 sm:px-4 text-xs text-slate-400">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2 text-center md:text-left flex-wrap justify-center md:justify-start">
        <span class="wow-title text-sm font-bold text-amber-400">WoW Optimizer</span>
        <span class="text-slate-600 hidden sm:inline">|</span>
        <span class="text-[10px] sm:text-[11px] text-slate-400">World of Warcraft® Stat & Gear Engine</span>
      </div>
      <div class="flex items-center gap-2.5 sm:gap-4 flex-wrap justify-center text-[11px]">
        <button onclick="openBugReportModal()" class="text-amber-400 hover:text-amber-300 transition font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 shadow-sm min-h-[34px]" data-i18n="reportIssue">
          <i class="fa-solid fa-bug text-xs"></i> Encontré un Problema
        </button>
        <button onclick="openPrivacyModal()" class="hover:text-amber-300 transition underline underline-offset-4 py-1" data-i18n="privacyPolicy">Privacy Policy</button>
        <button onclick="openTermsModal()" class="hover:text-amber-300 transition underline underline-offset-4 py-1" data-i18n="termsOfService">Terms of Service</button>
        <button onclick="openContactModal()" class="hover:text-amber-300 transition underline underline-offset-4 py-1" data-i18n="contactUs">Contact & Support</button>
        <button onclick="openCookieConsent(true)" class="hover:text-amber-300 transition underline underline-offset-4 py-1" data-i18n="cookieSettings">Cookie Settings</button>
      </div>
      <div class="text-[10px] text-slate-500 text-center md:text-right max-w-sm md:max-w-none">
        World of Warcraft, Warcraft and Blizzard Entertainment are trademarks or registered trademarks of Blizzard Entertainment, Inc.
      </div>
    </div>
  </footer>

  <!-- GDPR / COOKIE CONSENT BANNER (MOBILE-FIRST) -->
  <div id="cookie-consent-banner" class="fixed bottom-0 inset-x-0 bg-[#0e111a]/95 backdrop-blur border-t border-wow-border z-50 p-3 sm:p-4 shadow-2xl transition-all duration-300 hidden">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2.5 sm:gap-3 text-slate-300">
        <i class="fa-solid fa-cookie-bite text-amber-400 text-lg sm:text-xl shrink-0"></i>
        <div>
          <span class="font-bold text-white text-[11px] sm:text-xs" data-i18n="cookieTitle">Cookie & Privacy Preferences:</span>
          <span class="text-slate-400 ml-1 text-[10px] sm:text-xs" data-i18n="cookieDesc">We use local storage to save your character preferences and non-intrusive cookies to improve user experience.</span>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <button onclick="openPrivacyModal()" class="w-1/2 sm:w-auto px-3 py-2 rounded-lg border border-wow-border text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs min-h-[38px] flex items-center justify-center" data-i18n="learnMore">Learn More</button>
        <button onclick="acceptCookieConsent()" class="w-1/2 sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold shadow transition text-xs min-h-[38px] flex items-center justify-center" data-i18n="acceptCookies">Accept & Continue</button>
      </div>
    </div>
  </div>

  <!-- MODAL: PRIVACY POLICY -->
  <div id="privacy-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-wow-panel border border-wow-border rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-wow-border pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h3 class="text-base font-bold text-white" data-i18n="privacyPolicyTitle">Privacy Policy</h3>
        </div>
        <button onclick="closePrivacyModal()" class="text-slate-400 hover:text-white">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
      <div class="text-xs text-slate-300 space-y-3 leading-relaxed">
        <p><strong class="text-white">Last Updated:</strong> September 2026</p>
        <p>This Privacy Policy explains how <strong>WoW Optimizer</strong> ("we", "our") collects, uses, and protects information when you use our web application.</p>
        
        <h4 class="font-bold text-amber-400 text-sm">1. Information We Process</h4>
        <p>WoW Optimizer is a client-side calculator. When you paste your SimulationCraft (/simc) profile or character statistics, that data is processed directly inside your browser and stored locally on your device via <code>localStorage</code>. We do not store or transmit your character profiles to external private databases.</p>

        <h4 class="font-bold text-amber-400 text-sm">2. Cookies & Local Storage</h4>
        <p>We use browser <code>localStorage</code> solely to preserve your selected character class, specialization, stat targets, inventory items, and language preferences across sessions so that you don't lose your setup when refreshing the page.</p>

        <h4 class="font-bold text-amber-400 text-sm">3. Third-Party Services</h4>
        <p>This website loads external assets and scripts strictly required for functionality, including:</p>
        <ul class="list-disc list-inside space-y-1 pl-2 text-slate-400">
          <li><strong>Wowhead Tooltips:</strong> Provides tooltips and item icons directly from Wowhead (<a href="https://www.wowhead.com" target="_blank" class="text-amber-400 underline">wowhead.com</a>).</li>
          <li><strong>Font Awesome & Google Fonts:</strong> For icons and typography.</li>
          <li><strong>Tailwind CSS & Chart.js:</strong> Delivered via high-speed CDNs.</li>
        </ul>

        <h4 class="font-bold text-amber-400 text-sm">4. Data Security</h4>
        <p>Since your calculations and items are processed on your local machine, your data remains in your control at all times. You can clear all stored data at any time via the "Clear Inventory" button in the Backup menu.</p>

        <h4 class="font-bold text-amber-400 text-sm">5. Contact Us</h4>
        <p>If you have any questions about this Privacy Policy, please reach out through our Contact & Support channel.</p>
      </div>
      <div class="pt-3 border-t border-wow-border flex justify-end">
        <button type="button" onclick="closePrivacyModal()" class="px-5 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 shadow" data-i18n="closeModal">Close</button>
      </div>
    </div>
  </div>

  <!-- MODAL: TERMS OF SERVICE -->
  <div id="terms-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-wow-panel border border-wow-border rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-wow-border pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <i class="fa-solid fa-scale-balanced"></i>
          </div>
          <h3 class="text-base font-bold text-white" data-i18n="termsTitle">Terms of Service</h3>
        </div>
        <button onclick="closeTermsModal()" class="text-slate-400 hover:text-white">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
      <div class="text-xs text-slate-300 space-y-3 leading-relaxed">
        <p><strong class="text-white">Last Updated:</strong> September 2026</p>
        <p>By using WoW Optimizer, you agree to these Terms of Service. If you disagree, please discontinue use of the tool.</p>

        <h4 class="font-bold text-amber-400 text-sm">1. Intended Use</h4>
        <p>WoW Optimizer is a community-created utility designed to assist players in calculating secondary stat distributions and equipment combinations for World of Warcraft®. It is provided free of charge for personal, non-commercial use.</p>

        <h4 class="font-bold text-amber-400 text-sm">2. Disclaimer of Warranties</h4>
        <p>The calculations, recommendations, and simulations provided are estimates based on mathematical models, community guides (Wowhead, Archon, Bloodmallet), and game data. They are provided "AS IS" without warranty of any kind.</p>

        <h4 class="font-bold text-amber-400 text-sm">3. Intellectual Property Rights</h4>
        <p>World of Warcraft®, Warcraft®, Blizzard Entertainment® and all associated assets, artwork, and trademarks are the registered trademarks of Blizzard Entertainment, Inc. WoW Optimizer is not affiliated with, endorsed, or sponsored by Blizzard Entertainment.</p>
      </div>
      <div class="pt-3 border-t border-wow-border flex justify-end">
        <button type="button" onclick="closeTermsModal()" class="px-5 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 shadow" data-i18n="closeModal">Close</button>
      </div>
    </div>
  </div>

  <!-- MODAL: CONTACT & ABOUT -->
  <div id="contact-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-wow-panel border border-wow-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-wow-border pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <i class="fa-solid fa-envelope"></i>
          </div>
          <h3 class="text-base font-bold text-white" data-i18n="contactTitle">Contact & Support</h3>
        </div>
        <button onclick="closeContactModal()" class="text-slate-400 hover:text-white">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
      <div class="text-xs text-slate-300 space-y-3 leading-relaxed">
        <p>Have feedback, found a calculation discrepancy, or want to contribute? Feel free to reach out:</p>
        <div class="bg-black/50 p-3 rounded-lg border border-wow-border/60 space-y-2">
          <div class="flex items-center gap-2 text-slate-200">
            <i class="fa-brands fa-github text-amber-400 text-base"></i>
            <span>GitHub: <a href="https://github.com/sephirods/WoWoptimizer" target="_blank" class="text-amber-400 underline font-semibold">github.com/sephirods/WoWoptimizer</a></span>
          </div>
          <div class="flex items-center gap-2 text-slate-200">
            <i class="fa-solid fa-bug text-amber-400 text-base"></i>
            <span>Bug Reports: <button onclick="closeContactModal(); openBugReportModal();" class="text-amber-400 underline font-semibold">Enviar un ticket de problema</button></span>
          </div>
        </div>
        <p class="text-slate-400">We appreciate community contributions, bug reports, and suggestions for new features!</p>
      </div>
      <div class="pt-3 border-t border-wow-border flex justify-end">
        <button type="button" onclick="closeContactModal()" class="px-5 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 shadow" data-i18n="closeModal">Close</button>
      </div>
    </div>
  </div>

  <!-- MODAL: ENCONTRÉ UN PROBLEMA / TICKETS DE BUGS (MOBILE-FIRST) -->
  <div id="bug-report-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 hidden">
    <div class="bg-wow-panel border border-amber-500/50 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-3.5 sm:space-y-4 max-h-[94vh] overflow-y-auto scrollbar-thin">
      <div class="flex items-center justify-between border-b border-wow-border pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/15 border border-amber-500/50 flex items-center justify-center text-amber-400 text-base sm:text-lg shadow shrink-0">
            <i class="fa-solid fa-bug"></i>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Reportar un Problema o Bug
            </h3>
            <p class="text-[10px] sm:text-[11px] text-slate-400">Genera un ticket directo para el panel de administración.</p>
          </div>
        </div>
        <button onclick="closeBugReportModal()" class="text-slate-400 hover:text-white p-1.5 transition min-h-[32px] min-w-[32px] flex items-center justify-center">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form onsubmit="submitBugReport(event)" class="space-y-3 text-xs">
        
        <!-- Campo Honeypot Oculto (Anti-Bots) -->
        <div class="hidden" aria-hidden="true" style="display:none !important;">
          <label>Website URL (do not fill)</label>
          <input type="text" id="bug-hp-website" name="website" tabindex="-1" autocomplete="off">
        </div>

        <!-- Categoría del problema -->
        <div>
          <label class="block text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Categoría</label>
          <select id="bug-type" class="w-full bg-wow-input border border-wow-border rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]">
            <option value="bug">🐛 Error en cálculo o stats</option>
            <option value="item">🛡️ Objeto, abalorio o encantamiento faltante / incorrecto</option>
            <option value="tooltip">🔍 Tooltip no encontrado o enlace roto</option>
            <option value="simc">📜 Error al importar SimC</option>
            <option value="suggestion">💡 Sugerencia o mejora</option>
            <option value="other">📝 Otro</option>
          </select>
        </div>

        <!-- Título -->
        <div>
          <label class="block text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Título o Resumen Breve *</label>
          <input type="text" id="bug-title" required maxlength="120" placeholder="Ej: El abalorio X no escala stats..." class="w-full bg-wow-input border border-wow-border rounded-xl px-3 sm:px-3.5 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 min-h-[38px]">
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Descripción Detallada *</label>
          <textarea id="bug-desc" required rows="3" maxlength="2000" placeholder="Describe qué ocurrió y pasos para reproducirlo..." class="w-full bg-wow-input border border-wow-border rounded-xl p-2.5 sm:p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 scrollbar-thin resize-none"></textarea>
        </div>

        <!-- Contacto opcional -->
        <div>
          <label class="block text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Tu Contacto / Discord / Email <span class="text-slate-500 font-normal">(Opcional)</span></label>
          <input type="text" id="bug-contact" maxlength="80" placeholder="Por si necesitamos más detalles (opcional)" class="w-full bg-wow-input border border-wow-border rounded-xl px-3 sm:px-3.5 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 min-h-[38px]">
        </div>

        <!-- Contexto del Sistema Detectado Automáticamente -->
        <div class="bg-black/40 border border-wow-border/80 rounded-xl p-2 sm:p-2.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 flex-wrap gap-1">
          <span class="flex items-center gap-1.5"><i class="fa-solid fa-laptop-code text-amber-400"></i> Contexto adjunto:</span>
          <span id="bug-env-meta" class="font-mono text-slate-300 font-bold truncate">Cargando...</span>
        </div>

        <!-- Verificación Anti-Bot / CAPTCHA Humano -->
        <div class="bg-amber-950/20 border border-amber-500/30 rounded-xl p-2.5 sm:p-3 space-y-2">
          <div class="flex items-center justify-between gap-2">
            <label class="font-bold text-amber-300 text-[10px] sm:text-[11px] flex items-center gap-1.5">
              <i class="fa-solid fa-shield-halved text-amber-400"></i> Verificación Anti-Spam:
            </label>
            <span id="bug-captcha-question" class="font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded-lg border border-amber-500/40 text-xs">Cargando...</span>
          </div>
          <div class="flex items-center gap-2">
            <input type="number" id="bug-captcha" required placeholder="Tu respuesta" class="w-full bg-wow-input border border-wow-border rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]">
            <button type="button" onclick="generateBugCaptcha()" title="Generar otro desafío" class="p-2 text-slate-400 hover:text-amber-400 transition bg-black/40 rounded-xl border border-wow-border min-h-[38px] min-w-[38px] flex items-center justify-center">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
        </div>

        <!-- Feedback de envío -->
        <div id="bug-submit-status" class="hidden text-xs font-semibold p-2.5 rounded-xl text-center"></div>

        <!-- Botones de Acción -->
        <div class="pt-2 border-t border-wow-border flex items-center justify-between gap-2">
          <button type="button" onclick="closeBugReportModal()" class="w-1/2 sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-transparent hover:bg-slate-800 transition min-h-[38px]">
            Cancelar
          </button>
          <button type="submit" id="bug-submit-btn" class="w-1/2 sm:w-auto px-4 sm:px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 shadow-lg transition flex items-center justify-center gap-1.5 min-h-[38px]">
            <i class="fa-solid fa-paper-plane"></i> Enviar Reporte
          </button>
        </div>

      </form>
    </div>
  </div>

  <!-- MODAL: USER GUIDE & FAQ (LANDING PAGE) -->
  <div id="help-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-wow-panel border border-wow-border rounded-xl max-w-2xl w-full max-h-[88vh] flex flex-col p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-wow-border pb-3 flex-shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded bg-amber-950/60 border border-amber-500 flex items-center justify-center text-amber-400">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-white" data-i18n="guideModalTitle">Optimizer User Guide</h3>
            <p class="text-xs text-slate-400" data-i18n="guideModalSubtitle">Step by step to optimize your gear, secondary stats, and vault rewards</p>
          </div>
        </div>
        <button onclick="closeHelpModal()" class="text-slate-400 hover:text-white">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-300 pr-1">
        <!-- Step 1: Install Simulationcraft Addon -->
        <div class="bg-black/40 p-3.5 rounded-lg border border-wow-border/60 space-y-2">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-amber-500 text-black font-black text-[11px] flex items-center justify-center shrink-0">1</span>
              <h4 class="font-bold text-amber-300 text-sm" data-i18n="guideStep1Title">Download & Install Simulationcraft Addon</h4>
            </div>
            <a href="https://www.curseforge.com/wow/addons/simulationcraft" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f16436]/20 hover:bg-[#f16436]/30 border border-[#f16436]/50 text-[#f16436] hover:text-white font-bold text-[11px] transition shadow-sm ml-auto">
              <i class="fa-solid fa-download text-[10px]"></i> <span data-i18n="guideStep1CurseBtn">CurseForge Addon</span> <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </div>
          <div class="text-slate-400 pl-7 space-y-1.5 leading-relaxed">
            <p data-i18n-html="guideStep1Intro">To export your character data, you need the official <strong class="text-white">Simulationcraft</strong> in-game addon:</p>
            <ol class="list-decimal list-inside space-y-1 text-slate-300">
              <li data-i18n-html="guideStep1Li1">Open the <strong class="text-amber-300">CurseForge App</strong>, search for <code class="text-amber-300 font-mono">Simulationcraft</code> and click <strong>Install</strong> (or download it from <a href="https://www.curseforge.com/wow/addons/simulationcraft" target="_blank" rel="noopener noreferrer" class="text-amber-400 underline hover:text-amber-300">CurseForge</a> and extract into <code class="text-slate-300 font-mono text-[11px]">_retail_\\Interface\\AddOns\\</code>).</li>
              <li data-i18n-html="guideStep1Li2">Log into World of Warcraft with your character, type <code class="text-amber-300 font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded border border-wow-border">/simc</code> in the chat box, and press <strong>Enter</strong>.</li>
              <li data-i18n-html="guideStep1Li3">A window will pop up displaying all your gear, bags, and Great Vault. Press <kbd class="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-white font-mono font-bold">Ctrl + C</kbd> to copy the text.</li>
            </ol>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="bg-black/40 p-3.5 rounded-lg border border-wow-border/60 space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-amber-500 text-black font-black text-[11px] flex items-center justify-center">2</span>
            <h4 class="font-bold text-amber-300 text-sm" data-i18n="guideStep2Title">Load your Gear & Bags</h4>
          </div>
          <p class="text-slate-400 pl-7" data-i18n-html="guideStep2Desc">
            Click <strong class="text-emerald-300"><i class="fa-solid fa-file-import"></i> Import SimC</strong> in the top menu and paste your copied text (<kbd class="bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-white font-mono text-[10px]">Ctrl + V</kbd>). The optimizer will automatically load your equipped items, bag gear, and weekly <strong class="text-yellow-300">Great Vault</strong> options.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="bg-black/40 p-3.5 rounded-lg border border-wow-border/60 space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-amber-500 text-black font-black text-[11px] flex items-center justify-center">3</span>
            <h4 class="font-bold text-amber-300 text-sm" data-i18n="guideStep3Title">Set Secondary Stat Targets</h4>
          </div>
          <p class="text-slate-400 pl-7" data-i18n-html="guideStep3Desc">
            Enter desired stat goals for <span class="text-purple-400 font-semibold">Mastery</span>, <span class="text-blue-400 font-semibold">Crit</span>, <span class="text-slate-300 font-semibold">Haste</span>, and <span class="text-emerald-400 font-semibold">Versatility</span>, or click any of the <strong class="text-amber-300">Recommended Presets</strong> from Wowhead / Archon to load them instantly.
          </p>
        </div>

        <!-- Step 4 -->
        <div class="bg-black/40 p-3.5 rounded-lg border border-wow-border/60 space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-amber-500 text-black font-black text-[11px] flex items-center justify-center">4</span>
            <h4 class="font-bold text-amber-300 text-sm" data-i18n="guideStep4Title">Calculate the Best Setup</h4>
          </div>
          <div class="text-slate-400 pl-7 space-y-2">
            <p data-i18n-html="guideStep4Intro">Click <strong class="text-amber-300">Calculate Best Setup</strong> to find the mathematically optimal combination among all available items.</p>
            <ul class="space-y-1 text-slate-400 list-disc list-inside">
              <li data-i18n-html="guideStep4Vault"><strong class="text-yellow-300"><i class="fa-solid fa-vault mr-1"></i>Great Vault</strong>: See exactly which item from your weekly vault yields the highest stat compliance.</li>
              <li data-i18n-html="guideStep4Lock"><strong class="text-amber-400"><i class="fa-solid fa-lock mr-1"></i>Lock Items</strong>: Click the padlock icon on any item to force it into the combination.</li>
              <li data-i18n-html="guideStep4Tier"><strong class="text-purple-300"><i class="fa-solid fa-layer-group mr-1"></i>Tier Set Bonus</strong>: Require 2P or 4P set bonuses.</li>
            </ul>
          </div>
        </div>

        <!-- Step 5 -->
        <div class="bg-black/40 p-3.5 rounded-lg border border-wow-border/60 space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-amber-500 text-black font-black text-[11px] flex items-center justify-center">5</span>
            <h4 class="font-bold text-amber-300 text-sm" data-i18n="guideStep5Title">Compare vs Equipped Gear</h4>
          </div>
          <p class="text-slate-400 pl-7" data-i18n-html="guideStep5Desc">
            Click <strong class="text-amber-300"><i class="fa-solid fa-code-compare"></i> Compare vs Equipped</strong> to see a piece-by-piece breakdown: which items to equip, which enchants to apply, and which smart gems to socket for your optimal setup.
          </p>
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="bg-black/40 p-3.5 rounded-lg border border-wow-border/60 space-y-1.5">
          <h4 class="font-bold text-slate-300 flex items-center gap-1.5"><i class="fa-solid fa-keyboard text-amber-400"></i> <span data-i18n="guideShortcutsTitle">Keyboard Shortcuts</span></h4>
          <div class="flex flex-wrap items-center gap-3 pt-1 pl-2 text-slate-400">
            <span><kbd class="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white font-mono font-bold">Ctrl + Enter</kbd> <span data-i18n="guideRunShortcut">Run Optimizer</span></span>
            <span><kbd class="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white font-mono font-bold">Ctrl + K</kbd> <span data-i18n="guideSearchShortcut">Search Inventory</span></span>
            <span><kbd class="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white font-mono font-bold">Esc</kbd> <span data-i18n="guideCloseShortcut">Close Modal</span></span>
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-wow-border flex items-center justify-between flex-shrink-0 gap-2">
        <button type="button" onclick="closeHelpModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-transparent hover:bg-slate-800 transition min-h-[38px]" data-i18n="closeModal">
          Cerrar
        </button>
        <a href="gearsim" class="px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 transition shadow-lg shadow-amber-950/40 flex items-center gap-2 min-h-[38px]">
          <span data-i18n="guideGoToOptimizer">Ir al Optimizador</span> <i class="fa-solid fa-arrow-right text-xs"></i>
        </a>
      </div>
    </div>
  </div>
  `;

  function mountFooter() {
    // Si la página tiene un contenedor designado #app-footer-container, o si no al final de body
    let target = document.getElementById('app-footer-container');
    if (!target) {
      target = document.createElement('div');
      target.id = 'app-footer-container';
      document.body.appendChild(target);
    }
    target.innerHTML = FOOTER_HTML;
    
    // Si la página tiene el sistema de traducción activo, aplicarlo
    if (typeof updateLanguageUI === 'function') {
      try { updateLanguageUI(); } catch (e) {}
    }
    if (typeof openCookieConsent === 'function') {
      try { openCookieConsent(); } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter);
  } else {
    mountFooter();
  }
})();

// Manejadores Globales para los Modales del Pie de Página (Privacy, Terms, Contact, Cookies)
function openPrivacyModal() {
  const m = document.getElementById('privacy-modal');
  if (m) m.classList.remove('hidden');
}
function closePrivacyModal() {
  const m = document.getElementById('privacy-modal');
  if (m) m.classList.add('hidden');
}
function openTermsModal() {
  const m = document.getElementById('terms-modal');
  if (m) m.classList.remove('hidden');
}
function closeTermsModal() {
  const m = document.getElementById('terms-modal');
  if (m) m.classList.add('hidden');
}
function openContactModal() {
  const m = document.getElementById('contact-modal');
  if (m) m.classList.remove('hidden');
}
function closeContactModal() {
  const m = document.getElementById('contact-modal');
  if (m) m.classList.add('hidden');
}
function openCookieConsent(forceOpen = false) {
  const banner = document.getElementById('cookie-consent-banner');
  if (!banner) return;
  if (forceOpen || !localStorage.getItem('wowopt_cookie_consent')) {
    banner.classList.remove('hidden');
  }
}
function acceptCookieConsent() {
  localStorage.setItem('wowopt_cookie_consent', 'accepted');
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) banner.classList.add('hidden');
}

function openHelpModal() {
  const m = document.getElementById('help-modal');
  if (m) m.classList.remove('hidden');
}
function closeHelpModal() {
  const m = document.getElementById('help-modal');
  if (m) m.classList.add('hidden');
}

// Cierre accesible con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePrivacyModal();
    closeTermsModal();
    closeContactModal();
    closeHelpModal();
    if (typeof closeBugReportModal === 'function') closeBugReportModal();
  }
});


