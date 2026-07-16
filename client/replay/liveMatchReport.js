import { Team } from '../../shared/constants.js';
import { buildMatchReport } from '../../shared/matchReport.js';

export function buildLiveMatchReport(players = [], score = { red: 0, blue: 0 }) {
  const available = players.filter(player => player && player.team !== 'spectator');
  const totalPossession = available.reduce(
    (sum, player) => sum + Number(player.matchStats?.possessionFrames || 0),
    0
  );
  const playerStats = available.map(player => {
    const stats = player.matchStats || {};
    return {
      playerId: player.id,
      uid: player.uid || stats.uid || '',
      username: player.name || stats.username || 'Jogador',
      team: player.team,
      goals: Number(stats.goals || 0),
      assists: Number(stats.assists || 0),
      ownGoals: Number(stats.ownGoals || 0),
      shots: Number(stats.shots || 0),
      dribbles: Number(stats.dribbles || 0),
      tackles: Number(stats.tackles || 0),
      possessionFrames: Number(stats.possessionFrames || 0),
      possessionPct: totalPossession > 0
        ? Math.round((Number(stats.possessionFrames || 0) / totalPossession) * 100)
        : 0
    };
  });
  const winnerTeam = Number(score.red || 0) === Number(score.blue || 0)
    ? 'draw'
    : Number(score.red || 0) > Number(score.blue || 0) ? Team.RED : Team.BLUE;
  return buildMatchReport({ score, winnerTeam, playerStats });
}
