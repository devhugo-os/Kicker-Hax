import { Team } from '../../shared/constants.js';
import { buildMatchReport } from '../../shared/matchReport.js';
import { renderMatchReport } from '../components/matchReportView.js';
import { decodeMatchRecording, interpolateRecordingFrame } from './matchRecording.js';
import { renderMatchRecordingFrame } from './matchRecordingRenderer.js';
import firebaseService from '../services/firebaseService.js';
import { getEquippedSkin, getSkinById } from '../data/skins.js';
import { soundFx } from '../utils/soundFx.js';
import { findNextRecordingHighlight, findPreviousRecordingHighlight, hasRecordingHighlights } from './recordingHighlights.js';
import { isNativeAppFrame } from '../utils/nativeBridge.js';
import { showToast } from '../utils/toast.js';

const SPEEDS = [0.1, 0.25, 0.5, 1, 2, 4, 8];
const HIGHLIGHT_PREROLL_MS = 2500;

function formatTime(milliseconds) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function renderRecordingFrame(canvas, recording, frame) {
  renderMatchRecordingFrame(canvas, recording, frame, {
    lowEffects: false,
    pixelRatio: Math.min(2, Number(window.devicePixelRatio || 1)),
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
    this.previousHighlightButton = root?.querySelector('#recording-previous-highlight');
    this.nextHighlightButton = root?.querySelector('#recording-next-highlight');
    this.speedSelect = root?.querySelector('#recording-speed');
    this.volumeInput = root?.querySelector('#recording-volume');
    this.fullscreenButton = root?.querySelector('#recording-fullscreen');
    this.timelineToggleButton = root?.querySelector('#recording-toggle-timeline');
    this.exportButton = root?.querySelector('#recording-export-mp4');
    this.timeLabel = root?.querySelector('#recording-time');
    this.report = root?.querySelector('#recording-live-report');
    this.markers = root?.querySelector('#recording-markers');
    this.playbackFeedback = root?.querySelector('#recording-playback-feedback');
    this.recording = null;
    this.currentMs = 0;
    this.playing = false;
    this.lastTick = 0;
    this.raf = 0;
    this.lastAudioMarkerMs = 0;
    this.playbackRate = 1;
    this.hideControlsTimer = 0;
    this.lastHighlightTime = null;
    this.nativeApp = isNativeAppFrame();
    this.lastInterfaceRenderAt = 0;
    this.lastReportKey = '';
    this.feedbackTimer = 0;
    this.bind();
  }

  bind() {
    this.playButton?.addEventListener('click', () => this.toggle());
    this.canvas?.addEventListener('click', () => this.toggle());
    this.previousHighlightButton?.addEventListener('click', () => this.seekToPreviousHighlight());
    this.nextHighlightButton?.addEventListener('click', () => this.seekToNextHighlight());
    this.fullscreenButton?.addEventListener('click', () => this.toggleFullscreen());
    this.timelineToggleButton?.addEventListener('click', () => this.toggleTimeline());
    this.exportButton?.addEventListener('click', () => this.exportMp4());
    this.timeline?.addEventListener('input', () => {
      soundFx.stopCrowd();
      this.currentMs = Number(this.timeline.value || 0);
      this.lastHighlightTime = null;
      // Seeking must not reuse the elapsed time from before the pointer move.
      // Otherwise 0.5x appears to jump at normal speed on the next frame.
      this.lastTick = performance.now();
      this.lastAudioMarkerMs = this.currentMs;
      this.render();
      this.applyPlaybackAudioState();
    });
    this.volumeInput?.addEventListener('input', () => this.applyPlaybackAudioState());
    this.speedSelect?.addEventListener('change', () => {
      this.playbackRate = Math.max(.1, Math.min(8, Number(this.speedSelect.value) || 1));
      this.lastTick = performance.now();
      this.render();
    });
    this.root?.querySelector('#recording-close')?.addEventListener('click', () => this.close());
    document.addEventListener('fullscreenchange', () => {
      const fullscreen = document.fullscreenElement === this.root;
      this.root?.classList.toggle('recording-fullscreen-active', fullscreen);
      this.root?.classList.remove('recording-controls-hidden');
      if (!fullscreen) this.root?.classList.remove('recording-playback-hidden');
      if (this.fullscreenButton) this.fullscreenButton.textContent = fullscreen ? '↙' : '⛶';
      this.updatePlaybackToggle();
      if (fullscreen) this.showFullscreenControls();
      else clearTimeout(this.hideControlsTimer);
      requestAnimationFrame(() => this.render(true));
    });
    ['mousemove', 'pointermove', 'pointerdown', 'touchstart'].forEach(eventName => {
      this.root?.addEventListener(eventName, () => this.showFullscreenControls(), { passive: true });
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden || !this.playing) return;
      this.playing = false;
      cancelAnimationFrame(this.raf);
      this.applyPlaybackAudioState();
      if (this.playButton) this.playButton.textContent = '▶';
    });
    document.addEventListener('keydown', event => {
      if (this.root?.classList.contains('hidden')) return;
      if (event.target?.matches?.('input, textarea, select, button, [contenteditable="true"]')) return;
      if (!['Space', 'ArrowLeft', 'ArrowRight'].includes(event.code)) return;
      event.preventDefault();
      if (event.code === 'ArrowLeft') this.seekToPreviousHighlight();
      else if (event.code === 'ArrowRight') this.seekToNextHighlight();
      else this.toggle();
    });
  }

  async open(documentData, match = {}) {
    soundFx.stopMenuTheme();
    this.recording = await decodeMatchRecording(documentData);
    await this.hydratePlayerSkins();
    this.match = match;
    this.currentMs = 0;
    this.lastHighlightTime = null;
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
    this.root.classList.remove('recording-timeline-hidden', 'recording-playback-hidden');
    this.updatePlaybackToggle();
    this.renderMarkers();
    this.root.classList.remove('hidden');
    this.showFullscreenControls();
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
    const wasVisible = this.root && !this.root.classList.contains('hidden');
    this.playing = false;
    cancelAnimationFrame(this.raf);
    // A recording goal can raise the shared crowd bed. Stop it immediately
    // when the player closes so no recording audio leaks into other screens.
    soundFx.stopCrowd();
    soundFx.stopMatchTheme();
    soundFx.setOutputVolumeScale(1);
    if (this.playButton) this.playButton.textContent = '▶';
    clearTimeout(this.hideControlsTimer);
    clearTimeout(this.feedbackTimer);
    this.root?.classList.remove('recording-controls-hidden', 'recording-timeline-hidden', 'recording-playback-hidden');
    this.root?.classList.add('hidden');
    if (wasVisible) soundFx.startMenuTheme();
  }

  async exportMp4() {
    if (!this.recording || !this.exportButton || this.exportButton.disabled) return;
    const button = this.exportButton;
    button.disabled = true;
    button.textContent = 'Preparando 0%';
    try {
      // MP4 support is intentionally lazy: normal gameplay and recording
      // playback do not download or parse the encoder/muxer bundle.
      const { exportMatchRecordingMp4 } = await import('./matchRecordingExporter.js');
      const bytes = await exportMatchRecordingMp4(this.recording, this.match, progress => {
        button.textContent = `Preparando ${progress}%`;
      });
      showToast(`MP4 pronto (${Math.max(1, Math.round(bytes / 1024 / 1024))} MB).`, 'success');
    } catch (error) {
      showToast(error.message || 'Não foi possível exportar esta gravação.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Exportar MP4';
    }
  }

  toggle() {
    if (!this.recording) return;
    if (this.currentMs >= this.recording.durationMs) this.currentMs = 0;
    this.playing = !this.playing;
    this.applyPlaybackAudioState();
    this.playButton.textContent = this.playing ? '⏸' : '▶';
    this.showPlaybackFeedback();
    this.lastTick = performance.now();
    if (this.playing) this.raf = requestAnimationFrame(time => this.tick(time));
  }

  tick(now) {
    if (!this.playing) return;
    const speed = this.playbackRate;
    const previousMs = this.currentMs;
    this.currentMs += Math.max(0, now - this.lastTick) * speed;
    if (this.lastHighlightTime !== null && this.currentMs > this.lastHighlightTime + 250) {
      this.lastHighlightTime = null;
    }
    this.lastTick = now;
    this.playMarkerAudio(previousMs, this.currentMs);
    if (this.currentMs >= this.recording.durationMs) {
      this.currentMs = this.recording.durationMs;
      this.playing = false;
      this.applyPlaybackAudioState();
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
    const ended = this.currentMs >= Number(this.recording.durationMs || 0);
    const renderedFrame = ended && this.recording.finalScore
      ? { ...frame, score: { ...this.recording.finalScore } }
      : frame;
    renderMatchRecordingFrame(this.canvas, this.recording, renderedFrame, {
      shake: !ended
        && frame?.status === 'playing'
        && frame.ball?.lastStrikeType === 'power'
        && Number(frame.ball?.strikeTimer || 0) > 0,
      ended,
      endReason: this.recording.endReason || (this.match?.forfeit ? 'wo' : 'normal'),
      winnerTeam: this.recording.winnerTeam ?? this.match?.winnerTeam ?? this.match?.winner,
      // Recording keeps every visual effect. App performance comes from the
      // cached stadium and throttled DOM report, never from degraded graphics.
      lowEffects: false,
      pixelRatio: Math.min(this.nativeApp ? 1.6 : 2, Number(window.devicePixelRatio || 1)),
      preserveAspect: this.nativeApp || window.matchMedia?.('(pointer: coarse)').matches
    });
    const now = performance.now();
    const interfaceInterval = this.nativeApp && this.playing ? 100 : 0;
    const updateInterface = !interfaceInterval || now - this.lastInterfaceRenderAt >= interfaceInterval || ended;
    if (!updateInterface) return;
    this.lastInterfaceRenderAt = now;
    this.timeline.value = String(Math.min(this.currentMs, this.recording.durationMs || 0));
    this.timeLabel.textContent = `${formatTime(this.currentMs)} / ${formatTime(this.recording.durationMs)}`;
    const report = this.getReportAt(this.currentMs);
    const fullscreen = this.root?.classList.contains('recording-fullscreen-active');
    const reportKey = report
      ? `${Math.floor(this.currentMs / (this.nativeApp ? 500 : 150))}:${ended}`
      : '';
    if (report && !fullscreen && (reportKey !== this.lastReportKey || !this.playing)) {
      this.lastReportKey = reportKey;
      renderMatchReport(this.report, report);
      this.report.classList.toggle('recording-final-report', ended);
      if (ended) {
        const title = document.createElement('h3');
        title.className = 'recording-final-title';
        const isForfeit = this.recording.endReason === 'wo' || this.match?.forfeit;
        const reason = this.recording.forfeitReason?.message || this.match?.forfeitReason?.message || '';
        const winner = this.recording.winnerTeam ?? this.match?.winnerTeam ?? this.match?.winner;
        const winnerLabel = winner === Team.RED || winner === 'red'
          ? 'Time Vermelho'
          : winner === Team.BLUE || winner === 'blue' ? 'Time Azul' : '';
        title.textContent = isForfeit
          ? `Fim da partida - ${winnerLabel || 'vencedor'} por W.O.${reason ? ` ${reason}` : ''}`
          : `Fim da partida - ${winnerLabel ? `vitória do ${winnerLabel}` : 'empate'}`;
        this.report.prepend(title);
      }
    }
  }

  renderMarkers() {
    this.markers.replaceChildren();
    const duration = Math.max(1, Number(this.recording.durationMs || 1));
    const visibleMarkers = (this.recording.markers || []).filter(marker => marker.type !== 'sound');
    const hasHighlights = hasRecordingHighlights(visibleMarkers);
    if (this.previousHighlightButton) {
      this.previousHighlightButton.disabled = !hasHighlights;
      this.previousHighlightButton.title = hasHighlights
        ? 'Gol ou lance perigoso anterior'
        : 'Nenhum lance importante nesta gravação';
    }
    if (this.nextHighlightButton) {
      this.nextHighlightButton.disabled = !hasHighlights;
      this.nextHighlightButton.title = hasHighlights
        ? 'Pr\u00f3ximo gol ou lance perigoso'
        : 'Nenhum lance importante nesta grava\u00e7\u00e3o';
    }
    visibleMarkers.forEach(marker => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `recording-marker recording-marker-${marker.type || 'event'}`;
      button.style.left = `${Math.max(0, Math.min(100, marker.t / duration * 100))}%`;
      button.title = marker.label || 'Momento importante';
      button.addEventListener('click', () => {
        this.seekToMarker(marker);
        this.lastTick = performance.now();
        this.lastAudioMarkerMs = this.currentMs;
        this.render();
      });
      this.markers.appendChild(button);
    });
  }

  seekToPreviousHighlight() {
    if (!this.recording) return;
    const referenceMs = this.lastHighlightTime ?? this.currentMs;
    const marker = findPreviousRecordingHighlight(this.recording.markers, referenceMs);
    if (!marker) return;
    this.seekToMarker(marker);
    this.lastTick = performance.now();
    this.lastAudioMarkerMs = this.currentMs;
    this.render();
  }

  seekToNextHighlight() {
    if (!this.recording) return;
    const referenceMs = this.lastHighlightTime ?? this.currentMs;
    const marker = findNextRecordingHighlight(this.recording.markers, referenceMs);
    if (!marker) return;
    this.seekToMarker(marker);
    this.lastTick = performance.now();
    this.lastAudioMarkerMs = this.currentMs;
    this.render();
  }

  seekToMarker(marker) {
    this.lastHighlightTime = Number(marker?.t || 0);
    this.currentMs = Math.max(0, Number(marker?.t || 0) - HIGHLIGHT_PREROLL_MS);
  }

  showPlaybackFeedback() {
    if (!this.playbackFeedback) return;
    clearTimeout(this.feedbackTimer);
    this.playbackFeedback.textContent = this.playing ? '▶' : '❚❚';
    this.playbackFeedback.classList.remove('visible');
    void this.playbackFeedback.offsetWidth;
    this.playbackFeedback.classList.add('visible');
    this.feedbackTimer = setTimeout(() => {
      this.playbackFeedback?.classList.remove('visible');
    }, 520);
  }

  applyPlaybackAudioState() {
    const active = this.playing && !this.root?.classList.contains('hidden');
    const volume = Math.max(0, Math.min(1, Number(this.volumeInput?.value || 0) / 100));
    soundFx.setOutputVolumeScale(active ? volume : 1);
    if (active && volume > 0) {
      soundFx.startCrowd();
      soundFx.startMatchTheme();
    } else {
      soundFx.stopCrowd();
      soundFx.stopMatchTheme();
    }
  }

  async toggleFullscreen() {
    if (!this.root || this.root.classList.contains('hidden')) return;
    try {
      if (document.fullscreenElement === this.root) await document.exitFullscreen?.();
      else await this.root.requestFullscreen?.({ navigationUI: 'hide' });
    } catch (error) {
      console.warn('[Kicker Recording] Fullscreen indisponivel:', error);
    }
  }

  toggleTimeline() {
    if (!this.root) return;
    const fullscreen = this.root.classList.contains('recording-fullscreen-active')
      || document.fullscreenElement === this.root;
    const hidden = fullscreen
      ? this.root.classList.toggle('recording-playback-hidden')
      : this.root.classList.toggle('recording-timeline-hidden');
    this.updatePlaybackToggle(hidden, fullscreen);
    this.showFullscreenControls();
  }

  updatePlaybackToggle(hidden = null, fullscreen = null) {
    if (!this.timelineToggleButton || !this.root) return;
    const inFullscreen = fullscreen ?? (this.root.classList.contains('recording-fullscreen-active')
      || document.fullscreenElement === this.root);
    const isHidden = hidden ?? this.root.classList.contains(
      inFullscreen ? 'recording-playback-hidden' : 'recording-timeline-hidden'
    );
    if (this.timelineToggleButton) {
      this.timelineToggleButton.textContent = isHidden ? '▴' : '▾';
      this.timelineToggleButton.title = isHidden ? 'Mostrar controles' : 'Ocultar controles';
      this.timelineToggleButton.setAttribute('aria-label', isHidden ? 'Mostrar controles de reprodução' : 'Ocultar controles de reprodução');
    }
  }

  showFullscreenControls() {
    if (!this.root?.classList.contains('recording-fullscreen-active')) return;
    this.root.classList.remove('recording-controls-hidden');
    clearTimeout(this.hideControlsTimer);
    this.hideControlsTimer = setTimeout(() => {
      if (this.root?.classList.contains('recording-fullscreen-active')) {
        this.root.classList.add('recording-controls-hidden');
      }
    }, 5000);
  }

  playMarkerAudio(fromMs, toMs) {
    // Seeking, opening and paused rendering must be completely silent.
    if (!this.playing || this.root?.classList.contains('hidden')) return;
    const volume = Number(this.volumeInput?.value || 0) / 100;
    if (volume <= 0) return;
    const crossedMarkers = (this.recording?.markers || [])
      .filter(marker => marker.type === 'sound' && marker.t > fromMs && marker.t <= toMs);
    if (!crossedMarkers.length) return;
    crossedMarkers.forEach(marker => soundFx.play(marker.sound));
  }

}
