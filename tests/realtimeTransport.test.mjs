import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_REALTIME_BUFFERED_BYTES, shouldDropRealtimeState } from '../client/utils/realtimeTransport.js';

test('descarta somente snapshots substituiveis quando o WebRTC esta congestionado', () => {
  assert.equal(shouldDropRealtimeState('gameState', MAX_REALTIME_BUFFERED_BYTES + 1), true);
  assert.equal(shouldDropRealtimeState('gameState', MAX_REALTIME_BUFFERED_BYTES), false);
  for (const event of ['matchEnded', 'playReplay', 'chatMessage', 'pong']) {
    assert.equal(shouldDropRealtimeState(event, MAX_REALTIME_BUFFERED_BYTES * 20), false);
  }
});
