/** Pure replay helpers kept separate so the whole feature can be removed safely. */
export function getSynchronizedReplayStart(replayStartAt, serverClockOffsetMs = 0, fallbackNow = Date.now()) {
  const serverTarget = Number(replayStartAt);
  return Number.isFinite(serverTarget) && serverTarget > 0
    ? serverTarget - Number(serverClockOffsetMs || 0)
    : fallbackNow;
}

/** Estimates host clock skew without adding the one-way network delay. */
export function estimateServerClockOffset(sentAt, receivedAt, serverTime) {
  const sent = Number(sentAt);
  const received = Number(receivedAt);
  const server = Number(serverTime);
  if (![sent, received, server].every(Number.isFinite) || received < sent) return null;
  return server - ((sent + received) / 2);
}

export function getReplayPosition(startedAtWall, frameMs, frameCount, now = Date.now(), holdMs = 0) {
  const safeFrameMs = Math.max(1, Number(frameMs) || 1);
  const elapsedMs = Math.max(0, Number(now) - Number(startedAtWall || now));
  const position = elapsedMs / safeFrameMs;
  return {
    elapsedMs,
    position,
    index: Math.min(Math.max(0, frameCount - 1), Math.floor(position)),
    ratio: position - Math.floor(position),
    holding: position >= frameCount && elapsedMs < (frameCount * safeFrameMs) + Math.max(0, Number(holdMs) || 0),
    ended: elapsedMs >= (frameCount * safeFrameMs) + Math.max(0, Number(holdMs) || 0)
  };
}

export function interpolateReplayFrame(first, second, ratio = 0) {
  if (!first || !second || ratio <= 0) return first;
  const mix = (a, b) => Number(a || 0) + (Number(b || 0) - Number(a || 0)) * ratio;
  const nextPlayers = new Map((second.players || []).map(player => [player.id, player]));
  return {
    ...first,
    ball: {
      ...first.ball,
      x: mix(first.ball?.x, second.ball?.x),
      y: mix(first.ball?.y, second.ball?.y),
      vx: mix(first.ball?.vx, second.ball?.vx),
      vy: mix(first.ball?.vy, second.ball?.vy),
      strikeTimer: mix(first.ball?.strikeTimer, second.ball?.strikeTimer),
      lastStrikeType: ratio >= 0.5 ? second.ball?.lastStrikeType : first.ball?.lastStrikeType
    },
    players: (first.players || []).map(player => {
      const next = nextPlayers.get(player.id);
      return next ? {
        ...player,
        x: mix(player.x, next.x),
        y: mix(player.y, next.y),
        dir: mix(player.dir, next.dir),
        vx: mix(player.vx, next.vx),
        vy: mix(player.vy, next.vy),
        halo: mix(player.halo, next.halo)
      } : player;
    })
  };
}
