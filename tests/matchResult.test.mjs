import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePlayerMatchOutcome } from '../client/utils/matchResult.js';

test('contabiliza vitoria por W.O. usando o UID depois de uma reconexao', () => {
  const outcome = resolvePlayerMatchOutcome({
    score: { red: 1, blue: 0 },
    winnerTeam: 0,
    forfeit: true,
    playerStats: [{ uid: 'winner', playerId: 'socket-antigo', team: 0 }]
  }, 'winner', 'socket-novo', [{ id: 'socket-novo', team: 1 }]);

  assert.equal(outcome.isWin, true);
  assert.equal(outcome.isLoss, false);
  assert.equal(outcome.localTeam, 0);
});

test('normaliza times textuais no resultado de W.O.', () => {
  const outcome = resolvePlayerMatchOutcome({
    score: { red: 0, blue: 1 },
    winnerTeam: 'blue',
    forfeit: true,
    playerStats: [{ uid: 'winner', team: 'blue' }]
  }, 'winner', 'socket', []);

  assert.equal(outcome.isWin, true);
  assert.equal(outcome.winnerTeam, 1);
});

test('placar final prevalece sobre vencedor obsoleto', () => {
  const outcome = resolvePlayerMatchOutcome({
    score: { red: 7, blue: 6 },
    winnerTeam: 'draw',
    playerStats: [{ uid: 'winner', team: 0 }]
  }, 'winner', 'socket', []);

  assert.equal(outcome.isDraw, false);
  assert.equal(outcome.isWin, true);
  assert.equal(outcome.winnerTeam, 0);
});
