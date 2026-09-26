# Bottomless — An Infinite Descent

> A production-grade, minimalist stress-relief and mindfulness web & mobile application.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Deploy-7D94B8?style=flat-square&logo=github)](https://github.com)
[![Zero Ads](https://img.shields.io/badge/Ads-ZERO-08090C?style=flat-square)](https://github.com)
[![Zero Permissions](https://img.shields.io/badge/Permissions-ZERO-08090C?style=flat-square)](https://github.com)
[![Zero Sign--in](https://img.shields.io/badge/Sign--in-ZERO-08090C?style=flat-square)](https://github.com)
[![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline-7D94B8?style=flat-square)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🌌 The Philosophy & Strict Rules

1. **ZERO ADS**: No banners, interstitial pop-ups, reward videos, or third-party ad networks. Pure uninterrupted serenity.
2. **ZERO PERMISSIONS**: No tracking, geolocation, camera, microphone, or notifications. Audio is 100% synthesized locally on your device via the Web Audio API.
3. **ZERO SIGN-IN**: No accounts, passwords, email verification, or onboarding walls. Instant immersion the moment you open the app.
4. **ZERO FAIL STATES**: Mathematically infinite descent ($0\text{ m} \to \infty$). No score to beat, no obstacles to avoid, and no game over.

---

## ✨ Features

- **108 Hz Sacred Harmonic Drone**: Zero-permission Web Audio API synthesizer featuring a fundamental $108\text{ Hz}$ sine wave, $54\text{ Hz}$ grounding sub-octave, and $162\text{ Hz}$ harmonic fifth with micro-detuning producing calming theta/alpha binaural beats. Pitch subtly deepens as you descend into the earth.
- **Momentum Physics Engine**: Parachute-style inertia scroll with natural damping ($\sim 0.92$), terminal velocity ceiling ($24\text{ m/s}$), and cross-platform support for mouse wheel, trackpad, touch swipe, and click-and-drag.
- **Inverted Real-World Landmarks**:
  - $93\text{ m}$ — Statue of Liberty (Inverted torch to base)
  - $330\text{ m}$ — Eiffel Tower
  - $332\text{ m}$ — Deepest Scuba Dive (Ahmed Gabr)
  - $500\text{ m}$ — Blue Whale Dive Limit
  - $828\text{ m}$ — Burj Khalifa (Tallest human structure)
  - $1,000\text{ m}$ — Bathypelagic Midnight Zone
  - $3,810\text{ m}$ — RMS Titanic
  - $6,000\text{ m}$ — The Hadal Realm
  - $8,849\text{ m}$ — Mount Everest (Inverted Himalayan summit)
  - $10,928\text{ m}$ — Challenger Deep (Mariana Trench)
  - $12,262\text{ m} \to 10,000,000\text{ m}+$ — Kola Borehole, Earth's Mantle, Core, and the Boundless Expanse.
- **Mindful Somatic Whispers**: Over 35 curated physical relaxation and presence prompts fading into view every $\sim 140\text{ meters}$ (*"Unclench your jaw"*, *"Whatever happened today can wait"*).
- **Dynamic Scale ($\text{m} \to \text{km}$)**: Seamlessly transitions from meters to kilometers at $\ge 1,000\text{ m}$ (with exact meter tags).
- **Three Calibrated Themes**:
  - **Void** (Default): Matte OLED black (`#08090C`) with ethereal starlight motes.
  - **Mist**: Warm daylight eggshell (`#FAF8F5`) for zero blue-light eye strain.
  - **Tide**: Soft coastal seafoam (`#EBF3F0`) with oceanic sage tones.
- **Resonant Breath Companion**: Visual $5.5\text{s}$ breathing guide to synchronize Heart Rate Variability (HRV).
- **Zen Auto-Float**: Hands-free constant calm descent mode.
- **PWA & Offline First**: Installable on Android & iOS as a standalone fullscreen app with zero internet required.

---

## ⌨️ Controls & Keyboard Shortcuts

| Key / Gesture | Action |
| :--- | :--- |
| **Mouse Wheel / Trackpad** | Scroll to descend or ascend |
| **Click & Drag / Touch Swipe** | Direct inertia throw |
| <kbd>↓</kbd> / <kbd>Space</kbd> | Gentle descent impulse |
| <kbd>PageDown</kbd> | Brisk descent plunge |
| <kbd>↑</kbd> / <kbd>PageUp</kbd> | Ascend / Reverse |
| <kbd>M</kbd> | Toggle 108Hz Drone Sound (Muted by default) |
| <kbd>F</kbd> | Toggle Zen Auto-Float |
| <kbd>B</kbd> | Toggle Breath Guide |
| <kbd>T</kbd> | Cycle Themes (*Void* $\to$ *Mist* $\to$ *Tide*) |
| <kbd>Home</kbd> | Smooth Return to Surface ($0\text{ m}$) |
| <kbd>Esc</kbd> | Close Atlas / Menus |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### Local Development
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/bottomless.git
cd bottomless

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📦 Deploying to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Bottomless mindfulness application"
   git branch -M main
   git remote add origin https://github.com/<your-username>/bottomless.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** $\to$ **Pages**.
   - Under **Build and deployment** $\to$ **Source**, choose **GitHub Actions**.
3. Every push to `main` will automatically build and deploy your app to:
   ```
   https://<your-username>.github.io/bottomless/
   ```

---

## 📱 Publishing to Google Play Store

Because *Bottomless* is built with Progressive Web App standards, zero permissions, and zero ads, it passes Google Play safety reviews effortlessly.

### Quick Packaging with PWABuilder (~3 minutes)
1. Deploy your repository to GitHub Pages (or Vercel / Netlify).
2. Visit **[PWABuilder.com](https://www.pwabuilder.com/)** and enter your deployed URL.
3. Click **Package for Store** $\to$ **Android**.
4. Download the signed `.aab` (Android App Bundle) and upload it directly to the **Google Play Console**.

---

## 📄 License
MIT License — Free to use, adapt, and share.
