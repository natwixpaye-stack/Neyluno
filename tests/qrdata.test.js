import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildQrPayload, escapeWifiValue } from '../src/lib/qrdata.js';

test('url : https conservé', () => {
  assert.deepEqual(buildQrPayload('url', { url: 'https://exemple.fr' }), { value: 'https://exemple.fr' });
});

test('url : protocole ajouté si absent', () => {
  assert.equal(buildQrPayload('url', { url: 'exemple.fr/page' }).value, 'https://exemple.fr/page');
});

test('url : vide → erreur', () => {
  assert.ok(buildQrPayload('url', { url: '  ' }).error);
});

test('url : invalide → erreur', () => {
  assert.ok(buildQrPayload('url', { url: 'pas une url' }).error);
});

test('texte : encodé tel quel', () => {
  assert.equal(buildQrPayload('text', { text: 'Bonjour !' }).value, 'Bonjour !');
});

test('texte : vide → erreur ; trop long → erreur', () => {
  assert.ok(buildQrPayload('text', {}).error);
  assert.ok(buildQrPayload('text', { text: 'x'.repeat(2001) }).error);
});

test('email : mailto avec sujet', () => {
  const r = buildQrPayload('email', { to: 'a@b.fr', subject: 'Hello' });
  assert.equal(r.value, 'mailto:a@b.fr?subject=Hello');
});

test('email : invalide → erreur', () => {
  assert.ok(buildQrPayload('email', { to: 'nope' }).error);
});

test('téléphone : espaces retirés, tel: ajouté', () => {
  assert.equal(buildQrPayload('phone', { phone: '+33 6 12 34 56 78' }).value, 'tel:+33612345678');
});

test('téléphone : lettres refusées', () => {
  assert.ok(buildQrPayload('phone', { phone: 'abc' }).error);
});

test('sms : avec message', () => {
  assert.equal(buildQrPayload('sms', { phone: '0612345678', message: 'Salut' }).value, 'smsto:0612345678:Salut');
});

test('wifi : WPA correctement échappé', () => {
  const r = buildQrPayload('wifi', { ssid: 'Mon;Réseau', security: 'WPA', password: 'p@ss,word' });
  assert.equal(r.value, 'WIFI:T:WPA;S:Mon\\;Réseau;P:p@ss\\,word;;');
});

test('wifi : réseau ouvert sans mot de passe', () => {
  const r = buildQrPayload('wifi', { ssid: 'Café', security: 'nopass' });
  assert.equal(r.value, 'WIFI:T:nopass;S:Café;;');
});

test('wifi : ssid vide → erreur', () => {
  assert.ok(buildQrPayload('wifi', { ssid: '', security: 'WPA' }).error);
});

test('type inconnu → erreur', () => {
  assert.ok(buildQrPayload('autre', {}).error);
});

test('escapeWifiValue : caractères dangereux', () => {
  assert.equal(escapeWifiValue('a;b:c,d"e'), 'a\\;b\\:c\\,d\\"e');
});
