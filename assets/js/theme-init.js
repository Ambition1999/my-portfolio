// Runs before the stylesheet to restore the saved theme before first paint.
(() => {
  'use strict';

  // Restore the preference before first paint; storage can be blocked in file:// mode.
  try {
    const saved = localStorage.getItem('portfolio-theme');
    document.documentElement.dataset.theme = ['light', 'dark'].includes(saved)
      ? saved
      : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch (_) {
    document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
})();
