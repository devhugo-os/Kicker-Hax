import test from 'node:test';
import assert from 'node:assert/strict';
import { TUTORIAL_STEPS } from '../client/tutorial/tutorialSession.js';

test('tutorial covers every core gameplay mechanic in a stable order', () => {
  assert.deepEqual(
    TUTORIAL_STEPS.map(step => step.id),
    ['intro', 'move', 'sprint', 'control', 'pass', 'shoot', 'dribble', 'power', 'tackle', 'goal', 'finish']
  );
  assert.equal(TUTORIAL_STEPS[0].manual, true);
  assert.equal(TUTORIAL_STEPS.at(-1).manual, true);
  assert.ok(TUTORIAL_STEPS.every(step => step.title && step.text && step.objective));
});
