function normalizedOverall(player) {
  return Math.max(40, Math.min(99, Number(player?.overall) || 40));
}

/**
 * Distributes stronger players first to the currently weaker eligible team.
 * Team sizes remain equal, or differ by one when the player count is odd.
 */
export function balancePlayersByOverall(players = [], random = Math.random) {
  const ordered = players
    .map(player => ({ player, tieBreaker: random() }))
    .sort((a, b) => normalizedOverall(b.player) - normalizedOverall(a.player) || a.tieBreaker - b.tieBreaker)
    .map(entry => entry.player);
  const redGetsExtra = random() < 0.5;
  const limits = {
    red: Math.floor(ordered.length / 2) + (ordered.length % 2 && redGetsExtra ? 1 : 0),
    blue: Math.floor(ordered.length / 2) + (ordered.length % 2 && !redGetsExtra ? 1 : 0)
  };
  const totals = { red: 0, blue: 0 };
  const counts = { red: 0, blue: 0 };
  const assignments = new Map();

  ordered.forEach(player => {
    let team;
    if (counts.red >= limits.red) team = 'blue';
    else if (counts.blue >= limits.blue) team = 'red';
    else if (totals.red !== totals.blue) team = totals.red < totals.blue ? 'red' : 'blue';
    else if (counts.red !== counts.blue) team = counts.red < counts.blue ? 'red' : 'blue';
    else team = random() < 0.5 ? 'red' : 'blue';
    assignments.set(player.id, team);
    counts[team] += 1;
    totals[team] += normalizedOverall(player);
  });

  return { assignments, totals, counts };
}
