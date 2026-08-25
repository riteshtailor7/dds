/**
 * COMPANY ENVISION — Interactive Core Logic & Dynamic Behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSlider();
  initStatCounters();
  initMapTelemetry();
  initBackToTop();
  initPartnersMarquee();
});

/* -------------------- 1. NAVIGATION & SCROLL-SPY -------------------- */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for active menu state
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Drawer Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      drawerOverlay.classList.add('open');
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

/* -------------------- 2. HERO CAROUSEL / SLIDER -------------------- */
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

    // Sync background images
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

  function startHeroTimer() {
    heroSlideTimer = setInterval(() => {
      showSlide(currentHeroSlide + 1);
    }, 6500);
  }

  function resetHeroTimer() {
    clearInterval(heroSlideTimer);
    startHeroTimer();
  }

  startHeroTimer();
}

/* -------------------- 3. ANIMATED KPI STAT COUNTERS -------------------- */
function initStatCounters() {
  const kpiSection = document.getElementById('milestones');
  const numbers = document.querySelectorAll('.kpi-number');
  if (!kpiSection || !numbers.length) return;

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
  }, { threshold: 0.25 });

  observer.observe(kpiSection);
}

function animateCounter(element, target, suffix, duration) {
  let start = 0;
  const stepTime = Math.abs(Math.floor(duration / 60));
  const increment = target / (duration / stepTime);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
      element.textContent = target.toLocaleString() + suffix;
    } else {
      element.textContent = Math.floor(start).toLocaleString() + suffix;
    }
  }, stepTime);
}

/* -------------------- 4. INTERACTIVE GLOBAL MAP TELEMETRY -------------------- */
function initMapTelemetry() {
  const mapPins = document.querySelectorAll('.map-pin');
  const tooltip = document.getElementById('mapTooltip');
  const tooltipCity = document.getElementById('tooltipCity');
  const tooltipMetrics = document.getElementById('tooltipMetrics');
  const mapWrapper = document.querySelector('.interactive-map-wrapper');

  if (!mapWrapper || !tooltip) return;

  mapPins.forEach(pin => {
    pin.addEventListener('mouseenter', (e) => {
      const city = pin.getAttribute('data-city');
      const metrics = pin.getAttribute('data-metrics');
      tooltipCity.textContent = city;
      tooltipMetrics.innerHTML = metrics;

      const rect = pin.getBoundingClientRect();
      const parentRect = mapWrapper.getBoundingClientRect();

      const top = rect.top - parentRect.top - 60;
      const left = rect.left - parentRect.left + 10;

      tooltip.style.top = `${Math.max(10, top)}px`;
      tooltip.style.left = `${Math.max(10, left)}px`;
      tooltip.classList.add('visible');
    });

    pin.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
}

/* -------------------- 5. LEADERSHIP TEAM TOGGLE -------------------- */
let teamExpanded = false;

function toggleEntireTeam() {
  const extendedCards = document.querySelectorAll('.extended-member');
  const btn = document.getElementById('btnToggleTeam');

  teamExpanded = !teamExpanded;

  extendedCards.forEach(card => {
    card.classList.toggle('hidden', !teamExpanded);
  });

  if (btn) {
    btn.textContent = teamExpanded ? 'SHOW LESS (3)' : 'VIEW ENTIRE TEAM (9)';
  }
}

/* -------------------- 6. DEEP-DIVE EXPERTISE TABS -------------------- */
function switchExpertiseTab(tabId) {
  const tabBtns = document.querySelectorAll('.expertise-tabs .tab-btn');
  const panes = document.querySelectorAll('.expertise-pane');

  tabBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  // Activate clicked button
  event.currentTarget.classList.add('active');

  panes.forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`pane-${tabId}`);
  if (activePane) {
    activePane.classList.add('active');
  }
}

/* -------------------- 7. PORTFOLIO CATEGORY FILTER -------------------- */
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

/* -------------------- 8. PROJECT MODAL DETAILS -------------------- */
const projectData = {
  1: {
    title: 'Sustainable Tech Management',
    tag: 'CLEAN CLOUD & ESG',
    image: 'assets/hero_skyline.png',
    client: 'Global Fortune 50 FinTech',
    duration: '14 Months',
    impact: 'Saved 4.2M kWh Carbon Equiv & 58% Cost Cut',
    overview: 'Implemented dynamic carbon-aware Kubernetes scheduling across 14 multi-region datacenters. Workloads autonomously migrate to nodes powered by active renewable surplus, cutting aggregate greenhouse emissions while maintaining SLA latencies under 2ms.'
  },
  2: {
    title: 'Complex Project Management',
    tag: 'ENTERPRISE CORE BANKING',
    image: 'assets/team_meeting.png',
    client: 'Tier-1 International Bank Group',
    duration: '18 Months',
    impact: 'Zero-Downtime Migration for 42M Customers',
    overview: 'Led the comprehensive mainframe decommissioning and event-driven microservices re-platforming for 42 million active accounts across 14 jurisdictions with zero transaction interruptions.'
  },
  3: {
    title: 'Complex Sustainable Tech',
    tag: 'HYPER-SCALE INFRASTRUCTURE',
    image: 'assets/datacenter.png',
    client: 'Nordic Sovereign Cloud Institute',
    duration: '10 Months',
    impact: 'Power Usage Effectiveness (PUE) lowered to 1.08',
    overview: 'Engineered immersion liquid cooling retrofits combined with AI-controlled chilled water loops, reducing cooling overhead power by 72% across 80MW compute arrays.'
  },
  4: {
    title: 'Gaagiee Project Domsis',
    tag: 'GLOBAL LOGISTICS TELEMETRY',
    image: 'assets/ai_chip.png',
    client: 'Global Marine & Cargo Freight Carrier',
    duration: '12 Months',
    impact: '99.98% Live Telemetry across 12,000 Containers',
    overview: 'Architected edge IoT sensors connecting to low-orbit satellite mesh to monitor temperature, pressure, vibration, and exact route telemetry in real time across 6 oceans.'
  },
  5: {
    title: 'Project Cirica',
    tag: 'HEALTHCARE NETWORK ADVISORY',
    image: 'assets/team_meeting.png',
    client: 'Pan-European Medical Group',
    duration: '9 Months',
    impact: '45% Clinical Efficiency & HIPAA/GDPR Compliance',
    overview: 'Orchestrated zero-trust federated health record access, integrating encrypted telemedicine streaming and automated compliance logging across 86 hospital nodes.'
  },
  6: {
    title: 'Project Pusikilt',
    tag: 'AI INFERENCE AT SCALE',
    image: 'assets/hero_skyline.png',
    client: 'Autonomous E-Commerce Conglomerate',
    duration: '8 Months',
    impact: '120M Predictions/Hr at Sub-Millisecond Latency',
    overview: 'Engineered specialized hardware accelerator inference clusters utilizing custom tensor compilation, reducing inference server footprint by 60%.'
  }
};

function openProjectModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  const content = `
    <span class="pill-mini orange">${data.tag}</span>
    <h3 class="modal-title">${data.title}</h3>
    <p class="modal-subtitle" style="margin-bottom: 20px;">Client: <strong>${data.client}</strong> &bull; Timeline: <strong>${data.duration}</strong></p>
    <img src="${data.image}" alt="${data.title}" style="width:100%; height: 240px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
    <div style="background: rgba(255,94,20,0.1); border-left: 3px solid #FF5E14; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
      <strong style="color: #FF5E14; display:block; font-size: 0.8125rem;">KEY OUTCOME:</strong>
      <span style="font-weight: 700; color: #FFFFFF;">${data.impact}</span>
    </div>
    <p style="color: #CBD5E1; line-height: 1.7; font-size: 0.9375rem; margin-bottom: 24px;">${data.overview}</p>
    <button class="btn btn-primary btn-block btn-glow" onclick="closeProjectModal(); openQuoteModal();">INQUIRE ABOUT SIMILAR DEPLOYMENT</button>
  `;

  document.getElementById('projectModalContent').innerHTML = content;
  document.getElementById('projectModalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  document.getElementById('projectModalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

/* -------------------- 9. SERVICE MODAL DETAILS -------------------- */
const serviceData = {
  strategic: {
    tag: 'C-SUITE & ARCHITECTURE',
    title: 'Strategic Consulting',
    desc: 'Our strategic advisory squad partners with boards and technology leaders to construct multi-year technology roadmaps, audit cyber vulnerabilities, and identify highest-ROI digital initiatives.'
  },
  digital: {
    tag: 'CLOUD & MODERNIZATION',
    title: 'Digital Transformation',
    desc: 'Transform legacy operational friction into hyper-scale microservices, automated CI/CD release meshes, and containerized multi-cloud infrastructures.'
  },
  logistics: {
    tag: 'SUPPLY CHAIN & IOT',
    title: 'Global Logistics Telemetry',
    desc: 'Autonomous supply routing algorithms, satellite-linked container sensors, predictive warehouse robotics, and custom global visibility dashboards.'
  },
  sustainable: {
    tag: 'ESG & GREEN COMPUTE',
    title: 'Sustainable Solutions',
    desc: 'Carbon footprint accounting engines, dynamic green workload scheduling, liquid-cooled infrastructure retrofitting, and ESG compliance audit certifications.'
  }
};

function openServiceModal(serviceKey) {
  const item = serviceData[serviceKey];
  if (!item) return;

  const content = `
    <span class="pill-mini orange">${item.tag}</span>
    <h3 class="modal-title">${item.title}</h3>
    <p style="color: #CBD5E1; line-height: 1.7; font-size: 1rem; margin: 20px 0 24px 0;">${item.desc}</p>
    <button class="btn btn-primary btn-block btn-glow" onclick="closeProjectModal(); openQuoteModal();">REQUEST DETAILED BRIEFING</button>
  `;

  document.getElementById('projectModalContent').innerHTML = content;
  document.getElementById('projectModalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* -------------------- 10. REQUEST QUOTE MODAL -------------------- */
function openQuoteModal() {
  document.getElementById('quoteModalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuoteModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  document.getElementById('quoteModalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

function handleQuoteSubmit(e) {
  e.preventDefault();
  closeQuoteModal();
  showToast('✓ Quote request submitted! An executive director will reach out within 2 hours.');
}

/* -------------------- 11. CONTACT FORM & NEWSLETTER -------------------- */
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btnSubmitContact');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'TRANSMITTING INQUIRY...';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'SUBMIT INQUIRY';
      e.target.reset();
      showToast('✓ Thank you! Your enterprise inquiry has been securely dispatched.');
    }, 1000);
  }
}

function handleNewsletter(e) {
  e.preventDefault();
  e.target.reset();
  showToast('✓ Subscribed to Nexus Executive Quarterly Brief!');
}

/* -------------------- 12. TOAST NOTIFICATION -------------------- */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* -------------------- 13. PARTNER BRANDS MARQUEE CONTROLS -------------------- */
function initPartnersMarquee() {
  const prevBtn = document.getElementById('brandPrevBtn');
  const nextBtn = document.getElementById('brandNextBtn');
  const container = document.getElementById('marqueeContainer');

  if (prevBtn && container) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    });
  }

  if (nextBtn && container) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }
}

/* -------------------- 14. BACK TO TOP BUTTON -------------------- */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
