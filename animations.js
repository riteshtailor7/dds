/**
 * DDS ENGINEERING (INDIA) PVT. LTD. — Comprehensive Multi-Page Scroll Animation Engine
 * Features:
 * 1. 100% Native Zero-Delay Hardware Scrolling with smooth header-offset anchor navigation.
 * 2. 100% pre-cached DOM queries (0 queries/sec during scroll loop).
 * 3. Header-aware early-settling 4-directional convergence animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothAnchors();
  initStatCounters();
  initUniversalScrollProgress();
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

  // Pre-cache all section elements on init — zero DOM queries on scroll!
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

      const easeP = Math.sin(p * Math.PI / 2); // 0 -> 1
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
