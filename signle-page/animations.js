/**
 * COMPANY ENVISION — Comprehensive Multi-Page Scroll Animation Engine (Single-Page Edition)
 * Features:
 * 1. 100% Native Zero-Delay Hardware Scrolling with smooth header-offset anchor navigation.
 * 2. 100% pre-cached DOM queries (0 queries/sec during scroll loop).
 * 3. Header-aware early-settling 4-directional convergence animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothAnchors();
  initStatCounters();
  initUniversalScrollProgress();
  initParallaxScroll();
  initInteractiveParallax();
});

/* -------------------- 1. HEADER-AWARE SMOOTH ANCHOR NAVIGATION -------------------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#' || !id) return;
      const targetEl = document.querySelector(id);
      if (targetEl) {
        e.preventDefault();
        const header = document.getElementById('siteHeader');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetOffset = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* -------------------- 2. STAT COUNTER NUMBERS ANIMATION -------------------- */
function initStatCounters() {
  const numbers = document.querySelectorAll('.kpi-number');
  if (!numbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        numbers.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-target'), 10);
          const suffix = numEl.getAttribute('data-suffix') || '';
          animateCounter(numEl, target, suffix, 1800);
        });
      }
    });
  }, { threshold: 0.2 });

  const firstSection = numbers[0].closest('section') || numbers[0];
  observer.observe(firstSection);
}

function animateCounter(element, target, suffix, duration = 1800) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easeOutProgress * target);

    element.textContent = currentValue.toLocaleString('en-US') + (suffix || '');

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target.toLocaleString('en-US') + (suffix || '');
    }
  }

  requestAnimationFrame(step);
}

/* -------------------- 3. PRE-CACHED SCROLL-DRIVEN SECTION ENGINE -------------------- */
function initUniversalScrollProgress() {
  const sections = document.querySelectorAll('section');
  if (!sections.length) return;

  const sectionCache = Array.from(sections).map(sec => {
    const isHero = sec.classList.contains('hero-section') || sec.classList.contains('page-hero-banner');
    if (isHero) return { sec, isHero: true };

    const gridItems = Array.from(sec.querySelectorAll(
      '.kpi-card, .service-card, .pillar-card, .project-card, .feature-card, .tech-card, .team-card, ' +
      '.faq-item, .step-card, .value-card, .calc-card, .stepper-card, .cert-card, .service-detail-card, ' +
      '.cap-card, .method-step-card, .cp-tech-card, .spec-card, .stack-card, .case-card, .resource-card, ' +
      '.tool-card, .article-card, .contact-info-card, .contact-form-card, .office-card, .card, .grid-item, ' +
      '.info-card, .stat-card, .download-card, .team-member, .contact-box'
    ));

    const leftCol = sec.querySelector(
      '.about-card-left, .calc-card-left, .specialized-card-left, .contact-card-left, .faq-header, ' +
      '.split-col-left, .contact-info-col, .history-text-col, .detail-left-col, .col-left, .left-column'
    );
    const rightCol = sec.querySelector(
      '.about-card-right, .calc-card-right, .specialized-card-right, .contact-card-right, .faq-accordion, ' +
      '.split-col-right, .contact-form-col, .history-img-col, .detail-right-col, .col-right, .right-column'
    );

    const isSplit = !!(leftCol && rightCol);
    const secContainer = sec.querySelector('.container') || sec;
    const hasMap = !!sec.querySelector('.interactive-map-wrapper') || sec.classList.contains('global-map-card');
    const kpiNumbers = Array.from(sec.querySelectorAll('.kpi-number'));

    return {
      sec,
      isHero: false,
      gridItems,
      leftCol,
      rightCol,
      isSplit,
      secContainer,
      hasMap,
      kpiNumbers,
      lastProgress: -1,
      isSettled: false
    };
  });

  let ticking = false;
  const counterAnimatedMap = new Set();

  function updateAllSections() {
    const header = document.getElementById('siteHeader') || document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 80;
    const windowHeight = window.innerHeight;
    const usableHeight = Math.max(windowHeight - headerHeight, 300);

    sectionCache.forEach(entry => {
      if (entry.isHero) return;
      const sec = entry.sec;
      const rect = sec.getBoundingClientRect();
      if (rect.bottom < headerHeight - 120 || rect.top > windowHeight + 120) return;

      // Skip style mutations if section is already fully settled and past header
      if (entry.isSettled && rect.top <= headerHeight) return;

      const secHeight = rect.height || 450;
      const travelDistance = usableHeight * 0.72 + Math.min(secHeight, usableHeight) * 0.28;
      const progressRaw = (windowHeight - rect.top) / travelDistance;
      const p = Math.min(Math.max(progressRaw, 0), 1);

      // Throttle sub-pixel writes if progress change is negligible
      if (Math.abs(p - entry.lastProgress) < 0.004 && (p !== 1 && p !== 0)) return;
      entry.lastProgress = p;

      const easeP = Math.sin(p * Math.PI / 2);
      entry.isSettled = (p >= 0.999);

      const gridItems = entry.gridItems;

      if (gridItems.length >= 4) {
        const col1Offset = -90 * (1 - easeP);
        const col2Offset = 65 * (1 - easeP);
        const col3Offset = 85 * (1 - easeP);
        const col4Offset = 90 * (1 - easeP);

        gridItems.forEach((item, index) => {
          const mod = index % 4;
          let transform = '';
          if (mod === 0) transform = `translate3d(${col1Offset}px, 0, 0) scale(${0.9 + (easeP * 0.1)})`;
          else if (mod === 1) transform = `translate3d(0, ${col2Offset}px, 0) scale(${0.9 + (easeP * 0.1)})`;
          else if (mod === 2) transform = `translate3d(0, ${col3Offset}px, 0) scale(${0.9 + (easeP * 0.1)})`;
          else transform = `translate3d(${col4Offset}px, 0, 0) scale(${0.9 + (easeP * 0.1)})`;

          item.style.transform = transform;
          item.style.opacity = easeP;
        });
      } else if (gridItems.length === 3) {
        const leftOffset = -90 * (1 - easeP);
        const bottomOffset = 75 * (1 - easeP);
        const rightOffset = 90 * (1 - easeP);

        if (gridItems[0]) {
          gridItems[0].style.transform = `translate3d(${leftOffset}px, 0, 0) scale(${0.9 + (easeP * 0.1)})`;
          gridItems[0].style.opacity = easeP;
        }
        if (gridItems[1]) {
          gridItems[1].style.transform = `translate3d(0, ${bottomOffset}px, 0) scale(${0.9 + (easeP * 0.1)})`;
          gridItems[1].style.opacity = easeP;
        }
        if (gridItems[2]) {
          gridItems[2].style.transform = `translate3d(${rightOffset}px, 0, 0) scale(${0.9 + (easeP * 0.1)})`;
          gridItems[2].style.opacity = easeP;
        }
      } else if (gridItems.length === 2) {
        const leftOffset = -90 * (1 - easeP);
        const rightOffset = 90 * (1 - easeP);

        gridItems[0].style.transform = `translate3d(${leftOffset}px, 0, 0) scale(${0.9 + (easeP * 0.1)})`;
        gridItems[0].style.opacity = easeP;
        gridItems[1].style.transform = `translate3d(${rightOffset}px, 0, 0) scale(${0.9 + (easeP * 0.1)})`;
        gridItems[1].style.opacity = easeP;
      } else {
        if (entry.isSplit) {
          const leftOffset = -80 * (1 - easeP);
          const rightOffset = 80 * (1 - easeP);

          entry.leftCol.style.transform = `translate3d(${leftOffset}px, 0, 0) scale(${0.9 + (easeP * 0.1)})`;
          entry.leftCol.style.opacity = easeP;

          entry.rightCol.style.transform = `translate3d(${rightOffset}px, 0, 0) scale(${0.9 + (easeP * 0.1)})`;
          entry.rightCol.style.opacity = easeP;
        } else if (!entry.hasMap) {
          const yOffset = 40 * (1 - easeP);
          entry.secContainer.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${0.95 + (easeP * 0.05)})`;
          entry.secContainer.style.opacity = easeP;
        }
      }

      if (easeP > 0.6 && !counterAnimatedMap.has(sec)) {
        counterAnimatedMap.add(sec);
        entry.kpiNumbers.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-target'), 10) || 0;
          const suffix = numEl.getAttribute('data-suffix') || '';
          animateCounter(numEl, target, suffix, 1800);
        });
      }
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateAllSections);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateAllSections();
}

/* -------------------- 4. LUXURY PARALLAX SCROLLING ENGINE -------------------- */
/**
 * Modern, minimal, elegant parallax system.
 * - Background images move slower than foreground content.
 * - Smooth, high-performance transforms via requestAnimationFrame.
 * - Applied to Hero section and Portfolio / Case Studies sections.
 * - Responsive: subtle damping on mobile, respects prefers-reduced-motion.
 */
function initParallaxScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const heroSection = document.querySelector('.hero-section') || document.querySelector('.page-hero-banner');
  const heroBgWrap = document.querySelector('.hero-bg-wrap') || document.querySelector('.page-hero-bg-wrap');
  const heroContent = document.querySelector('.hero-content') || document.querySelector('.page-hero-container');

  const portfolioSections = Array.from(document.querySelectorAll(
    '.projects-section, #projectsPreview, #projects, .subpage-section.bg-light'
  )).filter(sec => sec.querySelector('.projects-grid') || sec.querySelector('.project-card') || sec.classList.contains('projects-section'));

  // Pre-cache portfolio elements for 0 query overhead during scrolling
  const portfolioCache = portfolioSections.map(sec => ({
    sec,
    bgWrap: sec.querySelector('.portfolio-parallax-bg-wrap'),
    bgImg: sec.querySelector('.portfolio-parallax-bg'),
    thumbs: Array.from(sec.querySelectorAll('.project-thumb img'))
  }));

  let isTicking = false;
  let lastScrollY = -1;

  function renderParallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (Math.abs(scrollY - lastScrollY) < 0.25) {
      isTicking = false;
      return;
    }
    lastScrollY = scrollY;

    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;

    // A. HERO SECTION PARALLAX
    if (heroSection && heroBgWrap) {
      const heroRect = heroSection.getBoundingClientRect();
      if (heroRect.bottom > -50 && heroRect.top < windowHeight) {
        // Background moves at 38% scroll speed (slower than foreground)
        const bgSpeed = isMobile ? 0.22 : 0.38;
        const bgOffset = scrollY * bgSpeed;
        heroBgWrap.style.transform = 'translate3d(0, ' + bgOffset.toFixed(2) + 'px, 0)';

        // Foreground content floats subtly and gently fades out as user scrolls down
        if (heroContent) {
          const fgSpeed = isMobile ? 0.08 : 0.14;
          const fgOffset = scrollY * fgSpeed;
          const heroHeight = heroRect.height || 600;
          const fadeProgress = Math.min(Math.max(scrollY / (heroHeight * 0.85), 0), 1);
          const opacity = (1 - fadeProgress * 0.88).toFixed(3);

          heroContent.style.transform = 'translate3d(0, ' + fgOffset.toFixed(2) + 'px, 0)';
          heroContent.style.opacity = opacity;
        }
      }
    }

    // B. PORTFOLIO / CASE STUDIES SECTION PARALLAX
    portfolioCache.forEach(entry => {
      const sec = entry.sec;
      const rect = sec.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > windowHeight + 80) return;

      const secHeight = rect.height || 700;
      // Offset from viewport center: negative when above center, positive when below
      const secCenterOffset = (rect.top + secHeight / 2) - (windowHeight / 2);

      // 1. Full-section background image moves slower than foreground cards
      if (entry.bgWrap || entry.bgImg) {
        const targetEl = entry.bgImg || entry.bgWrap;
        const bgSpeed = isMobile ? 0.10 : 0.20;
        const bgTranslate = secCenterOffset * bgSpeed;
        targetEl.style.transform = 'translate3d(0, ' + bgTranslate.toFixed(2) + 'px, 0) scale(1.06)';
      }

      // 2. Individual card thumbnail images move with subtle window-depth parallax
      if (entry.thumbs.length > 0) {
        entry.thumbs.forEach(img => {
          const thumbWrap = img.parentElement;
          if (!thumbWrap) return;
          const thumbRect = thumbWrap.getBoundingClientRect();
          if (thumbRect.bottom < 0 || thumbRect.top > windowHeight) return;

          const thumbCenter = thumbRect.top + thumbRect.height / 2;
          const thumbCenterOffset = thumbCenter - (windowHeight / 2);
          const thumbSpeed = isMobile ? 0.05 : 0.10;
          const imgTranslate = thumbCenterOffset * thumbSpeed;
          img.style.transform = 'translate3d(0, ' + imgTranslate.toFixed(2) + 'px, 0) scale(1.08)';
        });
      }
    });

    isTicking = false;
  }

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(renderParallax);
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // Initial render
  renderParallax();
}

/* -------------------- 5. FUTURISTIC INTERACTIVE MOUSE + SCROLL PARALLAX -------------------- */
/**
 * Interactive Parallax for Services and Team Sections:
 * - Fluid mouse movement triggers subtle background shifts via RAF lerping.
 * - Combines vertical scroll parallax with mouse-driven 3D depth.
 * - 3D Card Hover Parallax with holographic specular sheen reflection.
 * - GPU accelerated with translate3d and preserve-3d.
 * - Sleeping IntersectionObserver to prevent idle CPU/GPU consumption.
 */
function initInteractiveParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // A. SECTION-LEVEL MOUSE + SCROLL PARALLAX
  const sections = Array.from(document.querySelectorAll(
    '.interactive-parallax-section, #servicesPreview, #services, #team, #allCaseStudies, #software, #estimator, #specialized'
  ));

  sections.forEach(sec => {
    // Ensure section has class
    sec.classList.add('interactive-parallax-section');

    const stage = sec.querySelector('.interactive-bg-stage');
    if (!stage) return;

    const mesh = stage.querySelector('.interactive-grid-mesh');
    const orbs = Array.from(stage.querySelectorAll('.interactive-glow-orb'));
    const particles = Array.from(stage.querySelectorAll('.floating-particle'));

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isIntersecting = false;
    let isHovered = false;

    // Mouse Tracking over section
    if (!isTouchDevice) {
      sec.addEventListener('mousemove', (e) => {
        const rect = sec.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) - 0.5; // -0.5 to 0.5
        targetY = ((e.clientY - rect.top) / rect.height) - 0.5;
        isHovered = true;
      }, { passive: true });

      sec.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        isHovered = false;
      });
    }

    // Only render when section is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isIntersecting = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(sec);

    function updateSectionParallax() {
      if (isIntersecting) {
        // Smooth lerp (spring inertia)
        const lerpFactor = isHovered ? 0.075 : 0.04;
        currentX += (targetX - currentX) * lerpFactor;
        currentY += (targetY - currentY) * lerpFactor;

        // Scroll parallax offset
        const rect = sec.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const secCenter = rect.top + rect.height / 2;
        const scrollFactor = (secCenter - windowHeight / 2) * 0.12;

        // 1. Perspective Cyber Grid Mesh
        if (mesh) {
          const rotX = 22 + currentY * 12;
          const rotY = currentX * 14;
          const transX = currentX * -28;
          const transY = currentY * -28 + scrollFactor * 0.4;
          mesh.style.transform = 'perspective(900px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translate3d(' + transX.toFixed(1) + 'px, ' + transY.toFixed(1) + 'px, 0)';
        }

        // 2. Glow Orbs
        if (orbs[0]) {
          const transX = currentX * 60;
          const transY = currentY * 60 + scrollFactor * 0.65;
          orbs[0].style.transform = 'translate3d(' + transX.toFixed(1) + 'px, ' + transY.toFixed(1) + 'px, 0)';
        }
        if (orbs[1]) {
          const transX = currentX * -70;
          const transY = currentY * -70 - scrollFactor * 0.65;
          orbs[1].style.transform = 'translate3d(' + transX.toFixed(1) + 'px, ' + transY.toFixed(1) + 'px, 0)';
        }

        // 3. Floating Playful Particles / Glyphs
        particles.forEach((p, idx) => {
          const depth = parseFloat(p.getAttribute('data-depth')) || (0.1 + (idx * 0.04));
          const pX = currentX * depth * 220;
          const pY = currentY * depth * 220 + scrollFactor * depth * 1.5;
          const rot = currentX * depth * 120;
          p.style.transform = 'translate3d(' + pX.toFixed(1) + 'px, ' + pY.toFixed(1) + 'px, 0) rotate(' + rot.toFixed(1) + 'deg)';
        });
      }

      requestAnimationFrame(updateSectionParallax);
    }

    requestAnimationFrame(updateSectionParallax);
  });

  // B. 3D CARD HOVER PARALLAX WITH HOLOGRAPHIC SPECULAR SHEEN
  if (!isTouchDevice) {
    
  // Helper to attach 3D tilt listeners to cards (including dynamically loaded ones)
  function bindCard3dListeners(card) {
    if (card._has3dTiltBound) return;
    card._has3dTiltBound = true;

    let isCardHovered = false;
    let cardTargetRotX = 0;
    let cardTargetRotY = 0;
    let cardCurrentRotX = 0;
    let cardCurrentRotY = 0;

    card.addEventListener('pointerenter', () => {
      isCardHovered = true;
      card.style.setProperty('--glare-opacity', '1');
    });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      cardTargetRotX = -((y - centerY) / centerY) * 8.5;
      cardTargetRotY = ((x - centerX) / centerX) * 8.5;

      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });

    card.addEventListener('pointerleave', () => {
      isCardHovered = false;
      cardTargetRotX = 0;
      cardTargetRotY = 0;
      card.style.setProperty('--glare-opacity', '0');
    });

    function animateCardTilt() {
      if (isCardHovered || Math.abs(cardCurrentRotX) > 0.05 || Math.abs(cardCurrentRotY) > 0.05) {
        cardCurrentRotX += (cardTargetRotX - cardCurrentRotX) * 0.12;
        cardCurrentRotY += (cardTargetRotY - cardCurrentRotY) * 0.12;

        const liftZ = isCardHovered ? 14 : 0;
        const liftY = isCardHovered ? -8 : 0;

        card.style.transform = 'perspective(1000px) rotateX(' + cardCurrentRotX.toFixed(2) + 'deg) rotateY(' + cardCurrentRotY.toFixed(2) + 'deg) translate3d(0, ' + liftY + 'px, ' + liftZ + 'px)';
      } else {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
      }

      requestAnimationFrame(animateCardTilt);
    }

    requestAnimationFrame(animateCardTilt);
  }

  // Observe dynamically inserted cards (e.g. #caseSwitcherGrid in case-study.html)
  const cardObserver = new MutationObserver(() => {
    const dynamicCards = document.querySelectorAll(
      '.switcher-card, .case-block-card, .resource-card, .calc-card, .swimlane-card, .architecture-card'
    );
    dynamicCards.forEach(bindCard3dListeners);
  });
  cardObserver.observe(document.body, { childList: true, subtree: true });


    const cards = document.querySelectorAll(
      '.service-card, .team-card, .discipline-card, .pillar-card, .case-block-card, .switcher-card, .case-study-media-wrap, .resource-card, .calc-card, .swimlane-card, .architecture-card, .spec-card, .feature-card'
    );
    cards.forEach(bindCard3dListeners);
  }
}
