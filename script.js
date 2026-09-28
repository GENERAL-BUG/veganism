/* ================================
   ROOTED IMPACT — Shared JavaScript
   ================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Page Transition ---- */
  const overlay = document.querySelector('.page-transition');
  if (overlay) {
    requestAnimationFrame(() => overlay.classList.add('hidden'));
  }

  // Intercept internal links for smooth page transitions
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      (href.endsWith('.html') || href === '/')
    ) {
      link.addEventListener('click', e => {
        e.preventDefault();
        if (overlay) {
          overlay.classList.remove('hidden');
          setTimeout(() => { window.location.href = href; }, 400);
        } else {
          window.location.href = href;
        }
      });
    }
  });

  /* ---- Navbar Scroll ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile Nav Toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Scroll Reveal (Intersection Observer) ---- */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ---- Animated Counters ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = (el.dataset.decimals !== undefined) ? parseInt(el.dataset.decimals) : 0;
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = target * ease;
        el.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ================================
     PAGE 2 — Meal Explorer
     ================================ */
  const mealData = {
    breakfast: [
      {
        name: 'Oat Porridge with Banana & Seeds',
        tag: 'budget',
        cal: 320, protein: 9, cost: '₹40',
        co2: 0.3, lives: 0.8,
        compare: 'bacon and eggs', compareCo2: 2.1
      },
      {
        name: 'Avocado Toast with Hemp Seeds & Microgreens',
        tag: 'premium',
        cal: 420, protein: 14, cost: '₹180',
        co2: 0.5, lives: 1.2,
        compare: 'smoked salmon toast', compareCo2: 3.4
      }
    ],
    lunch: [
      {
        name: 'Chana Masala with Brown Rice',
        tag: 'budget',
        cal: 480, protein: 18, cost: '₹60',
        co2: 0.8, lives: 1.5,
        compare: 'chicken curry with rice', compareCo2: 3.1
      },
      {
        name: 'Quinoa Buddha Bowl with Roasted Vegetables & Tahini',
        tag: 'premium',
        cal: 550, protein: 22, cost: '₹220',
        co2: 1.1, lives: 2.0,
        compare: 'grilled salmon bowl', compareCo2: 4.2
      }
    ],
    dinner: [
      {
        name: 'Dal Tadka with Roti',
        tag: 'budget',
        cal: 520, protein: 20, cost: '₹55',
        co2: 0.9, lives: 1.8,
        compare: 'mutton curry with roti', compareCo2: 5.2
      },
      {
        name: 'Mushroom Risotto with Truffle Oil & Fresh Herbs',
        tag: 'premium',
        cal: 580, protein: 16, cost: '₹280',
        co2: 1.3, lives: 2.4,
        compare: 'beef steak dinner', compareCo2: 8.9
      }
    ],
    snacks: [
      {
        name: 'Roasted Chana & Fruit',
        tag: 'budget',
        cal: 180, protein: 8, cost: '₹20',
        co2: 0.1, lives: 0.3,
        compare: 'cheese crackers', compareCo2: 0.9
      },
      {
        name: 'Almond Butter with Apple & Dark Chocolate',
        tag: 'premium',
        cal: 280, protein: 7, cost: '₹120',
        co2: 0.2, lives: 0.5,
        compare: 'milk chocolate and cheese', compareCo2: 1.8
      }
    ]
  };

  /* --- Tab Switching --- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.meal-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabContents.forEach(tc => {
        tc.classList.toggle('active', tc.dataset.tab === target);
      });
    });
  });

  /* --- Meal Card Click (expand) --- */
  document.querySelectorAll('.meal-card').forEach(card => {
    card.addEventListener('click', () => {
      const wasExpanded = card.classList.contains('expanded');

      // Toggle expand
      card.classList.toggle('expanded');

      // Animate CO2 bars on expand
      if (!wasExpanded) {
        card.querySelectorAll('.co2-bar-fill').forEach(bar => {
          const w = bar.dataset.width;
          setTimeout(() => { bar.style.width = w; }, 50);
        });
      }

      // Track selection for daily tracker
      if (!card.classList.contains('selected')) {
        card.classList.add('selected');
        const co2 = parseFloat(card.dataset.co2) || 0;
        const lives = parseFloat(card.dataset.lives) || 0;
        updateTracker(co2, lives);
      }
    });
  });

  /* --- Daily Tracker --- */
  const tracker = document.querySelector('.daily-tracker');
  let totalCo2 = 0;
  let totalLives = 0;

  function updateTracker(co2, lives) {
    totalCo2 += co2;
    totalLives += lives;
    if (tracker) {
      tracker.classList.add('visible');
      const co2El = document.getElementById('tracker-co2');
      const livesEl = document.getElementById('tracker-lives');
      if (co2El) co2El.textContent = totalCo2.toFixed(1);
      if (livesEl) livesEl.textContent = totalLives.toFixed(1);

      // Trigger gentle pulse animation
      tracker.classList.remove('pulse');
      void tracker.offsetWidth; // Force reflow
      tracker.classList.add('pulse');
    }
  }

  /* ================================
     PAGE 3 — Legacy Calculator
     ================================ */
  const legacyForm = document.getElementById('legacy-form');
  const yearsSlider = document.getElementById('years-slider');
  const yearsDisplay = document.getElementById('years-display');

  if (yearsSlider && yearsDisplay) {
    yearsSlider.addEventListener('input', () => {
      yearsDisplay.textContent = yearsSlider.value + (yearsSlider.value === '1' ? ' year' : ' years');
    });
  }

  if (legacyForm) {
    legacyForm.addEventListener('submit', e => {
      e.preventDefault();
      const nameInput = document.getElementById('user-name');
      const name = nameInput.value.trim() || 'Friend';
      const years = parseInt(yearsSlider.value) || 1;

      // Calculations
      const animalsSaved = Math.round(years * 365 * 1.5);
      const co2Avoided = Math.round(years * 365 * 3.5);
      const waterSaved = Math.round(years * 365 * 4000);
      const treesEquiv = Math.round(co2Avoided / 21);
      const sufferingDays = Math.round(animalsSaved * 3);
      const peopleInspired = Math.round(years * 3);

      // Populate results
      document.getElementById('res-name').textContent = name + "'s";
      document.getElementById('res-years').textContent = years;

      const results = [
        { id: 'res-animals', value: animalsSaved },
        { id: 'res-co2', value: co2Avoided },
        { id: 'res-water', value: waterSaved },
        { id: 'res-trees', value: treesEquiv },
        { id: 'res-suffering', value: sufferingDays },
        { id: 'res-inspired', value: peopleInspired }
      ];

      results.forEach(r => {
        const el = document.getElementById(r.id);
        if (el) {
          el.dataset.count = r.value;
          el.textContent = '0';
        }
      });

      // Show results section
      const resultsSection = document.querySelector('.legacy-results');
      if (resultsSection) {
        resultsSection.classList.add('visible');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Trigger counter animations after scroll
        setTimeout(() => {
          results.forEach(r => {
            const el = document.getElementById(r.id);
            if (el) animateCounterEl(el);
          });
        }, 600);
      }

      // Save submission to Supabase
      if (typeof saveLegacy === 'function') {
        saveLegacy(name, years, animalsSaved, co2Avoided, treesEquiv);
      }

      // Message
      const msg = document.getElementById('res-message');
      if (msg) {
        msg.textContent = `${name}, in ${years} year${years > 1 ? 's' : ''} you will have quietly changed the world. Not with noise — but with every single meal.`;
      }

      // Share data
      window._legacyShareData = {
        name, years, animalsSaved, co2Avoided, waterSaved, treesEquiv
      };
    });
  }

  function animateCounterEl(el) {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const duration = 2200;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* --- Share Button --- */
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const d = window._legacyShareData;
      if (!d) return;
      const text = `🌱 ${d.name}'s Vegan Legacy (${d.years} years):\n` +
        `🐄 ${d.animalsSaved.toLocaleString()} animals saved\n` +
        `🌿 ${d.co2Avoided.toLocaleString()} kg CO₂ avoided\n` +
        `💧 ${d.waterSaved.toLocaleString()} litres water conserved\n` +
        `🌳 Equivalent to planting ${d.treesEquiv.toLocaleString()} trees\n\n` +
        `Every meal matters. Calculate yours at RootedImpact.`;

      navigator.clipboard.writeText(text).then(() => {
        const original = shareBtn.textContent;
        shareBtn.textContent = '✓ Copied to clipboard!';
        shareBtn.style.background = '#2D5A3D';
        setTimeout(() => {
          shareBtn.textContent = original;
          shareBtn.style.background = '';
        }, 2500);
      }).catch(() => {
        // Fallback
        prompt('Copy this text:', text);
      });
    });
  }

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

});
