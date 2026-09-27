/** Décodage et conversion d'images côté navigateur (Canvas API). */

/**
 * Décode un fichier image en bitmap.
 * Retourne { source, width, height, close } — toujours appeler close() après usage.
 */
export async function decodeImage(file) {
  let objectUrl = null;
  try {
    if ('createImageBitmap' in globalThis) {
      try {
        const bmp = await createImageBitmap(file);
        return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close?.() };
      } catch {
        // Certains formats (ex. SVG selon les navigateurs) échouent via createImageBitmap → fallback <img>
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
    throw new Error(
      `Impossible de lire cette image. Vérifiez qu'il s'agit bien d'un fichier image valide et non corrompu.`
    );
  }
}

const MAX_DIMENSION = 8192; // garde-fou mémoire (notamment mobile)

/**
 * Redessine la source dans un canvas et exporte en Blob.
 * @param {ImageBitmap|HTMLImageElement} source
 * @param {{width:number, height:number, format?:string, quality?:number}} opts
 */
export async function renderToBlob(source, { width, height, format = 'image/webp', quality = 0.85 } = {}) {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
    throw new Error(`Dimensions trop grandes (${w} × ${h} px). La limite est de ${MAX_DIMENSION} px par côté.`);
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Votre navigateur ne permet pas le traitement d’images (Canvas indisponible).');
  // Fond blanc pour les formats sans transparence
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, w, h);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error(`La conversion au format demandé a échoué. Essayez un autre format de sortie.`))),
      format,
      quality
    );
  });
  // Garde-fou : certains navigateurs (vieux Safari) ré-encodent silencieusement
  // dans un autre format. On transforme ce cas en erreur explicite.
  if (blob.type && blob.type !== format) {
    throw new Error(
      `Votre navigateur ne sait pas encoder le format demandé. Mettez-le à jour ou choisissez un autre format de sortie.`
    );
  }
  return blob;
}

/** Change l'extension d'un nom de fichier. */
export function renameWithExt(fileName, newExt) {
  const base = fileName.replace(/\.[^.]+$/, '') || 'image';
  return `${base}.${newExt}`;
}

/** Dimensions cibles selon un pourcentage. */
export function scaleDimensions(width, height, percent) {
  const p = Math.max(1, Math.min(500, percent)) / 100;
  return { width: Math.max(1, Math.round(width * p)), height: Math.max(1, Math.round(height * p)) };
}

/** Dimensions cibles avec ratio optionnellement verrouillé. */
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
