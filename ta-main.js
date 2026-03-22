/* =============================================
   TANISHQ ARYAN — ta-main.js
   Original code — not copied from any template.
   ============================================= */

// ── SCROLL RESTORE ──
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ── LOADER ──
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 1100);
});

// ── PROGRESS BAR ──
const progressFill = document.getElementById('progressFill');
const checkpoints = document.querySelectorAll('.checkpoint');

function updateProgressBar() {
  const winH = window.innerHeight;
  const docH = document.documentElement.scrollHeight - winH;
  const pct = (window.scrollY / docH) * 100;
  progressFill.style.width = pct + '%';

  const sectionIds = ['hero', 'about', 'experience', 'skills', 'projects', 'contact'];
  let activeIdx = 0;
  sectionIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= winH / 2 && rect.bottom >= winH / 2) activeIdx = i;
    }
  });
  checkpoints.forEach((cp, i) => {
    cp.classList.toggle('active', i <= activeIdx);
  });
}
window.addEventListener('scroll', updateProgressBar);
window.addEventListener('resize', updateProgressBar);
updateProgressBar();

checkpoints.forEach(cp => {
  cp.addEventListener('click', () => {
    const sec = document.getElementById(cp.dataset.section);
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── NAVBAR HIDE / SHOW ──
const navbar = document.getElementById('navbar');
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > lastScrollY && y > 100) navbar.classList.add('navbar-hidden');
  else navbar.classList.remove('navbar-hidden');
  lastScrollY = y;

  // Active nav links
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    const top = sec.offsetTop - 110;
    const id = sec.getAttribute('id');
    if (y >= top && y < top + sec.offsetHeight) {
      navLinks.forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href') === '#' + id) l.classList.add('active');
      });
    }
  });
});

// ── THEME TOGGLE ──
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn.querySelector('i');
const savedTheme = localStorage.getItem('ta-theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
setThemeIcon(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('ta-theme', next);
  setThemeIcon(next);
});

function setThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ── HERO AVATAR TILT ──
let avatarTilted = false;
const heroAvatar = document.querySelector('.hero-avatar');
if (heroAvatar) {
  window.addEventListener('scroll', () => {
    if (!avatarTilted && window.scrollY > 5) {
      heroAvatar.classList.add('tilted');
      avatarTilted = true;
    }
  });
  heroAvatar.addEventListener('mouseenter', () => heroAvatar.classList.remove('tilted'));
  heroAvatar.addEventListener('mouseleave', () => { if (avatarTilted) heroAvatar.classList.add('tilted'); });
}

// ── FALLING TERMINAL DECO ──
let terminalFallen = false;
const decoTerminal = document.querySelector('.deco-terminal');
const heroContent = document.querySelector('.hero-content');

function calcFallDistance() {
  if (!heroContent || !decoTerminal) return;
  const rect = heroContent.getBoundingClientRect();
  const termRect = decoTerminal.getBoundingClientRect();
  const dist = Math.max(0, rect.bottom + window.scrollY - (termRect.bottom + window.scrollY) - 50);
  decoTerminal.style.setProperty('--fall-distance', dist + 'px');
}
calcFallDistance();
window.addEventListener('resize', calcFallDistance);
window.addEventListener('scroll', () => {
  if (!terminalFallen && window.scrollY > 5) {
    if (decoTerminal) decoTerminal.classList.add('falling');
    terminalFallen = true;
  }
});

// ── HERO MATRIX TYPING EFFECT ──
const greetingEl = document.getElementById('hero-greeting');
const finalText = 'Hi there! 👋';
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

function matrixTyping() {
  let iter = 0;
  const iv = setInterval(() => {
    greetingEl.textContent = finalText.split('').map((ch, i) => {
      if (i < iter) return finalText[i];
      if (ch === ' ' || ch === '👋') return ch;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (iter >= finalText.length) clearInterval(iv);
    iter += 1 / 3;
  }, 50);
}
setTimeout(matrixTyping, 600);

// ── HIGHLIGHT SCROLL ANIMATION ──
const highlights = document.querySelectorAll('.highlight');
const highlightData = new Map();
highlights.forEach((el, i) => {
  el.setAttribute('data-direction', i % 2 === 0 ? 'left' : 'right');
  highlightData.set(el, { started: false, startScroll: 0, duration: 100 });
});
function updateHighlights() {
  const sy = window.scrollY;
  const wh = window.innerHeight;
  highlights.forEach(el => {
    const rect = el.getBoundingClientRect();
    const top = rect.top + sy;
    const d = highlightData.get(el);
    const trigger = sy + wh * 0.8;
    if (!d.started && trigger >= top) { d.started = true; d.startScroll = sy; }
    if (d.started) {
      const prog = Math.min(1, Math.max(0, (sy - d.startScroll) / d.duration));
      el.style.setProperty('--highlight-progress', (prog * 100) + '%');
    }
    if (d.started && sy < d.startScroll - 50) {
      d.started = false; el.style.setProperty('--highlight-progress', '0%');
    }
  });
}
window.addEventListener('scroll', updateHighlights);
requestAnimationFrame(updateHighlights);

// ── LANGUAGE STARS ──
const langItems = document.querySelectorAll('.language-item');
const langData = new Map();
langItems.forEach(item => {
  langData.set(item, { started: false, startScroll: 0, stars: item.querySelectorAll('.star'), delay: 50 });
});
function updateLangStars() {
  const sy = window.scrollY;
  const wh = window.innerHeight;
  langItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    const top = rect.top + sy;
    const d = langData.get(item);
    const trigger = sy + wh * 0.8;
    if (!d.started && trigger >= top) { d.started = true; d.startScroll = sy; }
    if (d.started) {
      const prog = sy - d.startScroll;
      d.stars.forEach((star, i) => { if (prog >= i * d.delay) star.classList.add('visible'); });
    }
  });
}
window.addEventListener('scroll', updateLangStars);
requestAnimationFrame(updateLangStars);

// ── FADE-IN SECTIONS ──
const fadeEls = document.querySelectorAll('.section, .skill-box');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fade-in'); fadeObserver.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
fadeEls.forEach(el => fadeObserver.observe(el));

// ── JOURNEY TIMELINE BOOK FLIP ──
const journeyTimeline = document.querySelector('.journey-timeline');
const flipData = { started: false, startScroll: 0, range: 200 };

function updateJourneyFlip() {
  if (!journeyTimeline || window.innerWidth < 769) return;
  const sy = window.scrollY;
  const wh = window.innerHeight;
  const rect = journeyTimeline.getBoundingClientRect();
  const top = rect.top + sy;
  const trigger = sy + wh * 0.5;
  if (!flipData.started && trigger >= top) { flipData.started = true; flipData.startScroll = sy; }
  if (flipData.started) {
    const prog = Math.min(1, Math.max(0, (sy - flipData.startScroll) / flipData.range));
    const rotY = 180 - 180 * prog;
    journeyTimeline.style.transform = `rotateY(${rotY}deg)`;
    journeyTimeline.style.overflowY = prog >= 1 ? 'auto' : 'hidden';
  } else {
    journeyTimeline.style.transform = 'rotateY(180deg)';
    journeyTimeline.style.overflowY = 'hidden';
  }
}
window.addEventListener('scroll', updateJourneyFlip);
requestAnimationFrame(updateJourneyFlip);

// ── LEAFLET MAP ──
const mapInitView = { center: [30.3165, 78.0322], zoom: 12 };
const map = L.map('journey-map', {
  center: mapInitView.center, zoom: mapInitView.zoom,
  scrollWheelZoom: false, zoomControl: true,
});
L.tileLayer('https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg', {
  attribution: '© Stamen Design, © OpenStreetMap contributors', maxZoom: 16,
}).addTo(map);

// Home button
L.Control.HomeBtn = L.Control.extend({
  onAdd(map) {
    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const a = L.DomUtil.create('a', '', div);
    a.href = '#'; a.title = 'Reset view'; a.innerHTML = '<i class="fas fa-home"></i>';
    L.DomEvent.on(a, 'click', e => { e.preventDefault(); map.setView(mapInitView.center, mapInitView.zoom); });
    return div;
  }
});
new L.Control.HomeBtn({ position: 'topright' }).addTo(map);

// Marker
const markerIcon = L.divIcon({
  className: 'neo-marker',
  html: `<div class="neo-marker-label">Dehradun</div><div class="neo-marker-pin"></div>`,
  iconSize: [30, 30], iconAnchor: [15, 45], popupAnchor: [0, -45],
});
const marker = L.marker([30.3165, 78.0322], { icon: markerIcon }).addTo(map);
marker.bindPopup(`
  <div class="map-popup">
    <div class="map-popup-country">India 🇮🇳</div>
    <div class="map-popup-company">
      <strong>Graphic Era Hill University</strong>
      <span>B.Tech Computer Science</span>
      <small>Dehradun, Uttarakhand</small>
      <small>2022 – Present</small>
    </div>
  </div>
`);

// Timeline click → map
document.querySelectorAll('.timeline-item-flat').forEach(item => {
  item.addEventListener('click', () => {
    const lat = parseFloat(item.dataset.lat);
    const lng = parseFloat(item.dataset.lng);
    map.setView([lat, lng], 13, { animate: true, duration: 1 });
    setTimeout(() => marker.openPopup(), 600);
  });
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
