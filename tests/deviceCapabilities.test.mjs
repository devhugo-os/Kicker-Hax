import test from 'node:test';
import assert from 'node:assert/strict';
import { isMobilePhoneDevice, shouldUseMobileHud } from '../client/utils/deviceCapabilities.js';

test('libera assistencia apenas para celulares reais', () => {
  assert.equal(isMobilePhoneDevice({ userAgentData: { mobile: true }, userAgent: '' }), true);
  assert.equal(isMobilePhoneDevice({ userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit Mobile' }), true);
  assert.equal(isMobilePhoneDevice({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' }), true);
});

test('nao libera assistencia para tablet ou computador touch', () => {
  assert.equal(isMobilePhoneDevice({ userAgentData: { mobile: false }, userAgent: 'Android Mobile' }), false);
  assert.equal(isMobilePhoneDevice({ userAgent: 'Mozilla/5.0 (Linux; Android 14; Tablet)' }), false);
  assert.equal(isMobilePhoneDevice({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)' }), false);
  assert.equal(isMobilePhoneDevice({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }), false);
});

test('HUD mobile depende do dispositivo ou app e nao do tamanho da pagina', () => {
  const desktop = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', maxTouchPoints: 0 };
  assert.equal(shouldUseMobileHud(desktop, { coarsePointer: false, search: '' }), false);
  assert.equal(shouldUseMobileHud(desktop, { coarsePointer: false, search: '?app=1' }), true);
  assert.equal(shouldUseMobileHud({ userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile', maxTouchPoints: 0 }), true);
  assert.equal(shouldUseMobileHud({ userAgent: 'Tablet', maxTouchPoints: 5 }, { coarsePointer: true }), true);
});
