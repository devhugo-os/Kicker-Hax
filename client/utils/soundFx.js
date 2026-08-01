// Kicker Hax - Sound Effects Synthesizer using Web Audio API
import {
  CROWD_SOUND_DESIGN,
  getGameSoundVoices,
  MATCH_THEME_DESIGN
} from '../audio/gameSoundDesign.js';

let AC = null;
let outGain = null;
let recGain = null;
let recDest = null;
let crowdGain = null;
let crowdNode = null;
let menuTheme = null;
let matchTheme = null;
let rouletteTimers = [];
let isMuted = false;
let globalVolume = 0.8; // 0.0 to 1.0
let musicVolume = 0.55; // 0.0 to 1.0
let outputVolumeScale = 1;

function audioCtx() {
  if (!AC) {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }
  return AC;
}

export const soundFx = {
  setVolume(volPercent) {
    globalVolume = volPercent / 100;
    this.updateBuses();
  },

  setMusicVolume(volPercent) {
    musicVolume = Math.max(0, Math.min(100, Number(volPercent) || 0)) / 100;
    if (menuTheme?.master) {
      const ac = audioCtx();
      try {
        menuTheme.master.gain.cancelScheduledValues(ac.currentTime);
        menuTheme.master.gain.setTargetAtTime(0.09 * musicVolume, ac.currentTime, 0.05);
      } catch (e) {}
    }
    if (matchTheme?.master) {
      const ac = audioCtx();
      try {
        matchTheme.master.gain.cancelScheduledValues(ac.currentTime);
        matchTheme.master.gain.setTargetAtTime(
          MATCH_THEME_DESIGN.masterGain * musicVolume,
          ac.currentTime,
          0.05
        );
      } catch (e) {}
    }
  },

  setOutputVolumeScale(scale = 1) {
    outputVolumeScale = Math.max(0, Math.min(1, Number(scale) || 0));
    this.updateBuses();
  },

  ensureBuses() {
    const ac = audioCtx();
    if (!ac) return null;

    if (!outGain) {
      outGain = ac.createGain();
      outGain.gain.value = isMuted ? 0.0 : globalVolume * 0.9 * outputVolumeScale;
      outGain.connect(ac.destination);
    }
    
    if (!recGain) {
      recGain = ac.createGain();
      recGain.gain.value = 0.9;
      try {
        recDest = ac.createMediaStreamDestination();
        recGain.connect(recDest);
      } catch (e) {
        console.warn("MediaStream destination not supported for audio recording", e);
      }
    }

    return { ac, outGain, recGain };
  },

  updateBuses() {
    const buses = this.ensureBuses();
    if (!buses) return;
    const { ac, outGain } = buses;
    const target = isMuted ? 0.0 : globalVolume * 0.9 * outputVolumeScale;
    try {
      outGain.gain.cancelScheduledValues(ac.currentTime);
      outGain.gain.setTargetAtTime(target, ac.currentTime, 0.05);
    } catch (e) {}
  },

  envNoise(vol = 0.08) {
    try {
      const buses = this.ensureBuses();
      if (!buses) return null;
      const { ac, outGain, recGain } = buses;

      const buffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.35;
      }

      const src = ac.createBufferSource();
      src.buffer = buffer;
      src.loop = true;

      const hp = ac.createBiquadFilter();
      hp.type = 'lowpass';
      hp.frequency.value = CROWD_SOUND_DESIGN.lowpassHz;

      const g = ac.createGain();
      g.gain.value = vol;

      src.connect(hp);
      hp.connect(g);
      g.connect(outGain);
      if (recDest) g.connect(recGain);

      return { src, g };
    } catch (e) {
      return null;
    }
  },

  startCrowd() {
    try {
      if (crowdNode) return;
      const n = this.envNoise(CROWD_SOUND_DESIGN.baseGain);
      if (!n) return;
      crowdGain = n.g;
      n.src.start();
      crowdNode = n.src;
    } catch (e) {}
  },

  stopCrowd() {
    if (crowdNode) {
      try {
        crowdNode.stop();
      } catch (e) {}
      crowdNode = null;
      crowdGain = null;
    }
  },

  startMenuTheme() {
    try {
      const buses = this.ensureBuses();
      if (!buses || menuTheme) return;
      const { ac, outGain } = buses;
      const master = ac.createGain();
      master.gain.value = 0.09 * musicVolume;
      master.connect(outGain);
      const notes = [196, 247, 294, 330, 294, 247];
      const timers = [];
      let step = 0;
      const playNote = () => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = 'triangle';
        o.frequency.value = notes[step % notes.length];
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(master);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.7, ac.currentTime + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.42);
        o.stop(ac.currentTime + 0.45);
        step++;
      };
      playNote();
      timers.push(setInterval(playNote, 520));
      menuTheme = { master, timers };
    } catch (e) {}
  },

  stopMenuTheme() {
    if (!menuTheme) return;
    menuTheme.timers.forEach(timer => clearInterval(timer));
    try { menuTheme.master.disconnect(); } catch (e) {}
    menuTheme = null;
  },

  startMatchTheme() {
    try {
      const buses = this.ensureBuses();
      if (!buses || matchTheme) return;
      const { ac, outGain } = buses;
      const master = ac.createGain();
      master.gain.value = MATCH_THEME_DESIGN.masterGain * musicVolume;
      master.connect(outGain);
      const bass = MATCH_THEME_DESIGN.bass;
      const lead = MATCH_THEME_DESIGN.lead;
      let step = 0;
      const playBeat = () => {
        const now = ac.currentTime;
        [
          [bass[step % bass.length], 'square', MATCH_THEME_DESIGN.bassGain],
          [lead[step % lead.length], 'triangle', MATCH_THEME_DESIGN.leadGain]
        ].forEach(([freq, type, gain]) => {
          const oscillator = ac.createOscillator();
          const envelope = ac.createGain();
          oscillator.type = type;
          oscillator.frequency.value = freq;
          envelope.gain.setValueAtTime(gain, now);
          envelope.gain.exponentialRampToValueAtTime(0.0001, now + MATCH_THEME_DESIGN.noteDuration - 0.02);
          oscillator.connect(envelope);
          envelope.connect(master);
          oscillator.start(now);
          oscillator.stop(now + MATCH_THEME_DESIGN.noteDuration);
        });
        step++;
      };
      playBeat();
      matchTheme = { master, timers: [setInterval(playBeat, MATCH_THEME_DESIGN.stepSeconds * 1000)] };
    } catch (e) {}
  },

  stopMatchTheme() {
    if (!matchTheme) return;
    matchTheme.timers.forEach(timer => clearInterval(timer));
    try { matchTheme.master.disconnect(); } catch (e) {}
    matchTheme = null;
  },

  setOutputMuted(m) {
    isMuted = m;
    this.updateBuses();
  },

  suspendForBackground() {
    this.stopRoulette();
    this.stopCrowd();
    this.stopMenuTheme();
    this.stopMatchTheme();
    const ac = audioCtx();
    if (ac?.state === 'running') ac.suspend().catch(() => {});
  },

  resumeAfterForeground(shouldPlayMenuTheme = false, shouldPlayCrowd = false, shouldPlayMatchTheme = false) {
    const ac = audioCtx();
    if (ac?.state === 'suspended') ac.resume().catch(() => {});
    if (shouldPlayMenuTheme) this.startMenuTheme();
    if (shouldPlayCrowd && !crowdNode) this.startCrowd();
    if (shouldPlayMatchTheme) this.startMatchTheme();
  },

  createTone(freq, dur = 0.12, type = 'sine', vol = 0.2, recordOnly = false) {
    try {
      const buses = this.ensureBuses();
      if (!buses) return;
      const { ac, outGain, recGain } = buses;

      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = vol;

      o.connect(g);
      if (!recordOnly) g.connect(outGain);
      if (recDest) g.connect(recGain);

      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      o.stop(ac.currentTime + dur);
    } catch (e) {}
  },

  percuss(vol = 0.18, dur = 0.05, recordOnly = false) {
    try {
      const buses = this.ensureBuses();
      if (!buses) return;
      const { ac, outGain, recGain } = buses;

      const buffer = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] += (Math.random() * 2 - 1) * (1 - i / data.length);
      }

      const src = ac.createBufferSource();
      const g = ac.createGain();
      g.gain.value = vol;
      
      src.buffer = buffer;
      src.connect(g);
      if (!recordOnly) g.connect(outGain);
      if (recDest) g.connect(recGain);
      
      src.start();
    } catch (e) {}
  },

  createSweep(startFrequency, endFrequency, dur, type = 'sine', vol = 0.2, recordOnly = false) {
    try {
      const buses = this.ensureBuses();
      if (!buses) return;
      const { ac, outGain, recGain } = buses;
      const now = ac.currentTime;
      const oscillator = ac.createOscillator();
      const gain = ac.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(startFrequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + dur);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      oscillator.connect(gain);
      if (!recordOnly) gain.connect(outGain);
      if (recDest) gain.connect(recGain);
      oscillator.start(now);
      oscillator.stop(now + dur + 0.02);
    } catch (e) {}
  },

  playCheer() {
    try {
      if (!crowdGain) this.startCrowd();
      if (!crowdGain) return;
      const ac = audioCtx();
      const g = crowdGain.gain;
      const now = ac.currentTime;
      g.cancelScheduledValues(now);
      g.setTargetAtTime(CROWD_SOUND_DESIGN.cheerGain, now, 0.03);
      g.setTargetAtTime(CROWD_SOUND_DESIGN.baseGain, now + CROWD_SOUND_DESIGN.cheerHoldSeconds, 0.30);
    } catch (e) {}
  },

  play(kind) {
    const ac = audioCtx();
    if (!ac) return;
    if (ac.state === 'suspended') {
      ac.resume().then(() => this.play(kind)).catch(() => {});
      return;
    }
    if (matchTheme?.master) matchTheme.master.gain.value = MATCH_THEME_DESIGN.masterGain * musicVolume;
    if (kind === 'cheer') {
      this.playCheer();
      return;
    }
    this.playVoices(kind, false);
  },

  playVoices(kind, recordOnly = false) {
    getGameSoundVoices(kind).forEach(voice => {
      const run = () => {
        if (voice.type === 'noise') {
          this.percuss(voice.gain, voice.duration, recordOnly);
        } else if (voice.type === 'sweep') {
          this.createSweep(
            voice.frequency,
            voice.endFrequency,
            voice.duration,
            voice.wave,
            voice.gain,
            recordOnly
          );
        } else {
          this.createTone(voice.frequency, voice.duration, voice.wave, voice.gain, recordOnly);
        }
      };
      if (voice.delay) setTimeout(run, voice.delay * 1000);
      else run();
    });
  },

  /** Emits the compact match effects only into MediaRecorder's audio bus. */
  playForRecording(kind) {
    this.playVoices(kind, true);
  },

  startRoulette(durationMs = 5000) {
    this.stopRoulette();
    let elapsed = 0;
    let delay = 42;
    while (elapsed < durationMs - 120) {
      const timer = setTimeout(() => this.play('roulette'), elapsed);
      rouletteTimers.push(timer);
      elapsed += delay;
      delay = Math.min(245, delay * 1.072);
    }
    return () => this.stopRoulette();
  },

  stopRoulette() {
    rouletteTimers.forEach(timer => clearTimeout(timer));
    rouletteTimers = [];
  },

  ensureAudio() {
    const ac = audioCtx();
    if (ac && ac.state === 'suspended') {
      ac.resume();
    }
    if (!crowdNode) this.startCrowd();
  },

  playButton() {
    this.play('button');
  },

  getRecordingStreamDestination() {
    this.ensureBuses();
    return recDest;
  }
};
export default soundFx;
