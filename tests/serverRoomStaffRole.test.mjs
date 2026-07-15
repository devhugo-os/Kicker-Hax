import test from 'node:test';
import assert from 'node:assert/strict';
import { ServerRoom } from '../server/models/serverRoom.js';

test('normaliza tags oficiais antes de sincronizar lobby e partida', () => {
  const room = new ServerRoom('TAG270', 'Sala de tags', 'host');
  const influencer = room.addPlayer('influencer', {
    uid: 'uid-inf', username: 'Influencer', staffRole: ' Influencer '
  });
  const developer = room.addPlayer('developer', {
    uid: 'uid-dev', username: 'Developer', staffRole: 'DEVELOPER'
  });
  const invalid = room.addPlayer('invalid', {
    uid: 'uid-user', username: 'User', staffRole: 'admin'
  });

  assert.equal(influencer.staffRole, 'influencer');
  assert.equal(developer.staffRole, 'developer');
  assert.equal(invalid.staffRole, '');
  assert.equal(room.getLobbyInfo().players[0].staffRole, 'influencer');
});

test('retorno aceita somente a partida ativa correspondente', () => {
  const room = new ServerRoom('RET280', 'Sala retorno', 'host');
  room.addPlayer('old-peer', { uid: 'uid-return', username: 'Jogador' }, 'blue');
  room.status = 'playing';
  room.match = { matchId: 'match-current' };
  room.markPlayerDisconnected('old-peer');

  assert.equal(room.reconnectPlayer('uid-return', 'wrong-peer', 'match-old'), null);
  const rejoined = room.reconnectPlayer('uid-return', 'new-peer', 'match-current');
  assert.equal(rejoined.player.id, 'new-peer');
});
