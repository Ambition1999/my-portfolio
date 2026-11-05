(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const labels = document.documentElement.lang === 'en'
    ? {
      lightTheme: 'Switch to light mode',
      darkTheme: 'Switch to dark mode',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    }
    : {
      lightTheme: 'Bật giao diện sáng',
      darkTheme: 'Bật giao diện tối',
      openMenu: 'Mở menu',
      closeMenu: 'Đóng menu',
    };

  // Theme switching and changes to the operating system preference.
  const themeToggle = $('#theme-toggle');
  const themeMedia = matchMedia('(prefers-color-scheme: dark)');
  let hasThemeChoice = false;
  try {
    hasThemeChoice = ['light', 'dark'].includes(localStorage.getItem('portfolio-theme'));
  } catch (_) {
    // Storage can be blocked when opening the page directly or in private mode.
  }
  function updateThemeControl() {
    const dark = document.documentElement.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-label', dark ? labels.lightTheme : labels.darkTheme);
    themeToggle.setAttribute('aria-pressed', String(dark));
    $('meta[name="theme-color"]').content = dark ? '#141915' : '#f8f9f6';
  }
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    hasThemeChoice = true;
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (_) {
      // The selected theme still applies for the current page.
    }
    updateThemeControl();
  });
  themeMedia.addEventListener('change', (event) => {
    if (!hasThemeChoice) {
      document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
      updateThemeControl();
    }
  });
  updateThemeControl();
  themeToggle.hidden = false;

  // Mobile navigation, focus handling and dismissal.
  const nav = $('.nav');
  const menu = $('#nav-links');
  const menuToggle = $('#menu-toggle');
  const mobileMedia = matchMedia('(max-width: 600px)');
  function setMenu(open) {
    menu.hidden = mobileMedia.matches && !open;
    menuToggle.setAttribute('aria-expanded', String(open && mobileMedia.matches));
    menuToggle.setAttribute('aria-label', open ? labels.closeMenu : labels.openMenu);
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    setMenu(open);
    if (open) menu.querySelector('a').focus();
  });
  menu.addEventListener('click', (event) => {
    if (!mobileMedia.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const destination = document.getElementById(link.hash.slice(1));
    destination?.focus({ preventScroll: true });
    setMenu(false);
  });
  mobileMedia.addEventListener('change', () => setMenu(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (mobileMedia.matches && !nav.contains(event.target)) setMenu(false);
  });
  setMenu(false);
  nav.classList.add('nav-enhanced');
  menuToggle.hidden = false;

  // Highlight the section currently in view.
  if ('IntersectionObserver' in window) {
    const navLinks = [...menu.querySelectorAll('a')];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            if (link.hash === '#' + entry.target.id) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
  }
  $('#year').textContent = String(new Date().getFullYear());
})();
