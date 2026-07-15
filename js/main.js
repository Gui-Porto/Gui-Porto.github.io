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

  // ---------------------------------------------------------------------
  // background — interactive dot grid ("blueprint"), plain canvas so it
  // stays alive even if the GSAP scripts fail to load. Monochrome blue on
  // near-white: a slow drifting light wash for depth, a fine dot grid, and
  // a soft spotlight that brightens dots around the pointer.
  // ---------------------------------------------------------------------
  (function initGrid() {
    const canvas = document.getElementById('aurora-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const GAP = 34;            // px between dots
    const R = Math.max(240, window.innerWidth * 0.22); // spotlight radius
    let w = 0, h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // pointer, smoothed toward its target each frame (no GSAP needed here)
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 };
    window.addEventListener('mousemove', (e) => { mouse.tx = e.clientX; mouse.ty = e.clientY; });

    // two soft single-hue washes drifting slowly for depth
    const washes = [
      { hue: '37, 99, 235', rx: 0.22, ry: 0.18, speed: 0.00010, phase: 0, alpha: 0.10 }, // brand blue
      { hue: '51, 65, 85',  rx: 0.20, ry: 0.24, speed: 0.00007, phase: 2.6, alpha: 0.07 } // cool slate
    ];

    function drawWash(t) {
      washes.forEach((b) => {
        const cx = w * (0.5 + Math.sin(t * b.speed + b.phase) * b.rx);
        const cy = h * (0.5 + Math.cos(t * b.speed * 1.2 + b.phase) * b.ry);
        const r = Math.max(w, h) * 0.55;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${b.hue}, ${b.alpha})`);
        g.addColorStop(1, `rgba(${b.hue}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
    }

    function drawDots() {
      const mx = mouse.x, my = mouse.y;
      for (let y = GAP; y < h; y += GAP) {
        for (let x = GAP; x < w; x += GAP) {
          const d = Math.hypot(x - mx, y - my);
          const near = Math.max(0, 1 - d / R); // 0..1, 1 right under the pointer
          const alpha = 0.05 + near * near * 0.4;
          const radius = 1 + near * 1.6;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.fill();
        }
      }
    }

    function frame(t) {
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      ctx.clearRect(0, 0, w, h);
      drawWash(t);
      drawDots();
    }

    if (reduced) {
      mouse.x = -9999; mouse.y = -9999; // no spotlight, just the calm wash + faint grid
      frame(0);
      return;
    }

    let raf = requestAnimationFrame(function loop(t) { frame(t); raf = requestAnimationFrame(loop); });
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(function loop(t) { frame(t); raf = requestAnimationFrame(loop); });
    });
  })();

  // ---------------------------------------------------------------------
  // GSAP animation layer
  // ---------------------------------------------------------------------
  const hasGSAP = typeof window.gsap !== 'undefined';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const allReveal = Array.from(document.querySelectorAll('[data-reveal]'));

  if (!hasGSAP || prefersReduced) {
    allReveal.forEach((el) => { el.style.opacity = 1; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // split hero title into per-character spans, preserving <br> and .accent
  function splitChars(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.textContent.split('').forEach((ch) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? ' ' : ch;
        frag.appendChild(span);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return el.querySelectorAll('.char');
  }

  // ---- hero entrance sequence ----
  // hero containers carry [data-reveal] for the anti-FOUC CSS rule, but their
  // own entrance is driven by animating their children (chars/buttons) below —
  // un-hide the containers themselves so those children are actually visible.
  gsap.set(document.querySelectorAll('.hero [data-reveal]'), { opacity: 1 });

  const heroTitle = document.querySelector('.hero-text h1');
  const chars = splitChars(heroTitle);
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  heroTl
    .from(chars, { yPercent: 120, rotateX: -90, opacity: 0, stagger: 0.02, duration: 0.9 })
    .from('.hero .eyebrow', { y: -16, opacity: 0, duration: 0.5 }, '-=0.55')
    .from('.hero .typewriter', { y: 16, opacity: 0, duration: 0.5 }, '-=0.35')
    .from('.hero-actions .btn', { y: 20, opacity: 0, stagger: 0.12, duration: 0.6, clearProps: 'transform' }, '-=0.3')
    .from('.hero-photo', { scale: 0.6, opacity: 0, rotate: -15, duration: 1, ease: 'back.out(1.4)' }, '-=0.8');

  // ---- generic scroll reveal (everything below the fold, except bespoke sections) ----
  const revealEls = allReveal.filter((el) =>
    !el.closest('.hero') && !el.closest('.skill-card') && !el.closest('.edu-card')
  );
  gsap.set(revealEls, { y: 40, scale: 0.96 });
  ScrollTrigger.batch(revealEls, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'transform'
    })
  });

  // timeline dots pop as their card reveals
  document.querySelectorAll('.timeline-card').forEach((card) => {
    const dot = card.querySelector('.dot');
    if (!dot) return;
    gsap.from(dot, {
      scale: 0, duration: 0.5, ease: 'back.out(3)',
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // timeline progress line draws in as you scroll the section
  const timelineProgress = document.querySelector('.timeline-progress');
  if (timelineProgress) {
    gsap.to(timelineProgress, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 80%', scrub: 0.5 }
    });
  }

  // skill cards: reveal + chips pop in
  // NB: these carry [data-reveal] (CSS opacity:0), so a plain .from() would
  // capture that already-0 opacity as its own end value and animate nothing —
  // use .fromTo() to pin both ends explicitly.
  document.querySelectorAll('.skill-card').forEach((card) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none none' } });
    tl.fromTo(card, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform' })
      .fromTo(card.querySelectorAll('.chip'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.05, duration: 0.45, ease: 'back.out(2)' }, '-=0.2');
  });

  // education cards: flip in (same [data-reveal] caveat as skill cards above)
  document.querySelectorAll('.edu-card').forEach((card) => {
    gsap.fromTo(card,
      { rotateX: -40, opacity: 0 },
      { rotateX: 0, opacity: 1, transformOrigin: 'top center', duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' } }
    );
  });

  // nav shrinks + gains shadow on scroll
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { targets: '.nav', className: 'nav-scrolled' }
  });

  // background blobs: subtle whole-page parallax (drift keyframes stay in CSS)
  gsap.to('.blobs', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.6 }
  });

  // magnetic buttons
  function magnetic(el, strength) {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    el.addEventListener('mouseenter', () => yTo(-4));
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * strength);
      yTo((e.clientY - r.top - r.height / 2) * strength - 4);
    });
    el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  }
  document.querySelectorAll('.btn').forEach((el) => magnetic(el, 0.25));

  // project card: 3D tilt + glow follows cursor
  document.querySelectorAll('.project-card').forEach((card) => {
    const glow = card.querySelector('.project-glow');
    const rxTo = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3' });
    const ryTo = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3' });
    const gxTo = glow && gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power3' });
    const gyTo = glow && gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power3' });
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ryTo(px * 14);
      rxTo(py * -14);
      if (glow) { gxTo(px * 160); gyTo(py * 160); }
    });
    card.addEventListener('mouseleave', () => {
      rxTo(0); ryTo(0);
      if (glow) { gxTo(0); gyTo(0); }
    });
  });

  // ambient cursor glow, trails the mouse across the whole page
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    gsap.set(cursorGlow, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const gx = gsap.quickTo(cursorGlow, 'x', { duration: 0.6, ease: 'power3' });
    const gy = gsap.quickTo(cursorGlow, 'y', { duration: 0.6, ease: 'power3' });
    window.addEventListener('mousemove', (e) => { gx(e.clientX); gy(e.clientY); });
  }

  // recalc trigger positions once everything above is wired up
  ScrollTrigger.refresh();
})();
