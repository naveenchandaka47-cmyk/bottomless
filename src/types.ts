export type ThemeMode = 'mist' | 'tide' | 'void';

export interface ThemeColors {
  name: string;
  id: ThemeMode;
  bgBase: string;
  bgDeep: string;
  bgAbyss: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
  moteBase: [number, number, number]; // RGB
  lineColor: string;
  cardBg: string;
  cardBorder: string;
}

export interface Landmark {
  id: string;
  depthMeters: number;
  name: string;
  subtitle: string;
  description: string;
  heightOrLength: string;
  invertedNote?: string;
  category: 'monument' | 'natural' | 'oceanic' | 'subterranean' | 'cosmic';
  iconType: 'statue' | 'tower' | 'skyscraper' | 'diver' | 'whale' | 'ship' | 'mountain' | 'trench' | 'crust' | 'mantle' | 'core' | 'infinite';
  discovered?: boolean;
}

export interface Whisper {
  id: string;
  text: string;
  category: 'somatic' | 'breath' | 'release' | 'presence';
  depthRange: [number, number]; // where it can appear or fixed trigger
}

export interface PhysicsState {
  depth: number;           // Current depth in meters
  velocity: number;        // Current descent velocity (m/s)
  targetVelocity: number;
  isDragging: boolean;
  autoDescend: boolean;    // Hands-free Zen float mode
  autoDescendSpeed: number;
  terminalVelocity: number;
  damping: number;
  unit: 'meters' | 'feet';
}

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  preset: 'harmonic108' | 'singingBowl' | 'deepAbyss';
}
