import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOverallRating, compareOverallRanking, compareWinRateRanking, getCompetitiveWinRate } from '../client/utils/rankingScore.js';

test('winrate possui ranking proprio e prioriza eficiencia', () => {
  const ranking = [
    { uid: 'volume', wins: 30, matchesPlayed: 50, goals: 200, mvps: 20 },
    { uid: 'eficiencia', wins: 7, matchesPlayed: 10, goals: 4, mvps: 0 }
  ].sort(compareWinRateRanking);
  assert.equal(getCompetitiveWinRate(ranking[0]), 0.7);
  assert.equal(ranking[0].uid, 'eficiencia');
});

test('overall combina todas as estatisticas em nota de carta ate 99', () => {
  const complete = {
    uid: 'completo', wins: 8, matchesPlayed: 10, goals: 12, shots: 18,
    assists: 8, dribbles: 30, tackles: 40, possessionAvg: 58, mvps: 4
  };
  const limited = { uid: 'limitado', wins: 8, matchesPlayed: 10, goals: 2, shots: 20 };
  assert.ok(calculateOverallRating(complete) > calculateOverallRating(limited));
  assert.ok(calculateOverallRating(complete) <= 99);
  assert.equal([limited, complete].sort(compareOverallRanking)[0].uid, 'completo');
});

test('overall reduz nota de amostra pequena', () => {
  const debut = { wins: 1, matchesPlayed: 1, goals: 2, shots: 2, assists: 1, dribbles: 4, tackles: 5, possessionAvg: 65, mvps: 1 };
  assert.ok(calculateOverallRating(debut) < 60);
});
