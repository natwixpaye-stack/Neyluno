import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateWorkflowSteps,
  exportWorkflowsJSON,
  parseWorkflowsJSON,
  WORKFLOW_PRESETS,
} from '../src/lib/workflow.js';

test('validate: empty pipeline rejected', () => {
  const issues = validateWorkflowSteps([]);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].index, -1);
});

test('validate: presets pass', () => {
  for (const preset of WORKFLOW_PRESETS) {
    assert.equal(validateWorkflowSteps(preset.steps).length, 0, preset.name);
  }
});

test('validate: catches bad resize / quality / format with index', () => {
  const issues = validateWorkflowSteps([
    { type: 'resize', maxSide: 5 },
    { type: 'compress', quality: 200 },
    { type: 'convert', format: 'image/bmp' },
  ]);
  assert.equal(issues.length, 3);
  assert.deepEqual(issues.map((i) => i.index), [0, 1, 2]);
  assert.match(issues[0].message, /16 and 8192/);
  assert.match(issues[1].message, /10 and 100/);
  assert.match(issues[2].message, /Unknown target format/);
});

test('export → import round-trip preserves workflows', () => {
  const wfs = [{ name: 'Web', steps: WORKFLOW_PRESETS[0].steps }];
  const json = exportWorkflowsJSON(wfs);
  const parsed = parseWorkflowsJSON(json);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.workflows.length, 1);
  assert.equal(parsed.workflows[0].name, 'Web');
  assert.deepEqual(parsed.workflows[0].steps, WORKFLOW_PRESETS[0].steps);
});

test('import: invalid JSON rejected', () => {
  assert.equal(parseWorkflowsJSON('not json').ok, false);
});

test('import: wrong app/kind rejected', () => {
  assert.equal(parseWorkflowsJSON(JSON.stringify({ hello: 1 })).ok, false);
  assert.equal(parseWorkflowsJSON(JSON.stringify({ app: 'other', kind: 'workflows', workflows: [] })).ok, false);
});

test('import: missing steps / empty name rejected', () => {
  const bad = { app: 'quicktools', kind: 'workflows', version: 1, workflows: [{ name: 'x', steps: [] }] };
  assert.equal(parseWorkflowsJSON(JSON.stringify(bad)).ok, false);
});

test('import: unknown step type rejected', () => {
  const bad = {
    app: 'quicktools',
    kind: 'workflows',
    version: 1,
    workflows: [{ name: 'x', steps: [{ type: 'explode' }] }],
  };
  assert.equal(parseWorkflowsJSON(JSON.stringify(bad)).ok, false);
});

test('import: out-of-range numeric rejected', () => {
  const bad = {
    app: 'quicktools',
    kind: 'workflows',
    version: 1,
    workflows: [{ name: 'x', steps: [{ type: 'resize', maxSide: 999999 }] }],
  };
  assert.equal(parseWorkflowsJSON(JSON.stringify(bad)).ok, false);
});
