import test from 'node:test';
import assert from 'node:assert/strict';
import { groupSeasonHistoryByUid, mergeCompetitiveHistoryStats } from '../client/utils/statReconciliation.js';

const receipt = {
  matchId: 'room-result-1',
  competitive: true,
  winner: 1,
  playerTeams: { player: 1 },
  playerStats: [{ uid: 'player', goals: 2, assists: 1, shots: 3, dribbles: 1, tackles: 4, possessionPct: 62 }],
  mvp: { uid: 'player' }
};

test('reconstroi a vitoria competitiva ausente a partir do historico', () => {
  const stats = mergeCompetitiveHistoryStats({ processedMatchIds: {} }, [receipt], 'player');
  assert.equal(stats.matchesPlayed, 1);
  assert.equal(stats.wins, 1);
  assert.equal(stats.losses, 0);
  assert.equal(stats.goals, 2);
  assert.equal(stats.assists, 1);
  assert.equal(stats.tackles, 4);
  assert.equal(stats.mvps, 1);
});

test('nao duplica recibo ja processado', () => {
  const stats = mergeCompetitiveHistoryStats({ wins: 1, matchesPlayed: 1, processedMatchIds: { 'room-result-1': true } }, [receipt], 'player');
  assert.equal(stats.matchesPlayed, 1);
  assert.equal(stats.wins, 1);
});

test('agrupa recibos atuais para ranking sem consultas por jogador', () => {
  const current = { ...receipt, seasonId: '12', playerUids: [] };
  const legacy = { ...receipt, matchId: 'legacy', seasonId: '12', playerTeams: { legacyPlayer: 'red' } };
  const old = { ...receipt, matchId: 'old', seasonId: '11', playerUids: ['player'] };
  const grouped = groupSeasonHistoryByUid([current, legacy, old], '12');

  assert.equal(grouped.get('player').length, 1);
  assert.equal(grouped.get('legacyPlayer').length, 1);
  assert.equal(grouped.get('player').some(match => match.matchId === 'old'), false);
});
