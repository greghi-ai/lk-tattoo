/* LK — modos de cor: Realismo (padrão) · Preto & cinza · Colorido */
(() => {
  const root = document.documentElement;
  // camadas do fundo colorido
  const mesh = document.createElement('div'); mesh.className = 'bgmesh'; mesh.setAttribute('aria-hidden', 'true');
  const veil = document.createElement('div'); veil.className = 'bgveil'; veil.setAttribute('aria-hidden', 'true');
  document.body.prepend(veil); document.body.prepend(mesh);
  const btns = [...document.querySelectorAll('.nav__pills [data-mode]')];
  const MODES = ['real', 'pb', 'color'];
  const set = (m, save) => {
    if (!MODES.includes(m)) m = 'real';
    root.classList.add('mode-switching');
    MODES.forEach(x => root.classList.toggle('mode-' + x, x === m && x !== 'real'));
    btns.forEach(b => { const on = b.dataset.mode === m; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
    setTimeout(() => root.classList.remove('mode-switching'), 700);
    if (save) try { localStorage.setItem('lk-mode', m); } catch (e) {}
  };
  btns.forEach(b => b.addEventListener('click', () => set(b.dataset.mode, true)));
  let saved = 'real';
  try { saved = localStorage.getItem('lk-mode') || 'real'; } catch (e) {}
  set(saved, false);
})();
