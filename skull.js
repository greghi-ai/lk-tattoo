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
<svg viewBox="0 0 400 470" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sk-bone" cx="40%" cy="30%" r="80%">
      <stop offset="0" stop-color="#EDE6D6"/><stop offset=".45" stop-color="#CFC4AC"/><stop offset=".8" stop-color="#8C7F68"/><stop offset="1" stop-color="#4a3f33"/>
    </radialGradient>
    <radialGradient id="sk-grime" cx="50%" cy="45%" r="60%">
      <stop offset=".55" stop-color="#2a1c14" stop-opacity="0"/><stop offset="1" stop-color="#1a0d08" stop-opacity=".75"/>
    </radialGradient>
    <radialGradient id="sk-ember"><stop offset="0" stop-color="#ff6a5a"/><stop offset=".3" stop-color="#D21F26"/><stop offset="1" stop-color="#9E1015" stop-opacity="0"/></radialGradient>
    <linearGradient id="sk-blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9E1015"/><stop offset=".5" stop-color="#D21F26"/><stop offset="1" stop-color="#7a0b0f"/></linearGradient>
    <style>
      .ln{fill:none;stroke:#080808;stroke-linecap:round;stroke-linejoin:round}
      .tu{fill:#D8CDB2;stroke:#080808;stroke-width:4;stroke-linejoin:round}
      .tl{fill:#C9BC9E;stroke:#080808;stroke-width:4;stroke-linejoin:round}
    </style>
  </defs>
  <!-- boca (interior) -->
  <path d="M124 334 H276 V398 H124Z" fill="#050303"/>
  <path d="M150 352 v30 M206 352 v22 M246 352 v36" stroke="#7a0b0f" stroke-width="3" opacity=".9"/>
  <g class="sk-jaw">
    <path d="M96 334 C88 384 108 428 150 442 C176 451 224 451 250 442 C292 428 312 384 304 334 C294 350 272 358 250 358 L150 358 C128 358 106 350 96 334Z" fill="url(#sk-bone)" stroke="#080808" stroke-width="7" stroke-linejoin="round"/>
    <path d="M96 334 C88 384 108 428 150 442 C176 451 224 451 250 442 C292 428 312 384 304 334 C294 350 272 358 250 358 L150 358 C128 358 106 350 96 334Z" fill="url(#sk-grime)"/>
    ${LO.map(([h, o], i) => h ? `<path d="M${132 + i * 17} ${356 + o} h15 v${h - 4} q0 4 -4 4 h-7 q-4 0 -4 -4z" class="tl"/>` : '').join('')}
    <path class="ln" stroke-width="3" d="M160 428 C184 436 216 436 240 428"/>
    <path class="ln" stroke-width="2.5" d="M114 390 C120 404 130 416 142 422 M286 390 C280 404 270 416 258 422 M200 410 L196 424 L204 432"/>
  </g>
  <g class="sk-head">
    <path d="M200 18 C92 18 36 95 38 192 C40 246 58 276 84 298 L90 336 C94 350 108 355 120 351 L280 351 C292 355 306 350 310 336 L316 298 C342 276 360 246 362 192 C364 95 308 18 200 18Z" fill="url(#sk-bone)" stroke="#080808" stroke-width="7" stroke-linejoin="round"/>
    <path d="M200 18 C92 18 36 95 38 192 C40 246 58 276 84 298 L90 336 C94 350 108 355 120 351 L280 351 C292 355 306 350 310 336 L316 298 C342 276 360 246 362 192 C364 95 308 18 200 18Z" fill="url(#sk-grime)"/>
    <!-- têmporas fundas -->
    <path d="M44 170 C58 178 72 214 84 262 C70 250 52 222 44 170Z M356 170 C342 178 328 214 316 262 C330 250 348 222 356 170Z" fill="#1a0d08" opacity=".55"/>
    <path class="ln" stroke-width="3" d="M60 150 C66 205 78 244 98 272 M70 148 C74 190 84 220 96 240 M340 150 C334 205 322 244 302 272 M330 148 C326 190 316 220 304 240"/>
    <!-- maçãs do rosto cortantes -->
    <path class="ln" stroke-width="4" d="M104 262 L136 282 L172 276 M296 262 L264 282 L228 276"/>
    <!-- cicatriz costurada -->
    <path class="ln" stroke-width="4.5" d="M120 104 C160 84 236 82 280 104"/>
    <path class="ln" stroke-width="3" d="M132 88 L140 114 M152 80 L158 106 M174 76 L178 102 M196 74 L198 100 M218 75 L218 101 M240 78 L237 104 M262 85 L256 111"/>
    <!-- rachaduras -->
    <path class="ln" stroke-width="3.5" d="M296 62 L280 96 L296 112 L282 146 L292 158"/>
    <path class="ln" stroke-width="3" d="M96 96 L116 120 L108 140 M186 140 L196 160 L188 176"/>
    <!-- sobrancelha franzida (ossos da testa) -->
    <path d="M84 168 L186 198 L178 212 L92 186Z M316 168 L214 198 L222 212 L308 186Z" fill="#3a2c20" opacity=".6"/>
    <!-- órbitas angulares -->
    <path d="M100 182 L182 206 C192 222 186 244 170 254 C150 266 120 260 108 244 C98 230 96 206 100 182Z" fill="#050303"/>
    <path d="M300 182 L218 206 C208 222 214 244 230 254 C250 266 280 260 292 244 C302 230 304 206 300 182Z" fill="#050303"/>
    <path class="ln" stroke-width="8" d="M88 170 L186 200 M312 170 L214 200"/>
    <circle class="sk-eye" cx="146" cy="228" r="34" fill="url(#sk-ember)"/>
    <circle class="sk-eye" cx="254" cy="228" r="34" fill="url(#sk-ember)"/>
    <circle class="sk-pupil" cx="148" cy="230" r="4" fill="#ffd9d4"/>
    <circle class="sk-pupil" cx="252" cy="230" r="4" fill="#ffd9d4"/>
    <!-- nariz -->
    <path d="M200 256 L182 300 L194 296 L200 306 L206 296 L218 300Z" fill="#050303" stroke="#080808" stroke-width="3" stroke-linejoin="round"/>
    <!-- dentes de cima -->
    ${UP.map(([h, o], i) => h ? `<path d="M${132 + i * 17} ${318} h15 v${h - 4 + o} q0 4 -4 4 h-7 q-4 0 -4 -4z" class="tu"/>` : '').join('')}
    <path d="M200 322 l4 10 l-5 6" class="ln" stroke-width="2"/>
    <!-- sangue escorrendo do olho -->
    <path class="sk-tear" d="M130 258 C128 276 133 296 129 320 C127 334 141 336 139 320 C136 296 140 276 138 258Z" fill="url(#sk-blood)"/>
    <path d="M266 254 C265 266 268 276 266 290 C265 297 273 297 272 290 C270 276 272 266 271 254Z" fill="url(#sk-blood)" opacity=".85"/>
    <!-- brilho de vinil (inflável) -->
    <ellipse class="sk-sheen" cx="138" cy="70" rx="40" ry="13" fill="#fff" transform="rotate(-22 138 70)"/>
  </g>
</svg>`;

  const skull = document.createElement('div');
  skull.className = 'skull';
  skull.setAttribute('aria-hidden', 'true');
  skull.innerHTML = svg;
  document.body.append(skull);

  /* ---------- física: infla/murcha com o scroll, molinha de inflável ---------- */
  let last = scrollY, vel = 0, t0 = performance.now();
  const sp = { x: 0, v: 0 };            // escala com mola (começa vazia e infla)
  let kick = 0, mx = innerWidth / 2, my = innerHeight / 2;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function loop(now) {
    const t = now - t0;
    const y = scrollY, dy = y - last; last = y;
    vel += (dy - vel) * 0.18;

    // "respira" conforme rola: enche e esvazia
    const breath = 1 + 0.2 * Math.sin(y / 230) + 0.03 * Math.sin(t / 700);
    const ready = document.body.classList.contains('ready') ? 1 : 0;
    const target = (breath + kick) * ready;
    kick *= 0.9;
    sp.v += (target - sp.x) * 0.09;
    sp.v *= 0.84;                         // amortecimento baixo = balança como balão
    sp.x += sp.v;

    const sq = clamp(vel * 0.007, -0.28, 0.28);   // achata/estica com a velocidade
    const sx = sp.x * (1 - sq * 0.55 + sp.v * 0.8);
    const sy = sp.x * (1 + sq - sp.v * 0.5);
    const rot = clamp(vel * 0.25, -16, 16) + Math.sin(t / 1100) * 3;
    const ty = Math.sin(y / 420) * (innerHeight * 0.12) + Math.sin(t / 900) * 6;
    const tx = Math.sin(y / 800) * -26;
    skull.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;

    // mandíbula abre com scroll rápido, olhos acendem
    const speed = Math.abs(vel);
    skull.style.setProperty('--jaw', clamp(speed * 0.9, 0, 26).toFixed(1) + 'px');
    if (!skull.classList.contains('is-angry')) {
      skull.style.setProperty('--eye', clamp(0.45 + speed * 0.02, 0.45, 1).toFixed(2));
      skull.style.setProperty('--glow', clamp(0.2 + speed * 0.02, 0.2, 0.8).toFixed(2));
    }

    // pupilas seguem o mouse
    const r = skull.getBoundingClientRect();
    const ang = Math.atan2(my - (r.top + r.height * 0.45), mx - (r.left + r.width / 2));
    skull.style.setProperty('--px', (Math.cos(ang) * 7).toFixed(1) + 'px');
    skull.style.setProperty('--py', (Math.sin(ang) * 6).toFixed(1) + 'px');

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* hover: ela acorda, bate os dentes e dá um tranco de ar */
  let angryT;
  const wake = (ms = 0) => {
    skull.classList.add('is-angry'); kick = 0.35;
    clearTimeout(angryT); if (ms) angryT = setTimeout(sleep, ms);
  };
  const sleep = () => skull.classList.remove('is-angry', 'is-scream');
  skull.addEventListener('pointerenter', () => wake());
  skull.addEventListener('pointerleave', () => setTimeout(sleep, 350));
  skull.addEventListener('click', () => {
    skull.classList.add('is-angry', 'is-scream'); kick = 0.6; flicker(true);
    setTimeout(() => skull.classList.remove('is-scream'), 500);
    if (matchMedia('(hover: none)').matches) setTimeout(sleep, 1200);
  });
  // passou o cursor por cima de um título grande → ela olha e range os dentes rapidinho
  $$('.bebas-xl, .giant, .budget__title').forEach(el => el.addEventListener('pointerenter', () => wake(700)));

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
