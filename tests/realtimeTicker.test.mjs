import test from 'node:test';
import assert from 'node:assert/strict';
import { createRealtimeTicker } from '../shared/realtimeTicker.js';

test('usa intervalo normal quando Worker nao esta disponivel', () => {
  let callback = null;
  let cleared = false;
  const runtime = {
    setInterval(fn) { callback = fn; return 7; },
    clearInterval(id) { cleared = id === 7; }
  };
  let ticks = 0;
  const ticker = createRealtimeTicker(() => { ticks++; }, 16, runtime);
  callback();
  assert.equal(ticks, 1);
  ticker.stop();
  assert.equal(cleared, true);
});

test('prefere worker dedicado e encerra sem deixar temporizador ativo', () => {
  class FakeWorker {
    constructor() { runtime.instance = this; }
    postMessage(data) { this.requests = [...(this.requests || []), data]; }
    terminate() { this.terminated = true; }
  }
  const runtime = {
    Worker: FakeWorker,
    Blob: class FakeBlob {},
    URL: { createObjectURL: () => 'blob:ticker', revokeObjectURL() {} },
    setInterval() { throw new Error('fallback nao deveria iniciar'); },
    clearInterval() {},
    Date: { now: () => 1234 },
    instance: null
  };
  let timestamp = 0;
  const ticker = createRealtimeTicker(value => { timestamp = value; }, 20, runtime);
  runtime.instance.onmessage({ data: 1234 });
  assert.equal(timestamp, 1234);
  assert.equal(runtime.instance.requests[0].intervalMs, 20);
  assert.equal(runtime.instance.requests[1].type, 'ack');
  ticker.stop();
  assert.equal(runtime.instance.terminated, true);
});
