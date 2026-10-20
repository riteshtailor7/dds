/**
 * =========================================================================
 * DDS THEME STUDIO - DEDICATED DEV & COLOR STYLING MODULE
 * =========================================================================
 * 
 * 🚀 PRODUCTION GUIDE: HOW TO FINALIZE & REMOVE THIS FEATURE:
 * -------------------------------------------------------------------------
 * 1. Open your website, click the floating "Theme" button at bottom-left.
 * 2. Pick your colors or select a preset (Modern, Pastel, Neon, etc.).
 * 3. Click the "Export Final Production CSS" button at the bottom of the drawer.
 * 4. Paste the copied snippet into the :root block at the top of styles.css.
 * 
 * 🛑 TO TURN OFF / REMOVE THIS ENTIRE STUDIO FOR PRODUCTION:
 *    Simply change THEME_STUDIO_ENABLED below from true to false:
 *       const THEME_STUDIO_ENABLED = false;
 * 
 *    OR delete theme-editor.js and theme-editor.css from your project entirely!
 *    The website will automatically run 100% on pure static CSS with zero overhead!
 * =========================================================================
 */

const THEME_STUDIO_ENABLED = true;

(function initDdsThemeStudioModule() {
  if (!THEME_STUDIO_ENABLED) return;

  // 1. Auto-inject theme-editor.css if not already present in <head>
  if (!document.querySelector('link[href*="theme-editor.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'theme-editor.css';
    document.head.appendChild(link);
  }

  // 2. Presets Database
  const THEME_PRESETS = {
    default: {
      id: 'default',
      name: 'Industrial High-Tech',
      badge: 'Default',
      desc: 'High-visibility industrial engineering orange & electric cyan.',
      colors: {
        primary: '#FF5E14',
        secondary: '#00D2FF',
        btnBg: '#FF5E14',
        btnText: '#FFFFFF',
        bgSpace: '#070B12',
        bgCard: '#111A2E',
        text: '#F1F5F9'
      }
    },
    modern: {
      id: 'modern',
      name: 'Modern Obsidian',
      badge: 'Modern',
      desc: 'Electric indigo & cyber mint on deep minimalist obsidian.',
      colors: {
        primary: '#6366F1',
        secondary: '#14B8A6',
        btnBg: '#6366F1',
        btnText: '#FFFFFF',
        bgSpace: '#0B0F19',
        bgCard: '#151C2C',
        text: '#F9FAFB'
      }
    },
    pastel: {
      id: 'pastel',
      name: 'Nordic Pastel',
      badge: 'Pastel',
      desc: 'Soft ethereal rose blossom & dreamy lavender violet.',
      colors: {
        primary: '#F472B6',
        secondary: '#A78BFA',
        btnBg: '#F472B6',
        btnText: '#FFFFFF',
        bgSpace: '#161426',
        bgCard: '#242038',
        text: '#FDF2F8'
      }
    },
    neon: {
      id: 'neon',
      name: 'Neon Cyberpunk',
      badge: 'Neon',
      desc: 'Vibrant synthwave hot pink & electric aqua on deep void.',
      colors: {
        primary: '#FF007F',
        secondary: '#00F5D4',
        btnBg: '#FF007F',
        btnText: '#FFFFFF',
        bgSpace: '#05050A',
        bgCard: '#0E0E24',
        text: '#FFFFFF'
      }
    },
    emerald: {
      id: 'emerald',
      name: 'Luxe Emerald',
      badge: 'Modern',
      desc: 'Prestigious botanical emerald & aqua gold on deep pine.',
      colors: {
        primary: '#10B981',
        secondary: '#06B6D4',
        btnBg: '#10B981',
        btnText: '#FFFFFF',
        bgSpace: '#051410',
        bgCard: '#0B2620',
        text: '#ECFDF5'
      }
    }
  };

  // Helper Utilities
  function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function hexToRgba(hex, alpha) {
    try {
      const { r, g, b } = hexToRgb(hex);
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } catch (e) {
      return hex;
    }
  }

  function adjustHexBrightness(hex, percent) {
    try {
      const { r, g, b } = hexToRgb(hex);
      const factor = (100 + percent) / 100;
      const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
      const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
      const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
      return '#' + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
    } catch (e) {
      return hex;
    }
  }

  // Apply colors directly to documentElement CSS variables
  function applyThemeColors(colors) {
    const root = document.documentElement;

    // 1. Primary Accent (--accent-orange)
    if (colors.primary) {
      root.style.setProperty('--accent-orange', colors.primary);
      root.style.setProperty('--accent-orange-hover', adjustHexBrightness(colors.primary, -14));
      root.style.setProperty('--accent-orange-glow', hexToRgba(colors.primary, 0.38));
      root.style.setProperty('--glass-border-orange', hexToRgba(colors.primary, 0.30));
    }

    // 2. Secondary Accent (--accent-cyan)
    if (colors.secondary) {
      root.style.setProperty('--accent-cyan', colors.secondary);
      root.style.setProperty('--accent-cyan-glow', hexToRgba(colors.secondary, 0.38));
      root.style.setProperty('--glass-border-cyan', hexToRgba(colors.secondary, 0.30));
    }

    // 3. Dedicated Button Color Controls
    const btnColor = colors.btnBg || colors.primary || '#FF5E14';
    const btnTextColor = colors.btnText || '#FFFFFF';

    root.style.setProperty('--btn-bg', btnColor);
    root.style.setProperty('--btn-bg-hover', adjustHexBrightness(btnColor, -14));
    root.style.setProperty('--btn-glow', hexToRgba(btnColor, 0.42));
    root.style.setProperty('--btn-text', btnTextColor);

    // 4. Dark Space Background (--bg-space)
    if (colors.bgSpace) {
      root.style.setProperty('--bg-space', colors.bgSpace);
      root.style.setProperty('--bg-navy-dark', adjustHexBrightness(colors.bgSpace, 12));
      root.style.setProperty('--glass-bg-dark', hexToRgba(colors.bgSpace, 0.85));
    }

    // 5. Card Surface (--bg-navy-card)
    if (colors.bgCard) {
      root.style.setProperty('--bg-navy-card', colors.bgCard);
      root.style.setProperty('--bg-navy-elevated', adjustHexBrightness(colors.bgCard, 15));
    }

    // 6. Text Primary (--text-slate-100)
    if (colors.text) {
      root.style.setProperty('--text-slate-100', colors.text);
      root.style.setProperty('--text-white', colors.text);
    }
  }

  // LocalStorage Persistence
  function saveThemeSettings(presetId, colors) {
    try {
      const payload = {
        presetId: presetId || 'custom',
        colors: colors,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('dds_theme_settings', JSON.stringify(payload));
    } catch (e) {}
  }

  function getSavedThemeSettings() {
    try {
      const raw = localStorage.getItem('dds_theme_settings');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  // Fast restore on load
  const initialSaved = getSavedThemeSettings();
  if (initialSaved && initialSaved.colors) {
    applyThemeColors(initialSaved.colors);
  }

  // UI Initializer
  function mountThemeStudioUI() {
    if (document.getElementById('themeStudioDrawer')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'themeStudioContainer';
    wrapper.innerHTML = `
      <!-- Floating Launcher Trigger Button -->
      <button class="theme-editor-trigger" id="themeEditorTrigger" title="Customize Website Theme" aria-label="Open Theme Studio">
        <svg class="theme-palette-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 3.86 2.76 7.07 6.44 7.84.44.09.65-.19.65-.43v-1.57c-2.48.54-3-.95-3-.95-.41-1.03-1-1.31-1-1.31-.81-.55.06-.54.06-.54.9.06 1.37.92 1.37.92.79 1.36 2.08.97 2.59.74.08-.57.31-.97.56-1.19-1.98-.23-4.06-.99-4.06-4.41 0-.97.35-1.77.92-2.39-.09-.23-.4-1.13.09-2.36 0 0 .75-.24 2.45.91.71-.2 1.47-.3 2.23-.3.76 0 1.52.1 2.23.3 1.7-1.15 2.45-.91 2.45-.91.49 1.23.18 2.13.09 2.36.57.62.92 1.42.92 2.39 0 3.43-2.09 4.18-4.08 4.4.32.28.61.82.61 1.66v2.46c0 .24.21.52.66.43C19.24 19.07 22 15.86 22 12c0-5.52-4.48-10-10-10z"/>
        </svg>
        <span class="theme-trigger-label">Theme</span>
        <span class="theme-trigger-indicator" id="themeTriggerDot"></span>
      </button>

      <!-- Slide-in Drawer Backdrop -->
      <div class="theme-studio-backdrop" id="themeStudioBackdrop"></div>

      <!-- Theme Studio Drawer Panel -->
      <aside class="theme-studio-drawer" id="themeStudioDrawer" role="dialog" aria-modal="true" aria-label="Theme Studio">
        
        <!-- Production Instruction Ribbon -->
        <div class="theme-prod-banner">
          <span>🛠️ <strong>Dev Mode</strong> &bull; Easily removed for production</span>
          <span style="opacity: 0.7;">v1.0</span>
        </div>

        <!-- Drawer Header -->
        <div class="theme-drawer-header">
          <div class="theme-header-info">
            <div class="theme-title-row">
              <span class="theme-title-icon">🎨</span>
              <h3 class="theme-studio-title">Theme Studio</h3>
              <span class="theme-active-badge" id="themeActiveBadge">Default</span>
            </div>
            <p class="theme-studio-desc">Instant styling &amp; CSS variable customization</p>
          </div>
          <button class="theme-drawer-close" id="themeDrawerClose" aria-label="Close Theme Studio">&times;</button>
        </div>

        <!-- Drawer Scrollable Content -->
        <div class="theme-drawer-body">
          
          <!-- SECTION 1: PRESET PALETTES -->
          <div class="theme-section">
            <div class="theme-section-title-wrap">
              <h4 class="theme-section-title">PRESET PALETTES</h4>
              <span class="theme-section-hint">Click to switch instantly</span>
            </div>
            
            <div class="theme-presets-grid" id="themePresetsGrid"></div>
          </div>

          <!-- SECTION 2: CUSTOM COLOR OVERRIDES (INCLUDING BUTTON COLORS) -->
          <div class="theme-section">
            <div class="theme-section-title-wrap">
              <h4 class="theme-section-title">CUSTOM COLOR OVERRIDES</h4>
              <span class="theme-section-hint">Fine-tune CSS variables</span>
            </div>

            <!-- Live Sample Button Preview Box -->
            <div class="theme-live-preview-box">
              <span class="theme-live-preview-label">Live Button Preview:</span>
              <button class="btn btn-primary btn-glow theme-sample-btn" id="themeSampleBtn">Sample CTA</button>
            </div>

            <div class="theme-color-pickers-list">
              <!-- 1. Dedicated Button Background Fill -->
              <div class="theme-picker-row highlight-row">
                <div class="theme-picker-meta">
                  <span class="theme-picker-name">Button Fill Color</span>
                  <span class="theme-picker-var">--btn-bg</span>
                </div>
                <div class="theme-picker-controls">
                  <input type="color" class="theme-native-picker" id="pickerBtnBg" value="#FF5E14" aria-label="Button Background Color">
                  <input type="text" class="theme-hex-input" id="hexBtnBg" value="#FF5E14" maxlength="7" spellcheck="false">
                </div>
              </div>

              <!-- 2. Dedicated Button Text Color -->
              <div class="theme-picker-row highlight-row">
                <div class="theme-picker-meta">
                  <span class="theme-picker-name">Button Text Color</span>
                  <span class="theme-picker-var">--btn-text</span>
                </div>
                <div class="theme-picker-controls">
                  <input type="color" class="theme-native-picker" id="pickerBtnText" value="#FFFFFF" aria-label="Button Text Color">
                  <input type="text" class="theme-hex-input" id="hexBtnText" value="#FFFFFF" maxlength="7" spellcheck="false">
                </div>
              </div>

              <!-- 3. Primary Accent -->
              <div class="theme-picker-row">
                <div class="theme-picker-meta">
                  <span class="theme-picker-name">Primary Accent</span>
                  <span class="theme-picker-var">--accent-orange</span>
                </div>
                <div class="theme-picker-controls">
                  <input type="color" class="theme-native-picker" id="pickerPrimary" value="#FF5E14" aria-label="Primary Accent Color">
                  <input type="text" class="theme-hex-input" id="hexPrimary" value="#FF5E14" maxlength="7" spellcheck="false">
                </div>
              </div>

              <!-- 4. Secondary Accent -->
              <div class="theme-picker-row">
                <div class="theme-picker-meta">
                  <span class="theme-picker-name">Secondary Accent</span>
                  <span class="theme-picker-var">--accent-cyan</span>
                </div>
                <div class="theme-picker-controls">
                  <input type="color" class="theme-native-picker" id="pickerSecondary" value="#00D2FF" aria-label="Secondary Accent Color">
                  <input type="text" class="theme-hex-input" id="hexSecondary" value="#00D2FF" maxlength="7" spellcheck="false">
                </div>
              </div>

              <!-- 5. Base Background -->
              <div class="theme-picker-row">
                <div class="theme-picker-meta">
                  <span class="theme-picker-name">Dark Background</span>
                  <span class="theme-picker-var">--bg-space</span>
                </div>
                <div class="theme-picker-controls">
                  <input type="color" class="theme-native-picker" id="pickerBgSpace" value="#070B12" aria-label="Background Color">
                  <input type="text" class="theme-hex-input" id="hexBgSpace" value="#070B12" maxlength="7" spellcheck="false">
                </div>
              </div>

              <!-- 6. Card Surface -->
              <div class="theme-picker-row">
                <div class="theme-picker-meta">
                  <span class="theme-picker-name">Card Surface</span>
                  <span class="theme-picker-var">--bg-navy-card</span>
                </div>
                <div class="theme-picker-controls">
                  <input type="color" class="theme-native-picker" id="pickerBgCard" value="#111A2E" aria-label="Card Surface Color">
                  <input type="text" class="theme-hex-input" id="hexBgCard" value="#111A2E" maxlength="7" spellcheck="false">
                </div>
              </div>

              <!-- 7. Primary Text -->
              <div class="theme-picker-row">
                <div class="theme-picker-meta">
                  <span class="theme-picker-name">Primary Text</span>
                  <span class="theme-picker-var">--text-slate-100</span>
                </div>
                <div class="theme-picker-controls">
                  <input type="color" class="theme-native-picker" id="pickerText" value="#F1F5F9" aria-label="Text Color">
                  <input type="text" class="theme-hex-input" id="hexText" value="#F1F5F9" maxlength="7" spellcheck="false">
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Drawer Footer Actions -->
        <div class="theme-drawer-footer">
          <!-- Big One-Click Finalize Button -->
          <button class="theme-prod-export-btn" id="btnExportFinalCss" title="Export clean CSS variables and instructions to finalize for production">
            <span>🚀 Export Final Production CSS</span>
          </button>

          <div class="theme-footer-btn-row">
            <button class="btn btn-outline-cyan btn-sm" id="btnResetTheme" title="Restore factory colors">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reset Default
            </button>
            <button class="btn btn-outline-orange btn-sm" id="btnDismissDrawer">
              Close Studio
            </button>
          </div>
        </div>
      </aside>
    `;
    document.body.appendChild(wrapper);

    // References
    const triggerBtn = document.getElementById('themeEditorTrigger');
    const drawer = document.getElementById('themeStudioDrawer');
    const backdrop = document.getElementById('themeStudioBackdrop');
    const closeBtn = document.getElementById('themeDrawerClose');
    const dismissBtn = document.getElementById('btnDismissDrawer');
    const presetsGrid = document.getElementById('themePresetsGrid');
    const activeBadge = document.getElementById('themeActiveBadge');
    const triggerDot = document.getElementById('themeTriggerDot');
    const btnReset = document.getElementById('btnResetTheme');
    const btnExportFinal = document.getElementById('btnExportFinalCss');

    const inputs = {
      btnBg: { picker: document.getElementById('pickerBtnBg'), hex: document.getElementById('hexBtnBg') },
      btnText: { picker: document.getElementById('pickerBtnText'), hex: document.getElementById('hexBtnText') },
      primary: { picker: document.getElementById('pickerPrimary'), hex: document.getElementById('hexPrimary') },
      secondary: { picker: document.getElementById('pickerSecondary'), hex: document.getElementById('hexSecondary') },
      bgSpace: { picker: document.getElementById('pickerBgSpace'), hex: document.getElementById('hexBgSpace') },
      bgCard: { picker: document.getElementById('pickerBgCard'), hex: document.getElementById('hexBgCard') },
      text: { picker: document.getElementById('pickerText'), hex: document.getElementById('hexText') }
    };

    let currentPresetId = 'default';
    let currentColors = { ...THEME_PRESETS.default.colors };

    function renderPresets() {
      presetsGrid.innerHTML = Object.keys(THEME_PRESETS).map(key => {
        const p = THEME_PRESETS[key];
        const isSelected = p.id === currentPresetId;
        return `
          <div class="theme-preset-card ${isSelected ? 'active' : ''}" data-preset="${p.id}">
            <div class="theme-preset-header">
              <span class="theme-preset-name">${p.name}</span>
              <span class="theme-preset-pill">${p.badge}</span>
            </div>
            <div class="theme-swatch-bar">
              <span class="swatch-block" style="background: ${p.colors.btnBg || p.colors.primary}"></span>
              <span class="swatch-block" style="background: ${p.colors.secondary}"></span>
              <span class="swatch-block" style="background: ${p.colors.bgSpace}"></span>
              <span class="swatch-block" style="background: ${p.colors.bgCard}"></span>
            </div>
            <p class="theme-preset-desc">${p.desc}</p>
          </div>
        `;
      }).join('');

      presetsGrid.querySelectorAll('.theme-preset-card').forEach(card => {
        card.addEventListener('click', () => {
          applyPreset(card.getAttribute('data-preset'));
        });
      });
    }

    function syncInputsWithColors() {
      Object.keys(inputs).forEach(key => {
        if (currentColors[key]) {
          inputs[key].picker.value = currentColors[key];
          inputs[key].hex.value = currentColors[key].toUpperCase();
        }
      });

      const preset = THEME_PRESETS[currentPresetId];
      activeBadge.textContent = preset ? preset.badge : 'Custom';
      activeBadge.className = 'theme-active-badge ' + (currentPresetId !== 'default' ? 'custom' : '');
      if (triggerDot) {
        triggerDot.style.background = currentColors.btnBg || currentColors.primary;
      }

      presetsGrid.querySelectorAll('.theme-preset-card').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-preset') === currentPresetId);
      });
    }

    function applyPreset(presetId) {
      const preset = THEME_PRESETS[presetId];
      if (!preset) return;

      currentPresetId = presetId;
      currentColors = { ...preset.colors };

      applyThemeColors(currentColors);
      syncInputsWithColors();
      saveThemeSettings(currentPresetId, currentColors);

      if (typeof showToast === 'function') {
        showToast('Switched to ' + preset.name + ' theme', 'success');
      }
    }

    function updateCustomColor(field, hexValue) {
      currentColors[field] = hexValue;
      currentPresetId = 'custom';

      if (field === 'primary' && !currentColors.btnBgManual) {
        currentColors.btnBg = hexValue;
      }
      if (field === 'btnBg') {
        currentColors.btnBgManual = true;
      }

      applyThemeColors(currentColors);
      syncInputsWithColors();
      saveThemeSettings(currentPresetId, currentColors);
    }

    Object.keys(inputs).forEach(field => {
      const { picker, hex } = inputs[field];

      picker.addEventListener('input', (e) => {
        const val = e.target.value;
        hex.value = val.toUpperCase();
        updateCustomColor(field, val);
      });

      hex.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          picker.value = val;
          updateCustomColor(field, val);
        }
      });
    });

    function openThemeDrawer() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeThemeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    triggerBtn.addEventListener('click', openThemeDrawer);
    closeBtn.addEventListener('click', closeThemeDrawer);
    if (dismissBtn) dismissBtn.addEventListener('click', closeThemeDrawer);
    backdrop.addEventListener('click', closeThemeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeThemeDrawer();
      }
    });

    btnReset.addEventListener('click', () => {
      localStorage.removeItem('dds_theme_settings');
      applyPreset('default');
      if (typeof showToast === 'function') {
        showToast('Restored default industrial theme', 'info');
      }
    });

    // One-Click Production Export
    btnExportFinal.addEventListener('click', () => {
      const bColor = currentColors.btnBg || currentColors.primary;
      const bText = currentColors.btnText || '#FFFFFF';

      const prodSnippet = `/* ========================================================
 * FINAL PRODUCTION COLOR SCHEME
 * Generated via DDS Theme Studio
 * --------------------------------------------------------
 * HOW TO FINALIZE:
 * 1. Replace the :root variables block at the top of styles.css with this:
 * 2. In theme-editor.js, set: const THEME_STUDIO_ENABLED = false;
 * ======================================================== */
:root {
  /* Surface Colors */
  --bg-space: ${currentColors.bgSpace};
  --bg-navy-dark: ${adjustHexBrightness(currentColors.bgSpace, 12)};
  --bg-navy-card: ${currentColors.bgCard};
  --bg-navy-elevated: ${adjustHexBrightness(currentColors.bgCard, 15)};
  --glass-bg-dark: ${hexToRgba(currentColors.bgSpace, 0.85)};

  /* Accent Colors */
  --accent-orange: ${currentColors.primary};
  --accent-orange-hover: ${adjustHexBrightness(currentColors.primary, -14)};
  --accent-orange-glow: ${hexToRgba(currentColors.primary, 0.38)};
  --glass-border-orange: ${hexToRgba(currentColors.primary, 0.30)};

  --accent-cyan: ${currentColors.secondary};
  --accent-cyan-glow: ${hexToRgba(currentColors.secondary, 0.38)};
  --glass-border-cyan: ${hexToRgba(currentColors.secondary, 0.30)};

  /* Primary Button Controls */
  --btn-bg: ${bColor};
  --btn-bg-hover: ${adjustHexBrightness(bColor, -14)};
  --btn-glow: ${hexToRgba(bColor, 0.42)};
  --btn-text: ${bText};

  /* Typography */
  --text-slate-100: ${currentColors.text};
  --text-white: ${currentColors.text};
}`;

      navigator.clipboard.writeText(prodSnippet).then(() => {
        if (typeof showToast === 'function') {
          showToast('Production CSS copied! Paste into styles.css, then set THEME_STUDIO_ENABLED = false.', 'success');
        } else {
          alert('Production CSS copied! Paste into styles.css, then set THEME_STUDIO_ENABLED = false in theme-editor.js.');
        }
      }).catch(() => {
        prompt('Copy your Production CSS variables below:', prodSnippet);
      });
    });

    const saved = getSavedThemeSettings();
    if (saved && saved.colors) {
      currentColors = { ...THEME_PRESETS.default.colors, ...saved.colors };
      currentPresetId = saved.presetId || 'custom';
      applyThemeColors(currentColors);
    }

    renderPresets();
    syncInputsWithColors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountThemeStudioUI);
  } else {
    mountThemeStudioUI();
  }
})();
