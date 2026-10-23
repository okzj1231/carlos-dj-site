// Fade-in allo scorrimento con IntersectionObserver.
// Gli elementi compaiono quando entrano nell'area visibile; le schede dei concerti una alla volta.
(() => {
  if (!('IntersectionObserver' in window)) return;

  const GROUPS = [
    { sel: '.card, .mix', kind: 'card' },
    { sel: '#concerti .wrap, #mix .wrap > h2, #mix .wrap > .sub, #mix .panel, #prenota .panel', kind: 'block' },
    { sel: 'main > h1, main > .sub, main > .panel, .app > .panel', kind: 'block' },
    { sel: '.site-footer', kind: 'block' }
  ];
  const STAGGER = { card: 160, block: 90 };   // ms tra elementi che entrano insieme

  function start() {
    const els = new Set();
    GROUPS.forEach(g => document.querySelectorAll(g.sel).forEach(el => {
      if (!el.dataset.reveal) el.dataset.reveal = g.kind;
      els.add(el);
    }));
    document.documentElement.classList.add('reveal-on');

    const io = new IntersectionObserver(entries => {
      const batch = entries.filter(e => e.isIntersecting).map(e => e.target)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      batch.forEach((el, i) => {
        io.unobserve(el);
        const delay = i * STAGGER[el.dataset.reveal];
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('is-in');
        // A fine animazione si rimuove tutto, così tornano le transizioni originali (es. hover delle schede)
        let cleaned = false;
        const clean = () => {
          if (cleaned) return;
          cleaned = true;
          el.removeAttribute('data-reveal');
          el.classList.remove('is-in');
          el.style.transitionDelay = '';
        };
        el.addEventListener('transitionend', e => { if (e.target === el && e.propertyName === 'opacity') clean(); });
        setTimeout(clean, delay + 1200);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    els.forEach(el => io.observe(el));
  }

  start();
})();
