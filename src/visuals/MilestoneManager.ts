import type { Landmark, ThemeColors } from '../types';
import { MILESTONES } from '../data/milestones';
import { getWhisperForDepth } from '../data/whispers';
import { getLandmarkSvg } from './LandmarkVisuals';

export interface MilestoneDiscoveryEvent {
  landmark: Landmark;
  isNew: boolean;
}

export class MilestoneManager {
  private container: HTMLElement;
  private currentTheme: ThemeColors;
  private discoveredLandmarks: Set<string> = new Set();
  private pixelsPerMeter: number = 3.8; // Vertical pixels per meter
  private activeLandmarkCard: HTMLElement | null = null;
  private activeWhisperCard: HTMLElement | null = null;
  private onDiscoveryCallback?: (landmark: Landmark) => void;
  private lastHapticLandmarkId: string = '';

  constructor(container: HTMLElement, initialTheme: ThemeColors) {
    this.container = container;
    this.currentTheme = initialTheme;

    // Load saved discovered landmarks from session/local storage if available
    try {
      const saved = localStorage.getItem('bottomless_discovered');
      if (saved) {
        JSON.parse(saved).forEach((id: string) => this.discoveredLandmarks.add(id));
      }
    } catch {
      // Zero-permission graceful fallback
    }
  }

  public setContainer(container: HTMLElement) {
    this.container = container;
  }

  public setTheme(theme: ThemeColors) {
    this.currentTheme = theme;
    // Re-render current active cards with new colors
  }

  public onDiscovery(cb: (landmark: Landmark) => void) {
    this.onDiscoveryCallback = cb;
  }

  public getDiscoveredLandmarks(): Landmark[] {
    return MILESTONES.filter(m => this.discoveredLandmarks.has(m.id));
  }

  public getAllMilestones(): Landmark[] {
    return MILESTONES;
  }

  public update(currentDepth: number, viewportHeight: number) {
    const centerY = viewportHeight / 2;
    const viewRangeMeters = (viewportHeight / this.pixelsPerMeter) * 0.75;

    // 1. Find landmarks near current depth
    let nearLandmark: { landmark: Landmark; screenY: number; distance: number } | null = null;
    let minLandmarkDist = Infinity;

    for (const lm of MILESTONES) {
      const dist = Math.abs(lm.depthMeters - currentDepth);
      if (dist < viewRangeMeters) {
        if (dist < minLandmarkDist) {
          minLandmarkDist = dist;
          // screenY where landmark should sit
          const screenY = centerY + (lm.depthMeters - currentDepth) * this.pixelsPerMeter;
          nearLandmark = { landmark: lm, screenY, distance: dist };
        }
      }
    }

    // Render / update landmark card
    if (nearLandmark) {
      this.renderLandmark(nearLandmark.landmark, nearLandmark.screenY, nearLandmark.distance, viewRangeMeters);

      // Check discovery
      if (nearLandmark.distance < 8 && !this.discoveredLandmarks.has(nearLandmark.landmark.id)) {
        this.discoveredLandmarks.add(nearLandmark.landmark.id);
        try {
          localStorage.setItem('bottomless_discovered', JSON.stringify(Array.from(this.discoveredLandmarks)));
        } catch {
          // ignore
        }
        if (this.onDiscoveryCallback) {
          this.onDiscoveryCallback(nearLandmark.landmark);
        }
      }

      // Haptic feedback pulse once when passing center
      if (nearLandmark.distance < 4 && this.lastHapticLandmarkId !== nearLandmark.landmark.id) {
        this.lastHapticLandmarkId = nearLandmark.landmark.id;
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate(20);
          } catch {
            // ignore
          }
        }
      }
    } else {
      if (this.activeLandmarkCard) {
        this.activeLandmarkCard.remove();
        this.activeLandmarkCard = null;
      }
    }

    // 2. Whispers: positioned every 140 meters (e.g. 70m, 210m, 350m...)
    // avoid overlapping directly on top of major landmarks
    const whisperInterval = 140;
    const currentInterval = Math.round(currentDepth / whisperInterval);
    const whisperDepth = currentInterval * whisperInterval + 70; // offset so it doesn't collide

    const whisperDist = Math.abs(whisperDepth - currentDepth);
    const whisperViewRange = (viewportHeight / this.pixelsPerMeter) * 0.55;

    // Check if a landmark is already occupying the center space
    const isLandmarkTooClose = nearLandmark && nearLandmark.distance < 40;

    if (whisperDist < whisperViewRange && !isLandmarkTooClose && currentDepth > 30) {
      const screenY = centerY + (whisperDepth - currentDepth) * this.pixelsPerMeter;
      const whisperText = getWhisperForDepth(currentInterval);
      this.renderWhisper(whisperText, screenY, whisperDist, whisperViewRange);
    } else {
      if (this.activeWhisperCard) {
        this.activeWhisperCard.remove();
        this.activeWhisperCard = null;
      }
    }
  }

  private renderLandmark(landmark: Landmark, screenY: number, distance: number, viewRange: number) {
    if (!this.activeLandmarkCard || this.activeLandmarkCard.dataset.id !== landmark.id) {
      if (this.activeLandmarkCard) this.activeLandmarkCard.remove();

      this.activeLandmarkCard = document.createElement('div');
      this.activeLandmarkCard.className = 'landmark-display-card';
      this.activeLandmarkCard.dataset.id = landmark.id;

      const svgHtml = getLandmarkSvg(landmark, this.currentTheme.accent);
      const isKm = landmark.depthMeters >= 1000;
      const depthFormatted = isKm
        ? (landmark.depthMeters / 1000).toFixed(2)
        : landmark.depthMeters.toLocaleString();

      this.activeLandmarkCard.innerHTML = `
        <div class="landmark-illustration-wrapper">
          ${svgHtml}
        </div>
        <div class="landmark-meta">
          <div class="landmark-depth-tag">
            <span class="depth-number">${depthFormatted}</span>
            <span class="depth-unit">${isKm ? 'km' : 'm'}</span>
            ${isKm ? `<span class="exact-meters">(${landmark.depthMeters.toLocaleString()} m)</span>` : ''}
            ${landmark.invertedNote ? `<span class="inverted-pill">${landmark.invertedNote}</span>` : ''}
          </div>
          <h2 class="landmark-title">${landmark.name}</h2>
          <h3 class="landmark-subtitle">${landmark.subtitle}</h3>
          <p class="landmark-desc">${landmark.description}</p>
        </div>
      `;

      this.container.appendChild(this.activeLandmarkCard);
    }

    // Smooth opacity fade based on distance from center
    const fadeRatio = 1 - Math.min(1, distance / viewRange);
    const opacity = Math.pow(fadeRatio, 1.4);

    this.activeLandmarkCard.style.top = `${screenY}px`;
    this.activeLandmarkCard.style.opacity = `${opacity}`;
    this.activeLandmarkCard.style.transform = `translate(-50%, -50%) scale(${0.92 + 0.08 * fadeRatio})`;
  }

  private renderWhisper(text: string, screenY: number, distance: number, viewRange: number) {
    if (!this.activeWhisperCard || this.activeWhisperCard.dataset.text !== text) {
      if (this.activeWhisperCard) this.activeWhisperCard.remove();

      this.activeWhisperCard = document.createElement('div');
      this.activeWhisperCard.className = 'whisper-display-card';
      this.activeWhisperCard.dataset.text = text;
      this.activeWhisperCard.innerHTML = `
        <div class="whisper-ornament">
          <span class="whisper-line"></span>
          <span class="whisper-dot"></span>
          <span class="whisper-line"></span>
        </div>
        <blockquote class="whisper-quote">${text}</blockquote>
      `;
      this.container.appendChild(this.activeWhisperCard);
    }

    const fadeRatio = 1 - Math.min(1, distance / viewRange);
    const opacity = Math.pow(fadeRatio, 1.6);

    this.activeWhisperCard.style.top = `${screenY}px`;
    this.activeWhisperCard.style.opacity = `${opacity}`;
    this.activeWhisperCard.style.transform = `translate(-50%, -50%) scale(${0.95 + 0.05 * fadeRatio})`;
  }
}
