import { showToast } from './toast.js';

const FIELD_LABELS = Object.freeze({
  'profile-username-input': 'O nome de usuário',
  'profile-bio-input': 'A biografia',
  'skin-request-name': 'O nome da skin',
  'room-name-input': 'O nome da sala',
  'room-password-input': 'A senha da sala',
  'join-code-input': 'O código da sala',
  'join-password-input': 'A senha da sala',
  'lobby-password-input': 'A senha da sala',
  'lobby-chat-input': 'A mensagem',
  'game-chat-input': 'A mensagem',
  'global-chat-input': 'A mensagem'
});

const initializedInputs = new WeakSet();

export function getProjectedTextLength(value, selectionStart, selectionEnd, insertedText) {
  const text = String(value || '');
  const start = Number.isInteger(selectionStart) ? selectionStart : text.length;
  const end = Number.isInteger(selectionEnd) ? selectionEnd : start;
  return text.length - Math.max(0, end - start) + String(insertedText || '').length;
}

export function getCharacterLimitMessage(input) {
  const label = FIELD_LABELS[input?.id] || 'Este campo';
  return `${label} aceita no máximo ${input?.maxLength || 0} caracteres.`;
}

function wouldExceedLimit(input, insertedText) {
  if (!input || input.maxLength < 0) return false;
  return getProjectedTextLength(input.value, input.selectionStart, input.selectionEnd, insertedText) > input.maxLength;
}

/** Warns before maxlength silently discards typing, paste or dropped text. */
export function setupCharacterLimitWarnings(root = document, notify = showToast) {
  root.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(input => {
    if (initializedInputs.has(input)) return;
    initializedInputs.add(input);

    const warn = insertedText => {
      if (wouldExceedLimit(input, insertedText)) notify(getCharacterLimitMessage(input), 'error');
    };

    input.addEventListener('beforeinput', event => {
      if (!event.inputType?.startsWith('insert') || event.inputType === 'insertFromPaste' || event.inputType === 'insertFromDrop') return;
      const insertedText = event.data ?? (event.inputType === 'insertLineBreak' ? '\n' : '');
      if (insertedText || input.value.length >= input.maxLength) warn(insertedText || 'x');
    });
    input.addEventListener('paste', event => warn(event.clipboardData?.getData('text') || ''));
    input.addEventListener('drop', event => warn(event.dataTransfer?.getData('text') || ''));
  });
}
