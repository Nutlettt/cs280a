/* ================================
   Theme Toggle with Memory & System
   ================================ */

const root = document.documentElement;
const STORAGE_KEY = 'site-theme'; // 'light' | 'dark'

// Determine if the system prefers light mode
function systemPrefersLight() {
  return window.matchMedia &&
         window.matchMedia('(prefers-color-scheme: light)').matches;
}

// Apply theme: switch CSS variables by toggling class on <html>
function applyTheme(theme) {
  if (theme === 'light') {
    root.classList.add('theme-light');
  } else {
    root.classList.remove('theme-light');
  }
}

// Initialize theme: prefer local storage, fall back to system
function initTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
    } else {
      applyTheme(systemPrefersLight() ? 'light' : 'dark');
    }
  } catch {
    // Local storage unavailable: fall back to system preference
    applyTheme(systemPrefersLight() ? 'light' : 'dark');
  }
}

// Toggle theme and save
function toggleTheme() {
  const isLight = root.classList.contains('theme-light');
  const next = isLight ? 'dark' : 'light';
  try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  applyTheme(next);
}

// Initialize
initTheme();

// Bind button
const btn = document.getElementById('theme-toggle');
if (btn) {
  btn.addEventListener('click', toggleTheme);
}

/* =====================
   Highlight Active Link
   ===================== */
(function highlightActiveLink() {
  const here = window.location.pathname.replace(/\/index\.html?$/, '/');
  const links = document.querySelectorAll('nav a[href]');
  links.forEach(a => {
    const url = new URL(a.getAttribute('href'), window.location.origin);
    const path = url.pathname.replace(/\/index\.html?$/, '/');
    if (path === here) a.classList.add('active');
  });
})();
