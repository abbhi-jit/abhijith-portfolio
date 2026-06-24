(function() {
  'use strict';

  // State
  var currentEditId = null;

  // DOM Elements
  var loginModal = document.getElementById('adminLogin');
  var overlay = document.getElementById('adminOverlay');
  var panel = document.getElementById('adminPanel');
  
  // Auth Elements
  var emailInput = document.getElementById('adminEmail');
  var passwordInput = document.getElementById('adminPassword');
  var loginBtn = document.getElementById('adminLoginBtn');
  var cancelBtn = document.getElementById('adminCancelBtn');
  var errorMsg = document.getElementById('adminError');
  var navLogo = document.getElementById('nav-logo');
  var logoutBtn = document.getElementById('adminLogoutBtn');
  var closeBtn = document.getElementById('adminCloseBtn');

  // Listeners for Login / Auth
  if (navLogo) {
    navLogo.addEventListener('click', function(e) {
      e.preventDefault();
      // If already logged in, just open panel
      if (auth.currentUser) {
        openPanel();
      } else {
        showLogin();
      }
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', attemptLogin);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideLogin);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      auth.signOut().then(function() {
        closePanel();
      });
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') attemptLogin();
    });
  }

  auth.onAuthStateChanged(function(user) {
    if (user) {
      hideLogin();
    } else {
      closePanel();
    }
  });

  function showLogin() {
    overlay.classList.add('active');
    loginModal.classList.add('active');
    emailInput.focus();
    errorMsg.textContent = '';
  }

  function hideLogin() {
    overlay.classList.remove('active');
    loginModal.classList.remove('active');
    emailInput.value = '';
    passwordInput.value = '';
  }

  function attemptLogin() {
    var email = emailInput.value.trim();
    var pwd = passwordInput.value;
    if (!email || !pwd) {
      errorMsg.textContent = 'Enter email and password';
      return;
    }

    auth.signInWithEmailAndPassword(email, pwd)
      .then(function() {
        hideLogin();
        openPanel();
      })
      .catch(function(error) {
        errorMsg.textContent = error.message;
      });
  }

  function openPanel() {
    panel.classList.add('active');
    populateAllFields();
  }

  function closePanel() {
    panel.classList.remove('active');
  }

  // Populate basic text fields
  function populateAllFields() {
    var config = window.currentSiteConfig || {};
    
    if (config.hero) {
      document.getElementById('edit-hero-name').value = config.hero.name || '';
      document.getElementById('edit-hero-role').value = config.hero.role || '';
      document.getElementById('edit-hero-desc').value = config.hero.description || '';
      document.getElementById('edit-hero-badge').value = config.hero.badge || '';
      document.getElementById('edit-hero-resume').value = config.hero.resumeUrl || '';
    }

    if (config.about) {
      document.getElementById('edit-about-title').value = config.about.title || '';
      document.getElementById('edit-about-subtitle').value = config.about.subtitle || '';
      if (config.about.paragraphs) {
        document.getElementById('edit-about-para-1').value = config.about.paragraphs[0] || '';
        document.getElementById('edit-about-para-2').value = config.about.paragraphs[1] || '';
        document.getElementById('edit-about-para-3').value = config.about.paragraphs[2] || '';
      }
      if (config.about.stats) {
        config.about.stats.forEach(function(stat, i) {
          var n = i + 1;
          document.getElementById('edit-stat-' + n + '-num').value = stat.num || '';
          document.getElementById('edit-stat-' + n + '-label').value = stat.label || '';
        });
      }
    }

    if (config.contact) {
      document.getElementById('edit-email').value = config.contact.email || '';
      document.getElementById('edit-linkedin').value = config.contact.linkedin || '';
      document.getElementById('edit-github').value = config.contact.github || '';
      document.getElementById('edit-instagram').value = config.contact.instagram || '';
      document.getElementById('edit-web3forms-key').value = config.contact.web3formsKey || '';
    }

    if (config.footer) {
      document.getElementById('edit-footer-text').value = config.footer.text || '';
    }

    // Refresh lists
    populateSkillsList();
    populateProjectsList();
    populateJourneyList();
  }

  function showSaveSuccess(btn) {
    var oldText = btn.innerHTML;
    var oldBg = btn.style.backgroundColor;
    btn.innerHTML = '✓ Saved';
    btn.style.backgroundColor = '#10B981'; // green
    setTimeout(function() {
      btn.innerHTML = oldText;
      btn.style.backgroundColor = oldBg;
    }, 2000);
  }

  // Save buttons
  document.getElementById('adminSaveHero').addEventListener('click', function() {
    var btn = this;
    var data = {
      hero: {
        name: document.getElementById('edit-hero-name').value,
        role: document.getElementById('edit-hero-role').value,
        description: document.getElementById('edit-hero-desc').value,
        badge: document.getElementById('edit-hero-badge').value,
        resumeUrl: document.getElementById('edit-hero-resume').value
      }
    };
    db.collection('config').doc('site').set(data, { merge: true }).then(function() {
      showSaveSuccess(btn);
      var newConf = Object.assign({}, window.currentSiteConfig, data);
      window.applySiteConfig(newConf);
    });
  });

  document.getElementById('adminSaveAbout').addEventListener('click', function() {
    var btn = this;
    var data = {
      about: {
        title: document.getElementById('edit-about-title').value,
        subtitle: document.getElementById('edit-about-subtitle').value,
        paragraphs: [
          document.getElementById('edit-about-para-1').value,
          document.getElementById('edit-about-para-2').value,
          document.getElementById('edit-about-para-3').value
        ],
        stats: [
          { num: document.getElementById('edit-stat-1-num').value, label: document.getElementById('edit-stat-1-label').value },
          { num: document.getElementById('edit-stat-2-num').value, label: document.getElementById('edit-stat-2-label').value },
          { num: document.getElementById('edit-stat-3-num').value, label: document.getElementById('edit-stat-3-label').value },
          { num: document.getElementById('edit-stat-4-num').value, label: document.getElementById('edit-stat-4-label').value }
        ]
      }
    };
    db.collection('config').doc('site').set(data, { merge: true }).then(function() {
      showSaveSuccess(btn);
      var newConf = Object.assign({}, window.currentSiteConfig, data);
      window.applySiteConfig(newConf);
    });
  });

  document.getElementById('adminSaveContact').addEventListener('click', function() {
    var btn = this;
    var data = {
      contact: Object.assign({}, window.currentSiteConfig.contact, {
        email: document.getElementById('edit-email').value,
        linkedin: document.getElementById('edit-linkedin').value,
        github: document.getElementById('edit-github').value,
        instagram: document.getElementById('edit-instagram').value,
        web3formsKey: document.getElementById('edit-web3forms-key').value
      })
    };
    db.collection('config').doc('site').set(data, { merge: true }).then(function() {
      showSaveSuccess(btn);
      var newConf = Object.assign({}, window.currentSiteConfig, data);
      window.applySiteConfig(newConf);
    });
  });

  document.getElementById('adminSaveFooter').addEventListener('click', function() {
    var btn = this;
    var data = {
      footer: { text: document.getElementById('edit-footer-text').value }
    };
    db.collection('config').doc('site').set(data, { merge: true }).then(function() {
      showSaveSuccess(btn);
      var newConf = Object.assign({}, window.currentSiteConfig, data);
      window.applySiteConfig(newConf);
    });
  });

  // Basic CRUD template generators
  function createCrudItem(id, label, onEdit, onDelete) {
    var wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.justifyContent = 'space-between';
    wrap.style.alignItems = 'center';
    wrap.style.background = 'rgba(255,255,255,0.03)';
    wrap.style.padding = '8px 12px';
    wrap.style.borderRadius = '6px';
    wrap.style.marginBottom = '8px';
    wrap.style.border = '1px solid rgba(255,255,255,0.05)';

    var labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.style.fontSize = '0.9rem';

    var actions = document.createElement('div');
    var editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'admin-btn secondary small';
    editBtn.style.padding = '2px 8px';
    editBtn.style.marginRight = '4px';
    editBtn.onclick = function() { onEdit(id); };

    var delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.className = 'admin-btn danger small';
    delBtn.style.padding = '2px 8px';
    delBtn.onclick = function() {
      if (confirm('Are you sure you want to delete this?')) onDelete(id);
    };

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    wrap.appendChild(labelEl);
    wrap.appendChild(actions);

    return wrap;
  }

  // ======================== SKILLS CRUD ========================
  function populateSkillsList() {
    var list = document.getElementById('adminSkillsList');
    list.innerHTML = '';
    (window.currentSkills || []).forEach(function(skill) {
      list.appendChild(createCrudItem(skill.id, skill.name + ' (' + skill.category + ')', editSkill, deleteSkill));
    });
  }

  function deleteSkill(id) {
    db.collection('skills').doc(id).delete().then(function() {
      window.loadSkills();
      setTimeout(populateSkillsList, 500);
    });
  }

  function editSkill(id) {
    var skill = window.currentSkills.find(function(s) { return s.id === id; });
    var name = prompt('Skill Name:', skill ? skill.name : '');
    if (!name) return;
    var cat = prompt('Category:', skill ? skill.category : '');
    var icon = prompt('SVG Icon:', skill ? skill.iconSvg : '');
    var order = prompt('Order index:', skill ? skill.order : '10');

    var data = { name: name, category: cat, iconSvg: icon, order: parseInt(order) || 10 };
    var req = id ? db.collection('skills').doc(id).set(data) : db.collection('skills').add(data);
    req.then(function() {
      window.loadSkills();
      setTimeout(populateSkillsList, 500);
    });
  }
  
  document.getElementById('adminAddSkill').addEventListener('click', function() { editSkill(null); });


  // ======================== PROJECTS CRUD ========================
  function populateProjectsList() {
    var list = document.getElementById('adminProjectsList');
    list.innerHTML = '';
    (window.currentProjects || []).forEach(function(proj) {
      list.appendChild(createCrudItem(proj.id, proj.title, editProject, deleteProject));
    });
  }

  function deleteProject(id) {
    db.collection('projects').doc(id).delete().then(function() {
      window.loadProjects();
      setTimeout(populateProjectsList, 500);
    });
  }

  function editProject(id) {
    var p = window.currentProjects.find(function(x) { return x.id === id; });
    var title = prompt('Project Title:', p ? p.title : '');
    if (!title) return;
    var desc = prompt('Description:', p ? p.description : '');
    var cat = prompt('Category (e.g. web, code, design):', p ? p.category : '');
    var badge = prompt('Badge Text:', p ? p.badgeText : '');
    var img = prompt('Image URL (or assets/path):', p ? p.mediaSrc : '');
    var url = prompt('Live URL (# for none):', p && p.links[0] ? p.links[0].url : '#');
    var order = prompt('Order index:', p ? p.order : '10');

    var data = {
      title: title, description: desc, category: cat, badgeText: badge,
      mediaSrc: img, mediaType: 'image', tags: p ? p.tags : [],
      featured: p ? p.featured : false, order: parseInt(order) || 10,
      links: [{ text: 'Live Demo', url: url, type: 'primary', icon: window.LINK_ICON }]
    };

    var req = id ? db.collection('projects').doc(id).set(data) : db.collection('projects').add(data);
    req.then(function() {
      window.loadProjects();
      setTimeout(populateProjectsList, 500);
    });
  }

  document.getElementById('adminAddProject').addEventListener('click', function() { editProject(null); });

  // ======================== JOURNEY CRUD ========================
  function populateJourneyList() {
    var list = document.getElementById('adminJourneyList');
    list.innerHTML = '';
    (window.currentJourney || []).forEach(function(item) {
      list.appendChild(createCrudItem(item.id, item.date + ' - ' + item.title, editJourney, deleteJourney));
    });
  }

  function deleteJourney(id) {
    db.collection('journey').doc(id).delete().then(function() {
      window.loadJourney();
      setTimeout(populateJourneyList, 500);
    });
  }

  function editJourney(id) {
    var j = window.currentJourney.find(function(x) { return x.id === id; });
    var title = prompt('Milestone Title:', j ? j.title : '');
    if (!title) return;
    var date = prompt('Date range:', j ? j.date : '2025');
    var subtitle = prompt('Subtitle:', j ? j.subtitle : '');
    var desc = prompt('Description:', j ? j.description : '');
    var order = prompt('Order index:', j ? j.order : '10');

    var data = {
      title: title, date: date, subtitle: subtitle, description: desc, order: parseInt(order) || 10
    };

    var req = id ? db.collection('journey').doc(id).set(data) : db.collection('journey').add(data);
    req.then(function() {
      window.loadJourney();
      setTimeout(populateJourneyList, 500);
    });
  }

  document.getElementById('adminAddJourney').addEventListener('click', function() { editJourney(null); });


  // ======================== SEED SCRIPT ========================
  document.getElementById('adminSeedBtn').addEventListener('click', function() {
    if (!confirm('This will overwrite Firestore with initial data. Proceed?')) return;
    var status = document.getElementById('adminSeedStatus');
    status.textContent = 'Seeding...';
    
    // Seed Site Config
    db.collection('config').doc('site').set({
      hero: {
        name: 'Abhijith S',
        role: 'Computer Science Student & Developer',
        description: 'I build thoughtful digital products at the intersection of web technologies, artificial intelligence, and design — turning ideas into elegant, functional experiences.',
        badge: 'Open to opportunities',
        resumeUrl: '#'
      },
      about: {
        title: 'Passionate about crafting<br />digital experiences',
        subtitle: 'A quick look at who I am and what drives me forward.',
        paragraphs: [
          'I am a passionate developer focusing on building functional, visually stunning web applications and integrating intelligent features using AI. Based on my computer science background, I continuously strive to blend logic with creativity.',
          'Currently exploring advanced web frameworks and artificial intelligence, I aim to create seamless user experiences that solve real-world problems. Design thinking is a core part of my process.',
          'When I am not coding, I am usually reading up on the latest tech trends or experimenting with new design tools to refine my aesthetic sensibilities.'
        ],
        stats: [
          { num: '5+', label: 'Projects Completed' },
          { num: '9+', label: 'Technologies Learned' },
          { num: '3+', label: 'Certifications Earned' },
          { num: '∞', label: 'Curiosity & Drive' }
        ]
      },
      contact: {
        title: 'Let\'s work together',
        subtitle: 'Have a project idea or just want to say hello? I\'d love to hear from you.',
        intro: 'I\'m currently open to freelance projects, internship opportunities, and collaborations. Feel free to reach out through any of the channels below.',
        email: 'iamabhijith11@gmail.com',
        linkedin: 'https://linkedin.com/in/abhijith-s',
        github: 'https://github.com/abbhi-jit',
        instagram: 'abb.hi_',
        web3formsKey: 'ea446e19-0351-4612-a806-0285cd36a317'
      },
      footer: {
        text: '© 2025 Abhijith S. Built with ♥ and clean code.'
      }
    });

    // Seed projects, skills, journey if needed
    var defaultSkills = [
      { id: 'html', name: 'HTML5', category: 'Frontend', order: 10, iconSvg: '<svg viewBox="0 0 512 512" width="44" height="44"><path fill="#E34F26" d="M71,460 L30,4 L482,4 L441,460 L256,512 Z"/><path fill="#EF652A" d="M256,472 L405,431 L440,37 L256,37 Z"/><path fill="#EBEBEB" d="M256,208 L181,208 L176,150 L256,150 L256,94 L114,94 L136,320 L256,320 Z"/><path fill="#FFFFFF" d="M256,208 L256,264 L325,264 L318,341 L256,358 L256,416 L381,381 L396,208 Z"/></svg>' },
      { id: 'css', name: 'CSS3', category: 'Frontend', order: 20, iconSvg: '<svg viewBox="0 0 512 512" width="44" height="44"><path fill="#1572B6" d="M71,460 L30,4 L482,4 L441,460 L256,512 Z"/><path fill="#33A9DC" d="M256,472 L405,431 L440,37 L256,37 Z"/><path fill="#EBEBEB" d="M256,208 L181,208 L176,150 L256,150 L256,94 L114,94 L136,320 L256,320 Z"/><path fill="#FFFFFF" d="M256,208 L256,264 L325,264 L318,341 L256,358 L256,416 L381,381 L396,208 Z"/></svg>' },
      { id: 'js', name: 'JavaScript', category: 'Language', order: 30, iconSvg: '<svg viewBox="0 0 128 128" width="44" height="44"><path fill="#F0DB4F" d="M1.408 1.408h125.184v125.184H1.408z"/><path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.21 58.943l-.024 31.06c0 4.157.167 7.954-.361 9.123-.871 2.387-3.174 3.149-5.236 2.596-2.179-1.021-3.274-2.531-4.536-4.698l-1.024-.504c-3.044 1.876-6.088 3.752-9.144 5.604 1.533 3.195 3.778 5.923 6.733 7.693 4.397 2.521 10.275 3.349 16.573 1.964 4.074-1.142 7.588-3.665 9.44-7.406 2.685-5.128 2.11-11.37 2.086-18.332.066-10.381.024-20.774.024-31.184H69.21z"/></svg>' },
      { id: 'python', name: 'Python', category: 'Language', order: 40, iconSvg: '<svg viewBox="0 0 128 128" width="44" height="44"><linearGradient id="pyA" gradientUnits="userSpaceOnUse" x1="12.959" y1="12.039" x2="69.834" y2="69.414"><stop offset="0" stop-color="#387EB8"/><stop offset="1" stop-color="#366994"/></linearGradient><path fill="url(#pyA)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"/><linearGradient id="pyB" gradientUnits="userSpaceOnUse" x1="60.648" y1="62.304" x2="120.791" y2="117.165"><stop offset="0" stop-color="#FFC331"/><stop offset="1" stop-color="#F5A623"/></linearGradient><path fill="url(#pyB)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"/></svg>' },
      { id: 'sql', name: 'SQL', category: 'Database', order: 50, iconSvg: '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#8B5CF6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
      { id: 'cpp', name: 'C++', category: 'Language', order: 60, iconSvg: '<svg viewBox="0 0 128 128" width="44" height="44"><path fill="#659AD2" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/><path fill="#03599C" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"/><path fill="#fff" d="M100 59v6h-6v6h6v6h6v-6h6v-6h-6v-6zm-18 0v6h-6v6h6v6h6v-6h6v-6h-6v-6z"/></svg>' },
      { id: 'c', name: 'C', category: 'Language', order: 70, iconSvg: '<svg viewBox="0 0 128 128" width="44" height="44"><path fill="#659AD2" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/><path fill="#03599C" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"/></svg>' },
      { id: 'figma', name: 'Figma', category: 'Design', order: 80, iconSvg: '<svg viewBox="0 0 128 128" width="44" height="44"><path fill="#0ACF83" d="M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129z"/><path fill="#A259FF" d="M24 64.5C24 52.6 33.6 43 45.5 43H67v43H45.5C33.6 86 24 76.4 24 64.5z"/><path fill="#F24E1E" d="M24 21.5C24 9.6 33.6 0 45.5 0H67v43H45.5C33.6 43 24 33.4 24 21.5z"/><path fill="#FF7262" d="M67 0h21.5C100.4 0 110 9.6 110 21.5S100.4 43 88.5 43H67V0z"/><path fill="#1ABCFE" d="M110 64.5c0 11.9-9.6 21.5-21.5 21.5S67 76.4 67 64.5 76.6 43 88.5 43 110 52.6 110 64.5z"/></svg>' },
      { id: 'github', name: 'GitHub', category: 'Version Control', order: 90, iconSvg: '<svg viewBox="0 0 24 24" width="44" height="44" fill="#A1A1AA"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>' },
      { id: 'chatgpt', name: 'ChatGPT', category: 'AI Tool', order: 100, iconSvg: '<svg viewBox="0 0 24 24" width="44" height="44" fill="#10A37F"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829v-2.3324a.0757.0757 0 0 1 .0332-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.1408 1.6464 4.4708 4.4708 0 0 1 .5346 3.0137l-.1416-.0852-4.783-2.7582a.7712.7712 0 0 0-.7806 0l-5.8428 3.3685zm4.7027-1.4658l-.142.0805-4.7783 2.7582a.7948.7948 0 0 0-.3927.6813v6.7369l-2.02-1.1686a.071.071 0 0 1-.038-.052V8.125a4.504 4.504 0 0 1 4.4945-4.4944 4.4755 4.4755 0 0 1 2.8764 1.0408zM8.9975 5.6172a4.485 4.485 0 0 1-2.3655 1.9728V1.912a.7664.7664 0 0 0-.3879-.6765L.43 2.1187l2.0201-1.1685a.0757.0757 0 0 1 .071 0l4.8303 2.7865c1.4883.8596 2.2224 2.5855 1.6451 4.1805h.001z"/></svg>' },
      { id: 'copilot', name: 'Copilot', category: 'AI Tool', order: 110, iconSvg: '<svg viewBox="0 0 24 24" width="44" height="44" fill="#E2E8F0"><path d="M11.996 0a12 12 0 0 0-3.322 23.53c-.024-1.32-.016-3.29.043-4.14 0 0-3.14.71-3.86-1.55 0 0-.67-1.78-1.68-2.29 0 0-1.41-.99.11-.97 0 0 1.55.12 2.37 1.63 1.38 2.45 3.65 1.74 4.54 1.33.14-1.04.54-1.74.98-2.14-2.66-.31-5.46-1.37-5.46-6.09 0-1.34.46-2.45 1.23-3.31-.13-.31-.54-1.57.11-3.26 0 0 1.02-.33 3.33 1.28.97-.28 2.01-.41 3.05-.42 1.03.01 2.07.14 3.05.42 2.31-1.61 3.32-1.28 3.32-1.28.66 1.69.25 2.95.12 3.26.77.86 1.23 1.97 1.23 3.31 0 4.73-2.8 5.78-5.48 6.08.57.51 1.07 1.51 1.07 3.05 0 2.21-.02 3.99-.02 4.54a12.01 12.01 0 0 0-3.31-23.54z"/></svg>' },
      { id: 'vscode', name: 'VS Code', category: 'Editor', order: 120, iconSvg: '<svg viewBox="0 0 24 24" width="44" height="44" fill="#007ACC"><path d="M17.848 1.543l-8.583 8.358-4.267-3.642L.524 9.176l5.776 5.86-5.776 5.86 4.474 2.917 4.267-3.642 8.583 8.358 5.628-2.673v-21.64l-5.628-2.673zm-8.583 18.016l-3.32-3.36 3.32-2.834v6.194zm0-10.29v6.194l-3.32-2.834 3.32-3.36z"/></svg>' }
    ];
    defaultSkills.forEach(function(s) {
      db.collection('skills').doc(s.id).set(s);
    });
    // ...
    setTimeout(function() {
      status.textContent = 'Seeded basic config!';
      window.loadAllData();
    }, 2000);
  });

})();
