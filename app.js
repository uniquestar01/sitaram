/* ============================================================
   app.js  –  Sitaram Birthday Website
   ============================================================ */

// ── Utility ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));

// ── Scene Management ─────────────────────────────────────────
let currentScene = 1;
function goToScene(n) {
  const cur = $('scene' + currentScene);
  const next = $('scene' + n);
  cur.classList.add('fade-out');
  setTimeout(() => {
    cur.classList.remove('active', 'fade-out');
    next.classList.add('active');
    currentScene = n;
    onSceneEnter(n);
  }, 800);
}
function onSceneEnter(n) {
  if (n === 2) startScene2();
  if (n === 3) startScene3();
  if (n === 4) startScene4();
  if (n === 5) startScene5();
  if (n === 6) startScene6();
}

// ── SCENE 1 – Welcome ────────────────────────────────────────
(function initScene1() {
  drawStars();
  spawnParticles('particles1', 30, ['#ff6eb4','#c084fc','#ffd700','#ffffff']);

  const title    = $('welcomeTitle');
  const sub      = $('welcomeSub');
  const btn      = $('surpriseBtn');

  const line1 = 'Hey Sitaram… ✨';
  const line2 = 'Someone made something special just for you';

  typeText(title, line1, 60, () => {
    setTimeout(() => typeText(sub, line2, 45, () => {
      setTimeout(() => {
        btn.style.transition = 'opacity 1s';
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'all';
      }, 600);
    }), 400);
  });

  btn.addEventListener('click', () => goToScene(2));
})();

// Stars canvas
function drawStars() {
  const canvas = $('starsCanvas');
  resize(canvas);
  const ctx = canvas.getContext('2d');
  const stars = Array.from({length: 200}, () => ({
    x: rand(0, canvas.width), y: rand(0, canvas.height),
    r: rand(0.5, 2.2), a: rand(0.3, 1),
    speed: rand(0.002, 0.008)
  }));
  let t = 0;
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.speed * 100));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
    t++;
    requestAnimationFrame(loop);
  })();
}

// Typing helper
function typeText(el, text, speed, cb) {
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  el.appendChild(cursor);
  const iv = setInterval(() => {
    cursor.insertAdjacentText('beforebegin', text[i]);
    i++;
    if (i >= text.length) {
      clearInterval(iv);
      cursor.remove();
      if (cb) cb();
    }
  }, speed);
}

// ── SCENE 2 – Birthday Reveal ────────────────────────────────
function startScene2() {
  launchConfetti('confettiCanvas2', 250, 8000);
  startFireworks();
  spawnBalloons();
  playBirthdayTune();
  $('nextScene2').addEventListener('click', () => goToScene(3), {once:true});
}

// Confetti
function launchConfetti(canvasId, count, duration) {
  const canvas = $(canvasId);
  resize(canvas);
  const ctx = canvas.getContext('2d');
  const colors = ['#ff6eb4','#ffd700','#c084fc','#00e5ff','#ff3d9a','#a855f7','#ffffff'];
  const pieces = Array.from({length: count}, () => ({
    x: rand(0, canvas.width),
    y: rand(-canvas.height, 0),
    w: rand(6, 14), h: rand(8, 18),
    color: colors[randInt(0, colors.length-1)],
    rot: rand(0, Math.PI * 2),
    vy: rand(2, 5), vx: rand(-2, 2),
    vr: rand(-0.08, 0.08),
    alpha: 1
  }));
  const start = Date.now();
  (function draw() {
    if (Date.now() - start > duration) { ctx.clearRect(0,0,canvas.width,canvas.height); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y > canvas.height) { p.y = -20; p.x = rand(0, canvas.width); }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x + p.w/2, p.y + p.h/2);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  })();
}

// Fireworks
function startFireworks() {
  const canvas = $('fireworksCanvas');
  resize(canvas);
  const ctx = canvas.getContext('2d');
  let particles = [];
  function explode(x, y) {
    const colors = ['#ff6eb4','#ffd700','#c084fc','#00e5ff','#ff3d9a'];
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 / 80) * i;
      const speed = rand(2, 6);
      particles.push({
        x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
        alpha: 1, color: colors[randInt(0, colors.length-1)], r: rand(2,4)
      });
    }
  }
  let fw = 0;
  function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fw++;
    if (fw % 55 === 0) explode(rand(60, canvas.width-60), rand(60, canvas.height*0.55));
    particles = particles.filter(p => p.alpha > 0.05);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.alpha -= 0.018;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
}

// Floating balloons
function spawnBalloons() {
  const container = $('balloons');
  const emojis = ['🎈','🎀','🎊','💜','🩷','💛','🩵'];
  for (let i = 0; i < 14; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.textContent = emojis[i % emojis.length];
    const rise = rand(4, 9);
    const delay = rand(0, 5);
    const sway = rand(-40, 40);
    b.style.cssText = `left:${rand(5,90)}%;--rise:${rise}s;--delay:${delay}s;--sway:${sway}px;animation-delay:${delay}s;font-size:${rand(2,3.5)}rem`;
    container.appendChild(b);
  }
}

// Birthday tune via Web Audio
function playBirthdayTune() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    // Happy Birthday melody: notes & durations
    const notes = [
      [261.6,0.35],[261.6,0.1],[293.7,0.45],[261.6,0.45],[349.2,0.45],[329.6,0.9],
      [261.6,0.35],[261.6,0.1],[293.7,0.45],[261.6,0.45],[392,0.45],[349.2,0.9],
      [261.6,0.35],[261.6,0.1],[523.3,0.45],[440,0.45],[349.2,0.45],[329.6,0.45],[293.7,0.9],
      [466.2,0.35],[466.2,0.1],[440,0.45],[349.2,0.45],[392,0.45],[349.2,0.9]
    ];
    let t = ctx.currentTime + 0.2;
    notes.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t); osc.stop(t + dur + 0.05);
      t += dur + 0.04;
    });
  } catch(e) { /* silently ignore if audio context blocked */ }
}

// ── SCENE 3 – Special Message ─────────────────────────────────
function startScene3() {
  spawnParticles('particles3', 20, ['#ff6eb4','#c084fc','#ffd700']);
  const message = `Dear Sitaram,\n\nToday is a very special day because it is the day someone amazing was born.\n\nYour smile is bright like stars, and your presence makes everything better.\n\nMay your life always be filled with happiness, dreams, and beautiful moments.\n\nWishing you a wonderful birthday full of love, laughter, and surprises.\n\nOnce again...\n\nHappy Birthday Sitaram 🎉`;
  const el = $('typedMessage');
  const btn = $('nextScene3');
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  el.appendChild(cursor);
  let i = 0;
  const iv = setInterval(() => {
    cursor.insertAdjacentText('beforebegin', message[i]);
    i++;
    el.parentElement.parentElement.scrollTop = el.parentElement.parentElement.scrollHeight;
    if (i >= message.length) {
      clearInterval(iv);
      cursor.remove();
      setTimeout(() => {
        btn.style.transition = 'opacity 1s';
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'all';
      }, 600);
    }
  }, 38);
  btn.addEventListener('click', () => goToScene(4), {once:true});
}

// ── SCENE 4 – Cake ───────────────────────────────────────────
function startScene4() {
  spawnParticles('particles4', 15, ['#ff6eb4','#ffd700','#c084fc']);
  let blown = 0;
  const total = 5;

  function blowCandle(id) {
    const candle = document.querySelector(`.candle[data-id="${id}"]`);
    if (!candle || candle.classList.contains('blown')) return;
    candle.classList.add('blown');
    blown++;
    if (blown >= total) allBlown();
  }
  function allBlown() {
    $('cakeHint').textContent = '🎉 Wish made! The magic is real!';
    $('blowAllBtn').style.display = 'none';
    launchConfetti('confettiCanvas4', 150, 4000);
    setTimeout(() => {
      const btn = $('nextScene4');
      btn.style.display = 'inline-block';
    }, 1500);
  }

  document.querySelectorAll('.candle').forEach(c => {
    c.addEventListener('click', () => blowCandle(c.dataset.id));
  });
  $('blowAllBtn').addEventListener('click', () => {
    for (let i = 0; i < total; i++) blowCandle(String(i));
  });
  $('nextScene4').addEventListener('click', () => goToScene(5), {once:true});
}

// ── SCENE 5 – Balloon Game ────────────────────────────────────
function startScene5() {
  const gameArea = $('gameArea');
  const scoreEl  = $('score');
  const poppedEl = $('popped');
  const nextBtn  = $('nextScene5');
  const emojis   = ['🎈','🩷','💜','💛','🩵','🎊'];
  let score = 0, popped = 0;
  const target = 15;
  let spawnInterval;

  function spawnBalloon() {
    if (popped >= target) return;
    const b = document.createElement('div');
    b.className = 'game-balloon';
    b.textContent = emojis[randInt(0, emojis.length-1)];
    const rise = rand(3, 7);
    b.style.cssText = `left:${rand(5,80)}%;font-size:${rand(1.8,3)}rem;--gr:${rise}s`;
    b.addEventListener('click', () => {
      if (b.classList.contains('pop-anim')) return;
      b.classList.add('pop-anim');
      score += 10; popped++;
      scoreEl.textContent = score;
      poppedEl.textContent = popped;
      setTimeout(() => b.remove(), 300);
      if (popped >= target) {
        clearInterval(spawnInterval);
        setTimeout(() => {
          nextBtn.style.display = 'inline-block';
        }, 800);
      }
    });
    b.addEventListener('animationend', () => b.remove());
    gameArea.appendChild(b);
  }
  spawnInterval = setInterval(spawnBalloon, 700);
  spawnBalloon();
  nextBtn.addEventListener('click', () => goToScene(6), {once:true});
}

// ── SCENE 6 – Gift ───────────────────────────────────────────
function startScene6() {
  spawnParticles('particles6', 25, ['#ff6eb4','#c084fc','#ffd700','#ffffff']);
  const gift    = $('giftBox');
  const lid     = $('giftLid');
  const hint    = $('giftHint');
  const final   = $('finalMessage');
  let opened = false;

  gift.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    lid.classList.add('open');
    hint.textContent = '🌟 A gift from the heart!';
    launchConfetti('confettiCanvas6', 200, 6000);
    setTimeout(() => {
      gift.style.display = 'none';
      hint.style.display = 'none';
      final.style.display = 'block';
      final.style.animation = 'titleReveal 0.8s ease forwards';
    }, 900);

    $('restartBtn').addEventListener('click', () => {
      location.reload();
    }, {once:true});
  });
}

// ── Particles ─────────────────────────────────────────────────
function spawnParticles(containerId, count, colors) {
  const container = $(containerId);
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = rand(3, 8);
    const dur  = rand(5, 12);
    p.style.cssText = `
      left:${rand(0,100)}%;
      bottom:${rand(-10,20)}%;
      width:${size}px; height:${size}px;
      background:${colors[randInt(0, colors.length-1)]};
      --dur:${dur}s;
      animation-delay:${rand(0, dur)}s;
    `;
    container.appendChild(p);
  }
}

// ── Canvas resize helper ──────────────────────────────────────
function resize(canvas) {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
  ['starsCanvas','fireworksCanvas','confettiCanvas2','confettiCanvas4','confettiCanvas6'].forEach(id => {
    const c = $(id);
    if (c) resize(c);
  });
});
