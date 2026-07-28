import * as C from '../../shared/constants.js';

const FRAME_MS = 1000 / 60;
const MAX_ROLLBACK_FRAMES = 10;

function normalizeInput(input = {}) {
  const x = Number(input.x || 0);
  const y = Number(input.y || 0);
  const length = Math.hypot(x, y);
  if (length <= 0.001) return { x: 0, y: 0, moving: false, sprint: false };
  return {
    x: x / length,
    y: y / length,
    moving: true,
    sprint: !!input.sprint
  };
}

function inputForFrame(inputs, frameTime, fallback) {
  let selected = fallback;
  for (const pending of inputs) {
    if (Number(pending.sentAt || 0) > frameTime) break;
    selected = pending.input || selected;
  }
  return selected;
}

/**
 * Replays only inputs that the authoritative host has not acknowledged yet.
 * This is a bounded visual rollback: collisions remain host-owned, while the
 * local player receives immediate movement and converges without teleporting.
 */
export function projectUnacknowledgedMovement(authoritative = {}, prediction = {}, now = performance.now()) {
  const inputs = Array.isArray(prediction.pendingInputs)
    ? prediction.pendingInputs.slice(-12).sort((a, b) => Number(a.sentAt || 0) - Number(b.sentAt || 0))
    : [];
  const oldestAgeMs = inputs.length
    ? Math.max(0, Number(prediction.wallNow || Date.now()) - Number(inputs[0].sentAt || prediction.wallNow || Date.now()))
    : 0;
  const requestedFrames = Math.max(
    Number(prediction.networkDelayFrames || 0),
    oldestAgeMs / FRAME_MS
  );
  const frames = Math.max(0, Math.min(MAX_ROLLBACK_FRAMES, Math.ceil(requestedFrames)));
  if (frames === 0) {
    return {
      x: Number(authoritative.x || 0),
      y: Number(authoritative.y || 0),
      vx: Number(authoritative.vx || 0),
      vy: Number(authoritative.vy || 0)
    };
  }

  let x = Number(authoritative.x || 0);
  let y = Number(authoritative.y || 0);
  let vx = Number(authoritative.vx || 0);
  let vy = Number(authoritative.vy || 0);
  const frameStart = Number(prediction.wallNow || Date.now()) - frames * FRAME_MS;
  for (let index = 0; index < frames; index += 1) {
    const input = normalizeInput(inputForFrame(
      inputs,
      frameStart + index * FRAME_MS,
      prediction.input || {}
    ));
    const canSprint = input.sprint
      && Number(authoritative.staminaLock || 0) <= 0
      && Number(authoritative.stamina ?? 1) > 0;
    const targetSpeed = input.moving ? C.MAX_SPEED * 1.2 * (canSprint ? 1.5 : 1) : 0;
    const response = input.moving ? 0.22 : 0.18;
    vx += ((input.x * targetSpeed) - vx) * response;
    vy += ((input.y * targetSpeed) - vy) * response;
    x += vx;
    y += vy;
  }

  return { x, y, vx, vy, projectedAt: now };
}

/**
 * Reconciles a predicted position without oscillation. Large errors snap once;
 * ordinary network corrections are spread over a few rendered frames.
 */
export function reconcilePredictedPosition(current, projected, lerpFactor, elapsedFrames = 1) {
  const error = Math.hypot(projected.x - current.x, projected.y - current.y);
  if (error > 180) return { x: projected.x, y: projected.y, snapped: true, error };
  const adaptive = error > 55
    ? Math.max(lerpFactor, 0.5)
    : error > 18 ? Math.max(lerpFactor, 0.34) : lerpFactor;
  const correction = 1 - Math.pow(1 - adaptive, Math.max(0.25, elapsedFrames));
  return {
    x: current.x + (projected.x - current.x) * correction,
    y: current.y + (projected.y - current.y) * correction,
    snapped: false,
    error
  };
}
