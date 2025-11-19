(function () {
  // Prevent scroll restoration on page load
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  
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
    
    // Force a reflow to ensure sticky positioning works
    void mainContent.offsetHeight;
    
    // Initialize sticky header after content is shown
    setTimeout(() => {
      initStickyHeader();
    }, 50);
    
    // Scroll to top only once after everything is initialized
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 150);
  }
  
  // Fixed header initialization function
  function initStickyHeader() {
    const siteHeader = document.querySelector('.site-header');
    if (!siteHeader) {
      console.error('Site header not found');
      return;
    }
    
    const scrollThreshold = 100;
    let lastScrollTop = 0;
    
    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Always show header, just change styling when scrolled
      if (scrollTop > scrollThreshold) {
        siteHeader.classList.add('scrolled');
        siteHeader.classList.remove('hidden');
      } else {
        siteHeader.classList.remove('scrolled');
        siteHeader.classList.remove('hidden');
      }
      
      lastScrollTop = scrollTop;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    console.log('Fixed header initialized');
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
      
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Trail effect with delay
    function updateTrail() {
      const diffX = mouseX - trailX;
      const diffY = mouseY - trailY;
      
      trailX += diffX * 0.1;
      trailY += diffY * 0.1;
      
      trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
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
      toggleHover(el, 1.4, '', 'cursor-button');
    });

    // Add cursor labels for case cards and subprojects (desktop only)
    if (window.matchMedia('(min-width: 761px)').matches) {
      // Case cards - "view more"
      document.querySelectorAll('.case-card').forEach(card => {
        toggleHover(card, 1.6, 'view more', 'cursor-hover');
      });

      // Subprojects - "view details"
      document.querySelectorAll('.subproject').forEach(subproject => {
        toggleHover(subproject, 1.6, 'view details', 'cursor-hover');
      });
    }

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

  // Liquid Ether Background - Interactive mouse movement
  function initLiquidEther() {
    const bg = document.querySelector('.liquid-ether-bg');
    if (!bg) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateBackground() {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (mouseX - centerX) / window.innerWidth;
      const deltaY = (mouseY - centerY) / window.innerHeight;

      targetX += (deltaX * 10 - targetX) * 0.05;
      targetY += (deltaY * 10 - targetY) * 0.05;

      bg.style.setProperty('--mouse-x', `${targetX}%`);
      bg.style.setProperty('--mouse-y', `${targetY}%`);

      requestAnimationFrame(updateBackground);
    }

    updateBackground();
  }

  // Initialize liquid ether effect
  initLiquidEther();

  // Theme Toggle
  function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle?.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  initThemeToggle();

  // Dropdown functionality
  function initDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      
      toggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = dropdown.classList.contains('active');
        
        // Close all dropdowns
        dropdowns.forEach(d => d.classList.remove('active'));
        
        // Toggle current dropdown
        if (!isActive) {
          dropdown.classList.add('active');
        }
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(d => d.classList.remove('active'));
      }
    });
  }
  initDropdown();

  // Smooth scroll to project
  document.querySelectorAll('[data-scroll-to]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-scroll-to');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close dropdown
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
      }
    });
  });

  // Mobile navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Back to top button - scroll to absolute top
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      // Scroll to absolute top with all methods
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Force scroll after a brief delay to ensure it works
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    });
  }

  // Initialize sticky header if content is already visible (no password protection)
  if (mainContent && mainContent.style.display !== 'none') {
    initStickyHeader();
  }
  
  // Also try to initialize after a delay in case content becomes visible later
  setTimeout(() => {
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader && !siteHeader.classList.contains('sticky-initialized')) {
      initStickyHeader();
      siteHeader.classList.add('sticky-initialized');
    }
  }, 500);

  // Portfolio filters - removed

  // Gallery definitions
  const galleries = {
    'kalido-gallery': [
      'assets/placeholder.svg'
    ],
    'collaby-gallery': [
      'assets/placeholder.svg'
    ],
    'vtb-gallery': [
      'assets/placeholder.svg'
    ],
    'mvideo-gallery': [
      'assets/placeholder.svg'
    ],
    'jj-gallery': [
      'assets/J&J_0-1.png',
      'assets/J&J_0.png',
      'assets/J&J_1.png',
      'assets/J&J_2.png',
      'assets/J&J_3.png',
      'assets/J&J_4.png',
      'assets/J&J_5.png',
      'assets/J&J_6.png',
      'assets/J&J_7.png',
      'assets/J&J_8.png',
      'assets/J&J_9.png',
      'assets/J&J_10.png',
      'assets/J&J_11.png',
      'assets/J&J_12.png',
      'assets/J&J_13.jpg',
      'assets/J&J_14.jpg'
    ],
    'avito-gallery': [
      'assets/placeholder.svg'
    ]
  };

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-image');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-next');
  const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
  
  let currentGallery = null;
  let currentIndex = 0;

  function openLightbox(src, galleryId = null) {
    if (!lightbox || !lightboxImg) return;
    
    if (galleryId && galleries[galleryId]) {
      currentGallery = galleries[galleryId];
      currentIndex = currentGallery.indexOf(src);
      if (currentIndex === -1) currentIndex = 0;
      updateLightboxImage();
      updateNavigation();
    } else {
      currentGallery = null;
      lightboxImg.setAttribute('src', src);
      lightboxPrev.style.display = 'none';
      lightboxNext.style.display = 'none';
      lightboxCounter.style.display = 'none';
    }
    
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', onKeyDown);
  }

  function updateLightboxImage() {
    if (!currentGallery || currentIndex < 0 || currentIndex >= currentGallery.length) return;
    lightboxImg.setAttribute('src', currentGallery[currentIndex]);
    updateCounter();
  }

  function updateCounter() {
    if (!currentGallery) return;
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    lightboxCounter.style.display = 'flex';
  }

  function updateNavigation() {
    if (!currentGallery) return;
    lightboxPrev.style.display = 'flex';
    lightboxNext.style.display = 'flex';
    lightboxPrev.disabled = currentIndex === 0;
    lightboxNext.disabled = currentIndex === currentGallery.length - 1;
  }

  function navigateGallery(direction) {
    if (!currentGallery) return;
    if (direction === 'prev' && currentIndex > 0) {
      currentIndex--;
    } else if (direction === 'next' && currentIndex < currentGallery.length - 1) {
      currentIndex++;
    }
    updateLightboxImage();
    updateNavigation();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    currentGallery = null;
    currentIndex = 0;
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft' && currentGallery) {
      navigateGallery('prev');
    } else if (e.key === 'ArrowRight' && currentGallery) {
      navigateGallery('next');
    }
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => navigateGallery('prev'));
  lightboxNext?.addEventListener('click', () => navigateGallery('next'));
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Case Study Modal
  const caseModal = document.getElementById('case-modal');
  const caseModalImg = caseModal?.querySelector('.case-modal-image');
  const caseModalClose = caseModal?.querySelector('.case-modal-close');
  const caseModalPrev = caseModal?.querySelector('.case-modal-prev');
  const caseModalNext = caseModal?.querySelector('.case-modal-next');
  const caseModalCounter = caseModal?.querySelector('.case-modal-counter');
  
  let modalGallery = null;
  let modalIndex = 0;

  function openCaseModal(src, galleryId = null) {
    if (!caseModal || !caseModalImg) return;
    
    if (galleryId && galleries[galleryId]) {
      modalGallery = galleries[galleryId];
      modalIndex = modalGallery.indexOf(src);
      if (modalIndex === -1) modalIndex = 0;
      updateCaseModalImage();
      updateCaseModalNavigation();
    } else {
      modalGallery = null;
      caseModalImg.setAttribute('src', src);
      caseModalPrev.style.display = 'none';
      caseModalNext.style.display = 'none';
      caseModalCounter.style.display = 'none';
    }
    
    caseModal.classList.add('open');
    caseModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onCaseModalKeyDown);
  }

  function updateCaseModalImage() {
    if (!modalGallery || modalIndex < 0 || modalIndex >= modalGallery.length) return;
    caseModalImg.setAttribute('src', modalGallery[modalIndex]);
    updateCaseModalCounter();
  }

  function updateCaseModalCounter() {
    if (!modalGallery) return;
    caseModalCounter.textContent = `${modalIndex + 1} / ${modalGallery.length}`;
    caseModalCounter.style.display = 'block';
  }

  function updateCaseModalNavigation() {
    if (!modalGallery) return;
    caseModalPrev.style.display = 'flex';
    caseModalNext.style.display = 'flex';
    caseModalPrev.disabled = modalIndex === 0;
    caseModalNext.disabled = modalIndex === modalGallery.length - 1;
  }

  function navigateCaseModal(direction) {
    if (!modalGallery) return;
    if (direction === 'prev' && modalIndex > 0) {
      modalIndex--;
    } else if (direction === 'next' && modalIndex < modalGallery.length - 1) {
      modalIndex++;
    }
    updateCaseModalImage();
    updateCaseModalNavigation();
  }

  function closeCaseModal() {
    if (!caseModal) return;
    caseModal.classList.remove('open');
    caseModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalGallery = null;
    modalIndex = 0;
    document.removeEventListener('keydown', onCaseModalKeyDown);
  }

  function onCaseModalKeyDown(e) {
    if (e.key === 'Escape') {
      closeCaseModal();
    } else if (e.key === 'ArrowLeft' && modalGallery) {
      navigateCaseModal('prev');
    } else if (e.key === 'ArrowRight' && modalGallery) {
      navigateCaseModal('next');
    }
  }

  caseModalClose?.addEventListener('click', closeCaseModal);
  caseModalPrev?.addEventListener('click', () => navigateCaseModal('prev'));
  caseModalNext?.addEventListener('click', () => navigateCaseModal('next'));
  caseModal?.querySelector('.case-modal-backdrop')?.addEventListener('click', closeCaseModal);

  // Handle gallery triggers - open case modal
  document.querySelectorAll('[data-gallery]').forEach((el) => {
    el.addEventListener('click', (e) => {
      // Prevent default for links
      if (el.tagName === 'A') {
        e.preventDefault();
      }
      const galleryId = el.getAttribute('data-gallery');
      // Try to get image src from the element or its parent card
      const imgSrc = el.querySelector('img')?.getAttribute('src') || 
                     el.closest('.case-card')?.querySelector('img')?.getAttribute('src') ||
                     galleries[galleryId]?.[0];
      if (galleryId && galleries[galleryId] && imgSrc) {
        openCaseModal(imgSrc, galleryId);
      }
    });
  });

  // Handle single image lightbox
  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-lightbox');
      if (src) openLightbox(src);
    });
  });

  // Contact form handling
  const contactForm = document.querySelector('.contact-form');
  const formToast = document.getElementById('form-toast');
  
  function showToast(message, type) {
    if (!formToast) return;
    
    formToast.textContent = message;
    formToast.className = `form-toast ${type}`;
    formToast.classList.add('show');
    
    setTimeout(() => {
      formToast.classList.remove('show');
    }, 4000);
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      const formData = new FormData(contactForm);
      
      // Disable submit button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      try {
        // For Netlify Forms
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        
        if (response.ok) {
          // Show success message
          submitButton.textContent = 'Sent!';
          submitButton.style.background = '#10b981';
          contactForm.reset();
          showToast('Message sent successfully!', 'success');
          
          // Reset button after 3 seconds
          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
          }, 3000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Show error message
        submitButton.textContent = 'Error - Try again';
        submitButton.style.background = '#ef4444';
        showToast('Failed to send message. Please try again.', 'error');
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.style.background = '';
          submitButton.disabled = false;
        }, 3000);
        
        console.error('Form submission error:', error);
      }
    });
  }
})();



