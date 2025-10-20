(function () {
  // Password Protection
  const CORRECT_PASSWORD = 'portfolio2024'; // Change this to your desired password
  const passwordOverlay = document.getElementById('password-overlay');
  const mainContent = document.getElementById('main-content');
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');

  // Check if user is already authenticated
  function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('portfolio-authenticated');
    if (isAuthenticated === 'true') {
      showMainContent();
    }
  }

  // Show main content and hide password overlay
  function showMainContent() {
    passwordOverlay.classList.add('hidden');
    mainContent.classList.add('visible');
    mainContent.style.display = 'block';
  }

  // Handle password form submission
  function handlePasswordSubmit(e) {
    e.preventDefault();
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword === CORRECT_PASSWORD) {
      // Correct password
      sessionStorage.setItem('portfolio-authenticated', 'true');
      showMainContent();
      passwordError.style.display = 'none';
      passwordInput.value = '';
    } else {
      // Incorrect password
      passwordError.style.display = 'block';
      passwordInput.value = '';
      passwordInput.focus();
      
      // Shake animation for error feedback
      passwordOverlay.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        passwordOverlay.style.animation = '';
      }, 500);
    }
  }

  // Initialize password protection
  function initPasswordProtection() {
    checkAuth();
    passwordForm.addEventListener('submit', handlePasswordSubmit);
    
    // Focus on password input when page loads
    if (!sessionStorage.getItem('portfolio-authenticated')) {
      setTimeout(() => {
        passwordInput.focus();
      }, 100);
    }
  }

  // Add shake animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  // Initialize password protection first
  initPasswordProtection();

  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Custom Cursor Implementation
  function initCustomCursor() {
    // Check if cursor should be disabled
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    const cursor = document.getElementById('cursor');
    const primary = document.getElementById('cursor-primary');
    const trail = document.getElementById('cursor-trail');
    const label = document.getElementById('cursor-label');

    if (!cursor || !primary || !trail || !label) return;

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      requestAnimationFrame(() => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      });
    });

    // Trail effect with delay
    function updateTrail() {
      const diffX = mouseX - trailX;
      const diffY = mouseY - trailY;
      
      trailX += diffX * 0.1;
      trailY += diffY * 0.1;
      
      trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
      requestAnimationFrame(updateTrail);
    }
    updateTrail();

    // Hover state management
    function toggleHover(element, scale = 1.6, text = '', className = 'cursor-hover') {
      element.addEventListener('mouseenter', () => {
        document.body.classList.add(className);
        if (text) {
          label.textContent = text;
          label.style.opacity = '1';
        }
      });
      
      element.addEventListener('mouseleave', () => {
        document.body.classList.remove(className);
        label.style.opacity = '0';
      });
    }

    // Apply hover effects to different elements
    document.querySelectorAll('a').forEach(el => {
      toggleHover(el, 1.8, '', 'cursor-hover');
    });

    document.querySelectorAll('button').forEach(el => {
      toggleHover(el, 1.4, 'Click', 'cursor-button');
    });

    document.querySelectorAll('[data-cursor-label]').forEach(el => {
      toggleHover(el, 1, el.dataset.cursorLabel, 'cursor-hover');
    });

    // Text hover effect
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li').forEach(el => {
      toggleHover(el, 1, '', 'cursor-text');
    });

    // Click ripple effect
    document.addEventListener('mousedown', () => {
      const ring = document.createElement('div');
      ring.className = 'click-ring';
      cursor.appendChild(ring);
      setTimeout(() => ring.remove(), 300);
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }

  // Initialize custom cursor
  initCustomCursor();

  // Mobile navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Portfolio filters
  const filters = Array.from(document.querySelectorAll('.filter-chip'));
  const cards = Array.from(document.querySelectorAll('.portfolio-grid .card'));
  function setActiveFilter(filter) {
    filters.forEach((b) => b.classList.toggle('active', b.dataset.filter === filter));
    if (filter === 'all') {
      cards.forEach((c) => (c.style.display = 'block'));
      return;
    }
    cards.forEach((c) => {
      const cat = c.getAttribute('data-category');
      c.style.display = cat === filter ? 'block' : 'none';
    });
  }
  filters.forEach((btn) =>
    btn.addEventListener('click', () => setActiveFilter(btn.dataset.filter || 'all'))
  );

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-image');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.setAttribute('src', src);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', onEsc);
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onEsc);
  }
  function onEsc(e) {
    if (e.key === 'Escape') closeLightbox();
  }
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-lightbox');
      if (src) openLightbox(src);
    });
  });
})();



