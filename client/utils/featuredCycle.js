const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

// Update 30 starts every showcase at midnight in Sao Paulo. Weekly and
// four-week cycles remain deterministic for every browser and app timezone.
export const FEATURE_CYCLE_ANCHOR_MS = Date.parse('2026-07-14T03:00:00.000Z');
export const FEATURE_CYCLE_DURATIONS = {
  hourly: HOUR_MS,
  daily: DAY_MS,
  weekly: 7 * DAY_MS,
  monthly: 28 * DAY_MS
};

export function getFeaturedCycle(cadence, date = new Date()) {
  const duration = FEATURE_CYCLE_DURATIONS[cadence];
  if (!duration) throw new Error(`Cadencia de destaque invalida: ${cadence}`);
  const timestamp = Number(date instanceof Date ? date.getTime() : date);
  const cycleIndex = Math.max(0, Math.floor((timestamp - FEATURE_CYCLE_ANCHOR_MS) / duration));
  const startsAt = FEATURE_CYCLE_ANCHOR_MS + (cycleIndex * duration);
  const expiresAt = startsAt + duration;
  const cycleDate = new Date(startsAt);
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(cycleDate);
  const hour = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo', hour: '2-digit', hourCycle: 'h23'
  }).format(cycleDate);
  const period = cadence === 'hourly' ? `${day}_${hour}_${cadence}` : `${day}_${cadence}`;
  return { cadence, period, startsAt, expiresAt, cycleIndex };
}

export function formatFeaturedTimeLeft(expiresAt, now = Date.now()) {
  const remaining = Math.max(0, Number(expiresAt || 0) - Number(now));
  if (remaining <= 0) return 'troca em instantes';
  const totalHours = Math.ceil(remaining / (60 * 60 * 1000));
  if (totalHours <= 24) return `troca em ${totalHours}h`;
  return `troca em ${Math.ceil(totalHours / 24)}d`;
}
