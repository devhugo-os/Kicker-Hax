import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHAT_MESSAGE_MAX_LENGTH,
  PROFILE_BIO_MAX_LENGTH,
  ROOM_NAME_MAX_LENGTH,
  ROOM_PASSWORD_MAX_LENGTH,
  SKIN_IMAGE_MAX_BYTES,
  SKIN_NAME_MAX_LENGTH,
  TEAM_NAME_COLORS,
  Team,
  USERNAME_MAX_LENGTH
} from '../shared/constants.js';
import { ServerRoom } from '../server/models/serverRoom.js';
import { normalizeCommunitySkinName } from '../client/utils/skinQueue.js';

test('mantem os limites publicos atuais da aplicacao', () => {
  assert.equal(USERNAME_MAX_LENGTH, 15);
  assert.equal(PROFILE_BIO_MAX_LENGTH, 60);
  assert.equal(SKIN_NAME_MAX_LENGTH, 15);
  assert.equal(ROOM_NAME_MAX_LENGTH, 15);
  assert.equal(ROOM_PASSWORD_MAX_LENGTH, 8);
  assert.equal(CHAT_MESSAGE_MAX_LENGTH, 255);
  assert.equal(SKIN_IMAGE_MAX_BYTES, 500 * 1024);
});

test('mantem cores distintas para os nomes dos dois times', () => {
  assert.equal(TEAM_NAME_COLORS[Team.RED], '#ff6b6b');
  assert.equal(TEAM_NAME_COLORS[Team.BLUE], '#60a5fa');
  assert.notEqual(TEAM_NAME_COLORS[Team.RED], TEAM_NAME_COLORS[Team.BLUE]);
});

test('modelo da sala limita nome, senha, usuario e mensagens', () => {
  const room = new ServerRoom('ABC123', 'A'.repeat(30), 'host', { password: '1'.repeat(20) });
  const player = room.addPlayer('p1', { uid: 'u1', username: 'U'.repeat(30) });
  const message = room.addChatMessage(player.username, '', '', 'M'.repeat(400));
  assert.equal(room.name.length, ROOM_NAME_MAX_LENGTH);
  assert.equal(room.password.length, ROOM_PASSWORD_MAX_LENGTH);
  assert.equal(player.username.length, USERNAME_MAX_LENGTH);
  assert.equal(message.text.length, CHAT_MESSAGE_MAX_LENGTH);
  assert.equal(normalizeCommunitySkinName('S'.repeat(30)).length, SKIN_NAME_MAX_LENGTH);
});
