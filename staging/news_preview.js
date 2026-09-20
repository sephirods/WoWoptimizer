let currentLang = 'es';
let activeTab = 'wowhead'; // 'wowhead' o 'blizzard'
let newsData = [];

// Base CDN de Blizzard / Wowhead para iconos
const WOW_ICON_BASE = 'https://wow.zamimg.com/images/wow/icons/large/';

function loadCurrentTab() {
  if (activeTab === 'wowhead') {
    newsData = window.STAGING_NEWS_DATA || [];
  } else {
    newsData = window.STAGING_BLIZZARD_DATA || [];
  }
  renderCards();
}

async function loadStagingNews() {
  loadCurrentTab();
}

function renderCards() {
  const grid = document.getElementById('news-grid');
  grid.innerHTML = '';

  newsData.forEach(item => {
    const title = item.title[currentLang] || item.title.en;
    const summary = item.summary[currentLang] || item.summary.en;

    // Renderizar iconos detectados
    let iconsHtml = '';
    if (item.icons && item.icons.length > 0) {
      iconsHtml = `
        <div class="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
          <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mr-1">Iconos:</span>
          ${item.icons.map(ic => `
            <img src="${WOW_ICON_BASE}${ic}.jpg" 
                 alt="${ic}" 
                 title="${ic}" 
                 class="wow-icon w-7 h-7 object-cover rounded" 
                 loading="lazy"
                 onerror="this.style.display='none'" />
          `).join('')}
        </div>
      `;
    }

    const card = document.createElement('article');
    card.className = 'bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-lg flex flex-col transition duration-300 hover:-translate-y-1 cursor-pointer';
    card.onclick = () => openNewsModal(item);
    card.innerHTML = `
      <!-- Portada -->
      <div class="relative h-44 bg-slate-950 overflow-hidden">
        ${item.imageUrl ? `
          <img src="${item.imageUrl}" alt="${title}" class="w-full h-full object-cover hover:scale-105 transition duration-500" loading="lazy" />
        ` : `
          <div class="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
            <i class="fa-solid fa-image text-3xl"></i>
          </div>
        `}
        <span class="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-amber-500/40 rounded-lg text-amber-300 text-xs font-bold uppercase">
          ${item.category || 'Live'}
        </span>
      </div>

      <!-- Cuerpo -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span class="text-xs text-slate-500">${item.dateRaw || 'Reciente'}</span>
          <h2 class="text-base font-bold text-white mt-1 hover:text-amber-400 transition leading-snug">
            ${title}
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            ${summary}
          </p>
        </div>

        <div>
          ${iconsHtml}
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span class="text-xs font-semibold text-amber-400 flex items-center gap-1">
              Leer noticia completa <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
            <span class="text-[11px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">ID: ${item.id}</span>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openNewsModal(item) {
  const modal = document.getElementById('news-modal');
  const title = item.title[currentLang] || item.title.en;

  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-category').innerText = item.category || 'Live';
  document.getElementById('modal-date').innerText = item.dateRaw || '';
  document.getElementById('modal-source-link').href = (currentLang === 'es' && item.originalUrlEs) ? item.originalUrlEs : (item.originalUrl || '#');

  const imgEl = document.getElementById('modal-image');
  const imgContainer = document.getElementById('modal-image-container');
  if (item.imageUrl) {
    imgEl.src = item.imageUrl;
    imgContainer.classList.remove('hidden');
  } else {
    imgContainer.classList.add('hidden');
  }

  // Contenido HTML real extraído del artículo (con soporte bilingüe EN/ES)
  const contentEl = document.getElementById('modal-content');
  const rawHtml = (item.contentHtml && typeof item.contentHtml === 'object')
    ? (item.contentHtml[currentLang] || item.contentHtml.en || '')
    : (item.contentHtml || '');

  contentEl.innerHTML = rawHtml || `<p>${item.summary[currentLang] || item.summary.en}</p>`;

  modal.classList.remove('hidden');

  // Forzar que el motor de Wowhead pinte iconos automáticos y active tooltips al pasar el ratón
  if (window.$Wh && window.$Wh.Tooltips) {
    window.$Wh.Tooltips.init();
  } else if (window.WH && window.WH.Tooltips) {
    window.WH.Tooltips.init();
  }
}

document.getElementById('close-modal-btn').addEventListener('click', () => {
  document.getElementById('news-modal').classList.add('hidden');
});

// Cerrar con Escape o click fuera
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.getElementById('news-modal').classList.add('hidden');
});
document.getElementById('news-modal').addEventListener('click', (e) => {
  if (e.target.id === 'news-modal') document.getElementById('news-modal').classList.add('hidden');
});

// Event Listeners para Pestañas
const tabWh = document.getElementById('tab-wowhead');
const tabBlizz = document.getElementById('tab-blizzard');

if (tabWh && tabBlizz) {
  tabWh.addEventListener('click', () => {
    activeTab = 'wowhead';
    tabWh.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow';
    tabBlizz.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition text-slate-400 hover:text-white flex items-center gap-1.5';
    loadCurrentTab();
  });

  tabBlizz.addEventListener('click', () => {
    activeTab = 'blizzard';
    tabBlizz.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition bg-sky-500 text-slate-950 flex items-center gap-1.5 shadow';
    tabWh.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition text-slate-400 hover:text-white flex items-center gap-1.5';
    loadCurrentTab();
  });
}

// Event Listeners
document.getElementById('lang-btn').addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  document.getElementById('lang-text').innerText = currentLang.toUpperCase();
  renderCards();
});

document.getElementById('reload-btn').addEventListener('click', loadStagingNews);

// Cargar al inicio
loadStagingNews();
