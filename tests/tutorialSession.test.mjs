import test from 'node:test';
import assert from 'node:assert/strict';
import { keyLabel, TUTORIAL_STEPS, TutorialSession, tutorialNeedsAlly } from '../client/tutorial/tutorialSession.js';

test('tutorial covers every core gameplay mechanic in a stable order', () => {
  assert.deepEqual(
    TUTORIAL_STEPS.map(step => step.id),
    ['intro', 'move', 'sprint', 'control', 'pass', 'shoot', 'dribble', 'power', 'tackle', 'goal', 'finish']
  );
  assert.equal(TUTORIAL_STEPS[0].manual, true);
  assert.equal(TUTORIAL_STEPS.at(-1).celebration, true);
  assert.equal(TUTORIAL_STEPS.find(step => step.id === 'shoot').target, 3);
  assert.equal(TUTORIAL_STEPS.find(step => step.id === 'dribble').target, 3);
  assert.equal(TUTORIAL_STEPS.find(step => step.id === 'tackle').target, 3);
  assert.equal(TUTORIAL_STEPS.find(step => step.id === 'pass').target, 3);
  assert.ok(TUTORIAL_STEPS.every(step => step.title && step.text && step.objective));
});

test('writes the desktop space key in full', () => {
  assert.equal(keyLabel(' '), 'Espaço');
  assert.equal(keyLabel('Space'), 'Espaço');
  assert.equal(keyLabel('Spacebar'), 'Espaço');
});

test('shows the friendly CPU only during passing practice', () => {
  assert.equal(tutorialNeedsAlly('pass'), true);
  for (const step of TUTORIAL_STEPS.filter(item => item.id !== 'pass')) {
    assert.equal(tutorialNeedsAlly(step.id), false);
  }
});

test('makes the tutorial card transparent for any player underneath it', () => {
  let isUnder = false;
  const card = {
    getBoundingClientRect: () => ({ left: 400, right: 600, top: 50, bottom: 180 }),
    classList: { toggle: (_name, active) => { isUnder = active; } }
  };
  const session = new TutorialSession({ root: { querySelector: () => card } });
  const canvas = {
    width: 1000,
    height: 600,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 600 })
  };

  session.updateOcclusion([{ x: 900, y: 500, r: 16 }, { x: 500, y: 100, r: 16 }], canvas);
  assert.equal(isUnder, true, 'the CPU should also fade the dialog');
  session.updateOcclusion([{ x: 900, y: 500, r: 16 }], canvas);
  assert.equal(isUnder, false);
});

test('locks the tutorial simulation while success or failure feedback is visible', () => {
  const locks = [];
  const session = new TutorialSession({ root: null, onFeedbackChange: locked => locks.push(locked) });
  session.index = TUTORIAL_STEPS.findIndex(step => step.id === 'dribble');
  session.record('dribble');
  assert.equal(session.feedback?.type, 'success');
  assert.deepEqual(locks, [true]);
  session.destroy();
});

test('clears the previous transition before progressing beyond sprint', () => {
  const session = new TutorialSession({ root: null });
  session.index = TUTORIAL_STEPS.findIndex(step => step.id === 'move');
  session.complete();
  assert.ok(session.advanceTimer);

  session.next();
  assert.equal(session.step.id, 'sprint');
  assert.equal(session.advanceTimer, null);

  for (let frame = 0; frame < 90; frame += 1) {
    session.update({ player: { x: frame, y: 0 }, ball: {}, input: { sprint: true, x: 1, y: 0 } });
  }
  assert.ok(session.advanceTimer, 'sprint should schedule the control lesson');
  session.destroy();
});

test('requires three valid tackles and ignores possession without a confirmed tackle', () => {
  const session = new TutorialSession({ root: null });
  session.index = TUTORIAL_STEPS.findIndex(step => step.id === 'tackle');

  session.update({ player: { x: 0, y: 0 }, ball: { owner: 'p1' }, input: {} });
  assert.equal(session.successes, 0);

  session.record('tackleSuccess');
  assert.equal(session.successes, 1);
  assert.equal(session.progress, 1 / 3);
  session.destroy();
});

test('shooting mission counts only goals after a player kick', () => {
  const session = new TutorialSession({ root: null });
  session.index = TUTORIAL_STEPS.findIndex(step => step.id === 'shoot');

  session.record('goal', { side: 'blue' });
  assert.equal(session.successes, 0);
  assert.equal(session.feedback?.type, 'failed');
  session.destroy();

  const validAttempt = new TutorialSession({ root: null });
  validAttempt.index = TUTORIAL_STEPS.findIndex(step => step.id === 'shoot');
  validAttempt.record('kick');
  validAttempt.update({ player: {}, ball: { owner: null, vx: 12, vy: 0 }, input: {} });
  validAttempt.record('goal', { side: 'blue' });
  assert.equal(validAttempt.successes, 0, 'the ball trajectory must finish before feedback freezes the field');
  validAttempt.update({ player: {}, ball: { owner: null, vx: 0, vy: 0 }, input: {} });
  assert.equal(validAttempt.successes, 1);
  validAttempt.destroy();
});

test('super chute completes only after the ball trajectory finishes', () => {
  const session = new TutorialSession({ root: null });
  session.index = TUTORIAL_STEPS.findIndex(step => step.id === 'power');
  session.record('power');
  session.update({ player: {}, ball: { owner: null, vx: 20, vy: 0 }, input: {} });
  assert.equal(session.feedback, null);
  session.update({ player: {}, ball: { owner: null, vx: 0.1, vy: 0 }, input: {} });
  assert.equal(session.feedback?.type, 'success');
  session.destroy();
});

test('a confirmed bot tackle immediately fails shooting practice', () => {
  const session = new TutorialSession({ root: null });
  session.index = TUTORIAL_STEPS.findIndex(step => step.id === 'shoot');
  session.record('botTackle');
  assert.equal(session.feedback?.type, 'failed');
  assert.match(session.feedback?.text || '', /CPU parou/);
  session.destroy();
});
