import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const settingsUrl = new URL('../client/controllers/settingsController.js', import.meta.url);

test('HUD mobile padrao usa o layout aprovado e 60 por cento de opacidade', async () => {
  const source = await readFile(settingsUrl, 'utf8');
  const expectedValues = [
    'opacity: 60', 'stickX: 12', 'stickY: 25', 'stickSize: 132',
    'chatX: 86', 'chatY: 84', 'statsX: 93', 'statsY: 84',
    'pauseX: 8', 'pauseY: 84',
    'sprint: { x: 74, y: 66 }', 'shoot: { x: 83, y: 34 }',
    'dribble: { x: 92, y: 33 }', 'tackle: { x: 83, y: 15 }',
    'power: { x: 92, y: 52 }'
  ];

  expectedValues.forEach(value => assert.ok(source.includes(value), `Preset ausente: ${value}`));
  assert.equal((source.match(/(?:opacity|Opacity): 60/g) || []).length, 10);
});
