const DAY_MS = 24 * 60 * 60 * 1000;

// Update 79 opens a fresh exact 30-day season. The UTC instant is shared by
// every browser and app regardless of timezone.
export const SEASON_ANCHOR_MS = Date.parse('2026-07-29T15:00:00.000Z');
export const SEASON_DURATION_MS = 30 * DAY_MS;
export const SEASON_ANCHOR_NUMBER = 3;

/** Retained for old migration tests and legacy cosmetic keys. */
export function getSaoPauloSeasonMonth(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit'
  }).formatToParts(date);
  const year = parts.find(part => part.type === 'year')?.value || '1970';
  const month = parts.find(part => part.type === 'month')?.value || '01';
  return `${year}-${month}`;
}

export function getSeasonInfo(date = new Date()) {
  const timestamp = Number(date instanceof Date ? date.getTime() : date);
  const cycleIndex = Math.max(0, Math.floor((timestamp - SEASON_ANCHOR_MS) / SEASON_DURATION_MS));
  const number = SEASON_ANCHOR_NUMBER + cycleIndex;
  const startsAt = SEASON_ANCHOR_MS + cycleIndex * SEASON_DURATION_MS;
  return {
    id: `season-${number}`,
    number,
    label: `Temporada ${number}`,
    startsAt,
    expiresAt: startsAt + SEASON_DURATION_MS
  };
}

/** Monthly now means the active numbered Kicker Hax competitive season. */
export function getSeasonId(cycle = 'monthly', date = new Date()) {
  if (cycle === 'monthly') return getSeasonInfo(date).id;
  return `${cycle}-${getSaoPauloSeasonMonth(date)}`;
}

export function formatSeasonCountdown(expiresAt, now = Date.now()) {
  const remaining = Math.max(0, Number(expiresAt) - Number(now));
  const days = Math.floor(remaining / DAY_MS);
  const hours = Math.floor((remaining % DAY_MS) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
  return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}
