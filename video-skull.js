/* LK — caveira em vídeo como fundo: desce e cresce com o scroll, glitch no hover */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const B = document.body;
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- vídeo + canvas ---------- */
  const vid = document.createElement('video');
  Object.assign(vid, { src: vid.canPlayType('video/mp4; codecs="avc1.4D401E"') ? 'assets/skull.mp4' : 'assets/skull.webm', muted: true, loop: true, playsInline: true, autoplay: true, preload: 'auto' });
  vid.setAttribute('playsinline', ''); vid.setAttribute('muted', '');
  const wrap = document.createElement('div');
  wrap.className = 'vskull'; wrap.setAttribute('aria-hidden', 'true');
  const cv = document.createElement('canvas');
  vid.style.cssText = 'position:absolute;width:2px;height:2px;opacity:0;pointer-events:none';
  wrap.append(cv, vid); B.prepend(wrap);
  const S = 720; cv.width = cv.height = S;
  const ctx = cv.getContext('2d');
  const poster = new Image(); poster.src = 'assets/skull-poster.jpg';

  const tryPlay = () => vid.play().catch(() => {});
  tryPlay();
  ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(ev => addEventListener(ev, tryPlay, { once: true, passive: true }));

  const bars = document.createElement('div');
  bars.className = 'gbars'; bars.setAttribute('aria-hidden', 'true');
  bars.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i>';
  B.append(bars);

  /* ---------- estado ---------- */
  let last = scrollY, vel = 0, t0 = performance.now();
  const sp = { x: 0, v: 0 };
  let kick = 0, mx = -999, my = -999, auto = 0, was = false, f = 0, micro = 0;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', () => { mx = my = -999; });

  function draw(glitch) {
    const src = vid.readyState >= 2 ? vid : (poster.complete ? poster : null);
    if (!src) return;
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, S, S);
    ctx.drawImage(src, 0, 0, S, S);
    if (!glitch && micro <= 0) return;

    const hard = glitch ? 1 : 0.35;
    // fantasmas deslocados (separação de canal)
    const g1 = rnd(-18, 18) * hard * (Math.random() < 0.2 ? 3 : 1);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.55 * hard; ctx.drawImage(src, g1, 0, S, S);
    ctx.globalAlpha = 0.3 * hard; ctx.drawImage(src, -g1 * 1.6, g1 * 0.25, S, S);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    // fatias que pulam
    const n = Math.floor(rnd(2, glitch ? 9 : 3));
    for (let i = 0; i < n; i++) {
      const sy = rnd(0, S), sh = rnd(3, glitch ? 70 : 20), dx = rnd(-80, 80) * hard;
      ctx.drawImage(src, 0, sy, S, sh, dx, sy, S, sh);
    }
    // faixas pretas e linhas vermelhas
    if (glitch) {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,.85)' : 'rgba(210,31,38,.35)';
        ctx.fillRect(0, rnd(0, S), S, rnd(1, 10));
      }
      if (Math.random() < 0.12) { ctx.fillStyle = 'rgba(0,0,0,.9)'; ctx.fillRect(0, 0, S, S); } // apagão de 1 quadro
    }
    if (micro > 0) micro--;
  }

  function setGlitch(on) {
    wrap.classList.toggle('is-glitch', on);
    B.classList.toggle('skull-glitch', on);
    if (on) { kick = 0.1; if (Math.random() < 0.5) flicker(); }
  }

  function loop(now) {
    const t = now - t0;
    const y = scrollY, dy = y - last; last = y;
    vel += (dy - vel) * 0.18;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = clamp(y / max, 0, 1);

    // cresce conforme desce + respira (infla e murcha)
    const ready = B.classList.contains('ready') ? 1 : 0;
    const target = ((0.72 + p * 1.05) * (1 + 0.06 * Math.sin(y / 170) + 0.015 * Math.sin(t / 900)) + kick) * ready;
    kick *= 0.88;
    sp.v += (target - sp.x) * 0.08; sp.v *= 0.85; sp.x += sp.v;
    const sq = clamp(vel * 0.003, -0.1, 0.1);
    const sx = sp.x * (1 - sq * 0.5), sy = sp.x * (1 + sq);
    const rot = clamp(vel * 0.08, -6, 6) + Math.sin(y / 520) * 3;
    const ty = (-0.12 + p * 0.32) * innerHeight;                       // desce acompanhando
    wrap.style.transform = `translate(-50%,-50%) translate(0,${ty.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;

    // cursor em cima? (o vídeo está atrás do conteúdo, então medimos a área do rosto)
    const r = wrap.getBoundingClientRect();
    const nx = (mx - (r.left + r.width / 2)) / (r.width * 0.3);
    const ny = (my - (r.top + r.height * 0.45)) / (r.height * 0.4);
    if (auto > 0) auto--;
    const g = nx * nx + ny * ny < 1 || auto > 0;
    if (g !== was) { setGlitch(g); was = g; }

    // tremidinha sutil de vez em quando, mesmo calma
    if (!g && !reduce && Math.random() < 0.004) micro = 3;
    if (Math.abs(vel) > 30 && Math.random() < 0.2) micro = 2;

    if (++f % (g && reduce ? 4 : 1) === 0) draw(g);

    if (g) {
      B.style.setProperty('--mj', (Math.random() < 0.15 ? rnd(-6, 6) : 0) + 'px');
      bars.querySelectorAll('i').forEach(b => {
        b.style.top = rnd(0, 100) + '%'; b.style.height = rnd(1, 16) + 'px';
        b.style.opacity = Math.random() < 0.55 ? rnd(0.15, 0.7) : 0;
        b.style.transform = `translateX(${rnd(-40, 40)}px)`;
      });
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // surtos sozinha + títulos disparam
  (function spasm() {
    setTimeout(() => { if (!reduce && B.classList.contains('ready')) auto = Math.floor(rnd(8, 22)); spasm(); }, rnd(3000, 8000));
  })();
  $$('.hero__title, .bebas-xl, .giant, .budget__title').forEach(el => el.addEventListener('pointerenter', () => { auto = 12; }));
  addEventListener('touchstart', () => { auto = 24; }, { passive: true });

  /* ---------- lâmpada falhando ---------- */
  function flicker() {
    if (reduce) return;
    const on = () => B.classList.add('flicker'), off = () => B.classList.remove('flicker');
    on(); setTimeout(off, 60); setTimeout(on, 130); setTimeout(off, 170);
    if (Math.random() > 0.5) { setTimeout(on, 420); setTimeout(off, 470); }
  }
  (function schedule() { setTimeout(() => { flicker(); schedule(); }, rnd(7000, 15000)); })();

  /* ---------- glitch de texto aleatório ---------- */
  const titles = $$('.hero__title, .bebas-xl, .giant, .budget__title');
  setInterval(() => {
    if (reduce || !titles.length) return;
    const el = titles[Math.floor(Math.random() * titles.length)];
    el.classList.add('is-glitch'); setTimeout(() => el.classList.remove('is-glitch'), 750);
  }, 3800);
})();
