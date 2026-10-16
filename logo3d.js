/* LK — logo 3D de fundo (canvas, leve)
   A logo é extrudada em um único canvas: camadas laterais deslocadas na direção do giro + face com gradiente
   e brilho. Só redesenha quando o ângulo muda. Acompanha o scroll: desce, cresce, "respira" e gira;
   inclina seguindo o mouse. */
(() => {
  const B = document.body;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rad = d => d * Math.PI / 180;
  const MOB = matchMedia('(max-width:760px)').matches || matchMedia('(hover: none)').matches;
  // altura estável: no celular a barra do navegador muda innerHeight ao rolar — isso fazia a logo pular
  let VH = innerHeight, VW = innerWidth;

  const wrap = document.createElement('div');
  wrap.className = 'logo3d';
  wrap.setAttribute('aria-hidden', 'true');
  const glow = document.createElement('div'); glow.className = 'logo3d__glow';
  const cv = document.createElement('canvas'); cv.className = 'logo3d__cv';
  wrap.append(glow, cv);
  B.prepend(wrap);
  const ctx = cv.getContext('2d');

  // imagens pré-renderizadas da logo (tons de lateral, bisel e face)
  const load = n => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = `assets/${n}.png`; });
  let IM = null;
  Promise.all(['lk-s0', 'lk-s1', 'lk-s2', 'lk-s3', 'lk-bevel', 'lk-face'].map(load)).then(a => { if (a.every(Boolean)) { IM = a; lastKey = ''; } });

  const PAD = 0.22;                       // margem do canvas para o volume/giro não cortar
  let CW = 0, CH = 0, DPR = 1;
  function size() {
    DPR = Math.min(devicePixelRatio || 1, MOB ? 1 : 1.25);
    const w = wrap.offsetWidth, h = wrap.offsetHeight;   // tamanho de layout (sem o scale)
    CW = Math.round(w * (1 + PAD * 2) * DPR); CH = Math.round(h * (1 + PAD * 2) * DPR);
    cv.width = CW; cv.height = CH; lastKey = '';
  }
  addEventListener('resize', () => {
    if (Math.abs(innerWidth - VW) < 2 && MOB) return;   // só a barra do navegador mexeu: ignora
    VW = innerWidth; VH = innerHeight; size();
  });

  // face com brilho (offscreen, refeita só quando o brilho anda)
  const off = document.createElement('canvas'), octx = off.getContext('2d');
  let offKey = '';
  function faceWithSheen(fw, fh, sx) {
    const k = fw + 'x' + fh + ':' + sx.toFixed(2);
    if (k === offKey) return off;
    offKey = k; off.width = fw; off.height = fh;
    octx.globalCompositeOperation = 'source-over';
    octx.clearRect(0, 0, fw, fh);
    octx.drawImage(IM[5], 0, 0, fw, fh);
    octx.globalCompositeOperation = 'source-atop';
    const g = octx.createLinearGradient(0, 0, fw, fh * 0.35);
    const c = clamp(sx, 0.05, 0.95);
    g.addColorStop(clamp(c - 0.16, 0, 1), 'rgba(255,255,255,0)');
    g.addColorStop(c, 'rgba(255,255,255,.42)');
    g.addColorStop(clamp(c + 0.16, 0, 1), 'rgba(255,255,255,0)');
    octx.fillStyle = g; octx.fillRect(0, 0, fw, fh);
    return off;
  }

  let lastKey = '';
  function draw(ry, rx, rz) {
    if (!IM || !CW) return;
    const q = v => MOB ? Math.round(v) : Math.round(v * 2) / 2;  // redesenha a cada meio grau (1° no celular)
    const key = q(ry) + '|' + q(rx) + '|' + q(rz);
    if (key === lastKey) return;
    lastKey = key;
    const fw = CW / (1 + PAD * 2), fh = CH / (1 + PAD * 2);
    const c = Math.cos(rad(ry)), sy = Math.cos(rad(rx));
    const s = c < 0 ? -1 : 1;                                       // de costas: espelha (vê o verso da logo)
    const depth = fw * 0.13;
    // extrusão vai da face visível para a face escondida
    const vx = -s * Math.sin(rad(ry)) * depth, vy = Math.sin(rad(rx)) * depth;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CW, CH);
    ctx.translate(CW / 2, CH / 2);
    ctx.rotate(rad(rz));
    const w = fw * Math.max(Math.abs(c), 0.02), h = fh * sy;
    ctx.scale(s, 1);
    const ox = vx * s;                                              // deslocamento no espaço espelhado
    const steps = clamp(Math.ceil(Math.hypot(vx, vy) / (2.2 * DPR)), 6, 16);   // camadas suficientes para não ter frestas
    for (let i = steps; i >= 1; i--) {
      const t = i / steps;
      const img = IM[Math.min(3, Math.floor((1 - t) * 4))];
      ctx.drawImage(img, -w / 2 + ox * t, -h / 2 + vy * t, w, h);
    }
    ctx.drawImage(IM[4], -w / 2 + ox * 0.02, -h / 2 + vy * 0.02, w, h);  // bisel
    const ryN = ((ry % 360) + 540) % 360 - 180;                     // -180..180 para o brilho
    const face = faceWithSheen(Math.round(fw), Math.round(fh), Math.round((0.5 + s * Math.sin(rad(ryN)) * 0.5) * 20) / 20);
    ctx.drawImage(face, -w / 2, -h / 2, w, h);
  }

  let last = scrollY, vel = 0, t0 = performance.now(), lastTf = '', lastOp = '';
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  const sp = { x: 0, v: 0 };
  // giro de 360° quando o mouse passa sobre a logo
  let spinT = -1, inside = false;
  const SPIN_MS = 1500;
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const cursorEl = document.querySelector('.cursor');
  const overLogo = (x, y) => {
    const r = wrap.getBoundingClientRect();
    if (!r.width || +wrap.style.opacity < 0.3) return false;
    const nx = (x - (r.left + r.width / 2)) / (r.width * 0.55);
    const ny = (y - (r.top + r.height / 2)) / (r.height * 0.55);
    return nx * nx + ny * ny < 1;
  };
  const spin = () => { if (spinT < 0) spinT = performance.now(); };
  addEventListener('mousemove', e => {
    tmx = (e.clientX / innerWidth) * 2 - 1;
    tmy = (e.clientY / VH) * 2 - 1;
    const now = overLogo(e.clientX, e.clientY);
    if (now && !inside) spin();
    if (now !== inside && cursorEl) cursorEl.classList.toggle('is-hover', now);
    inside = now;
  }, { passive: true });
  // celular: tocar na logo
  document.addEventListener('click', e => {
    if (e.target.closest('a,button,input,textarea,label,select')) return;
    if (overLogo(e.clientX, e.clientY)) spin();
  });

  function loop(now) {
    const t = (now - t0) / 1000;
    const y = scrollY, dy = y - last; last = y;
    vel += (dy - vel) * 0.15;
    const max = Math.max(1, document.documentElement.scrollHeight - VH);
    const p = clamp(y / max, 0, 1);
    mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;

    // tamanho: cresce até o fim da página e respira como inflável
    const ready = B.classList.contains('ready') ? 1 : 0;
    const target = ((MOB ? 0.92 + p * 0.25 : 0.78 + p * 0.9) * (1 + 0.05 * Math.sin(y / 180) + 0.012 * Math.sin(t * 1.6))) * ready;
    sp.v += (target - sp.x) * 0.08; sp.v *= 0.84; sp.x += sp.v;

    // posição: desce acompanhando
    const ty = (MOB ? -0.08 + p * 0.12 : -0.06 + p * 0.28) * VH + Math.sin(t * 0.9) * 6;
    const tf = `translate3d(-50%,calc(-50% + ${ty.toFixed(0)}px),0) scale(${sp.x.toFixed(3)})`;
    if (tf !== lastTf) { wrap.style.transform = tf; lastTf = tf; }
    const op = (ready ? clamp(1 - (y / VH) * (MOB ? 0.9 : 0.6), MOB ? 0.16 : 0.42, 1) : 0).toFixed(2);
    if (op !== lastOp) { wrap.style.opacity = op; lastOp = op; }

    // giro: o scroll gira a logo, o mouse inclina
    let extra = 0;
    if (spinT >= 0) {
      const k = (now - spinT) / SPIN_MS;
      if (k >= 1) spinT = -1; else { extra = 360 * ease(k); sp.v += 0.004 * Math.sin(k * Math.PI); }  // dá um "puff" no meio do giro
    }
    const ry = Math.sin(y / 420) * (MOB ? 26 : 34) + (MOB ? 0 : mx * 14 + clamp(vel * 0.25, -10, 10)) + extra;
    const rx = MOB ? 0 : -my * 9 + Math.sin(t * 0.7) * 2.5;
    const rz = Math.sin(y / 900) * 3;
    draw(ry, rx, rz);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(() => { size(); requestAnimationFrame(loop); });
})();
