const AUDIO_SAMPLE_RATE = 48_000;
const AUDIO_CHANNELS = 2;
const AUDIO_CHUNK_FRAMES = 1024;

const SOUND_VOICES = Object.freeze({
  kick: [[520, 0.07, 0.17, 'square'], [260, 0.08, 0.08, 'square']],
  pickup: [[330, 0.05, 0.07, 'triangle'], [440, 0.07, 0.06, 'triangle', 0.035]],
  requestPass: [[740, 0.06, 0.07, 'triangle'], [980, 0.08, 0.06, 'sine', 0.045]],
  tackle: [[140, 0.10, 0.20, 'sawtooth']],
  dribble: [[800, 0.06, 0.10, 'triangle'], [600, 0.07, 0.07, 'triangle']],
  power: [[180, 0.28, 0.20, 'sawtooth'], [360, 0.12, 0.16, 'sawtooth'], [720, 0.10, 0.12, 'square', 0.08]],
  post: [[900, 0.06, 0.12, 'square'], [300, 0.10, 0.09, 'sine']],
  whistle: [[1800, 0.20, 0.10, 'sine'], [1500, 0.20, 0.10, 'sine']],
  goal: [[480, 0.22, 0.13, 'triangle'], [960, 0.18, 0.11, 'sine', 0.12]],
  cheer: [[210, 1.65, 0.08, 'noise'], [340, 1.20, 0.05, 'noise']]
});

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

function buildSoundEvents(recording) {
  const events = [];
  (recording?.markers || []).forEach(marker => {
    if (marker.type !== 'sound') return;
    const voices = SOUND_VOICES[String(marker.sound || '')];
    if (!voices) return;
    voices.forEach(([frequency, duration, gain, wave, delay = 0]) => {
      events.push({
        start: Math.max(0, Number(marker.t || 0) / 1000 + delay),
        end: Math.max(0, Number(marker.t || 0) / 1000 + delay + duration),
        frequency,
        gain,
        wave
      });
    });
  });
  return events;
}

function synthesizeChunk(startFrame, frameCount, events) {
  const data = new Float32Array(frameCount * AUDIO_CHANNELS);
  const chunkStart = startFrame / AUDIO_SAMPLE_RATE;
  const chunkEnd = (startFrame + frameCount) / AUDIO_SAMPLE_RATE;
  // A match can contain hundreds of markers. Restrict mixing to events that
  // overlap this 21 ms block instead of scanning the full match per sample.
  const activeEvents = events.filter(event => event.end > chunkStart && event.start < chunkEnd);
  for (let frame = 0; frame < frameCount; frame += 1) {
    const absoluteFrame = startFrame + frame;
    const time = absoluteFrame / AUDIO_SAMPLE_RATE;
    const crowd = Math.sin(time * Math.PI * 2 * 73) * 0.005
      + Math.sin(time * Math.PI * 2 * 109) * 0.003;
    let sample = crowd;
    for (const event of activeEvents) {
      if (time < event.start || time >= event.end) continue;
      const local = time - event.start;
      const duration = Math.max(0.001, event.end - event.start);
      const envelope = Math.sin(Math.PI * Math.min(1, local / duration));
      sample += waveAt(event.wave, local * Math.PI * 2 * event.frequency, absoluteFrame) * event.gain * envelope;
    }
    sample = Math.max(-0.92, Math.min(0.92, sample));
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

/** Encodes the compact demo soundscape directly into the MP4 audio track. */
export async function encodeRecordingAudio({ recording, muxer, config, onProgress = () => {} }) {
  const totalFrames = Math.max(1, Math.ceil(Number(recording.durationMs || 0) / 1000 * AUDIO_SAMPLE_RATE));
  const events = buildSoundEvents(recording);
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
        data: synthesizeChunk(startFrame, numberOfFrames, events)
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
