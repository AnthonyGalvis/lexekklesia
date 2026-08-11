// ---- Google Analytics 4 ----
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-H3Q46LV3QG');

  // ---- Price card 3D tilt (mouse-fine only) ----
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.price-card[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform 60ms linear';
        card.style.transform = `perspective(1000px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg) scale(1.02)`;
      });
      card.addEventListener('mouseenter', () => card.classList.add('shine'));
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 400ms var(--ease-out)';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.classList.remove('shine');
      });
    });
  }


  // ---- NAV scroll state ----
  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ---- Mobile menu ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function setNavHeight() {
    document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }
  setNavHeight();
  window.addEventListener('resize', setNavHeight);

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }
  function openMenu() {
    setNavHeight();
    navLinks.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  }
  navToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });

  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // ---- Reusable carousel ----
  function initCarousel({ trackId, dotsId, viewport, wrap, prevBtn, nextBtn, autoplayMs, flipIcons }) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const slides = Array.from(track.children);
    const dotsWrap = document.getElementById(dotsId);
    let current = 0;
    let autoplayTimer;

    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'cdot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (flipIcons) {
        const activeIcon = slides[current].querySelector('.icon-circle');
        if (activeIcon && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          activeIcon.classList.remove('flip-in');
          void activeIcon.offsetWidth;
          activeIcon.classList.add('flip-in');
        }
      }
    }
    function goTo(i) {
      current = (i + slides.length) % slides.length;
      render();
      restartAutoplay();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      if (slides.length > 1) autoplayTimer = setInterval(next, autoplayMs);
    }
    restartAutoplay();

    wrap.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    wrap.addEventListener('mouseleave', restartAutoplay);

    // Drag / swipe
    let isDown = false, startX = 0, startTranslate = 0, viewportWidth = 0;

    function pointerDown(x) {
      isDown = true;
      startX = x;
      viewportWidth = viewport.getBoundingClientRect().width;
      startTranslate = -current * viewportWidth;
      track.classList.add('dragging');
      clearInterval(autoplayTimer);
    }
    function pointerMove(x) {
      if (!isDown) return;
      const dx = x - startX;
      track.style.transform = `translateX(${startTranslate + dx}px)`;
    }
    function pointerUp(x) {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('dragging');
      const dx = x - startX;
      if (Math.abs(dx) > viewportWidth * 0.18) {
        dx < 0 ? next() : prev();
      } else {
        render();
        restartAutoplay();
      }
    }

    viewport.addEventListener('mousedown', e => pointerDown(e.clientX));
    window.addEventListener('mousemove', e => pointerMove(e.clientX));
    window.addEventListener('mouseup', e => pointerUp(e.clientX));
    viewport.addEventListener('touchstart', e => pointerDown(e.touches[0].clientX), { passive: true });
    viewport.addEventListener('touchmove', e => pointerMove(e.touches[0].clientX), { passive: true });
    viewport.addEventListener('touchend', e => pointerUp(e.changedTouches[0].clientX));

    window.addEventListener('resize', render);
  }

  initCarousel({
    trackId: 'carouselTrack', dotsId: 'carouselDots',
    viewport: document.querySelector('.carousel-viewport'), wrap: document.querySelector('.carousel-wrap'),
    prevBtn: document.getElementById('carPrev'), nextBtn: document.getElementById('carNext'),
    autoplayMs: 4500, flipIcons: true,
  });

  initCarousel({
    trackId: 'heroCarTrack', dotsId: 'heroCarDots',
    viewport: document.querySelector('.hero-carousel-viewport'), wrap: document.querySelector('.hero-banner-stage'),
    autoplayMs: 6000, flipIcons: false,
  });
