/* ============================================================
   KESHAV SAIN — PREMIUM PORTFOLIO v2
   JavaScript: Enhanced animations, cursor glow, skill bars,
   particles, tilt, counters, and more
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------
    // 1. TYPING ANIMATION
    // --------------------------------------------------------
    const typedText = document.getElementById('typedText');
    if (typedText) {
        const roles = [
            'AI Engineer',
            'Data Scientist',
            'Full-Stack Developer',
            'SEO Specialist',
            'ML Engineer',
            'Python Developer'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let speed = 100;

        function typeRole() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typedText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                speed = 40;
            } else {
                typedText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                speed = 90;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                speed = 2200;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 500;
            }

            setTimeout(typeRole, speed);
        }

        setTimeout(typeRole, 1500);
    }

    // --------------------------------------------------------
    // 2. SMOOTH SCROLL + ACTIVE NAV
    // --------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                const navContainer = document.getElementById('navLinks');
                const hamburger = document.getElementById('hamburger');
                if (navContainer && navContainer.classList.contains('active')) {
                    navContainer.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        { rootMargin: '-30% 0px -70% 0px' }
    );

    sections.forEach((s) => sectionObserver.observe(s));

    // --------------------------------------------------------
    // 3. SCROLL REVEAL WITH STAGGER
    // --------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger siblings
                    const parent = entry.target.parentElement;
                    if (parent) {
                        const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
                        const idx = siblings.indexOf(entry.target);
                        if (idx >= 0) {
                            entry.target.style.transitionDelay = `${idx * 0.1}s`;
                        }
                    }
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // --------------------------------------------------------
    // 4. NAVBAR BEHAVIOR
    // --------------------------------------------------------
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > lastScrollY && scrollY > 200) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        lastScrollY = scrollY <= 0 ? 0 : scrollY;
    });

    // --------------------------------------------------------
    // 5. MOBILE MENU
    // --------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    // --------------------------------------------------------
    // 6. COUNTER ANIMATION
    // --------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    animateCounters();
                }
            });
        },
        { threshold: 0.3 }
    );

    const aboutSection = document.getElementById('about');
    if (aboutSection) counterObserver.observe(aboutSection);

    function animateCounters() {
        statNumbers.forEach((stat) => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const isDecimal = stat.getAttribute('data-decimal') === 'true';
            const duration = 2200;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            const stepTime = duration / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
            }, stepTime);
        });
    }

    // --------------------------------------------------------
    // 7. SKILL BAR ANIMATION
    // --------------------------------------------------------
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    let skillBarsAnimated = false;

    const skillBarObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !skillBarsAnimated) {
                    skillBarsAnimated = true;
                    skillBars.forEach((bar, i) => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, i * 200);
                    });
                }
            });
        },
        { threshold: 0.3 }
    );

    const skillsSection = document.getElementById('skills');
    if (skillsSection) skillBarObserver.observe(skillsSection);

    // --------------------------------------------------------
    // 8. PARTICLE BACKGROUND
    // --------------------------------------------------------
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let isHeroVisible = true;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                const colors = [
                    '0, 212, 255',    // blue
                    '123, 47, 247',   // purple
                    '255, 45, 170',   // pink
                    '255, 215, 0',    // gold
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.4 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 100);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        const opacity = (1 - dist / 140) * 0.12;
                        ctx.strokeStyle = `rgba(123, 47, 247, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            if (!isHeroVisible) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => { p.update(); p.draw(); });
            connectParticles();
            animationId = requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        // Pause when hero not visible
        const heroEl = document.getElementById('hero');
        const particleObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        isHeroVisible = false;
                        cancelAnimationFrame(animationId);
                    } else {
                        isHeroVisible = true;
                        animateParticles();
                    }
                });
            },
            { threshold: 0 }
        );
        if (heroEl) particleObserver.observe(heroEl);
    }

    // --------------------------------------------------------
    // 9. CURSOR GLOW (Desktop only)
    // --------------------------------------------------------
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia('(min-width: 769px)').matches) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateCursorGlow() {
            // Smooth lerp
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(updateCursorGlow);
        }

        updateCursorGlow();
    }

    // --------------------------------------------------------
    // 10. PROJECT CARD TILT EFFECT
    // --------------------------------------------------------
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            card.style.transition = 'box-shadow 0.3s ease';

            // Move internal glow
            const glow = card.querySelector('.project-card-glow');
            if (glow) {
                glow.style.left = `${x - card.offsetWidth}px`;
                glow.style.top = `${y - card.offsetHeight}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });
    });

    // --------------------------------------------------------
    // 11. BACK TO TOP
    // --------------------------------------------------------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --------------------------------------------------------
    // 12. CONTACT FORM + TOAST
    // --------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name && email && message) {
                showToast();
                contactForm.reset();
            }
        });
    }

    function showToast() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4500);
        }
    }

    // --------------------------------------------------------
    // 13. MARQUEE PAUSE ON HOVER
    // --------------------------------------------------------
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const marqueeSection = marqueeContent.closest('.marquee-section');
        if (marqueeSection) {
            marqueeSection.addEventListener('mouseenter', () => {
                marqueeContent.style.animationPlayState = 'paused';
            });
            marqueeSection.addEventListener('mouseleave', () => {
                marqueeContent.style.animationPlayState = 'running';
            });
        }
    }
});

// --------------------------------------------------------
// 14. PRELOADER
// --------------------------------------------------------
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 600);
        setTimeout(() => { preloader.style.display = 'none'; }, 1500);
    }
});
