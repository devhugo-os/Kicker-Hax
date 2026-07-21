export const CHAT_RATE_LIMIT = Object.freeze({
  maxMessages: 3,
  windowMs: 8_000,
  minimumIntervalMs: 900
});

/** Returns a bounded chat window without depending on rendering frequency. */
export function consumeChatRateLimit(current, now = Date.now(), config = CHAT_RATE_LIMIT) {
  const previous = current && typeof current === 'object' ? current : {};
  const windowStartedAt = Number(previous.windowStartedAt || 0);
  const lastAt = Number(previous.lastAt || 0);
  const insideWindow = now - windowStartedAt < config.windowMs;
  const count = insideWindow ? Number(previous.count || 0) : 0;
  const retryForInterval = Math.max(0, config.minimumIntervalMs - (now - lastAt));
  const retryForWindow = insideWindow && count >= config.maxMessages
    ? Math.max(0, config.windowMs - (now - windowStartedAt))
    : 0;
  const retryAfterMs = Math.max(retryForInterval, retryForWindow);
  if (retryAfterMs > 0) return { allowed: false, retryAfterMs, state: previous };
  return {
    allowed: true,
    retryAfterMs: 0,
    state: { windowStartedAt: insideWindow ? windowStartedAt : now, count: count + 1, lastAt: now }
  };
}
