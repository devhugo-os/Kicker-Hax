import { Team } from '../../shared/constants.js';
import { buildMatchReport } from '../../shared/matchReport.js';
import { renderMatchReport } from '../components/matchReportView.js';
import { decodeMatchRecording, interpolateRecordingFrame } from './matchRecording.js';
import { showToast } from '../utils/toast.js';

const SPEEDS = [0.5, 1, 1.5, 2];

function formatTime(milliseconds) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function drawField(ctx, width, height) {
  ctx.fillStyle = '#23843a';
  ctx.fillRect(0, 0, width, height);
  const stripe = width / 10;
  for (let index = 0; index < 10; index += 1) {
    ctx.fillStyle = index % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.045)';
    ctx.fillRect(index * stripe, 0, stripe, height);
  }
  ctx.strokeStyle = 'rgba(255,255,255,.9)';
  ctx.lineWidth = Math.max(2, width / 420);
  ctx.strokeRect(width * 0.025, height * 0.035, width * 0.95, height * 0.93);
  ctx.beginPath();
  ctx.moveTo(width / 2, height * 0.035);
  ctx.lineTo(width / 2, height * 0.965);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, height * 0.12, 0, Math.PI * 2);
  ctx.stroke();
  const boxW = width * 0.15;
  const boxH = height * 0.4;
  ctx.strokeRect(width * 0.025, (height - boxH) / 2, boxW, boxH);
  ctx.strokeRect(width * 0.975 - boxW, (height - boxH) / 2, boxW, boxH);
}

export function renderRecordingFrame(canvas, recording, frame) {
  if (!canvas || !recording || !frame) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const [fieldWidth, fieldHeight] = recording.field || [1024, 640];
  canvas.width = Math.max(640, Math.round(fieldWidth));
  canvas.height = Math.max(360, Math.round(fieldHeight));
  drawField(ctx, canvas.width, canvas.height);
  frame.players.forEach(state => {
    const player = recording.players?.[state.index] || {};
    const radius = Math.max(10, canvas.height * 0.022);
    ctx.fillStyle = state.team === Team.RED ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(state.x, state.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = state.hasBall ? '#facc15' : '#e2e8f0';
    ctx.lineWidth = state.hasBall ? 4 : 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `700 ${Math.max(11, canvas.height * 0.018)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(player.name || 'Jogador', state.x, state.y - radius - 7);
  });
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(frame.ball.x, frame.ball.y, Math.max(7, canvas.height * 0.013), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export class MatchRecordingPlayer {
  constructor(root) {
    this.root = root;
    this.canvas = root?.querySelector('#recording-canvas');
    this.timeline = root?.querySelector('#recording-timeline');
    this.playButton = root?.querySelector('#recording-play-toggle');
    this.speedSelect = root?.querySelector('#recording-speed');
    this.volumeInput = root?.querySelector('#recording-volume');
    this.timeLabel = root?.querySelector('#recording-time');
    this.report = root?.querySelector('#recording-live-report');
    this.markers = root?.querySelector('#recording-markers');
    this.exportButton = root?.querySelector('#recording-export');
    this.recording = null;
    this.currentMs = 0;
    this.playing = false;
    this.lastTick = 0;
    this.raf = 0;
    this.lastAudioMarkerMs = 0;
    this.audioContext = null;
    this.bind();
  }

  bind() {
    this.playButton?.addEventListener('click', () => this.toggle());
    this.timeline?.addEventListener('input', () => {
      this.currentMs = Number(this.timeline.value || 0);
      this.render();
    });
    this.speedSelect?.addEventListener('change', () => this.render());
    this.exportButton?.addEventListener('click', () => this.exportVideo());
    this.root?.querySelector('#recording-close')?.addEventListener('click', () => this.close());
  }

  async open(documentData, match = {}) {
    this.recording = await decodeMatchRecording(documentData);
    this.match = match;
    this.currentMs = 0;
    this.lastAudioMarkerMs = 0;
    this.playing = false;
    this.timeline.max = String(this.recording.durationMs || 0);
    this.timeline.value = '0';
    this.speedSelect.replaceChildren(...SPEEDS.map(speed => {
      const option = document.createElement('option');
      option.value = String(speed);
      option.textContent = `${speed}x`;
      if (speed === 1) option.selected = true;
      return option;
    }));
    this.renderMarkers();
    this.root.classList.remove('hidden');
    this.render();
  }

  close() {
    this.playing = false;
    cancelAnimationFrame(this.raf);
    this.root?.classList.add('hidden');
  }

  toggle() {
    if (!this.recording) return;
    if (this.currentMs >= this.recording.durationMs) this.currentMs = 0;
    this.playing = !this.playing;
    this.playButton.textContent = this.playing ? '⏸' : '▶';
    this.lastTick = performance.now();
    if (this.playing) this.raf = requestAnimationFrame(time => this.tick(time));
  }

  tick(now) {
    if (!this.playing) return;
    const speed = Number(this.speedSelect?.value || 1);
    const previousMs = this.currentMs;
    this.currentMs += Math.max(0, now - this.lastTick) * speed;
    this.lastTick = now;
    this.playMarkerAudio(previousMs, this.currentMs);
    if (this.currentMs >= this.recording.durationMs) {
      this.currentMs = this.recording.durationMs;
      this.playing = false;
      this.playButton.textContent = '▶';
    }
    this.render();
    if (this.playing) this.raf = requestAnimationFrame(time => this.tick(time));
  }

  getFrameAt(timeMs) {
    const frames = this.recording?.frames || [];
    if (!frames.length) return null;
    const sampleMs = Number(this.recording.sampleMs || 100);
    const position = Math.max(0, timeMs / sampleMs);
    const index = Math.min(frames.length - 1, Math.floor(position));
    return interpolateRecordingFrame(frames[index], frames[Math.min(frames.length - 1, index + 1)], position - index);
  }

  getReportAt(timeMs) {
    const reports = this.recording?.reports || [];
    let selected = reports[0] || null;
    reports.forEach(report => { if (report.timeMs <= timeMs) selected = report; });
    if (!selected) return null;
    const totalPossession = selected.playerStats.reduce((sum, player) => sum + Number(player.possessionFrames || 0), 0);
    const playerStats = selected.playerStats.map(player => ({
      ...player,
      possessionPct: totalPossession > 0
        ? Math.round((Number(player.possessionFrames || 0) / totalPossession) * 100)
        : Number(player.possessionPct || 0)
    }));
    return buildMatchReport({
      score: selected.score,
      winnerTeam: selected.score.red === selected.score.blue
        ? 'draw'
        : selected.score.red > selected.score.blue ? Team.RED : Team.BLUE,
      playerStats
    });
  }

  render() {
    if (!this.recording) return;
    const frame = this.getFrameAt(this.currentMs);
    renderRecordingFrame(this.canvas, this.recording, frame);
    this.timeline.value = String(Math.min(this.currentMs, this.recording.durationMs || 0));
    this.timeLabel.textContent = `${formatTime(this.currentMs)} / ${formatTime(this.recording.durationMs)}`;
    const report = this.getReportAt(this.currentMs);
    if (report) renderMatchReport(this.report, report);
  }

  renderMarkers() {
    this.markers.replaceChildren();
    const duration = Math.max(1, Number(this.recording.durationMs || 1));
    (this.recording.markers || []).forEach(marker => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `recording-marker recording-marker-${marker.type || 'event'}`;
      button.style.left = `${Math.max(0, Math.min(100, marker.t / duration * 100))}%`;
      button.title = marker.label || 'Momento importante';
      button.addEventListener('click', () => {
        this.currentMs = marker.t;
        this.render();
      });
      this.markers.appendChild(button);
    });
  }

  playMarkerAudio(fromMs, toMs) {
    const volume = Number(this.volumeInput?.value || 0) / 100;
    if (volume <= 0) return;
    const crossedMarker = (this.recording?.markers || []).find(marker =>
      marker.t > fromMs && marker.t <= toMs
    );
    if (!crossedMarker) return;
    this.audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    oscillator.type = 'triangle';
    const startFrequency = crossedMarker.type === 'goal' ? 420 : 260;
    const endFrequency = crossedMarker.type === 'goal' ? 760 : 520;
    oscillator.frequency.setValueAtTime(startFrequency, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, this.audioContext.currentTime + 0.18);
    gain.gain.setValueAtTime(Math.min(0.2, volume * 0.2), this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.24);
    oscillator.connect(gain).connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.25);
  }

  async exportVideo() {
    if (!this.recording || !this.canvas?.captureStream || typeof MediaRecorder !== 'function') {
      showToast('Este dispositivo não oferece exportação de vídeo.', 'error');
      return;
    }
    const candidates = ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
    const mimeType = candidates.find(type => MediaRecorder.isTypeSupported(type));
    if (!mimeType) return showToast('Nenhum formato de vídeo compatível foi encontrado.', 'error');
    const previousTime = this.currentMs;
    const previousPlaying = this.playing;
    this.playing = false;
    this.exportButton.disabled = true;
    this.exportButton.textContent = 'Gravando...';
    const stream = this.canvas.captureStream(30);
    const chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1_200_000 });
    recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
    const finished = new Promise(resolve => { recorder.onstop = resolve; });
    recorder.start(500);
    const exportStart = performance.now();
    const exportSpeed = 2;
    const renderExport = now => {
      this.currentMs = Math.min(this.recording.durationMs, (now - exportStart) * exportSpeed);
      this.render();
      if (this.currentMs < this.recording.durationMs) requestAnimationFrame(renderExport);
      else recorder.stop();
    };
    requestAnimationFrame(renderExport);
    await finished;
    const extension = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kicker-Hax-${this.match?.matchId || Date.now()}.${extension}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.currentMs = previousTime;
    this.playing = previousPlaying;
    this.exportButton.disabled = false;
    this.exportButton.textContent = extension === 'mp4' ? 'Salvar MP4' : 'Salvar vídeo';
    this.render();
    showToast(extension === 'mp4' ? 'MP4 criado com sucesso!' : 'MP4 indisponível; vídeo salvo em WebM.', 'success');
  }
}
