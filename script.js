/**
 * DDS ENGINEERING (INDIA) PVT. LTD. — Core Multi-Page Logic & Interactive Behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSlider();
  initMapTelemetry();
  initBackToTop();
  initPartnersMarquee();
  initFaqAccordion();
  initEngineeringCalculator();
  initRoadmapStepper();
});

/* -------------------- 1. NAVIGATION & ACTIVE MULTI-PAGE ROUTER -------------------- */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight active page link
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('#')[0] || 'index.html';
    
    if (linkFile === currentPath || (currentPath === '' && linkFile === 'index.html')) {
      link.classList.add('active');
    } else if (!href.startsWith('#') && linkFile !== currentPath) {
      link.classList.remove('active');
    }
  });

  // Header shadow on scroll
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile Drawer Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      if (drawerOverlay) drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }
}

function closeDrawer() {
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  if (mobileDrawer) mobileDrawer.classList.remove('open');
  if (drawerOverlay) drawerOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* -------------------- 2. HERO CAROUSEL / SLIDER (Home Page) -------------------- */
let currentHeroSlide = 0;
let heroSlideTimer = null;

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('#heroDots .dot');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const bgImages = document.querySelectorAll('.hero-bg-full');

  if (!slides.length) return;

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentHeroSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    bgImages.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentHeroSlide - 1);
      resetHeroTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentHeroSlide + 1);
      resetHeroTimer();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(idx);
      resetHeroTimer();
    });
  });

  startHeroTimer();

  function startHeroTimer() {
    heroSlideTimer = setInterval(() => {
      showSlide(currentHeroSlide + 1);
    }, 7000);
  }

  function resetHeroTimer() {
    clearInterval(heroSlideTimer);
    startHeroTimer();
  }
}



/* -------------------- 4. INTERACTIVE GLOBAL MAP TELEMETRY (SVG VECTOR MAP) -------------------- */
function initMapTelemetry() {
  const mapPins = document.querySelectorAll('.map-pin');
  const tooltip = document.getElementById('mapTooltip');
  const tooltipCity = document.getElementById('tooltipCity');
  const tooltipMetrics = document.getElementById('tooltipMetrics');
  const mapWrapper = document.querySelector('.interactive-map-wrapper');

  if (!mapWrapper || !tooltip || !mapPins.length) return;

  function showTooltip(pin, e) {
    const city = pin.getAttribute('data-city');
    const metrics = pin.getAttribute('data-metrics');
    if (tooltipCity) tooltipCity.textContent = city;
    if (tooltipMetrics) tooltipMetrics.innerHTML = metrics;

    const parentRect = mapWrapper.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();

    let clientX = (e && e.clientX) ? e.clientX : (pinRect.left + pinRect.width / 2);
    let clientY = (e && e.clientY) ? e.clientY : pinRect.top;

    const tipWidth = tooltip.offsetWidth || 280;
    const tipHeight = tooltip.offsetHeight || 65;

    let left = clientX - parentRect.left - (tipWidth / 2);
    let top = clientY - parentRect.top - tipHeight - 14;

    left = Math.max(12, Math.min(left, parentRect.width - tipWidth - 12));
    top = Math.max(10, top);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  mapPins.forEach(pin => {
    pin.addEventListener('mouseenter', (e) => showTooltip(pin, e));
    pin.addEventListener('mousemove', (e) => showTooltip(pin, e));
    pin.addEventListener('mouseleave', hideTooltip);

    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      showTooltip(pin, e);
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.map-pin')) {
      hideTooltip();
    }
  });
}

/* -------------------- 5. MILESTONE STEPPER (About Page) -------------------- */
function initRoadmapStepper() {
  const nodes = document.querySelectorAll('.roadmap-node');
  const progressLine = document.getElementById('roadmapProgress');
  if (!nodes.length) return;

  nodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      nodes.forEach((n, i) => {
        n.classList.toggle('active', i <= idx);
      });
      if (progressLine) {
        const pct = (idx / (nodes.length - 1)) * 100;
        progressLine.style.width = `${pct}%`;
      }
    });
  });
}

/* -------------------- 6. LEADERSHIP TEAM TOGGLE (About Page) -------------------- */
let teamExpanded = false;

function toggleEntireTeam() {
  const extendedCards = document.querySelectorAll('.extended-member');
  const btn = document.getElementById('btnToggleTeam');

  teamExpanded = !teamExpanded;

  extendedCards.forEach(card => {
    card.classList.toggle('hidden', !teamExpanded);
  });

  if (btn) {
    btn.textContent = teamExpanded ? 'SHOW LESS LEADERS' : 'VIEW ENTIRE ENGINEERING TEAM (9)';
  }
}

/* -------------------- 7. DEEP-DIVE EXPERTISE TABS (Specialized Page) -------------------- */
function switchExpertiseTab(tabId) {
  const tabBtns = document.querySelectorAll('.expertise-tabs .tab-btn');
  const panes = document.querySelectorAll('.expertise-pane');

  tabBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }

  panes.forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`pane-${tabId}`);
  if (activePane) {
    activePane.classList.add('active');
  }
}

/* -------------------- 8. PORTFOLIO CATEGORY FILTER (Projects Page) -------------------- */
function filterProjects(category) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active');
    }
  });

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

/* -------------------- 9. PROJECT MODAL DETAILS -------------------- */
const projectData = {
  1: {
    title: 'Bhilosa Industries — CP4/5 Polymer Transfer Line (1680 TPD)',
    tag: 'MELT POLYMER TRANSFER LINE',
    image: 'assets/dds_melt_transfer.jpg',
    client: 'Bhilosa Industries Pvt. Ltd.',
    duration: 'Detail Engineering & Commissioning',
    impact: '1680 TPD Direct Melt Delivery to POY / FDY / PSF with Uniform IV',
    overview: 'DDS completed the comprehensive detail engineering of the high-temperature (>280°C), high-pressure (>150 bar) Polymer Transfer Line for Bhilosa Industries\' CP4/5 project. Utilizing our proprietary Pressure Drop and Residence Time Calculation (PDRTC) software, we designed an intricate jacketed piping network ensuring uniform residence time at every spinning position across massive POY, FDY, and PSF beam manifolds.'
  },
  2: {
    title: 'Bhilosa Industries — CP2/3/6 (1650 TPD) & CP1 Redesign',
    tag: 'TRANSFER LINE & DEBOTTLENECKING',
    image: 'assets/dds_plant_hero.jpg',
    client: 'Bhilosa Industries Pvt. Ltd.',
    duration: 'Multi-Phase Plant Engineering',
    impact: '1650 TPD Expansion & Optimized Hydraulic Balance for Existing Lines',
    overview: 'Detail design and engineering of the Polymer Transfer Line for Bhilosa CP2/3/6 (1650 TPD POY/FDY), coupled with complete hydraulic redesign and thermal stress re-engineering of the existing CP1 plant melt distribution piping.'
  },
  3: {
    title: 'Sumilon Industries — 750 TPD Polyester Plant & Dornier Film Line',
    tag: 'OSBL & ISBL DETAIL ENGINEERING',
    image: 'assets/dds_cad_piping.jpg',
    client: 'Sumilon Industries Ltd.',
    duration: 'Greenfield Plant Execution',
    impact: '750 TPD Continuous Polyester & Dornier Film Line Integration',
    overview: 'Delivered end-to-end OSBL Engineering for Sumilon Industries\' 750 TPD polyester plant from OBHE. The scope included comprehensive ISBL and OSBL piping, electrical engineering, utilities distribution, and integration with the specialized Dornier Film Line.'
  },
  4: {
    title: 'International Transfer Lines — Koza, SASA & Indorama',
    tag: 'GLOBAL ENGINEERING CONSULTANCY',
    image: 'assets/dds_melt_transfer.jpg',
    client: 'Koza Polyester, SASA (Turkey), Indorama & APF (Indonesia)',
    duration: 'Overseas Engineering Contracts',
    impact: 'Successful International Polymer Cooler Additions & Transfer Lines',
    overview: 'Engineered polymer melt transfer lines for Koza Polyester (Turkey), performed detailed engineering for the addition of specialized Polymer Coolers at SASA (Turkey), and redesigned existing transfer lines at Indorama Indonesia and APF Indonesia.'
  },
  5: {
    title: '70 TPD Continuous Polymerisation (CP) Plant',
    tag: 'CP REACTOR & PLANT DESIGN',
    image: 'assets/dds_plant_hero.jpg',
    client: 'Synthetic Resin Manufacturer',
    duration: 'Turnkey Design to Commissioning',
    impact: '70 TPD Operating on-spec with 100% in-house equipment design',
    overview: 'DDS executed the complete basic and detail design of a 70 TPD Continuous Polymerisation (CP) plant. All reactors, esterifiers, polycondensation vessels, vacuum systems, and equipment were designed in-house by DDS engineers, operating with exemplary quality and efficiency.'
  },
  6: {
    title: '100 TPD Texturizing (Conning) Oil Plant',
    tag: 'PROPRIETARY TECHNICAL KNOW-HOW',
    image: 'assets/dds_cad_piping.jpg',
    client: 'Textile Specialty Chemicals Producer',
    duration: 'Turnkey Know-How & Detail Design',
    impact: '100 TPD Consistent Conning Oil Production with Rapid Capital Payback',
    overview: 'Supplied proprietary technical know-how, process simulation, equipment sizing, and detailed engineering for a 100 TPD Texturizing Oil (Conning Oil) Plant for high-speed DTY machines. The plant achieves flawless product viscosity and optimal commercial returns.'
  }
};

function openProjectModal(projectId) {
  // Redirect to dedicated Case Study single page instead of modal popup
  window.location.href = `case-study.html?id=${projectId || 1}`;
}

function closeProjectModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  const backdrop = document.getElementById('projectModalBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

/* -------------------- 10. SERVICE MODAL DETAILS -------------------- */
const serviceData = {
  detail: {
    tag: 'PROCESS & DETAIL ENGINEERING',
    title: 'Detail Engineering Services',
    desc: 'DDS delivers end-to-end detail design across Process, Piping, Mechanical, Electrical & Instrumentation (E&I), Civil & Structural engineering. Using Aspen HYSYS, PRO-II, AutoCAD Plant 3D, and CAESAR II, we produce complete P&IDs, 3D equipment layouts, isometric fabrication spools, stress analyses, and hazardous area classifications.'
  },
  project: {
    tag: 'PROJECT MANAGEMENT & COMMISSIONING',
    title: 'Project Management and Field Services',
    desc: 'We manage full plant project lifecycles from Capex planning and budgeting to site erection supervision, equipment inspection, pre-commissioning chemical flushes, and smooth plant start-ups strictly adhering to project timelines and financial targets.'
  },
  industrial: {
    tag: 'SHOP FLOOR & OPTIMIZATION',
    title: 'Industrial Services & Plant Audits',
    desc: 'Leveraging 20+ years of plant operations experience, DDS identifies bottlenecks, conducts comprehensive energy and safety audits, optimizes thermal utility circuits, and executes waste reduction and polymer recycling schemes.'
  },
  specialized: {
    tag: 'SPECIALIZED POLYMER & CP DESIGN',
    title: 'Specialized Polymer Melt & CP Services',
    desc: 'India\'s leading designer for Polymer Melt Transfer Lines utilizing proprietary PDRTC software for uniform residence time at >280°C and >150 bar. We also deliver complete basic and detail design for Continuous Polymerisation (CP) plants up to 400 TPD and 100 TPD Conning Oil plants.'
  }
};

function openServiceModal(serviceKey) {
  const item = serviceData[serviceKey];
  const modalContent = document.getElementById('projectModalContent');
  const backdrop = document.getElementById('projectModalBackdrop');

  if (item && modalContent && backdrop) {
    const content = `
      <span class="pill-mini orange">${item.tag}</span>
      <h3 class="modal-title">${item.title}</h3>
      <p style="color: #CBD5E1; line-height: 1.7; font-size: 1rem; margin: 20px 0 24px 0;">${item.desc}</p>
      <button class="btn btn-primary btn-block btn-glow" onclick="closeProjectModal(); openQuoteModal('${item.title}');">REQUEST DETAILED TECHNICAL PROPOSAL</button>
    `;
    modalContent.innerHTML = content;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    // Graceful fallback to proposal / RFQ modal directly
    const fallbackService = item ? item.title : 'Engineering';
    openQuoteModal(fallbackService);
  }
}

/* -------------------- 11. REQUEST RFQ / PROPOSAL MODAL -------------------- */
function openQuoteModal(serviceName) {
  const backdrop = document.getElementById('quoteModalBackdrop');
  if (!backdrop) return;

  const select = document.getElementById('quoteServiceSelect') || backdrop.querySelector('select');
  const title = document.getElementById('quoteModalTitle') || backdrop.querySelector('.modal-title');
  const badge = document.getElementById('quoteModalBadge') || backdrop.querySelector('.pill-mini');

  if (serviceName) {
    const cleanTarget = serviceName.toString().replace(/&amp;/g, '&').trim();

    if (select) {
      let matched = false;
      const lowerTarget = cleanTarget.toLowerCase();

      for (let i = 0; i < select.options.length; i++) {
        const optText = select.options[i].text.toLowerCase();
        const optVal = select.options[i].value.toLowerCase();
        if (optText === lowerTarget || optVal === lowerTarget ||
            optText.includes(lowerTarget) || lowerTarget.includes(optText) ||
            optVal.includes(lowerTarget)) {
          select.selectedIndex = i;
          matched = true;
          break;
        }
      }

      // Keyword fallback match if exact phrase was not found
      if (!matched) {
        const keywords = lowerTarget.split(/[\s,&()]+/).filter(w => w.length > 3);
        for (let i = 0; i < select.options.length; i++) {
          const optText = select.options[i].text.toLowerCase();
          if (keywords.some(k => optText.includes(k))) {
            select.selectedIndex = i;
            matched = true;
            break;
          }
        }
      }
    }

    if (title) {
      title.textContent = `Request ${cleanTarget} Proposal`;
    }
    if (badge) {
      badge.textContent = `${cleanTarget.toUpperCase()} PROPOSAL`;
    }
  } else {
    // Default RFQ modal heading
    if (title) {
      title.textContent = 'Request Detailed Engineering RFQ';
    }
    if (badge) {
      badge.textContent = 'ENGINEERING RFQ';
    }
  }

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuoteModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  const backdrop = document.getElementById('quoteModalBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function handleQuoteSubmit(e) {
  e.preventDefault();
  closeQuoteModal();
  showToast('✓ Engineering RFQ submitted! A DDS principal consultant will respond within 24 hours.');
}

/* -------------------- 12. CONTACT FORM SUBMISSION -------------------- */
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btnSubmitContact');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'TRANSMITTING INQUIRY...';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'SUBMIT ENGINEERING INQUIRY';
      e.target.reset();
      showToast('✓ Thank you! Your engineering inquiry has been received by DDS Engineering.');
    }, 1000);
  }
}

/* -------------------- 13. TOAST NOTIFICATIONS -------------------- */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

/* -------------------- 14. PARTNERS MARQUEE -------------------- */
function initPartnersMarquee() {
  const marquee = document.getElementById('brandMarquee');
  const prevBtn = document.getElementById('brandPrevBtn');
  const nextBtn = document.getElementById('brandNextBtn');

  if (!marquee) return;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      marquee.scrollBy({ left: -300, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      marquee.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
}

/* -------------------- 15. FAQ ACCORDION (Contact Page) -------------------- */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (!faqQuestions.length) return;

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* -------------------- 16. INTERACTIVE ENGINEERING ESTIMATOR (Resources Page) -------------------- */
function initEngineeringCalculator() {
  const calcForm = document.getElementById('estimatorForm');
  if (!calcForm) return;

  const capacityInput = document.getElementById('calcCapacity');
  const polymerSelect = document.getElementById('calcPolymer');
  const positionsInput = document.getElementById('calcPositions');
  const tempInput = document.getElementById('calcTemp');

  function calculate() {
    const tpd = parseFloat(capacityInput.value) || 500;
    const polymerType = polymerSelect.value;
    const positions = parseInt(positionsInput.value, 10) || 48;
    const temp = parseFloat(tempInput.value) || 285;

    // Density approximation in molten state (kg/m3)
    let density = 1200; // PET molten
    if (polymerType === 'PBT') density = 1180;
    if (polymerType === 'PA6') density = 1000;
    if (polymerType === 'PP') density = 780;

    // Melt mass flow rate (kg/hr)
    const massFlowHr = (tpd * 1000) / 24;
    const massFlowSec = massFlowHr / 3600;
    const volFlowSec = massFlowSec / density; // m3/s

    // Estimated Residence time in manifold (minutes)
    const estimatedHoldVolumeM3 = 0.00045 * tpd;
    const residenceTimeMin = (estimatedHoldVolumeM3 / (volFlowSec || 0.001)) / 60;

    // Estimated Pressure Drop (bar) approx range
    const pressureDropBar = Math.round(15 + (tpd * 0.035) + (temp > 290 ? -3 : 2));

    // Per position throughput (kg/hr)
    const perPositionThroughput = (massFlowHr / positions).toFixed(2);

    // Update DOM results
    const resEl = document.getElementById('calcResTime');
    const flowEl = document.getElementById('calcMassFlow');
    const pDropEl = document.getElementById('calcPressureDrop');
    const posEl = document.getElementById('calcPerPosition');

    if (resEl) resEl.textContent = `${Math.max(4, residenceTimeMin).toFixed(1)} min`;
    if (flowEl) flowEl.textContent = `${Math.round(massFlowHr).toLocaleString()} kg/hr`;
    if (pDropEl) pDropEl.textContent = `${pressureDropBar} bar`;
    if (posEl) posEl.textContent = `${perPositionThroughput} kg/hr`;
  }

  [capacityInput, polymerSelect, positionsInput, tempInput].forEach(el => {
    if (el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    }
  });

  calculate();
}

/* -------------------- 17. BACK TO TOP BUTTON -------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

