# Morocco Mall Website

Institutional website for Morocco Mall — 4 premium shopping destinations in Morocco (Casablanca, Marrakech, Rabat, Bouskoura).

**Live preview (local):** `python3 -m http.server 8080` then open `http://localhost:8080`

---

## 📁 Project Structure

```
website/
├── index.html                  # Homepage
├── css/
│   └── main.css                # All styles (1 file, ~2200 lines)
├── js/
│   ├── app.js                  # Core logic: i18n, mall selector, nav/footer injection, QR
│   ├── seo.js                  # SEO: meta tags, JSON-LD, OG, hreflang (auto-runs)
│   └── translations.js         # All text in FR / EN / AR
├── pages/
│   ├── shopping.html           # Store directory
│   ├── dining.html             # Restaurants
│   ├── entertainment.html      # All venues overview
│   ├── events.html             # Events calendar (search + month/type filters)
│   ├── rose-boulevard.html     # Luxury section
│   ├── rose-boulevard-lounge.html  # VIP lounge
│   ├── mall-map.html           # Interactive SVG floor plan
│   ├── services.html           # Visitor services
│   ├── parking.html            # Parking + VIP
│   ├── transport.html          # How to get here
│   ├── aksal-black.html        # Loyalty programme
│   ├── cinema.html             # Cinema detail
│   ├── sea-dream.html          # Aquarium detail
│   ├── sea-dream-reservation.html  # Booking wizard (tickets + restaurant)
│   ├── hello-park.html         # Kids playground
│   ├── adventure-land.html     # Theme park rides
│   ├── fontaine-musicale.html  # Musical fountain
│   ├── about.html              # About Morocco Mall
│   ├── press.html              # Press & media
│   ├── careers.html            # Recruitment
│   ├── join-us.html            # Leasing / open a store
│   ├── social.html             # Social wall
│   ├── privacy-policy.html     # Legal
│   ├── terms.html              # Legal
│   └── faq.html                # FAQ
├── assets/
│   ├── logo.png                # Morocco Mall MC monogram logo
│   ├── luxury-1.jpg            # Dior boutique — hero slide 2
│   ├── luxury-2.jpg            # Bottega Veneta — hero slide 1
│   ├── luxury-3.jpg            # Ounass Stage — editorial
│   ├── luxury-4.jpg            # Fluid Forms — hero slide 3
│   ├── aquarium-1.jpg          # Sea Dream hero background
│   ├── aquarium-2.jpg          # Ocean Kitchen restaurant
│   ├── aquarium-3.jpg          # Shark walkthrough tunnel
│   ├── fountain-1.jpg          # Fontaine Musicale night
│   ├── aksal-black-logo.png    # Aksal Black app icon
│   ├── aksal-card-gold.png     # Gold tier card
│   └── aksal-card-platinum.png # Platinum tier card
├── data/                       # ✏️ EDITABLE JSON files (see below)
│   ├── config.json             # Site-wide config, hours, social links
│   ├── malls.json              # 4 mall locations
│   ├── brands.json             # Full brand directory
│   ├── events.json             # Events calendar
│   └── images.json             # Image inventory (paths + where used)
├── sitemap.xml                 # SEO sitemap
└── robots.txt                  # SEO crawl instructions
```

---

## ✏️ How to Edit Content

### Text content (translations)
All UI text is in **`js/translations.js`**. Three language objects: `fr`, `en`, `ar`.

```js
// Example: change the hero subtitle
translations.fr.heroSubtitle = "Votre nouveau texte ici";
translations.en.heroSubtitle = "Your new text here";
translations.ar.heroSubtitle = "النص الجديد هنا";
```

### Site config (hours, phone, social)
Edit **`data/config.json`** — opening hours, phone numbers, email addresses, app store links.

### Brands directory
Edit **`data/brands.json`** — add/remove brands, change floors, update mall availability.

### Events
Edit **`data/events.json`** — update event dates, descriptions, images. The `bookingType` field controls the CTA: `"rsvp"`, `"external"`, or `"invitation"`.

### Replacing images
See **`data/images.json`** for a full inventory of every image and where it is used.

**To replace an image:**
1. Copy your new image to `assets/`
2. Update the `src` in `data/images.json` (for documentation)
3. Find the image in the HTML file listed under `usedIn` and update the `src` attribute
4. For hero slides: update `poster="assets/your-image.jpg"` in `index.html`

**Pending images** (currently using stock photos):
- Hero slide videos (replace Mixkit CDN URLs in `index.html`)
- Individual brand logos for shopping.html store grid
- Morocco Mall interior photography
- Staff photos for careers.html
- Aksal Black app screenshots

---

## 🌍 Languages

The site supports **French** (default), **English**, and **Moroccan Arabic** (RTL).

Language is stored in `localStorage` under key `mm_lang`. Toggle via the top bar.

Arabic uses the **Cairo** font from Google Fonts. RTL layout is triggered automatically via `document.documentElement.dir = 'rtl'`.

---

## 🏪 Mall Selector

On first visit, the mall selector modal appears. The selected mall is stored in `localStorage` under `mm_mall`. Geolocation auto-detects the nearest mall by lat/lng (Haversine distance).

Mall IDs: `casablanca` | `marrakech` | `rabat` | `bouskoura` | `null` (all malls)

---

## 🔧 JavaScript Architecture

### `app.js` — Core module
- `initApp()` — called on `DOMContentLoaded`, sets language, renders chrome + footer
- `renderChrome()` — injects nav, location bar, modals into `<body>` before `<main>`
- `setLang(lang)` — switches language, re-renders everything
- `setMall(mallId)` — sets active mall context
- `showRSVPModal(name, date)` — opens QR code confirmation modal
- `heroGoTo(n)` / `heroSliderNext()` / `heroSliderPrev()` — hero slider controls

### `seo.js` — SEO module (auto-runs via `renderAll`)
- `injectSEO()` — sets `<title>`, meta description, OG tags, JSON-LD, hreflang, canonical
- Update `SEO_PAGE_META` in this file to change page titles/descriptions per language

### `translations.js` — i18n
All UI strings. Structure: `TRANSLATIONS.fr`, `TRANSLATIONS.en`, `TRANSLATIONS.ar`.

---

## 🎨 Design System

### Colors (CSS variables in `main.css`)
| Variable | Value | Use |
|---|---|---|
| `--black` | `#0A0A0A` | Primary text, buttons |
| `--white` | `#FFFFFF` | Backgrounds |
| `--cream` | `#F9F7F3` | Section backgrounds |
| `--gold` | `#C9A96E` | Rose Boulevard, accents |
| `--gold-light` | `#E8D5B0` | Gold text on dark |

### Fonts
- **Cormorant Garamond** — display/editorial headings
- **DM Sans** — body text, UI
- **Cairo** — Arabic text (RTL)

### Breakpoints
- Mobile-first, then `@media (min-width: 640px)` → `768px` → `900px` → `1024px` → `1440px`

---

## 🔐 Reservations (Sea Dream)

`pages/sea-dream-reservation.html` is a fully client-side booking form. In production, wire the `confirmAquarium()` and `confirmRestaurant()` functions to a real backend API or payment gateway (Stripe, CMI Morocco).

---

## 📦 Deployment

This is a **static HTML site** — no build step required. Deploy to any static host:

```bash
# Netlify
netlify deploy --dir=.

# Vercel
vercel

# AWS S3
aws s3 sync . s3://your-bucket --exclude ".git/*"

# GitHub Pages
# Push to main branch with Pages enabled
```

Update `SEO_BASE_URL` in `js/seo.js` and `sitemap.xml` with your production domain.

---

## 📧 Contact

**Morocco Mall** · contact@moroccomall.ma · +212 522 000 111  
Built by AKSAL Group · [moroccomall.ma](https://www.moroccomall.ma)
