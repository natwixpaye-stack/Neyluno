/**
 * QuickTools Flow — rule-based intent → plan engine (no AI, no server).
 * Understands short natural sentences in English and French, detects file types,
 * problems and quantities, and proposes either a tool or a workflow plan.
 * Pure functions, fully testable. Architecture ready for a future AI layer.
 */

const RX = {
  count: /\b(\d{1,4})\b/,
  targetFormat: /\b(?:to|en|vers|into|in)\s+(jpg|jpeg|png|webp|gif|bmp|avif|pdf)\b/,
};

const LEX = {
  image: /\b(photos?|pictures?|images?|imgs?|jpegs?|pngs?|webp|gif|bmp|avatars?|logos?)\b/,
  pdf: /\b(pdfs?|pdf)\b/,
  text: /\b(texte?|texts?|words?|mots?|lines?|lignes?|paragraphs?)\b/,
  json: /\bjson\b/,
  tooBig: /\b(too (big|heavy|large)|reduce|shrink|compress|smaller|lighter|optimize|optimi[sz]e|trop (gros|lourd|grand)|réduire|compresser|alléger|diminuer|taille)\b/,
  convert: /\b(convert|turn|change|transform|convertir|changer|transformer|passer)\b/,
  email: /\b(e-?mails?|mails?|attach(ments?)?|envoi|envoyer|pièce jointe|pj)\b/,
  merge: /\b(merge|combine|join|fusionner|assembler|regrouper)\b/,
  split: /\b(split|extract pages?|diviser|extraire|découper)\b/,
  rotate: /\b(rotate?|pivoter|orientation)\b/,
  clean: /\b(clean|cleanup|tidy|nettoyer|whitespace|espaces|empty lines?|lignes vides)\b/,
  dedupe: /\b(duplicates?|doublons?|dedupe|dédoublonner)\b/,
  diff: /\b(diff|compare|comparer|difference between)\b/,
  count_: /\b(count|compter|how many)\b/,
  calc: /\b(calculat|compute|moyenne|average|percentage|pourcentage|tva|règle de trois)\b/,
  discount: /\b(discount|remise|solde|promo|réduction|reduction|vat|intérêts composés|interets composes|compound)\b/,
  password: /\b(password|mot de passe)\b/,
  qr: /\b(qr)\b/,
  pages: /\bpages?\b/,
  extract_: /\b(extract|extraire|récupérer|recuperer|pull out)\b/,
  textWord: /\b(texte?|text)\b/,
  organize: /\b(organize|organise|reorder|réorganiser|ordonner|supprimer|enlever|retirer|delete|remove)\b/,
};

function has(rx, q) {
  return rx.test(q);
}

/**
 * @param {string} query raw user sentence
 * @returns {null | {id: string, title: string, detail: string, cta: {type: 'tool', slug: string, params?: object} | {type: 'workflow', steps: Array<object>, zip?: boolean}, score: number}}
 */
export function detectFlow(query) {
  const q = String(query || '').toLowerCase().trim();
  if (!q || q.length < 4) return null;

  const count = (q.match(RX.count) || [])[1];
  const target = (q.match(RX.targetFormat) || [])[1];

  // ---- PDF family
  if (has(LEX.pdf, q)) {
    if (has(LEX.merge, q)) {
      return plan('pdf-merge', 'Merge your PDFs into one', 'One document out, pages in order.', { type: 'tool', slug: 'merge-pdf' }, 3);
    }
    // text extraction must be detected BEFORE the generic split rule ("extract" overlaps)
    if (has(LEX.extract_, q) && has(LEX.textWord, q)) {
      return plan('pdf-text', 'Extract the text of your PDF', 'Copy it or download a .txt — no OCR, honest results.', { type: 'tool', slug: 'pdf-to-text' }, 3);
    }
    if (has(LEX.split, q)) {
      return plan('pdf-split', 'Split or extract PDF pages', 'Keep only the pages you need.', { type: 'tool', slug: 'split-pdf' }, 3);
    }
    if (has(LEX.rotate, q)) {
      return plan('pdf-rotate', 'Rotate PDF pages', 'Fix scanned pages in one pass.', { type: 'tool', slug: 'rotate-pdf' }, 3);
    }
    if ((has(LEX.organize, q) || has(LEX.dedupe, q)) && has(LEX.pages, q)) {
      return plan('pdf-organize', 'Reorganize your PDF pages', 'Thumbnails: delete, duplicate, rotate, reorder.', { type: 'tool', slug: 'pdf-organizer' }, 3);
    }
    if (has(LEX.tooBig, q) || has(LEX.email, q)) {
      return plan(
        'pdf-small',
        'Compress your PDF',
        'Rebuilt locally — delivered only if smaller.',
        { type: 'tool', slug: 'compress-pdf' },
        3
      );
    }
  }

  // ---- Image family
  if (has(LEX.image, q)) {
    if (has(LEX.convert, q) && target && target !== 'pdf') {
      const fmt = target === 'jpg' ? 'image/jpeg' : `image/${target}`;
      return plan(
        'img-convert',
        `Convert your images to ${target.toUpperCase()}`,
        'Batch conversion, transparency handled.',
        { type: 'tool', slug: 'image-converter', params: { to: fmt } },
        3
      );
    }
    if (has(LEX.tooBig, q) || has(LEX.email, q)) {
      const steps = [{ type: 'resize', maxSide: 1920 }, { type: 'compress', quality: 78 }];
      const n = count ? ` ${count}` : '';
      return plan(
        'img-optimize',
        `Optimize${n} image${n === ' 1' ? '' : 's'}${has(LEX.email, q) ? ' for email' : ' for the web'}`,
        'Resize → compress → one ZIP, all on your device.',
        { type: 'workflow', steps, zip: true },
        3
      );
    }
    if (has(LEX.rotate, q)) {
      return plan('img-rotate', 'Rotate your images', '90°, 180° or 270°, batch included.', { type: 'tool', slug: 'image-rotator' }, 2);
    }
  }

  // ---- Text family
  if (has(LEX.json, q) && (has(LEX.clean, q) || has(LEX.convert, q) || /pretty|beau|format|readable|lisible/.test(q))) {
    return plan('json-pretty', 'Make your JSON readable', 'Format, validate, and spot errors by line.', { type: 'tool', slug: 'json-formatter' }, 3);
  }
  if (has(LEX.text, q) || has(LEX.clean, q) || has(LEX.dedupe, q)) {
    if (has(LEX.diff, q)) {
      return plan('text-diff', 'Compare two texts', 'Additions and deletions, line by line.', { type: 'tool', slug: 'text-diff' }, 3);
    }
    if (has(LEX.dedupe, q)) {
      return plan('text-dedupe', 'Remove duplicate lines', 'Keeps the first occurrence, keeps order.', { type: 'tool', slug: 'remove-duplicate-lines' }, 3);
    }
    if (has(LEX.clean, q)) {
      return plan('text-clean', 'Clean up your text', 'Spaces, empty lines, line breaks — normalized.', { type: 'tool', slug: 'text-cleaner' }, 3);
    }
    if (has(LEX.count_, q)) {
      return plan('text-count', 'Count words & characters', 'Live stats as you type.', { type: 'tool', slug: 'word-counter' }, 2);
    }
  }

  // ---- Calculators
  if (has(LEX.calc, q) || has(LEX.discount, q)) {
    const detail = has(LEX.discount, q)
      ? 'Percentage mode: “% of”, change, VAT, discounts and compound interest.'
      : 'Basic, scientific, percentage, finance and everyday modes.';
    return plan('calc', 'Open the calculator', detail, { type: 'tool', slug: 'calculator' }, 2);
  }
  if (has(LEX.password, q)) {
    return plan('pass', 'Generate a strong password', 'Real randomness, on your device.', { type: 'tool', slug: 'password-generator' }, 2);
  }
  if (has(LEX.qr, q)) {
    return plan('qr', 'Generate a QR code', 'URL, text, email, phone or Wi-Fi.', { type: 'tool', slug: 'qr-code-generator' }, 2);
  }

  return null;
}

function plan(id, title, detail, cta, score) {
  return { id, title, detail, cta, score };
}

/** Human summary of a workflow plan, for chips and palette rows. */
export function describeFlowPlan(flowPlan) {
  if (!flowPlan) return '';
  if (flowPlan.cta.type === 'workflow') {
    const names = flowPlan.cta.steps.map((s) => (s.type === 'resize' ? 'Resize' : s.type === 'compress' ? 'Compress' : 'Convert'));
    return `${names.join(' → ')}${flowPlan.cta.zip ? ' → ZIP' : ''}`;
  }
  return flowPlan.title;
}
