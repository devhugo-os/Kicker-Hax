import test from 'node:test';
import assert from 'node:assert/strict';
import { getPendingSkinRequests, getSkinQueueCleanup, normalizeCommunitySkinName } from '../client/utils/skinQueue.js';

test('normaliza o nome enviado para uma skin comunitaria', () => {
  assert.equal(normalizeCommunitySkinName('  Furia   Azul\nKX  '), 'Furia Azul KX');
  assert.equal(normalizeCommunitySkinName('A'.repeat(40)).length, 15);
});

test('mantem pedidos antigos na fila e remove apenas os ja usados', () => {
  const requests = {
    '2026-07-01': { a: { uid: 'a', image: 'image-a', requestId: 'old-a' } },
    '2026-07-10': { b: { uid: 'b', image: 'image-b', requestId: 'new-b' } }
  };
  const featured = { daily: { '2026-07-11': { requestId: 'new-b' } } };
  const pending = getPendingSkinRequests(requests, featured, '2026-07-12');
  assert.deepEqual(pending.map(item => item.requestId), ['old-a']);
});

test('considera uso em qualquer vitrine para impedir repeticao', () => {
  const requests = { '2026-07-01': { a: { uid: 'a', image: 'image-a', requestId: 'skin-a' } } };
  const featured = { monthly: { '2026-07': { requestId: 'skin-a' } } };
  assert.equal(getPendingSkinRequests(requests, featured, '2026-07-12').length, 0);
});

test('remove pedidos usados e limita o peso da fila aos mais novos', () => {
  const requests = {
    '2026-07-10': { a: { uid: 'a', requestId: 'a', image: 'a', createdAt: 1 } },
    '2026-07-11': { b: { uid: 'b', requestId: 'b', image: 'b', createdAt: 2 } },
    '2026-07-12': { c: { uid: 'c', requestId: 'c', image: 'c', createdAt: 3 } }
  };
  const featured = { daily: { today: { requestId: 'b' } } };
  assert.deepEqual(
    getSkinQueueCleanup(requests, featured, '2026-07-12', 1).map(item => item.requestId).sort(),
    ['a', 'b']
  );
});
