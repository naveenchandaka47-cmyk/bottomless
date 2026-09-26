export class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Muted by default as requested
  private volume: number = 0.5;
  private masterGain: GainNode | null = null;

  // Oscillators and nodes
  private oscFundamental: OscillatorNode | null = null;
  private oscSub: OscillatorNode | null = null;
  private oscFifth: OscillatorNode | null = null;
  private oscHigh: OscillatorNode | null = null;

  private gainFundamental: GainNode | null = null;
  private gainSub: GainNode | null = null;
  private gainFifth: GainNode | null = null;
  private gainHigh: GainNode | null = null;

  private filter: BiquadFilterNode | null = null;

  // Pink noise / abyssal wind
  private windNode: AudioBufferSourceNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;

  private baseFreq: number = 108.0;
  private isInitialized: boolean = false;
  private preset: 'harmonic108' | 'singingBowl' | 'deepAbyss' = 'harmonic108';

  constructor() {
    // Sound engine will be initialized on first user gesture
  }

  public async initAudio(): Promise<boolean> {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return false;

      this.ctx = new AudioContextClass();
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0001 : this.volume * 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Main resonant lowpass filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(360, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // 1. Fundamental oscillator (108Hz warm sine)
      this.oscFundamental = this.ctx.createOscillator();
      this.oscFundamental.type = 'sine';
      this.oscFundamental.frequency.setValueAtTime(this.baseFreq, this.ctx.currentTime);
      this.gainFundamental = this.ctx.createGain();
      this.gainFundamental.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.oscFundamental.connect(this.gainFundamental);
      this.gainFundamental.connect(this.filter);

      // 2. Sub-octave oscillator (54Hz grounding sine)
      this.oscSub = this.ctx.createOscillator();
      this.oscSub.type = 'sine';
      this.oscSub.frequency.setValueAtTime(this.baseFreq * 0.5, this.ctx.currentTime);
      this.gainSub = this.ctx.createGain();
      this.gainSub.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.oscSub.connect(this.gainSub);
      this.gainSub.connect(this.filter);

      // 3. Perfect Fifth harmonic (162Hz with subtle detune for 0.75Hz binaural chorus)
      this.oscFifth = this.ctx.createOscillator();
      this.oscFifth.type = 'sine';
      this.oscFifth.frequency.setValueAtTime(this.baseFreq * 1.5 + 0.75, this.ctx.currentTime);
      this.gainFifth = this.ctx.createGain();
      this.gainFifth.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.oscFifth.connect(this.gainFifth);
      this.gainFifth.connect(this.filter);

      // 4. Warm overtone (216Hz triangle for harmonic richness)
      this.oscHigh = this.ctx.createOscillator();
      this.oscHigh.type = 'triangle';
      this.oscHigh.frequency.setValueAtTime(this.baseFreq * 2.0, this.ctx.currentTime);
      this.gainHigh = this.ctx.createGain();
      this.gainHigh.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.oscHigh.connect(this.gainHigh);
      this.gainHigh.connect(this.filter);

      // Start drone oscillators
      this.oscFundamental.start();
      this.oscSub.start();
      this.oscFifth.start();
      this.oscHigh.start();

      // Create pink noise / oceanic wind generator
      this.setupAbyssalWind();

      this.isInitialized = true;
      this.applyPreset(this.preset);
      return true;
    } catch (e) {
      console.warn('AudioContext initialization note:', e);
      return false;
    }
  }

  private setupAbyssalWind() {
    if (!this.ctx || !this.masterGain) return;

    // Generate 4 seconds of looped pink noise buffer
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    this.windNode = this.ctx.createBufferSource();
    this.windNode.buffer = buffer;
    this.windNode.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'lowpass';
    this.windFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    this.windNode.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    this.windNode.start();
  }

  public update(depth: number, velocity: number) {
    if (!this.ctx || !this.isInitialized || this.ctx.state !== 'running') return;

    // Pitch subtly deepens as depth increases (micro-glides downward as you descend into the abyss)
    // At 0m: 108Hz; at 3,800m (Titanic): ~98Hz; at 11,000m (Challenger Deep): ~86Hz; asymptotic to ~64Hz.
    const depthFactor = 1 / (1 + depth * 0.000035);
    const targetFreq = this.baseFreq * depthFactor;

    if (this.oscFundamental) {
      this.oscFundamental.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.4);
    }
    if (this.oscSub) {
      this.oscSub.frequency.setTargetAtTime(targetFreq * 0.5, this.ctx.currentTime, 0.4);
    }
    if (this.oscFifth) {
      this.oscFifth.frequency.setTargetAtTime(targetFreq * 1.5 + 0.75, this.ctx.currentTime, 0.4);
    }
    if (this.oscHigh) {
      this.oscHigh.frequency.setTargetAtTime(targetFreq * 2.0, this.ctx.currentTime, 0.4);
    }

    // Filter opens subtly with descent speed (auditory sensation of falling through ether)
    const absVel = Math.abs(velocity);
    const filterFreq = Math.min(800, 240 + absVel * 12 + depthFactor * 80);
    if (this.filter) {
      this.filter.frequency.setTargetAtTime(filterFreq, this.ctx.currentTime, 0.3);
    }

    // Modulate wind/ocean rush with velocity
    if (this.windGain && this.windFilter) {
      const windTargetGain = Math.min(0.25, 0.03 + (absVel / 35) * 0.18);
      const windTargetFreq = Math.min(650, 120 + absVel * 16);
      this.windGain.gain.setTargetAtTime(this.isMuted ? 0 : windTargetGain, this.ctx.currentTime, 0.25);
      this.windFilter.frequency.setTargetAtTime(windTargetFreq, this.ctx.currentTime, 0.25);
    }
  }

  public async toggleMute(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initAudio();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    this.updateMasterVolume();
    return !this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.updateMasterVolume();
  }

  private updateMasterVolume() {
    if (!this.ctx || !this.masterGain) return;
    const targetGain = this.isMuted ? 0.0001 : this.volume * 0.45;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.2);
  }

  public setPreset(preset: 'harmonic108' | 'singingBowl' | 'deepAbyss') {
    this.preset = preset;
    this.applyPreset(preset);
  }

  private applyPreset(preset: 'harmonic108' | 'singingBowl' | 'deepAbyss') {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (preset === 'harmonic108') {
      this.baseFreq = 108.0;
      if (this.gainFundamental) this.gainFundamental.gain.setTargetAtTime(0.5, now, 0.3);
      if (this.gainSub) this.gainSub.gain.setTargetAtTime(0.35, now, 0.3);
      if (this.gainFifth) this.gainFifth.gain.setTargetAtTime(0.22, now, 0.3);
      if (this.gainHigh) this.gainHigh.gain.setTargetAtTime(0.1, now, 0.3);
    } else if (preset === 'singingBowl') {
      this.baseFreq = 144.0; // F3 frequency
      if (this.gainFundamental) this.gainFundamental.gain.setTargetAtTime(0.35, now, 0.3);
      if (this.gainSub) this.gainSub.gain.setTargetAtTime(0.15, now, 0.3);
      if (this.gainFifth) this.gainFifth.gain.setTargetAtTime(0.35, now, 0.3);
      if (this.gainHigh) this.gainHigh.gain.setTargetAtTime(0.25, now, 0.3);
    } else if (preset === 'deepAbyss') {
      this.baseFreq = 72.0; // D2 deep subterranean resonance
      if (this.gainFundamental) this.gainFundamental.gain.setTargetAtTime(0.35, now, 0.3);
      if (this.gainSub) this.gainSub.gain.setTargetAtTime(0.6, now, 0.3);
      if (this.gainFifth) this.gainFifth.gain.setTargetAtTime(0.15, now, 0.3);
      if (this.gainHigh) this.gainHigh.gain.setTargetAtTime(0.05, now, 0.3);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getPreset(): string {
    return this.preset;
  }
}
