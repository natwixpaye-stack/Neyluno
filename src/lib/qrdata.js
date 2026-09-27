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
      if (!url) return { error: 'Saisissez une adresse web.' };
      if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) url = `https://${url}`;
      if (!/^https?:\/\/.+\..+/.test(url) && !url.startsWith('https://localhost')) {
        return { error: 'Cette adresse ne semble pas valide (ex. https://exemple.fr).' };
      }
      return { value: url };
    }
    case 'text': {
      const text = String(fields.text || '').trim();
      if (!text) return { error: 'Saisissez un texte.' };
      if (text.length > 2000) return { error: 'Texte trop long pour un QR code (maximum 2000 caractères).' };
      return { value: text };
    }
    case 'email': {
      const to = String(fields.to || '').trim();
      if (!to) return { error: 'Saisissez une adresse e-mail.' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) return { error: 'Adresse e-mail invalide.' };
      const params = new URLSearchParams();
      if (fields.subject) params.set('subject', fields.subject);
      if (fields.body) params.set('body', fields.body);
      const qs = params.toString();
      return { value: `mailto:${to}${qs ? `?${qs}` : ''}` };
    }
    case 'phone': {
      const raw = String(fields.phone || '').trim();
      const cleaned = raw.replace(/[\s.-]/g, '');
      if (!cleaned) return { error: 'Saisissez un numéro de téléphone.' };
      if (!/^\+?[0-9]{6,15}$/.test(cleaned)) return { error: 'Numéro de téléphone invalide (6 à 15 chiffres).' };
      return { value: `tel:${cleaned}` };
    }
    case 'sms': {
      const raw = String(fields.phone || '').trim().replace(/[\s.-]/g, '');
      if (!raw) return { error: 'Saisissez un numéro de téléphone.' };
      if (!/^\+?[0-9]{6,15}$/.test(raw)) return { error: 'Numéro de téléphone invalide (6 à 15 chiffres).' };
      const msg = String(fields.message || '').trim();
      return { value: msg ? `smsto:${raw}:${msg}` : `smsto:${raw}` };
    }
    case 'wifi': {
      const ssid = String(fields.ssid || '').trim();
      if (!ssid) return { error: 'Saisissez le nom du réseau (SSID).' };
      const security = fields.security || 'WPA';
      if (security === 'nopass') return { value: `WIFI:T:nopass;S:${escapeWifiValue(ssid)};;` };
      const pass = String(fields.password || '');
      if (!pass) return { error: 'Saisissez le mot de passe du réseau.' };
      return { value: `WIFI:T:${security};S:${escapeWifiValue(ssid)};P:${escapeWifiValue(pass)};;` };
    }
    default:
      return { error: 'Type de contenu inconnu.' };
  }
}
