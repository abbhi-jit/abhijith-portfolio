/* ========================================
   BLOG READER — Full Post Modal
   ======================================== */

(function () {
  'use strict';

  // Blog post data
  const blogPosts = {
    '1': {
      title: 'Why I Chose AI as My First Big Project',
      date: 'June 5, 2025',
      readTime: '5 min read',
      tags: ['AI', 'Machine Learning', 'Python', 'OpenCV'],
      content: `
        <p>When I first started learning to code, I never imagined I'd be building something that could interpret human gestures. But that's exactly what happened when I decided to take on my most ambitious project yet — a <strong>Sign Language Interpreter</strong> powered by artificial intelligence.</p>

        <h3>The Spark</h3>
        <p>It started with a simple question: <em>How can technology make communication more accessible?</em> I'd been learning Python for a few months and had just discovered OpenCV. The idea of combining computer vision with machine learning to bridge a real communication gap was too exciting to ignore.</p>

        <h3>The Learning Curve</h3>
        <p>Let me be honest — the learning curve was steep. I went from writing basic Python scripts to suddenly needing to understand:</p>
        <ul>
          <li>How neural networks process visual data</li>
          <li>Image preprocessing and feature extraction with OpenCV</li>
          <li>Training models on gesture datasets</li>
          <li>Real-time video processing and performance optimization</li>
        </ul>
        <p>There were days I wanted to give up. My models were inaccurate, my code was messy, and I felt completely out of my depth. But every small win — a correctly recognized gesture, a faster frame rate — kept me going.</p>

        <h3>What I Learned</h3>
        <p>Building this project taught me more than any textbook ever could. I learned that <strong>the best way to learn is to build something that matters</strong>. When you're solving a real problem, the motivation to push through challenges is entirely different.</p>
        <p>I also learned the importance of <strong>starting imperfect</strong>. My first prototype was terrible — but it worked. And from there, I could iterate, improve, and refine.</p>

        <h3>Looking Forward</h3>
        <p>This project opened my eyes to the incredible potential of AI. I'm now exploring more applications of machine learning, from natural language processing to predictive analytics. The journey has just begun, and I couldn't be more excited about where it's heading.</p>
        <p>If you're a student thinking about your first project — don't play it safe. <em>Pick something that challenges you, something that matters.</em> That's where the real learning happens.</p>
      `
    },
    '2': {
      title: 'Design Thinking for Developers: A Practical Guide',
      date: 'May 18, 2025',
      readTime: '4 min read',
      tags: ['UI/UX', 'Figma', 'Design', 'Web Development'],
      content: `
        <p>For the longest time, I thought design was someone else's job. I was a developer — my job was to make things work, not make them pretty. Then I discovered <strong>Figma</strong>, and everything changed.</p>

        <h3>The Developer's Design Problem</h3>
        <p>Here's the thing most developers don't realize: <em>design isn't about making things look good — it's about making things work better.</em> A well-designed interface reduces cognitive load, guides users intuitively, and creates trust. That's not a designer's job alone — it's everyone's responsibility.</p>

        <h3>My Figma Journey</h3>
        <p>I started by recreating interfaces I admired. I'd open an app I loved — Linear, Notion, Vercel — and try to rebuild its UI in Figma. This taught me:</p>
        <ul>
          <li><strong>Spacing and alignment</strong> — why 8px grids matter</li>
          <li><strong>Color theory</strong> — how to create harmonious palettes</li>
          <li><strong>Typography hierarchy</strong> — guiding the eye through content</li>
          <li><strong>Component thinking</strong> — designing reusable, consistent elements</li>
        </ul>

        <h3>How Design Improved My Code</h3>
        <p>Here's the surprising part — learning design actually made me a <strong>better developer</strong>. When you think about the user experience before writing code, you make better architectural decisions. You build components that are more modular. You write CSS that's more intentional.</p>
        <p>My Task Manager project was the first thing I designed in Figma before building. The difference was night and day. Instead of making random decisions while coding, I had a clear vision. The development process was faster, the result was cleaner, and I was prouder of the outcome.</p>

        <h3>Tips for Developer-Designers</h3>
        <p>If you're a developer wanting to learn design, here's my advice:</p>
        <ul>
          <li>Start with Figma — it's free and has incredible learning resources</li>
          <li>Study interfaces you love, don't just admire them</li>
          <li>Learn the basics of color, typography, and spacing</li>
          <li>Design before you code, even if it's rough</li>
          <li>Follow designers on Twitter/X — you'll absorb principles naturally</li>
        </ul>
        <p><em>Great code deserves great design.</em> When you combine both skills, you become unstoppable.</p>
      `
    },
    '3': {
      title: 'From Zero to Portfolio: Building My First Website',
      date: 'April 29, 2025',
      readTime: '6 min read',
      tags: ['HTML', 'CSS', 'JavaScript', 'Portfolio'],
      content: `
        <p>Every developer needs a portfolio. It's your digital handshake — the first thing recruiters, collaborators, and clients see. But building one that actually impresses? That's a different challenge entirely.</p>

        <h3>Why I Built This Portfolio</h3>
        <p>I was tired of seeing student portfolios that looked like… student portfolios. Plain backgrounds, default fonts, generic layouts. I wanted something that felt <strong>professional, premium, and genuinely impressive</strong> — something worthy of being linked on LinkedIn and resumes.</p>
        <p>So I set out to build a portfolio that could stand alongside the best developer websites I'd seen.</p>

        <h3>The Tech Stack</h3>
        <p>I kept it intentionally simple — <strong>HTML, CSS, and vanilla JavaScript</strong>. No frameworks, no build tools, no dependencies. Here's why:</p>
        <ul>
          <li>It forced me to truly understand the fundamentals</li>
          <li>The site loads instantly — no framework overhead</li>
          <li>It's easy to deploy anywhere (Netlify, GitHub Pages, etc.)</li>
          <li>It proves I can build great things without relying on libraries</li>
        </ul>

        <h3>Design Decisions</h3>
        <p>Every design choice was intentional. The <strong>dark theme</strong> feels modern and premium. The <strong>purple accent</strong> adds personality without being overwhelming. The <strong>glassmorphism effects</strong> are used sparingly — enough to feel premium, not enough to feel gimmicky.</p>
        <p>Typography was crucial. I chose <em>Inter</em> for its incredible readability and modern feel. Large, bold headings create visual hierarchy. Generous whitespace lets the content breathe.</p>

        <h3>Animations That Matter</h3>
        <p>I spent a lot of time on animations — but the goal was never to show off. Every animation serves a purpose:</p>
        <ul>
          <li><strong>Scroll reveals</strong> — guide attention as you navigate</li>
          <li><strong>Hover effects</strong> — provide feedback and invite interaction</li>
          <li><strong>Smooth transitions</strong> — make the experience feel polished</li>
          <li><strong>Subtle parallax</strong> — add depth without distraction</li>
        </ul>

        <h3>What I'd Tell My Past Self</h3>
        <p>If I could go back to when I started, I'd say: <em>don't wait until you feel ready.</em> Start building, start iterating. Your portfolio will never be "done" — and that's okay. Ship it, get feedback, improve. The best portfolio is one that exists.</p>
        <p>This website represents everything I've learned so far. And I can't wait to see how it evolves as I continue growing as a developer.</p>
      `
    }
  };

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
    const post = blogPosts[id];
    if (!post) return;

    titleEl.textContent = post.title;
    dateEl.textContent = post.date;
    readEl.textContent = post.readTime;
    tagsEl.innerHTML = post.tags.map(t => `<span>${t}</span>`).join('');
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

  // Click handlers for Read More links
  document.querySelectorAll('[data-blog]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openPost(link.dataset.blog);
    });
  });

  // Close handlers
  closeBtn.addEventListener('click', closePost);
  overlay.addEventListener('click', closePost);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePost();
    }
  });

})();
