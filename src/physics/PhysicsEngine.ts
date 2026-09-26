import type { PhysicsState } from '../types';

export class PhysicsEngine {
  private depth: number = 0;
  private velocity: number = 0;
  private damping: number = 0.92; // Damping factor ~0.92 as requested
  private terminalVelocity: number = 24.0; // Responsive terminal velocity limit
  private autoDescend: boolean = false;
  private autoDescendSpeed: number = 2.2; // Brisk Zen calm drift
  private isGlidingToSurface: boolean = false;

  // Pointer / Drag tracking
  private isPointerDown: boolean = false;
  private lastPointerY: number = 0;
  private lastPointerTime: number = 0;
  private recentPointerDeltas: { delta: number; dt: number }[] = [];

  // Callbacks
  private onDepthChangeCallbacks: ((depth: number, velocity: number) => void)[] = [];

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // 1. Wheel & Trackpad
    window.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        // Prevent default browser scrolling
        e.preventDefault();

        // Normalize delta
        let deltaY = e.deltaY;
        if (e.deltaMode === 1) deltaY *= 20; // Lines
        else if (e.deltaMode === 2) deltaY *= 150; // Pages

        // Responsive scroll impulse for brisk, smooth descent
        const clampedDelta = Math.sign(deltaY) * Math.min(120, Math.abs(deltaY));
        const impulse = clampedDelta * 0.018;
        this.addImpulse(impulse);
        this.isGlidingToSurface = false;
      },
      { passive: false }
    );

    // 2. Mouse Click & Drag
    window.addEventListener('mousedown', (e: MouseEvent) => {
      // Ignore clicks on buttons/interactive UI/popovers
      const target = e.target as HTMLElement;
      if (target.closest('button, input, select, a, .interactive-ui, .dropdown-popover, .popover-backdrop, .drawer, .modal-backdrop, .floating-controls-bar')) return;

      this.isPointerDown = true;
      this.lastPointerY = e.clientY;
      this.lastPointerTime = performance.now();
      this.recentPointerDeltas = [];
      this.isGlidingToSurface = false;
    });

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isPointerDown) return;
      const now = performance.now();
      const dt = Math.max(1, now - this.lastPointerTime);
      const dy = this.lastPointerY - e.clientY; // Dragging up pulls world down (descent)

      // Direct displacement proportional to drag (fluid, responsive)
      this.depth = Math.max(0, this.depth + dy * 0.06);

      this.recentPointerDeltas.push({ delta: dy, dt });
      if (this.recentPointerDeltas.length > 5) this.recentPointerDeltas.shift();

      this.lastPointerY = e.clientY;
      this.lastPointerTime = now;
    });

    const endPointerDrag = () => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;

      // Calculate fling velocity from recent gestures
      if (this.recentPointerDeltas.length > 0) {
        let totalDy = 0;
        let totalDt = 0;
        for (const item of this.recentPointerDeltas) {
          totalDy += item.delta;
          totalDt += item.dt;
        }
        if (totalDt > 0) {
          const flingVel = Math.min(15.0, (totalDy / totalDt) * 3.5);
          this.addImpulse(flingVel);
        }
      }
      this.recentPointerDeltas = [];
    };

    window.addEventListener('mouseup', endPointerDrag);
    window.addEventListener('mouseleave', endPointerDrag);

    // 3. Touch events for mobile/tablet
    window.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button, input, select, a, .interactive-ui, .dropdown-popover, .popover-backdrop, .drawer, .modal-backdrop, .floating-controls-bar')) return;

        if (e.touches.length === 1) {
          this.isPointerDown = true;
          this.lastPointerY = e.touches[0].clientY;
          this.lastPointerTime = performance.now();
          this.recentPointerDeltas = [];
          this.isGlidingToSurface = false;
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'touchmove',
      (e: TouchEvent) => {
        if (!this.isPointerDown || e.touches.length !== 1) return;
        const now = performance.now();
        const clientY = e.touches[0].clientY;
        const dt = Math.max(1, now - this.lastPointerTime);
        const dy = this.lastPointerY - clientY;

        this.depth = Math.max(0, this.depth + dy * 0.06);

        this.recentPointerDeltas.push({ delta: dy, dt });
        if (this.recentPointerDeltas.length > 5) this.recentPointerDeltas.shift();

        this.lastPointerY = clientY;
        this.lastPointerTime = now;
      },
      { passive: true }
    );

    window.addEventListener('touchend', endPointerDrag, { passive: true });
    window.addEventListener('touchcancel', endPointerDrag, { passive: true });

    // 4. Keyboard Navigation
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        this.addImpulse(1.8);
        this.isGlidingToSurface = false;
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        this.addImpulse(5.5);
        this.isGlidingToSurface = false;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.addImpulse(-1.8);
        this.isGlidingToSurface = false;
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        this.addImpulse(-5.5);
        this.isGlidingToSurface = false;
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.glideToSurface();
      }
    });
  }

  public addImpulse(deltaVelocity: number) {
    this.velocity += deltaVelocity;
    // Clamp to terminal velocity
    this.velocity = Math.max(-this.terminalVelocity, Math.min(this.terminalVelocity, this.velocity));
  }

  public update(dtSeconds: number) {
    // Normalizing damping to frame rate (~60fps baseline: 0.92^1)
    const frameRateRatio = Math.min(3, Math.max(0.2, dtSeconds * 60));
    const effectiveDamping = Math.pow(this.damping, frameRateRatio);

    // Auto-descend / Zen Float mode
    if (this.autoDescend && !this.isPointerDown && !this.isGlidingToSurface) {
      if (this.velocity < this.autoDescendSpeed) {
        this.velocity += (this.autoDescendSpeed - this.velocity) * 0.08 * frameRateRatio;
      }
    }

    // Return to surface glide
    if (this.isGlidingToSurface) {
      const distance = this.depth;
      if (distance <= 0.2) {
        this.depth = 0;
        this.velocity = 0;
        this.isGlidingToSurface = false;
      } else {
        const pull = -Math.min(18, Math.max(2, distance * 0.12));
        this.velocity += (pull - this.velocity) * 0.1 * frameRateRatio;
      }
    }

    if (!this.isPointerDown) {
      // Integrate velocity with calibrated 2.2x factor for satisfying, fluid speed
      this.depth += this.velocity * dtSeconds * 2.2;

      // Apply parachute damping factor (~0.92)
      this.velocity *= effectiveDamping;

      // Zero out micro-jitter
      if (Math.abs(this.velocity) < 0.005) {
        this.velocity = 0;
      }
    }

    // Floor at 0m (Surface threshold - mathematically infinite descent, no negative realm)
    if (this.depth < 0) {
      this.depth = 0;
      if (this.velocity < 0) this.velocity = 0;
      if (this.isGlidingToSurface) this.isGlidingToSurface = false;
    }

    // Notify listeners
    for (const cb of this.onDepthChangeCallbacks) {
      cb(this.depth, this.velocity);
    }
  }

  public glideToSurface() {
    this.isGlidingToSurface = true;
    this.autoDescend = false;
  }

  public toggleAutoDescend(): boolean {
    this.autoDescend = !this.autoDescend;
    if (this.autoDescend) {
      this.isGlidingToSurface = false;
      if (this.velocity < 1.0) {
        this.velocity = 1.0;
      }
    }
    return this.autoDescend;
  }

  public setAutoDescend(state: boolean) {
    this.autoDescend = state;
  }

  public getAutoDescend(): boolean {
    return this.autoDescend;
  }

  public getDepth(): number {
    return this.depth;
  }

  public setDepth(depth: number) {
    this.depth = Math.max(0, depth);
  }

  public getVelocity(): number {
    return this.velocity;
  }

  public onDepthChange(cb: (depth: number, velocity: number) => void) {
    this.onDepthChangeCallbacks.push(cb);
  }

  public getState(): PhysicsState {
    return {
      depth: this.depth,
      velocity: this.velocity,
      targetVelocity: this.velocity,
      isDragging: this.isPointerDown,
      autoDescend: this.autoDescend,
      autoDescendSpeed: this.autoDescendSpeed,
      terminalVelocity: this.terminalVelocity,
      damping: this.damping,
      unit: 'meters'
    };
  }
}
