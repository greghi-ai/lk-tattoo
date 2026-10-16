/* LK Tattoo — motion leve */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Número do WhatsApp do estúdio (só dígitos, com DDI 55). Ex.: '5513999999999'
  const WHATSAPP = '';

  /* ---------- loader ---------- */
  const start = () => {
    document.body.classList.remove('is-loading');
    requestAnimationFrame(() => document.body.classList.add('ready'));
  };
  window.addEventListener('load', () => setTimeout(start, 1700));
  setTimeout(start, 4000); // garantia

  /* ---------- split de títulos em letras ---------- */
  $$('[data-split]').forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(word => {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.append(document.createTextNode(word)); return; }
            const ln = document.createElement('span'); ln.className = 'ln';
            [...word].forEach(ch => {
              const s = document.createElement('span');
              s.className = 'ch'; s.textContent = ch; s.style.setProperty('--i', i++);
              ln.append(s);
            });
            frag.append(ln);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  });

  /* letras piscando no hero */
  $$('.hero__whisper span').forEach((s, i) => s.style.setProperty('--i', (i * 7) % 11));

  /* ---------- reveal ao rolar ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      const c = e.target.querySelector?.('[data-count]') || (e.target.matches('[data-count]') && e.target);
      if (c) countUp(c);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  $$('[data-r], [data-split]').forEach(el => io.observe(el));
  // stagger dos cards
  $$('.grid .work').forEach((w, i) => w.style.setProperty('--d', (i % 3) * 0.12 + 's'));
  $$('.next, .btns, .form').forEach(el => el.style.setProperty('--d', '.15s'));

  function countUp(el) {
    const to = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- cursor ---------- */
  const cur = $('.cursor');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('pointerover', e => {
    cur.classList.toggle('is-hover', !!e.target.closest('a, button, .work, .thumb, .sizes i'));
  });

  /* ---------- scroll: nav, parallax, marquee, linha do processo ---------- */
  const nav = $('.nav');
  const par = $$('[data-speed]');
  const marquee = $('.marquee span');
  const videos = $('.videos');
  const process = $('.process');
  const steps = $$('.step');
  const budget = $('.budget');

  addEventListener('pointermove', e => {
    const r = budget.getBoundingClientRect();
    budget.style.setProperty('--mx', e.clientX - r.left + 'px');
    budget.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true });

  const prog = el => {
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
  };

  let fc = 0;
  const pending = () => $$('[data-r]:not(.in), [data-split]:not(.in)');
  function frame() {
    const y = scrollY;
    // garantia: revela o que já passou da tela mesmo em rolagem muito rápida
    if (++fc % 15 === 0) pending().forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight * 0.9) { el.classList.add('in'); const c = el.querySelector('[data-count]'); if (c) countUp(c); }
    });
    nav.classList.toggle('is-scrolled', y > 40);

    if (!reduce) {
      if (innerWidth > 760) par.forEach(el => {
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2 - innerHeight / 2;
        el.style.translate = `0 ${(-c * +el.dataset.speed).toFixed(1)}px`;
      });
      if (marquee) marquee.style.transform = `translateX(${(-prog(videos) * 40).toFixed(2)}%)`;
    }
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cur.style.transform = `translate(${cx}px, ${cy}px)`;

    // linha do processo acende conforme rola
    const r = process.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - (r.top + 300)) / (r.height * 0.55)));
    process.style.setProperty('--p', p.toFixed(3));
    steps.forEach((s, i) => s.classList.toggle('is-lit', p >= i / steps.length + 0.02));

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- filtros dos trabalhos ---------- */
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.classList.toggle('is-on', x === b));
    const f = b.dataset.f;
    $$('.work').forEach(w => w.classList.toggle('is-off', f !== 'all' && !w.dataset.tags.split(' ').includes(f)));
  }));

  /* ---------- depoimentos ---------- */
  const qs = $$('.quote'), dots = $$('.quotes__dots i'), num = $('.quotes__n');
  let qi = 0, qTimer;
  const show = n => {
    qi = (n + qs.length) % qs.length;
    qs.forEach((q, i) => q.classList.toggle('is-on', i === qi));
    dots.forEach((d, i) => d.classList.toggle('is-on', i === qi));
    num.textContent = String(qi + 1).padStart(2, '0');
  };
  const auto = () => { clearInterval(qTimer); qTimer = setInterval(() => show(qi + 1), 6500); };
  $$('[data-q]').forEach(b => b.addEventListener('click', () => { show(qi + +b.dataset.q); auto(); }));
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); auto(); }));
  auto();

  /* ---------- formulário → WhatsApp ---------- */
  $('.form').addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(e.target);
    const msg = [
      'Olá, LK! Quero um orçamento.',
      `Nome: ${d.get('nome') || ''}`,
      `Ideia: ${d.get('ideia') || ''}`,
      `Local do corpo: ${d.get('local') || ''}`,
      `Tamanho: ${d.get('tam') || ''}`,
      'Vou mandar as referências aqui na conversa.'
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
})();
