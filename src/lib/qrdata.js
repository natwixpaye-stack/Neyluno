/** Construction du contenu d'un QR code — fonctions pures, testables. */

/** Échappe les caractères spéciaux du format Wi-Fi (\\ , ; : "). */
export function escapeWifiValue(v) {
  return String(v).replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * @param {'url'|'text'|'email'|'phone'|'sms'|'wifi'} type
 * @param {object} fields champs selon le type
 * @returns {{value: string} | {error: string}}
 */
export function buildQrPayload(type, fields = {}) {
  switch (type) {
    case 'url': {
      let url = String(fields.url || '').trim();
      if (!url) return { error: 'Enter a web address.' };
      if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) url = `https://${url}`;
      if (!/^https?:\/\/.+\..+/.test(url) && !url.startsWith('https://localhost')) {
        return { error: 'That address doesn’t look valid (e.g. https://example.com).' };
      }
      return { value: url };
    }
    case 'text': {
      const text = String(fields.text || '').trim();
      if (!text) return { error: 'Enter some text.' };
      if (text.length > 2000) return { error: 'Text is too long for a QR code (2000 characters max).' };
      return { value: text };
    }
    case 'email': {
      const to = String(fields.to || '').trim();
      if (!to) return { error: 'Enter an email address.' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) return { error: 'That email address is not valid.' };
      const params = new URLSearchParams();
      if (fields.subject) params.set('subject', fields.subject);
      if (fields.body) params.set('body', fields.body);
      const qs = params.toString();
      return { value: `mailto:${to}${qs ? `?${qs}` : ''}` };
    }
    case 'phone': {
      const raw = String(fields.phone || '').trim();
      const cleaned = raw.replace(/[\s.-]/g, '');
      if (!cleaned) return { error: 'Enter a phone number.' };
      if (!/^\+?[0-9]{6,15}$/.test(cleaned)) return { error: 'That phone number is not valid (6 to 15 digits).' };
      return { value: `tel:${cleaned}` };
    }
    case 'sms': {
      const raw = String(fields.phone || '').trim().replace(/[\s.-]/g, '');
      if (!raw) return { error: 'Enter a phone number.' };
      if (!/^\+?[0-9]{6,15}$/.test(raw)) return { error: 'That phone number is not valid (6 to 15 digits).' };
      const msg = String(fields.message || '').trim();
      return { value: msg ? `smsto:${raw}:${msg}` : `smsto:${raw}` };
    }
    case 'wifi': {
      const ssid = String(fields.ssid || '').trim();
      if (!ssid) return { error: 'Enter the network name (SSID).' };
      const security = fields.security || 'WPA';
      if (security === 'nopass') return { value: `WIFI:T:nopass;S:${escapeWifiValue(ssid)};;` };
      const pass = String(fields.password || '');
      if (!pass) return { error: 'Enter the network password.' };
      return { value: `WIFI:T:${security};S:${escapeWifiValue(ssid)};P:${escapeWifiValue(pass)};;` };
    }
    default:
      return { error: 'Unknown content type.' };
  }
}
