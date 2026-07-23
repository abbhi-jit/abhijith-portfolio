/* ========================================
   PORTFOLIO JAVASCRIPT
   Abhijith S — Premium Portfolio
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initSmoothScroll();
  initParallax();
  initStatCounters();
  initParticles();
  initTimelineProgress();
});

/* ========================================
   PARTICLES.JS BACKGROUND
   ======================================== */
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 60,
          "density": { "enable": true, "value_area": 800 }
        },
        "color": { "value": ["#ffffff", "#8B5CF6", "#fde047"] },
        "shape": { "type": "circle" },
        "opacity": {
          "value": 0.8,
          "random": true,
          "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
        },
        "size": {
          "value": 2.5,
          "random": true,
          "anim": { "enable": true, "speed": 2, "size_min": 0.5, "sync": false }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#8B5CF6",
          "opacity": 0.15,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
        }
      },
      "interactivity": {
        "detect_on": "window",
        "events": {
          "onhover": { "enable": false, "mode": [] },
          "onclick": { "enable": true, "mode": ["push", "remove"] },
          "resize": true
        },
        "modes": {
          "grab": { "distance": 200, "line_linked": { "opacity": 0.5 } },
          "bubble": { "distance": 250, "size": 6, "duration": 2, "opacity": 1, "speed": 3 },
          "repulse": { "distance": 200, "duration": 0.4 },
          "push": { "particles_nb": 1 },
          "remove": { "particles_nb": 1 }
        }
      },
      "retina_detect": true
    });

    // Custom physics: attract particles to mouse pointer
    setTimeout(() => {
      if (window.pJSDom && window.pJSDom.length > 0) {
        const pJS = window.pJSDom[0].pJS;
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;
        
        window.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          isMoving = true;
          
          pJS.particles.array.forEach(p => {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Symbiotic behavior: attract if far, repel if too close (to prevent cluttering)
            if (dist < 250) {
              if (dist > 60) {
                const force = (250 - dist) / 250; 
                p.x += (dx / dist) * force * 1.5;
                p.y += (dy / dist) * force * 1.5;
              } else if (dist < 40) {
                const force = (40 - dist) / 40;
                p.x -= (dx / dist) * force * 2;
                p.y -= (dy / dist) * force * 2;
              }
            }
          });
        });
      }
    }, 500);
  }
}

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ========================================
   MOBILE NAVIGATION
   ======================================== */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');

  if (!toggle || !links) return;

  function closeMenu() {
    toggle.classList.remove('active');
    links.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.classList.add('active');
    links.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    if (links.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ========================================
   SCROLL REVEAL ANIMATION
   ======================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ========================================
   SOFT PARALLAX
   ======================================== */
function initParallax() {
  const hero = document.querySelector('.hero');
  const profileFrame = document.querySelector('.profile-frame');
  const floatCards = document.querySelectorAll('.profile-float-card');
  const particles = document.getElementById('particles-js');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;

        if (particles) {
          particles.style.transform = `translateY(${-scrolled * 0.15}px)`;
        }

        if (hero && profileFrame) {
          const heroHeight = hero.offsetHeight;
          if (scrolled < heroHeight) {
            const factor = scrolled / heroHeight;
            profileFrame.style.transform = `translateY(${scrolled * 0.08}px)`;
            
            floatCards.forEach((card, i) => {
              const direction = i % 2 === 0 ? 1 : -1;
              card.style.transform = `translateY(${-8 * Math.sin(Date.now() / 1000 + i) + scrolled * 0.04 * direction}px)`;
            });
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ========================================
   ANIMATED STAT COUNTERS
   ======================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observerOptions = {
    root: null,
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();

        // Only animate numbers
        const match = text.match(/^(\d+)(\+?)$/);
        if (match) {
          const target = parseInt(match[1], 10);
          const suffix = match[2] || '';
          animateCounter(el, target, suffix);
        }

        observer.unobserve(el);
      }
    });
  }, observerOptions);

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el, target, suffix) {
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ========================================
   PROJECT GALLERY FILTER
   ======================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectsCount = document.getElementById('projectsCount');
  
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      let visibleCount = 0;
      let hasChanges = false;

      // Phase 1: Fade out elements that need to be hidden
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filterValue === 'all' || filterValue === category;
        
        if (shouldShow) {
          visibleCount++;
        }

        if (!shouldShow && !card.classList.contains('hidden')) {
          card.classList.add('hide-anim');
          hasChanges = true;
        }
      });

      // Update count text slightly before animation finishes
      setTimeout(() => {
        projectsCount.textContent = `Showing ${visibleCount} Project${visibleCount !== 1 ? 's' : ''}`;
      }, 200);

      const finishTransition = () => {
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          const shouldShow = filterValue === 'all' || filterValue === category;
          
          if (shouldShow) {
            if (card.classList.contains('hidden')) {
              // Prepare for fade in: add hide-anim, remove hidden
              card.classList.add('hide-anim');
              card.classList.remove('hidden');
              
              // Trigger reflow to apply display change before transitioning opacity
              void card.offsetWidth;
              
              // Start fade in
              card.classList.remove('hide-anim');
            }
          } else {
            // Apply display:none and keep hide-anim for next cycle
            card.classList.add('hidden');
            card.classList.add('hide-anim');
          }
        });
      };

      // If we are fading elements out, wait 400ms for transition
      if (hasChanges) {
        setTimeout(finishTransition, 400);
      } else {
        finishTransition();
      }
    });
  });
}

/* ========================================
   CONTACT FORM — Web3Forms API
   ======================================== */
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;

  // Show sending state
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
    Sending...
  `;
  btn.disabled = true;
  btn.style.opacity = '0.7';

  try {
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData);

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(jsonData)
    });

    const result = await response.json();

    if (result.success) {
      // Success
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Message Sent!
      `;
      btn.style.opacity = '1';
      btn.style.background = '#22c55e';
      form.reset();
    } else {
      throw new Error(result.message || 'Something went wrong');
    }
  } catch (error) {
    // Error
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      Failed to send
    `;
    btn.style.opacity = '1';
    btn.style.background = '#ef4444';
    console.error('Form error:', error);
  }

  // Reset button after 3 seconds
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    btn.style.background = '';
    btn.style.opacity = '';
  }, 3000);
}



/* ========================================
   ADD SPIN ANIMATION CSS
   ======================================== */
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);

/* ========================================
   CURSOR GLOW EFFECT (Removed) & GENTLE PARTICLE ATTRACT
   ======================================== */
function initCursorGlow() {
  // Glow effect removed per user request
  
  // Implement gentle mouse attraction for particles instead
  let clientX = window.innerWidth / 2;
  let clientY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
  });

  function gentleAttract() {
    if (window.pJSDom && window.pJSDom.length > 0) {
      const pJS = window.pJSDom[0].pJS;
      const mouseX = clientX;
      const mouseY = clientY + window.scrollY; // adjust for scrolled document
      
      pJS.particles.array.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // If within radius, apply a tiny velocity vector towards mouse
        if (dist < 250) {
          p.vx += dx * 0.00002;
          p.vy += dy * 0.00002;
        }
      });
    }
    requestAnimationFrame(gentleAttract);
  }
  
  gentleAttract();
}

/* ========================================
   CERTIFICATES 3D STACK
   ======================================== */
window.initCertStack = function() {
  const container = document.getElementById('certStackContainer');
  const pagination = document.getElementById('certPagination');
  if (!container || !pagination) return;

  const cards = Array.from(container.querySelectorAll('.cert-card'));
  const dots = Array.from(pagination.querySelectorAll('.cert-dot'));
  if (cards.length === 0) return;

  let currentIndex = 0;
  let isScrolling = false;

  function updateStack() {
    cards.forEach((card, i) => {
      card.className = 'cert-card'; // reset
      let offset = i - currentIndex;

      if (offset === 0) card.classList.add('active');
      else if (offset === -1) card.classList.add('prev-1');
      else if (offset === -2) card.classList.add('prev-2');
      else if (offset === 1) card.classList.add('next-1');
      else if (offset === 2) card.classList.add('next-2');
      else if (offset < -2) card.classList.add('hidden-up');
      else if (offset > 2) card.classList.add('hidden-down');
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  function handleScroll(e) {
    if (isScrolling) return;
    
    // Determine direction
    const dir = Math.sign(e.deltaY);
    if (dir > 0 && currentIndex < cards.length - 1) {
      currentIndex++;
      triggerScrollLock();
    } else if (dir < 0 && currentIndex > 0) {
      currentIndex--;
      triggerScrollLock();
    }
  }

  function triggerScrollLock() {
    updateStack();
    isScrolling = true;
    setTimeout(() => { isScrolling = false; }, 600);
  }

  // Mouse wheel
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    handleScroll(e);
  }, { passive: false });

  // Pagination click
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentIndex = parseInt(e.target.dataset.index);
      updateStack();
    });
  });

  // Touch Swipe
  let touchStartY = 0;
  container.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) > 30) {
      if (diff > 0 && currentIndex < cards.length - 1) {
        currentIndex++;
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateStack();
    }
  }, { passive: true });

  // Init
  updateStack();
};
