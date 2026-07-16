import { calculateMatchRating } from '../../shared/matchReport.js';
import { getMatchParticipantUids } from './matchHistory.js';

export function safeResultMatchId(match) {
  return String(match?.matchId || match?.id || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
}

/** Adds only competitive history receipts missing from persisted season stats. */
export function mergeCompetitiveHistoryStats(stored, history, uid) {
  const merged = {
    ...stored,
    processedMatchIds: { ...(stored.processedMatchIds || {}) },
    processedRatingMatchIds: { ...(stored.processedRatingMatchIds || {}) }
  };
  (history || []).filter(match => match.competitive || match.category === 'competitive').forEach(match => {
    const matchId = safeResultMatchId(match);
    if (!matchId) return;
    const team = match.playerTeams?.[uid];
    if (team === undefined || team === null || team === 'spectator') return;
    const isDraw = match.winner === 'draw';
    const isWin = !isDraw && String(team) === String(match.winner);
    const player = (match.playerStats || []).find(item => item.uid === uid) || {};
    if (!merged.processedRatingMatchIds[matchId]) {
      const rating = Number(player.rating || calculateMatchRating({ ...player, team }, match.winner));
      merged.ratingTotal = (merged.ratingTotal || 0) + Math.max(1, Math.min(10, rating));
      merged.ratingMatches = (merged.ratingMatches || 0) + 1;
      merged.processedRatingMatchIds[matchId] = true;
    }
    if (merged.processedMatchIds[matchId]) return;
    merged.matchesPlayed = (merged.matchesPlayed || 0) + 1;
    merged.wins = (merged.wins || 0) + (isWin ? 1 : 0);
    merged.losses = (merged.losses || 0) + (!isDraw && !isWin ? 1 : 0);
    merged.draws = (merged.draws || 0) + (isDraw ? 1 : 0);
    merged.goals = (merged.goals || 0) + (player.goals || 0);
    merged.assists = (merged.assists || 0) + (player.assists || 0);
    merged.shots = (merged.shots || 0) + (player.shots || 0);
    merged.dribbles = (merged.dribbles || 0) + (player.dribbles || 0);
    merged.ownGoals = (merged.ownGoals || 0) + (player.ownGoals || 0);
    merged.tackles = (merged.tackles || 0) + (player.tackles || 0);
    merged.mvps = (merged.mvps || 0) + ((match.mvp?.uid === uid || match.mvpUid === uid) ? 1 : 0);
    merged.possessionTotal = (merged.possessionTotal || 0) + (player.possessionPct || 0);
    merged.possessionMatches = (merged.possessionMatches || 0) + 1;
    merged.processedMatchIds[matchId] = true;
  });
  return merged;
}

/** Groups current-season receipts once so ranking never issues one query per user. */
export function groupSeasonHistoryByUid(history, seasonId) {
  const grouped = new Map();
  (history || []).forEach(match => {
    if (match?.seasonId !== seasonId) return;
    getMatchParticipantUids(match).forEach(uid => {
      if (!uid) return;
      if (!grouped.has(uid)) grouped.set(uid, []);
      grouped.get(uid).push(match);
    });
  });
  return grouped;
}
