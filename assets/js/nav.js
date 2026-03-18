/**
 * nav.js
 * Mobile navigation toggle with focus trapping and keyboard support.
 */
(function () {
  'use strict';

  var header    = document.getElementById('site-header');
  var hamburger = document.getElementById('nav-hamburger');
  var closeBtn  = document.getElementById('nav-close');
  var menu      = document.getElementById('mobile-menu');

  if (!header || !hamburger || !closeBtn || !menu) return;

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  function getFocusable() {
    return Array.prototype.slice.call(menu.querySelectorAll(FOCUSABLE));
  }

  function openMenu() {
    header.classList.add('nav--open');
    hamburger.setAttribute('aria-expanded', 'true');
    menu.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeMenu() {
    header.classList.remove('nav--open');
    hamburger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('hidden', '');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  function trapFocus(e) {
    if (!header.classList.contains('nav--open')) return;
    var focusable = getFocusable();
    if (!focusable.length) return;

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('nav--open')) {
      closeMenu();
    }
    trapFocus(e);
  });

  /* Sticky nav shadow on scroll */
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (y > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  /* Language switcher */
  var langBtns  = document.querySelectorAll('.nav__lang-btn');
  var savedLang = localStorage.getItem('eu4r-lang') || 'en';

  function setLang(lang) {
    langBtns.forEach(function (btn) {
      var active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    localStorage.setItem('eu4r-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'uk' ? 'uk' : 'en');
  }

  setLang(savedLang);

  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.dataset.lang);
    });
  });

  /* Mark active link — works with both root-served and subdirectory (GitHub Pages) setups */
  var currentHref = window.location.href.split('?')[0].split('#')[0];
  var links = document.querySelectorAll('.nav__link, .nav__menu-link');

  /* Base path depth — used to prevent the home link from matching every page */
  var baseEl       = document.querySelector('base');
  var basePath     = baseEl ? new URL(baseEl.href).pathname.replace(/\/$/, '') : '';
  var baseDepth    = basePath.split('/').filter(Boolean).length;

  links.forEach(function (link) {
    /* Always reset first so hardcoded is-active in HTML doesn't bleed across pages */
    link.classList.remove('is-active');
    link.removeAttribute('aria-current');

    if (!link.href) return;
    var linkHref = link.href.split('?')[0].split('#')[0];
    /* Strip trailing index.html for comparison */
    var normCurrent = currentHref.replace(/\/index\.html$/, '/');
    var normLink    = linkHref.replace(/\/index\.html$/, '/');
    if (normCurrent === normLink) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    } else {
      /* Highlight parent section link (e.g. /EU4R/news/ active on a news article page).
         Guard: only apply when the link's path goes deeper than the site root,
         otherwise the home link (which normalises to the base path) matches everything. */
      var linkDepth = new URL(normLink).pathname.replace(/\/$/, '').split('/').filter(Boolean).length;
      if (linkDepth > baseDepth && normCurrent.startsWith(normLink.replace(/\/$/, '/'))) {
        link.classList.add('is-active');
      }
    }
  });

}());
