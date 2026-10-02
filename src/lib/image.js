/** Image decoding and conversion in the browser (Canvas API). */

/**
 * Decode an image file into a drawable source.
 * Returns { source, width, height, close } — always call close() when done.
 */
export async function decodeImage(file) {
  let objectUrl = null;
  try {
    if ('createImageBitmap' in globalThis) {
      try {
        const bmp = await createImageBitmap(file);
        return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close?.() };
      } catch {
        // Some formats (e.g. SVG in some browsers) fail via createImageBitmap → <img> fallback
      }
    }
    objectUrl = URL.createObjectURL(file);
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('decode-failed'));
      el.src = objectUrl;
    });
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      close: () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      },
    };
  } catch (err) {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    throw new Error('This image could not be read. Make sure the file is a valid, non-corrupted image.');
  }
}

const MAX_DIMENSION = 8192; // memory guard (especially mobile)

/**
 * Redraw the source into a canvas and export as a Blob.
 * @param {ImageBitmap|HTMLImageElement} source
 * @param {{width:number, height:number, format?:string, quality?:number, background?:string}} opts
 */
export async function renderToBlob(source, { width, height, format = 'image/webp', quality = 0.85, background = '#ffffff' } = {}) {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
    throw new Error(`Image too large (${w} × ${h} px). The limit is ${MAX_DIMENSION} px per side.`);
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser cannot process images (Canvas unavailable).');
  // Solid background for formats without transparency
  if (format === 'image/jpeg') {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, w, h);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Converting to the requested format failed. Try a different output format.'))),
      format,
      quality
    );
  });
  // Guard: some browsers (older Safari) silently re-encode to another format.
  if (blob.type && blob.type !== format) {
    throw new Error('Your browser cannot encode the requested format. Update your browser or pick another format.');
  }
  return blob;
}

/** Replace a file name's extension. */
export function renameWithExt(fileName, newExt) {
  const base = fileName.replace(/\.[^.]+$/, '') || 'image';
  return `${base}.${newExt}`;
}

/** Target dimensions for a percentage scale. */
export function scaleDimensions(width, height, percent) {
  const p = Math.max(1, Math.min(500, percent)) / 100;
  return { width: Math.max(1, Math.round(width * p)), height: Math.max(1, Math.round(height * p)) };
}

/** Target dimensions with an optionally locked aspect ratio. */
export function fitDimensions({ width, height, targetWidth, targetHeight, keepRatio }) {
  if (keepRatio) {
    if (targetWidth) {
      const ratio = height / width;
      return { width: targetWidth, height: Math.max(1, Math.round(targetWidth * ratio)) };
    }
    if (targetHeight) {
      const ratio = width / height;
      return { width: Math.max(1, Math.round(targetHeight * ratio)), height: targetHeight };
    }
    return { width, height };
  }
  return { width: targetWidth || width, height: targetHeight || height };
}
