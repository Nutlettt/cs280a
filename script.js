/* ================================
  Theme toggle with memory & system
  ================================ */

const root = document.documentElement;
const STORAGE_KEY = 'site-theme'; // 'light' | 'dark'

// Detect if the system prefers light mode
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

// Initialize theme: prefer localStorage, fall back to system
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

// Toggle theme and persist choice
function toggleTheme() {
  const isLight = root.classList.contains('theme-light');
  const next = isLight ? 'dark' : 'light';
  try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
  applyTheme(next);
}

// Initialize
initTheme();

// Bind theme toggle button
const btn = document.getElementById('theme-toggle');
if (btn) {
  btn.addEventListener('click', toggleTheme);
}

/* =====================
  Highlight active link
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

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const expandBtn = document.getElementById('sidebar-expand');

function updateSidebarButton() {
  if (sidebar.classList.contains('collapsed')) {
    expandBtn.style.display = 'block';
  } else {
    expandBtn.style.display = 'none';
  }
}

if (sidebar && toggleBtn && expandBtn) {
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    updateSidebarButton();
  });
  expandBtn.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    updateSidebarButton();
  });
  // Initialize button visibility
  updateSidebarButton();
}
