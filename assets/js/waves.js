/* --------------------
  Helpers & options
-------------------- */
const deg  = a => (Math.PI / 180) * a;
const rand = (v1, v2) => Math.floor(v1 + Math.random() * (v2 - v1));

const opt = {
  particles: window.innerWidth > 900 ? 1200 : 650,
  baseNoiseScale: 0.0085,
  noiseJitterAmp: 0.003,      // “breathing” amplitude
  angle: deg(-90),
  rotateSpeed: 0.00035,       // slow global rotation
  h1: rand(0, 360),
  h2: rand(0, 360),
  s1: rand(30, 80),
  s2: rand(30, 80),
  l1: rand(35, 75),
  l2: rand(35, 75),
  strokeWeight: 1.2,
  tailAlpha: 30,              // 0..255 (higher = shorter tails)
  glow: 1.35,                  // multiplies strokeWeight inside render()
  sparkChance: 0.007,          // chance per particle per frame to sparkle
  excludeRadius: 140,          // base radius of the mouse/touch "void"
  excludeStrength: 2.0         // how hard particles get pushed away
};

let Particles = [];
let time = 0;

// Pointer (mouse/touch) state for the repel void
let pointer = { x: -9999, y: -9999, active: false };

/* --------------------
  Particle
-------------------- */
class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.lx = x; this.ly = y;
    this.vx = 0; this.vy = 0;
    this.ax = 0; this.ay = 0;
    this.hueTails = Math.random();
    this.pickPalette();
    this.maxSpeed = this.hueTails > 0.5 ? 3 : 2;
  }

  pickPalette() {
    this.hue   = (this.hueTails > 0.5 ? 20 + opt.h1 : 20 + opt.h2);
    this.sat   = (this.hueTails > 0.5 ? opt.s1     : opt.s2);
    this.light = (this.hueTails > 0.5 ? opt.l1     : opt.l2);
  }

  updatePrev() {
    this.lx = this.x;
    this.ly = this.y;
  }

  follow() {
    // Flow field angle with slow global rotation & breathing noise
    const noiseScale = opt.baseNoiseScale + Math.sin(time * 0.005) * opt.noiseJitterAmp;
    const angle = noise(this.x * noiseScale, this.y * noiseScale, time * noiseScale) * Math.PI * 0.5 + opt.angle;

    // Pointer exclusion: push particles away from mouse/touch
    if (pointer.active) {
      const dx = this.x - pointer.x;
      const dy = this.y - pointer.y;
      const d  = Math.hypot(dx, dy);

      // Expand void slightly while mouse is pressed
      const r = opt.excludeRadius * (mouseIsPressed ? 1.6 : 1.0);

      if (d < r) {
        const f = (1 - d / r) * opt.excludeStrength; // stronger closer to center
        this.ax += (dx / (d || 1)) * f;
        this.ay += (dy / (d || 1)) * f;
      }
    }

    // Base flow force
    this.ax += Math.cos(angle);
    this.ay += Math.sin(angle);
  }

  edges() {
    if (this.x < 0)      { this.x = width;  this.updatePrev(); }
    else if (this.x > width)  { this.x = 0;      this.updatePrev(); }
    if (this.y < 0)      { this.y = height; this.updatePrev(); }
    else if (this.y > height) { this.y = 0;      this.updatePrev(); }
  }

  update() {
    this.follow();

    this.vx += this.ax;
    this.vy += this.ay;

    const speed = Math.hypot(this.vx, this.vy);
    const ang   = Math.atan2(this.vy, this.vx);
    const m     = Math.min(this.maxSpeed, speed);

    this.vx = Math.cos(ang) * m;
    this.vy = Math.sin(ang) * m;

    this.x += this.vx;
    this.y += this.vy;
    this.ax = 0;
    this.ay = 0;

    this.edges();
  }

  render() {
    // Slight weight pulse based on local speed + global glow factor
    const sp = Math.min(1.5, Math.hypot(this.vx, this.vy));
    strokeWeight(opt.strokeWeight * (0.85 + sp * 0.25) * opt.glow);

    stroke(`hsla(${this.hue}, ${this.sat}%, ${this.light}%, 0.35)`);
    line(this.x, this.y, this.lx, this.ly);

    // Rare sparkle “flare”
    if (Math.random() < opt.sparkChance) {
      noStroke();
      fill(`hsla(${this.hue}, ${this.sat}%, ${Math.min(95, this.light + 20)}%, 0.6)`);
      circle(this.x, this.y, 1.5 + Math.random() * 2);
    }

    this.updatePrev();
  }
}

/* --------------------
  Setup
-------------------- */
function setup() {
  const container = document.getElementById('waves-container');
  const c = createCanvas(windowWidth, windowHeight);
  c.parent(container);
  pixelDensity(1);

  // Track pointer from the whole document (works even if canvas is behind content)
  document.addEventListener('mousemove', (e) => {
    const rect = c.elt.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = (pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height);
  });
  document.addEventListener('mouseleave', () => { pointer.active = false; });

  // Touch support
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    const rect = c.elt.getBoundingClientRect();
    pointer.x = t.clientX - rect.left;
    pointer.y = t.clientY - rect.top;
    pointer.active = true;
  }, { passive: true });
  document.addEventListener('touchend', () => { pointer.active = false; });

  for (let i = 0; i < opt.particles; i++) {
    Particles.push(new Particle(Math.random() * width, Math.random() * height));
  }
}

/* --------------------
  Draw
-------------------- */
function draw() {
  time++;

  // Smooth mouse/touch so the void feels fluid
  const hasTouch = touches && touches.length;
  const targetX = hasTouch ? touches[0].x : mouseX;
  const targetY = hasTouch ? touches[0].y : mouseY;
  if (pointer.active || hasTouch) {
    pointer.x = lerp(pointer.x, targetX, 0.25);
    pointer.y = lerp(pointer.y, targetY, 0.25);
  }

  // Evolve field/colors slowly
  opt.angle += opt.rotateSpeed;
  const drift = Math.sin(time * 0.002);
  opt.h1 = (opt.h1 + 0.08) % 360;
  opt.h2 = (opt.h2 + 0.05) % 360;
  opt.l1 = 50 + drift * 8;
  opt.l2 = 55 - drift * 8;

  // Clear with fade (BLEND), then draw glow (ADD)
  blendMode(BLEND);
  background(0, opt.tailAlpha);  // higher alpha = shorter tails
  blendMode(ADD);

  for (let p of Particles) {
    // Occasional palette swap for long-term variety
    if (Math.random() < 0.002) {
      p.hueTails = Math.random();
      p.pickPalette();
    }
    p.update();
    p.render();
  }
}

/* --------------------
  Resize
-------------------- */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
