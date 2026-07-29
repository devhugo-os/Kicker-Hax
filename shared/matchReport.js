import { Team } from './constants.js';

const TEAM_KEYS = [Team.RED, Team.BLUE];
const STAT_KEYS = ['goals', 'assists', 'ownGoals', 'shots', 'dribbles', 'tackles'];

export function normalizeReportTeam(team) {
  if (team === 'red') return Team.RED;
  if (team === 'blue') return Team.BLUE;
  return team;
}

/** Produces a stable 1-10 match rating from the player's contribution. */
export function calculateMatchRating(stats = {}, winnerTeam = 'draw', score = {}) {
  const team = normalizeReportTeam(stats.team);
  const won = winnerTeam !== 'draw' && team === normalizeReportTeam(winnerTeam);
  const lost = winnerTeam !== 'draw' && !won;
  const teamScore = team === Team.RED ? Number(score.red || 0) : Number(score.blue || 0);
  const opponentScore = team === Team.RED ? Number(score.blue || 0) : Number(score.red || 0);
  const goalDifference = Math.min(6, Math.abs(teamScore - opponentScore));
  // The result matters, but it must not erase a large individual performance
  // gap. Similar players are separated by the result; a standout loser can
  // only lead the report by also becoming the match MVP.
  const resultImpact = won ? 0.78 + goalDifference * 0.08 : lost ? -0.9 - goalDifference * 0.12 : 0.05;
  const possessionPct = Math.max(0, Math.min(100, Number(stats.possessionPct || 0)));
  const expectedPossession = Math.max(10, Math.min(50, Number(stats.expectedPossessionPct || 50)));
  // Possession is both a reward and a penalty: disappearing from the match
  // must lower the rating instead of every statistic only accumulating points.
  const possessionImpact = Math.max(-1.05, Math.min(.75, (possessionPct - expectedPossession) * 0.025));
  const shots = Math.max(0, Number(stats.shots || 0));
  const goals = Math.max(0, Number(stats.goals || 0));
  const missedShots = Math.max(0, shots - goals);
  const shotAccuracy = shots > 0 ? goals / shots : 0;
  // A lead is not a permanent rating shield. Repeated wasteful attempts and
  // prolonged low involvement can lower the live score even while the team is
  // winning, so the number reflects the current performance rather than only
  // accumulating positive events.
  const wastePenalty = shots >= 2
    ? Math.min(1.15, missedShots * (shotAccuracy < .25 ? .16 : .1))
    : missedShots * .08;
  const statusPenalty = {
    spectator: .45,
    switched: .25,
    disconnected: 1.2,
    kicked: 1.8,
    banned: 2,
    abandoned: 2.1
  }[stats.participationStatus] || 0;
  const leftPenalty = Math.max(stats.leftMatch ? 1.1 : 0, statusPenalty);
  const involvement = goals + Number(stats.assists || 0) + Number(stats.tackles || 0)
    + Number(stats.dribbles || 0) + shots;
  const inactivityPenalty = involvement === 0 && possessionPct < expectedPossession * .55 ? .65 : 0;
  const raw = 5.0
    + resultImpact
    + (goals * 1.2)
    + (Number(stats.assists || 0) * 0.65)
    + (Math.min(10, Number(stats.tackles || 0)) * 0.14)
    + (Math.min(12, Number(stats.dribbles || 0)) * 0.08)
    - wastePenalty
    // An own goal matters, but one accidental touch must not erase an otherwise
    // strong match. Repeated own goals still accumulate a meaningful penalty.
    - (Number(stats.ownGoals || 0) * 0.85)
    - leftPenalty
    - inactivityPenalty
    + possessionImpact;
  // A great individual performance can soften a loss, but cannot receive a
  // perfect score while the team was defeated.
  const upperBound = lost ? Math.max(6.8, 7.6 - goalDifference * 0.12) : 10;
  return Math.round(Math.max(1, Math.min(upperBound, raw)) * 10) / 10;
}

export function buildTeamStats(playerStats = [], score = {}) {
  const teams = Object.fromEntries(TEAM_KEYS.map(team => [team, {
    team,
    score: team === Team.RED ? Number(score.red || 0) : Number(score.blue || 0),
    players: 0,
    possessionPct: 0,
    goals: 0,
    assists: 0,
    ownGoals: 0,
    shots: 0,
    dribbles: 0,
    tackles: 0
  }]));

  playerStats.forEach(player => {
    const team = normalizeReportTeam(player.team);
    const aggregate = teams[team];
    if (!aggregate) return;
    aggregate.players += 1;
    aggregate.possessionPct += Number(player.possessionPct || 0);
    STAT_KEYS.forEach(key => { aggregate[key] += Number(player[key] || 0); });
  });

  TEAM_KEYS.forEach(team => {
    teams[team].possessionPct = Math.max(0, Math.min(100, Math.round(teams[team].possessionPct)));
  });
  return teams;
}

/** Enriches new and legacy results with ratings and aggregate team stats. */
export function buildMatchReport(result = {}) {
  const score = result.score || { red: result.scoreRed || 0, blue: result.scoreBlue || 0 };
  const winnerTeam = result.winnerTeam ?? result.winner ?? (
    Number(score.red || 0) === Number(score.blue || 0)
      ? 'draw'
      : Number(score.red || 0) > Number(score.blue || 0) ? Team.RED : Team.BLUE
  );
  const sourcePlayers = result.playerStats || [];
  const expectedPossessionPct = sourcePlayers.length > 0 ? 100 / sourcePlayers.length : 50;
  const playerStats = sourcePlayers.map(player => ({
    ...player,
    team: normalizeReportTeam(player.team),
    expectedPossessionPct,
    rating: Number(player.rating || calculateMatchRating({ ...player, expectedPossessionPct }, winnerTeam, score))
  }));
  const teamStats = result.teamStats || buildTeamStats(playerStats, score);
  return { score, winnerTeam: winnerTeam === 'draw' ? 'draw' : normalizeReportTeam(winnerTeam), playerStats, teamStats };
}
