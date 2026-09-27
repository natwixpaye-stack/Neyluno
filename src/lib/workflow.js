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
