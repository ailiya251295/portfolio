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



