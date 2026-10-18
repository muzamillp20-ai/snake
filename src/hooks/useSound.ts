import { useCallback, useRef } from 'react';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  private getCtx(): AudioContext | null {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  playEat() {
    this.playTone(523, 0.1, 'sine', 0.12);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.12), 50);
  }

  playPowerUp() {
    this.playTone(440, 0.1, 'square', 0.08);
    setTimeout(() => this.playTone(554, 0.1, 'square', 0.08), 60);
    setTimeout(() => this.playTone(659, 0.15, 'square', 0.08), 120);
  }

  playGameOver() {
    this.playTone(330, 0.2, 'sawtooth', 0.1);
    setTimeout(() => this.playTone(262, 0.3, 'sawtooth', 0.1), 200);
    setTimeout(() => this.playTone(196, 0.5, 'sawtooth', 0.1), 400);
  }

  playLevelComplete() {
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.15, 'sine', 0.1), i * 80);
    });
  }

  playVictory() {
    const melody = [523, 659, 784, 1047, 784, 1047, 1319];
    melody.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'sine', 0.12), i * 150);
    });
  }

  playMove() {
    this.playTone(100, 0.03, 'sine', 0.02);
  }
}

const soundEngine = new SoundEngine();

export function useSound() {
  const engineRef = useRef(soundEngine);

  const setEnabled = useCallback((enabled: boolean) => {
    engineRef.current.setEnabled(enabled);
  }, []);

  return {
    sound: engineRef.current,
    setEnabled,
  };
}
