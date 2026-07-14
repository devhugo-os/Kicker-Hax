import test from 'node:test';
import assert from 'node:assert/strict';
import { getSkinById, getSkinValue, usesProfileBadge } from '../client/data/skins.js';

test('skin Novato nao possui valor de colecao', () => {
  assert.equal(getSkinValue(getSkinById('rookie')), 0);
  assert.ok(getSkinValue(getSkinById('street')) > 0);
});

test('exibe emblema apenas quando a skin Novato esta equipada', () => {
  assert.equal(usesProfileBadge({ equippedSkinId: 'rookie' }), true);
  assert.equal(usesProfileBadge({ equippedSkinId: 'storm' }), false);
  assert.equal(usesProfileBadge({ equippedSkinId: 'none' }), false);
});
