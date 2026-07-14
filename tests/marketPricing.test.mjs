import test from 'node:test';
import assert from 'node:assert/strict';
import { getInsufficientCoinsMessage, getMissingCoins } from '../client/utils/marketPricing.js';

test('calcula apenas o saldo que falta para uma compra', () => {
  assert.equal(getMissingCoins(75, 120), 45);
  assert.equal(getMissingCoins(120, 120), 0);
  assert.equal(getMissingCoins(200, 120), 0);
});

test('informa item e quantidade exata de KX Coins faltantes', () => {
  assert.equal(
    getInsufficientCoinsMessage(250, 320, 'abrir o Bau Dourado'),
    'KX Coins insuficientes para abrir o Bau Dourado. Faltam 70 KX Coins.'
  );
});
