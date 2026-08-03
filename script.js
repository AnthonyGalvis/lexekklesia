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
