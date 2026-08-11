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

  // ---- Hero banner depth tilt (mouse-fine only) ----
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroStage = document.getElementById('heroBannerStage');
    const heroImg = heroStage ? heroStage.querySelector('.hero-banner-img') : null;
    if (heroStage && heroImg) {
      heroStage.addEventListener('mousemove', e => {
        const r = heroStage.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        heroImg.style.transition = 'transform 60ms linear';
        heroImg.style.transform = `perspective(1000px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 4).toFixed(2)}deg)`;
      });
      heroStage.addEventListener('mouseleave', () => {
        heroImg.style.transition = 'transform 500ms var(--ease-out)';
        heroImg.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    }
  }

  // ---- NAV scroll state ----
  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // ---- Carousel ----
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carPrev');
  const nextBtn = document.getElementById('carNext');
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
    const activeIcon = slides[current].querySelector('.icon-circle');
    if (activeIcon && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      activeIcon.classList.remove('flip-in');
      void activeIcon.offsetWidth;
      activeIcon.classList.add('flip-in');
    }
  }
  function goTo(i) {
    current = (i + slides.length) % slides.length;
    render();
    restartAutoplay();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, 4500);
  }
  restartAutoplay();

  const wrap = document.querySelector('.carousel-wrap');
  wrap.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  wrap.addEventListener('mouseleave', restartAutoplay);

  // ---- Drag / swipe ----
  let isDown = false, startX = 0, startTranslate = 0, viewportWidth = 0;
  const viewport = document.querySelector('.carousel-viewport');

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
