/* LK — caveira inflável + efeitos de terror */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- caveira (desenho original, estilo flash de tattoo) ---------- */
  // dentes irregulares: [altura, deslocamento] — 0 = dente faltando
  const UP = [[30,0],[38,0],[27,3],[40,0],[22,8],[35,0],[0,0],[33,2]];
  const LO = [[24,0],[0,0],[28,0],[20,0],[30,0],[26,0],[18,6],[27,0]];
  const teeth = (x0, y, set, cls, down) => set.map(([h, o], i) => h
    ? `<path d="M${x0 + i * 17} ${down ? y + o : y + o} h15 v${h - 4} q0 4 -4 4 h-7 q-4 0 -4 -4z" class="${cls}"${down ? ` transform="translate(0 0)"` : ''}/>`
    : '').join('');

  const svg = `
<svg viewBox="0 -40 400 510" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sk-dark" cx="34%" cy="24%" r="85%">
      <stop offset="0" stop-color="#3d3a38"/><stop offset=".3" stop-color="#171515"/><stop offset="1" stop-color="#020202"/>
    </radialGradient>
    <radialGradient id="sk-ember"><stop offset="0" stop-color="#fff0d8"/><stop offset=".18" stop-color="#ff6a4a"/><stop offset=".45" stop-color="#D21F26"/><stop offset="1" stop-color="#9E1015" stop-opacity="0"/></radialGradient>
    <radialGradient id="sk-mouth" cy="20%"><stop offset="0" stop-color="#ff4a2a" stop-opacity=".85"/><stop offset="1" stop-color="#2a0000" stop-opacity="0"/></radialGradient>
    <linearGradient id="sk-blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9E1015"/><stop offset=".5" stop-color="#ff3b2f"/><stop offset="1" stop-color="#7a0b0f"/></linearGradient>
    <filter id="sk-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      .rim{fill:none;stroke:#ff5a3c;stroke-linecap:round;stroke-linejoin:round;filter:url(#sk-glow)}
      .ln{fill:none;stroke:#9E1015;stroke-linecap:round;stroke-linejoin:round}
      .tu,.tl{fill:#0b0b0b;stroke:#ff5a3c;stroke-width:3;stroke-linejoin:round;filter:url(#sk-glow)}
    </style>
  </defs>
  <!-- boca (interior em brasa) -->
  <path d="M124 334 H276 V398 H124Z" fill="#030000"/>
  <ellipse class="sk-eye" cx="200" cy="360" rx="80" ry="34" fill="url(#sk-mouth)"/>
  <g class="sk-jaw">
    <path d="M96 334 C88 384 108 428 150 442 C176 451 224 451 250 442 C292 428 312 384 304 334 C294 350 272 358 250 358 L150 358 C128 358 106 350 96 334Z" fill="url(#sk-dark)" stroke="#000" stroke-width="5" stroke-linejoin="round"/>
    ${LO.map(([h, o], i) => h ? `<path d="M${132 + i * 17} ${356 + o} h15 v${h - 4} q0 4 -4 4 h-7 q-4 0 -4 -4z" class="tl"/>` : '').join('')}
    <path class="rim" stroke-width="5" d="M118 418 C150 448 250 448 282 418"/>
    <path class="ln" stroke-width="2.5" d="M114 390 C120 404 130 416 142 422 M286 390 C280 404 270 416 258 422"/>
  </g>
  <g class="sk-head">
    <!-- chifres -->
    <path d="M112 66 C88 36 90 2 112 -30 C110 2 122 30 142 48Z M288 66 C312 36 310 2 288 -30 C290 2 278 30 258 48Z" fill="url(#sk-dark)" stroke="#000" stroke-width="4"/>
    <path class="rim" stroke-width="3" d="M112 -30 C90 2 90 34 110 62 M288 -30 C310 2 310 34 290 62"/>
    <path d="M200 18 C92 18 36 95 38 192 C40 246 58 276 84 298 L90 336 C94 350 108 355 120 351 L280 351 C292 355 306 350 310 336 L316 298 C342 276 360 246 362 192 C364 95 308 18 200 18Z" fill="url(#sk-dark)" stroke="#000" stroke-width="5" stroke-linejoin="round"/>
    <!-- luz de contorno -->
    <path class="rim" stroke-width="7" d="M84 96 C124 30 276 30 316 96"/>
    <path class="rim" stroke-width="4" opacity=".85" d="M356 176 C358 230 342 268 316 296 M44 176 C42 214 50 246 64 266"/>
    <!-- têmporas e sombreado -->
    <path d="M44 170 C58 178 72 214 84 262 C70 250 52 222 44 170Z M356 170 C342 178 328 214 316 262 C330 250 348 222 356 170Z" fill="#000" opacity=".7"/>
    <path class="ln" stroke-width="2.5" d="M60 150 C66 205 78 244 98 272 M340 150 C334 205 322 244 302 272"/>
    <path class="rim" stroke-width="3.5" d="M104 262 L136 282 L172 276 M296 262 L264 282 L228 276"/>
    <!-- cicatriz costurada -->
    <path class="ln" stroke-width="4" d="M120 104 C160 84 236 82 280 104"/>
    <path class="ln" stroke-width="3" d="M132 88 L140 114 M152 80 L158 106 M174 76 L178 102 M196 74 L198 100 M218 75 L218 101 M240 78 L237 104 M262 85 L256 111"/>
    <!-- rachaduras de lava -->
    <path class="rim sk-crack" stroke-width="3" d="M296 62 L280 96 L296 112 L282 146 L292 158 M96 96 L116 120 L108 140 M186 140 L196 160 L188 176"/>
    <!-- sobrancelha franzida -->
    <path d="M84 168 L186 198 L178 212 L92 186Z M316 168 L214 198 L222 212 L308 186Z" fill="#000" opacity=".8"/>
    <path d="M100 182 L182 206 C192 222 186 244 170 254 C150 266 120 260 108 244 C98 230 96 206 100 182Z" fill="#000"/>
    <path d="M300 182 L218 206 C208 222 214 244 230 254 C250 266 280 260 292 244 C302 230 304 206 300 182Z" fill="#000"/>
    <path class="rim" stroke-width="5" d="M88 170 L186 200 M312 170 L214 200"/>
    <circle class="sk-eye" cx="146" cy="228" r="38" fill="url(#sk-ember)"/>
    <circle class="sk-eye" cx="254" cy="228" r="38" fill="url(#sk-ember)"/>
    <circle class="sk-pupil" cx="148" cy="230" r="4" fill="#fff6ea"/>
    <circle class="sk-pupil" cx="252" cy="230" r="4" fill="#fff6ea"/>
    <!-- nariz -->
    <path d="M200 256 L182 300 L194 296 L200 306 L206 296 L218 300Z" fill="#000" stroke="#ff5a3c" stroke-width="2.5" stroke-linejoin="round" filter="url(#sk-glow)"/>
    ${UP.map(([h, o], i) => h ? `<path d="M${132 + i * 17} ${318} h15 v${h - 4 + o} q0 4 -4 4 h-7 q-4 0 -4 -4z" class="tu"/>` : '').join('')}
    <!-- sangue escorrendo do olho -->
    <path class="sk-tear" d="M130 258 C128 276 133 296 129 320 C127 334 141 336 139 320 C136 296 140 276 138 258Z" fill="url(#sk-blood)"/>
    <path d="M266 254 C265 266 268 276 266 290 C265 297 273 297 272 290 C270 276 272 266 271 254Z" fill="url(#sk-blood)" opacity=".85"/>
    <!-- reflexo de vinil (inflável) -->
    <ellipse class="sk-sheen" cx="140" cy="74" rx="40" ry="12" fill="#ffb4a0" transform="rotate(-22 140 74)"/>
  </g>
</svg>`;

  let burst = 0;
  /* caveira de fundo: 3 camadas (principal + 2 canais pro glitch) */
  const skull = document.createElement('div');
  skull.className = 'skull';
  skull.setAttribute('aria-hidden', 'true');
  skull.innerHTML = `<div class="sk-l m">${svg}</div><div class="sk-l r">${svg}</div><div class="sk-l w">${svg}</div>`;
  document.body.prepend(skull);
  const bars = document.createElement('div');
  bars.className = 'gbars'; bars.setAttribute('aria-hidden', 'true');
  bars.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
  document.body.append(bars);

  /* ---------- física: desce com o scroll, cresce, respira como inflável ---------- */
  let last = scrollY, vel = 0, t0 = performance.now();
  const sp = { x: 0, v: 0 };
  let kick = 0, mx = -999, my = -999, hover = false, auto = 0, frame = 0;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', () => { mx = my = -999; });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const B = document.body;

  function setGlitch(on) {
    skull.classList.toggle('is-glitch', on);
    skull.classList.toggle('is-angry', on);
    B.classList.toggle('skull-glitch', on);
    if (on && !hoverWas) { kick = 0.12; burst = 1; if (Math.random() < 0.5) flicker(); }
  }
  let hoverWas = false;

  function loop(now) {
    const t = now - t0;
    const y = scrollY, dy = y - last; last = y;
    vel += (dy - vel) * 0.18;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = clamp(y / max, 0, 1);

    // cresce conforme desce a página + respira como boneco inflável
    const ready = B.classList.contains('ready') ? 1 : 0;
    const grow = 0.62 + p * 1.15;
    const breath = 1 + 0.07 * Math.sin(y / 170) + 0.02 * Math.sin(t / 800);
    const target = (grow * breath + kick) * ready;
    kick *= 0.88;
    sp.v += (target - sp.x) * 0.08;
    sp.v *= 0.85;
    sp.x += sp.v;

    const sq = clamp(vel * 0.004, -0.14, 0.14);
    const sx = sp.x * (1 - sq * 0.5 + sp.v * 0.6);
    const sy = sp.x * (1 + sq - sp.v * 0.4);
    const rot = clamp(vel * 0.12, -8, 8) + Math.sin(y / 500) * 4 + Math.sin(t / 1300) * 1.5;
    const ty = (-0.16 + p * 0.38) * innerHeight + Math.sin(t / 1100) * 8;   // desce acompanhando
    const tx = Math.sin(y / 900) * innerWidth * 0.06;
    skull.style.transform = `translate(-50%,-50%) translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;

    const speed = Math.abs(vel);
    skull.style.setProperty('--jaw', clamp(speed * 1.2, 0, 34).toFixed(1) + 'px');
    skull.style.setProperty('--eye', clamp(0.75 + speed * 0.015, 0.75, 1).toFixed(2));
    skull.style.setProperty('--glow', clamp(0.35 + speed * 0.02, 0.35, 0.9).toFixed(2));

    // cursor em cima da caveira? (ela está atrás do conteúdo, então medimos a área)
    const r = skull.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.5;
    const nx = (mx - cx) / (r.width * 0.4), ny = (my - cy) / (r.height * 0.45);
    hover = nx * nx + ny * ny < 1;
    if (auto > 0) auto--;
    const g = hover || auto > 0;
    if (g !== hoverWas) { setGlitch(g); hoverWas = g; }

    // pupilas seguem o mouse
    const ang = Math.atan2(my - (r.top + r.height * 0.45), mx - cx);
    skull.style.setProperty('--px', (Math.cos(ang) * 7).toFixed(1) + 'px');
    skull.style.setProperty('--py', (Math.sin(ang) * 6).toFixed(1) + 'px');

    // glitch: sorteia deslocamentos e fatias a cada 2-3 quadros
    if (g && ++frame % (reduce ? 6 : 2) === 0) {
      const s = skull.style, k = Math.random() < 0.25 ? 3 : 1;
      s.setProperty('--g1', rnd(-14, 14) * k + 'px');
      s.setProperty('--g2', rnd(-22, 22) * k + 'px');
      s.setProperty('--g3', (Math.random() < 0.3 ? rnd(-30, 30) : rnd(-4, 4)) + 'px');
      s.setProperty('--sk', (Math.random() < 0.2 ? rnd(-12, 12) : 0) + 'deg');
      const a1 = rnd(0, 70); s.setProperty('--s1', a1 + '%'); s.setProperty('--s2', clamp(100 - a1 - rnd(6, 30), 0, 100) + '%');
      const a2 = rnd(0, 85); s.setProperty('--s3', a2 + '%'); s.setProperty('--s4', clamp(100 - a2 - rnd(2, 10), 0, 100) + '%');
      B.style.setProperty('--mj', (Math.random() < 0.15 ? rnd(-6, 6) : 0) + 'px');
      bars.querySelectorAll('i').forEach(b => {
        b.style.top = rnd(0, 100) + '%'; b.style.height = rnd(1, 18) + 'px';
        b.style.opacity = Math.random() < 0.6 ? rnd(0.15, 0.7) : 0;
        b.style.transform = `translateX(${rnd(-40, 40)}px)`;
      });
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // surtos de glitch sozinha, de tempos em tempos
  (function spasm() {
    setTimeout(() => { if (!reduce && B.classList.contains('ready')) auto = 8 + Math.floor(Math.random() * 14); spasm(); }, 2500 + Math.random() * 5000);
  })();
  $$('.bebas-xl, .giant, .budget__title').forEach(el => el.addEventListener('pointerenter', () => { auto = 10; }));
  // no celular: tocar na tela dá um surto
  addEventListener('touchstart', () => { auto = 24; }, { passive: true });
  /* ---------- fumaça vermelha + brasas ---------- */
  const cv = document.createElement('canvas');
  cv.className = 'smoke'; cv.setAttribute('aria-hidden', 'true');
  document.body.append(cv);
  const ctx = cv.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 1.5);
  const size = () => { cv.width = innerWidth * DPR; cv.height = innerHeight * DPR; };
  size(); addEventListener('resize', size);
  const P = [];
  const emit = (kind, r) => {
    const cx = r.left + r.width * (0.3 + Math.random() * 0.4);
    if (kind === 'smoke') P.push({ k: 0, x: cx, y: r.top + r.height * (0.72 + Math.random() * 0.2),
      vx: (Math.random() - 0.5) * 1.6 - vel * 0.05, vy: -0.2 - Math.random() * 0.9, r: (14 + Math.random() * 20) * Math.max(1, r.width / 300),
      g: (0.4 + Math.random() * 0.6) * Math.max(1, r.width / 500), life: 0, max: 70 + Math.random() * 60 });
    else P.push({ k: 1, x: r.left + r.width * Math.random(), y: r.top + r.height * (0.2 + Math.random() * 0.7),
      vx: (Math.random() - 0.5) * 1.2, vy: -0.6 - Math.random() * 2, r: 0.8 + Math.random() * 2.2,
      life: 0, max: 50 + Math.random() * 70, f: Math.random() * 6 });
  };
  function particles() {
    const r = skull.getBoundingClientRect();
    const on = document.body.classList.contains('ready') && r.width > 10;
    const angry = skull.classList.contains('is-glitch');
    const k = (reduce ? 0.4 : 1) * (1 + Math.min(Math.abs(vel) / 12, 3) + (angry ? 3 : 0));
    if (on) {
      if (Math.random() < 0.1 * k) emit('smoke', r);
      if (Math.random() < 0.35 * k) emit('ember', r);
      if (burst) { for (let i = 0; i < 18; i++) emit('smoke', r); for (let i = 0; i < 45; i++) emit('ember', r); burst = 0; }
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i]; p.life++;
      if (p.life > p.max || P.length > 420) { P.splice(i, 1); continue; }
      const t = p.life / p.max;
      p.x += p.vx; p.y += p.vy;
      if (p.k === 0) {
        p.r += p.g; p.vx *= 0.985; p.vy *= 0.99;
        const a = (t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85) * 0.09;
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gr.addColorStop(0, `rgba(230,40,30,${a})`); gr.addColorStop(0.5, `rgba(158,16,21,${a * 0.6})`); gr.addColorStop(1, 'rgba(80,0,0,0)');
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      } else {
        p.vx += Math.sin(p.life * 0.15 + p.f) * 0.04;
        const a = (1 - t) * (0.6 + 0.4 * Math.sin(p.life * 0.5 + p.f));
        ctx.fillStyle = `rgba(255,${90 + Math.floor(80 * (1 - t))},60,${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
    }
    requestAnimationFrame(particles);
  }
  requestAnimationFrame(particles);

  /* ---------- lâmpada falhando ---------- */
  function flicker(force) {
    if (!reduce || force) {
      const b = document.body;
      const on = () => b.classList.add('flicker'), off = () => b.classList.remove('flicker');
      on(); setTimeout(off, 60); setTimeout(on, 130); setTimeout(off, 170);
      if (Math.random() > 0.5) { setTimeout(on, 420); setTimeout(off, 470); }
    }
  }
  (function schedule() {
    setTimeout(() => { if (!reduce) flicker(); schedule(); }, 6000 + Math.random() * 9000);
  })();

  /* ---------- glitch aleatório nos títulos ---------- */
  const titles = $$('.bebas-xl, .giant, .budget__title, .sobre__tag strong');
  setInterval(() => {
    if (reduce) return;
    const el = titles[Math.floor(Math.random() * titles.length)];
    el.classList.add('is-glitch'); setTimeout(() => el.classList.remove('is-glitch'), 750);
  }, 3800);

  /* ---------- sangue escorrendo ---------- */
  $$('.drips').forEach(d => {
    const n = innerWidth < 760 ? 9 : 22;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      s.className = 'drip';
      const w = 3 + Math.random() * 7;
      s.style.cssText = `left:${(i + Math.random() * 0.8) / n * 100}%;--w:${w.toFixed(1)}px;--h:${(30 + Math.random() * 170).toFixed(0)}px;--t:${(6 + Math.random() * 9).toFixed(1)}s;--dl:${(-Math.random() * 10).toFixed(1)}s`;
      d.append(s);
    }
  });
})();
