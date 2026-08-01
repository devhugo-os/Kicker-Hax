import { ArrayBufferTarget, Muxer } from 'mp4-muxer';
import { interpolateRecordingFrame } from './matchRecording.js';
import { renderMatchRecordingFrame } from './matchRecordingRenderer.js';
import {
  encodeRecordingAudio,
  getRecordingAudioConfig,
  RECORDING_AUDIO_FORMAT
} from './matchRecordingAudio.js';
import { buildMatchRecordingFilename } from './matchRecordingFilename.js';

const EXPORT_FPS = 30;
const EXPORT_WIDTH = 1024;
const EXPORT_HEIGHT = 640;

function getFrameAt(recording, timeMs) {
  const frames = recording?.frames || [];
  if (!frames.length) return null;
  let low = 0;
  let high = frames.length - 1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (Number(frames[middle].timeMs || 0) <= timeMs) low = middle;
    else high = middle - 1;
  }
  const first = frames[low];
  const second = frames[Math.min(frames.length - 1, low + 1)];
  const span = Math.max(1, Number(second.timeMs || 0) - Number(first.timeMs || 0));
  return interpolateRecordingFrame(first, second, Math.max(0, Math.min(1, (timeMs - first.timeMs) / span)));
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/**
 * Encodes the demo faster than real time through the browser's hardware video
 * encoder. The exported timeline always remains at normal 1x match speed.
 */
export async function exportMatchRecordingMp4(recording, match = {}, onProgress = () => {}) {
  if (!recording?.frames?.length || !recording.durationMs) {
    throw new Error('Esta gravação não possui quadros suficientes para exportar.');
  }
  if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') {
    throw new Error('Este dispositivo não oferece exportação MP4 acelerada.');
  }

  const config = {
    codec: 'avc1.42001f',
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    bitrate: 3_000_000,
    framerate: EXPORT_FPS,
    hardwareAcceleration: 'prefer-hardware',
    latencyMode: 'realtime',
    avc: { format: 'avc' }
  };
  const support = await VideoEncoder.isConfigSupported(config);
  if (!support.supported) throw new Error('O codificador MP4 não é compatível com este aparelho.');

  const audioConfig = await getRecordingAudioConfig();
  if (!audioConfig) throw new Error('O codificador de áudio MP4 não é compatível com este aparelho.');

  const target = new ArrayBufferTarget();
  const frameCount = Math.max(1, Math.ceil(Number(recording.durationMs) / 1000 * EXPORT_FPS));
  const expectedAudioChunks = Math.ceil(
    Number(recording.durationMs) / 1000
      * RECORDING_AUDIO_FORMAT.sampleRate
      / RECORDING_AUDIO_FORMAT.chunkFrames
  );
  const muxer = new Muxer({
    target,
    video: { codec: 'avc', width: EXPORT_WIDTH, height: EXPORT_HEIGHT, frameRate: EXPORT_FPS },
    audio: {
      codec: 'aac',
      sampleRate: RECORDING_AUDIO_FORMAT.sampleRate,
      numberOfChannels: RECORDING_AUDIO_FORMAT.numberOfChannels
    },
    fastStart: { expectedVideoChunks: frameCount, expectedAudioChunks }
  });
  // The audio track is synthesized from the compact event timeline, so it
  // remains synchronized without replaying the demo in real time.
  await encodeRecordingAudio({
    recording,
    muxer,
    config: audioConfig,
    onProgress: value => onProgress(Math.round(value * 10))
  });

  let encoderError = null;
  const encoder = new VideoEncoder({
    output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
    error: error => { encoderError = error; }
  });
  encoder.configure(support.config);

  const canvas = document.createElement('canvas');
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;
  const frameDurationUs = Math.round(1_000_000 / EXPORT_FPS);

  try {
    for (let index = 0; index < frameCount; index += 1) {
      if (encoderError) throw encoderError;
      const timeMs = Math.min(Number(recording.durationMs), index * 1000 / EXPORT_FPS);
      const frame = getFrameAt(recording, timeMs);
      if (!frame) continue;
      const ended = index === frameCount - 1;
      renderMatchRecordingFrame(canvas, recording, ended && recording.finalScore
        ? { ...frame, score: { ...recording.finalScore } }
        : frame, {
        outputWidth: EXPORT_WIDTH,
        outputHeight: EXPORT_HEIGHT,
        pixelRatio: 1,
        preserveAspect: false,
        lowEffects: false,
        ended,
        endReason: recording.endReason || (match.forfeit ? 'wo' : 'normal'),
        winnerTeam: recording.winnerTeam ?? match.winnerTeam ?? match.winner
      });
      const videoFrame = new VideoFrame(canvas, {
        timestamp: index * frameDurationUs,
        duration: frameDurationUs
      });
      encoder.encode(videoFrame, { keyFrame: index % (EXPORT_FPS * 2) === 0 });
      videoFrame.close();

      // Bound encoder memory and yield occasionally so the UI remains usable.
      while (encoder.encodeQueueSize > 24) {
        await new Promise(resolve => window.setTimeout(resolve, 0));
        if (encoderError) throw encoderError;
      }
      if (index % 30 === 0 || ended) {
        onProgress(10 + Math.round(((index + 1) / frameCount) * 90));
        await new Promise(resolve => window.setTimeout(resolve, 0));
      }
    }
    await encoder.flush();
    if (encoderError) throw encoderError;
    muxer.finalize();
  } finally {
    if (encoder.state !== 'closed') encoder.close();
  }

  const blob = new Blob([target.buffer], { type: 'video/mp4' });
  downloadBlob(blob, buildMatchRecordingFilename(recording, match));
  return blob.size;
}
