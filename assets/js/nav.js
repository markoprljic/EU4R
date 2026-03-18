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

  /* Mark active link — works with both root-served and subdirectory (GitHub Pages) setups */
  var currentHref = window.location.href.split('?')[0].split('#')[0];
  var links = document.querySelectorAll('.nav__link, .nav__menu-link');
  links.forEach(function (link) {
    if (!link.href) return;
    var linkHref = link.href.split('?')[0].split('#')[0];
    /* Strip trailing index.html for comparison */
    var normCurrent = currentHref.replace(/\/index\.html$/, '/');
    var normLink    = linkHref.replace(/\/index\.html$/, '/');
    if (normCurrent === normLink) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    } else if (normLink !== '/' && normLink.replace(/\/$/, '') !== '' && normCurrent.startsWith(normLink.replace(/\/$/, '/'))) {
      /* Highlight parent section link (e.g. /EU4R/news/ active on article page) */
      link.classList.add('is-active');
    }
  });

}());
