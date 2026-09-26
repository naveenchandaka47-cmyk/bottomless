import type { ThemeColors } from '../types';

interface Mote {
  x: number;
  y: number;
  layer: number; // 0 = far, 1 = mid, 2 = near
  baseRadius: number;
  alpha: number;
  baseAlpha: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayPhase: number;
  ambientFloatSpeed: number;
}

export class ParticleField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private motes: Mote[] = [];
  private numMotes: number = 180;
  private width: number = window.innerWidth;
  private height: number = window.innerHeight;
  private currentTheme: ThemeColors;
  private dpr: number = window.devicePixelRatio || 1;

  constructor(canvas: HTMLCanvasElement, initialTheme: ThemeColors) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2d context');
    this.ctx = context;
    this.currentTheme = initialTheme;

    this.resize();
    this.initMotes();

    window.addEventListener('resize', () => this.resize());
  }

  public setTheme(theme: ThemeColors) {
    this.currentTheme = theme;
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(this.dpr, this.dpr);
  }

  private initMotes() {
    this.motes = [];
    for (let i = 0; i < this.numMotes; i++) {
      // Layer distribution: 50% far, 35% mid, 15% near
      const rand = Math.random();
      const layer = rand < 0.5 ? 0 : rand < 0.85 ? 1 : 2;

      let baseRadius = 1.0;
      let baseAlpha = 0.25;
      let ambientSpeed = 0.15;

      if (layer === 0) {
        baseRadius = 0.7 + Math.random() * 0.9;
        baseAlpha = 0.12 + Math.random() * 0.18;
        ambientSpeed = 0.12 + Math.random() * 0.12;
      } else if (layer === 1) {
        baseRadius = 1.6 + Math.random() * 1.2;
        baseAlpha = 0.22 + Math.random() * 0.26;
        ambientSpeed = 0.2 + Math.random() * 0.18;
      } else {
        baseRadius = 2.8 + Math.random() * 1.8;
        baseAlpha = 0.35 + Math.random() * 0.35;
        ambientSpeed = 0.32 + Math.random() * 0.25;
      }

      this.motes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        layer,
        baseRadius,
        alpha: baseAlpha,
        baseAlpha,
        swaySpeed: 0.3 + Math.random() * 0.6,
        swayAmplitude: 0.8 + Math.random() * 1.8,
        swayPhase: Math.random() * Math.PI * 2,
        ambientFloatSpeed: ambientSpeed
      });
    }
  }

  public render(dtSeconds: number, velocity: number, timeSeconds: number) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const [r, g, b] = this.currentTheme.moteBase;
    const absVelocity = Math.abs(velocity);
    const speedRatio = Math.min(absVelocity / 20.0, 1);

    for (let i = 0; i < this.motes.length; i++) {
      const m = this.motes[i];

      // Layer parallax multiplier
      const layerMultiplier = m.layer === 0 ? 0.35 : m.layer === 1 ? 0.75 : 1.35;

      // Vertical drift: upward ambient float plus scroll velocity
      // As user descends (velocity > 0), motes stream upward
      const vOffset = (velocity * 24.0 * layerMultiplier + m.ambientFloatSpeed * 30.0) * dtSeconds;
      m.y -= vOffset;

      // Horizontal subtle organic sway
      const sway = Math.sin(timeSeconds * m.swaySpeed + m.swayPhase) * m.swayAmplitude * dtSeconds * 30;
      m.x += sway;

      // Wrap around screen boundaries
      if (m.y < -30) {
        m.y = this.height + 25;
        m.x = Math.random() * this.width;
      } else if (m.y > this.height + 30) {
        m.y = -25;
        m.x = Math.random() * this.width;
      }

      if (m.x < -30) m.x = this.width + 25;
      else if (m.x > this.width + 30) m.x = -25;

      // Stretch motes along velocity vector during swift descent
      const stretch = Math.max(1, 1 + speedRatio * 3.5 * layerMultiplier);
      const alpha = Math.min(0.9, m.baseAlpha * (1 + speedRatio * 0.4));

      this.ctx.save();
      this.ctx.translate(m.x, m.y);

      this.ctx.beginPath();
      if (stretch > 1.2 && absVelocity > 2) {
        // Draw soft vertical streak
        const radiusX = m.baseRadius;
        const radiusY = m.baseRadius * stretch;
        this.ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
      } else {
        // Draw round mote
        this.ctx.arc(0, 0, m.baseRadius, 0, Math.PI * 2);
      }

      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      this.ctx.fill();

      // Soft glow for foreground motes
      if (m.layer === 2) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, m.baseRadius * 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.2})`;
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}
