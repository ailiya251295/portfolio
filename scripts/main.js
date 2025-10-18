(function () {
  const docEl = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  function applyTheme(theme) {
    if (theme === 'light') {
      docEl.classList.add('light');
    } else {
      docEl.classList.remove('light');
    }
  }

  const storedTheme = localStorage.getItem('theme');
  applyTheme(storedTheme || (prefersLight.matches ? 'light' : 'dark'));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentlyLight = docEl.classList.contains('light');
      const nextTheme = currentlyLight ? 'dark' : 'light';
      localStorage.setItem('theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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



