/**
 * cookie.js
 * Cookie consent banner management via localStorage.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'eu4r_cookie_consent';
  var banner      = document.getElementById('cookie-banner');
  var acceptBtn   = document.getElementById('cookie-accept');
  var declineBtn  = document.getElementById('cookie-decline');

  if (!banner) return;

  function getConsent() {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      sessionStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* storage unavailable — silently continue */
    }
  }

  function hideBanner() {
    banner.setAttribute('hidden', '');
    banner.classList.remove('cookie-banner--visible');
  }

  function showBanner() {
    banner.removeAttribute('hidden');
    /* Small delay so the CSS transition plays after hidden is removed */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('cookie-banner--visible');
      });
    });
  }

  /* Show banner only if no previous consent recorded */
  if (!getConsent()) {
    showBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      setConsent('accepted');
      hideBanner();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', function () {
      setConsent('declined');
      hideBanner();
    });
  }

}());
