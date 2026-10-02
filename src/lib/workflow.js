/**
 * Workflow engine: chain resize → compress → convert into one pipeline,
 * then run it over a batch of files. Steps are merged into a single render
 * pass — the result is identical to sequential application, just faster.
 */
import { decodeImage, renderToBlob, renameWithExt } from './image.js';

export const STEP_TYPES = {
  resize: {
    label: 'Resize',
    describe: (s) => `Max ${s.maxSide} px on the longest side`,
  },
  compress: {
    label: 'Compress',
    describe: (s) => `Quality ${s.quality} %`,
  },
  convert: {
    label: 'Convert',
    describe: (s) => `To ${(s.format || '').replace('image/', '').toUpperCase()}`,
  },
};

export const WORKFLOW_PRESETS = [
  {
    name: 'Optimize for web',
    steps: [
      { type: 'resize', maxSide: 1920 },
      { type: 'compress', quality: 80 },
      { type: 'convert', format: 'image/webp' },
    ],
  },
  {
    name: 'Email-friendly',
    steps: [
      { type: 'resize', maxSide: 1280 },
      { type: 'compress', quality: 70 },
      { type: 'convert', format: 'image/jpeg' },
    ],
  },
  {
    name: 'Thumbnails',
    steps: [
      { type: 'resize', maxSide: 256 },
      { type: 'compress', quality: 85 },
      { type: 'convert', format: 'image/jpeg' },
    ],
  },
];

/** Merge a step list into a single render spec. Later steps win. */
export function mergeSteps(steps) {
  const spec = { maxSide: null, quality: null, format: null };
  for (const step of steps) {
    if (step.type === 'resize') spec.maxSide = Number(step.maxSide) || null;
    else if (step.type === 'compress') spec.quality = Number(step.quality) || null;
    else if (step.type === 'convert') spec.format = step.format || null;
  }
  return spec;
}

/**
 * Run the pipeline over one file.
 * @returns {Promise<{blob: Blob, name: string, before: number, after: number, width: number, height: number}>}
 */
export async function runPipeline(file, steps) {
  const spec = mergeSteps(steps);
  const img = await decodeImage(file);
  try {
    let { width, height } = img;
    if (spec.maxSide) {
      const longest = Math.max(width, height);
      if (longest > spec.maxSide) {
        const scale = spec.maxSide / longest;
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
      }
    }
    const originalType = file.type || 'image/jpeg';
    const format = spec.format || (['image/jpeg', 'image/png', 'image/webp'].includes(originalType) ? originalType : 'image/png');
    const quality = (spec.quality ?? 90) / 100;
    const blob = await renderToBlob(img.source, { width, height, format, quality });
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    return {
      blob,
      name: renameWithExt(file.name, ext),
      before: file.size,
      after: blob.size,
      width,
      height,
    };
  } finally {
    img.close();
  }
}

export function describeWorkflow(steps) {
  return steps.map((s) => STEP_TYPES[s.type]?.label).filter(Boolean).join(' → ') || 'No steps yet';
}

/* ================= V4 — validation before run ================= */

/**
 * Validate a step list BEFORE running. Returns an array of issues
 * (empty = runnable). Messages are human-readable: Cause + Action.
 */
export function validateWorkflowSteps(steps) {
  const issues = [];
  if (!Array.isArray(steps) || steps.length === 0) {
    issues.push({ index: -1, message: 'The pipeline is empty. Action: add at least one step (Resize, Compress or Convert).' });
    return issues;
  }
  steps.forEach((step, i) => {
    if (!step || !STEP_TYPES[step.type]) {
      issues.push({ index: i, message: `Step ${i + 1} is not a valid operation. Action: remove it or replace it.` });
      return;
    }
    if (step.type === 'resize') {
      const n = Number(step.maxSide);
      if (!Number.isFinite(n) || n < 16 || n > 8192) {
        issues.push({ index: i, message: `Step ${i + 1} — Resize target must be between 16 and 8192 px (currently “${step.maxSide}”). Action: set a size inside that range.` });
      }
    } else if (step.type === 'compress') {
      const n = Number(step.quality);
      if (!Number.isFinite(n) || n < 10 || n > 100) {
        issues.push({ index: i, message: `Step ${i + 1} — Quality must be between 10 and 100 % (currently “${step.quality}”). Action: pick a value inside that range.` });
      }
    } else if (step.type === 'convert') {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(step.format)) {
        issues.push({ index: i, message: `Step ${i + 1} — Unknown target format “${step.format || ''}”. Action: choose WebP, JPG or PNG.` });
      }
    }
  });
  return issues;
}

/* ================= V4 — strict JSON export/import ================= */

export const WORKFLOW_EXPORT_VERSION = 1;

/** Serialize workflows for download. */
export function exportWorkflowsJSON(workflows) {
  return JSON.stringify(
    {
      app: 'quicktools',
      kind: 'workflows',
      version: WORKFLOW_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      workflows: workflows.map((wf) => ({
        name: String(wf.name || 'Workflow').slice(0, 60),
        steps: wf.steps.map((s) => ({ ...s })),
      })),
    },
    null,
    2
  );
}

/**
 * Strict parser: never throws on bad input — returns {ok, workflows?, error?}.
 * Never executes anything; importing only registers workflows into the saved list.
 */
export function parseWorkflowsJSON(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'This is not valid JSON. Action: export again from QuickTools, or fix the file.' };
  }
  if (!data || typeof data !== 'object' || data.app !== 'quicktools' || data.kind !== 'workflows') {
    return { ok: false, error: 'This JSON was not exported by QuickTools. Action: use a file exported from the Workflows page.' };
  }
  if (!Array.isArray(data.workflows) || data.workflows.length === 0) {
    return { ok: false, error: 'The file contains no workflows. Action: export at least one saved workflow.' };
  }
  const out = [];
  for (const wf of data.workflows) {
    if (!wf || typeof wf.name !== 'string' || !wf.name.trim() || !Array.isArray(wf.steps) || wf.steps.length === 0) {
      return { ok: false, error: 'A workflow in this file is missing a name or its steps. Action: re-export from QuickTools.' };
    }
    const steps = [];
    for (const s of wf.steps) {
      if (!s || !STEP_TYPES[s.type]) {
        return { ok: false, error: `Unknown step type “${s?.type ?? ''}”. Action: this file may come from a newer QuickTools version.` };
      }
      const step = { type: s.type };
      if (s.type === 'resize') {
        const n = Math.round(Number(s.maxSide));
        if (!Number.isFinite(n) || n < 16 || n > 8192) return { ok: false, error: 'A Resize step has an invalid size. Action: fix it in the export file (16–8192 px).' };
        step.maxSide = n;
      } else if (s.type === 'compress') {
        const n = Math.round(Number(s.quality));
        if (!Number.isFinite(n) || n < 10 || n > 100) return { ok: false, error: 'A Compress step has an invalid quality. Action: fix it in the export file (10–100 %).' };
        step.quality = n;
      } else {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(s.format)) return { ok: false, error: 'A Convert step has an unknown format. Action: use image/jpeg, image/png or image/webp.' };
        step.format = s.format;
      }
      steps.push(step);
    }
    out.push({ name: wf.name.trim().slice(0, 60), steps });
  }
  return { ok: true, workflows: out };
}
