import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateFile, MAX_FILE_BYTES } from '../src/lib/files.js';

/** Simule un objet File minimal (le DOM n'existe pas en Node). */
const fakeFile = ({ name = 'test.jpg', type = 'image/jpeg', size = 1024 } = {}) => ({ name, type, size });

test('fichier valide accepté', () => {
  const r = validateFile(fakeFile(), { acceptTypes: ['image/jpeg'] });
  assert.deepEqual(r, { ok: true });
});

test('fichier vide (0 octet) refusé avec message', () => {
  const r = validateFile(fakeFile({ size: 0 }), { acceptTypes: ['image/jpeg'] });
  assert.equal(r.ok, false);
  assert.match(r.error, /empty/);
});

test('fichier trop gros refusé', () => {
  const r = validateFile(fakeFile({ size: MAX_FILE_BYTES + 1 }), { acceptTypes: ['image/jpeg'] });
  assert.equal(r.ok, false);
  assert.match(r.error, /larger than the 50 MB limit/);
});

test('mauvais format refusé, formats acceptés listés', () => {
  const r = validateFile(fakeFile({ name: 'doc.txt', type: 'text/plain', size: 10 }), {
    acceptTypes: ['image/jpeg'],
    acceptExts: ['.jpg'],
  });
  assert.equal(r.ok, false);
  assert.match(r.error, /Unsupported format/);
  assert.match(r.error, /\.jpg/);
});

test('type MIME vide mais extension correcte → accepté (cas navigateurs exotiques)', () => {
  const r = validateFile(fakeFile({ name: 'photo.jpg', type: '', size: 10 }), {
    acceptTypes: ['image/jpeg'],
    acceptExts: ['.jpg', '.jpeg'],
  });
  assert.equal(r.ok, true);
});

test('extension en majuscules acceptée', () => {
  const r = validateFile(fakeFile({ name: 'PHOTO.JPG', type: '', size: 10 }), { acceptExts: ['.jpg'] });
  assert.equal(r.ok, true);
});

test('aucun fichier → refus', () => {
  assert.equal(validateFile(null).ok, false);
});

test('aucune règle de type : tout fichier non vide passe', () => {
  assert.equal(validateFile(fakeFile({ name: 'x.bin', type: 'application/octet-stream' })).ok, true);
});

test('fichier à la limite exacte accepté', () => {
  assert.equal(validateFile(fakeFile({ size: MAX_FILE_BYTES })).ok, true);
});
