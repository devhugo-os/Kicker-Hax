export function getCompetitiveWinRate(player) {
  const matches = Math.max(0, Number(player?.matchesPlayed || 0));
  const wins = Math.max(0, Number(player?.wins || 0));
  return matches > 0 ? wins / matches : 0;
}

/**
 * Wilson lower bound keeps the visible percentage honest while ranking it
 * with sample confidence. A perfect debut no longer outranks a proven season.
 */
export function getWinRateConfidenceScore(player) {
  const matches = Math.max(0, Number(player?.matchesPlayed || 0));
  if (matches === 0) return 0;
  const rate = getCompetitiveWinRate(player);
  const z = 2.15;
  const zSquared = z * z;
  const center = rate + (zSquared / (2 * matches));
  const margin = z * Math.sqrt(((rate * (1 - rate)) + (zSquared / (4 * matches))) / matches);
  return (center - margin) / (1 + (zSquared / matches));
}

export function getPossessionAverage(player) {
  const matches = Math.max(0, Number(player?.possessionMatches ?? player?.matchesPlayed ?? 0));
  const explicitAverage = Number(player?.possessionAvg);
  if (Number.isFinite(explicitAverage)) return Math.min(100, Math.max(0, explicitAverage));
  return matches > 0
    ? Math.min(100, Math.max(0, Number(player?.possessionTotal || 0) / matches))
    : 0;
}

/**
 * Uses a twenty-match neutral baseline. Possession is a continuous value, so
 * it needs stronger sample protection than binary wins/losses: a single 90%
 * match must not outrank a player sustaining 60% across ten matches.
 */
export function getPossessionConfidenceScore(player) {
  const matches = Math.max(0, Number(player?.possessionMatches ?? player?.matchesPlayed ?? 0));
  if (matches === 0) return 0;
  const priorMatches = 28;
  return ((getPossessionAverage(player) * matches) + (50 * priorMatches)) / (matches + priorMatches);
}

export function getAverageMatchRating(player) {
  const matches = Math.max(0, Number(player?.ratingMatches || 0));
  const explicitAverage = Number(player?.ratingAvg);
  if (Number.isFinite(explicitAverage)) return Math.min(10, Math.max(0, explicitAverage));
  return matches > 0
    ? Math.min(10, Math.max(0, Number(player?.ratingTotal || 0) / matches))
    : 0;
}

/** Pulls a small rating sample toward 5.0 until the player proves consistency. */
export function getRatingConfidenceScore(player) {
  const matches = Math.max(0, Number(player?.ratingMatches || 0));
  if (matches === 0) return 0;
  const priorMatches = 12;
  return ((getAverageMatchRating(player) * matches) + (5 * priorMatches)) / (matches + priorMatches);
}

/**
 * Produces a FIFA-style 40-99 card rating from competitive per-match output.
 * Ten matches provide full confidence; before that, the rating is pulled
 * toward 50 so one exceptional debut cannot dominate the global ranking.
 */
export function calculateOverallRating(player) {
  const matches = Math.max(0, Number(player?.matchesPlayed || 0));
  if (matches === 0) return 0;
  const perMatch = value => Math.max(0, Number(value || 0)) / matches;
  const cap = (value, maximum) => Math.min(1, Math.max(0, value / maximum));
  const winRate = getCompetitiveWinRate(player);
  const accuracy = Number(player?.shots || 0) > 0
    ? Math.min(1, Number(player?.goals || 0) / Number(player.shots))
    : 0;
  const matchRating = getRatingConfidenceScore(player);
  const ratingQuality = matchRating > 0 ? cap(matchRating - 1, 9) : 0;
  const lossRate = Math.max(0, Number(player?.losses || 0)) / matches;
  const wasteRate = Number(player?.shots || 0) > 0 ? 1 - accuracy : 0;
  const performance =
    (ratingQuality * 30)
    + (getWinRateConfidenceScore(player) * 24)
    + (cap(perMatch(player?.goals), 1.4) * 9)
    + (cap(perMatch(player?.assists), .9) * 8)
    + (cap(perMatch(player?.tackles), 4) * 8)
    + (cap(perMatch(player?.dribbles), 3.5) * 5)
    + (cap(getPossessionConfidenceScore(player) - 35, 30) * 5)
    + (accuracy * 5)
    + (cap(perMatch(player?.mvps), .45) * 6)
    - (cap(perMatch(player?.ownGoals), .35) * 7)
    - (lossRate * 4)
    - (wasteRate * 3);
  const rawRating = 35 + (performance * .64);
  const confidence = Math.min(1, matches / 16);
  return Math.round(Math.min(99, Math.max(40, 48 + ((rawRating - 48) * confidence))));
}

export function compareOverallRanking(a, b) {
  const ratingDifference = calculateOverallRating(b) - calculateOverallRating(a);
  if (ratingDifference) return ratingDifference;
  const rateDifference = getCompetitiveWinRate(b) - getCompetitiveWinRate(a);
  if (Math.abs(rateDifference) > Number.EPSILON) return rateDifference;
  if ((b.wins || 0) !== (a.wins || 0)) return (b.wins || 0) - (a.wins || 0);
  if ((b.matchesPlayed || 0) !== (a.matchesPlayed || 0)) return (b.matchesPlayed || 0) - (a.matchesPlayed || 0);
  if ((b.mvps || 0) !== (a.mvps || 0)) return (b.mvps || 0) - (a.mvps || 0);
  if ((b.goals || 0) !== (a.goals || 0)) return (b.goals || 0) - (a.goals || 0);
  return String(a.uid || '').localeCompare(String(b.uid || ''));
}

export function compareWinRateRanking(a, b) {
  const confidenceDifference = getWinRateConfidenceScore(b) - getWinRateConfidenceScore(a);
  if (Math.abs(confidenceDifference) > Number.EPSILON) return confidenceDifference;
  const rateDifference = getCompetitiveWinRate(b) - getCompetitiveWinRate(a);
  if (Math.abs(rateDifference) > Number.EPSILON) return rateDifference;
  if ((b.matchesPlayed || 0) !== (a.matchesPlayed || 0)) return (b.matchesPlayed || 0) - (a.matchesPlayed || 0);
  if ((b.wins || 0) !== (a.wins || 0)) return (b.wins || 0) - (a.wins || 0);
  const headToHead = Number(b?.headToHead?.[a?.uid] || 0) - Number(a?.headToHead?.[b?.uid] || 0);
  if (headToHead) return headToHead;
  const recent = Number(b?.recentPerformance || 0) - Number(a?.recentPerformance || 0);
  if (Math.abs(recent) > Number.EPSILON) return recent;
  return String(a.uid || '').localeCompare(String(b.uid || ''));
}

export function comparePossessionRanking(a, b) {
  const confidenceDifference = getPossessionConfidenceScore(b) - getPossessionConfidenceScore(a);
  if (Math.abs(confidenceDifference) > Number.EPSILON) return confidenceDifference;
  const averageDifference = getPossessionAverage(b) - getPossessionAverage(a);
  if (Math.abs(averageDifference) > Number.EPSILON) return averageDifference;
  const aMatches = Number(a?.possessionMatches ?? a?.matchesPlayed ?? 0);
  const bMatches = Number(b?.possessionMatches ?? b?.matchesPlayed ?? 0);
  if (bMatches !== aMatches) return bMatches - aMatches;
  const recent = Number(b?.recentPerformance || 0) - Number(a?.recentPerformance || 0);
  if (Math.abs(recent) > Number.EPSILON) return recent;
  return String(a.uid || '').localeCompare(String(b.uid || ''));
}

export function compareRatingRanking(a, b) {
  const confidenceDifference = getRatingConfidenceScore(b) - getRatingConfidenceScore(a);
  if (Math.abs(confidenceDifference) > Number.EPSILON) return confidenceDifference;
  const averageDifference = getAverageMatchRating(b) - getAverageMatchRating(a);
  if (Math.abs(averageDifference) > Number.EPSILON) return averageDifference;
  const matchDifference = Number(b?.ratingMatches || 0) - Number(a?.ratingMatches || 0);
  if (matchDifference) return matchDifference;
  const recent = Number(b?.recentPerformance || 0) - Number(a?.recentPerformance || 0);
  if (Math.abs(recent) > Number.EPSILON) return recent;
  return String(a.uid || '').localeCompare(String(b.uid || ''));
}
