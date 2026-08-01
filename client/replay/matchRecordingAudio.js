import {
  CROWD_SOUND_DESIGN,
  getGameSoundVoices,
  MATCH_THEME_DESIGN
} from '../audio/gameSoundDesign.js';

const AUDIO_SAMPLE_RATE = 48_000;
const AUDIO_CHANNELS = 2;
const AUDIO_CHUNK_FRAMES = 1024;
const EXPORT_MASTER_GAIN = 0.72;
const EXPORT_MUSIC_VOLUME = 0.55;

function waveAt(type, phase, noiseSeed) {
  if (type === 'square') return Math.sin(phase) >= 0 ? 1 : -1;
  if (type === 'sawtooth') return 2 * ((phase / (Math.PI * 2)) % 1) - 1;
  if (type === 'triangle') return 2 * Math.asin(Math.sin(phase)) / Math.PI;
  if (type === 'noise') {
    const value = Math.sin(noiseSeed * 12.9898 + 78.233) * 43758.5453;
    return (value - Math.floor(value)) * 2 - 1;
  }
  return Math.sin(phase);
}

/** Builds action events from the same voices consumed by runtime WebAudio. */
export function buildRecordingSoundEvents(recording) {
  const events = [];
  const cheers = [];
  (recording?.markers || []).forEach(marker => {
    if (marker.type !== 'sound') return;
    const sound = String(marker.sound || '');
    if (sound === 'cheer') {
      cheers.push(Math.max(0, Number(marker.t || 0) / 1000));
      return;
    }
    getGameSoundVoices(sound).forEach(voice => {
      const delay = Number(voice.delay || 0);
      const start = Math.max(0, Number(marker.t || 0) / 1000 + delay);
      events.push({ start, end: start + Number(voice.duration || 0), voice });
    });
  });
  return { events, cheers };
}

function voiceEnvelope(voice, local) {
  const duration = Math.max(0.001, Number(voice.duration || 0));
  if (voice.type === 'noise') return Math.max(0, 1 - local / duration);
  const gain = Math.max(0.0001, Number(voice.gain || 0.0001));
  if (voice.type === 'sweep') {
    const attack = Math.min(0.025, duration / 2);
    if (local < attack) {
      return (0.0001 / gain) * Math.pow(gain / 0.0001, local / Math.max(0.001, attack));
    }
    return Math.exp(
      Math.log(0.0001 / gain) * Math.min(1, (local - attack) / Math.max(0.001, duration - attack))
    );
  }
  return Math.exp(Math.log(0.0001 / gain) * Math.min(1, local / duration));
}

function voiceFrequency(voice, local) {
  const start = Math.max(1, Number(voice.frequency || 1));
  if (voice.type !== 'sweep') return start;
  const end = Math.max(1, Number(voice.endFrequency || start));
  const progress = Math.min(1, local / Math.max(0.001, Number(voice.duration || 0)));
  return start * Math.pow(end / start, progress);
}

function themeSample(time) {
  const step = Math.max(0, Math.floor(time / MATCH_THEME_DESIGN.stepSeconds));
  const local = time - step * MATCH_THEME_DESIGN.stepSeconds;
  if (local >= MATCH_THEME_DESIGN.noteDuration) return 0;
  const decayDuration = Math.max(0.001, MATCH_THEME_DESIGN.noteDuration - 0.02);
  const bassEnvelope = Math.exp(
    Math.log(0.0001 / MATCH_THEME_DESIGN.bassGain) * Math.min(1, local / decayDuration)
  );
  const leadEnvelope = Math.exp(
    Math.log(0.0001 / MATCH_THEME_DESIGN.leadGain) * Math.min(1, local / decayDuration)
  );
  const bass = waveAt(
    'square',
    local * Math.PI * 2 * MATCH_THEME_DESIGN.bass[step % MATCH_THEME_DESIGN.bass.length],
    step
  ) * MATCH_THEME_DESIGN.bassGain * bassEnvelope;
  const lead = waveAt(
    'triangle',
    local * Math.PI * 2 * MATCH_THEME_DESIGN.lead[step % MATCH_THEME_DESIGN.lead.length],
    step
  ) * MATCH_THEME_DESIGN.leadGain * leadEnvelope;
  return (bass + lead) * MATCH_THEME_DESIGN.masterGain * EXPORT_MUSIC_VOLUME;
}

function synthesizeChunk(startFrame, frameCount, timeline, ambience) {
  const data = new Float32Array(frameCount * AUDIO_CHANNELS);
  const chunkStart = startFrame / AUDIO_SAMPLE_RATE;
  const chunkEnd = (startFrame + frameCount) / AUDIO_SAMPLE_RATE;
  // Restrict action mixing to voices that overlap this 21 ms audio block.
  const activeEvents = timeline.events.filter(event => event.end > chunkStart && event.start < chunkEnd);

  for (let frame = 0; frame < frameCount; frame += 1) {
    const absoluteFrame = startFrame + frame;
    const time = absoluteFrame / AUDIO_SAMPLE_RATE;
    while (ambience.cheerIndex < timeline.cheers.length
      && timeline.cheers[ambience.cheerIndex] <= time) {
      ambience.lastCheerAt = timeline.cheers[ambience.cheerIndex];
      ambience.cheerIndex += 1;
    }

    const rawCrowd = waveAt('noise', 0, absoluteFrame) * 0.35;
    const lowpassAlpha = Math.min(1, Math.PI * 2 * CROWD_SOUND_DESIGN.lowpassHz / AUDIO_SAMPLE_RATE);
    ambience.crowdLowpass += lowpassAlpha * (rawCrowd - ambience.crowdLowpass);
    const cheerAge = time - ambience.lastCheerAt;
    const crowdGain = cheerAge >= 0 && cheerAge < CROWD_SOUND_DESIGN.cheerHoldSeconds
      ? CROWD_SOUND_DESIGN.cheerGain
      : CROWD_SOUND_DESIGN.baseGain;
    let sample = ambience.crowdLowpass * crowdGain + themeSample(time);

    for (const event of activeEvents) {
      if (time < event.start || time >= event.end) continue;
      const local = time - event.start;
      const voice = event.voice;
      const phase = local * Math.PI * 2 * voiceFrequency(voice, local);
      const amplitude = Number(voice.gain || 0) * voiceEnvelope(voice, local);
      sample += waveAt(voice.wave || voice.type, phase, absoluteFrame) * amplitude;
    }

    sample = Math.max(-0.92, Math.min(0.92, sample * EXPORT_MASTER_GAIN));
    data[frame] = sample;
    data[frameCount + frame] = sample;
  }
  return data;
}

export async function getRecordingAudioConfig() {
  if (typeof AudioEncoder === 'undefined' || typeof AudioData === 'undefined') return null;
  const config = {
    codec: 'mp4a.40.2',
    sampleRate: AUDIO_SAMPLE_RATE,
    numberOfChannels: AUDIO_CHANNELS,
    bitrate: 128_000
  };
  const support = await AudioEncoder.isConfigSupported(config).catch(() => null);
  return support?.supported ? support.config : null;
}

/** Encodes the live game sound design directly into the MP4 audio track. */
export async function encodeRecordingAudio({ recording, muxer, config, onProgress = () => {} }) {
  const totalFrames = Math.max(1, Math.ceil(Number(recording.durationMs || 0) / 1000 * AUDIO_SAMPLE_RATE));
  const timeline = buildRecordingSoundEvents(recording);
  const ambience = { crowdLowpass: 0, cheerIndex: 0, lastCheerAt: -Infinity };
  let encoderError = null;
  const encoder = new AudioEncoder({
    output: (chunk, metadata) => muxer.addAudioChunk(chunk, metadata),
    error: error => { encoderError = error; }
  });
  encoder.configure(config);

  try {
    for (let startFrame = 0; startFrame < totalFrames; startFrame += AUDIO_CHUNK_FRAMES) {
      if (encoderError) throw encoderError;
      const numberOfFrames = Math.min(AUDIO_CHUNK_FRAMES, totalFrames - startFrame);
      const audioData = new AudioData({
        format: 'f32-planar',
        sampleRate: AUDIO_SAMPLE_RATE,
        numberOfFrames,
        numberOfChannels: AUDIO_CHANNELS,
        timestamp: Math.round(startFrame / AUDIO_SAMPLE_RATE * 1_000_000),
        data: synthesizeChunk(startFrame, numberOfFrames, timeline, ambience)
      });
      encoder.encode(audioData);
      audioData.close();
      while (encoder.encodeQueueSize > 24) {
        await new Promise(resolve => setTimeout(resolve, 0));
        if (encoderError) throw encoderError;
      }
      if (startFrame % (AUDIO_CHUNK_FRAMES * 48) === 0) {
        onProgress(Math.min(1, (startFrame + numberOfFrames) / totalFrames));
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    await encoder.flush();
    if (encoderError) throw encoderError;
  } finally {
    if (encoder.state !== 'closed') encoder.close();
  }

  return Math.ceil(totalFrames / AUDIO_CHUNK_FRAMES);
}

export const RECORDING_AUDIO_FORMAT = Object.freeze({
  sampleRate: AUDIO_SAMPLE_RATE,
  numberOfChannels: AUDIO_CHANNELS,
  chunkFrames: AUDIO_CHUNK_FRAMES
});
