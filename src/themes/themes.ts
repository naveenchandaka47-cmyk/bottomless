import type { ThemeColors, ThemeMode } from '../types';

export const THEMES: Record<ThemeMode, ThemeColors> = {
  mist: {
    name: 'Mist',
    id: 'mist',
    bgBase: '#FAF8F5',       // Warm off-white/eggshell default
    bgDeep: '#F2EFE9',       // Deepening daylight warm wash
    bgAbyss: '#E5DFD5',      // Abyssal warm bone
    textPrimary: '#2B2724',  // Deep charcoal warm brown
    textSecondary: '#6B655F',// Muted earth
    textMuted: '#9E978F',    // Subtle whisper gray
    accent: '#8C7A65',       // Warm brass / clay
    accentGlow: 'rgba(140, 122, 101, 0.25)',
    moteBase: [175, 155, 130],// Warm golden/sepia ambient light
    lineColor: 'rgba(43, 39, 36, 0.08)',
    cardBg: 'rgba(250, 248, 245, 0.75)',
    cardBorder: 'rgba(43, 39, 36, 0.07)'
  },
  tide: {
    name: 'Tide',
    id: 'tide',
    bgBase: '#EBF3F0',       // Soft coastal seafoam
    bgDeep: '#DFEAE6',       // Oceanic sage transition
    bgAbyss: '#CAD8D3',      // Deep seafoam depth
    textPrimary: '#1A2E2B',  // Deep oceanic slate
    textSecondary: '#4A6863',// Cool marine green
    textMuted: '#7A9993',    // Foggy teal
    accent: '#3D7A70',       // Seaweed jade
    accentGlow: 'rgba(61, 122, 112, 0.25)',
    moteBase: [120, 190, 180],// Bioluminescent seafoam motes
    lineColor: 'rgba(26, 46, 43, 0.08)',
    cardBg: 'rgba(235, 243, 240, 0.75)',
    cardBorder: 'rgba(26, 46, 43, 0.07)'
  },
  void: {
    name: 'Void',
    id: 'void',
    bgBase: '#08090C',       // Matte OLED black / deepest starlight
    bgDeep: '#050508',       // Pure dark
    bgAbyss: '#000002',      // Absolute singularity
    textPrimary: '#EBEFF5',  // Ethereal starlight white
    textSecondary: '#9AA4B5',// Celestial silver
    textMuted: '#586173',    // Cosmic dusk
    accent: '#7D94B8',       // Cold pulsar blue
    accentGlow: 'rgba(125, 148, 184, 0.3)',
    moteBase: [190, 215, 255],// Cold diamond starlight motes
    lineColor: 'rgba(235, 239, 245, 0.08)',
    cardBg: 'rgba(12, 14, 18, 0.75)',
    cardBorder: 'rgba(235, 239, 245, 0.09)'
  }
};

export function getDepthInterpolatedBg(theme: ThemeColors, _depth: number): string {
  return theme.bgBase;
}
