const SAMPLE_INTERVAL_MS = 50;
const REPORT_INTERVAL_MS = 1000;
export const MAX_RECORDING_BASE64_LENGTH = 850_000;
const RECORDABLE_STATUSES = new Set(['loading', 'playing', 'countdown', 'freeze']);
const GOAL_FREEZE_RECORDING_MS = 2000;

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
 * Records authoritative snapshots as a compact demo. The replay itself is
 * omitted, while the first two seconds after a goal and kickoff countdown are
 * retained to reproduce the match flow without storing the same play twice.
 */
export class MatchRecordingSession {
  constructor({ fieldWidth = 1024, fieldHeight = 640, players = [] } = {}) {
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
    this.lastSoundKey = '';
    this.virtualTimeMs = 0;
    this.freezeKey = '';
    this.freezeRecordedMs = 0;
    this.lastStatus = '';
    this.active = true;
    players.forEach(player => this.ensurePlayer({
      ...player,
      id: player.id,
      name: player.username || player.name,
      skin: player.skin,
      badge: player.badge,
      staffRole: player.staffRole
    }));
  }

  ensurePlayer(player = {}) {
    const id = String(player.id || player.playerId || '');
    const uid = String(player.uid || '');
    const stableKey = uid ? `uid:${uid}` : (id ? `id:${id}` : '');
    if (!stableKey) return -1;
    let index = this.playerIndexes.get(stableKey);
    if (index === undefined && uid) index = this.players.findIndex(item => item.uid === uid);
    if (index === undefined || index < 0) {
      index = this.players.length;
      this.players.push({
        id,
        uid,
        name: String(player.name || player.username || 'Jogador').slice(0, 20),
        team: player.team,
        badge: String(player.badge || ''),
        // Embedded skins are resolved by id when playback opens. Keeping them
        // out of every demo prevents one custom image from exceeding Firestore.
        skin: /^(data:image\/|custom$)/i.test(String(player.skin || '')) ? '' : String(player.skin || ''),
        skinId: String(player.skinId || player.equippedSkinId || ''),
        staffRole: String(player.staffRole || '')
      });
    } else {
      const existing = this.players[index];
      if (id) existing.id = id;
      if (player.name || player.username) existing.name = String(player.name || player.username).slice(0, 20);
      if (uid) existing.uid = uid;
      if (player.team !== undefined) existing.team = player.team;
      if (player.badge) existing.badge = String(player.badge);
      if (player.skin && player.skin !== 'custom' && !String(player.skin).startsWith('data:image/')) existing.skin = String(player.skin);
      if (player.skinId || player.equippedSkinId) existing.skinId = String(player.skinId || player.equippedSkinId);
      if (player.staffRole) existing.staffRole = String(player.staffRole);
    }
    this.playerIndexes.set(stableKey, index);
    if (id) this.playerIndexes.set(`id:${id}`, index);
    if (uid) this.playerIndexes.set(`uid:${uid}`, index);
    if (player.matchStats) this.latestStats.set(index, { ...this.latestStats.get(index), ...player.matchStats });
    return index;
  }

  capture(state, now = performance.now()) {
    if (!this.active || !state?.ball || !Array.isArray(state.players)) return;
    if (!RECORDABLE_STATUSES.has(state.status)) {
      // Excluded replay time must not leak into the following countdown.
      this.lastCapturedAt = now;
      return;
    }
    // Sound arrays are transient server events and may disappear before the
    // next visual sample, so capture their markers before frame throttling.
    this.captureGoalMarker(state.goalInfo, state.score);
    this.captureImportantMarker(state);
    this.captureSoundMarkers(state.soundEffects);
    const statusChanged = this.lastStatus && this.lastStatus !== state.status;
    if (!statusChanged && this.lastCapturedAt && now - this.lastCapturedAt < SAMPLE_INTERVAL_MS) return;
    let elapsedMs = this.frames.length
      ? Math.max(16, Math.min(1000, now - this.lastCapturedAt))
      : 0;
    this.lastCapturedAt = now;
    this.lastStatus = state.status;
    if (state.status === 'freeze') {
      const freezeKey = `${state.score?.red || 0}:${state.score?.blue || 0}`;
      if (freezeKey !== this.freezeKey) {
        this.freezeKey = freezeKey;
        this.freezeRecordedMs = 0;
      }
      if (this.freezeRecordedMs >= GOAL_FREEZE_RECORDING_MS) return;
      elapsedMs = Math.min(elapsedMs || SAMPLE_INTERVAL_MS, GOAL_FREEZE_RECORDING_MS - this.freezeRecordedMs);
      this.freezeRecordedMs += elapsedMs;
    } else {
      this.freezeKey = '';
      this.freezeRecordedMs = 0;
    }
    this.virtualTimeMs += elapsedMs;
    const players = state.players.map(player => {
      const index = this.ensurePlayer(player);
      const showActionEffects = state.status === 'playing';
      return [
        index, q(player.x), q(player.y), q(player.dir), Number(player.team),
        state.ball.owner === player.id ? 1 : 0,
        [showActionEffects ? Number(player.shootHalo || 0) : 0,
          showActionEffects && player.tackle_cd > 0 ? 1 : 0,
          showActionEffects && player.dribble_cd > 0 ? 1 : 0,
          showActionEffects ? Number(player.stun || 0) : 0]
      ];
    }).filter(player => player[0] >= 0);
    const paused = !!state.isHostPaused || !!state.isDisconnectPaused;
    const pauseMessage = state.isDisconnectPaused
      ? `${state.disconnectedPlayerName || 'Jogador'} ${state.isDisconnectVoting ? 'nao voltou. Decidam se o time continua' : 'saiu. Aguardando retorno'}`
      : (state.isHostPaused ? 'Partida pausada pelo host' : '');
    const frame = [
      this.virtualTimeMs,
      state.status === 'loading' ? 4 : (paused ? 2 : (state.status === 'countdown' ? 1 : (state.status === 'freeze' ? 3 : 0))),
      Number(state.score?.red || 0),
      Number(state.score?.blue || 0),
      q(state.ball.x),
      q(state.ball.y),
      q(state.ball.vx),
      q(state.ball.vy),
      players,
      Number(state.matchTime || 0),
      Number(state.countdown || 0),
      state.status === 'playing' && state.ball.lastStrikeType === 'power' ? 1 : 0,
      state.status === 'playing' ? Number(state.ball.strikeTimer || 0) : 0,
      pauseMessage,
      Number(state.disconnectPauseRemaining || 0),
      state.isDisconnectVoting ? 1 : 0,
      state.goalInfo
        ? [String(state.goalInfo.scorerName || 'Jogador'), state.goalInfo.ownGoal ? 1 : 0,
          String(state.goalInfo.assistName || '')]
        : null,
      Number(state.continueVotes || 0),
      Number(state.continueVotesRequired || 0),
      state.disconnectAllowsRejoin === false ? 0 : 1
    ];
    this.frames.push(frame);
    if (this.virtualTimeMs - this.lastReportAt >= REPORT_INTERVAL_MS) {
      this.captureReport(state.score);
      this.lastReportAt = this.virtualTimeMs;
    }
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

  captureSoundMarkers(effects = []) {
    const sounds = Array.isArray(effects) ? effects : [];
    const batchKey = `${this.virtualTimeMs}:${sounds.join(',')}`;
    if (!sounds.length || batchKey === this.lastSoundKey) return;
    this.lastSoundKey = batchKey;
    sounds.forEach(kind => {
      this.markers.push({ t: this.virtualTimeMs, type: 'sound', sound: String(kind), label: String(kind) });
    });
  }

  captureReport(score = {}) {
    const stats = this.players.map((player, index) => {
      const values = compactStats(this.latestStats.get(index) || {});
      return [index, ...values];
    });
    this.reports.push([this.virtualTimeMs, Number(score.red || 0), Number(score.blue || 0), stats]);
  }

  async finalize({ matchId, ownerUid, result } = {}) {
    this.active = false;
    this.captureReport(result?.score || { red: result?.scoreRed, blue: result?.scoreBlue });
    const base = {
      v: 8,
      field: this.field,
      sampleMs: SAMPLE_INTERVAL_MS,
      durationMs: Math.max(0, this.virtualTimeMs),
      players: this.players,
      frames: this.frames,
      reports: this.reports,
      markers: this.markers,
      endReason: result?.forfeit ? 'wo' : 'normal'
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
      recordingVersion: 8,
      competitive: true,
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
      status: frame[1] === 4 ? 'loading' : (frame[1] === 3 ? 'freeze' : (frame[1] === 2 ? 'paused' : (frame[1] === 1 ? 'countdown' : 'playing'))),
      score: { red: frame[2], blue: frame[3] },
      ball: {
        x: uq(frame[4]), y: uq(frame[5]), vx: uq(frame[6]), vy: uq(frame[7]),
        lastStrikeType: frame[11] === 1 ? 'power' : null,
        strikeTimer: Number(frame[12] || 0)
      },
      matchTime: Number(frame[9] || 0),
      countdown: Number(frame[10] || 0),
      pauseMessage: String(frame[13] || ''),
      disconnectPauseRemaining: Number(frame[14] || 0),
      isDisconnectVoting: frame[15] === 1,
      goalInfo: frame[16] ? {
        scorerName: String(frame[16][0] || 'Jogador'),
        ownGoal: frame[16][1] === 1,
        assistName: String(frame[16][2] || '')
      } : null,
      continueVotes: Number(frame[17] || 0),
      continueVotesRequired: Number(frame[18] || 0),
      disconnectAllowsRejoin: frame[19] !== 0,
      players: (frame[8] || []).map(player => ({
        index: player[0],
        x: uq(player[1]),
        y: uq(player[2]),
        dir: uq(player[3]),
        team: player[4],
        hasBall: player[5] === 1,
        shootHalo: Number(player[6]?.[0] || 0),
        tackling: player[6]?.[1] === 1,
        dribbling: player[6]?.[2] === 1,
        stun: Number(player[6]?.[3] || 0)
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
  // The transition into the scored freeze is continuous: the ball still has
  // to travel into the net. Other phase changes intentionally teleport to a
  // kickoff/loading position and must not be blended.
  if (first.status !== second.status && second.status !== 'freeze') return first;
  const mix = (a, b) => Number(a || 0) + (Number(b || 0) - Number(a || 0)) * ratio;
  const nextByIndex = new Map(second.players.map(player => [player.index, player]));
  return {
    ...first,
    matchTime: mix(first.matchTime, second.matchTime),
    countdown: mix(first.countdown, second.countdown),
    ball: {
      ...first.ball,
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
