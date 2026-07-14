import test from 'node:test';
import assert from 'node:assert/strict';
import { detectSkinImageType, getBase64DataUrlBytes } from '../client/utils/skinImage.js';

test('aceita assinaturas reais de PNG e JPEG', () => {
  assert.equal(detectSkinImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'image/png');
  assert.equal(detectSkinImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), 'image/jpeg');
  assert.equal(detectSkinImageType(new Uint8Array([0x52, 0x49, 0x46, 0x46])), null);
});

test('calcula o peso binario do Base64 sem contar o cabecalho', () => {
  assert.equal(getBase64DataUrlBytes('data:image/png;base64,AQIDBA=='), 4);
  assert.equal(getBase64DataUrlBytes('data:image/jpeg;base64,AQID'), 3);
});
