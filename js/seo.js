/**
 * Morocco Mall — SEO Module
 * Auto-injects: meta tags, Open Graph, JSON-LD structured data, hreflang
 * Called automatically on every page via app.js initApp()
 */
'use strict';

const SEO_BASE_URL = 'https://www.moroccomall.ma';

const SEO_PAGE_META = {
  'index.html': {
    fr: { title: 'Morocco Mall — Style, Gastronomie & Expériences', desc: 'Découvrez les 4 destinations shopping Morocco Mall à Casablanca, Marrakech, Rabat et Bouskoura. Mode, luxe, restaurants, divertissements.' },
    en: { title: 'Morocco Mall — Style, Dining & Experiences', desc: 'Discover 4 world-class Morocco Mall destinations in Casablanca, Marrakech, Rabat and Bouskoura. Fashion, luxury, dining, entertainment.' },
    ar: { title: 'مغرب مول — الأناقة والمطاعم والتجارب', desc: 'اكتشف وجهات مغرب مول الأربع في الدار البيضاء ومراكش والرباط وبوسكورة. موضة ورفاهية ومطاعم وترفيه.' }
  },
  'shopping.html': {
    fr: { title: 'Shopping & Boutiques — Morocco Mall', desc: 'Explorez plus de 300 enseignes à Morocco Mall : mode, beauté, sport, maison, électronique et plus encore.' },
    en: { title: 'Shopping & Stores — Morocco Mall', desc: 'Explore 300+ brands at Morocco Mall. Fashion, beauty, sport, home, electronics. New arrivals including Chanel and Mango.' },
    ar: { title: 'تسوق وبوتيكات — مغرب مول', desc: 'اكتشف أكثر من 300 علامة تجارية في مغرب مول: أزياء وجمال ورياضة وإلكترونيات.' }
  },
  'dining.html': {
    fr: { title: 'Restaurants & Gastronomie — Morocco Mall', desc: 'Savourez plus de 80 restaurants, cafés et expériences culinaires à Morocco Mall. Fine dining, food hall, vue sur l\'Atlantique.' },
    en: { title: 'Dining & Restaurants — Morocco Mall', desc: 'Over 80 restaurants, cafés and culinary experiences at Morocco Mall. Fine dining, Bay Food Hall, Seaview dining.' },
    ar: { title: 'مطاعم وتجارب طعام — مغرب مول', desc: 'استمتع بأكثر من 80 مطعماً ومقهى وتجربة طهي في مغرب مول.' }
  },
  'entertainment.html': {
    fr: { title: 'Divertissement & Expériences — Morocco Mall', desc: 'Sea Dream Aquarium, Cinéma IMAX, Hello Park, Adventure Land et Fontaine Musicale au Morocco Mall.' },
    en: { title: 'Entertainment & Experiences — Morocco Mall', desc: 'Sea Dream Aquarium, IMAX Cinema, Hello Park, Adventure Land and Musical Fountain at Morocco Mall.' },
    ar: { title: 'ترفيه وتجارب — مغرب مول', desc: 'أكواريوم سي دريم، سينما آيماكس، هيلو بارك، أدفنشر لاند والنافورة الموسيقية في مغرب مول.' }
  },
  'events.html': {
    fr: { title: 'Événements & Agenda — Morocco Mall', desc: 'Fashion shows, festivals gastronomiques, ouvertures exclusives et expériences culturelles. Agenda complet des événements Morocco Mall.' },
    en: { title: 'Events & What\'s On — Morocco Mall', desc: 'Fashion shows, food festivals, exclusive brand openings and cultural experiences. Full Morocco Mall events calendar.' },
    ar: { title: 'فعاليات وأجندة — مغرب مول', desc: 'عروض أزياء ومهرجانات طعام وافتتاحات حصرية. أجندة كاملة لفعاليات مغرب مول.' }
  },
  'rose-boulevard.html': {
    fr: { title: 'Rose Boulevard — Luxe & Maisons Prestige | Morocco Mall', desc: 'Louis Vuitton, Dior, Chanel, Hermès, Cartier et plus. Rose Boulevard, la destination luxe exclusive de Morocco Mall.' },
    en: { title: 'Rose Boulevard — Luxury & Prestige Brands | Morocco Mall', desc: 'Louis Vuitton, Dior, Chanel, Hermès, Cartier and more. Rose Boulevard, Morocco Mall\'s exclusive luxury destination.' },
    ar: { title: 'روز بوليفار — الرفاهية والعلامات الفاخرة | مغرب مول', desc: 'لويس فيتون ودور وشانيل وهيرمس وكارتييه وغيرها. روز بوليفار، وجهة الفخامة الحصرية في مغرب مول.' }
  },
  'aksal-black.html': {
    fr: { title: 'Aksal Black — Programme de Fidélité Premium | Morocco Mall', desc: 'Rejoignez Aksal Black, le programme de fidélité premium de Morocco Mall. Cashback, réductions exclusives et privilèges VIP chez 200+ partenaires.' },
    en: { title: 'Aksal Black — Premium Loyalty Programme | Morocco Mall', desc: 'Join Aksal Black, Morocco Mall\'s premium loyalty programme. Cashback, exclusive discounts and VIP privileges at 200+ partners.' },
    ar: { title: 'أكسال بلاك — برنامج الولاء المميز | مغرب مول', desc: 'انضم إلى أكسال بلاك، برنامج الولاء المميز لمغرب مول. كاشباك وخصومات حصرية وامتيازات VIP لدى أكثر من 200 شريك.' }
  },
  'sea-dream.html': {
    fr: { title: 'Sea Dream Aquarium — Morocco Mall Casablanca', desc: 'Plongez dans le plus grand aquarium du Maroc. +3000 espèces marines, tunnel sous-marin, requins et restaurant Ocean Kitchen.' },
    en: { title: 'Sea Dream Aquarium — Morocco Mall Casablanca', desc: 'Dive into Morocco\'s largest aquarium. 3000+ marine species, shark walkthrough tunnel, and Ocean Kitchen restaurant.' },
    ar: { title: 'أكواريوم سي دريم — مغرب مول الدار البيضاء', desc: 'اغمر في أكبر أحواض الأسماك في المغرب. أكثر من 3000 نوع بحري ونفق أسماك القرش ومطعم أوشن كيتشن.' }
  },
  'cinema.html': {
    fr: { title: 'Cinéma IMAX, 4DX & Dolby — Morocco Mall', desc: 'Profitez de l\'expérience cinéma ultime avec IMAX, 4DX et Dolby Atmos au Morocco Mall. 14 salles, derniers blockbusters.' },
    en: { title: 'Cinema IMAX, 4DX & Dolby — Morocco Mall', desc: 'Experience the ultimate cinema with IMAX, 4DX and Dolby Atmos at Morocco Mall. 14 screens, latest blockbusters.' },
    ar: { title: 'سينما آيماكس و4DX ودولبي — مغرب مول', desc: 'استمتع بتجربة سينمائية فريدة مع آيماكس و4DX ودولبي أتموس في مغرب مول.' }
  },
  'mall-map.html': {
    fr: { title: 'Plan du Mall Interactif — Morocco Mall', desc: 'Naviguez facilement dans Morocco Mall grâce au plan interactif. Trouvez boutiques, restaurants et services par niveau.' },
    en: { title: 'Interactive Mall Map — Morocco Mall', desc: 'Navigate Morocco Mall easily with the interactive floor plan. Find stores, restaurants and services by level.' },
    ar: { title: 'خريطة المول التفاعلية — مغرب مول', desc: 'تنقل بسهولة في مغرب مول بفضل المخطط التفاعلي. ابحث عن المتاجر والمطاعم والخدمات حسب الطابق.' }
  },
  'services.html': {
    fr: { title: 'Services Visiteurs — Morocco Mall', desc: 'Parking, conciergerie, WiFi, salles de prière, tax-free shopping, espace bébé et bien plus au Morocco Mall.' },
    en: { title: 'Visitor Services — Morocco Mall', desc: 'Parking, concierge, WiFi, prayer rooms, tax-free shopping, baby care and more at Morocco Mall.' },
    ar: { title: 'خدمات الزوار — مغرب مول', desc: 'موقف سيارات وكونسيرج وواي فاي وغرف صلاة وتسوق معفى من الضرائب وخدمات الأطفال في مغرب مول.' }
  },
  'parking.html': {
    fr: { title: 'Parking — Morocco Mall | 3000+ Places Gratuites', desc: 'Parking gratuit 2h, valet, bornes EV et parking VIP Rose Boulevard au Morocco Mall. 3000+ places disponibles.' },
    en: { title: 'Parking — Morocco Mall | 3000+ Free Spaces', desc: 'Free parking 2h, valet, EV charging and VIP Rose Boulevard parking at Morocco Mall. 3000+ spaces available.' },
    ar: { title: 'موقف السيارات — مغرب مول | أكثر من 3000 مكان', desc: 'موقف مجاني لساعتين وخدمة الفاليه وشحن السيارات الكهربائية وموقف VIP روز بوليفار في مغرب مول.' }
  },
  'transport.html': {
    fr: { title: 'Comment Nous Rejoindre — Morocco Mall', desc: 'Careem, taxi, tramway T1 et parking. Toutes les options transport pour rejoindre Morocco Mall Casablanca.' },
    en: { title: 'How to Get to Morocco Mall', desc: 'Careem, taxi, T1 tramway and parking. All transport options to reach Morocco Mall Casablanca.' },
    ar: { title: 'كيفية الوصول إلى مغرب مول', desc: 'كريم وتاكسي وترامواي T1 وموقف السيارات. جميع خيارات المواصلات للوصول إلى مغرب مول الدار البيضاء.' }
  },
  'about.html': {
    fr: { title: 'À Propos de Morocco Mall — Groupe AKSAL', desc: 'Découvrez l\'histoire et la vision du Morocco Mall, la destination shopping premium du Maroc créée par le Groupe AKSAL.' },
    en: { title: 'About Morocco Mall — AKSAL Group', desc: 'Discover the story and vision of Morocco Mall, Morocco\'s premium shopping destination created by AKSAL Group.' },
    ar: { title: 'عن مغرب مول — مجموعة أكسال', desc: 'اكتشف تاريخ ورؤية مغرب مول، وجهة التسوق المميزة في المغرب التي أسستها مجموعة أكسال.' }
  },
  'press.html': {
    fr: { title: 'Presse & Médias — Morocco Mall', desc: 'Communiqués de presse, galeries photos, kits médias et contact RP Morocco Mall pour les journalistes.' },
    en: { title: 'Press & Media — Morocco Mall', desc: 'Press releases, photo galleries, media kits and PR contact for Morocco Mall journalists.' },
    ar: { title: 'الصحافة والإعلام — مغرب مول', desc: 'بيانات صحفية وصور ومجموعات إعلامية وجهة اتصال العلاقات العامة لمغرب مول.' }
  },
  'careers.html': {
    fr: { title: 'Recrutement & Carrières — Morocco Mall', desc: 'Rejoignez l\'équipe Morocco Mall. Découvrez nos offres d\'emploi, stages et programme de formation.' },
    en: { title: 'Careers & Recruitment — Morocco Mall', desc: 'Join the Morocco Mall team. Discover job offers, internships and training programmes.' },
    ar: { title: 'التوظيف والوظائف — مغرب مول', desc: 'انضم إلى فريق مغرب مول. اكتشف عروض العمل والتدريب وبرامج التطوير المهني.' }
  },
  'join-us.html': {
    fr: { title: 'Ouvrir une Boutique — Morocco Mall Leasing', desc: 'Vous souhaitez ouvrir une boutique au Morocco Mall ? Déposez votre candidature en ligne avec vos documents RC et ICE.' },
    en: { title: 'Open a Store — Morocco Mall Leasing', desc: 'Want to open a store at Morocco Mall? Submit your application online with RC and ICE documents.' },
    ar: { title: 'افتح متجرك في مغرب مول', desc: 'هل تريد فتح متجر في مغرب مول؟ قدّم طلبك عبر الإنترنت مع وثائق RC و ICE.' }
  },
  'faq.html': {
    fr: { title: 'FAQ — Questions Fréquentes | Morocco Mall', desc: 'Trouvez les réponses à toutes vos questions sur Morocco Mall : horaires, parking, WiFi, RSVP, Aksal Black, et plus.' },
    en: { title: 'FAQ — Frequently Asked Questions | Morocco Mall', desc: 'Find answers to all your Morocco Mall questions: hours, parking, WiFi, RSVP, Aksal Black, and more.' },
    ar: { title: 'الأسئلة الشائعة — مغرب مول', desc: 'اعثر على إجابات لجميع أسئلتك حول مغرب مول: أوقات العمل وموقف السيارات والواي فاي والتسجيل.' }
  },
  'privacy-policy.html': {
    fr: { title: 'Politique de Confidentialité — Morocco Mall', desc: 'Politique de confidentialité Morocco Mall : données collectées, cookies, droits RGPD et contacts.' },
    en: { title: 'Privacy Policy — Morocco Mall', desc: 'Morocco Mall privacy policy: data collected, cookies, GDPR rights and contacts.' },
    ar: { title: 'سياسة الخصوصية — مغرب مول', desc: 'سياسة خصوصية مغرب مول: البيانات المجمعة وملفات تعريف الارتباط وحقوق GDPR وجهات الاتصال.' }
  }
};

// ─── JSON-LD: Organization ─────────────────────────────────
const JSON_LD_ORG = {
  "@context": "https://schema.org",
  "@type": "ShoppingCenter",
  "name": "Morocco Mall",
  "url": SEO_BASE_URL,
  "logo": SEO_BASE_URL + "/assets/logo.png",
  "image": SEO_BASE_URL + "/assets/luxury-2.jpg",
  "description": "Morocco Mall is Morocco's premier shopping destination with 4 locations in Casablanca, Marrakech, Rabat and Bouskoura.",
  "telephone": "+212522000111",
  "email": "contact@moroccomall.ma",
  "address": [
    { "@type": "PostalAddress", "streetAddress": "Bd de la Corniche", "addressLocality": "Casablanca", "addressCountry": "MA" },
    { "@type": "PostalAddress", "addressLocality": "Marrakech", "addressCountry": "MA" },
    { "@type": "PostalAddress", "addressLocality": "Rabat", "addressCountry": "MA" },
    { "@type": "PostalAddress", "addressLocality": "Bouskoura", "addressCountry": "MA" }
  ],
  "sameAs": [
    "https://www.instagram.com/moroccomall",
    "https://www.facebook.com/moroccomall",
    "https://www.tiktok.com/@moroccomall",
    "https://www.youtube.com/@moroccomall",
    "https://www.linkedin.com/company/moroccomall"
  ],
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Sunday","Monday","Tuesday","Wednesday","Thursday"], "opens": "10:00", "closes": "21:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Friday","Saturday"], "opens": "10:00", "closes": "22:00" }
  ],
  "priceRange": "MAD - MMMAD"
};

// ─── JSON-LD: WebSite with SearchAction ───────────────────
const JSON_LD_WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Morocco Mall",
  "url": SEO_BASE_URL,
  "inLanguage": ["fr", "en", "ar"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": SEO_BASE_URL + "/pages/shopping.html?q={search_term_string}" },
    "query-input": "required name=search_term_string"
  }
};

// ─── Inject SEO tags ──────────────────────────────────────
function injectSEO() {
  var lang   = MM.lang || 'fr';
  var pageName = window.location.pathname.split('/').pop() || 'index.html';
  var meta   = (SEO_PAGE_META[pageName] && SEO_PAGE_META[pageName][lang])
               || (SEO_PAGE_META['index.html'] && SEO_PAGE_META['index.html'][lang])
               || { title: 'Morocco Mall', desc: 'Morocco Mall — Style, Dining, Experiences.' };

  // Title
  document.title = meta.title;

  // Helper: upsert meta tag
  function setMeta(sel, attr, val) {
    var el = document.querySelector(sel);
    if (!el) { el = document.createElement('meta'); document.head.appendChild(el); }
    el.setAttribute(attr, val);
  }

  // Standard meta
  setMeta('meta[name="description"]',     'content', meta.desc);
  setMeta('meta[name="robots"]',           'name',    'robots');
  document.querySelector('meta[name="robots"]').setAttribute('content', 'index, follow');
  setMeta('meta[name="theme-color"]',     'name',    'theme-color');
  document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0A0A0A');

  // Open Graph
  var pageUrl = SEO_BASE_URL + '/pages/' + pageName;
  setMeta('meta[property="og:type"]',        'property', 'og:type');
  document.querySelector('meta[property="og:type"]').setAttribute('content', 'website');
  setMeta('meta[property="og:site_name"]',   'property', 'og:site_name');
  document.querySelector('meta[property="og:site_name"]').setAttribute('content', 'Morocco Mall');
  setMeta('meta[property="og:title"]',       'property', 'og:title');
  document.querySelector('meta[property="og:title"]').setAttribute('content', meta.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description');
  document.querySelector('meta[property="og:description"]').setAttribute('content', meta.desc);
  setMeta('meta[property="og:url"]',         'property', 'og:url');
  document.querySelector('meta[property="og:url"]').setAttribute('content', pageUrl);
  setMeta('meta[property="og:image"]',       'property', 'og:image');
  document.querySelector('meta[property="og:image"]').setAttribute('content', SEO_BASE_URL + '/assets/luxury-2.jpg');
  setMeta('meta[property="og:locale"]',      'property', 'og:locale');
  document.querySelector('meta[property="og:locale"]').setAttribute('content', lang === 'ar' ? 'ar_MA' : lang === 'en' ? 'en_US' : 'fr_MA');

  // Twitter Card
  setMeta('meta[name="twitter:card"]',       'name', 'twitter:card');
  document.querySelector('meta[name="twitter:card"]').setAttribute('content', 'summary_large_image');
  setMeta('meta[name="twitter:site"]',       'name', 'twitter:site');
  document.querySelector('meta[name="twitter:site"]').setAttribute('content', '@moroccomall');
  setMeta('meta[name="twitter:title"]',      'name', 'twitter:title');
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', meta.title);
  setMeta('meta[name="twitter:description"]','name', 'twitter:description');
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', meta.desc);
  setMeta('meta[name="twitter:image"]',      'name', 'twitter:image');
  document.querySelector('meta[name="twitter:image"]').setAttribute('content', SEO_BASE_URL + '/assets/luxury-2.jpg');

  // hreflang
  ['fr','en','ar'].forEach(function(l) {
    var id = 'hreflang-' + l;
    var el = document.getElementById(id);
    if (!el) { el = document.createElement('link'); el.id = id; el.rel = 'alternate'; document.head.appendChild(el); }
    el.setAttribute('hreflang', l === 'ar' ? 'ar-MA' : l === 'en' ? 'en-MA' : 'fr-MA');
    el.setAttribute('href', pageUrl + '?lang=' + l);
  });

  // Canonical
  var canon = document.getElementById('canonical');
  if (!canon) { canon = document.createElement('link'); canon.id = 'canonical'; canon.rel = 'canonical'; document.head.appendChild(canon); }
  canon.setAttribute('href', pageUrl);

  // JSON-LD
  function injectLD(data, id) {
    var s = document.getElementById(id);
    if (!s) { s = document.createElement('script'); s.id = id; s.type = 'application/ld+json'; document.head.appendChild(s); }
    s.textContent = JSON.stringify(data);
  }
  injectLD(JSON_LD_ORG,     'ld-org');
  injectLD(JSON_LD_WEBSITE, 'ld-site');
}

// Export so app.js can call it after language is set
if (typeof window !== 'undefined') {
  window.injectSEO = injectSEO;
}
