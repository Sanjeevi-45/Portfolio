/**
 * ==========================================================================
 * SANJEEVI I - FULL STACK DEVELOPER PORTFOLIO
 * Script: script.js (Pure Vanilla JavaScript)
 * 
 * Features Included:
 * 1. Mobile Navigation & Hamburger Menu
 * 2. Typing Animation for Hero Section
 * 3. Dark / Light Theme Toggle with LocalStorage
 * 4. Project Filtering by Category
 * 5. Contact Form Validation & Feedback
 * 6. Scroll Reveal Animations (IntersectionObserver)
 * 7. Skills Progress Bar Fill on Scroll
 * 8. Active Nav Link Highlighting on Scroll
 * 9. Back-to-Top Button
 * 10. Dynamic Copyright Year
 * 11. Interactive Project Demo Modals (Calculator & Todo)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode with LocalStorage)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Function to apply a selected theme
  function applyTheme(theme) {
    if (theme === 'light') {
      rootElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        themeToggleBtn.setAttribute('title', 'Switch to dark mode');
      }
    } else {
      rootElement.removeAttribute('data-theme');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        themeToggleBtn.setAttribute('title', 'Switch to light mode');
      }
    }
  }

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('sanjeevi-portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Default to dark theme as requested
    applyTheme('dark');
  }

  // Toggle theme on button click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('sanjeevi-portfolio-theme', newTheme);
    });
  }

  // ------------------------------------------------------------------------
  // 2. Mobile Navigation & Sticky Navbar
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile drawer
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Close mobile menu when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        if (hamburgerBtn) {
          hamburgerBtn.classList.remove('is-active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Close mobile menu when clicking outside of nav
  document.addEventListener('click', (event) => {
    if (navMenu && navMenu.classList.contains('is-open')) {
      const isClickInsideNav = navbar.contains(event.target);
      if (!isClickInsideNav) {
        navMenu.classList.remove('is-open');
        if (hamburgerBtn) {
          hamburgerBtn.classList.remove('is-active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });

  // Sticky Navbar blur & shadow on scroll
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 3. Typing Animation (Cycles through roles)
  // ------------------------------------------------------------------------
  const typedTextElement = document.getElementById('typed-text');
  const rolesToType = [
    'Full Stack Developer',
    'Web Developer',
    'Frontend Developer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 60;
  const pauseBetweenWords = 1800;

  function typeRoleEffect() {
    if (!typedTextElement) return;

    const currentRole = rolesToType[roleIndex];

    if (!isDeleting) {
      // Typing characters
      typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // Pause at end of word
        isDeleting = true;
        setTimeout(typeRoleEffect, pauseBetweenWords);
        return;
      }
      setTimeout(typeRoleEffect, typingSpeed);
    } else {
      // Deleting characters
      typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Switch to next word
        isDeleting = false;
        roleIndex = (roleIndex + 1) % rolesToType.length;
        setTimeout(typeRoleEffect, 400);
        return;
      }
      setTimeout(typeRoleEffect, deletingSpeed);
    }
  }

  // Start typing animation
  if (typedTextElement) {
    setTimeout(typeRoleEffect, 600);
  }

  // ------------------------------------------------------------------------
  // 4. Project Category Filtering
  // ------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active class on buttons
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-filter');

      // Filter project cards
      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        const categoryList = categories.split(' ').map(c => c.trim().toLowerCase());

        if (selectedCategory === 'all' || categoryList.includes(selectedCategory.toLowerCase())) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 5. Scroll Reveal Animation & Skill Progress Fill
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const skillCards = document.querySelectorAll('.skill-card');

  // IntersectionObserver for elements entering viewport
  const revealObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // Animate skill progress bars when skills section is in view
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        const progressBars = document.querySelectorAll('.skill-progress-fill');
        progressBars.forEach((bar) => {
          const targetWidth = bar.getAttribute('data-level') || '75%';
          bar.style.width = targetWidth;
        });
      }
    });
  }, { threshold: 0.2 });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // ------------------------------------------------------------------------
  // 6. Active Navigation Link Highlighting on Scroll
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // ------------------------------------------------------------------------
  // 7. Back-to-Top Button
  // ------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------------
  // 8. Contact Form Validation & Submission
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const responseBanner = document.getElementById('form-response-banner');

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    // Helper: validate single field
    function validateField(input, condition) {
      const formGroup = input.closest('.form-group');
      if (!condition) {
        formGroup.classList.add('has-error');
        input.classList.add('is-invalid');
        return false;
      } else {
        formGroup.classList.remove('has-error');
        input.classList.remove('is-invalid');
        return true;
      }
    }

    // Email regex validation
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    }

    // Real-time input error clearing
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('has-error');
        input.classList.remove('is-invalid');
      });
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
      const isEmailValid = validateField(emailInput, isValidEmail(emailInput.value));
      const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length >= 3);
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

      const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

      if (isFormValid) {
        const nameVal = encodeURIComponent(nameInput.value.trim());
        const emailVal = encodeURIComponent(emailInput.value.trim());
        const subjectVal = encodeURIComponent(subjectInput.value.trim());
        const messageVal = encodeURIComponent(messageInput.value.trim());

        // Pre-filled mailto URL for direct send via visitor's email client
        const mailtoUrl = `mailto:sanjeeviilangovan45@gmail.com?subject=${subjectVal}&body=Hi Sanjeevi,%0D%0A%0D%0AMy name is ${nameVal} (${emailVal}).%0D%0A%0D%0A${messageVal}`;

        // As instructed: "Do NOT pretend the form sends an email if there is no backend.
        // Instead, after successful validation, display:
        // 'Your message is ready to send. Connect with me through the email or social links above.'"
        if (responseBanner) {
          responseBanner.className = 'form-response-banner success is-visible';
          responseBanner.innerHTML = `
            <strong>Validation Successful!</strong><br>
            Your message is ready to send. Connect with me through the email or social links above.
            <div class="banner-action-btn">
              <a href="${mailtoUrl}" class="btn btn-primary btn-sm" id="launch-email-btn">
                Send via Email App (mailto) ↗
              </a>
            </div>
          `;
        }

        // Reset the form fields
        contactForm.reset();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 9. Dynamic Copyright Year
  // ------------------------------------------------------------------------
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 10. Interactive Project Modals (Calculator & Todo Apps)
  // ------------------------------------------------------------------------
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const modalCloseButtons = document.querySelectorAll('.modal-close-btn');

  function closeModal() {
    modalBackdrops.forEach((modal) => {
      modal.classList.remove('is-open');
    });
    document.body.style.overflow = '';
  }

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  // Open modal button listeners
  const demoButtons = document.querySelectorAll('[data-open-modal]');
  demoButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });

  // Close buttons
  modalCloseButtons.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  // Close modal when clicking backdrop
  modalBackdrops.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  });

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // ------------------------------------------------------------------------
  // 11. Interactive Mini Calculator Demo
  // ------------------------------------------------------------------------
  const calcScreen = document.getElementById('calc-screen');
  const calcKeys = document.querySelectorAll('.calc-key');
  let calcExpression = '0';

  calcKeys.forEach((key) => {
    key.addEventListener('click', () => {
      const val = key.getAttribute('data-calc');

      if (!val) return;

      if (val === 'C') {
        calcExpression = '0';
      } else if (val === '=') {
        try {
          // Replace safe math operators
          const sanitized = calcExpression.replace(/×/g, '*').replace(/÷/g, '/');
          // Basic arithmetic calculation safely without eval
          const result = Function('"use strict";return (' + sanitized + ')')();
          calcExpression = String(result);
        } catch {
          calcExpression = 'Error';
        }
      } else {
        if (calcExpression === '0' || calcExpression === 'Error') {
          calcExpression = val;
        } else {
          calcExpression += val;
        }
      }

      if (calcScreen) {
        calcScreen.textContent = calcExpression;
      }
    });
  });

  // ------------------------------------------------------------------------
  // 12. Interactive Mini Todo Task Manager Demo
  // ------------------------------------------------------------------------
  const todoForm = document.getElementById('mini-todo-form');
  const todoInput = document.getElementById('mini-todo-input');
  const todoList = document.getElementById('mini-todo-list');

  if (todoForm && todoInput && todoList) {
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;

      const li = document.createElement('div');
      li.className = 'mini-todo-item';
      li.innerHTML = `
        <span>${escapeHtml(text)}</span>
        <div style="display: flex; gap: 6px;">
          <button class="btn-sm" style="background:#10b981; color:#fff; border-radius:4px; padding:2px 8px; font-size:11px;" title="Complete">✓</button>
          <button class="btn-sm" style="background:#ef4444; color:#fff; border-radius:4px; padding:2px 8px; font-size:11px;" title="Delete">✕</button>
        </div>
      `;

      // Complete toggle
      li.querySelector('button[title="Complete"]').addEventListener('click', () => {
        li.classList.toggle('completed');
      });

      // Delete task
      li.querySelector('button[title="Delete"]').addEventListener('click', () => {
        li.remove();
      });

      todoList.prepend(li);
      todoInput.value = '';
    });
  }

  // Helper function to escape HTML
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }
});
