/* ========================================
   ADMIN PANEL — Hidden Portfolio Editor
   Triggered by clicking the "abhijith." logo
   Password stored as SHA-256 hash in localStorage
   All edits persist in localStorage
   ======================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio_admin';
  const DATA_KEY = 'portfolio_data';

  // DOM refs
  const logo = document.getElementById('nav-logo');
  const overlay = document.getElementById('adminOverlay');
  const loginModal = document.getElementById('adminLogin');
  const passwordInput = document.getElementById('adminPassword');
  const loginBtn = document.getElementById('adminLoginBtn');
  const cancelBtn = document.getElementById('adminCancelBtn');
  const errorEl = document.getElementById('adminError');
  const firstTimeEl = document.getElementById('adminFirstTime');
  const panel = document.getElementById('adminPanel');
  const closeBtn = document.getElementById('adminCloseBtn');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const saveBtn = document.getElementById('adminSaveBtn');
  const saveStatus = document.getElementById('adminSaveStatus');

  // ——— Utility: simple hash (SHA-256) ———
  async function hashPassword(pw) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pw);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ——— Storage helpers ———
  function getStoredHash() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function setStoredHash(hash) {
    localStorage.setItem(STORAGE_KEY, hash);
  }

  function isFirstTime() {
    return !getStoredHash();
  }

  function getData() {
    try {
      return JSON.parse(localStorage.getItem(DATA_KEY)) || {};
    } catch {
      return {};
    }
  }

  function setData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }

  // ——— Login modal ———
  function showLogin() {
    overlay.classList.add('active');
    loginModal.classList.add('active');
    passwordInput.value = '';
    errorEl.textContent = '';
    passwordInput.focus();

    if (isFirstTime()) {
      firstTimeEl.classList.remove('hidden');
    } else {
      firstTimeEl.classList.add('hidden');
    }
  }

  function hideLogin() {
    overlay.classList.remove('active');
    loginModal.classList.remove('active');
    errorEl.textContent = '';
  }

  async function attemptLogin() {
    const pw = passwordInput.value.trim();
    if (!pw) {
      errorEl.textContent = 'Please enter a password.';
      return;
    }

    const hash = await hashPassword(pw);

    if (isFirstTime()) {
      // First time — set the password
      setStoredHash(hash);
      hideLogin();
      openPanel();
    } else {
      // Verify
      if (hash === getStoredHash()) {
        hideLogin();
        openPanel();
      } else {
        errorEl.textContent = 'Incorrect password. Try again.';
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  }

  // ——— Editor panel ———
  function openPanel() {
    panel.classList.add('active');
    populateFields();
  }

  function closePanel() {
    panel.classList.remove('active');
  }

  function logout() {
    closePanel();
    // Session logout only — password remains stored
  }

  // ——— Field mapping ———
  // Each editable field maps to a DOM element on the page
  const fieldMap = {
    'edit-hero-name': {
      get: () => document.querySelector('.gradient-text')?.textContent || '',
      set: (v) => { const el = document.querySelector('.gradient-text'); if (el) el.textContent = v; }
    },
    'edit-hero-role': {
      get: () => document.querySelector('.hero-role')?.textContent || '',
      set: (v) => { const el = document.querySelector('.hero-role'); if (el) el.textContent = v; }
    },
    'edit-hero-desc': {
      get: () => document.querySelector('.hero-description')?.textContent?.trim() || '',
      set: (v) => { const el = document.querySelector('.hero-description'); if (el) el.textContent = v; }
    },
    'edit-about-title': {
      get: () => document.querySelector('#about .section-title')?.innerHTML || '',
      set: (v) => { const el = document.querySelector('#about .section-title'); if (el) el.innerHTML = v; }
    },
    'edit-email': {
      get: () => {
        const el = document.querySelector('#contact-email .contact-link-value');
        return el ? el.textContent : '';
      },
      set: (v) => {
        const val = document.querySelector('#contact-email .contact-link-value');
        const link = document.querySelector('#contact-email');
        if (val) val.textContent = v;
        if (link) link.href = 'mailto:' + v;
      }
    },
    'edit-linkedin': {
      get: () => {
        const link = document.querySelector('#contact-linkedin');
        return link ? link.href : '';
      },
      set: (v) => {
        const link = document.querySelector('#contact-linkedin');
        const val = document.querySelector('#contact-linkedin .contact-link-value');
        if (link) link.href = v;
        if (val) {
          try {
            const url = new URL(v);
            val.textContent = url.hostname + url.pathname.replace(/\/$/, '');
          } catch {
            val.textContent = v;
          }
        }
      }
    },
    'edit-github': {
      get: () => {
        const link = document.querySelector('#contact-github');
        return link ? link.href : '';
      },
      set: (v) => {
        const link = document.querySelector('#contact-github');
        const val = document.querySelector('#contact-github .contact-link-value');
        if (link) link.href = v;
        if (val) {
          try {
            const url = new URL(v);
            val.textContent = url.hostname + url.pathname.replace(/\/$/, '');
          } catch {
            val.textContent = v;
          }
        }
        // Also update footer GitHub link
        const footerGH = document.querySelector('.footer-links a[aria-label="GitHub"]');
        if (footerGH) footerGH.href = v;
      }
    },
    'edit-instagram': {
      get: () => {
        const val = document.querySelector('#contact-instagram .contact-link-value');
        return val ? val.textContent.replace('@', '') : '';
      },
      set: (v) => {
        const clean = v.replace('@', '');
        const val = document.querySelector('#contact-instagram .contact-link-value');
        const link = document.querySelector('#contact-instagram');
        if (val) val.textContent = '@' + clean;
        if (link) link.href = 'https://instagram.com/' + clean;
        // Also update footer Instagram link
        const footerIG = document.querySelector('.footer-links a[aria-label="Instagram"]');
        if (footerIG) footerIG.href = 'https://instagram.com/' + clean;
      }
    },
    'edit-web3forms-key': {
      get: () => {
        const el = document.getElementById('web3forms-key');
        return el ? el.value : '';
      },
      set: (v) => {
        const el = document.getElementById('web3forms-key');
        if (el) el.value = v;
      }
    }
  };

  // Stat cards (index 0-3)
  for (let i = 0; i < 4; i++) {
    const numId = `edit-stat-${i + 1}-num`;
    const labelId = `edit-stat-${i + 1}-label`;

    fieldMap[numId] = {
      get: () => {
        const cards = document.querySelectorAll('.stat-card');
        return cards[i] ? cards[i].querySelector('.stat-number')?.textContent || '' : '';
      },
      set: (v) => {
        const cards = document.querySelectorAll('.stat-card');
        if (cards[i]) {
          const numEl = cards[i].querySelector('.stat-number');
          if (numEl) numEl.textContent = v;
        }
      }
    };

    fieldMap[labelId] = {
      get: () => {
        const cards = document.querySelectorAll('.stat-card');
        return cards[i] ? cards[i].querySelector('.stat-label')?.textContent || '' : '';
      },
      set: (v) => {
        const cards = document.querySelectorAll('.stat-card');
        if (cards[i]) {
          const labelEl = cards[i].querySelector('.stat-label');
          if (labelEl) labelEl.textContent = v;
        }
      }
    };
  }

  function populateFields() {
    const saved = getData();
    for (const [id, mapping] of Object.entries(fieldMap)) {
      const input = document.getElementById(id);
      if (input) {
        // Use saved data if available, otherwise read from DOM
        input.value = saved[id] !== undefined ? saved[id] : mapping.get();
      }
    }
  }

  function saveChanges() {
    const data = {};

    for (const [id, mapping] of Object.entries(fieldMap)) {
      const input = document.getElementById(id);
      if (input) {
        const value = input.value;
        data[id] = value;
        mapping.set(value);
      }
    }

    setData(data);

    // Show feedback
    saveStatus.textContent = '✓ Changes saved successfully!';
    saveBtn.style.background = '#22c55e';

    setTimeout(() => {
      saveStatus.textContent = '';
      saveBtn.style.background = '';
    }, 2500);
  }

  // ——— Apply saved data on page load ———
  function applySavedData() {
    const saved = getData();
    if (!saved || Object.keys(saved).length === 0) return;

    for (const [id, value] of Object.entries(saved)) {
      if (fieldMap[id]) {
        fieldMap[id].set(value);
      }
    }
  }

  // ——— Event listeners ———

  // Logo click → show login (prevent default nav)
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showLogin();
  });

  // Login actions
  loginBtn.addEventListener('click', attemptLogin);
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });
  cancelBtn.addEventListener('click', hideLogin);
  overlay.addEventListener('click', hideLogin);

  // Panel actions
  closeBtn.addEventListener('click', closePanel);
  logoutBtn.addEventListener('click', logout);
  saveBtn.addEventListener('click', saveChanges);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (loginModal.classList.contains('active')) hideLogin();
      if (panel.classList.contains('active')) closePanel();
    }
  });

  // Apply saved data on load
  applySavedData();

})();
