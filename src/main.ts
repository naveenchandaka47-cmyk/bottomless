import './style.css';
import { THEMES } from './themes/themes';
import { SoundEngine } from './audio/SoundEngine';
import { PhysicsEngine } from './physics/PhysicsEngine';
import { ParticleField } from './visuals/ParticleField';
import { MilestoneManager } from './visuals/MilestoneManager';
import { BreathPacer } from './ui/BreathPacer';
import { UIManager } from './ui/UIManager';

// 1. Initial State & Themes
const initialTheme = THEMES.void; // Matte OLED black default

// 2. Initialize Subsystems
const soundEngine = new SoundEngine();
const physicsEngine = new PhysicsEngine();
const breathPacer = new BreathPacer(document.body);
const milestoneManager = new MilestoneManager(document.body, initialTheme);

// 3. UI Manager Setup (Renders DOM structure & connects milestoneManager to #world-container)
const uiManager = new UIManager(
  soundEngine,
  physicsEngine,
  breathPacer,
  milestoneManager,
  initialTheme
);

// 4. Setup Canvas Particles
const canvas = document.querySelector<HTMLCanvasElement>('#particle-canvas')!;
const particleField = new ParticleField(canvas, initialTheme);

// 5. Connect Theme Changes
uiManager.onThemeChange((theme) => {
  particleField.setTheme(theme);
  milestoneManager.setTheme(theme);
});

// 6. Seamless First User Gesture Audio Unlock (Drone ON by default)
soundEngine.initAudio().catch(() => {});

const unlockAudioOnGesture = () => {
  soundEngine.initAudio().catch(() => {});
  window.removeEventListener('pointerdown', unlockAudioOnGesture);
  window.removeEventListener('keydown', unlockAudioOnGesture);
  window.removeEventListener('wheel', unlockAudioOnGesture);
  window.removeEventListener('touchstart', unlockAudioOnGesture);
};

window.addEventListener('pointerdown', unlockAudioOnGesture, { once: true });
window.addEventListener('keydown', unlockAudioOnGesture, { once: true });
window.addEventListener('wheel', unlockAudioOnGesture, { once: true });
window.addEventListener('touchstart', unlockAudioOnGesture, { once: true });

// 7. High-Precision Animation & Physics Loop
let lastTime = performance.now();

function frame(now: number) {
  const dt = Math.min((now - lastTime) / 1000, 0.1); // Clamp max dt to prevent jumps on tab unfocus
  lastTime = now;

  // Step physics momentum (damping 0.92, terminal velocity, glide)
  physicsEngine.update(dt);

  const depth = physicsEngine.getDepth();
  const velocity = physicsEngine.getVelocity();

  // Update ambient audio synthesizer (frequency micro-glide & velocity rush)
  soundEngine.update(depth, velocity);

  // Render ambient motes
  particleField.render(dt, velocity, now / 1000);

  // Update center milestones & whispers
  milestoneManager.update(depth, window.innerHeight);

  // Update HUD metrics
  uiManager.updateMetrics(depth, velocity);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

// 8. Service Worker Registration for Offline Calm & Play Store PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      // Promptly check for updates
      registration.update().catch(() => {});
    }).catch(() => {});
  });
}
