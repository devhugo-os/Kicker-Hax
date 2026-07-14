// Kicker Hax - Fullscreen-safe dialog helpers.
// Native browser prompts leave fullscreen on mobile, so game actions use this
// lightweight in-app layer instead.

let activeDialog = null;

function ensureDialog() {
  let modal = document.getElementById('app-dialog-modal');
  if (modal) {
    return {
      modal,
      title: modal.querySelector('[data-dialog-title]'),
      message: modal.querySelector('[data-dialog-message]'),
      input: modal.querySelector('[data-dialog-input]'),
      cancel: modal.querySelector('[data-dialog-cancel]'),
      confirm: modal.querySelector('[data-dialog-confirm]')
    };
  }

  modal = document.createElement('div');
  modal.id = 'app-dialog-modal';
  modal.className = 'app-dialog-modal hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <form class="app-dialog-card" novalidate>
      <h2 data-dialog-title></h2>
      <p data-dialog-message></p>
      <input data-dialog-input autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />
      <div class="app-dialog-actions">
        <button type="button" class="btn btn-secondary" data-dialog-cancel>Cancelar</button>
        <button type="submit" class="btn btn-primary" data-dialog-confirm>Confirmar</button>
      </div>
    </form>
  `;
  document.body.appendChild(modal);

  const refs = {
    modal,
    title: modal.querySelector('[data-dialog-title]'),
    message: modal.querySelector('[data-dialog-message]'),
    input: modal.querySelector('[data-dialog-input]'),
    cancel: modal.querySelector('[data-dialog-cancel]'),
    confirm: modal.querySelector('[data-dialog-confirm]')
  };

  const close = (value) => {
    if (!activeDialog) return;
    const resolver = activeDialog.resolve;
    activeDialog = null;
    refs.modal.classList.add('hidden');
    resolver(value);
  };

  refs.cancel.addEventListener('click', () => close(null));
  refs.modal.addEventListener('click', (event) => {
    if (event.target === refs.modal) close(null);
  });
  refs.modal.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    close(activeDialog?.input ? refs.input.value : true);
  });

  return refs;
}

function openDialog({ title, message, confirmLabel, cancelLabel = 'Cancelar', danger = false, input = false, inputType = 'text', placeholder = '' }) {
  const refs = ensureDialog();
  if (activeDialog) activeDialog.resolve(null);

  refs.title.textContent = title;
  refs.message.textContent = message;
  refs.cancel.textContent = cancelLabel;
  refs.confirm.textContent = confirmLabel;
  refs.confirm.classList.toggle('btn-danger', danger);
  refs.confirm.classList.toggle('btn-primary', !danger);
  refs.input.hidden = !input;
  refs.input.required = input;
  refs.input.type = inputType;
  refs.input.placeholder = placeholder;
  refs.input.value = '';
  refs.modal.classList.remove('hidden');

  return new Promise((resolve) => {
    activeDialog = { resolve, input };
    if (input) {
      requestAnimationFrame(() => refs.input.focus({ preventScroll: true }));
    } else {
      requestAnimationFrame(() => refs.confirm.focus({ preventScroll: true }));
    }
  });
}

export function confirmDialog(options) {
  return openDialog({
    title: options.title || 'Confirmar acao',
    message: options.message || '',
    confirmLabel: options.confirmLabel || 'Confirmar',
    cancelLabel: options.cancelLabel || 'Cancelar',
    danger: !!options.danger
  }).then(Boolean);
}

export function promptDialog(options) {
  return openDialog({
    title: options.title || 'Informacao necessaria',
    message: options.message || '',
    confirmLabel: options.confirmLabel || 'Continuar',
    cancelLabel: options.cancelLabel || 'Cancelar',
    input: true,
    inputType: options.inputType || 'text',
    placeholder: options.placeholder || ''
  });
}
