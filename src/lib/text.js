/** Statistiques de texte — fonction pure, testable. */

/**
 * Convention retenue (documentée dans la FAQ de l'outil) :
 * un mot = suite de lettres/chiffres ; apostrophes et tirets séparent les mots
 * (« l'arbre » compte 2 mots, comme la plupart des correcteurs français).
 */
export function countText(text) {
  const value = typeof text === 'string' ? text : '';
  const chars = [...value].length;
  const charsNoSpaces = [...value.replace(/\s/g, '')].length;

  const words = value.match(/[\p{L}\p{M}\p{N}]+/gu) || [];

  const sentences = value.match(/[.!?…]+["')\]]*(?=\s|$)/gu) || [];

  const paragraphs = value
    .split(/\n\s*\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const lines = value.length === 0 ? [] : value.split('\n');

  const wordCount = words.length;

  return {
    chars,
    charsNoSpaces,
    words: wordCount,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    lines: value.length === 0 ? 0 : lines.length,
    readingTimeMin: Math.ceil(wordCount / 200),
  };
}
