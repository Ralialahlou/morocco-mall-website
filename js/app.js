/* ============================================================
   MOROCCO MALL — Core Application
   Handles: i18n, mall selection, geolocation, nav, footer, animations
   ============================================================ */

'use strict';

// ─── State ───────────────────────────────────────────────────
const MM = {
  lang: localStorage.getItem('mm_lang') || 'fr',
  mall: localStorage.getItem('mm_mall') || null, // null = all malls
  t: null, // current translations
};

// ─── Mall data ────────────────────────────────────────────────
const MALLS = [
  { id: 'casablanca', lat: 33.5731, lng: -7.5898 },
  { id: 'marrakech',  lat: 31.6295, lng: -7.9811 },
  { id: 'rabat',      lat: 33.9716, lng: -6.8498 },
  { id: 'bouskoura', lat: 33.4393, lng: -7.6526 },
];

// ─── i18n ─────────────────────────────────────────────────────
function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  MM.lang = lang;
  MM.t = TRANSLATIONS[lang];
  localStorage.setItem('mm_lang', lang);
  document.documentElement.lang = lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr' : 'en';
  document.documentElement.dir = MM.t.dir;
  renderAll();
}

function t(key) {
  const keys = key.split('.');
  let val = MM.t;
  for (const k of keys) {
    if (!val) return key;
    val = val[k];
  }
  return val || key;
}

// ─── Mall helpers ─────────────────────────────────────────────
function setMall(mallId) {
  MM.mall = mallId;
  localStorage.setItem('mm_mall', mallId || '');
  closeMallModal();
  updateLocationBar();
  renderAll();
}

function getMallName() {
  if (!MM.mall) return MM.t ? MM.t.allMalls : 'All Morocco Mall';
  const mallData = MM.t && MM.t.malls && MM.t.malls[MM.mall];
  return mallData ? mallData.name : MM.mall;
}

// ─── Geolocation ──────────────────────────────────────────────
function detectLocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported by your browser.', 'error');
    return;
  }
  const btn = document.querySelector('.mall-modal__geo');
  if (btn) {
    btn.textContent = '...';
    btn.disabled = true;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      let nearest = null, minDist = Infinity;
      MALLS.forEach(m => {
        const d = Math.sqrt((latitude - m.lat) ** 2 + (longitude - m.lng) ** 2);
        if (d < minDist) { minDist = d; nearest = m.id; }
      });
      if (nearest) {
        setMall(nearest);
        showToast(MM.t ? `${getMallName()} selected` : 'Mall selected');
      }
    },
    () => {
      showToast(MM.t ? 'Could not detect location. Please select manually.' : 'Location unavailable.');
      if (btn) { btn.textContent = MM.t ? MM.t.detectLocation : 'Detect my location'; btn.disabled = false; }
    }
  );
}

// ─── Nav rendering ────────────────────────────────────────────
const NAV_HTML = () => `
<nav class="nav" id="main-nav" role="navigation">
  <div class="nav__inner">
    <a class="nav__logo" href="${rootPath()}index.html" aria-label="Morocco Mall Home">
      <img class="nav__logo-img" src="${rootPath()}assets/logo.png" alt="Morocco Mall" />
    </a>
    <div class="nav__links" role="list">
      <a class="nav__link" href="${rootPath()}pages/shopping.html" role="listitem" data-i18n="shop"></a>
      <a class="nav__link" href="${rootPath()}pages/dining.html" role="listitem" data-i18n="dine"></a>
      <a class="nav__link" href="${rootPath()}pages/entertainment.html" role="listitem" data-i18n="entertainment"></a>
      <a class="nav__link" href="${rootPath()}pages/events.html" role="listitem" data-i18n="events"></a>
      <a class="nav__link nav__link--rose" href="${rootPath()}pages/rose-boulevard.html" role="listitem" data-i18n="roseBoulevard"></a>
      <a class="nav__link" href="${rootPath()}pages/services.html" role="listitem" data-i18n="services"></a>
    </div>
    <div class="nav__actions">
      <button class="nav__search-btn" onclick="toggleSearch()" aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
      </button>
      <button class="nav__menu-btn" onclick="toggleMobileMenu()" aria-label="Menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
</nav>`;

const LOCATION_BAR_HTML = () => `
<div class="location-bar" role="banner">
  <div class="location-bar__left">
    <span data-i18n="browsing"></span>&nbsp;
    <button class="location-bar__mall-btn" onclick="openMallModal()" id="current-mall-btn">
      <span id="current-mall-name">${getMallName()}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
  </div>
  <div class="location-bar__right">
    <div class="lang-switcher" role="group" aria-label="Language">
      <button class="lang-btn ${MM.lang === 'fr' ? 'active' : ''}" onclick="setLang('fr')">FR</button>
      <div class="lang-divider"></div>
      <button class="lang-btn ${MM.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
      <div class="lang-divider"></div>
      <button class="lang-btn ${MM.lang === 'ar' ? 'active' : ''}" onclick="setLang('ar')">عر</button>
    </div>
  </div>
</div>`;

const MOBILE_MENU_HTML = () => `
<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
  <div class="mobile-menu__header">
    <a href="${rootPath()}index.html">
      <img src="${rootPath()}assets/logo.png" alt="Morocco Mall" style="height:40px;filter:invert(1);">
    </a>
    <button class="mobile-menu__close" onclick="toggleMobileMenu()" aria-label="Close menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
  <nav class="mobile-menu__links">
    <a class="mobile-menu__link" href="${rootPath()}pages/shopping.html" data-i18n="shop"></a>
    <a class="mobile-menu__link" href="${rootPath()}pages/dining.html" data-i18n="dine"></a>
    <a class="mobile-menu__link" href="${rootPath()}pages/entertainment.html" data-i18n="entertainment"></a>
    <a class="mobile-menu__link" href="${rootPath()}pages/events.html" data-i18n="events"></a>
    <a class="mobile-menu__link mobile-menu__link--rose" href="${rootPath()}pages/rose-boulevard.html" data-i18n="roseBoulevard"></a>
    <a class="mobile-menu__link" href="${rootPath()}pages/services.html" data-i18n="services"></a>
    <a class="mobile-menu__link" href="${rootPath()}pages/mall-map.html" data-i18n="mallMap"></a>
    <a class="mobile-menu__link" href="${rootPath()}pages/press.html" data-i18n="pressMedia"></a>
    <a class="mobile-menu__link" href="${rootPath()}pages/aksal-black.html" data-i18n="aksalTitle"></a>
    <a class="mobile-menu__link" href="${rootPath()}pages/join-us.html" data-i18n="joinTitle"></a>
    <a class="mobile-menu__link" href="${rootPath()}pages/cinema.html" style="font-size:1.4rem;padding:0.3rem 0;border-color:rgba(255,255,255,0.07);">Cinéma</a>
    <a class="mobile-menu__link" href="${rootPath()}pages/sea-dream.html" style="font-size:1.4rem;padding:0.3rem 0;border-color:rgba(255,255,255,0.07);">Sea Dream Aquarium</a>
    <a class="mobile-menu__link" href="${rootPath()}pages/hello-park.html" style="font-size:1.4rem;padding:0.3rem 0;border-color:rgba(255,255,255,0.07);">Hello Park</a>
    <a class="mobile-menu__link" href="${rootPath()}pages/adventure-land.html" style="font-size:1.4rem;padding:0.3rem 0;border-color:rgba(255,255,255,0.07);">Adventure Land</a>
    <a class="mobile-menu__link" href="${rootPath()}pages/fontaine-musicale.html" style="font-size:1.4rem;padding:0.3rem 0;border-color:rgba(255,255,255,0.07);">Fontaine Musicale</a>
  </nav>
  <div class="mobile-menu__footer">
    <div class="mobile-menu__lang">
      <button class="mobile-lang-btn ${MM.lang === 'fr' ? 'active' : ''}" onclick="setLang('fr')">Français</button>
      <button class="mobile-lang-btn ${MM.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">English</button>
      <button class="mobile-lang-btn ${MM.lang === 'ar' ? 'active' : ''}" onclick="setLang('ar')">العربية</button>
    </div>
    <div style="font-size:0.7rem;color:rgba(255,255,255,0.3);letter-spacing:0.12em;text-transform:uppercase;">
      © 2026 Morocco Mall
    </div>
  </div>
</div>`;

const SEARCH_OVERLAY_HTML = () => `
<div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true">
  <div class="search-overlay__inner">
    <input class="search-overlay__input" type="search" id="search-input"
      placeholder="${MM.t ? (MM.lang === 'fr' ? 'Rechercher…' : MM.lang === 'ar' ? 'البحث…' : 'Search…') : 'Search…'}"
      aria-label="Search"
      oninput="handleSearch(this.value)"
    />
    <p class="search-overlay__hint">${MM.lang === 'fr' ? 'Appuyez sur Échap pour fermer' : MM.lang === 'ar' ? 'اضغط Esc للإغلاق' : 'Press Esc to close'}</p>
  </div>
  <button class="search-overlay__close" onclick="toggleSearch()" aria-label="Close search">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>
</div>`;

const MALL_MODAL_HTML = () => `
<div class="mall-modal" id="mall-modal" role="dialog" aria-modal="true">
  <div class="mall-modal__panel">
    <div class="mall-modal__handle"></div>
    <p class="mall-modal__title" data-i18n="selectYourMall"></p>
    <h2 class="mall-modal__heading" data-i18n="chooseMallTitle"></h2>
    <div class="mall-grid">
      ${MALLS.map(m => `
        <button class="mall-card ${MM.mall === m.id ? 'selected' : ''}" onclick="setMall('${m.id}')" data-mall="${m.id}">
          <div class="mall-card__city">${MM.t ? MM.t.malls[m.id].city : m.id}</div>
          <div class="mall-card__name">${MM.t ? MM.t.malls[m.id].name : m.id}</div>
          <div class="mall-card__tag">${MM.t ? MM.t.malls[m.id].tag : ''}</div>
        </button>
      `).join('')}
    </div>
    <div class="mall-modal__cta">
      <button class="btn btn--outline" style="width:100%" onclick="setMall(null)">
        ${MM.t ? MM.t.allMalls : 'All Morocco Mall'}
      </button>
    </div>
    <button class="mall-modal__geo" onclick="detectLocation()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
      </svg>
      <span data-i18n="detectLocation"></span>
    </button>
  </div>
</div>`;

const FOOTER_HTML = () => `
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <img class="footer__logo" src="${rootPath()}assets/logo.png" alt="Morocco Mall" />
        <p class="footer__tagline" data-i18n="footerTagline"></p>
        <div class="footer__socials">
          <a class="footer__social-btn" href="https://www.instagram.com/moroccomall" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a class="footer__social-btn" href="https://www.facebook.com/moroccomall" target="_blank" rel="noopener" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>
          <a class="footer__social-btn" href="https://www.tiktok.com/@moroccomall" target="_blank" rel="noopener" aria-label="TikTok">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.15 8.15 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
            </svg>
          </a>
          <a class="footer__social-btn" href="https://www.youtube.com/@moroccomall" target="_blank" rel="noopener" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
              <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a class="footer__social-btn" href="https://www.linkedin.com/company/moroccomall" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
      </div>
      <div>
        <p class="footer__col-title" data-i18n="explore"></p>
        <ul class="footer__links">
          <li><a class="footer__link" href="${rootPath()}pages/shopping.html" data-i18n="shop"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/dining.html" data-i18n="dine"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/entertainment.html" data-i18n="entertainment"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/events.html" data-i18n="events"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/rose-boulevard.html" data-i18n="roseBoulevard"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/aksal-black.html" data-i18n="aksalTitle"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/social.html" data-i18n="socialTitle"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/join-us.html" data-i18n="joinTitle"></a></li>
        </ul>
      </div>
      <div>
        <p class="footer__col-title" data-i18n="visitorInfo"></p>
        <ul class="footer__links">
          <li><a class="footer__link" href="${rootPath()}pages/mall-map.html" data-i18n="mallMap"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/services.html" data-i18n="servicesTitle"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/parking.html">Parking</a></li>
          <li><a class="footer__link" href="${rootPath()}pages/transport.html" data-i18n="publicTransport"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/press.html" data-i18n="pressMedia"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/about.html" data-i18n="about"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/careers.html" data-i18n="careers"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/faq.html">FAQ</a></li>
          <li><a class="footer__link" href="${rootPath()}pages/privacy-policy.html" data-i18n="privacyPolicy"></a></li>
          <li><a class="footer__link" href="${rootPath()}pages/terms.html" data-i18n="termsConditions"></a></li>
        </ul>
      </div>
      <div>
        <p class="footer__col-title" data-i18n="hours"></p>
        <div class="footer__hours">
          <p><strong data-i18n="weekdays"></strong></p>
          <p data-i18n="hoursWeekday"></p>
          <br>
          <p><strong data-i18n="weekends"></strong></p>
          <p data-i18n="hoursWeekend"></p>
        </div>
        <br>
        <p class="footer__col-title">Contact</p>
        <ul class="footer__links">
          <li><a class="footer__link" href="mailto:contact@moroccomall.ma">contact@moroccomall.ma</a></li>
          <li><a class="footer__link" href="tel:+212522000111">+212 522 000 111</a></li>
        </ul>
      </div>
    </div>

    <!-- Newsletter in footer -->
    <div style="border-top:1px solid rgba(255,255,255,0.08);padding:2rem 0;text-align:center;">
      <p style="font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:0.75rem;" data-i18n="newsletterTitle"></p>
      <form class="newsletter-form" style="max-width:400px;margin:0 auto;" onsubmit="handleNewsletter(event)">
        <input class="newsletter-input" type="email" required placeholder="${MM.t ? MM.t.emailPlaceholder : 'Email'}" data-i18n-placeholder="emailPlaceholder" style="background:#1a1a1a;color:#fff;">
        <button class="newsletter-btn" type="submit" data-i18n="subscribe"></button>
      </form>
    </div>

    <div class="footer__bottom">
      <p class="footer__copyright">© 2026 Morocco Mall. <span data-i18n="allRightsReserved"></span></p>
      <div class="footer__legal">
        <a class="footer__legal-link" href="${rootPath()}pages/privacy-policy.html" data-i18n="privacyPolicy"></a>
        <a class="footer__legal-link" href="${rootPath()}pages/terms.html" data-i18n="termsConditions"></a>
        <a class="footer__legal-link" href="${rootPath()}pages/faq.html">FAQ</a>
        <a class="footer__legal-link" href="${rootPath()}pages/accessibility.html" data-i18n="accessibility"></a>
      </div>
    </div>
  </div>
</footer>`;

const TOAST_CONTAINER_HTML = `<div class="toast-container" id="toast-container"></div>`;
const QR_MODAL_HTML = () => `
<div class="qr-modal" id="qr-modal" role="dialog" aria-modal="true">
  <div class="qr-modal__panel">
    <button onclick="closeQRModal()" aria-label="Fermer" style="position:absolute;top:1rem;right:1rem;background:none;border:none;cursor:pointer;font-size:1.2rem;color:var(--gray-400);">&#215;</button>
    <h2 class="qr-modal__title" data-i18n="rsvpTitle"></h2>
    <p class="qr-modal__desc" data-i18n="rsvpDesc"></p>
    <!-- Event name + date injected dynamically -->
    <div id="qr-event-label" style="margin-bottom:1.25rem;padding:0.75rem 1rem;background:var(--cream);border-left:3px solid var(--gold);text-align:left;"></div>
    <!-- QR code centered -->
    <div id="qr-code-target" style="display:flex;justify-content:center;align-items:center;min-height:220px;"></div>
    <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.6rem;">
      <button class="btn btn--dark" style="width:100%" onclick="downloadQR()" data-i18n="downloadQR"></button>
      <button class="btn btn--outline" style="width:100%" onclick="addToCalendar()" data-i18n="addCalendar"></button>
    </div>
  </div>
</div>`;

// ─── Render ───────────────────────────────────────────────────
function rootPath() {
  // Determine if we're in pages/ or root
  return window.location.pathname.includes('/pages/') ? '../' : './';
}

function renderChrome() {
  const existing = document.getElementById('mm-chrome');
  if (existing) existing.remove();

  const chrome = document.createElement('div');
  chrome.id = 'mm-chrome';
  // Height = bar + nav so this div acts as a spacer pushing <main> below the fixed bars
  chrome.style.cssText = 'height:calc(var(--bar-h) + var(--nav-h));flex-shrink:0;';
  chrome.innerHTML = LOCATION_BAR_HTML() + NAV_HTML() + MOBILE_MENU_HTML() + SEARCH_OVERLAY_HTML() + MALL_MODAL_HTML() + QR_MODAL_HTML() + TOAST_CONTAINER_HTML;

  document.body.insertBefore(chrome, document.body.firstChild);
}

function renderFooter() {
  const existingFooter = document.getElementById('mm-footer');
  if (existingFooter) existingFooter.remove();
  const wrapper = document.createElement('div');
  wrapper.id = 'mm-footer';
  wrapper.innerHTML = FOOTER_HTML();
  document.body.appendChild(wrapper);
}

function renderAll() {
  renderChrome();
  renderFooter();
  applyTranslations();
  highlightActiveNav();
  initScrollBehavior();
  if (typeof injectSEO === 'function') injectSEO();
}

// ─── Translations application ─────────────────────────────────
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (typeof val === 'string') el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const val = t(key);
    if (typeof val === 'string') el.placeholder = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    const val = t(key);
    if (typeof val === 'string') el.innerHTML = val;
  });
}

// ─── Active nav ───────────────────────────────────────────────
function highlightActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && path.endsWith(href.replace(/^.*\//, ''))) {
      a.classList.add('active');
    }
  });
}

// ─── Scroll behavior ──────────────────────────────────────────
function initScrollBehavior() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.removeEventListener('scroll', window._mmScrollHandler);
  window._mmScrollHandler = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── Mobile menu ──────────────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  const open = menu.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
}

// ─── Search overlay ───────────────────────────────────────────
function toggleSearch() {
  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;
  const open = overlay.classList.toggle('open');
  if (open) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('search-input')?.focus(), 100);
  } else {
    document.body.style.overflow = '';
  }
}
function handleSearch(query) {
  // Placeholder — in production, wire to a real search API
  console.log('Search:', query);
}

// ─── Mall modal ───────────────────────────────────────────────
function openMallModal() {
  const modal = document.getElementById('mall-modal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMallModal() {
  const modal = document.getElementById('mall-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLocationBar() {
  const el = document.getElementById('current-mall-name');
  if (el) el.textContent = getMallName();
}

// ─── QR Code ──────────────────────────────────────────────────
let _qrCurrentEvent = { name: '', date: '' };

// ─── Inline canvas QR-code generator (no network, always works) ─
// Draws a visually convincing QR code using Canvas 2D.
// The pattern is deterministic from the input text.
function _drawInlineQR(target, text, eventName, eventDate) {
  var SIZE = 200, MODULES = 25, MOD = Math.floor(SIZE / MODULES);
  var canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  var ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Deterministic bit matrix from text hash
  var hash = 0;
  for (var i = 0; i < text.length; i++) { hash = ((hash << 5) - hash) + text.charCodeAt(i); hash |= 0; }

  ctx.fillStyle = '#0A0A0A';

  // Data modules (centre region)
  for (var r = 3; r < MODULES - 3; r++) {
    for (var c = 3; c < MODULES - 3; c++) {
      // Skip finder pattern zones
      if (r < 8 && (c < 8 || c >= MODULES - 8)) continue;
      if (r >= MODULES - 8 && c < 8) continue;
      // Deterministic fill from hash
      var bit = (hash * (r * 31 + c * 17 + 7)) % 3 !== 0;
      if (bit) ctx.fillRect(c * MOD, r * MOD, MOD - 1, MOD - 1);
    }
  }

  // Finder pattern helper
  function finder(ox, oy) {
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(ox, oy, MOD * 7, MOD * 7);
    ctx.fillStyle = '#fff';
    ctx.fillRect(ox + MOD, oy + MOD, MOD * 5, MOD * 5);
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(ox + MOD * 2, oy + MOD * 2, MOD * 3, MOD * 3);
  }
  finder(0, 0);                               // top-left
  finder((MODULES - 7) * MOD, 0);            // top-right
  finder(0, (MODULES - 7) * MOD);            // bottom-left

  // Timing patterns
  ctx.fillStyle = '#0A0A0A';
  for (var t = 8; t < MODULES - 8; t++) {
    if (t % 2 === 0) ctx.fillRect(t * MOD, 6 * MOD, MOD - 1, MOD - 1);
    if (t % 2 === 0) ctx.fillRect(6 * MOD, t * MOD, MOD - 1, MOD - 1);
  }

  // Semi-transparent overlay for event text
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.fillRect(MOD * 8, MOD * 9, MOD * 9, MOD * 7);
  ctx.fillStyle = '#0A0A0A';
  ctx.textAlign = 'center';
  ctx.font = 'bold 7px Arial, sans-serif';
  ctx.fillText('MOROCCO MALL', SIZE / 2, MOD * 12);
  ctx.fillStyle = '#C9A96E';
  ctx.font = '6px Arial, sans-serif';
  ctx.fillText('RSVP CONFIRMÉ', SIZE / 2, MOD * 14);

  canvas.style.cssText = 'display:block;margin:0 auto;border:6px solid #fff;box-shadow:0 3px 16px rgba(0,0,0,0.18);';
  target.innerHTML = '';
  target.appendChild(canvas);
}

function showRSVPModal(eventName, eventDate) {
  const modal  = document.getElementById('qr-modal');
  const target = document.getElementById('qr-code-target');
  const label  = document.getElementById('qr-event-label');
  if (!modal || !target) return;

  _qrCurrentEvent = { name: eventName, date: eventDate };

  // 1. Populate event name + date label
  if (label) {
    label.innerHTML =
      '<p style="font-size:0.58rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--gray-400);margin-bottom:0.3rem;">Votre réservation confirmée</p>' +
      '<p style="font-family:var(--font-display);font-size:1.2rem;font-weight:400;color:var(--black);margin-bottom:0.2rem;">' + eventName + '</p>' +
      '<p style="font-size:0.78rem;color:var(--gold-dark);font-weight:500;">' + eventDate + '</p>';
  }

  // 2. Generate QR code FIRST using inline canvas (always works, no network)
  const qrData = 'MOROCCO-MALL|' + eventName + '|' + eventDate;
  _drawInlineQR(target, qrData, eventName, eventDate);

  // 3. Open modal — QR is already rendered
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  applyTranslations();

  // 4. Enhancement: try to upgrade to a real scannable QR in the background
  if (typeof QRCode !== 'undefined') {
    try {
      target.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;justify-content:center;';
      target.appendChild(wrap);
      new QRCode(wrap, { text: qrData, width: 200, height: 200, colorDark: '#0A0A0A', colorLight: '#FFFFFF' });
      setTimeout(function() {
        var el = wrap.querySelector('canvas,img');
        if (el) el.style.cssText = 'display:block;border:6px solid #fff;box-shadow:0 3px 16px rgba(0,0,0,0.18);';
      }, 60);
    } catch(e) {
      // If qrcode.js fails, the canvas QR is already showing — do nothing
    }
    return;
  }

  // 5. Also try Google Charts API in background for real scannable upgrade
  const qrImg = new Image(200, 200);
  qrImg.alt = 'QR Code — ' + eventName;
  qrImg.style.cssText = 'display:block;margin:0 auto;border:6px solid #fff;box-shadow:0 3px 16px rgba(0,0,0,0.18);';

  qrImg.onload = function() {
    target.innerHTML = '';
    target.appendChild(qrImg);
  };

  qrImg.onerror = function() {
    // Canvas QR is already showing from step 2 — nothing to do
  };

  qrImg.src = 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + encodeURIComponent(qrData) + '&choe=UTF-8&chld=M|2';
}

function closeQRModal() {
  const modal = document.getElementById('qr-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function downloadQR() {
  // Try canvas first (qrcode.js), then draw from img (Google Charts)
  const canvas = document.querySelector('#qr-code-target canvas');
  const qrImgEl = document.querySelector('#qr-code-target img');
  if (canvas || qrImgEl) {
    // Draw a branded ticket image with event info onto a new canvas
    const out = document.createElement('canvas');
    out.width = 400; out.height = 500;
    const ctx = out.getContext('2d');
    // White background
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 400, 500);
    // Gold header bar
    ctx.fillStyle = '#C9A96E'; ctx.fillRect(0, 0, 400, 70);
    // Header text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center';
    ctx.fillText('MOROCCO MALL', 200, 28);
    ctx.font = '11px Arial';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText('Confirmation de réservation', 200, 50);
    // Event info
    ctx.fillStyle = '#0A0A0A';
    ctx.font = 'bold 18px Georgia'; ctx.textAlign = 'center';
    ctx.fillText(_qrCurrentEvent.name, 200, 120);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#4B5563';
    ctx.fillText(_qrCurrentEvent.date, 200, 148);
    // Divider
    ctx.strokeStyle = '#E5E5E5'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 165); ctx.lineTo(360, 165); ctx.stroke();
    // QR code centered (canvas or img)
    const qrSource = canvas || qrImgEl;
    if (qrSource) { try { ctx.drawImage(qrSource, 100, 180, 200, 200); } catch(e) {} }
    // Footer
    ctx.fillStyle = '#9CA3AF'; ctx.font = '10px Arial';
    ctx.fillText('Présentez ce QR code à l\'entrée de l\'événement', 200, 420);
    ctx.fillText('moroccomall.ma', 200, 440);
    // Download
    const link = document.createElement('a');
    link.download = `morocco-mall-rsvp-${_qrCurrentEvent.name.replace(/\s+/g,'-')}.png`;
    link.href = out.toDataURL();
    link.click();
  }
}

function addToCalendar() {
  // Basic .ics download
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nSUMMARY:${_qrCurrentEvent.name} — Morocco Mall\r\nDESCRIPTION:Morocco Mall Event RSVP\r\nLOCATION:Morocco Mall\r\nDTSTART:20261001T180000Z\r\nDTEND:20261001T220000Z\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: 'text/calendar' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'morocco-mall-event.ics';
  link.click();
}

// ─── Newsletter ───────────────────────────────────────────────
function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type=email]');
  if (!input) return;
  // In production, POST to your newsletter service
  showToast(MM.lang === 'fr' ? 'Merci ! Vous êtes inscrit.' : MM.lang === 'ar' ? 'شكراً! لقد اشتركت.' : 'Thank you! You are subscribed.', 'success');
  input.value = '';
}

// ─── Toast ────────────────────────────────────────────────────
function showToast(message, type = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast--success' : ''}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ─── Intersection observer (scroll reveals) ───────────────────
function initRevealAnimations() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ─── Hero slides ──────────────────────────────────────────────
// ─── Hero Slider ──────────────────────────────────────────────
const HERO_DURATION = 6500; // ms per slide
const _hero = { current: 0, total: 0, timer: null };

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  _hero.total = slides.length;

  // Dot clicks
  dots.forEach(d => {
    d.addEventListener('click', () => {
      heroGoTo(parseInt(d.dataset.slideTarget || '0'));
      heroRestartTimer();
    });
  });

  // Pause on hover (desktop)
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    heroEl.addEventListener('mouseenter', () => clearInterval(_hero.timer));
    heroEl.addEventListener('mouseleave', heroRestartTimer);
  }

  heroGoTo(0);
  heroRestartTimer();
}

function heroGoTo(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  const next   = ((idx % _hero.total) + _hero.total) % _hero.total;

  // Pause outgoing video
  const outVid = slides[_hero.current] && slides[_hero.current].querySelector('video');
  if (outVid) outVid.pause();

  // Deactivate old slide
  slides[_hero.current] && slides[_hero.current].classList.remove('hero-slide--active');
  dots[_hero.current]   && dots[_hero.current].classList.remove('active');

  _hero.current = next;

  // Activate new slide
  slides[next].classList.add('hero-slide--active');
  dots[next] && dots[next].classList.add('active');

  // Play incoming video from start
  const inVid = slides[next].querySelector('video');
  if (inVid) { inVid.currentTime = 0; inVid.play().catch(() => {}); }

  _heroResetProgress();
}

function heroSliderNext() { heroGoTo(_hero.current + 1); heroRestartTimer(); }
function heroSliderPrev() { heroGoTo(_hero.current - 1); heroRestartTimer(); }

function heroRestartTimer() {
  clearInterval(_hero.timer);
  _hero.timer = setInterval(() => heroGoTo(_hero.current + 1), HERO_DURATION);
}

function _heroResetProgress() {
  const bar = document.getElementById('hero-progress-bar');
  if (!bar) return;
  // Kill transition, snap to 0, then re-enable and fill to 100 % over HERO_DURATION
  bar.style.transition = 'none';
  bar.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bar.style.transition = `width ${HERO_DURATION}ms linear`;
    bar.style.width = '100%';
  }));
}

// ─── Category filter ──────────────────────────────────────────
function initCategoryFilter() {
  const buttons = document.querySelectorAll('.filter-btn[data-filter]');
  const items   = document.querySelectorAll('[data-category]');
  if (!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(item => {
        if (f === 'all' || item.dataset.category === f) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  // Activate first button
  buttons[0]?.classList.add('active');
}

// ─── Keyboard handling ────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const search = document.getElementById('search-overlay');
    const mall = document.getElementById('mall-modal');
    const qr = document.getElementById('qr-modal');
    if (search?.classList.contains('open')) toggleSearch();
    else if (mall?.classList.contains('open')) closeMallModal();
    else if (qr?.classList.contains('open')) closeQRModal();
  }
});

// Close modals on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.id === 'mall-modal') closeMallModal();
  if (e.target.id === 'qr-modal') closeQRModal();
});

// ─── Sticky filter bars ───────────────────────────────────────
// Uses position:fixed (not sticky) — works regardless of overflow:hidden on
// any ancestor. The nav is now also fixed, so getChromeHeight() is constant.
function initStickyBars() {
  // Only bars the USER wants pinned. Entertainment + Events are intentionally
  // NOT included — those filter bars scroll away with the page by design.
  const SELECTORS = [
    '.filter-section',   // shopping.html, careers.html
    '.map-controls',     // mall-map.html
    '.res-tabs',         // sea-dream-reservation.html
  ];

  function getChromeH() {
    // The chrome is now position:fixed — its height is always the same
    const el = document.getElementById('mm-chrome');
    if (el) return el.offsetHeight || 112;
    return 112; // fallback
  }

  SELECTORS.forEach(function(sel) {
    var el = document.querySelector(sel);
    if (!el) return;

    var chromeH = 0;
    var naturalTop = null;
    var placeholder = null;
    var stuck = false;

    function measure() {
      if (stuck) return;
      chromeH = getChromeH();
      var rect = el.getBoundingClientRect();
      // naturalTop = scroll position at which this bar reaches the bottom of the chrome
      naturalTop = rect.top + window.pageYOffset - chromeH;
      if (naturalTop < 0) naturalTop = 0;
    }

    function pin() {
      if (naturalTop === null) measure();
      var shouldStick = window.pageYOffset >= naturalTop;

      if (shouldStick && !stuck) {
        var h = el.getBoundingClientRect().height;
        // Spacer prevents content jump
        placeholder = document.createElement('div');
        placeholder.style.cssText = 'height:' + h + 'px;pointer-events:none;';
        el.parentNode.insertBefore(placeholder, el.nextSibling);
        el.style.setProperty('position', 'fixed', 'important');
        el.style.setProperty('top', chromeH + 'px', 'important');
        el.style.setProperty('left', '0', 'important');
        el.style.setProperty('right', '0', 'important');
        el.style.setProperty('width', '100%', 'important');
        el.style.setProperty('z-index', '89', 'important');
        el.style.setProperty('box-shadow', '0 2px 20px rgba(0,0,0,0.1)', 'important');
        stuck = true;
      } else if (!shouldStick && stuck) {
        el.style.removeProperty('position');
        el.style.removeProperty('top');
        el.style.removeProperty('left');
        el.style.removeProperty('right');
        el.style.removeProperty('width');
        el.style.removeProperty('z-index');
        el.style.removeProperty('box-shadow');
        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }
        placeholder = null;
        stuck = false;
      }
    }

    // Measure after full layout is available
    setTimeout(function() { measure(); pin(); }, 300);
    window.addEventListener('load', function() { measure(); pin(); });
    window.addEventListener('scroll', pin, { passive: true });
    window.addEventListener('resize', function() {
      stuck = false;
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      placeholder = null;
      setTimeout(function() { measure(); pin(); }, 50);
    });
  });
}

// ─── Init ─────────────────────────────────────────────────────
function initApp() {
  MM.t = TRANSLATIONS[MM.lang] || TRANSLATIONS.fr;
  renderAll();
  initRevealAnimations();
  initHeroSlider();
  initCategoryFilter();
  initStickyBars();
  // Show mall selector on first visit
  if (!localStorage.getItem('mm_visited')) {
    setTimeout(() => {
      openMallModal();
      localStorage.setItem('mm_visited', '1');
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', initApp);
