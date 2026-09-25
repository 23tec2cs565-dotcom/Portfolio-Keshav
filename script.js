/* ============================================================
   KESHAV SAIN — PREMIUM PORTFOLIO v3 (Multi-Page + Warm Theme)
   JavaScript: Animations, character tracking, counters,
   scroll reveal, nav, particles, tilt, and more
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
    // 2. SMOOTH SCROLL FOR IN-PAGE LINKS + ACTIVE NAV
    // --------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link, .pill-nav-link');

    // Only intercept hash links (in-page anchors), not page links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only smooth-scroll for hash-only links like #about
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                // Close mobile menu if open
                const hamburger = document.getElementById('hamburger');
                const navPillBox = document.querySelector('.nav-pill-box');
                if (hamburger && hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    if (navPillBox) navPillBox.classList.remove('mobile-open');
                }
            }
            // For regular page links (about.html, etc.), let default navigation happen
        });
    });

    // --------------------------------------------------------
    // 3. SCROLL REVEAL WITH STAGGER
    // --------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
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
    // 4. NAVBAR SCROLL BEHAVIOR
    // --------------------------------------------------------
    const floatingNav = document.getElementById('floatingNav');

    if (floatingNav) {
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            if (scrollY > 100) {
                floatingNav.classList.add('scrolled');
            } else {
                floatingNav.classList.remove('scrolled');
            }

            lastScrollY = scrollY <= 0 ? 0 : scrollY;
        });
    }

    // --------------------------------------------------------
    // 5. MOBILE HAMBURGER MENU & OVERLAY
    // --------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn') || document.getElementById('hamburger');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const navPillBox = document.querySelector('.nav-pill-box');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            if (mobileNavOverlay) {
                mobileNavOverlay.classList.toggle('active');
            }
            if (navPillBox) {
                navPillBox.classList.toggle('mobile-open');
            }
            // Toggle hamburger icon if it's an <i>
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (mobileMenuBtn.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile overlay when clicking a link
        document.querySelectorAll('.mobile-nav-link, .pill-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
                if (navPillBox) navPillBox.classList.remove('mobile-open');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --------------------------------------------------------
    // 6. COUNTER ANIMATION (for stat-number, stats-bar-number, counter)
    // --------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number, .stats-bar-number, .counter');
    
    function animateCounters(elements) {
        elements.forEach((stat) => {
            if (stat.dataset.animated) return;
            stat.dataset.animated = 'true';
            
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

    // Observe any section containing counters
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number, .stats-bar-number');
                    if (counters.length > 0) {
                        animateCounters(counters);
                    }
                }
            });
        },
        { threshold: 0.3 }
    );

    // Observe all sections that might have counters
    document.querySelectorAll('section, .stats-bar, .highlights-section').forEach(section => {
        if (section.querySelector('.stat-number, .stats-bar-number')) {
            counterObserver.observe(section);
        }
    });

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
    // Also observe any parent of skill bars
    const skillBarsContainer = document.querySelector('.skill-bars');
    if (skillBarsContainer && !skillsSection) {
        skillBarObserver.observe(skillBarsContainer.closest('section') || skillBarsContainer);
    }

    // --------------------------------------------------------
    // 8. PARTICLE BACKGROUND (Warm theme version)
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
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                const colors = [
                    '232, 115, 74',    // coral
                    '244, 165, 116',   // peach
                    '200, 155, 60',    // gold
                    '212, 117, 109',   // dusty rose
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.3 + 0.05;
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
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
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
                        const opacity = (1 - dist / 140) * 0.08;
                        ctx.strokeStyle = `rgba(200, 155, 60, ${opacity})`;
                        ctx.lineWidth = 0.5;
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
    // 9. CURSOR GLOW (Desktop only — warm theme)
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

    // --------------------------------------------------------
    // 14. PROJECT FILTER TABS (Projects Page)
    // --------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = '';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        requestAnimationFrame(() => {
                            card.style.transition = 'all 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => { card.style.display = 'none'; }, 400);
                    }
                });
            });
        });
    }

    // --------------------------------------------------------
    // 15. 60 FPS ZERO-GHOSTING CURSOR-TRACKING CHARACTER ENGINE
    // Preloads 64 WebP frames + center.webp, shortest-path lerp,
    // deadzone eye contact, 100% opacity crisp rendering
    // --------------------------------------------------------
    const characterCanvas = document.getElementById('characterCanvas');
    if (characterCanvas) {
        const ctx = characterCanvas.getContext('2d', { alpha: false });
        const TOTAL_FRAMES = 128;
        const frames = [];
        let centerFrame = null;
        let loadedCount = 0;
        let isReady = false;

        // Smooth state variables
        let targetAngle = 0;
        let currentAngle = 0;
        let targetIsCenter = true;
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        const telemetryEl = document.getElementById('charAngleDisplay');
        const sectorEl = document.getElementById('charSectorDisplay');
        const loaderEl = document.getElementById('characterLoader');

        // Sector name helper for rich telemetry
        function getSectorName(deg) {
            if (deg >= 338 || deg < 22) return 'EAST (0°)';
            if (deg >= 22 && deg < 68) return 'SOUTHEAST (45°)';
            if (deg >= 68 && deg < 112) return 'SOUTH (90°)';
            if (deg >= 112 && deg < 158) return 'SOUTHWEST (135°)';
            if (deg >= 158 && deg < 202) return 'WEST (180°)';
            if (deg >= 202 && deg < 248) return 'NORTHWEST (225°)';
            if (deg >= 248 && deg < 292) return 'NORTH APEX (270°)';
            return 'NORTHEAST (315°)';
        }

        // Preload center neutral frame & paint immediately for ZERO buffering delay
        const imgCenter = new Image();
        imgCenter.src = 'public/frames/center.webp';
        imgCenter.onload = () => {
            centerFrame = imgCenter;
            loadedCount++;
            // Draw centerFrame immediately as initial state
            ctx.drawImage(centerFrame, 0, 0, 640, 360);
            characterCanvas.style.opacity = '1';
            checkPreloadStatus();
        };

        // Preload 128 circular trajectory frames (frame_000.webp to frame_127.webp)
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            const numStr = String(i).padStart(3, '0');
            img.src = `public/frames/frame_${numStr}.webp`;
            img.onload = () => {
                loadedCount++;
                checkPreloadStatus();
            };
            frames[i] = img;
        }

        function checkPreloadStatus() {
            if (loadedCount >= TOTAL_FRAMES + 1 && !isReady) {
                isReady = true;
                if (loaderEl) loaderEl.style.display = 'none';
                characterCanvas.style.opacity = '1';
                requestAnimationFrame(renderCharacterLoop);
            }
        }

        // Setup high-definition canvas internal coordinate system
        function setCanvasResolution() {
            characterCanvas.width = 640;
            characterCanvas.height = 360;
        }
        setCanvasResolution();

        // Mouse tracking
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            updateTargetCalculation();
        }, { passive: true });

        // Touch tracking (mobile / touchscreens)
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
                updateTargetCalculation();
            }
        }, { passive: true });

        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
                updateTargetCalculation();
            }
        }, { passive: true });

        function updateTargetCalculation() {
            const rect = characterCanvas.getBoundingClientRect();
            const faceX = rect.left + rect.width * 0.5;
            const faceY = rect.top + rect.height * 0.355;

            const dx = mouseX - faceX;
            const dy = mouseY - faceY;
            const dist = Math.hypot(dx, dy);

            const deadzoneRadius = Math.min(rect.width * 0.16, 75);

            if (dist < deadzoneRadius) {
                targetIsCenter = true;
            } else {
                targetIsCenter = false;
                targetAngle = Math.atan2(dy, dx);
            }
        }

        // Shortest-path circular angular lerp
        function lerpAngle(curr, target, factor) {
            let diff = (target - curr) % (Math.PI * 2);
            if (diff < -Math.PI) diff += Math.PI * 2;
            if (diff > Math.PI) diff -= Math.PI * 2;
            return curr + diff * factor;
        }

        // 60 FPS requestAnimationFrame render loop
        function renderCharacterLoop() {
            if (!isReady) return;

            currentAngle = lerpAngle(currentAngle, targetAngle, 0.26);

            const normalizedAngle = (currentAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round((normalizedAngle / (Math.PI * 2)) * TOTAL_FRAMES) % TOTAL_FRAMES));

            if (targetIsCenter && centerFrame && centerFrame.complete) {
                ctx.drawImage(centerFrame, 0, 0, 640, 360);
                if (telemetryEl) telemetryEl.textContent = 'EYE CONTACT • DIRECT';
                if (sectorEl) sectorEl.textContent = 'NEURAL GAZE • DEADZONE LOCK';
            } else if (frames[frameIdx] && frames[frameIdx].complete) {
                ctx.drawImage(frames[frameIdx], 0, 0, 640, 360);
                const deg = Math.round((normalizedAngle * 180) / Math.PI);
                const padIdx = String(frameIdx).padStart(3, '0');
                if (telemetryEl) {
                    telemetryEl.textContent = `TRACKING • ${deg}° [POSE #${padIdx}/128]`;
                }
                if (sectorEl) {
                    sectorEl.textContent = `${getSectorName(deg)} • 2.81°/F`;
                }
            }

            requestAnimationFrame(renderCharacterLoop);
        }
    }

    // --------------------------------------------------------
    // 16. WARM FLOATING BLOBS PARALLAX
    // --------------------------------------------------------
    const blobs = document.querySelectorAll('.deco-blob');
    if (blobs.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            blobs.forEach((blob, i) => {
                const speed = 0.02 + i * 0.01;
                blob.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }, { passive: true });
    }

    // --------------------------------------------------------
    // 17. HIGHLIGHT CARDS HOVER EFFECT
    // --------------------------------------------------------
    const highlightCards = document.querySelectorAll('.highlight-card');
    highlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    // --------------------------------------------------------
    // 18. ONE-CLICK CLIPBOARD COPY (Contact & Info)
    // --------------------------------------------------------
    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const toast = document.getElementById('toast');
                    if (toast) {
                        const span = toast.querySelector('span');
                        if (span) span.textContent = `Copied to clipboard: ${textToCopy}`;
                        toast.classList.add('show');
                        setTimeout(() => toast.classList.remove('show'), 3500);
                    }
                });
            }
        });
    });

    // --------------------------------------------------------
    // 19. LIVE JAIPUR (IST / UTC+5:30) TIMEZONE CLOCK
    // --------------------------------------------------------
    const localClockEl = document.getElementById('localTimeDisplay');
    if (localClockEl) {
        function updateLocalClock() {
            const now = new Date();
            // Format to IST
            const options = {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
            localClockEl.textContent = `${timeString} IST`;
        }
        updateLocalClock();
        setInterval(updateLocalClock, 1000);
    }

    // --------------------------------------------------------
    // 20. REAL-TIME SKILL SEARCH FILTER (Skills Page)
    // --------------------------------------------------------
    const skillSearchInput = document.getElementById('skillSearch');
    if (skillSearchInput) {
        const skillTags = document.querySelectorAll('.skill-tag');
        const skillCategories = document.querySelectorAll('.skill-category');

        skillSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (!query) {
                skillTags.forEach(t => {
                    t.style.opacity = '1';
                    t.style.background = '';
                    t.style.borderColor = '';
                });
                skillCategories.forEach(c => c.style.display = '');
                return;
            }

            skillCategories.forEach(category => {
                const tagsInCategory = category.querySelectorAll('.skill-tag');
                let hasMatch = false;

                tagsInCategory.forEach(tag => {
                    const txt = tag.textContent.toLowerCase();
                    if (txt.includes(query)) {
                        tag.style.opacity = '1';
                        tag.style.background = 'var(--accent-coral)';
                        tag.style.color = '#fff';
                        tag.style.borderColor = 'var(--accent-coral)';
                        hasMatch = true;
                    } else {
                        tag.style.opacity = '0.3';
                        tag.style.background = '';
                        tag.style.color = '';
                        tag.style.borderColor = '';
                    }
                });

                category.style.display = hasMatch ? '' : 'none';
            });
        });
    }

    // --------------------------------------------------------
    // 21. INTERACTIVE PROJECT DETAILS MODAL (Projects Page)
    // --------------------------------------------------------
    const projectModal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    if (projectModal) {
        const projectData = {
            '01': {
                title: 'LLM Customer Support Chatbot',
                badge: 'AI & LangChain',
                desc: 'Engineered an end-to-end conversational AI support bot leveraging LangChain, vector store embeddings, and strict prompt grounding to eliminate hallucinations.',
                metrics: 'Reduces manual response turnaround by 65% with 98% accuracy on customer FAQ resolution.',
                tech: ['LangChain', 'OpenAI API', 'RAG Architecture', 'FastAPI', 'ChromaDB', 'Python'],
                github: 'https://github.com/Keshavsain1'
            },
            '02': {
                title: 'Automated Leads Generation Engine',
                badge: 'Automation & Data',
                desc: 'Created an autonomous business prospect extraction pipeline that scrapes, normalizes, scores, and delivers verified leads directly into CRM systems.',
                metrics: 'Identified and delivered 2,500+ validated enterprise leads with over 90% deliverability rating.',
                tech: ['Python', 'RESTful APIs', 'SQL Modeling', 'Data Cleansing', 'Automation Workers'],
                github: 'https://github.com/Keshavsain1'
            },
            '03': {
                title: 'Graph Network Analysis Model',
                badge: 'ML & Topology',
                desc: 'Applied graph theory algorithms, community detection clusters, and centrality metrics to detect structural patterns across relational graph datasets.',
                metrics: 'Processes complex topological networks with 10k+ nodes, visualizing community partitions in real time.',
                tech: ['Python', 'NetworkX', 'Scikit-learn', 'Matplotlib', 'Graph Theory'],
                github: 'https://github.com/Keshavsain1'
            },
            '04': {
                title: 'OLA Ride Data Intelligence Dashboard',
                badge: 'Business Intelligence',
                desc: 'Designed a high-impact Power BI executive dashboard analyzing multi-year ride booking datasets to uncover booking surges, driver shortages, and cancellation triggers.',
                metrics: 'Surfaced 5 critical driver churn bottlenecks and delivered actionable operational recommendations.',
                tech: ['Power BI', 'DAX Calculations', 'SQL Analytics', 'Data Modeling', 'KPI Reporting'],
                github: 'https://github.com/Keshavsain1'
            },
            '05': {
                title: 'Health Insurance Cross-Sell Predictor',
                badge: 'Predictive Modeling',
                desc: 'Trained and validated machine learning classification models to determine consumer propensity for purchasing additional vehicle insurance policies.',
                metrics: 'Achieved ROC-AUC of 0.86 with balanced precision-recall curves for marketing targeting.',
                tech: ['Python', 'Scikit-learn', 'Pandas', 'Seaborn', 'Power BI'],
                github: 'https://github.com/Keshavsain1'
            },
            '06': {
                title: 'Enterprise Stock Management System',
                badge: 'Full-Stack Software',
                desc: 'Developed a robust inventory operations management system with atomic database transactions, SKU barcode lookups, and replenishment triggers.',
                metrics: 'Eliminates inventory discrepancies with zero ledger errors across 5,000+ items.',
                tech: ['Python', 'MySQL', 'CRUD Architecture', 'Relational DB Design'],
                github: 'https://github.com/Keshavsain1'
            }
        };

        document.querySelectorAll('.project-card[data-tilt]').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // If clicked directly on external link, let link navigate
                if (e.target.closest('a')) return;

                const numEl = card.querySelector('.project-number');
                if (!numEl) return;
                const id = numEl.textContent.trim();
                const data = projectData[id];
                if (!data) return;

                document.getElementById('modalTitle').textContent = data.title;
                document.getElementById('modalBadge').textContent = data.badge;
                document.getElementById('modalDesc').textContent = data.desc;
                document.getElementById('modalMetrics').textContent = data.metrics;
                document.getElementById('modalGithubLink').href = data.github;

                const techContainer = document.getElementById('modalTechTags');
                techContainer.innerHTML = '';
                data.tech.forEach(t => {
                    const span = document.createElement('span');
                    span.className = 'skill-tag';
                    span.textContent = t;
                    techContainer.appendChild(span);
                });

                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                projectModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                projectModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

});

// --------------------------------------------------------
// 18. PRELOADER
// --------------------------------------------------------
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 600);
        setTimeout(() => { preloader.style.display = 'none'; }, 1500);
    }
});
