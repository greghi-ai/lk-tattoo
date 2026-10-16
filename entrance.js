/* LK — animações de entrada no scroll (PC e celular)
   Cada grupo aparece quando entra na tela, com atraso em cascata entre irmãos.
   Funciona em qualquer navegador (IntersectionObserver). Sem JS, tudo aparece normal. */
(() => {
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  document.documentElement.classList.add('ent');

  // quem já tem animação ligada ao scroll (entra pelos lados) não ganha outra por cima
  const busy = '.from-l,.from-r,.from-b,.zoom,.step,.player';
  const mark = (sel, kind, force) => $$(sel).forEach(el => { if (!el.dataset.ent && (force || !el.matches(busy))) el.dataset.ent = kind; });

  // fotos: abrem como cortina de baixo pra cima, com a imagem desinflando o zoom
  mark('.ph:not(.player)', 'wipe', true);   // cortina usa clip-path: combina com quem já entra pelos lados
  // linhas finas e traços vermelhos: crescem da esquerda
  mark('.tick, .steps__line', 'line');
  // selo: gira e cresce
  mark('.seal', 'pop');
  // textos e peças menores: sobem e aparecem
  mark([
    '.label', '.sobre__meta', '.sobre__tag', '.sobre__bio', '.btns > *', '.works__sel', '.works__all',
    '.filters button', '.videos__side', '.next > *', '.videos__stat', '.step em', '.step h3', '.step p',
    '.cta-ring', '.quote p', '.quote cite', '.quotes__nav', '.budget__aside', '.budget__agenda',
    '.form .f', '.form .submit', '.form__note', '.foot > *', '.hero__l', '.hero__r', '.hero__scroll'
  ].join(','), 'up');

  // cascata: irmãos do mesmo grupo entram um depois do outro
  const groups = new Map();
  $$('[data-ent]').forEach(el => {
    const p = el.parentElement;
    const n = groups.get(p) || 0;
    groups.set(p, n + 1);
    el.style.setProperty('--ed', Math.min(n, 8) * 0.08 + 's');
  });

  // revela pela posição na tela (fotos recortadas não são "vistas" pelo IntersectionObserver)
  let pending = $$('[data-ent]');
  let ticking = false;
  const check = () => {
    ticking = false;
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 8;
    const lim = atEnd ? innerHeight : innerHeight * 0.9;   // no fim da página revela o rodapé inteiro
    pending = pending.filter(el => {
      const r = el.getBoundingClientRect();
      if (r.top < lim && (r.bottom > 0 || r.top < 0)) { el.classList.add('ent-on'); return false; }
      return true;
    });
    if (!pending.length) removeEventListener('scroll', onScroll);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  // primeira checagem depois que o loader sai
  setTimeout(check, 1900);
})();
