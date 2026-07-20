/** Returns the calendar month used by Kicker Hax seasons in Sao Paulo time. */
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

/** A stable cycle prefix prevents ordinary app updates from resetting a season. */
export function getSeasonId(cycle = 'monthly', date = new Date()) {
  return `${cycle}-${getSaoPauloSeasonMonth(date)}`;
}
