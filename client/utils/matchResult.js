import * as C from '../../shared/constants.js';

export function normalizeMatchTeam(team) {
  if (team === 'red') return C.Team.RED;
  if (team === 'blue') return C.Team.BLUE;
  return team;
}

/** Resolves an account outcome from the authoritative result before local state. */
export function resolvePlayerMatchOutcome(result, uid, socketId, localPlayers = []) {
  const score = result?.score || result || { red: 0, blue: 0 };
  const stats = (result?.playerStats || []).find(item => item.uid === uid)
    || (result?.playerStats || []).find(item => item.playerId === socketId)
    || {};
  const localPlayer = localPlayers.find(player => player.id === socketId);
  // The host's winnerTeam is authoritative for W.O. and surrender. The score
  // remains the fallback for legacy results that predate that field.
  const scoreWinner = score.red === score.blue
    ? 'draw'
    : score.blue > score.red ? C.Team.BLUE : C.Team.RED;
  const rawWinner = result?.forfeit
    ? (result?.winnerTeam ?? result?.winner ?? scoreWinner)
    : scoreWinner;
  const winnerTeam = rawWinner === 'draw' ? 'draw' : normalizeMatchTeam(rawWinner);
  const localTeam = normalizeMatchTeam(stats.team ?? localPlayer?.team);
  const isDraw = winnerTeam === 'draw';
  const isSpectator = localTeam === undefined || localTeam === null || localTeam === 'spectator';
  return {
    stats,
    localTeam,
    winnerTeam,
    isDraw,
    isSpectator,
    isWin: !isSpectator && !isDraw && localTeam === winnerTeam,
    isLoss: !isSpectator && !isDraw && localTeam !== winnerTeam
  };
}
