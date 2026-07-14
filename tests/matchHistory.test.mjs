import test from 'node:test';
import assert from 'node:assert/strict';
import { getWritableHistoryUids } from '../client/utils/matchHistory.js';

test('cada cliente grava apenas o proprio historico da partida', () => {
  assert.deepEqual(getWritableHistoryUids(['host', 'guest'], 'guest'), ['guest']);
  assert.deepEqual(getWritableHistoryUids(['host', 'guest'], 'outsider'), []);
  assert.deepEqual(getWritableHistoryUids([], 'guest'), []);
});
