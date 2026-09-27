import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeSteps, describeWorkflow, WORKFLOW_PRESETS } from '../src/lib/workflow.js';

test('mergeSteps: later steps win', () => {
  const spec = mergeSteps([
    { type: 'resize', maxSide: 1920 },
    { type: 'compress', quality: 80 },
    { type: 'convert', format: 'image/webp' },
    { type: 'compress', quality: 60 },
  ]);
  assert.deepEqual(spec, { maxSide: 1920, quality: 60, format: 'image/webp' });
});

test('mergeSteps: empty pipeline → all null', () => {
  assert.deepEqual(mergeSteps([]), { maxSide: null, quality: null, format: null });
});

test('describeWorkflow produces a readable chain', () => {
  assert.equal(describeWorkflow(WORKFLOW_PRESETS[0].steps), 'Resize → Compress → Convert');
});

test('presets are well-formed', () => {
  for (const preset of WORKFLOW_PRESETS) {
    assert.ok(preset.name.length > 0);
    assert.ok(Array.isArray(preset.steps) && preset.steps.length >= 2);
    for (const step of preset.steps) {
      assert.ok(['resize', 'compress', 'convert'].includes(step.type));
    }
  }
});
