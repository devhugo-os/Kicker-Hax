import { Team } from '../../shared/constants.js';
import { buildMatchReport } from '../../shared/matchReport.js';
import { renderMatchReport } from '../components/matchReportView.js';
import { decodeMatchRecording, interpolateRecordingFrame } from './matchRecording.js';
import { showToast } from '../utils/toast.js';
import { renderMatchRecordingFrame } from './matchRecordingRenderer.js';
import firebaseService from '../services/firebaseService.js';
import { getEquippedSkin, getSkinById } from '../data/skins.js';
import { soundFx } from '../utils/soundFx.js';

const SPEEDS = [0.25, 0.5, 0.75, 1];

function formatTime(milliseconds) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function renderRecordingFrame(canvas, recording, frame) {
  renderMatchRecordingFrame(canvas, recording, frame, {
    shake: frame.status === 'playing'
      && frame.ball?.lastStrikeType === 'power'
      && Number(frame.ball?.strikeTimer || 0) > 0
  });
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
    this.playbackRate = 1;
    this.bind();
  }

  bind() {
    this.playButton?.addEventListener('click', () => this.toggle());
    this.timeline?.addEventListener('input', () => {
      this.currentMs = Number(this.timeline.value || 0);
      // Seeking must not reuse the elapsed time from before the pointer move.
      // Otherwise 0.5x appears to jump at normal speed on the next frame.
      this.lastTick = performance.now();
      this.lastAudioMarkerMs = this.currentMs;
      this.render();
    });
    this.speedSelect?.addEventListener('change', () => {
      this.playbackRate = Math.max(.25, Number(this.speedSelect.value) || 1);
      this.lastTick = performance.now();
      this.render();
    });
    this.exportButton?.addEventListener('click', () => this.exportVideo());
    this.root?.querySelector('#recording-close')?.addEventListener('click', () => this.close());
  }

  async open(documentData, match = {}) {
    this.recording = await decodeMatchRecording(documentData);
    await this.hydratePlayerSkins();
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
    this.speedSelect.value = '1';
    this.playbackRate = 1;
    const [fieldWidth, fieldHeight] = this.recording.field || [1024, 640];
    this.root.style.setProperty('--recording-aspect', `${fieldWidth} / ${fieldHeight}`);
    this.renderMarkers();
    this.root.classList.remove('hidden');
    this.render();
  }

  prepareOpen() {
    this.close();
    this.recording = null;
    this.root?.classList.remove('hidden');
    if (this.report) this.report.textContent = 'Carregando gravacao...';
  }

  async hydratePlayerSkins() {
    const players = this.recording?.players || [];
    await Promise.all(players.map(async player => {
      if (player.skin) return;
      if (player.skinId?.startsWith('community_')) {
        const asset = await firebaseService.getSkinAsset(player.skinId).catch(() => null);
        if (asset?.image) player.skin = asset.image;
        return;
      }
      if (player.skinId && player.skinId !== 'rookie' && player.skinId !== 'none') {
        const builtIn = getSkinById(player.skinId);
        if (builtIn?.id === player.skinId) player.skin = builtIn.image;
        return;
      }
      if (!player.uid) return;
      const profile = await firebaseService.getUserProfile(player.uid).catch(() => null);
      if (!profile) return;
      player.skinId = profile.equippedSkinId || player.skinId;
      player.skin = getEquippedSkin(profile).image || '';
      player.badge = profile.badge || player.badge;
    }));
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
    const speed = this.playbackRate;
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
    // Captures arrive at real network/browser intervals. Binary search the
    // stored timestamps instead of assuming every frame is exactly 100 ms.
    let low = 0;
    let high = frames.length - 1;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      if (frames[middle].timeMs <= timeMs) low = middle;
      else high = middle - 1;
    }
    const first = frames[low];
    const second = frames[Math.min(frames.length - 1, low + 1)];
    const span = Math.max(1, Number(second.timeMs || 0) - Number(first.timeMs || 0));
    return interpolateRecordingFrame(first, second, Math.max(0, Math.min(1, (timeMs - first.timeMs) / span)));
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
    (this.recording.markers || []).filter(marker => marker.type !== 'sound').forEach(marker => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `recording-marker recording-marker-${marker.type || 'event'}`;
      button.style.left = `${Math.max(0, Math.min(100, marker.t / duration * 100))}%`;
      button.title = marker.label || 'Momento importante';
      button.addEventListener('click', () => {
        this.currentMs = marker.t;
        this.lastTick = performance.now();
        this.lastAudioMarkerMs = this.currentMs;
        this.render();
      });
      this.markers.appendChild(button);
    });
  }

  playMarkerAudio(fromMs, toMs) {
    const volume = Number(this.volumeInput?.value || 0) / 100;
    if (volume <= 0) return;
    const crossedMarkers = (this.recording?.markers || [])
      .filter(marker => marker.type === 'sound' && marker.t > fromMs && marker.t <= toMs);
    if (!crossedMarkers.length) return;
    crossedMarkers.forEach(marker => soundFx.play(marker.sound));
  }

  async exportVideo() {
    if (!this.recording || !this.canvas?.captureStream || typeof MediaRecorder !== 'function') {
      showToast('Este dispositivo não oferece exportação de vídeo.', 'error');
      return;
    }
    const candidates = ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
    const mimeType = candidates.find(type => MediaRecorder.isTypeSupported(type));
    if (!mimeType) return showToast('Nenhum formato de vídeo compatível foi encontrado.', 'error');
    this.exportButton.disabled = true;
    this.exportButton.textContent = 'Criando vídeo...';
    // Render on an isolated canvas so exporting never moves the visible player.
    const exportCanvas = document.createElement('canvas');
    const [fieldWidth, fieldHeight] = this.recording.field || [1024, 640];
    exportCanvas.width = fieldWidth;
    exportCanvas.height = fieldHeight;
    const stream = exportCanvas.captureStream(30);
    const audioDestination = soundFx.getRecordingStreamDestination();
    audioDestination?.stream.getAudioTracks().forEach(track => stream.addTrack(track));
    const exportVolume = Number(this.volumeInput?.value || 0) / 100;
    const chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1_200_000 });
    recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
    const finished = new Promise(resolve => { recorder.onstop = resolve; });
    recorder.start(500);
    const exportStart = performance.now();
    let previousExportMs = 0;
    const renderExport = now => {
      const exportMs = Math.min(this.recording.durationMs, now - exportStart);
      if (exportVolume > 0) {
        (this.recording.markers || [])
          .filter(marker => marker.type === 'sound' && marker.t > previousExportMs && marker.t <= exportMs)
          .forEach(marker => soundFx.play(marker.sound));
      }
      previousExportMs = exportMs;
      renderRecordingFrame(exportCanvas, this.recording, this.getFrameAt(exportMs));
      if (exportMs < this.recording.durationMs) requestAnimationFrame(renderExport);
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
    this.exportButton.disabled = false;
    this.exportButton.textContent = extension === 'mp4' ? 'Salvar MP4' : 'Salvar vídeo';
    this.render();
    showToast(extension === 'mp4' ? 'MP4 criado com sucesso!' : 'MP4 indisponível; vídeo salvo em WebM.', 'success');
  }
}
