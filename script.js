/* ================================
  Theme toggle with memory & system
  ================================ */

const STORAGE_KEY = 'theme';
const DEFAULT_THEME = 'light';
const root = document.documentElement;
const body = document.body;
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  const dark = theme === 'dark';
  const light = !dark;

  root.setAttribute('data-theme', theme);
  body.setAttribute('data-theme', theme);

  const darkClasses = ['dark', 'dark-theme', 'theme-dark', 'mode-dark'];
  const lightClasses = ['light', 'light-theme', 'theme-light', 'mode-light'];

  darkClasses.forEach(cls => {
    root.classList.toggle(cls, dark);
    body.classList.toggle(cls, dark);
  });
  lightClasses.forEach(cls => {
    root.classList.toggle(cls, light);
    body.classList.toggle(cls, light);
  });

  localStorage.setItem(STORAGE_KEY, theme);
  if (themeBtn) {
    themeBtn.title = `Switch to ${dark ? 'light' : 'dark'} theme`;
  }
}

applyTheme(localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME);

themeBtn?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

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

// Sidebar
(function(){
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  function close(){ sidebar.classList.add('collapsed'); overlay && overlay.classList.remove('show'); }
  function open(){ sidebar.classList.remove('collapsed'); overlay && overlay.classList.add('show'); }
  if(toggleBtn && sidebar){
    toggleBtn.addEventListener('click', ()=> sidebar.classList.contains('collapsed') ? open():close());
  }
  if(overlay){ overlay.addEventListener('click', close); }
  sidebar.classList.add('collapsed');
})();

// Image hover + lightbox
document.addEventListener('DOMContentLoaded', () => {
  const imgs = document.querySelectorAll('.gallery img');
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const lbImg = document.getElementById('lightbox-image');
  const lbCap = document.getElementById('lightbox-caption');
  const closeBtn = lb.querySelector('.lb-close');

  imgs.forEach(img=>{
    img.classList.add('zoomable');
    if(!img.dataset.full) img.dataset.full = img.src;
    img.addEventListener('click', ()=>open(img));
    img.tabIndex = 0;
    img.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(img); }
    });
    // Auto fallback path if 404
    img.addEventListener('error', ()=>{
      if(!img.dataset.triedAlt && !img.src.includes('../media/')){
        img.dataset.triedAlt = '1';
        img.src = img.src.replace('media/output','../media/output');
      }
    });
  });

  function open(img){
    lbImg.src = img.dataset.full;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.alt || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    setTimeout(()=>closeBtn.focus(),60);
  }
  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    lbImg.src = '';
  }
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', e=>{
    if(e.target.dataset.close==='true') close();
  });
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && lb.classList.contains('open')) close();
  });
});

/* =====================================================
  Prevent wheel "dead first scroll" when switching directions
  Redirect wheel to page scroll if the target element can't scroll
  in the current direction (breaks out of small/at-boundary scrollers).
===================================================== */
(function enableScrollEscape(){
  const rootScroller = document.scrollingElement || document.documentElement;

  function canScrollInDirection(el, dy){
    const style = getComputedStyle(el);
    const overflowY = style.overflowY;
    if (!(overflowY === 'auto' || overflowY === 'scroll')) return false;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return false;

    const top = el.scrollTop;
    if (dy < 0 && top > 0) return true;
    if (dy > 0 && top < maxScroll) return true;
    return false;
  }

  document.addEventListener('wheel', (e) => {
    // ignore modified gestures or mostly-horizontal scrolls
    if (e.defaultPrevented || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

    const dy = e.deltaY;
    let el = e.target;
    while (el && el !== document.body && el !== document.documentElement) {
      if (canScrollInDirection(el, dy)) return; // let the inner scroller handle it
      el = el.parentElement;
    }

    // No scrollable ancestor can consume this delta; route it to the page
    rootScroller.scrollBy({ top: dy, behavior: 'auto' });
    e.preventDefault();
  }, { passive: false, capture: true });
})();
