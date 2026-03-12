/* ============================================
   カミタキCAMPUS — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initScrollAnimations();
  initParallax();
  initMobileMenu();
  initSmoothScroll();
});

/* --- Header Scroll Behavior --- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const hero = document.getElementById('hero');
  if (!header || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        header.classList.remove('is-scrolled');
      } else {
        header.classList.add('is-scrolled');
      }
    },
    { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
  );

  observer.observe(hero);
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.anim-target');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const parent = el.parentElement;
          const siblings = parent
            ? Array.from(parent.querySelectorAll(':scope > .anim-target'))
            : [el];
          const index = siblings.indexOf(el);
          const delay = index >= 0 ? index * 0.1 : 0;

          el.style.transitionDelay = `${delay}s`;
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((target) => observer.observe(target));
}

/* --- Parallax --- */
function initParallax() {
  const items = document.querySelectorAll('.parallax-img');
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const visibleSet = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSet.add(entry.target);
        } else {
          visibleSet.delete(entry.target);
        }
      });
    },
    { rootMargin: '100px 0px' }
  );

  items.forEach((img) => observer.observe(img));

  let ticking = false;

  function updateParallax() {
    const winH = window.innerHeight;

    visibleSet.forEach((img) => {
      const wrap = img.parentElement;
      const rect = wrap.getBoundingClientRect();
      // 0 = top of wrap at bottom of viewport, 1 = bottom of wrap at top of viewport
      const progress = (winH - rect.top) / (winH + rect.height);
      // Map to a small offset range: -20px to +20px
      const offset = (progress - 0.5) * 40;
      img.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });

  // Initial position
  requestAnimationFrame(updateParallax);
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('siteNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    btn.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
    });
  });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 72;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    });
  });
}
