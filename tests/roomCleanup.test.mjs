import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoomCleanupPatch, getOrphanRoomCodes } from '../client/utils/roomCleanup.js';

test('remove sala e chats em uma unica atualizacao atomica', () => {
  assert.deepEqual(buildRoomCleanupPatch('ab12cd'), {
    'multiplayerRooms/AB12CD': null,
    'roomChats/AB12CD': null,
    'matchChats/AB12CD': null
  });
});

test('encontra chats que nao possuem sala multiplayer correspondente', () => {
  assert.deepEqual(getOrphanRoomCodes(
    { LIVE01: { hostUid: 'host' } },
    { LIVE01: {}, OLD001: {} },
    { OLD001: {}, DEAD02: {} }
  ).sort(), ['DEAD02', 'OLD001']);
});
