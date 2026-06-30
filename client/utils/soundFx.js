// Kicker Hax - Sound Effects Synthesizer using Web Audio API

let AC = null;
let outGain = null;
let recGain = null;
let recDest = null;
let crowdGain = null;
let crowdNode = null;
let isMuted = false;
let globalVolume = 0.8; // 0.0 to 1.0

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

  ensureBuses() {
    const ac = audioCtx();
    if (!ac) return null;

    if (!outGain) {
      outGain = ac.createGain();
      outGain.gain.value = isMuted ? 0.0 : globalVolume * 0.9;
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
    const target = isMuted ? 0.0 : globalVolume * 0.9;
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
      hp.frequency.value = 800;

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
      const n = this.envNoise(0.06);
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

  setOutputMuted(m) {
    isMuted = m;
    this.updateBuses();
  },

  createTone(freq, dur = 0.12, type = 'sine', vol = 0.2) {
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
      g.connect(outGain);
      if (recDest) g.connect(recGain);

      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      o.stop(ac.currentTime + dur);
    } catch (e) {}
  },

  percuss(vol = 0.18, dur = 0.05) {
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
      g.connect(outGain);
      if (recDest) g.connect(recGain);
      
      src.start();
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
      g.setTargetAtTime(0.25, now, 0.03);
      g.setTargetAtTime(0.08, now + 0.6, 0.30);
    } catch (e) {}
  },

  play(kind) {
    switch (kind) {
      case 'kick':
        this.createTone(520, 0.05, 'square', 0.18);
        this.createTone(260, 0.06, 'square', 0.09);
        break;
      case 'tackle':
        this.percuss(0.22, 0.03);
        this.createTone(140, 0.06, 'sawtooth', 0.22);
        break;
      case 'dribble':
        this.createTone(800, 0.05, 'triangle', 0.12);
        this.createTone(600, 0.05, 'triangle', 0.08);
        break;
      case 'power':
        this.createTone(360, 0.08, 'sawtooth', 0.18);
        setTimeout(() => this.createTone(720, 0.06, 'square', 0.16), 80);
        setTimeout(() => this.percuss(0.25, 0.04), 120);
        break;
      case 'post':
        this.createTone(900, 0.04, 'square', 0.12);
        this.createTone(300, 0.06, 'sine', 0.10);
        break;
      case 'whistle':
        this.createTone(1800, 0.18, 'sine', 0.12);
        this.createTone(1500, 0.18, 'sine', 0.12);
        break;
      case 'goal':
        this.createTone(480, 0.18, 'triangle', 0.14);
        setTimeout(() => this.createTone(960, 0.12, 'sine', 0.12), 120);
        break;
      case 'cheer':
        this.playCheer();
        break;
    }
  },

  ensureAudio() {
    const ac = audioCtx();
    if (ac && ac.state === 'suspended') {
      ac.resume();
    }
    if (!crowdNode) this.startCrowd();
  },

  getRecordingStreamDestination() {
    this.ensureBuses();
    return recDest;
  }
};
export default soundFx;
