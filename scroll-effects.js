// Advanced Scroll Effects and Animations - 2026

// Mobile detection for performance optimization
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

// Mobile header hide/show on scroll
if (isMobile) {
    let lastScrollTop = 0;
    let scrollTimeout;
    const header = document.querySelector('nav');
    const scrollThreshold = 10; // Minimum scroll distance to trigger
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // Don't hide header at the very top
            if (currentScroll <= 100) {
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
                lastScrollTop = currentScroll;
                return;
            }
            
            // Check scroll direction
            if (Math.abs(currentScroll - lastScrollTop) > scrollThreshold) {
                if (currentScroll > lastScrollTop) {
                    // Scrolling down - hide header
                    header.classList.add('header-hidden');
                    header.classList.remove('header-visible');
                } else {
                    // Scrolling up - show header
                    header.classList.remove('header-hidden');
                    header.classList.add('header-visible');
                }
                lastScrollTop = currentScroll;
            }
        }, 10);
    }, { passive: true });
}

// Parallax effect for hero video (desktop only for performance)
if (!isMobile) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroVideo = document.querySelector('.hero-video-container video');
                if (heroVideo && scrolled < window.innerHeight) {
                    heroVideo.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.5}px))`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Scroll Reveal Observer with Intersection Observer
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Unobserve after revealing for performance
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: isMobile ? 0.1 : 0.15,
    rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
});

// Observe all scroll-reveal elements
document.querySelectorAll('.scroll-reveal, .scroll-item').forEach(el => {
    revealObserver.observe(el);
});

// Parallax effect for service detail images (desktop only for performance)
if (!isMobile) {
    const imageParallax = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const handleScroll = () => {
                    const rect = entry.target.getBoundingClientRect();
                    const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    const translateY = (scrollPercent - 0.5) * 50;
                    entry.target.style.transform = `translateY(${translateY}px)`;
                };
                
                window.addEventListener('scroll', handleScroll, { passive: true });
                handleScroll();
            }
        });
    }, {
        threshold: 0
    });

    // Apply parallax to images
    document.querySelectorAll('.service-detail-image img, .area-card img').forEach(img => {
        img.classList.add('parallax-image');
        imageParallax.observe(img);
    });
}

// Smooth counter animation for stats
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
};

// Trigger counter animations when visible
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.stat-number').forEach(stat => {
    counterObserver.observe(stat);
});

// Add magnetic effect to buttons (desktop only for performance)
if (!isMobile) {
    document.querySelectorAll('.cta-button, .cta-button-secondary, .submit-button').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Smooth scroll progress indicator
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-cyan), var(--accent-cyan));
    z-index: 9999;
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.1s ease-out;
    box-shadow: 0 0 10px rgba(0, 174, 239, 0.5);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / scrollHeight);
    progressBar.style.transform = `scaleX(${progress})`;
    progressBar.style.width = '100%';
});
