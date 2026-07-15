import { Team } from './constants.js';

const TEAM_KEYS = [Team.RED, Team.BLUE];
const STAT_KEYS = ['goals', 'assists', 'ownGoals', 'shots', 'dribbles', 'tackles'];

export function normalizeReportTeam(team) {
  if (team === 'red') return Team.RED;
  if (team === 'blue') return Team.BLUE;
  return team;
}

/** Produces a stable 1-10 match rating from the player's contribution. */
export function calculateMatchRating(stats = {}, winnerTeam = 'draw') {
  const team = normalizeReportTeam(stats.team);
  const resultBonus = winnerTeam === 'draw' ? 0.15 : team === normalizeReportTeam(winnerTeam) ? 0.4 : 0;
  const possessionImpact = (Math.max(0, Math.min(100, Number(stats.possessionPct || 0))) - 50) * 0.006;
  const raw = 5.8
    + resultBonus
    + (Number(stats.goals || 0) * 1.25)
    + (Number(stats.assists || 0) * 0.75)
    + (Math.min(8, Number(stats.tackles || 0)) * 0.18)
    + (Math.min(10, Number(stats.dribbles || 0)) * 0.12)
    + (Math.min(10, Number(stats.shots || 0)) * 0.05)
    - (Number(stats.ownGoals || 0) * 1.1)
    + possessionImpact;
  return Math.round(Math.max(1, Math.min(10, raw)) * 10) / 10;
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
  const playerStats = (result.playerStats || []).map(player => ({
    ...player,
    team: normalizeReportTeam(player.team),
    rating: Number(player.rating || calculateMatchRating(player, winnerTeam))
  }));
  const teamStats = result.teamStats || buildTeamStats(playerStats, score);
  return { score, winnerTeam: winnerTeam === 'draw' ? 'draw' : normalizeReportTeam(winnerTeam), playerStats, teamStats };
}
