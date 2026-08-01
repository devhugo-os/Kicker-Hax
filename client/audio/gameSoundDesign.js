/**
 * Single source of truth for match audio. Runtime WebAudio and offline MP4
 * export consume these same voices so a recorded action sounds like the game.
 */
export const GAME_SOUND_EFFECTS = Object.freeze({
  button: [
    { type: 'tone', frequency: 660, duration: 0.035, wave: 'triangle', gain: 0.08 },
    { type: 'tone', frequency: 880, duration: 0.04, wave: 'sine', gain: 0.06, delay: 0.035 }
  ],
  kick: [
    { type: 'tone', frequency: 520, duration: 0.05, wave: 'square', gain: 0.18 },
    { type: 'tone', frequency: 260, duration: 0.06, wave: 'square', gain: 0.09 }
  ],
  pickup: [
    { type: 'tone', frequency: 330, duration: 0.045, wave: 'triangle', gain: 0.08 },
    { type: 'tone', frequency: 440, duration: 0.05, wave: 'triangle', gain: 0.07, delay: 0.035 }
  ],
  requestPass: [
    { type: 'tone', frequency: 740, duration: 0.05, wave: 'triangle', gain: 0.07 },
    { type: 'tone', frequency: 980, duration: 0.06, wave: 'sine', gain: 0.06, delay: 0.045 }
  ],
  roulette: [
    { type: 'tone', frequency: 920, duration: 0.025, wave: 'square', gain: 0.045 },
    { type: 'noise', duration: 0.012, gain: 0.035 }
  ],
  reward: [
    { type: 'tone', frequency: 523.25, duration: 0.12, wave: 'triangle', gain: 0.12 },
    { type: 'tone', frequency: 659.25, duration: 0.13, wave: 'triangle', gain: 0.13, delay: 0.105 },
    { type: 'tone', frequency: 783.99, duration: 0.18, wave: 'triangle', gain: 0.15, delay: 0.22 },
    { type: 'tone', frequency: 1046.5, duration: 0.24, wave: 'sine', gain: 0.12, delay: 0.34 }
  ],
  tackle: [
    { type: 'noise', duration: 0.03, gain: 0.22 },
    { type: 'tone', frequency: 140, duration: 0.06, wave: 'sawtooth', gain: 0.22 }
  ],
  dribble: [
    { type: 'tone', frequency: 800, duration: 0.05, wave: 'triangle', gain: 0.12 },
    { type: 'tone', frequency: 600, duration: 0.05, wave: 'triangle', gain: 0.08 }
  ],
  power: [
    { type: 'tone', frequency: 360, duration: 0.08, wave: 'sawtooth', gain: 0.18 },
    { type: 'tone', frequency: 720, duration: 0.06, wave: 'square', gain: 0.16, delay: 0.08 },
    { type: 'noise', duration: 0.04, gain: 0.25, delay: 0.12 },
    { type: 'sweep', frequency: 82, endFrequency: 34, duration: 0.42, wave: 'sine', gain: 0.30 },
    { type: 'noise', duration: 0.18, gain: 0.16 }
  ],
  post: [
    { type: 'tone', frequency: 900, duration: 0.04, wave: 'square', gain: 0.12 },
    { type: 'tone', frequency: 300, duration: 0.06, wave: 'sine', gain: 0.10 }
  ],
  whistle: [
    { type: 'tone', frequency: 1800, duration: 0.18, wave: 'sine', gain: 0.12 },
    { type: 'tone', frequency: 1500, duration: 0.18, wave: 'sine', gain: 0.12 }
  ],
  goal: [
    { type: 'tone', frequency: 480, duration: 0.18, wave: 'triangle', gain: 0.14 },
    { type: 'tone', frequency: 960, duration: 0.12, wave: 'sine', gain: 0.12, delay: 0.12 }
  ]
});

export const MATCH_THEME_DESIGN = Object.freeze({
  stepSeconds: 0.28,
  noteDuration: 0.24,
  masterGain: 0.055,
  bassGain: 0.18,
  leadGain: 0.08,
  bass: Object.freeze([98, 98, 123, 147, 123, 110, 98, 147]),
  lead: Object.freeze([392, 494, 587, 494, 659, 587, 494, 440])
});

export const CROWD_SOUND_DESIGN = Object.freeze({
  baseGain: 0.065,
  cheerGain: 0.25,
  cheerHoldSeconds: 0.6,
  lowpassHz: 800
});

export function getGameSoundVoices(kind) {
  return GAME_SOUND_EFFECTS[String(kind || '')] || [];
}
