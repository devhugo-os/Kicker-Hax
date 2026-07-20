import { AudioBufferSource, BufferTarget, CanvasSource, Mp4OutputFormat, Output } from 'mediabunny';
import { renderMatchRecordingFrame } from './matchRecordingRenderer.js';

const FPS = 24;
const SAMPLE_RATE = 22_050;
const SOUND_TONES = {
  kick: [[520, .05, .18], [260, .06, .09]], pickup: [[330, .045, .08], [440, .05, .07, .035]],
  tackle: [[140, .06, .22]], dribble: [[800, .05, .12], [600, .05, .08]],
  power: [[360, .08, .18], [720, .06, .16, .08]], post: [[900, .04, .12], [300, .06, .10]],
  whistle: [[1800, .18, .12], [1500, .18, .12]], goal: [[480, .18, .14], [960, .12, .12, .12]]
};

function createAudioBuffer(recording) {
  const durationSeconds = Math.max(.1, Number(recording.durationMs || 0) / 1000);
  const buffer = new AudioBuffer({ numberOfChannels: 1, length: Math.ceil(durationSeconds * SAMPLE_RATE), sampleRate: SAMPLE_RATE });
  const samples = buffer.getChannelData(0);
  (recording.markers || []).filter(marker => marker.type === 'sound').forEach(marker => {
    const markerSeconds = Number(marker.t || 0) / 1000;
    (SOUND_TONES[marker.sound] || []).forEach(([frequency, duration, gain, delay = 0]) => {
      const start = Math.max(0, Math.floor((markerSeconds + delay) * SAMPLE_RATE));
      const count = Math.min(samples.length - start, Math.floor(duration * SAMPLE_RATE));
      for (let index = 0; index < count; index += 1) {
        samples[start + index] += Math.sin(index / SAMPLE_RATE * Math.PI * 2 * frequency)
          * gain * (1 - index / Math.max(1, count));
      }
    });
  });
  return buffer;
}

/** Encodes the virtual timeline directly instead of waiting through it in real time. */
export async function exportRecordingFast({ recording, getFrameAt, onProgress }) {
  if (typeof VideoEncoder !== 'function' || typeof AudioEncoder !== 'function') throw new Error('WebCodecs indisponível');
  const [fieldWidth, fieldHeight] = recording.field || [1024, 640];
  const scale = Math.min(1, 854 / Math.max(fieldWidth, fieldHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(2, Math.round(fieldWidth * scale) & ~1);
  canvas.height = Math.max(2, Math.round(fieldHeight * scale) & ~1);
  const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() });
  const video = new CanvasSource(canvas, { codec: 'avc', bitrate: 900_000 });
  const audio = new AudioBufferSource({ codec: 'aac', bitrate: 80_000 });
  output.addVideoTrack(video);
  output.addAudioTrack(audio);
  output.setMetadataTags({ title: 'Kicker Hax - Gravação da partida', artist: 'Kicker Hax' });
  await output.start();
  const durationSeconds = Math.max(0, Number(recording.durationMs || 0) / 1000);
  const frameCount = Math.max(1, Math.ceil(durationSeconds * FPS));
  for (let index = 0; index <= frameCount; index += 1) {
    const seconds = Math.min(durationSeconds, index / FPS);
    const ended = index === frameCount;
    const sourceFrame = getFrameAt(seconds * 1000);
    const frame = ended && recording.finalScore ? { ...sourceFrame, score: { ...recording.finalScore } } : sourceFrame;
    renderMatchRecordingFrame(canvas, recording, frame, { ended, endReason: recording.endReason, winnerTeam: recording.winnerTeam });
    await video.add(seconds, 1 / FPS);
    if (index % 12 === 0) onProgress?.(Math.min(96, Math.round(index / frameCount * 96)));
  }
  await audio.add(createAudioBuffer(recording));
  await output.finalize();
  onProgress?.(100);
  return new Blob([output.target.buffer], { type: 'video/mp4' });
}
