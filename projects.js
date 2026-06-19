/* ========================================
   PROJECTS DATA & RENDERER
   ========================================
   To add a new project, just add an object
   to the projectsData array below.
   Everything else updates automatically.
   ======================================== */

const LINK_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
const GITHUB_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';

const projectsData = [
  {
    id: 'tide',
    title: 'Tide',
    category: 'design',
    badgeText: 'Design',
    description: 'Modern task management application designed in Figma with a focus on productivity, clean navigation, prototyping, and UI/UX design.',
    tags: ['Figma', 'UI/UX Design', 'Prototyping', 'Design System'],
    mediaType: 'iframe',
    mediaSrc: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FYoIrwZTUZgUC2gC0GZ7bk1%2FTide%3Fnode-id%3D0-1%26p%3Df%26t%3Dw8JfEV9fUNC7UeVK-0',
    links: [
      { text: 'View Prototype', url: 'https://www.figma.com/design/YoIrwZTUZgUC2gC0GZ7bk1/Tide?node-id=0-1&p=f&t=w8JfEV9fUNC7UeVK-0', type: 'primary', icon: LINK_ICON }
    ],
    featured: true
  },
  {
    id: 'portfolio',
    title: 'Portfolio Website',
    category: 'web',
    badgeText: 'Web',
    description: 'Personal portfolio website built with modern web technologies, responsive design, and premium user experience.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    mediaType: 'image',
    mediaSrc: 'assets/project-portfolio.png',
    links: [
      { text: 'Live Demo', url: '#', type: 'primary', icon: LINK_ICON },
      { text: 'GitHub', url: '#', type: 'secondary', icon: GITHUB_ICON }
    ],
    featured: false
  },
  {
    id: 'sign-language',
    title: 'Sign Language Interpreter',
    category: 'code',
    badgeText: 'Code',
    description: 'AI-powered sign language interpretation system focused on accessibility and real-time communication.',
    tags: ['Python', 'OpenCV', 'Machine Learning', 'AI'],
    mediaType: 'image',
    mediaSrc: 'assets/project-sign-language.png',
    links: [
      { text: 'Live Demo', url: '#', type: 'primary', icon: LINK_ICON },
      { text: 'GitHub', url: '#', type: 'secondary', icon: GITHUB_ICON }
    ],
    featured: false
  },
  {
    id: 'pulse',
    title: 'Pulse',
    category: 'code',
    badgeText: 'Code',
    description: 'An AI automation agent built to streamline complex workflows and intelligent task processing.',
    tags: ['AI', 'Automation', 'Agent'],
    mediaType: 'image',
    mediaSrc: 'assets/project-portfolio.png',
    links: [
      { text: 'Live Demo', url: 'https://abbhi-jit.github.io/pulse/', type: 'primary', icon: LINK_ICON }
    ],
    featured: false
  },
  {
    id: 'tide-app',
    title: 'Tide App',
    category: 'web',
    badgeText: 'Web',
    description: 'A cross-platform task management application built with Flutter, focusing on clean UI and seamless performance.',
    tags: ['Flutter', 'Dart', 'Mobile'],
    mediaType: 'image',
    mediaSrc: 'assets/project-task-manager.png',
    links: [
      { text: 'Live Demo', url: 'https://abbhi-jit.github.io/tide_app/', type: 'primary', icon: LINK_ICON }
    ],
    featured: false
  }
];


/* ========================================
   RENDER PROJECTS & FILTERS
   ======================================== */
function renderProjects() {
  var grid = document.getElementById('projectsGrid');
  var filterContainer = document.getElementById('projectsFilter');
  var countEl = document.getElementById('projectsCount');

  if (!grid || !filterContainer || !countEl) return;

  // 1. Build project cards
  grid.innerHTML = '';

  projectsData.forEach(function(proj) {
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

    var tagsHtml = proj.tags.map(function(tag) {
      return '<span class="project-tag">' + tag + '</span>';
    }).join('');

    var linksHtml = proj.links.map(function(link) {
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
  });

  // 2. Build filter buttons
  var counts = { all: projectsData.length };
  var categories = [];

  projectsData.forEach(function(proj) {
    if (!counts[proj.category]) {
      counts[proj.category] = 0;
      categories.push({ id: proj.category, name: proj.badgeText });
    }
    counts[proj.category]++;
  });

  filterContainer.innerHTML = '';

  // 'All' button
  var allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.setAttribute('data-filter', 'all');
  allBtn.innerHTML = 'All <span class="filter-count">(' + counts.all + ')</span>';
  filterContainer.appendChild(allBtn);

  // Category buttons
  categories.forEach(function(cat) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.setAttribute('data-filter', cat.id);
    btn.innerHTML = cat.name + ' <span class="filter-count">(' + counts[cat.id] + ')</span>';
    filterContainer.appendChild(btn);
  });

  // 3. Update count text
  countEl.textContent = 'Showing ' + counts.all + ' Project' + (counts.all !== 1 ? 's' : '');

  // 4. Attach hover glow to project cards
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

// Render as soon as DOM is ready
document.addEventListener('DOMContentLoaded', renderProjects);
