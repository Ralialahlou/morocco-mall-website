/* ============================================================
   MOROCCO MALL — GSAP + Lenis Animation System
   Requires: gsap.min.js, ScrollTrigger.min.js, lenis.min.js
   ============================================================ */

(function () {
  'use strict';

  // Guard: only run if GSAP is loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ══════════════════════════════════════════════════════════
     1. LENIS SMOOTH SCROLL — integrated with GSAP ticker
     ════════════════════════════════════════════════════════ */
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.25,
      easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Expose for nav anchor links (e.g. #locations-section)
    window._lenisInstance = lenis;
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        var target = document.querySelector(id);
        if (target && lenis) { e.preventDefault(); lenis.scrollTo(target, { offset: -120 }); }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     2. NAV SCROLL STATE
     ════════════════════════════════════════════════════════ */
  ScrollTrigger.create({
    start: 80,
    onEnter: function () { document.querySelector('.nav') && document.querySelector('.nav').classList.add('scrolled'); },
    onLeaveBack: function () { document.querySelector('.nav') && document.querySelector('.nav').classList.remove('scrolled'); }
  });

  /* ══════════════════════════════════════════════════════════
     3. HERO — staggered line reveals on slide activation
        Hooks into the heroGoTo() function already in app.js
     ════════════════════════════════════════════════════════ */
  function animateHeroContent(slide) {
    var content = slide.querySelector('.hero-slide__content');
    if (!content) return;
    var children = content.children;
    gsap.fromTo(children,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.14,
        clearProps: 'all',
      }
    );
  }

  // Patch heroGoTo to trigger GSAP animation
  var _origHeroGoTo = window.heroGoTo;
  if (typeof _origHeroGoTo === 'function') {
    window.heroGoTo = function (idx) {
      _origHeroGoTo(idx);
      // Animate the newly-active slide after transition begins
      setTimeout(function () {
        var active = document.querySelector('.hero-slide--active');
        if (active) animateHeroContent(active);
      }, 100);
    };
  }
  // Initial hero slide animation
  window.addEventListener('load', function () {
    var first = document.querySelector('.hero-slide--active');
    if (first) animateHeroContent(first);
  });

  /* ══════════════════════════════════════════════════════════
     4. MANIFESTO — counter animation + title clip reveal
     ════════════════════════════════════════════════════════ */
  // Title: word-by-word clip reveal
  var manifestoTitle = document.querySelector('.manifesto__title');
  if (manifestoTitle) {
    gsap.fromTo(manifestoTitle,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 1.4,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: manifestoTitle, start: 'top 82%', once: true }
      }
    );
  }

  // Stats: fade + slide
  gsap.fromTo('.manifesto__stats',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.manifesto', start: 'top 70%', once: true }
    }
  );

  // Counters: 0 → end
  document.querySelectorAll('.manifesto__num').forEach(function (el) {
    var raw    = el.textContent.trim();
    var numStr = raw.match(/\d+/);
    if (!numStr) return;
    var end    = parseInt(numStr[0]);
    var suffix = raw.replace(numStr[0], '');
    var obj    = { v: 0 };

    gsap.to(obj, {
      v: end,
      duration: 2.4,
      ease: 'power2.out',
      onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; },
      scrollTrigger: { trigger: '.manifesto__stats', start: 'top 80%', once: true }
    });
  });

  /* ══════════════════════════════════════════════════════════
     5. EDITORIAL SPLIT — parallax image + text stagger
     ════════════════════════════════════════════════════════ */
  var edImg = document.querySelector('.ed-split__img-el');
  if (edImg) {
    // Parallax: image moves slower than scroll
    gsap.to(edImg, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.ed-split',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.8,
      }
    });

    // Text overlay reveal
    gsap.fromTo('.ed-split__img-text',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ed-split', start: 'top 70%', once: true }
      }
    );

    // Copy side items stagger
    gsap.fromTo('.ed-split__copy > *',
      { opacity: 0, x: 28 },
      {
        opacity: 1, x: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.ed-split__copy', start: 'top 78%', once: true }
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     6. BRAND PICKS — horizontal stagger slide-up
     ════════════════════════════════════════════════════════ */
  var picks = gsap.utils.toArray('.brand-pick');
  if (picks.length) {
    gsap.fromTo(picks,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: { amount: 0.7, from: 'start' },
        scrollTrigger: { trigger: '.picks-scroll', start: 'top 85%', once: true }
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     7. ENTERTAINMENT — asymmetric stagger
        Feature card slides from left, stack from right
     ════════════════════════════════════════════════════════ */
  var entFeature = document.querySelector('.ent-mag__feature');
  var entStack   = gsap.utils.toArray('.ent-mag-card:not(.ent-mag__feature)');

  if (entFeature) {
    gsap.fromTo(entFeature,
      { opacity: 0, x: -60, scale: 0.97 },
      {
        opacity: 1, x: 0, scale: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ent-mag', start: 'top 80%', once: true }
      }
    );
  }
  if (entStack.length) {
    gsap.fromTo(entStack,
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: { amount: 0.5 },
        scrollTrigger: { trigger: '.ent-mag', start: 'top 78%', once: true }
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     8. ROSE BOULEVARD — title + brands wave stagger
     ════════════════════════════════════════════════════════ */
  var roseTitle = document.querySelector('.rose-fullbleed .display-lg');
  if (roseTitle) {
    gsap.fromTo(roseTitle,
      { opacity: 0, y: 70 },
      {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.rose-fullbleed', start: 'top 72%', once: true }
      }
    );
  }

  var roseBrands = gsap.utils.toArray('.rose-brand');
  if (roseBrands.length) {
    gsap.fromTo(roseBrands,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: { amount: 1, from: 'start' },
        scrollTrigger: { trigger: '.rose-brand-list', start: 'top 82%', once: true }
      }
    );
  }

  /* Rose BG image subtle parallax */
  var roseBg = document.querySelector('.rose-fullbleed__bg');
  if (roseBg) {
    gsap.to(roseBg, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.rose-fullbleed',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     9. EVENTS — cards fade + rise with stagger
     ════════════════════════════════════════════════════════ */
  var evCards = gsap.utils.toArray('.ev-ed-card');
  if (evCards.length) {
    gsap.fromTo(evCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: { amount: 0.5 },
        scrollTrigger: { trigger: '.ev-editorial-grid', start: 'top 82%', once: true }
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     10. LOCATION TILES — scale from slight undersize
     ════════════════════════════════════════════════════════ */
  var locTiles = gsap.utils.toArray('.loc-tile');
  if (locTiles.length) {
    gsap.fromTo(locTiles,
      { opacity: 0, scale: 0.93 },
      {
        opacity: 1, scale: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: { amount: 0.5 },
        scrollTrigger: { trigger: '.locations-editorial', start: 'top 80%', once: true }
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     11. AKSAL BLACK — cards float in with rotation
     ════════════════════════════════════════════════════════ */
  gsap.fromTo('.aksal-cards-preview',
    { opacity: 0, y: 60, rotation: -4 },
    {
      opacity: 1, y: 0, rotation: 0,
      duration: 1.3,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.aksal-section', start: 'top 78%', once: true }
    }
  );

  gsap.fromTo('.aksal-inner > .reveal',
    { opacity: 0, x: -40 },
    {
      opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.aksal-section', start: 'top 78%', once: true }
    }
  );

  /* ══════════════════════════════════════════════════════════
     12. SOCIAL WALL — grid items from centre outward
     ════════════════════════════════════════════════════════ */
  var socialPosts = gsap.utils.toArray('.social-post');
  if (socialPosts.length) {
    gsap.fromTo(socialPosts,
      { opacity: 0, scale: 0.88 },
      {
        opacity: 1, scale: 1,
        duration: 0.55,
        ease: 'power2.out',
        stagger: { amount: 0.7, grid: 'auto', from: 'center' },
        scrollTrigger: { trigger: '.social-wall', start: 'top 82%', once: true }
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     13. MARQUEE — speed up on scroll velocity
     ════════════════════════════════════════════════════════ */
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack && lenis) {
    var baseSpeed = 30; // seconds (matches CSS)
    lenis.on('scroll', function (e) {
      var vel = Math.abs(e.velocity);
      var duration = Math.max(8, baseSpeed - vel * 2);
      marqueeTrack.style.animationDuration = duration + 's';
    });
  }

  /* ══════════════════════════════════════════════════════════
     14. GENERIC .reveal — override Intersection Observer
         (app.js skips IO when GSAP is present)
     ════════════════════════════════════════════════════════ */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    // Already handled above for specific sections; this catches the rest
    if (el.closest('.manifesto, .ed-split, .brands-section, .ent-editorial, .rose-fullbleed, .events-editorial, .locations-editorial, .aksal-section, .section--cream')) return;

    var delay = 0;
    if (el.classList.contains('reveal-delay-1')) delay = 0.1;
    if (el.classList.contains('reveal-delay-2')) delay = 0.22;
    if (el.classList.contains('reveal-delay-3')) delay = 0.34;

    gsap.fromTo(el,
      { opacity: 0, y: 26 },
      {
        opacity: 1, y: 0,
        duration: 0.85,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  /* ══════════════════════════════════════════════════════════
     15. CAT NAV — icons bounce on hover via GSAP
     ════════════════════════════════════════════════════════ */
  document.querySelectorAll('.cat-nav__item').forEach(function (item) {
    var icon = item.querySelector('.cat-nav__svg');
    if (!icon) return;
    item.addEventListener('mouseenter', function () {
      gsap.to(icon, { y: -4, duration: 0.25, ease: 'power2.out' });
    });
    item.addEventListener('mouseleave', function () {
      gsap.to(icon, { y: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    });
  });

  /* ══════════════════════════════════════════════════════════
     16. BUTTONS — subtle magnetic pull on hover
     ════════════════════════════════════════════════════════ */
  document.querySelectorAll('.btn--gold, .btn--dark').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var dx = (e.clientX - rect.left - rect.width / 2) * 0.25;
      var dy = (e.clientY - rect.top - rect.height / 2) * 0.25;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', function () {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ══════════════════════════════════════════════════════════
     17. NEWSLETTER TITLE — fade + slide
     ════════════════════════════════════════════════════════ */
  var nlTitle = document.querySelector('.newsletter-dark__title');
  if (nlTitle) {
    gsap.fromTo(nlTitle,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.newsletter-dark', start: 'top 80%', once: true }
      }
    );
    gsap.fromTo('.newsletter-dark__sub, .newsletter-dark-form, .newsletter-dark__note',
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.newsletter-dark', start: 'top 75%', once: true }
      }
    );
  }

})();
