const AUTO_ADVANCE_MS = 700;

export function keyLabel(value) {
  if (!value) return '?';
  const key = String(value);
  if (key === ' ' || key === 'Space' || key === 'Spacebar') return 'Espaço';
  return key.replace(/^Key/, '').replace(/^Digit/, '').replace('ShiftLeft', 'Shift');
}

function buildControlChips(controls, mobile) {
  if (mobile) {
    return [
      ['🕹️', 'Mover'], ['⚡', 'Segure para correr'], ['🥾', 'Segure para chutar / passar'],
      ['✨', 'Driblar'], ['🛡️', 'Desarmar'], ['🔥', 'Super chute'], ['🙋', 'Pedir passe']
    ];
  }
  return [
    [`${keyLabel(controls.up)} ${keyLabel(controls.left)} ${keyLabel(controls.down)} ${keyLabel(controls.right)}`, 'Mover'],
    [keyLabel(controls.sprint), 'Correr'], [keyLabel(controls.shoot), 'Chutar / passar'],
    [keyLabel(controls.dribble), 'Driblar'], [keyLabel(controls.tackle), 'Desarmar'],
    [keyLabel(controls.power), 'Super chute'], [keyLabel(controls.requestPass), 'Pedir passe'],
    ['Enter', 'Chat online'], ['Esc', 'Pausa']
  ];
}

export function tutorialNeedsAlly(stepId) {
  return ['requestPass', 'pass'].includes(stepId);
}

export function tutorialNeedsEnemy(stepId) {
  // Chute normal and super chute are technique lessons. The rival returns for
  // dribbling, tackling and the final challenge that combines every mechanic.
  return ['dribble', 'tackle', 'goal'].includes(stepId);
}

export function tutorialNeedsBall(stepId) {
  return !['move', 'sprint'].includes(stepId);
}

export const TUTORIAL_STEPS = [
  { id: 'intro', manual: true, speaker: 'Coach KH', title: 'Bem-vindo ao campo!', text: 'Vou acompanhar você em uma sequência prática. Cada objetivo usa a mesma física das partidas reais.', objective: 'Conheça seus comandos e clique em Começar.', showControls: true },
  { id: 'move', speaker: 'Coach KH', title: 'Movimentação', text: 'Mude de direção e conheça o espaço ao seu redor.', objective: 'Percorra o campo até completar a barra.' },
  { id: 'sprint', speaker: 'Coach KH', title: 'Corrida e stamina', text: 'Correr aumenta sua velocidade, mas consome stamina. Solte o comando para recuperá-la.', mobileText: 'Segure o botão de correr enquanto usa o analógico. Solte o botão para recuperar stamina.', objective: 'Corra enquanto se movimenta.' },
  { id: 'control', speaker: 'Coach KH', title: 'Domínio da bola', text: 'Aproxime-se da bola para dominá-la. O círculo preso ao jogador indica a posse.', objective: 'Pegue a bola.' },
  { id: 'requestPass', speaker: 'CPU Parceiro', title: 'Peça a bola', text: 'Quando estiver livre, sinalize para um companheiro. O pedido aparece sobre seu jogador e possui um pequeno tempo de recarga.', mobileText: 'Toque no botão 🙋 para pedir a bola. A CPU parceira vai responder ao sinal.', objective: 'Peça a bola e receba o passe da CPU amigável.' },
  { id: 'pass', target: 3, speaker: 'CPU Parceiro', title: 'Passe', text: 'Chute normal e super chute também podem virar passe. Mire no parceiro e entregue a bola.', objective: 'Complete 3 passes para a CPU amigável.' },
  { id: 'shoot', target: 3, speaker: 'Coach KH', title: 'Chute normal carregado', text: 'Use somente o chute normal: segure o comando e vença a CPU. Não use o super chute nesta missão. Defesa, desarme ou chute para fora reiniciam a tentativa.', mobileText: 'Segure somente o botão da chuteira e solte para finalizar. O botão de super chute não vale nesta missão. Só um gol confirmado conta.', objective: 'Marque 3 gols usando apenas o chute normal.' },
  { id: 'dribble', target: 3, speaker: 'Coach KH', title: 'Drible contínuo', text: 'Faça três dribles em sequência. Cada um só conta depois que todo o impulso termina com você ainda na posse.', objective: 'Complete 3 dribles seguidos com a posse da bola.' },
  { id: 'power', speaker: 'Coach KH', title: 'Super chute', text: 'O super chute exige bastante stamina. Use quando tiver espaço e energia.', objective: 'Execute um super chute.' },
  { id: 'tackle', target: 3, speaker: 'CPU Rival', title: 'Desarme', text: 'Conclua o dash encostando de frente ou de lado. Só conta quando a física confirma que você tomou a bola.', objective: 'Faça 3 desarmes válidos na CPU rival.' },
  { id: 'goal', speaker: 'Coach KH', title: 'Objetivo final', text: 'Combine movimentação, corrida e drible. Finalize com um chute carregado ou um super chute.', mobileText: 'Use o analógico, segure o botão de correr e finalize segurando o chute ou usando o super chute.', objective: 'Marque um gol confirmado no time vermelho.' },
  { id: 'finish', celebration: true, speaker: 'Coach KH', title: 'Tutorial concluído!', text: 'Você dominou os fundamentos do Kicker Hax. Excelente trabalho!', objective: 'Voltando para a seleção de modos...' }
];

/** Coordinates tutorial presentation, repetitions and failures independently from physics. */
export class TutorialSession {
  constructor({ root, controls, mobile = false, onStepChange, onAttemptReset, onFeedbackChange, onFinish, onExit }) {
    Object.assign(this, { root, controls: controls || {}, mobile, onStepChange, onAttemptReset, onFeedbackChange, onFinish, onExit });
    this.index = 0;
    this.progress = 0;
    this.lastPosition = null;
    this.passStarted = false;
    this.attemptActive = false;
    this.attemptFrames = 0;
    this.successes = 0;
    this.feedback = null;
    this.advanceTimer = null;
    this.trajectoryAction = null;
    this.trajectoryMoved = false;
    this.pendingOutcome = null;
    this.dribblePending = false;
    this.tackleRecoveryArmed = false;
    this.passRequestStarted = false;
  }

  get step() { return TUTORIAL_STEPS[this.index]; }
  get enemyActive() { return tutorialNeedsEnemy(this.step?.id); }
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
    this.resetState();
    this.render();
    this.onStepChange?.(this.step, this);
    if (this.step?.celebration) this.advanceTimer = setTimeout(() => this.onFinish?.(), 2600);
  }

  resetState() {
    this.progress = 0;
    this.lastPosition = null;
    this.passStarted = false;
    this.attemptActive = false;
    this.attemptFrames = 0;
    this.successes = 0;
    this.feedback = null;
    this.trajectoryAction = null;
    this.trajectoryMoved = false;
    this.pendingOutcome = null;
    this.dribblePending = false;
    this.tackleRecoveryArmed = false;
    this.passRequestStarted = false;
  }

  complete() {
    if (this.isManual || this.step?.celebration || this.advanceTimer) return;
    this.progress = 1;
    this.feedback = { type: 'success', text: 'Objetivo concluído!' };
    this.onFeedbackChange?.(true, this);
    this.render();
    this.advanceTimer = setTimeout(() => this.next(), AUTO_ADVANCE_MS);
  }

  record(eventName, payload = {}) {
    const id = this.step?.id;
    if (this.feedback || this.isManual || this.step?.celebration) return;
    if (id === 'requestPass' && eventName === 'requestPass') {
      this.passRequestStarted = true;
      this.attemptActive = true;
      this.attemptFrames = 0;
    }
    if (id === 'pass' && ['kick', 'power'].includes(eventName)) {
      this.passStarted = true;
      this.attemptActive = true;
      this.attemptFrames = 0;
    }
    if (id === 'shoot' && eventName === 'kick') {
      this.startTrajectory('shoot');
    }
    if (id === 'shoot' && eventName === 'goal') {
      if (payload.side === 'blue' && this.attemptActive) {
        this.pendingOutcome = { type: 'success', message: 'Gol confirmado!' };
      } else if (payload.side === 'blue') {
        this.fail('Missão falhou: o gol só conta depois de um chute confirmado.');
      } else {
        this.fail('Missão falhou: a CPU marcou o gol.');
      }
      return;
    }
    if (id === 'shoot' && eventName === 'botTackle') {
      const outcome = { type: 'failed', message: 'Missão falhou: a CPU parou você com um desarme.' };
      if (this.trajectoryAction === 'shoot') this.pendingOutcome = outcome;
      else this.fail(outcome.message);
      return;
    }
    if (id === 'dribble' && eventName === 'dribble' && !this.dribblePending) {
      this.dribblePending = true;
      this.attemptActive = true;
    }
    if (id === 'power' && eventName === 'power') this.startTrajectory('power');
    if (id === 'power' && eventName === 'goal') {
      this.pendingOutcome = { type: 'success', message: 'Super chute concluído!' };
      return;
    }
    if (id === 'tackle' && eventName === 'tackleSuccess') this.registerSuccess('Desarme confirmado!');
    if (id === 'tackle' && eventName === 'botKick') this.tackleRecoveryArmed = true;
    if (id === 'tackle' && eventName === 'tackleFailed') this.fail(payload.message || 'Missão falhou: o desarme não tirou a bola.');
    if (id === 'tackle' && eventName === 'goal' && payload.side === 'red') this.fail('Missão falhou: a CPU marcou antes do desarme.');
    if (['shoot', 'goal'].includes(id) && eventName === 'botTackle') this.fail('Missão falhou: a CPU parou você com um desarme.');
    if (id === 'goal' && eventName === 'goal') {
      if (payload.side === 'blue' && this.attemptActive) this.complete();
      else if (payload.side === 'blue') this.fail('Missão falhou: finalize a jogada com chute ou super chute.');
      else this.fail('Missão falhou: a CPU marcou. Tente novamente.');
    }
    if (id === 'goal' && ['kick', 'power'].includes(eventName)) this.attemptActive = true;
  }

  startTrajectory(action) {
    this.trajectoryAction = action;
    this.trajectoryMoved = false;
    this.pendingOutcome = null;
    this.attemptActive = true;
    this.attemptFrames = 0;
  }

  finishTrajectory(outcome = this.pendingOutcome) {
    this.trajectoryAction = null;
    this.pendingOutcome = null;
    this.attemptActive = false;
    if (outcome?.type === 'failed') this.fail(outcome.message);
    else if (this.step?.id === 'shoot' && outcome?.type === 'success') this.registerSuccess(outcome.message || 'Gol confirmado!');
    else if (this.step?.id === 'shoot') this.fail('Missão falhou: o chute não entrou no gol.');
    else this.complete();
  }

  registerContinuousSuccess(message) {
    const target = Math.max(1, Number(this.step?.target || 1));
    this.successes += 1;
    this.progress = Math.min(1, this.successes / target);
    this.dribblePending = false;
    this.attemptActive = false;
    if (this.successes >= target) {
      this.complete();
      return;
    }
    this.render();
    this.refreshProgress();
  }

  registerSuccess(message) {
    const target = Math.max(1, Number(this.step?.target || 1));
    this.successes += 1;
    this.progress = Math.min(1, this.successes / target);
    if (this.successes >= target) {
      this.complete();
      return;
    }
    this.feedback = { type: 'success', text: `${message} ${this.successes}/${target}` };
    this.onFeedbackChange?.(true, this);
    this.render();
    this.scheduleAttemptReset();
  }

  fail(message) {
    if (this.feedback || this.advanceTimer) return;
    this.feedback = { type: 'failed', text: message || 'Missão falhou. Tente novamente.' };
    this.onFeedbackChange?.(true, this);
    this.attemptActive = false;
    this.render();
    this.scheduleAttemptReset(1100);
  }

  scheduleAttemptReset(delay = 750) {
    clearTimeout(this.advanceTimer);
    this.advanceTimer = setTimeout(() => {
      this.advanceTimer = null;
      this.feedback = null;
      this.attemptActive = false;
      this.attemptFrames = 0;
      this.passStarted = false;
      this.trajectoryAction = null;
      this.trajectoryMoved = false;
      this.pendingOutcome = null;
      this.dribblePending = false;
      this.tackleRecoveryArmed = false;
      this.passRequestStarted = false;
      this.onFeedbackChange?.(false, this);
      this.render();
      this.onAttemptReset?.(this.step, this);
    }, delay);
  }

  update({ player, players, ball, input, canvas }) {
    this.updateOcclusion(players || player, canvas);
    if (!player || !ball || this.isManual || this.step?.celebration || this.progress >= 1 || this.feedback) return;
    const id = this.step?.id;
    if (id === 'shoot' || id === 'power') {
      if (this.trajectoryAction === id) {
        const speed = Math.hypot(Number(ball.vx || 0), Number(ball.vy || 0));
        this.attemptFrames += 1;
        if (speed > 0.8) this.trajectoryMoved = true;
        if (id === 'shoot' && ball.owner === 'cpu' && !this.pendingOutcome) {
          this.pendingOutcome = { type: 'failed', message: 'Missão falhou: a CPU defendeu ou tomou a bola.' };
        }
        const trajectoryEnded = this.trajectoryMoved && (speed < 0.45 || !!ball.owner || !!this.pendingOutcome);
        if (trajectoryEnded) this.finishTrajectory();
        else if (this.attemptFrames > 300) {
          this.finishTrajectory(id === 'power'
            ? { type: 'success', message: 'Super chute concluído!' }
            : { type: 'failed', message: 'Missão falhou: o chute não entrou.' });
        }
      }
      this.refreshProgress();
      return;
    }
    if (id === 'move') {
      if (this.lastPosition) this.progress += Math.hypot(player.x - this.lastPosition.x, player.y - this.lastPosition.y) / 420;
      this.lastPosition = { x: player.x, y: player.y };
    } else if (id === 'sprint' && input?.sprint && Math.abs(input.x) + Math.abs(input.y) > 0.2) {
      this.progress += 1 / 85;
    } else if (id === 'control' && ball.owner === 'p1') this.progress = 1;
    else if (id === 'requestPass' && this.passRequestStarted && ball.owner === 'p1') this.complete();
    else if (id === 'requestPass' && this.passRequestStarted && ++this.attemptFrames > 240) this.fail('Missão falhou: aproxime-se e peça a bola novamente.');
    else if (id === 'pass' && this.passStarted && ball.owner === 'tutorial-ally') this.registerSuccess('Passe completo!');
    else if (id === 'pass' && this.attemptActive && ++this.attemptFrames > 240) this.fail('Missão falhou: o passe não chegou ao parceiro.');
    else if (id === 'dribble' && this.dribblePending && Number(player.dash_time || 0) <= 0) {
      if (ball.owner === 'p1') this.registerContinuousSuccess('Drible completo!');
      else this.fail('Missão falhou: você perdeu a bola durante o drible.');
    } else if (id === 'tackle' && this.tackleRecoveryArmed && ball.owner === 'p1') {
      // Recovering a bad CPU shot is still a defensive ball recovery and
      // therefore counts toward the tackling lesson requested by the player.
      this.tackleRecoveryArmed = false;
      this.registerSuccess('Recuperação defensiva confirmada!');
    }
    if (this.progress >= 1) this.complete(); else this.refreshProgress();
  }

  updateOcclusion(players, canvas) {
    const card = this.root?.querySelector('.tutorial-card');
    const trackedPlayers = Array.isArray(players) ? players : [players].filter(Boolean);
    if (!card || trackedPlayers.length === 0 || !canvas?.getBoundingClientRect) return;
    const canvasRect = canvas.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const scaleX = canvasRect.width / Math.max(1, canvas.width || canvasRect.width);
    const scaleY = canvasRect.height / Math.max(1, canvas.height || canvasRect.height);
    const under = trackedPlayers.some(player => {
      const x = canvasRect.left + player.x * scaleX;
      const y = canvasRect.top + player.y * scaleY;
      const radius = Math.max(12, (player.r || 22) * Math.max(scaleX, scaleY));
      return x + radius >= cardRect.left && x - radius <= cardRect.right
        && y + radius >= cardRect.top && y - radius <= cardRect.bottom;
    });
    card.classList.toggle('is-player-under', under);
  }

  refreshProgress() {
    const fill = this.root?.querySelector('[data-tutorial-progress]');
    if (fill) fill.style.width = `${Math.max(3, Math.min(100, this.progress * 100))}%`;
  }

  render() {
    if (!this.root || !this.step) return;
    const step = this.step;
    const shell = document.createElement('section');
    shell.className = `tutorial-card${step.manual ? ' tutorial-dialog' : ''}${step.celebration ? ' tutorial-celebration' : ''}${this.feedback?.type === 'failed' ? ' is-failed' : ''}${this.progress >= 1 ? ' is-complete' : ''}`;
    shell.setAttribute('aria-live', 'polite');

    const top = document.createElement('div');
    top.className = 'tutorial-topline';
    const speaker = document.createElement('strong'); speaker.textContent = step.speaker;
    const count = document.createElement('span');
    count.textContent = `Etapa ${Math.min(this.index + 1, TUTORIAL_STEPS.length - 1)}/${TUTORIAL_STEPS.length - 1}`;
    top.append(speaker, count);
    const title = document.createElement('h3'); title.textContent = step.title;
    const text = document.createElement('p'); text.textContent = this.mobile && step.mobileText ? step.mobileText : step.text;
    const objective = document.createElement('div'); objective.className = 'tutorial-objective';
    const target = Math.max(1, Number(step.target || 1));
    objective.textContent = this.feedback?.text || (this.progress >= 1
      ? 'Objetivo concluído!'
      : `${step.objective}${target > 1 ? ` (${this.successes}/${target})` : ''}`);
    shell.append(top, title, text, objective);

    if (step.showControls) {
      const controls = document.createElement('div'); controls.className = 'tutorial-controls-grid';
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
    if (!step.celebration) {
      const actions = document.createElement('div'); actions.className = 'tutorial-actions';
      const exit = document.createElement('button'); exit.type = 'button'; exit.className = 'btn btn-secondary btn-sm'; exit.textContent = 'Sair do tutorial';
      exit.addEventListener('click', () => this.onExit?.()); actions.append(exit);
      if (step.manual) {
        const next = document.createElement('button'); next.type = 'button'; next.className = 'btn btn-primary btn-sm'; next.textContent = 'Começar';
        next.addEventListener('click', () => this.next()); actions.append(next);
      }
      shell.append(actions);
    }
    this.root.replaceChildren(shell);
  }
}
