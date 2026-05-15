// ── NAVBAR SCROLL ──────────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── TYPEWRITER ─────────────────────────────────────────
const words = [
  'Full-Stack Apps.',
  'React Interfaces.',
  'REST APIs.',
  'AI/ML Prototypes.',
  'Scalable Backends.',
];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  const word = words[wi];
  if (!deleting) {
    tw.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    tw.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// ── PARTICLE CANVAS ────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    const colors = ['#6366f1','#8b5cf6','#22d3ee','#ec4899'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#6366f1';
        ctx.globalAlpha = (1 - d / 120) * 0.12;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── COUNTER ANIMATION ──────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = target * ease;
    el.textContent = isFloat ? val.toFixed(2) : Math.floor(val);
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── SCROLL REVEAL ──────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const bars = document.querySelectorAll('.fill');
const counters = document.querySelectorAll('.stat-num[data-target]');
let countersStarted = false;
let barsStarted = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay);
    observer.unobserve(el);
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Skill bars observer
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !barsStarted) {
      barsStarted = true;
      bars.forEach(bar => {
        const w = bar.dataset.w;
        setTimeout(() => { bar.style.width = w + '%'; }, 300);
      });
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) barObserver.observe(skillsSection);

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(el => animateCounter(el));
    }
  });
}, { threshold: 0.4 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ── PROJECT CARD GLOW FOLLOW MOUSE ─────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const glow = card.querySelector('.project-glow');
    if (glow) {
      glow.style.left = (x - 100) + 'px';
      glow.style.top = (y - 100) + 'px';
    }
    // Tilt effect
    const cx = rect.width / 2, cy = rect.height / 2;
    const rx = (y - cy) / cy * 6;
    const ry = (cx - x) / cx * 6;
    card.style.transform = `translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.perspective = '800px';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── HACKATHON CARD 3D TILT ─────────────────────────────
document.querySelectorAll('.hack-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rx = (y - cy) / cy * 8;
    const ry = (cx - x) / cx * 8;
    card.style.transform = `translateY(-10px) scale(1.01) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── ACTIVE NAV LINK HIGHLIGHT ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? '#fff' : '';
  });
}, { passive: true });

// ── SMOOTH STAGGER for cert & contact cards ─────────────
document.querySelectorAll('.cert-card, .contact-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.background = 'rgba(99,102,241,0.08)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

console.log('%c👋 Hi Recruiter! Prince Maurya built this.', 'color:#6366f1;font-size:1.2rem;font-weight:bold');
console.log('%c📧 princemaurya6921@gmail.com | 📱 +91 7715853356', 'color:#8b5cf6;font-size:1rem');
