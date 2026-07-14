const AUTO_ADVANCE_MS = 700;

function keyLabel(value) {
  if (!value) return '?';
  return String(value).replace(/^Key/, '').replace(/^Digit/, '').replace('Space', 'Espaço').replace('ShiftLeft', 'Shift');
}

function buildControlChips(controls, mobile) {
  if (mobile) {
    return [
      ['🕹️', 'Mover'], ['⚡', 'Correr'], ['🥾', 'Chutar / passar'],
      ['✨', 'Driblar'], ['🛡️', 'Desarmar'], ['🔥', 'Super chute']
    ];
  }
  return [
    [`${keyLabel(controls.up)} ${keyLabel(controls.left)} ${keyLabel(controls.down)} ${keyLabel(controls.right)}`, 'Mover'],
    [keyLabel(controls.sprint), 'Correr'], [keyLabel(controls.shoot), 'Chutar / passar'],
    [keyLabel(controls.dribble), 'Driblar'], [keyLabel(controls.tackle), 'Desarmar'],
    [keyLabel(controls.power), 'Super chute'], ['Enter', 'Chat online'], ['Esc', 'Pausa']
  ];
}

export const TUTORIAL_STEPS = [
  { id: 'intro', manual: true, speaker: 'Treinador KX', title: 'Bem-vindo ao campo!', text: 'Vou acompanhar você em uma sequência prática. Cada objetivo usa a mesma física das partidas reais.', objective: 'Conheça seus comandos e clique em Começar.', showControls: true },
  { id: 'move', speaker: 'Treinador KX', title: 'Movimentação', text: 'Mude de direção e conheça o espaço ao seu redor.', objective: 'Percorra o campo até completar a barra.' },
  { id: 'sprint', speaker: 'Treinador KX', title: 'Corrida e stamina', text: 'Correr aumenta sua velocidade, mas consome stamina. Solte o comando para recuperá-la.', objective: 'Corra enquanto se movimenta.' },
  { id: 'control', speaker: 'Treinador KX', title: 'Domínio da bola', text: 'Aproxime-se da bola para dominá-la. O círculo preso ao jogador indica a posse.', objective: 'Pegue a bola.' },
  { id: 'pass', speaker: 'CPU Parceiro', title: 'Passe', text: 'Um chute curto também é um passe. Mire no parceiro e solte antes de carregar toda a força.', objective: 'Passe a bola para a CPU amigável.' },
  { id: 'shoot', speaker: 'Treinador KX', title: 'Chute carregado', text: 'Segure o chute para aumentar a força e solte apontando na direção desejada.', objective: 'Carregue e solte um chute.' },
  { id: 'dribble', speaker: 'Treinador KX', title: 'Drible', text: 'O drible dá um impulso curto e protege você de desarmes durante alguns instantes.', objective: 'Execute um drible com a posse da bola.' },
  { id: 'power', speaker: 'Treinador KX', title: 'Super chute', text: 'O super chute exige bastante stamina. Use quando tiver espaço e energia.', objective: 'Execute um super chute.' },
  { id: 'tackle', speaker: 'CPU Rival', title: 'Desarme', text: 'Conclua o dash encostando de frente ou de lado no adversário que carrega a bola.', objective: 'Recupere a bola da CPU rival.' },
  { id: 'goal', speaker: 'Treinador KX', title: 'Objetivo final', text: 'Combine movimentação, corrida, drible e chute. Ataque o gol da esquerda.', objective: 'Marque um gol no time vermelho.' },
  { id: 'finish', manual: true, speaker: 'Treinador KX', title: 'Tutorial concluído!', text: 'Você já conhece posse, passe, chute, drible, desarme, stamina e super chute. Agora o campo é seu.', objective: 'Clique em Concluir para voltar aos modos.' }
];

/** Coordinates presentation and objectives independently from game physics. */
export class TutorialSession {
  constructor({ root, controls, mobile = false, onStepChange, onFinish, onExit }) {
    Object.assign(this, { root, controls: controls || {}, mobile, onStepChange, onFinish, onExit });
    this.index = 0;
    this.progress = 0;
    this.lastPosition = null;
    this.passStarted = false;
    this.advanceTimer = null;
  }

  get step() { return TUTORIAL_STEPS[this.index]; }
  get enemyActive() { return ['tackle', 'goal'].includes(this.step?.id); }
  get isManual() { return !!this.step?.manual; }

  start() {
    this.root?.classList.remove('hidden');
    this.render();
    this.onStepChange?.(this.step, this);
  }

  destroy() {
    clearTimeout(this.advanceTimer);
    this.advanceTimer = null;
    this.root?.classList.add('hidden');
    if (this.root) this.root.replaceChildren();
  }

  next() {
    clearTimeout(this.advanceTimer);
    this.advanceTimer = null;
    if (this.step?.id === 'finish') return this.onFinish?.();
    this.index = Math.min(TUTORIAL_STEPS.length - 1, this.index + 1);
    this.progress = 0;
    this.lastPosition = null;
    this.passStarted = false;
    this.render();
    this.onStepChange?.(this.step, this);
  }

  complete() {
    if (this.isManual || this.advanceTimer) return;
    this.progress = 1;
    this.render();
    clearTimeout(this.advanceTimer);
    this.advanceTimer = setTimeout(() => this.next(), AUTO_ADVANCE_MS);
  }

  record(eventName, payload = {}) {
    const id = this.step?.id;
    if (id === 'pass' && eventName === 'kick') this.passStarted = true;
    if (id === 'shoot' && eventName === 'kick') this.complete();
    if (id === 'dribble' && eventName === 'dribble') this.complete();
    if (id === 'power' && eventName === 'power') this.complete();
    if (id === 'goal' && eventName === 'goal' && payload.side === 'blue') this.complete();
  }

  update({ player, ball, input }) {
    if (!player || !ball || this.isManual || this.progress >= 1) return;
    const id = this.step?.id;
    if (id === 'move') {
      if (this.lastPosition) this.progress += Math.hypot(player.x - this.lastPosition.x, player.y - this.lastPosition.y) / 420;
      this.lastPosition = { x: player.x, y: player.y };
    } else if (id === 'sprint' && input?.sprint && Math.abs(input.x) + Math.abs(input.y) > 0.2) {
      this.progress += 1 / 85;
    } else if (id === 'control' && ball.owner === 'p1') this.progress = 1;
    else if (id === 'pass' && this.passStarted && ball.owner === 'tutorial-ally') this.progress = 1;
    else if (id === 'tackle' && ball.owner === 'p1') this.progress = 1;
    if (this.progress >= 1) this.complete(); else this.refreshProgress();
  }

  refreshProgress() {
    const fill = this.root?.querySelector('[data-tutorial-progress]');
    if (fill) fill.style.width = `${Math.max(3, Math.min(100, this.progress * 100))}%`;
  }

  render() {
    if (!this.root || !this.step) return;
    const step = this.step;
    const shell = document.createElement('section');
    shell.className = `tutorial-card${step.manual ? ' tutorial-dialog' : ''}${this.progress >= 1 ? ' is-complete' : ''}`;
    shell.setAttribute('aria-live', 'polite');

    const top = document.createElement('div');
    top.className = 'tutorial-topline';
    const speaker = document.createElement('strong');
    speaker.textContent = step.speaker;
    const count = document.createElement('span');
    count.textContent = `Etapa ${Math.min(this.index + 1, TUTORIAL_STEPS.length - 1)}/${TUTORIAL_STEPS.length - 1}`;
    top.append(speaker, count);
    const title = document.createElement('h3'); title.textContent = step.title;
    const text = document.createElement('p'); text.textContent = step.text;
    const objective = document.createElement('div');
    objective.className = 'tutorial-objective';
    objective.textContent = this.progress >= 1 ? 'Objetivo concluído!' : step.objective;
    shell.append(top, title, text, objective);

    if (step.showControls) {
      const controls = document.createElement('div');
      controls.className = 'tutorial-controls-grid';
      buildControlChips(this.controls, this.mobile).forEach(([key, label]) => {
        const chip = document.createElement('div');
        const keyEl = document.createElement('kbd'); keyEl.textContent = key;
        const labelEl = document.createElement('span'); labelEl.textContent = label;
        chip.append(keyEl, labelEl); controls.append(chip);
      });
      shell.append(controls);
    }

    const track = document.createElement('div'); track.className = 'tutorial-progress';
    const fill = document.createElement('i'); fill.dataset.tutorialProgress = '';
    fill.style.width = `${Math.max(3, Math.min(100, this.progress * 100))}%`;
    track.append(fill); shell.append(track);
    const actions = document.createElement('div'); actions.className = 'tutorial-actions';
    const exit = document.createElement('button'); exit.type = 'button'; exit.className = 'btn btn-secondary btn-sm'; exit.textContent = 'Sair do tutorial';
    exit.addEventListener('click', () => this.onExit?.()); actions.append(exit);
    if (step.manual) {
      const next = document.createElement('button'); next.type = 'button'; next.className = 'btn btn-primary btn-sm';
      next.textContent = step.id === 'finish' ? 'Concluir' : 'Começar';
      next.addEventListener('click', () => this.next()); actions.append(next);
    }
    shell.append(actions);
    this.root.replaceChildren(shell);
  }
}
