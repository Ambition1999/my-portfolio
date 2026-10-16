(() => {
  'use strict';
  // Public contact settings are loaded by config.js before this deferred script.
  const CONTACT = window.PORTFOLIO_CONFIG.contact;
  const $ = (selector) => document.querySelector(selector);

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
    themeToggle.setAttribute('aria-label', dark ? 'Bật giao diện sáng' : 'Bật giao diện tối');
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

  // Mobile navigation, focus handling and dismissal.
  const menu = $('#nav-links');
  const menuToggle = $('#menu-toggle');
  const mobileMedia = matchMedia('(max-width: 600px)');
  function setMenu(open) {
    menu.hidden = mobileMedia.matches && !open;
    menuToggle.setAttribute('aria-expanded', String(open && mobileMedia.matches));
    menuToggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  }
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  mobileMedia.addEventListener('change', () => setMenu(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (mobileMedia.matches && !event.target.closest('.nav')) setMenu(false);
  });
  setMenu(false);

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
  // Render configured public contact information.
  function showContactLink(container, href, label) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (href.startsWith('https:')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    container.classList.remove('pending');
    container.replaceChildren(link);
  }
  const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT.email) && !/[\r\n]/.test(CONTACT.email);
  if (emailReady) {
    showContactLink($('#email-value'), 'mailto:' + CONTACT.email, CONTACT.email);
    $('#submit-label').textContent = 'Mở ứng dụng email';
    $('#submit-icon').setAttribute('href', '#i-external');
    $('#form-hint').textContent = 'Mở bản nháp trong ứng dụng email của bạn. Bạn kiểm tra và gửi tại đó.';
  }
  if (/^https:\/\/(www\.)?linkedin\.com\//i.test(CONTACT.linkedin)) {
    showContactLink($('#linkedin-value'), CONTACT.linkedin, 'Kết nối trên LinkedIn ↗');
  }
  $('#year').textContent = String(new Date().getFullYear());

  // Contact form: clipboard when email is pending, otherwise a mailto draft.
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // Try the selection-based fallback if Clipboard API access is denied.
      }
    }
    // Fallback for directly opening index.html where Clipboard API may be unavailable.
    const previousFocus = document.activeElement;
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('aria-label', 'Lời nhắn cần sao chép');
    helper.className = 'clipboard-helper';
    document.body.append(helper);
    helper.focus();
    helper.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (_) {
      // The caller offers manual copying if both clipboard paths fail.
    }
    helper.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
    return copied;
  }
  $('#contact-form').addEventListener('input', () => {
    $('#form-status').textContent = '';
  });
  $('#contact-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = $('#visitor-name');
    const messageInput = $('#visitor-message');
    nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Vui lòng nhập tên của bạn.');
    messageInput.setCustomValidity(messageInput.value.trim().length >= 10 ? '' : 'Vui lòng nhập lời nhắn có ít nhất 10 ký tự.');
    if (!form.reportValidity()) return;
    const name = nameInput.value.trim();
    const email = $('#visitor-email').value.trim();
    const message = messageInput.value.trim();
    const text = 'Xin chào Toàn,\n\n' + message + '\n\nNgười liên hệ: ' + name + '\nEmail: ' + email;
    if (emailReady) {
      const subject = 'Kết nối từ portfolio — ' + name;
      window.location.href = 'mailto:' + CONTACT.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
      $('#form-status').textContent = 'Đã yêu cầu mở ứng dụng email. Lời nhắn chỉ được gửi khi bạn bấm Gửi trong ứng dụng đó.';
    } else {
      const submit = $('#contact-submit');
      submit.disabled = true;
      try {
        const copied = await copyText(text);
        $('#form-status').textContent = copied ? 'Đã sao chép lời nhắn. Nội dung chưa được gửi.' : 'Trình duyệt không cho phép sao chép. Hãy chọn lời nhắn và dùng Ctrl+C hoặc Cmd+C.';
        if (!copied) {
          messageInput.focus();
          messageInput.select();
        }
      } finally {
        submit.disabled = false;
      }
    }
  });
  // Clear custom errors while editing so native form validation can run again.
  ['#visitor-name', '#visitor-message'].forEach((selector) => {
    $(selector).addEventListener('input', (event) => event.target.setCustomValidity(''));
  });
})();
