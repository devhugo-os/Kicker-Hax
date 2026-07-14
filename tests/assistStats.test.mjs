import test from 'node:test';
import assert from 'node:assert/strict';
import { ServerMatch } from '../server/models/serverMatch.js';

test('registra assistencia do ultimo companheiro antes do gol', () => {
  const match = Object.create(ServerMatch.prototype);
  match.status = 'playing';
  match.onlineGoalFreezeFrames = 120;
  match.score = { red: 0, blue: 0 };
  match.players = [
    { id: 'passador', name: 'Passe', team: 0 },
    { id: 'artilheiro', name: 'Gol', team: 0 }
  ];
  match.playerStats = new Map([
    ['passador', { assists: 0 }],
    ['artilheiro', { goals: 0, ownGoals: 0 }]
  ]);
  match.assistCandidateId = 'passador';
  match.assistRecipientId = 'artilheiro';
  match.assistShotCount = 1;
  match.soundEffects = [];

  match.triggerGoal('red', 'artilheiro');

  assert.equal(match.playerStats.get('passador').assists, 1);
  assert.equal(match.lastGoal.assistName, 'Passe');
});

test('toque adversario cancela candidato a assistencia', () => {
  const match = Object.create(ServerMatch.prototype);
  match.players = [
    { id: 'passador', team: 0 },
    { id: 'adversario', team: 1 }
  ];
  match.ball = { owner: 'adversario', lastTouch: 'adversario' };
  match.lastTrackedTouchId = 'passador';
  match.assistCandidateId = 'passador';

  match.trackAssistCandidate();

  assert.equal(match.assistCandidateId, null);
});

test('segundo chute do recebedor cancela a assistencia', () => {
  const match = Object.create(ServerMatch.prototype);
  match.assistCandidateId = 'passador';
  match.assistRecipientId = 'autor';
  match.assistShotCount = 0;
  match.registerAssistShot('autor');
  assert.equal(match.assistShotCount, 1);
  match.registerAssistShot('autor');
  assert.equal(match.assistCandidateId, null);
  assert.equal(match.assistRecipientId, null);
});
