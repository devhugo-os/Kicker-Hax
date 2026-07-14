// Kicker Hax - Sound Effects Synthesizer using Web Audio API

let AC = null;
let outGain = null;
let recGain = null;
let recDest = null;
let crowdGain = null;
let crowdNode = null;
let menuTheme = null;
let matchTheme = null;
let isMuted = false;
let globalVolume = 0.8; // 0.0 to 1.0
let musicVolume = 0.55; // 0.0 to 1.0

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
      master.gain.value = 0.055 * musicVolume;
      master.connect(outGain);
      const bass = [98, 98, 123, 147, 123, 110, 98, 147];
      const lead = [392, 494, 587, 494, 659, 587, 494, 440];
      let step = 0;
      const playBeat = () => {
        const now = ac.currentTime;
        [[bass[step % bass.length], 'square', 0.18], [lead[step % lead.length], 'triangle', 0.08]].forEach(([freq, type, gain]) => {
          const oscillator = ac.createOscillator();
          const envelope = ac.createGain();
          oscillator.type = type;
          oscillator.frequency.value = freq;
          envelope.gain.setValueAtTime(gain, now);
          envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
          oscillator.connect(envelope);
          envelope.connect(master);
          oscillator.start(now);
          oscillator.stop(now + 0.24);
        });
        step++;
      };
      playBeat();
      matchTheme = { master, timers: [setInterval(playBeat, 280)] };
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
    const ac = audioCtx();
    if (!ac) return;
    if (ac.state === 'suspended') {
      ac.resume().then(() => this.play(kind)).catch(() => {});
      return;
    }
    if (matchTheme?.master) matchTheme.master.gain.value = 0.055 * musicVolume;
    switch (kind) {
      case 'button':
        this.createTone(660, 0.035, 'triangle', 0.08);
        setTimeout(() => this.createTone(880, 0.04, 'sine', 0.06), 35);
        break;
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

  playButton() {
    this.play('button');
  },

  getRecordingStreamDestination() {
    this.ensureBuses();
    return recDest;
  }
};
export default soundFx;
