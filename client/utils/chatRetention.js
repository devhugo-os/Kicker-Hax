const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns the current 00:00-23:59 retention window in Sao Paulo. */
export function getSaoPauloChatDayWindow(now = new Date()) {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now);
  const startsAt = Date.parse(`${day}T00:00:00-03:00`);
  return { startsAt, endsAt: startsAt + DAY_MS };
}
