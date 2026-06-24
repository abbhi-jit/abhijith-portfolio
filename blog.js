/* ========================================
   BLOG READER — Full Post Modal
   ======================================== */

(function () {
  'use strict';

  // DOM refs
  const overlay = document.getElementById('blogModalOverlay');
  const modal = document.getElementById('blogModal');
  const closeBtn = document.getElementById('blogModalClose');
  const titleEl = document.getElementById('blogModalTitle');
  const dateEl = document.getElementById('blogModalDate');
  const readEl = document.getElementById('blogModalRead');
  const tagsEl = document.getElementById('blogModalTags');
  const contentEl = document.getElementById('blogModalContent');

  function openPost(id) {
    // Data is loaded by data.js into window.blogPostsData
    const post = window.blogPostsData ? window.blogPostsData[id] : null;
    if (!post) return;

    titleEl.textContent = post.title;
    dateEl.textContent = post.date;
    readEl.textContent = post.readTime || '';
    
    if (post.tags && post.tags.length > 0) {
      tagsEl.innerHTML = post.tags.map(t => '<span>' + t + '</span>').join('');
    } else {
      tagsEl.innerHTML = '';
    }
    
    contentEl.innerHTML = post.content;

    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePost() {
    overlay.classList.remove('active');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Delegated click handler for dynamically rendered blog cards
  document.addEventListener('click', function(e) {
    const link = e.target.closest('[data-blog]');
    if (link) {
      e.preventDefault();
      openPost(link.dataset.blog);
    }
  });

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', closePost);
  if (overlay) overlay.addEventListener('click', closePost);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePost();
    }
  });

})();
