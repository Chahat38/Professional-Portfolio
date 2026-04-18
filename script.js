 

$(document).ready(function () {

  /* ============================================================
     1. PARTICLE CANVAS BACKGROUND
  ============================================================ */
  (function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', () => {
      resize();
      particles = createParticles();
    });

    function createParticles() {
      const count = Math.min(Math.floor((W * H) / 14000), 80);
      return Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
      }));
    }

    particles = createParticles();

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const particleColor = isDark ? '180, 180, 255' : '99, 102, 241';

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${particleColor}, ${0.06 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      });

      requestAnimationFrame(draw);
    }

    draw();
  })();


  /* ============================================================
     2. TYPED TEXT EFFECT
  ============================================================ */
  (function initTyped() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
       "Web Application Developer",
      "Full Stack Developer",
      "PHP & MySQL Developer",
      "Frontend Designer"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseEnd = false;

    function type() {
      const current = phrases[phraseIndex];

      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, 1800); // pause at end
          return;
        }
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400); // pause before next
          return;
        }
      }

      const speed = isDeleting ? 60 : 100;
      setTimeout(type, speed);
    }

    setTimeout(type, 800);
  })();


  /* ============================================================
     3. STICKY NAVBAR + ACTIVE NAV LINK
  ============================================================ */
  const $navbar = $('#navbar');
  const $navLinks = $('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  $(window).on('scroll.navbar', function () {
    const scrollY = $(this).scrollTop();

    // Sticky shrink effect
    if (scrollY > 60) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }

    // Active nav link on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    $navLinks.removeClass('active');
    $navLinks.filter(`[href="#${current}"]`).addClass('active');
  });

  // Smooth scroll on nav click
  $navLinks.on('click', function (e) {
    const target = $(this).attr('href');
    if (target.startsWith('#')) {
      e.preventDefault();
      const $target = $(target);
      if ($target.length) {
        $('html, body').animate({ scrollTop: $target.offset().top - 75 }, 600, 'swing');
      }
      // Close mobile menu
      $('#navbarNav').collapse('hide');
    }
  });


  /* ============================================================
     4. DARK / LIGHT MODE TOGGLE
  ============================================================ */
  const $html = $('html');
  const $themeBtn = $('#theme-toggle');

  // Persist theme preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  $html.attr('data-theme', savedTheme);

  $themeBtn.on('click', function () {
    const current = $html.attr('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    $html.attr('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });


  /* ============================================================
     5. SCROLL-TO-TOP BUTTON
  ============================================================ */
  const $scrollTop = $('#scroll-top');

  $(window).on('scroll.scrolltop', function () {
    if ($(this).scrollTop() > 500) {
      $scrollTop.addClass('visible');
    } else {
      $scrollTop.removeClass('visible');
    }
  });

  $scrollTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });


  /* ============================================================
     6. SCROLL REVEAL (AOS-like, pure JS/jQuery)
  ============================================================ */
  function revealElements() {
    const viewportBottom = window.scrollY + window.innerHeight;

    document.querySelectorAll('[data-aos]').forEach(el => {
      if (el.classList.contains('animated')) return;

      const elTop = el.getBoundingClientRect().top + window.scrollY;
      const delay = parseInt(el.getAttribute('data-aos-delay') || 0);

      if (viewportBottom > elTop + 60) {
        setTimeout(() => {
          el.classList.add('animated');
        }, delay);
      }
    });
  }

  // Initial check
  revealElements();

  $(window).on('scroll.reveal', function () {
    revealElements();
  });


  /* ============================================================
     7. SKILL BAR ANIMATION
  ============================================================ */
  let skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;

    const $skillsSection = $('#skills');
    if (!$skillsSection.length) return;

    const sectionTop = $skillsSection.offset().top;
    const scrollPos = $(window).scrollTop() + $(window).height();

    if (scrollPos > sectionTop + 100) {
      skillsAnimated = true;

      $('.skill-fill').each(function () {
        const width = $(this).data('width') + '%';
        $(this).animate({ width: width }, {
          duration: 1200,
          easing: 'swing',
          step: function () {
            $(this).addClass('animated');
          },
          complete: function () {
            $(this).addClass('animated');
          }
        });
      });
    }
  }

  $(window).on('scroll.skills', animateSkills);
  animateSkills(); // check on load


  /* ============================================================
     8. COUNTER ANIMATION (Hero Stats)
  ============================================================ */
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;

    const $heroSection = $('#home');
    if (!$heroSection.length) return;

    countersStarted = true;

    $('.stat-number').each(function () {
      const $el = $(this);
      const target = parseInt($el.data('target'));

      $({ count: 0 }).animate({ count: target }, {
        duration: 2000,
        easing: 'swing',
        step: function () {
          $el.text(Math.floor(this.count));
        },
        complete: function () {
          $el.text(target);
        }
      });
    });
  }

  // Start on load since hero is visible
  setTimeout(animateCounters, 500);


  /* ============================================================
     9. CONTACT FORM SUBMIT (Frontend Only)
  ============================================================ */
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();

    const $btn = $('#send-btn');
    const $success = $('#form-success');

    // Button loading state
    $btn.prop('disabled', true).find('span').text('Sending...');

    setTimeout(function () {
      // Reset button
      $btn.prop('disabled', false).find('span').text('Send Message');

      // Show success message
      $success.removeClass('d-none').hide().fadeIn(400);

      // Reset form
      $('#contact-form')[0].reset();

      // Hide success after 4s
      setTimeout(function () {
        $success.fadeOut(400, function () {
          $(this).addClass('d-none');
        });
      }, 4000);
    }, 1200);
  });


  /* ============================================================
     10. NAVBAR MOBILE MENU — Close on outside click
  ============================================================ */
  $(document).on('click', function (e) {
    const $menu = $('#navbarNav');
    if (
      $menu.hasClass('show') &&
      !$menu[0].contains(e.target) &&
      !$('.navbar-toggler')[0].contains(e.target)
    ) {
      $menu.collapse('hide');
    }
  });


  /* ============================================================
     11. PROJECT CARD TILT EFFECT (Subtle)
  ============================================================ */
  if (window.innerWidth > 768) {
    $(document).on('mousemove', '.project-card', function (e) {
      const card = this;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;

      $(card).css({
        'transform': `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        'transition': 'transform 0.1s ease'
      });
    });

    $(document).on('mouseleave', '.project-card', function () {
      $(this).css({
        'transform': '',
        'transition': 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      });
    });
  }


  /* ============================================================
     12. SMOOTH SECTION ENTRANCE — Hero on page load
  ============================================================ */
  // Staggered entrance for hero elements
  const heroElements = ['.hero-greeting', '.hero-name', '.hero-typed-wrapper', '.hero-bio', '.hero-cta', '.hero-social'];
  heroElements.forEach((sel, i) => {
    const $el = $(sel);
    if ($el.length) {
      $el.css({ opacity: 0, transform: 'translateY(24px)' });
      setTimeout(() => {
        $el.css({ transition: 'opacity 0.7s ease, transform 0.7s ease', opacity: 1, transform: 'translateY(0)' });
      }, 200 + i * 120);
    }
  });

  // Hero card entrance
  setTimeout(() => {
    $('.hero-card').css({ transition: 'opacity 0.8s ease, transform 0.8s ease', opacity: 1 });
  }, 900);


  /* ============================================================
     13. CURSOR GLOW EFFECT (Desktop only)
  ============================================================ */
  if (window.innerWidth > 768 && !('ontouchstart' in window)) {
    const $glow = $('<div class="cursor-glow"></div>').appendTo('body');

    $('<style>')
      .text(`
        .cursor-glow {
          position: fixed;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
        }
      `)
      .appendTo('head');

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    $(document).on('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      $glow.css({
        left: glowX + 'px',
        top: glowY + 'px',
      });
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

}); // End document.ready