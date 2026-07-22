import { Team } from '../../shared/constants.js';
import { buildMatchReport } from '../../shared/matchReport.js';
import { renderMatchReport } from '../components/matchReportView.js';
import { decodeMatchRecording, interpolateRecordingFrame } from './matchRecording.js';
import { renderMatchRecordingFrame } from './matchRecordingRenderer.js';
import firebaseService from '../services/firebaseService.js';
import { getEquippedSkin, getSkinById } from '../data/skins.js';
import { soundFx } from '../utils/soundFx.js';
import { findNextRecordingHighlight, hasRecordingHighlights } from './recordingHighlights.js';

const SPEEDS = [0.1, 0.25, 0.5, 1, 2, 4, 8];
const HIGHLIGHT_PREROLL_MS = 2500;

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
    this.nextHighlightButton = root?.querySelector('#recording-next-highlight');
    this.speedSelect = root?.querySelector('#recording-speed');
    this.volumeInput = root?.querySelector('#recording-volume');
    this.fullscreenButton = root?.querySelector('#recording-fullscreen');
    this.timeLabel = root?.querySelector('#recording-time');
    this.report = root?.querySelector('#recording-live-report');
    this.markers = root?.querySelector('#recording-markers');
    this.recording = null;
    this.currentMs = 0;
    this.playing = false;
    this.lastTick = 0;
    this.raf = 0;
    this.lastAudioMarkerMs = 0;
    this.playbackRate = 1;
    this.hideControlsTimer = 0;
    this.bind();
  }

  bind() {
    this.playButton?.addEventListener('click', () => this.toggle());
    this.nextHighlightButton?.addEventListener('click', () => this.seekToNextHighlight());
    this.fullscreenButton?.addEventListener('click', () => this.toggleFullscreen());
    this.timeline?.addEventListener('input', () => {
      soundFx.stopCrowd();
      this.currentMs = Number(this.timeline.value || 0);
      // Seeking must not reuse the elapsed time from before the pointer move.
      // Otherwise 0.5x appears to jump at normal speed on the next frame.
      this.lastTick = performance.now();
      this.lastAudioMarkerMs = this.currentMs;
      this.render();
    });
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
      if (this.fullscreenButton) this.fullscreenButton.textContent = fullscreen ? '↙' : '⛶';
      if (fullscreen) this.showFullscreenControls();
      else clearTimeout(this.hideControlsTimer);
    });
    ['mousemove', 'pointermove', 'pointerdown', 'touchstart'].forEach(eventName => {
      this.root?.addEventListener(eventName, () => this.showFullscreenControls(), { passive: true });
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden || !this.playing) return;
      this.playing = false;
      cancelAnimationFrame(this.raf);
      soundFx.stopCrowd();
      if (this.playButton) this.playButton.textContent = '▶';
    });
    document.addEventListener('keydown', event => {
      if (event.code !== 'Space' || this.root?.classList.contains('hidden')) return;
      if (event.target?.matches?.('input, textarea, select, button, [contenteditable="true"]')) return;
      event.preventDefault();
      this.toggle();
    });
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
    this.playing = false;
    cancelAnimationFrame(this.raf);
    // A recording goal can raise the shared crowd bed. Stop it immediately
    // when the player closes so no recording audio leaks into other screens.
    soundFx.stopCrowd();
    if (this.playButton) this.playButton.textContent = '▶';
    clearTimeout(this.hideControlsTimer);
    this.root?.classList.remove('recording-controls-hidden');
    this.root?.classList.add('hidden');
  }

  toggle() {
    if (!this.recording) return;
    if (this.currentMs >= this.recording.durationMs) this.currentMs = 0;
    this.playing = !this.playing;
    if (!this.playing) soundFx.stopCrowd();
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
      soundFx.stopCrowd();
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
      winnerTeam: this.recording.winnerTeam ?? this.match?.winnerTeam ?? this.match?.winner
    });
    this.timeline.value = String(Math.min(this.currentMs, this.recording.durationMs || 0));
    this.timeLabel.textContent = `${formatTime(this.currentMs)} / ${formatTime(this.recording.durationMs)}`;
    const report = this.getReportAt(this.currentMs);
    if (report) {
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

  seekToNextHighlight() {
    if (!this.recording) return;
    const marker = findNextRecordingHighlight(this.recording.markers, this.currentMs);
    if (!marker) return;
    this.seekToMarker(marker);
    this.lastTick = performance.now();
    this.lastAudioMarkerMs = this.currentMs;
    this.render();
  }

  seekToMarker(marker) {
    this.currentMs = Math.max(0, Number(marker?.t || 0) - HIGHLIGHT_PREROLL_MS);
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

  showFullscreenControls() {
    if (!this.root?.classList.contains('recording-fullscreen-active')) return;
    this.root.classList.remove('recording-controls-hidden');
    clearTimeout(this.hideControlsTimer);
    this.hideControlsTimer = setTimeout(() => {
      if (this.root?.classList.contains('recording-fullscreen-active')) {
        this.root.classList.add('recording-controls-hidden');
      }
    }, 2200);
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
