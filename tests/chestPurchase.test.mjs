import test from 'node:test';
import assert from 'node:assert/strict';
import { appendChestPurchaseReceipt, findChestPurchaseReceipt, getDuplicateChestRefund, normalizeChestPurchaseId } from '../client/utils/chestPurchase.js';

test('normaliza e encontra o recibo da mesma abertura', () => {
  const id = normalizeChestPurchaseId('chest:abc/123');
  const receipts = [{ id, skinId: 'champion' }];
  assert.equal(id, 'chest_abc_123');
  assert.equal(findChestPurchaseReceipt(receipts, 'chest:abc/123').skinId, 'champion');
});

test('limita recibos recentes sem duplicar a mesma abertura', () => {
  const receipts = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.deepEqual(appendChestPurchaseReceipt(receipts, { id: 'b', skinId: 'new' }, 3), [
    { id: 'a' }, { id: 'c' }, { id: 'b', skinId: 'new' }
  ]);
});

test('devolve exatamente 25 por cento quando a skin do bau e duplicada', () => {
  assert.equal(getDuplicateChestRefund(120), 30);
  assert.equal(getDuplicateChestRefund(700), 175);
});

test('recupera o reembolso da duplicata depois de reabrir o aplicativo', () => {
  const receipt = { id: 'chest_saved', skinId: 'storm', duplicate: true, refund: 80 };
  const recovered = findChestPurchaseReceipt(appendChestPurchaseReceipt([], receipt), 'chest_saved');
  assert.equal(recovered.duplicate, true);
  assert.equal(recovered.refund, 80);
});
