// ── Theme toggle ──
const html        = document.documentElement;
const themeBtn    = document.getElementById('theme-toggle');
const savedTheme  = localStorage.getItem('theme') || 'dark';
html.dataset.theme = savedTheme;
themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeBtn.addEventListener('click', () => {
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
});

// ── Language toggle ──
const rolesEN = [
  'Data Engineer',
  'Big Data Specialist',
  'Azure & Databricks Expert',
  'MSc @ Heidelberg University',
];
const rolesVI = [
  'Kỹ Sư Dữ Liệu',
  'Chuyên Gia Big Data',
  'Chuyên Gia Azure & Databricks',
  'Thạc Sĩ @ Heidelberg',
];

let currentLang = localStorage.getItem('lang') || 'en';
const langBtn   = document.getElementById('lang-toggle');
langBtn.textContent = currentLang.toUpperCase();

function setLang(lang) {
  currentLang = lang;
  langBtn.textContent = lang.toUpperCase();
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = lang === 'vi' ? el.dataset.vi : el.dataset.en;
  });
  // keep HTML entities in bio & footer (contains &amp;)
  document.querySelectorAll('[data-en*="&"]').forEach(el => {
    el.innerHTML = lang === 'vi' ? el.dataset.vi : el.dataset.en;
  });
}

langBtn.addEventListener('click', () => {
  setLang(currentLang === 'en' ? 'vi' : 'en');
});

// apply saved lang on load (after DOM ready)
if (currentLang === 'vi') setLang('vi');

// ── Navbar scroll shadow ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// ── Mobile hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Typed role animation ──
const typedEl = document.getElementById('typed-text');
let roleIdx = 0, charIdx = 0, deleting = false;

function type() {
  const roles   = currentLang === 'vi' ? rolesVI : rolesEN;
  const current = roles[roleIdx % roles.length];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 42 : 78);
}
type();

// ── Scroll reveal ──
const revealEls = document.querySelectorAll(
  '.timeline-item, .skill-card, .project-card, .edu-card, .ach-card'
);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObserver.observe(s));

// ── Stats counter ──
function animateCounter(el, target, duration = 1200) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      animateCounter(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

// ── Project filter ──
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const tags = card.dataset.tags || '';
      const show = filter === 'all' || tags.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

// ── Reading progress bar ──
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = maxScroll > 0 ? `${(scrolled / maxScroll) * 100}%` : '0%';
});

// ── Photo star burst ──
(function () {
  const wrap = document.querySelector('.hero-photo-wrap');
  if (!wrap) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'star-burst-canvas';
  wrap.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const GOLDS = ['#FFD700', '#FFC200', '#FFB700', '#FFE44D', '#FFCA28'];

  function half() { return canvas.width / 2; }
  function imgR() { return wrap.offsetWidth / 2; }

  function resize() {
    const s = Math.round(wrap.offsetWidth * 2.8);
    canvas.width = s;
    canvas.height = s;
    canvas.style.width = s + 'px';
    canvas.style.height = s + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  function newStar() {
    const r0 = imgR();
    return {
      angle:    Math.random() * Math.PI * 2,
      dist:     r0 * (0.88 + Math.random() * 0.15),
      startDist:r0 * (0.88 + Math.random() * 0.15),
      speed:    0.55 + Math.random() * 0.9,
      size:     3 + Math.random() * 10,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.10,
      type:     Math.random() < 0.5 ? 4 : 5,
      color:    GOLDS[Math.floor(Math.random() * GOLDS.length)],
      life:     0,
      maxLife:  Math.round(70 + Math.random() * 90),
    };
  }

  function starPath(x, y, pts, outer, inner, rot) {
    ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2 + rot;
      if (i === 0) ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      else         ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
  }

  const COUNT = 26;
  const stars = Array.from({ length: COUNT }, () => {
    const s = newStar();
    const skip = Math.random();
    s.life = Math.floor(skip * s.maxLife);
    s.dist = s.startDist + s.speed * s.life;
    return s;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const c = half();

    stars.forEach((s, i) => {
      s.life++;
      if (s.life > s.maxLife) { stars[i] = newStar(); return; }

      s.dist += s.speed;
      s.rotation += s.rotSpeed;

      const t = s.life / s.maxLife;
      const alpha = t < 0.18 ? t / 0.18 : 1 - Math.pow((t - 0.18) / 0.82, 1.2);
      const a = Math.max(0, alpha);
      if (a <= 0) return;

      const x = c + Math.cos(s.angle) * s.dist;
      const y = c + Math.sin(s.angle) * s.dist;
      const outer = s.size * (0.95 - t * 0.25);
      const inner = s.type === 4 ? outer * 0.14 : outer * 0.42;

      ctx.save();
      ctx.globalAlpha = a;

      // Streak tail
      const tailLen = s.size * (2 + t * 3);
      const tx = x - Math.cos(s.angle) * tailLen;
      const ty = y - Math.sin(s.angle) * tailLen;
      const grad = ctx.createLinearGradient(x, y, tx, ty);
      grad.addColorStop(0, s.color + 'cc');
      grad.addColorStop(1, s.color + '00');
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.5, outer * 0.35);
      ctx.lineCap = 'round';
      ctx.stroke();

      // Star shape with glow
      ctx.shadowColor = s.color;
      ctx.shadowBlur = outer * 2.5;
      starPath(x, y, s.type, outer, inner, s.rotation);
      ctx.fillStyle = s.color;
      ctx.fill();

      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
}());

// ── Photo 3D tilt ──
const photoWrap = document.querySelector('.hero-photo-wrap');
if (photoWrap) {
  const MAX_TILT = 18;
  let raf = null;

  document.addEventListener('mousemove', (e) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = photoWrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      photoWrap.style.transition = 'transform 0.08s ease';
      photoWrap.style.transform =
        `perspective(600px) rotateY(${dx * MAX_TILT}deg) rotateX(${-dy * MAX_TILT}deg)`;
    });
  });

  document.addEventListener('mouseleave', () => {
    photoWrap.style.transition = 'transform 0.6s ease';
    photoWrap.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
  });
}

// ── Back to top ──
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
