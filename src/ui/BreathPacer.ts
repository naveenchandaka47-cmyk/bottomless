export class BreathPacer {
  private container: HTMLElement;
  private isActive: boolean = false;
  private animFrameId: number | null = null;
  private startTime: number = 0;

  // 4 - 2 - 6 - 1 relaxation cycle (total 13 seconds, or 5.5s harmonic cycle)
  // Let's implement harmonic 5.5s coherent breathing (5.5s inhale, 5.5s exhale = 11s full cycle)
  // which scientifically maximizes Heart Rate Variability (HRV) and soothes the vagus nerve.
  private cycleDuration: number = 11000; // ms

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = 'breath-pacer-widget hidden';
    this.container.innerHTML = `
      <div class="breath-ring-outer">
        <div class="breath-ring-glow"></div>
        <div class="breath-ring-core"></div>
        <div class="breath-ring-inner"></div>
        <span class="breath-label">Breathe in</span>
      </div>
      <div class="breath-caption">5.5s Resonant Rhythm</div>
    `;
    parent.appendChild(this.container);
  }

  public toggle(): boolean {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.container.classList.remove('hidden');
      this.startTime = performance.now();
      this.startLoop();
    } else {
      this.container.classList.add('hidden');
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }
    return this.isActive;
  }

  private startLoop() {
    const loop = (now: number) => {
      if (!this.isActive) return;

      const elapsed = (now - this.startTime) % this.cycleDuration;
      const progress = elapsed / this.cycleDuration; // 0 to 1

      // 0 to 0.45: Inhale (expand)
      // 0.45 to 0.52: Gentle pause
      // 0.52 to 0.95: Exhale (contract)
      // 0.95 to 1.0: Rest
      let scale = 1.0;
      let label = 'Breathe in';

      if (progress < 0.45) {
        // Inhale: ease in-out cubic
        const p = progress / 0.45;
        scale = 1.0 + 0.65 * (p * p * (3 - 2 * p));
        label = 'Inhale gently...';
      } else if (progress < 0.52) {
        // Hold
        scale = 1.65;
        label = 'Hold softly...';
      } else if (progress < 0.95) {
        // Exhale: smooth release
        const p = (progress - 0.52) / 0.43;
        scale = 1.65 - 0.65 * (p * p * (3 - 2 * p));
        label = 'Release & exhale...';
      } else {
        // Stillness pause
        scale = 1.0;
        label = 'Stillness...';
      }

      const core = this.container.querySelector('.breath-ring-core') as HTMLElement;
      const glow = this.container.querySelector('.breath-ring-glow') as HTMLElement;
      const labelEl = this.container.querySelector('.breath-label') as HTMLElement;

      if (core) core.style.transform = `scale(${scale})`;
      if (glow) glow.style.transform = `scale(${scale * 1.15})`;
      if (labelEl) labelEl.textContent = label;

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public getIsActive(): boolean {
    return this.isActive;
  }
}
