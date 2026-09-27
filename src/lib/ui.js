/** Micro-interactions et utilitaires UI partagés. */

/* ---------- Toasts ---------- */
let stackEl = null;

export function toast(message, type = 'info', timeout = 3600) {
  if (!stackEl) {
    stackEl = document.createElement('div');
    stackEl.className = 'toast-stack';
    stackEl.setAttribute('aria-live', 'polite');
    stackEl.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(stackEl);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.dataset.type = type;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  el.innerHTML = `<span aria-hidden="true" style="font-weight:700">${icon}</span><span></span>`;
  el.lastElementChild.textContent = message;
  stackEl.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, timeout);
}

/* ---------- Téléchargement ---------- */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Laisse le temps au téléchargement de démarrer avant la révocation
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ---------- Presse-papiers ---------- */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback pour contextes non sécurisés / vieux navigateurs
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/* ---------- Apparition au scroll ---------- */
export function initReveal(root = document) {
  const els = root.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Halo qui suit le curseur sur les cartes ---------- */
export function initSpotlight(root = document) {
  if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.addEventListener('pointermove', (e) => {
    const card = e.target.closest?.('.card[data-spotlight]');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--sx', `${e.clientX - r.left}px`);
    card.style.setProperty('--sy', `${e.clientY - r.top}px`);
  }, { passive: true });
}

/* ---------- Placeholder animé (barre de recherche du hero) ---------- */
export function rotatingPlaceholder(input, phrases, interval = 3000) {
  if (!input || !phrases?.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    input.placeholder = phrases[0];
    return;
  }
  let i = 0;
  input.placeholder = phrases[0];
  setInterval(() => {
    if (document.activeElement === input || input.value) return;
    input.style.transition = 'opacity .35s ease';
    input.style.opacity = '0';
    setTimeout(() => {
      i = (i + 1) % phrases.length;
      input.placeholder = phrases[i];
      input.style.opacity = '1';
    }, 350);
  }, interval);
}

/* ---------- Curseurs (remplissage visuel) ---------- */
export function bindRangeFill(range) {
  if (!range) return;
  const update = () => {
    const min = Number(range.min || 0);
    const max = Number(range.max || 100);
    const pct = ((Number(range.value) - min) / (max - min)) * 100;
    range.style.setProperty('--fill', `${pct}%`);
  };
  range.addEventListener('input', update);
  update();
}

/* ---------- Theme (3 states: light / dark / system) ---------- */
export const THEME_KEY = 'qt-theme';

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY); // 'light' | 'dark' | 'system' | null
  } catch {
    return null;
  }
}

/** Resolve a preference into the effective theme. */
export function resolveTheme(pref) {
  if (pref === 'light' || pref === 'dark') return pref;
  if (typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  if (typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'dark'; // site default when no OS preference
}

export function applyTheme(pref) {
  const effective = resolveTheme(pref);
  const stored = pref === null ? 'system' : pref;
  document.documentElement.dataset.theme = effective;
  document.documentElement.dataset.themePref = stored;
  try {
    localStorage.setItem(THEME_KEY, stored);
  } catch {
    /* storage unavailable: theme stays valid for the session */
  }
  // Reflect the preference on every toggle button
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('data-mode', stored);
    btn.setAttribute(
      'aria-label',
      stored === 'dark' ? 'Theme: dark — switch to light' : stored === 'light' ? 'Theme: light — switch to system' : 'Theme: system — switch to dark'
    );
    btn.querySelector('[data-icon-sun]')?.setAttribute('data-active', String(stored === 'light'));
    btn.querySelector('[data-icon-moon]')?.setAttribute('data-active', String(stored === 'dark'));
    btn.querySelector('[data-icon-sys]')?.setAttribute('data-active', String(stored === 'system'));
  });
}

export function initThemeToggle() {
  const order = ['dark', 'light', 'system'];
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.dataset.themePref || 'dark';
      const next = order[(order.indexOf(current) + 1) % order.length];
      applyTheme(next);
    });
  });
  // Follow OS changes while in system mode
  if (typeof matchMedia === 'function') {
    matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', () => {
      if ((document.documentElement.dataset.themePref || '') === 'system') applyTheme('system');
    });
  }
}

/* ---------- Débounce ---------- */
export function debounce(fn, ms = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
