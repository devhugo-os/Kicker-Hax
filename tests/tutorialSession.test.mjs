import test from 'node:test';
import assert from 'node:assert/strict';
import { TUTORIAL_STEPS, TutorialSession } from '../client/tutorial/tutorialSession.js';

test('tutorial covers every core gameplay mechanic in a stable order', () => {
  assert.deepEqual(
    TUTORIAL_STEPS.map(step => step.id),
    ['intro', 'move', 'sprint', 'control', 'pass', 'shoot', 'dribble', 'power', 'tackle', 'goal', 'finish']
  );
  assert.equal(TUTORIAL_STEPS[0].manual, true);
  assert.equal(TUTORIAL_STEPS.at(-1).manual, true);
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
