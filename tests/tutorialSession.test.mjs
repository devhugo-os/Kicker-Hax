import test from 'node:test';
import assert from 'node:assert/strict';
import { TUTORIAL_STEPS, TutorialSession } from '../client/tutorial/tutorialSession.js';

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
  assert.ok(TUTORIAL_STEPS.every(step => step.title && step.text && step.objective));
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
  validAttempt.record('goal', { side: 'blue' });
  assert.equal(validAttempt.successes, 1);
  validAttempt.destroy();
});
