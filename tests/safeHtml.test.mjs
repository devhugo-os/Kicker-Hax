import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, safeImageSource } from '../client/utils/safeHtml.js';

test('neutraliza texto inserido em templates HTML', () => {
  assert.equal(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
});

test('aceita apenas imagens locais ou data URLs rasterizadas', () => {
  assert.equal(safeImageSource('javascript:alert(1)'), '');
  assert.equal(safeImageSource('data:image/webp;base64,AAAA'), 'data:image/webp;base64,AAAA');
  assert.equal(safeImageSource('data:image/svg+xml;base64,PHN2Zz4='), 'data:image/svg+xml;base64,PHN2Zz4=');
});
