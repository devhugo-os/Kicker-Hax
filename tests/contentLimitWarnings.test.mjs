import test from 'node:test';
import assert from 'node:assert/strict';
import { getCharacterLimitMessage, getProjectedTextLength, setupCharacterLimitWarnings } from '../client/utils/contentLimitWarnings.js';

test('calcula digitacao e colagem considerando o texto selecionado', () => {
  assert.equal(getProjectedTextLength('12345', 5, 5, '67'), 7);
  assert.equal(getProjectedTextLength('12345', 1, 4, 'AB'), 4);
});

test('informa o limite e o tipo do campo ao usuario', () => {
  assert.equal(
    getCharacterLimitMessage({ id: 'global-chat-input', maxLength: 255 }),
    'A mensagem aceita no máximo 255 caracteres.'
  );
  assert.equal(
    getCharacterLimitMessage({ id: 'profile-bio-input', maxLength: 60 }),
    'A biografia aceita no máximo 60 caracteres.'
  );
});

test('avisa ao tentar inserir o caractere seguinte ao maxlength', () => {
  const input = new EventTarget();
  Object.assign(input, {
    id: 'global-chat-input',
    maxLength: 255,
    value: 'a'.repeat(255),
    selectionStart: 255,
    selectionEnd: 255
  });
  const notices = [];
  setupCharacterLimitWarnings({ querySelectorAll: () => [input] }, (message, type) => notices.push({ message, type }));

  const event = new Event('beforeinput');
  Object.defineProperties(event, {
    inputType: { value: 'insertText' },
    data: { value: 'b' }
  });
  input.dispatchEvent(event);

  assert.deepEqual(notices, [{ message: 'A mensagem aceita no máximo 255 caracteres.', type: 'error' }]);
});
