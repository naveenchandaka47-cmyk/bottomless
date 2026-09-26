import type { ThemeColors, ThemeMode } from '../types';
import { THEMES } from '../themes/themes';
import { SoundEngine } from '../audio/SoundEngine';
import { PhysicsEngine } from '../physics/PhysicsEngine';
import { BreathPacer } from './BreathPacer';
import { MilestoneManager } from '../visuals/MilestoneManager';

export class UIManager {
  private currentTheme: ThemeColors;
  private soundEngine: SoundEngine;
  private physicsEngine: PhysicsEngine;
  private breathPacer: BreathPacer;
  private milestoneManager: MilestoneManager;

  private onThemeChangeCallback?: (theme: ThemeColors) => void;
  private depthUnit: 'm' | 'ft' = 'm';

  // UI DOM elements
  private hudDepthEl!: HTMLElement;
  private hudUnitEl!: HTMLElement;
  private hudDepthSubEl!: HTMLElement;
  private hudZoneEl!: HTMLElement;
  private hudSpeedEl!: HTMLElement;
  private soundBtn!: HTMLButtonElement;
  private soundMenu!: HTMLElement;
  private floatBtn!: HTMLButtonElement;
  private breathBtn!: HTMLButtonElement;
  private themeBtn!: HTMLButtonElement;
  private themeMenu!: HTMLElement;
  private returnBtn!: HTMLButtonElement;
  private milestonesBtn!: HTMLButtonElement;
  private milestonesDrawer!: HTMLElement;
  private philosophyModal!: HTMLElement;

  private idleTimeoutId: number | null = null;

  constructor(
    soundEngine: SoundEngine,
    physicsEngine: PhysicsEngine,
    breathPacer: BreathPacer,
    milestoneManager: MilestoneManager,
    initialTheme: ThemeColors
  ) {
    this.soundEngine = soundEngine;
    this.physicsEngine = physicsEngine;
    this.breathPacer = breathPacer;
    this.milestoneManager = milestoneManager;
    this.currentTheme = initialTheme;

    this.renderUI();
    this.setupListeners();
    this.applyTheme(initialTheme);
  }

  private renderUI() {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    app.innerHTML = `
      <!-- Dynamic Background Canvas & Atmosphere Vignette -->
      <canvas id="particle-canvas"></canvas>
      <div id="vignette-overlay"></div>

      <!-- Center Parallax World for Landmarks & Whispers -->
      <div id="world-container"></div>

      <!-- Top HUD -->
      <header id="top-hud" class="hud-panel">
        <div class="hud-brand">
          <span class="brand-title">bottomless</span>
          <span class="brand-tagline">an infinite descent</span>
        </div>

        <div class="hud-center-metrics">
          <div class="depth-counter-wrap">
            <span id="hud-depth" class="metric-value">0</span>
            <button id="hud-unit-toggle" class="unit-toggle" title="Toggle metric (m/km) or imperial (ft/mi)">m</button>
            <span id="hud-depth-sub" class="depth-sub-val hidden"></span>
          </div>
          <div id="hud-zone" class="zone-badge">The Surface (0 m)</div>
        </div>

        <div class="hud-right-actions">
          <div id="hud-speed-indicator" class="speed-indicator">
            <span class="speed-dot"></span>
            <span id="hud-speed-val">0.0</span> m/s
          </div>
          <button id="btn-philosophy" class="pill-btn subtle" title="Philosophy & Rules">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span class="btn-text">Rules</span>
          </button>
        </div>
      </header>

      <!-- Bottom Floating Control Center -->
      <nav id="bottom-controls" class="floating-controls-bar">
        <!-- Return to Surface Pill -->
        <button id="btn-return" class="control-pill hidden" title="Return to Surface (Home)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          <span class="pill-label">Surface</span>
        </button>

        <!-- Zen Auto-Float Mode -->
        <button id="btn-float" class="control-pill" title="Zen Float Mode: Hands-free calm descent (F)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg>
          <span class="pill-label">Float</span>
        </button>

        <!-- Breath Companion Pacer -->
        <button id="btn-breath" class="control-pill" title="Mindful Breath Pacer (B)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/></svg>
          <span class="pill-label">Breathe</span>
        </button>

        <!-- Sound Engine Controls (Muted by default) -->
        <div class="control-dropdown-wrap">
          <button id="btn-sound" class="control-pill" title="108Hz Harmonic Ambient Drone (M) - Click to un-mute">
            <svg id="sound-icon-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            <svg id="sound-icon-playing" class="hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            <span class="pill-label">Sound</span>
          </button>
          <div id="sound-menu" class="dropdown-popover hidden">
            <div class="popover-title">Harmonic Soundscape</div>
            <button id="btn-toggle-sound-mute" class="sound-mute-action-btn" type="button">Unmute Audio</button>
            <div class="volume-slider-row">
              <span class="slider-label">Volume</span>
              <input type="range" id="sound-vol-slider" min="0" max="1" step="0.01" value="0.5" />
            </div>
            <div class="preset-buttons-row">
              <button class="preset-btn active" data-preset="harmonic108">108Hz Harmonic</button>
              <button class="preset-btn" data-preset="singingBowl">Singing Bowl</button>
              <button class="preset-btn" data-preset="deepAbyss">Deep Abyss</button>
            </div>
          </div>
        </div>

        <!-- Themes Switcher (Void by default) -->
        <div class="control-dropdown-wrap">
          <button id="btn-theme" class="control-pill" title="Switch Theme (T)">
            <span class="theme-swatch void"></span>
            <span class="pill-label">Theme</span>
          </button>
          <div id="theme-menu" class="dropdown-popover hidden">
            <div class="popover-title">Visual Palette</div>
            <button class="theme-select-btn" data-theme="mist">
              <span class="swatch-preview mist"></span>
              <div class="theme-info">
                <strong>Mist</strong>
                <span>Warm eggshell daylight</span>
              </div>
            </button>
            <button class="theme-select-btn" data-theme="tide">
              <span class="swatch-preview tide"></span>
              <div class="theme-info">
                <strong>Tide</strong>
                <span>Coastal oceanic seafoam</span>
              </div>
            </button>
            <button class="theme-select-btn active" data-theme="void">
              <span class="swatch-preview void"></span>
              <div class="theme-info">
                <strong>Void</strong>
                <span>Matte OLED starlight</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Milestones Drawer Toggle -->
        <button id="btn-milestones" class="control-pill" title="Milestone Atlas">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span class="pill-label">Atlas <span id="milestone-count">(0)</span></span>
        </button>
      </nav>

      <!-- First Interaction Gentle Hint -->
      <div id="scroll-hint" class="scroll-hint">
        <div class="hint-mouse">
          <div class="hint-wheel"></div>
        </div>
        <p class="hint-text">Scroll or drag to descend</p>
      </div>

      <!-- Milestone Atlas Drawer -->
      <aside id="milestone-drawer" class="drawer hidden">
        <div class="drawer-header">
          <div class="drawer-title-group">
            <h2 class="drawer-title">Depth Atlas</h2>
            <p class="drawer-sub">Inverted real-world landmarks and abyssal frontiers</p>
          </div>
          <button id="btn-close-drawer" class="icon-close-btn" aria-label="Close">✕</button>
        </div>
        <div id="milestone-list" class="drawer-list"></div>
      </aside>

      <!-- Philosophy & Rules Modal -->
      <div id="philosophy-modal" class="modal-backdrop hidden">
        <div class="modal-card">
          <button id="btn-close-philosophy" class="icon-close-btn" aria-label="Close">✕</button>
          <div class="modal-header">
            <h2 class="modal-title">Bottomless</h2>
            <p class="modal-subtitle">A Sanctuary of Absolute Stillness</p>
          </div>
          <div class="rules-grid">
            <div class="rule-item">
              <div class="rule-icon">01</div>
              <div class="rule-content">
                <h3>ZERO ADS</h3>
                <p>No banners, interstitials, reward videos, or third-party ad networks. Pure uninterrupted calm.</p>
              </div>
            </div>
            <div class="rule-item">
              <div class="rule-icon">02</div>
              <div class="rule-content">
                <h3>ZERO PERMISSIONS</h3>
                <p>No device tracking, no camera, microphone, geolocation, or notifications. Audio is 100% synthesized locally.</p>
              </div>
            </div>
            <div class="rule-item">
              <div class="rule-icon">03</div>
              <div class="rule-content">
                <h3>ZERO SIGN-IN</h3>
                <p>No accounts, passwords, email verification, or forced tutorials. Immediate serenity upon loading.</p>
              </div>
            </div>
            <div class="rule-item">
              <div class="rule-icon">04</div>
              <div class="rule-content">
                <h3>ZERO FAIL STATES</h3>
                <p>Mathematically infinite descent. No score to beat, no obstacles to avoid, no time limit. Just descend.</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="keyboard-guide">
              <span class="key-badge">↓ / Space</span> Descend
              <span class="key-badge">M</span> Drone Sound
              <span class="key-badge">F</span> Zen Float
              <span class="key-badge">B</span> Breathe
              <span class="key-badge">T</span> Theme
              <span class="key-badge">Home</span> Surface
            </div>
          </div>
        </div>
      </div>
    `;

    // Cache elements
    this.hudDepthEl = document.querySelector('#hud-depth')!;
    this.hudUnitEl = document.querySelector('#hud-unit-toggle')!;
    this.hudDepthSubEl = document.querySelector('#hud-depth-sub')!;
    this.hudZoneEl = document.querySelector('#hud-zone')!;
    this.hudSpeedEl = document.querySelector('#hud-speed-val')!;
    this.soundBtn = document.querySelector('#btn-sound')!;
    this.soundMenu = document.querySelector('#sound-menu')!;
    this.floatBtn = document.querySelector('#btn-float')!;
    this.breathBtn = document.querySelector('#btn-breath')!;
    this.themeBtn = document.querySelector('#btn-theme')!;
    this.themeMenu = document.querySelector('#theme-menu')!;
    this.returnBtn = document.querySelector('#btn-return')!;
    this.milestonesBtn = document.querySelector('#btn-milestones')!;
    this.milestonesDrawer = document.querySelector('#milestone-drawer')!;
    this.philosophyModal = document.querySelector('#philosophy-modal')!;

    const worldContainer = document.querySelector<HTMLElement>('#world-container')!;
    this.milestoneManager.setContainer(worldContainer);
  }

  private setupListeners() {
    // 1. Sound toggle & quick settings
    const toggleSoundMute = async () => {
      const isUnmuted = await this.soundEngine.toggleMute();
      this.updateSoundIcon(isUnmuted);
      const muteBtn = document.querySelector('#btn-toggle-sound-mute');
      if (muteBtn) {
        muteBtn.textContent = isUnmuted ? 'Mute Audio' : 'Unmute Audio';
      }
      return isUnmuted;
    };

    this.soundBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (this.soundEngine.getIsMuted()) {
        await toggleSoundMute();
        this.soundMenu.classList.remove('hidden');
      } else {
        this.soundMenu.classList.toggle('hidden');
      }
    });

    document.querySelector('#btn-toggle-sound-mute')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      await toggleSoundMute();
    });

    // Sound menu right-click / contextmenu
    this.soundBtn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.soundMenu.classList.toggle('hidden');
    });

    // Preset selectors
    document.querySelectorAll('.preset-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        const target = e.currentTarget as HTMLElement;
        target.classList.add('active');
        const preset = target.dataset.preset as 'harmonic108' | 'singingBowl' | 'deepAbyss';
        this.soundEngine.setPreset(preset);
      });
    });

    // Volume slider
    const volSlider = document.querySelector('#sound-vol-slider') as HTMLInputElement;
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        this.soundEngine.setVolume(val);
      });
    }

    // 2. Zen Float
    this.floatBtn.addEventListener('click', () => {
      const active = this.physicsEngine.toggleAutoDescend();
      this.floatBtn.classList.toggle('active', active);
    });

    // 3. Breath guide
    this.breathBtn.addEventListener('click', () => {
      const active = this.breathPacer.toggle();
      this.breathBtn.classList.toggle('active', active);
    });

    // 4. Themes
    this.themeBtn.addEventListener('click', () => {
      this.themeMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.theme-select-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const mode = (e.currentTarget as HTMLElement).dataset.theme as ThemeMode;
        if (mode && THEMES[mode]) {
          this.applyTheme(THEMES[mode]);
          this.themeMenu.classList.add('hidden');
        }
      });
    });

    // 5. Unit toggle (Metric m/km vs Imperial ft/mi)
    this.hudUnitEl.addEventListener('click', () => {
      this.depthUnit = this.depthUnit === 'm' ? 'ft' : 'm';
    });

    // 6. Return to surface
    this.returnBtn.addEventListener('click', () => {
      this.physicsEngine.glideToSurface();
    });

    // 7. Milestones drawer
    this.milestonesBtn.addEventListener('click', () => {
      this.populateMilestoneDrawer();
      this.milestonesDrawer.classList.toggle('hidden');
    });

    document.querySelector('#btn-close-drawer')?.addEventListener('click', () => {
      this.milestonesDrawer.classList.add('hidden');
    });

    // 8. Philosophy modal
    document.querySelector('#btn-philosophy')?.addEventListener('click', () => {
      this.philosophyModal.classList.remove('hidden');
    });

    document.querySelector('#btn-close-philosophy')?.addEventListener('click', () => {
      this.philosophyModal.classList.add('hidden');
    });

    this.philosophyModal.addEventListener('click', (e) => {
      if (e.target === this.philosophyModal) {
        this.philosophyModal.classList.add('hidden');
      }
    });

    // Close menus on outside click / tap
    const handleOutsideClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#btn-theme') && !target.closest('#theme-menu')) {
        this.themeMenu.classList.add('hidden');
      }
      if (!target.closest('#btn-sound') && !target.closest('#sound-menu')) {
        this.soundMenu.classList.add('hidden');
      }
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('pointerdown', handleOutsideClick);

    // Keyboard shortcuts
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.key === 'm' || e.key === 'M') {
        this.soundBtn.click();
      } else if (e.key === 'f' || e.key === 'F') {
        this.floatBtn.click();
      } else if (e.key === 'b' || e.key === 'B') {
        this.breathBtn.click();
      } else if (e.key === 't' || e.key === 'T') {
        // Cycle theme
        const modes: ThemeMode[] = ['mist', 'tide', 'void'];
        const currentIdx = modes.indexOf(this.currentTheme.id);
        const nextMode = modes[(currentIdx + 1) % modes.length];
        this.applyTheme(THEMES[nextMode]);
      } else if (e.key === 'Escape') {
        this.philosophyModal.classList.add('hidden');
        this.milestonesDrawer.classList.add('hidden');
        this.themeMenu.classList.add('hidden');
        this.soundMenu.classList.add('hidden');
      }
    });

    // Activity tracking for gentle UI fade during deep immersion
    const onUserActive = () => {
      document.body.classList.remove('ui-soften');
      if (this.idleTimeoutId) clearTimeout(this.idleTimeoutId);
      this.idleTimeoutId = window.setTimeout(() => {
        if (this.physicsEngine.getVelocity() > 0.4) {
          document.body.classList.add('ui-soften');
        }
      }, 3500);
    };

    window.addEventListener('mousemove', onUserActive, { passive: true });
    window.addEventListener('pointermove', onUserActive, { passive: true });
    window.addEventListener('touchstart', onUserActive, { passive: true });
    window.addEventListener('touchmove', onUserActive, { passive: true });
    window.addEventListener('touchend', onUserActive, { passive: true });
    window.addEventListener('wheel', onUserActive, { passive: true });

    // Hide first-time scroll hint after moving or interacting
    const hideHint = () => {
      const hint = document.querySelector('#scroll-hint');
      if (hint && !hint.classList.contains('faded')) {
        hint.classList.add('faded');
      }
    };

    window.addEventListener('touchstart', hideHint, { once: true, passive: true });
    window.addEventListener('wheel', hideHint, { once: true, passive: true });
    window.addEventListener('mousedown', hideHint, { once: true, passive: true });

    // Milestone discovery listener
    this.milestoneManager.onDiscovery((landmark) => {
      this.updateMilestoneCount();
      const isKm = landmark.depthMeters >= 1000;
      const formatted = isKm
        ? `${(landmark.depthMeters / 1000).toFixed(2)} km (${landmark.depthMeters.toLocaleString()}m)`
        : `${landmark.depthMeters.toLocaleString()}m`;
      this.showToast(`Reached ${landmark.name} (${formatted})`);
    });

    this.updateMilestoneCount();
  }

  private updateSoundIcon(unmuted: boolean) {
    const mutedIcon = document.querySelector('#sound-icon-muted');
    const playingIcon = document.querySelector('#sound-icon-playing');
    if (unmuted) {
      mutedIcon?.classList.add('hidden');
      playingIcon?.classList.remove('hidden');
      this.soundBtn.classList.add('active');
    } else {
      mutedIcon?.classList.remove('hidden');
      playingIcon?.classList.add('hidden');
      this.soundBtn.classList.remove('active');
    }
  }

  public applyTheme(theme: ThemeColors) {
    this.currentTheme = theme;
    document.documentElement.style.setProperty('--bg-base', theme.bgBase);
    document.documentElement.style.setProperty('--bg-deep', theme.bgDeep);
    document.documentElement.style.setProperty('--bg-abyss', theme.bgAbyss);
    document.documentElement.style.setProperty('--text-primary', theme.textPrimary);
    document.documentElement.style.setProperty('--text-secondary', theme.textSecondary);
    document.documentElement.style.setProperty('--text-muted', theme.textMuted);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-glow', theme.accentGlow);
    document.documentElement.style.setProperty('--line-color', theme.lineColor);
    document.documentElement.style.setProperty('--card-bg', theme.cardBg);
    document.documentElement.style.setProperty('--card-border', theme.cardBorder);

    // Update active theme swatch
    const swatch = this.themeBtn.querySelector('.theme-swatch');
    if (swatch) {
      swatch.className = `theme-swatch ${theme.id}`;
    }

    // Update active state in menu
    document.querySelectorAll('.theme-select-btn').forEach((btn) => {
      const mode = (btn as HTMLElement).dataset.theme;
      btn.classList.toggle('active', mode === theme.id);
    });

    if (this.onThemeChangeCallback) {
      this.onThemeChangeCallback(theme);
    }
  }

  public onThemeChange(cb: (theme: ThemeColors) => void) {
    this.onThemeChangeCallback = cb;
  }

  public updateMetrics(depthMeters: number, velocity: number) {
    // 1. Dynamic Depth Display with automatic meters -> KM transition
    let displayValue = '0';
    let unitText = 'm';
    let subText = '';

    if (this.depthUnit === 'm') {
      if (depthMeters < 1000) {
        displayValue = Math.floor(depthMeters).toLocaleString();
        unitText = 'm';
        subText = '';
      } else if (depthMeters < 100000) {
        // 1.00 km to 99.99 km (e.g. Titanic at 3.81 km, Everest at 8.85 km, Challenger Deep at 10.93 km)
        displayValue = (depthMeters / 1000).toFixed(2);
        unitText = 'km';
        subText = `(${Math.floor(depthMeters).toLocaleString()} m)`;
      } else {
        // Planetary mantle, core, space (e.g. 150 km, 6,371 km)
        displayValue = (depthMeters / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 });
        unitText = 'km';
        subText = `(${Math.floor(depthMeters).toLocaleString()} m)`;
      }
    } else {
      const feet = depthMeters * 3.28084;
      if (feet < 5280) {
        displayValue = Math.floor(feet).toLocaleString();
        unitText = 'ft';
        subText = '';
      } else {
        const miles = feet / 5280;
        displayValue = miles.toFixed(2);
        unitText = 'mi';
        subText = `(${Math.floor(feet).toLocaleString()} ft)`;
      }
    }

    this.hudDepthEl.textContent = displayValue;
    this.hudUnitEl.textContent = unitText;
    if (subText) {
      this.hudDepthSubEl.textContent = subText;
      this.hudDepthSubEl.classList.remove('hidden');
    } else {
      this.hudDepthSubEl.classList.add('hidden');
    }

    // 2. Zone calculation
    let zoneName = 'The Surface';
    if (depthMeters < 50) zoneName = 'The Surface';
    else if (depthMeters < 200) zoneName = 'Epipelagic Zone (Sunlit Shallows)';
    else if (depthMeters < 1000) zoneName = 'Mesopelagic Zone (Twilight Shallows)';
    else if (depthMeters < 4000) zoneName = 'Bathypelagic Zone (Midnight Stillness)';
    else if (depthMeters < 6000) zoneName = 'Abyssopelagic Zone (The Abyssal Plain)';
    else if (depthMeters < 11000) zoneName = 'Hadalpelagic Zone (Oceanic Trenches)';
    else if (depthMeters < 35000) zoneName = 'The Lithosphere (Earth Crust)';
    else if (depthMeters < 2890000) zoneName = 'The Flowing Mantle';
    else if (depthMeters < 6371000) zoneName = 'The Outer Core';
    else zoneName = 'The Infinite Expanse';

    this.hudZoneEl.textContent = zoneName;

    // 3. Velocity
    this.hudSpeedEl.textContent = Math.abs(velocity).toFixed(1);

    // 4. Return to surface pill visibility
    if (depthMeters > 20) {
      this.returnBtn.classList.remove('hidden');
    } else {
      this.returnBtn.classList.add('hidden');
    }

    // 5. Hide first-time scroll hint after moving
    if (depthMeters > 0.2) {
      const hint = document.querySelector('#scroll-hint');
      if (hint && !hint.classList.contains('faded')) {
        hint.classList.add('faded');
      }
    }

    // Restore full UI opacity when slow or resting
    if (Math.abs(velocity) < 0.2 && document.body.classList.contains('ui-soften')) {
      document.body.classList.remove('ui-soften');
    }
  }

  private updateMilestoneCount() {
    const discovered = this.milestoneManager.getDiscoveredLandmarks().length;
    const countEl = document.querySelector('#milestone-count');
    if (countEl) countEl.textContent = `(${discovered})`;
  }

  private populateMilestoneDrawer() {
    const listEl = document.querySelector('#milestone-list')!;
    const milestones = this.milestoneManager.getAllMilestones();
    const discovered = new Set(this.milestoneManager.getDiscoveredLandmarks().map(m => m.id));

    listEl.innerHTML = milestones.map(m => {
      const isFound = discovered.has(m.id);
      const isKm = m.depthMeters >= 1000;
      const formattedDepth = isKm
        ? `${(m.depthMeters / 1000).toFixed(2)} km`
        : `${m.depthMeters} m`;

      return `
        <div class="atlas-item ${isFound ? 'discovered' : 'undiscovered'}">
          <div class="atlas-depth-tag">
            <span class="atlas-meters">${formattedDepth} ${isKm ? `<small>(${m.depthMeters.toLocaleString()} m)</small>` : ''}</span>
            ${m.invertedNote ? `<span class="atlas-inverted-tag">Inverted</span>` : ''}
          </div>
          <div class="atlas-content">
            <h4 class="atlas-name">${isFound ? m.name : 'Unknown Depth Milestone'}</h4>
            <p class="atlas-sub">${isFound ? m.subtitle : 'Descend deeper to uncover'}</p>
            ${isFound ? `<p class="atlas-desc">${m.description}</p>` : ''}
          </div>
          ${isFound ? `
            <button class="jump-btn" data-depth="${m.depthMeters}">Glide to Depth</button>
          ` : '<span class="lock-icon">🔒</span>'}
        </div>
      `;
    }).join('');

    // Attach click handlers to jump
    listEl.querySelectorAll('.jump-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetDepth = parseFloat((e.currentTarget as HTMLElement).dataset.depth || '0');
        this.physicsEngine.setDepth(targetDepth);
        this.milestonesDrawer.classList.add('hidden');
      });
    });
  }

  private showToast(msg: string) {
    const toast = document.createElement('div');
    toast.className = 'milestone-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
      }, 3000);
    }, 50);
  }
}
