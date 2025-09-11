/* ================================
  Theme toggle with memory & system
  ================================ */

(function(){
  const root = document.documentElement;
  const KEY = 'site-theme';
  function apply(t){ root.classList.toggle('theme-light', t==='light'); root.classList.toggle('theme-dark', t==='dark'); }
  function init(){
    let t = localStorage.getItem(KEY);
    if(!t){ t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark'; }
    apply(t);
  }
  init();
  const btn = document.getElementById('theme-toggle');
  if(btn){ btn.addEventListener('click', ()=>{
    const next = root.classList.contains('theme-light') ? 'dark':'light';
    localStorage.setItem(KEY,next); apply(next);
  }); }
})();

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
