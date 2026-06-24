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
    // Simplified for now so user can add them via CRUD UI manually to save quota
    // ...
    setTimeout(function() {
      status.textContent = 'Seeded basic config!';
      window.loadAllData();
    }, 2000);
  });

})();
