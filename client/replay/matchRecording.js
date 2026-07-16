const SAMPLE_INTERVAL_MS = 100;
const REPORT_INTERVAL_MS = 1000;
export const MAX_RECORDING_BASE64_LENGTH = 850_000;
const RECORDABLE_STATUSES = new Set(['playing', 'countdown']);

const q = value => Math.round(Number(value || 0) * 10);
const uq = value => Number(value || 0) / 10;

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function compressText(text) {
  const source = new TextEncoder().encode(text);
  if (typeof CompressionStream !== 'function') {
    return { encoding: 'base64-json', data: bytesToBase64(source) };
  }
  const stream = new Blob([source]).stream().pipeThrough(new CompressionStream('gzip'));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  return { encoding: 'gzip-base64', data: bytesToBase64(bytes) };
}

async function decompressText(payload) {
  const bytes = base64ToBytes(payload.data || '');
  if (payload.encoding !== 'gzip-base64') return new TextDecoder().decode(bytes);
  if (typeof DecompressionStream !== 'function') throw new Error('Este navegador não consegue abrir gravações compactadas.');
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

export function getMatchRecordingId(uid, matchId) {
  const safeUid = String(uid || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
  const safeMatch = String(matchId || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
  return `${safeUid}_${safeMatch}`;
}

function compactStats(stats = {}) {
  return [
    Number(stats.goals || 0), Number(stats.assists || 0), Number(stats.ownGoals || 0),
    Number(stats.shots || 0), Number(stats.dribbles || 0), Number(stats.tackles || 0),
    Number(stats.possessionFrames || 0), Number(stats.possessionPct || 0)
  ];
}

function expandStats(values = []) {
  return {
    goals: values[0] || 0,
    assists: values[1] || 0,
    ownGoals: values[2] || 0,
    shots: values[3] || 0,
    dribbles: values[4] || 0,
    tackles: values[5] || 0,
    possessionFrames: values[6] || 0,
    possessionPct: values[7] || 0
  };
}

/**
 * Records authoritative snapshots as a compact demo. Goal freeze and replay
 * phases are deliberately omitted, so playback cuts directly to kickoff.
 */
export class MatchRecordingSession {
  constructor({ fieldWidth = 1024, fieldHeight = 640 } = {}) {
    this.field = [Number(fieldWidth) || 1024, Number(fieldHeight) || 640];
    this.frames = [];
    this.reports = [];
    this.markers = [];
    this.players = [];
    this.playerIndexes = new Map();
    this.latestStats = new Map();
    this.lastCapturedAt = 0;
    this.lastReportAt = -REPORT_INTERVAL_MS;
    this.lastGoalKey = '';
    this.lastImportantMarkerAt = -2000;
    this.virtualTimeMs = 0;
    this.active = true;
  }

  ensurePlayer(player = {}) {
    const id = String(player.id || player.playerId || player.uid || '');
    if (!id) return -1;
    if (!this.playerIndexes.has(id)) {
      this.playerIndexes.set(id, this.players.length);
      this.players.push({
        id,
        uid: String(player.uid || ''),
        name: String(player.name || player.username || 'Jogador').slice(0, 20),
        team: player.team
      });
    } else {
      const existing = this.players[this.playerIndexes.get(id)];
      if (player.name || player.username) existing.name = String(player.name || player.username).slice(0, 20);
      if (player.uid) existing.uid = String(player.uid);
      if (player.team !== undefined) existing.team = player.team;
    }
    if (player.matchStats) this.latestStats.set(id, { ...this.latestStats.get(id), ...player.matchStats });
    return this.playerIndexes.get(id);
  }

  capture(state, now = performance.now()) {
    if (!this.active || !state?.ball || !Array.isArray(state.players)) return;
    this.captureGoalMarker(state.goalInfo, state.score);
    this.captureImportantMarker(state);
    if (!RECORDABLE_STATUSES.has(state.status)) return;
    if (this.lastCapturedAt && now - this.lastCapturedAt < SAMPLE_INTERVAL_MS) return;
    this.lastCapturedAt = now;
    const players = state.players.map(player => {
      const index = this.ensurePlayer(player);
      return [
        index, q(player.x), q(player.y), q(player.dir), Number(player.team),
        state.ball.owner === player.id ? 1 : 0
      ];
    }).filter(player => player[0] >= 0);
    const frame = [
      this.virtualTimeMs,
      state.status === 'countdown' ? 1 : 0,
      Number(state.score?.red || 0),
      Number(state.score?.blue || 0),
      q(state.ball.x),
      q(state.ball.y),
      q(state.ball.vx),
      q(state.ball.vy),
      players
    ];
    this.frames.push(frame);
    if (this.virtualTimeMs - this.lastReportAt >= REPORT_INTERVAL_MS) {
      this.captureReport(state.score);
      this.lastReportAt = this.virtualTimeMs;
    }
    this.virtualTimeMs += SAMPLE_INTERVAL_MS;
  }

  captureGoalMarker(goalInfo, score = {}) {
    if (!goalInfo) return;
    const key = `${goalInfo.side || ''}:${goalInfo.scorerId || goalInfo.scorerName || ''}:${score.red || 0}:${score.blue || 0}`;
    if (!key || key === this.lastGoalKey) return;
    this.lastGoalKey = key;
    this.markers.push({
      t: this.virtualTimeMs,
      type: 'goal',
      label: goalInfo.ownGoal
        ? `Gol contra de ${goalInfo.scorerName || 'Jogador'}`
        : `Gol de ${goalInfo.scorerName || 'Jogador'}`
    });
  }

  captureImportantMarker(state) {
    if (this.virtualTimeMs - this.lastImportantMarkerAt < 1200) return;
    const effects = Array.isArray(state.soundEffects) ? state.soundEffects : [];
    if (!effects.includes('power')) return;
    this.lastImportantMarkerAt = this.virtualTimeMs;
    this.markers.push({
      t: this.virtualTimeMs,
      type: 'power',
      label: 'Super chute'
    });
  }

  captureReport(score = {}) {
    const stats = this.players.map(player => {
      const values = compactStats(this.latestStats.get(player.id) || {});
      return [this.playerIndexes.get(player.id), ...values];
    });
    this.reports.push([this.virtualTimeMs, Number(score.red || 0), Number(score.blue || 0), stats]);
  }

  async finalize({ matchId, ownerUid, result } = {}) {
    this.active = false;
    this.captureReport(result?.score || { red: result?.scoreRed, blue: result?.scoreBlue });
    const base = {
      v: 1,
      field: this.field,
      sampleMs: SAMPLE_INTERVAL_MS,
      durationMs: Math.max(0, this.virtualTimeMs - SAMPLE_INTERVAL_MS),
      players: this.players,
      frames: this.frames,
      reports: this.reports,
      markers: this.markers
    };
    let payload = await compressText(JSON.stringify(base));
    let stride = 1;
    while (payload.data.length > MAX_RECORDING_BASE64_LENGTH && base.frames.length > 2) {
      stride *= 2;
      base.frames = base.frames.filter((_, index) => index % 2 === 0 || index === base.frames.length - 1);
      base.sampleMs = SAMPLE_INTERVAL_MS * stride;
      payload = await compressText(JSON.stringify(base));
    }
    if (payload.data.length > MAX_RECORDING_BASE64_LENGTH) {
      throw new Error('A gravação excedeu o limite seguro de 850 KB.');
    }
    return {
      ownerUid,
      matchId,
      encoding: payload.encoding,
      data: payload.data,
      encodedLength: payload.data.length,
      durationMs: base.durationMs,
      markerCount: base.markers.length,
      createdAt: new Date().toISOString()
    };
  }
}

export async function decodeMatchRecording(documentData) {
  const text = await decompressText(documentData || {});
  const compact = JSON.parse(text);
  return {
    ...compact,
    frames: (compact.frames || []).map(frame => ({
      timeMs: frame[0],
      status: frame[1] === 1 ? 'countdown' : 'playing',
      score: { red: frame[2], blue: frame[3] },
      ball: { x: uq(frame[4]), y: uq(frame[5]), vx: uq(frame[6]), vy: uq(frame[7]) },
      players: (frame[8] || []).map(player => ({
        index: player[0],
        x: uq(player[1]),
        y: uq(player[2]),
        dir: uq(player[3]),
        team: player[4],
        hasBall: player[5] === 1
      }))
    })),
    reports: (compact.reports || []).map(report => ({
      timeMs: report[0],
      score: { red: report[1], blue: report[2] },
      playerStats: (report[3] || []).map(values => {
        const player = compact.players?.[values[0]] || {};
        return { ...player, playerId: player.id, username: player.name, ...expandStats(values.slice(1)) };
      })
    }))
  };
}

export function interpolateRecordingFrame(first, second, ratio) {
  if (!first || !second || ratio <= 0) return first;
  const mix = (a, b) => Number(a || 0) + (Number(b || 0) - Number(a || 0)) * ratio;
  const nextByIndex = new Map(second.players.map(player => [player.index, player]));
  return {
    ...first,
    ball: {
      x: mix(first.ball.x, second.ball.x),
      y: mix(first.ball.y, second.ball.y),
      vx: mix(first.ball.vx, second.ball.vx),
      vy: mix(first.ball.vy, second.ball.vy)
    },
    players: first.players.map(player => {
      const next = nextByIndex.get(player.index);
      return next ? { ...player, x: mix(player.x, next.x), y: mix(player.y, next.y), dir: mix(player.dir, next.dir) } : player;
    })
  };
}
