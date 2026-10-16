/**
 * COMPANY ENVISION — Comprehensive Multi-Page Scroll-Driven Engine (Single-Page Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  initStatCounters();
  initUniversalScrollProgress();
});

/* -------------------- 1. STAT COUNTER NUMBERS ANIMATION -------------------- */
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

/* -------------------- 2. UNIVERSAL SCROLL-DRIVEN SECTION ENGINE -------------------- */
function initUniversalScrollProgress() {
  const sections = document.querySelectorAll('section');
  if (!sections.length) return;

  let ticking = false;
  const counterAnimatedMap = new Set();

  function updateAllSections() {
    const windowHeight = window.innerHeight;

    sections.forEach(sec => {
      if (sec.classList.contains('hero-section') || sec.classList.contains('page-hero-banner')) return;

      const rect = sec.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > windowHeight + 120) return;

      const secHeight = rect.height || 450;
      const progressRaw = (windowHeight - rect.top) / (windowHeight * 0.65 + secHeight * 0.35);
      const p = Math.min(Math.max(progressRaw, 0), 1);
      const easeP = Math.sin(p * Math.PI / 2);

      const gridItems = sec.querySelectorAll(
        '.kpi-card, .service-card, .pillar-card, .project-card, .feature-card, .tech-card, .team-card, ' +
        '.faq-item, .step-card, .value-card, .calc-card, .stepper-card, .cert-card, .service-detail-card, ' +
        '.cap-card, .method-step-card, .cp-tech-card, .spec-card, .stack-card, .case-card, .resource-card, ' +
        '.tool-card, .article-card, .contact-info-card, .contact-form-card, .office-card, .card, .grid-item, ' +
        '.info-card, .stat-card, .download-card, .team-member, .contact-box'
      );

      if (gridItems.length >= 4) {
        const col1Offset = -150 * (1 - easeP);
        const col2Offset = -120 * (1 - easeP);
        const col3Offset = 120 * (1 - easeP);
        const col4Offset = 150 * (1 - easeP);

        gridItems.forEach((item, index) => {
          const mod = index % 4;
          let transform = '';
          if (mod === 0) transform = `translate3d(${col1Offset}px, 0, 0) scale(${0.86 + (easeP * 0.14)})`;
          else if (mod === 1) transform = `translate3d(0, ${col2Offset}px, 0) scale(${0.86 + (easeP * 0.14)})`;
          else if (mod === 2) transform = `translate3d(0, ${col3Offset}px, 0) scale(${0.86 + (easeP * 0.14)})`;
          else transform = `translate3d(${col4Offset}px, 0, 0) scale(${0.86 + (easeP * 0.14)})`;

          item.style.transform = transform;
          item.style.opacity = easeP;
        });
      } else if (gridItems.length === 3) {
        const leftOffset = -150 * (1 - easeP);
        const bottomOffset = 120 * (1 - easeP);
        const rightOffset = 150 * (1 - easeP);

        if (gridItems[0]) {
          gridItems[0].style.transform = `translate3d(${leftOffset}px, 0, 0) scale(${0.88 + (easeP * 0.12)})`;
          gridItems[0].style.opacity = easeP;
        }
        if (gridItems[1]) {
          gridItems[1].style.transform = `translate3d(0, ${bottomOffset}px, 0) scale(${0.88 + (easeP * 0.12)})`;
          gridItems[1].style.opacity = easeP;
        }
        if (gridItems[2]) {
          gridItems[2].style.transform = `translate3d(${rightOffset}px, 0, 0) scale(${0.88 + (easeP * 0.12)})`;
          gridItems[2].style.opacity = easeP;
        }
      } else if (gridItems.length === 2) {
        const leftOffset = -150 * (1 - easeP);
        const rightOffset = 150 * (1 - easeP);

        gridItems[0].style.transform = `translate3d(${leftOffset}px, 0, 0) scale(${0.88 + (easeP * 0.12)})`;
        gridItems[0].style.opacity = easeP;
        gridItems[1].style.transform = `translate3d(${rightOffset}px, 0, 0) scale(${0.88 + (easeP * 0.12)})`;
        gridItems[1].style.opacity = easeP;
      } else {
        const leftCol = sec.querySelector(
          '.about-card-left, .calc-card-left, .specialized-card-left, .contact-card-left, .faq-header, ' +
          '.split-col-left, .contact-info-col, .history-text-col, .detail-left-col, .col-left, .left-column'
        );
        const rightCol = sec.querySelector(
          '.about-card-right, .calc-card-right, .specialized-card-right, .contact-card-right, .faq-accordion, ' +
          '.split-col-right, .contact-form-col, .history-img-col, .detail-right-col, .col-right, .right-column'
        );

        if (leftCol && rightCol) {
          const leftOffset = -140 * (1 - easeP);
          const rightOffset = 140 * (1 - easeP);

          leftCol.style.transform = `translate3d(${leftOffset}px, 0, 0) scale(${0.88 + (easeP * 0.12)})`;
          leftCol.style.opacity = easeP;

          rightCol.style.transform = `translate3d(${rightOffset}px, 0, 0) scale(${0.88 + (easeP * 0.12)})`;
          rightCol.style.opacity = easeP;
        } else if (!sec.querySelector('.interactive-map-wrapper') && !sec.classList.contains('global-map-card')) {
          const secContainer = sec.querySelector('.container') || sec;
          const yOffset = 50 * (1 - easeP);
          secContainer.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${0.93 + (easeP * 0.07)})`;
          secContainer.style.opacity = easeP;
        }
      }

      if (easeP > 0.6 && !counterAnimatedMap.has(sec)) {
        counterAnimatedMap.add(sec);
        sec.querySelectorAll('.kpi-number').forEach(numEl => {
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
