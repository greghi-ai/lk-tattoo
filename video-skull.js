/* LK — caveira em vídeo como fundo (otimizado)
   - o vídeo toca direto (decodificação por hardware); o canvas só entra durante o glitch
   - glitch só quando o cursor se MOVE em cima da caveira (nunca por causa do scroll) */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const B = document.body;
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- vídeo + canvas de glitch ---------- */
  const wrap = document.createElement('div');
  wrap.className = 'vskull'; wrap.setAttribute('aria-hidden', 'true');
  const vid = document.createElement('video');
  const mp4 = vid.canPlayType('video/mp4; codecs="avc1.4D401E"');
  Object.assign(vid, { src: mp4 ? 'assets/skull.mp4' : 'assets/skull.webm', poster: 'assets/skull-poster.jpg',
    muted: true, loop: true, playsInline: true, autoplay: true, preload: 'auto', disablePictureInPicture: true });
  vid.setAttribute('playsinline', ''); vid.setAttribute('muted', '');
  const cv = document.createElement('canvas');
  const S = 540; cv.width = cv.height = S;                 // resolução menor só pro glitch
  const ctx = cv.getContext('2d', { alpha: false });
  wrap.append(vid, cv); B.prepend(wrap);

  const tryPlay = () => vid.play().catch(() => {});
  tryPlay();
  ['pointerdown', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, tryPlay, { once: true, passive: true }));
  // pausa quando a aba não está visível
  document.addEventListener('visibilitychange', () => document.hidden ? vid.pause() : tryPlay());

  const bars = document.createElement('div');
  bars.className = 'gbars'; bars.setAttribute('aria-hidden', 'true');
  bars.innerHTML = '<i></i><i></i><i></i><i></i>';
  B.append(bars);
  const barEls = [...bars.children];

  /* ---------- estado ---------- */
  let last = scrollY, vel = 0, lastScrollT = 0;
  const sp = { x: 0, v: 0 };
  let lastTf = '', kick = 0, hoverUntil = 0, auto = 0, glitching = false, f = 0;
  const now = () => performance.now();
  const scrolling = () => now() - lastScrollT < 220;
  addEventListener('scroll', () => { lastScrollT = now(); hoverUntil = 0; }, { passive: true });


  function draw() {
    if (vid.readyState < 2) return;
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.drawImage(vid, 0, 0, S, S);
    const g1 = rnd(-14, 14) * (Math.random() < 0.2 ? 3 : 1);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.5; ctx.drawImage(vid, g1, 0, S, S);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    const n = Math.floor(rnd(2, 7));
    for (let i = 0; i < n; i++) {
      const sy = rnd(0, S), sh = rnd(3, 50);
      ctx.drawImage(vid, 0, sy * (720 / S), 720, sh * (720 / S), rnd(-60, 60), sy, S, sh);
    }
    ctx.fillStyle = 'rgba(0,0,0,.85)'; ctx.fillRect(0, rnd(0, S), S, rnd(1, 8));
    ctx.fillStyle = 'rgba(210,31,38,.35)'; ctx.fillRect(0, rnd(0, S), S, rnd(1, 6));
    if (Math.random() < 0.1) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, S, S); }
  }

  function setGlitch(on) {
    glitching = on;
    wrap.classList.toggle('is-glitch', on);
    B.classList.toggle('skull-glitch', on);
    if (on) { kick = 0.08; if (Math.random() < 0.4) flicker(); }
    else { B.style.removeProperty('--mj'); barEls.forEach(b => (b.style.opacity = 0)); }
  }

  function loop() {
    const y = scrollY, dy = y - last; last = y;
    vel += (dy - vel) * 0.18;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = clamp(y / max, 0, 1);

    // cresce conforme desce + respira (infla e murcha)
    const ready = B.classList.contains('ready') ? 1 : 0;
    const target = ((0.72 + p * 1.05) * (1 + 0.06 * Math.sin(y / 170)) + kick) * ready;
    kick *= 0.88;
    sp.v += (target - sp.x) * 0.08; sp.v *= 0.85; sp.x += sp.v;
    const sq = clamp(vel * 0.003, -0.08, 0.08);
    const rot = Math.sin(y / 520) * 3;
    const ty = (-0.12 + p * 0.32) * innerHeight;
    const tf = `translate3d(-50%,calc(-50% + ${ty.toFixed(0)}px),0) rotate(${rot.toFixed(1)}deg) scale(${(sp.x * (1 - sq * 0.5)).toFixed(3)},${(sp.x * (1 + sq)).toFixed(3)})`;
    if (tf !== lastTf) { wrap.style.transform = tf; lastTf = tf; }   // só escreve quando muda

    if (auto > 0) auto--;
    const g = !scrolling() && auto > 0;   // só os surtos automáticos
    if (g !== glitching) setGlitch(g);

    if (g && ++f % (reduce ? 4 : 2) === 0) {        // glitch a ~30 fps
      draw();
      for (const b of barEls) {
        b.style.cssText = Math.random() < 0.5
          ? `top:${rnd(0, 100)}%;height:${rnd(1, 14)}px;opacity:${rnd(0.15, 0.6)};transform:translateX(${rnd(-40, 40)}px)`
          : 'opacity:0';
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // surtos sozinha (nunca durante o scroll)
  (function spasm() {
    setTimeout(() => {
      if (!reduce && !scrolling() && !document.hidden && B.classList.contains('ready')) auto = Math.floor(rnd(8, 18));
      spasm();
    }, rnd(4000, 9000));
  })();

  /* ---------- lâmpada falhando ---------- */
  function flicker() {
    if (reduce) return;
    const on = () => B.classList.add('flicker'), off = () => B.classList.remove('flicker');
    on(); setTimeout(off, 60); setTimeout(on, 130); setTimeout(off, 170);
  }
  (function schedule() { setTimeout(() => { if (!document.hidden) flicker(); schedule(); }, rnd(9000, 16000)); })();

  /* ---------- glitch de texto aleatório ---------- */
  const titles = $$('.hero__title, .bebas-xl, .giant, .budget__title');
  setInterval(() => {
    if (reduce || !titles.length || scrolling() || document.hidden) return;
    const el = titles[Math.floor(Math.random() * titles.length)];
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;           // só o que está na tela
    el.classList.add('is-glitch'); setTimeout(() => el.classList.remove('is-glitch'), 700);
  }, 4200);
})();
