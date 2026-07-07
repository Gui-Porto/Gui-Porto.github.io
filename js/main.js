(function () {
  const PHRASES = {
    pt: ['Supervisor Administrativo', 'Desenvolvedor Web em formação', 'Criador do Lexo — SaaS Jurídico', 'HTML • CSS • JavaScript • Node.js'],
    en: ['Administrative Supervisor', 'Web Developer in training', 'Creator of Lexo — Legal SaaS', 'HTML • CSS • JavaScript • Node.js']
  };

  const body = document.body;
  const typedEl = document.getElementById('typed');
  const langBtn = document.getElementById('lang-toggle');

  let lang = 'pt';
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let timer = null;

  function tick() {
    const list = PHRASES[lang];
    const full = list[phraseIndex % list.length];

    if (deleting) {
      charIndex--;
      if (charIndex <= 0) { deleting = false; phraseIndex++; }
    } else {
      charIndex++;
      if (charIndex >= full.length) { deleting = true; }
    }

    typedEl.textContent = full.slice(0, Math.max(0, charIndex));

    let delay = deleting ? 35 : 75;
    if (!deleting && charIndex >= full.length) delay = 1800;
    timer = setTimeout(tick, delay);
  }

  function restartTypewriter() {
    clearTimeout(timer);
    phraseIndex = 0;
    charIndex = 0;
    deleting = false;
    typedEl.textContent = '';
    tick();
  }

  langBtn.addEventListener('click', () => {
    lang = lang === 'pt' ? 'en' : 'pt';
    body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    restartTypewriter();
  });

  restartTypewriter();

  // mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  function closeNav() {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeNav(); });

  // scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
