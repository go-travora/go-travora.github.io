/* =====================================================
   RETRO WORLD - AGENCIA DE VIAJES PREMIUM
   Script principal - script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==================== CONFIGURACIÓN GLOBAL ====================
    const body = document.body;
    const isMobile = window.innerWidth <= 768;

    // ==================== PRELOADER ====================
    const preloader = document.getElementById('preloader');
    
    const hidePreloader = () => {
        preloader.classList.add('oculto');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    };

    // Ocultar preloader después de cargar
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 1200);
    });

    // Fallback por si load ya ocurrió
    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 1200);
    }

    // ==================== CANVAS DE PARTÍCULAS ====================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = isMobile ? 35 : 70;
    const maxDistance = 150;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulsePhase += this.pulseSpeed;

            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }

        draw() {
            const currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.pulsePhase));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 165, 116, ${currentOpacity})`;
            ctx.fill();
            ctx.closePath();
        }
    }

    const initParticles = () => {
        resizeCanvas();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    const drawConnections = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 165, 116, ${opacity})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animateParticles);
    };

    // Iniciar partículas
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => {
        resizeCanvas();
        particles.forEach(p => p.reset());
    });

    // ==================== NAVEGACIÓN ====================
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Cambiar fondo del nav al hacer scroll
    const handleScroll = () => {
        const scrollY = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / scrollHeight) * 100;

        // Nav scrolled
        if (scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Progreso de scroll
        scrollProgress.style.width = `${progress}%`;

        // Botón volver arriba
        if (scrollY > 600) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Hamburger móvil
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });

    // Cerrar menú al hacer clic en un enlace (móvil)
    navLinkItems.forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMobile) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            // Cerrar si se hace clic en el fondo oscuro del menú móvil
            const target = e.target;
            if (target.classList.contains('nav-links')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Volver arriba
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==================== CARRUSEL HERO ====================
    const heroSlider = document.getElementById('hero-slider');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const heroPrev = document.getElementById('hero-prev');
    const heroNext = document.getElementById('hero-next');
    let currentSlide = 0;
    let heroAutoSlideInterval;

    const showSlide = (index) => {
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
        currentSlide = index;
    };

    const nextSlide = () => {
        showSlide((currentSlide + 1) % heroSlides.length);
        resetHeroAutoSlide();
    };

    const prevSlide = () => {
        showSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
        resetHeroAutoSlide();
    };

    const startHeroAutoSlide = () => {
        heroAutoSlideInterval = setInterval(nextSlide, 5000);
    };

    const resetHeroAutoSlide = () => {
        clearInterval(heroAutoSlideInterval);
        startHeroAutoSlide();
    };

    // Eventos
    heroNext.addEventListener('click', nextSlide);
    heroPrev.addEventListener('click', prevSlide);

    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetHeroAutoSlide();
        });
    });

    // Soporte táctil (swipe) para el hero
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 60) {
            if (swipeDistance < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, { passive: true });

    // Iniciar autoplay
    startHeroAutoSlide();

    // ==================== INICIALIZAR SWIPER (Carruseles) ====================
    const initSwiper = () => {
        // Destinos Swiper
        new Swiper('.destinos-swiper', {
            slidesPerView: 1,
            spaceBetween: 25,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: true,
            },
            pagination: {
                el: '.destinos-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.destinos-next',
                prevEl: '.destinos-prev',
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
        });

        // Experiencias Swiper
        new Swiper('.experiencias-swiper', {
            slidesPerView: 1,
            spaceBetween: 25,
            loop: true,
            autoplay: {
                delay: 4500,
                disableOnInteraction: true,
            },
            pagination: {
                el: '.experiencias-pagination',
                clickable: true,
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
        });

        // Testimonios Swiper
        new Swiper('.testimonios-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5500,
                disableOnInteraction: true,
            },
            pagination: {
                el: '.testimonios-pagination',
                clickable: true,
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
        });
    };

    if (typeof Swiper !== 'undefined') {
        initSwiper();
    } else {
        console.warn('Swiper no cargado');
    }

    // ==================== INICIALIZAR AOS ====================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            mirror: false,
        });
    } else {
        console.warn('AOS no cargado');
    }

    // ==================== CONTADORES ANIMADOS ====================
    const statNumbers = document.querySelectorAll('.stat-numero[data-counter]');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const currentValue = Math.floor(eased * target);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Observador para activar contadores cuando sean visibles
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(num => counterObserver.observe(num));
    } else {
        // Fallback: animar todos al cargar
        statNumbers.forEach(num => animateCounter(num));
    }

    // ==================== VALIDACIÓN DEL FORMULARIO ====================
    const contactoForm = document.getElementById('contacto-form');
    const formSuccess = document.getElementById('form-success');
    
    const campos = {
        nombre: {
            id: 'nombre',
            errorId: 'error-nombre',
            validator: (valor) => valor.trim().length >= 2,
            mensaje: 'El nombre debe tener al menos 2 caracteres.'
        },
        email: {
            id: 'email',
            errorId: 'error-email',
            validator: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()),
            mensaje: 'Ingresa un email válido.'
        },
        destino: {
            id: 'destino',
            errorId: 'error-destino',
            validator: (valor) => valor !== '',
            mensaje: 'Selecciona un destino.'
        },
        mensaje: {
            id: 'mensaje',
            errorId: 'error-mensaje',
            validator: (valor) => valor.trim().length >= 10,
            mensaje: 'El mensaje debe tener al menos 10 caracteres.'
        }
    };

    const validarCampo = (campo) => {
        const input = document.getElementById(campo.id);
        const errorElement = document.getElementById(campo.errorId);
        const esValido = campo.validator(input.value);
        
        if (!esValido) {
            input.style.borderColor = '#ff6b6b';
            errorElement.textContent = campo.mensaje;
            errorElement.style.display = 'block';
        } else {
            input.style.borderColor = 'rgba(212, 165, 116, 0.2)';
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        return esValido;
    };

    // Validar en tiempo real al salir del campo
    Object.values(campos).forEach(campo => {
        const input = document.getElementById(campo.id);
        input.addEventListener('blur', () => validarCampo(campo));
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                validarCampo(campo);
            }
        });
    });

    // Envío del formulario
    contactoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let todoValido = true;

        Object.values(campos).forEach(campo => {
            if (!validarCampo(campo)) {
                todoValido = false;
            }
        });

        if (todoValido) {
            // Simulación de envío exitoso
            const btnSubmit = contactoForm.querySelector('.btn-submit');
            const btnText = btnSubmit.querySelector('span');
            const btnIcon = btnSubmit.querySelector('i');
            
            btnSubmit.disabled = true;
            btnText.textContent = 'Enviando...';
            btnIcon.className = 'fas fa-spinner fa-spin';
            
            setTimeout(() => {
                contactoForm.reset();
                btnSubmit.disabled = false;
                btnText.textContent = 'Enviar Solicitud';
                btnIcon.className = 'fas fa-paper-plane';
                formSuccess.style.display = 'flex';
                
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }, 1500);
        }
    });

    // ==================== ANIMACIONES CON GSAP ====================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animación sutil de los títulos de sección
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out',
            });
        });

        // Animación de las tarjetas de destino
        gsap.utils.toArray('.destino-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                ease: 'back.out(1.4)',
                delay: 0.1,
            });
        });

        // Animación del badge de nosotros
        gsap.from('.nosotros-badge', {
            scrollTrigger: {
                trigger: '.nosotros-badge',
                start: 'top 90%',
            },
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
        });
    }

    // ==================== EFECTO HOVER EN TARJETAS (TILT) ====================
    const tiltElements = document.querySelectorAll('.destino-card, .experiencia-card, .testimonio-card');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * 5;
            const rotateY = (x - centerX) / centerX * 5;
            
            element.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });

    // ==================== LOG EN CONSOLA ====================
    console.log('%c Retro World - Agencia de Viajes Premium ', 
        'background: #d4a574; color: #2c1810; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
    console.log('%c Viaja con elegancia. Vive con pasión. ', 
        'color: #d4a574; font-size: 12px; font-style: italic;');
});
