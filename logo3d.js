/* LK — logo 3D de fundo (canvas, leve)
   A logo é extrudada em um único canvas: camadas laterais deslocadas na direção do giro + face com gradiente
   e brilho. Só redesenha quando o ângulo muda. Acompanha o scroll: desce, cresce, "respira" e gira;
   inclina seguindo o mouse. */
(() => {
  const B = document.body;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rad = d => d * Math.PI / 180;

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
    DPR = Math.min(devicePixelRatio || 1, 1.25);
    const w = wrap.offsetWidth, h = wrap.offsetHeight;   // tamanho de layout (sem o scale)
    CW = Math.round(w * (1 + PAD * 2) * DPR); CH = Math.round(h * (1 + PAD * 2) * DPR);
    cv.width = CW; cv.height = CH; lastKey = '';
  }
  addEventListener('resize', size);

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
    const q = v => Math.round(v * 2) / 2;                       // redesenha a cada meio grau
    const key = q(ry) + '|' + q(rx) + '|' + q(rz);
    if (key === lastKey) return;
    lastKey = key;
    const fw = CW / (1 + PAD * 2), fh = CH / (1 + PAD * 2);
    const sx = Math.cos(rad(ry)), sy = Math.cos(rad(rx));        // encurtamento do giro
    const depth = fw * 0.13;
    const vx = -Math.sin(rad(ry)) * depth, vy = Math.sin(rad(rx)) * depth;  // direção da extrusão
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CW, CH);
    ctx.translate(CW / 2, CH / 2);
    ctx.rotate(rad(rz));
    const w = fw * sx, h = fh * sy;
    const steps = clamp(Math.ceil(Math.hypot(vx, vy) / (2.2 * DPR)), 6, 16);   // camadas suficientes para não ter frestas
    for (let i = steps; i >= 1; i--) {
      const t = i / steps;
      const img = IM[Math.min(3, Math.floor((1 - t) * 4))];
      ctx.drawImage(img, -w / 2 + vx * t, -h / 2 + vy * t, w, h);
    }
    ctx.drawImage(IM[4], -w / 2 + vx * 0.02, -h / 2 + vy * 0.02, w, h);  // bisel
    const face = faceWithSheen(Math.round(fw), Math.round(fh), Math.round((0.5 + ry / 70) * 20) / 20);
    ctx.drawImage(face, -w / 2, -h / 2, w, h);
  }

  let last = scrollY, vel = 0, t0 = performance.now(), lastTf = '', lastOp = '';
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  const sp = { x: 0, v: 0 };
  addEventListener('mousemove', e => {
    tmx = (e.clientX / innerWidth) * 2 - 1;
    tmy = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  function loop(now) {
    const t = (now - t0) / 1000;
    const y = scrollY, dy = y - last; last = y;
    vel += (dy - vel) * 0.15;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = clamp(y / max, 0, 1);
    mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;

    // tamanho: cresce até o fim da página e respira como inflável
    const ready = B.classList.contains('ready') ? 1 : 0;
    const target = ((0.78 + p * 0.9) * (1 + 0.05 * Math.sin(y / 180) + 0.012 * Math.sin(t * 1.6))) * ready;
    sp.v += (target - sp.x) * 0.08; sp.v *= 0.84; sp.x += sp.v;

    // posição: desce acompanhando
    const ty = (-0.06 + p * 0.28) * innerHeight + Math.sin(t * 0.9) * 6;
    const tf = `translate3d(-50%,calc(-50% + ${ty.toFixed(0)}px),0) scale(${sp.x.toFixed(3)})`;
    if (tf !== lastTf) { wrap.style.transform = tf; lastTf = tf; }
    const op = (ready ? clamp(1 - (y / innerHeight) * 0.6, 0.42, 1) : 0).toFixed(2);
    if (op !== lastOp) { wrap.style.opacity = op; lastOp = op; }

    // giro: o scroll gira a logo, o mouse inclina
    const ry = Math.sin(y / 420) * 34 + mx * 14 + clamp(vel * 0.25, -10, 10);
    const rx = -my * 9 + Math.sin(t * 0.7) * 2.5;
    const rz = Math.sin(y / 900) * 3;
    draw(ry, rx, rz);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(() => { size(); requestAnimationFrame(loop); });
})();
