/* ========================================
   DATA LAYER (FIRESTORE)
   ======================================== */

// Shared constants
var LINK_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
var GITHUB_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
var CALENDAR_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
var ARROW_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

// Global State
window.currentSiteConfig = null;
window.currentProjects = [];
window.currentSkills = [];
window.currentJourney = [];

function applySiteConfig(config) {
  if (!config) return;
  window.currentSiteConfig = config;

  // Hero
  if (config.hero) {
    var heroName = document.querySelector('.gradient-text');
    if (heroName) heroName.textContent = config.hero.name || '';
    
    var heroRole = document.querySelector('.hero-role');
    if (heroRole) heroRole.textContent = config.hero.role || '';
    
    var heroDesc = document.querySelector('.hero-description');
    if (heroDesc) heroDesc.textContent = config.hero.description || '';
    
    var heroBadge = document.querySelector('.hero-badge span');
    if (heroBadge) heroBadge.textContent = config.hero.badge || '';
    
    var resumeBtn = document.querySelector('.hero-actions .secondary');
    if (resumeBtn && config.hero.resumeUrl) resumeBtn.href = config.hero.resumeUrl;
  }

  // About
  if (config.about) {
    var aboutTitle = document.querySelector('#about .section-title');
    if (aboutTitle) aboutTitle.innerHTML = config.about.title || '';
    
    var aboutSubtitle = document.querySelector('#about .section-subtitle');
    if (aboutSubtitle) aboutSubtitle.textContent = config.about.subtitle || '';
    
    var aboutTextContainer = document.querySelector('.about-text');
    if (aboutTextContainer && config.about.paragraphs) {
      aboutTextContainer.innerHTML = '';
      config.about.paragraphs.forEach(function(para) {
        var p = document.createElement('p');
        p.textContent = para;
        aboutTextContainer.appendChild(p);
      });
    }

    if (config.about.stats) {
      var statCards = document.querySelectorAll('.stat-card');
      config.about.stats.forEach(function(stat, i) {
        if (statCards[i]) {
          statCards[i].querySelector('.stat-number').textContent = stat.num;
          statCards[i].querySelector('.stat-label').textContent = stat.label;
        }
      });
    }
  }

  // Contact
  if (config.contact) {
    var contactTitle = document.querySelector('#contact .section-title');
    if (contactTitle) contactTitle.textContent = config.contact.title || '';
    
    var contactSubtitle = document.querySelector('#contact .section-subtitle');
    if (contactSubtitle) contactSubtitle.textContent = config.contact.subtitle || '';
    
    var contactText = document.querySelector('.contact-text');
    if (contactText) contactText.textContent = config.contact.intro || '';
    
    var contactEmail = document.getElementById('contact-email');
    if (contactEmail) {
      contactEmail.href = 'mailto:' + config.contact.email;
      contactEmail.querySelector('.contact-link-value').textContent = config.contact.email;
    }
    
    var contactLinkedin = document.getElementById('contact-linkedin');
    if (contactLinkedin) {
      contactLinkedin.href = config.contact.linkedin;
      contactLinkedin.querySelector('.contact-link-value').textContent = config.contact.linkedin.replace('https://', '').replace('www.', '');
    }
    
    var contactGithub = document.getElementById('contact-github');
    if (contactGithub) {
      contactGithub.href = config.contact.github;
      contactGithub.querySelector('.contact-link-value').textContent = config.contact.github.replace('https://', '').replace('www.', '');
    }
    
    var contactInstagram = document.getElementById('contact-instagram');
    if (contactInstagram) {
      contactInstagram.href = 'https://instagram.com/' + config.contact.instagram;
      contactInstagram.querySelector('.contact-link-value').textContent = '@' + config.contact.instagram;
    }

    var web3formsKey = document.getElementById('web3forms-key');
    if (web3formsKey) {
      web3formsKey.value = config.contact.web3formsKey;
    }
    
    // Footer social links
    var footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(function(a) {
      var label = a.getAttribute('aria-label');
      if (label === 'GitHub') a.href = config.contact.github;
      else if (label === 'LinkedIn') a.href = config.contact.linkedin;
      else if (label === 'Instagram') a.href = 'https://instagram.com/' + config.contact.instagram;
    });
  }

  // Footer
  if (config.footer) {
    var footerText = document.querySelector('.footer-text');
    if (footerText) footerText.textContent = config.footer.text || '';
  }
}

function renderProjectCards(projects) {
  var grid = document.getElementById('projectsGrid');
  var filterContainer = document.getElementById('projectsFilter');
  var countEl = document.getElementById('projectsCount');

  if (!grid || !filterContainer || !countEl) return;
  grid.innerHTML = '';
  
  window.currentProjects = projects;

  var counts = { all: projects.length };
  var categories = [];

  projects.forEach(function(proj) {
    var mediaHtml = '';
    if (proj.mediaType === 'iframe') {
      mediaHtml = '<div class="project-image-wrap figma-embed-wrap">' +
        '<iframe style="border: none;" width="100%" height="100%" src="' + proj.mediaSrc + '" allowfullscreen></iframe>' +
        '</div>';
    } else {
      mediaHtml = '<div class="project-image-wrap">' +
        '<img src="' + proj.mediaSrc + '" alt="' + proj.title + '" loading="lazy" />' +
        '<div class="project-image-overlay"></div>' +
        '</div>';
    }

    var tagsHtml = (proj.tags || []).map(function(tag) {
      return '<span class="project-tag">' + tag + '</span>';
    }).join('');

    var linksHtml = (proj.links || []).map(function(link) {
      var target = link.url !== '#' ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + link.url + '"' + target + ' class="project-link ' + link.type + '">' + link.icon + link.text + '</a>';
    }).join('');

    var card = document.createElement('div');
    card.className = 'project-card' + (proj.featured ? ' featured-project' : '');
    card.setAttribute('data-category', proj.category);

    card.innerHTML = mediaHtml +
      '<div class="project-content">' +
        '<div class="project-meta">' +
          '<h3 class="project-title">' + proj.title + '</h3>' +
          '<span class="category-badge ' + proj.category + '">' + proj.badgeText + '</span>' +
        '</div>' +
        '<p class="project-description">' + proj.description + '</p>' +
        '<div class="project-tags">' + tagsHtml + '</div>' +
        '<div class="project-links">' + linksHtml + '</div>' +
      '</div>';

    grid.appendChild(card);

    if (!counts[proj.category]) {
      counts[proj.category] = 0;
      categories.push({ id: proj.category, name: proj.badgeText });
    }
    counts[proj.category]++;
  });

  filterContainer.innerHTML = '';
  var allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.setAttribute('data-filter', 'all');
  allBtn.innerHTML = 'All <span class="filter-count">(' + counts.all + ')</span>';
  filterContainer.appendChild(allBtn);

  categories.forEach(function(cat) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.setAttribute('data-filter', cat.id);
    btn.innerHTML = cat.name + ' <span class="filter-count">(' + counts[cat.id] + ')</span>';
    filterContainer.appendChild(btn);
  });

  countEl.textContent = 'Showing ' + counts.all + ' Project' + (counts.all !== 1 ? 's' : '');

  document.querySelectorAll('.project-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      card.style.background =
        'radial-gradient(400px circle at ' + x + 'px ' + y + 'px, rgba(139, 92, 246, 0.06), transparent 40%), rgba(17, 17, 17, 0.7)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.background = '';
    });
  });
}


function renderSkillCards(skills) {
  var grid = document.getElementById('skillsGrid');
  if (!grid || skills.length === 0) return;
  grid.innerHTML = '';
  
  window.currentSkills = skills;

  skills.forEach(function(skill, i) {
    var delay = (i % 8) + 1;
    var card = document.createElement('div');
    card.className = 'skill-card reveal reveal-delay-' + delay;
    
    card.innerHTML = 
      '<div class="skill-icon">' + skill.iconSvg + '</div>' +
      '<div class="skill-name">' + skill.name + '</div>' +
      '<div class="skill-category">' + skill.category + '</div>';
      
    grid.appendChild(card);
    
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var rotateX = ((y / rect.height) - 0.5) * -15;
      var rotateY = ((x / rect.width) - 0.5) * 15;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
}

function renderJourneyItems(items) {
  var timeline = document.getElementById('journeyTimeline');
  if (!timeline) return;
  timeline.innerHTML = '';
  
  window.currentJourney = items;

  items.forEach(function(item, i) {
    var delay = 3 + i;
    var div = document.createElement('div');
    div.className = 'timeline-item reveal reveal-delay-' + delay;
    
    div.innerHTML = 
      '<div class="timeline-dot"></div>' +
      '<div class="timeline-date">' + item.date + '</div>' +
      '<div class="timeline-card">' +
        '<h3 class="timeline-title">' + item.title + '</h3>' +
        '<div class="timeline-subtitle">' + item.subtitle + '</div>' +
        '<p class="timeline-description">' + item.description + '</p>' +
      '</div>';
      
    timeline.appendChild(div);
  });
}

function loadSiteConfig() {
  return db.collection('config').doc('site').get().then(function(doc) {
    if (doc.exists) applySiteConfig(doc.data());
  }).catch(function(e) { console.error("Error config:", e); });
}

function loadProjects() {
  return db.collection('projects').orderBy('order', 'asc').get().then(function(snap) {
    var res = [];
    snap.forEach(function(doc) { 
      var d = doc.data(); 
      d.id = doc.id; 
      res.push(d); 
    });
    renderProjectCards(res);
  }).catch(function(e) { console.error("Error projects:", e); });
}


function loadSkills() {
  return db.collection('skills').orderBy('order', 'asc').get().then(function(snap) {
    var res = [];
    snap.forEach(function(doc) { 
      var d = doc.data(); 
      d.id = doc.id; 
      res.push(d); 
    });
    renderSkillCards(res);
  }).catch(function(e) { console.error("Error skills:", e); });
}

function loadJourney() {
  return db.collection('journey').orderBy('order', 'asc').get().then(function(snap) {
    var res = [];
    snap.forEach(function(doc) { 
      var d = doc.data(); 
      d.id = doc.id; 
      res.push(d); 
    });
    renderJourneyItems(res);
  }).catch(function(e) { console.error("Error journey:", e); });
}

function loadAllData() {
  Promise.all([
    loadSiteConfig(),
    loadProjects(),
    loadSkills(),
    loadJourney()
  ]).then(function() {
    // Re-init UI scripts after DOM is built
    if (typeof initProjectFilter === 'function') initProjectFilter();
    if (typeof initScrollReveal === 'function') initScrollReveal();
    if (typeof initStatCounters === 'function') initStatCounters();
    
    // Trigger scroll event to apply reveal classes immediately
    window.dispatchEvent(new Event('scroll'));
  });
}

document.addEventListener('DOMContentLoaded', loadAllData);
