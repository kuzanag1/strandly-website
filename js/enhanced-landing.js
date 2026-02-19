/**
 * ENHANCED LANDING PAGE UX - COMPREHENSIVE INTERACTIVE FEATURES
 * Includes animations, accessibility, performance optimizations, and user engagement
 */

class EnhancedLandingUX {
    constructor() {
        this.isLoaded = false;
        this.scrollPosition = 0;
        this.testimonialIndex = 0;
        this.testimonialCount = 3;
        this.intersectionObserver = null;
        this.performanceMetrics = {
            pageLoadTime: 0,
            timeToInteractive: 0,
            userEngagement: {
                scrollDepth: 0,
                timeOnPage: 0,
                ctaClicks: 0,
                sectionViews: {}
            }
        };
        
        this.init();
    }

    /**
     * Initialize all enhanced UX features
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeFeatures());
        } else {
            this.initializeFeatures();
        }
    }

    /**
     * Initialize all UX features after DOM is ready
     */
    initializeFeatures() {
        console.log('🚀 Initializing Enhanced Landing UX...');
        
        // Performance tracking
        this.trackPerformanceMetrics();
        
        // Core functionality
        this.setupLoadingScreen();
        this.setupScrollEffects();
        this.setupNavigationEnhancements();
        this.setupAnimationObserver();
        this.setupTestimonialCarousel();
        this.setupInteractiveElements();
        this.setupAccessibilityFeatures();
        this.setupFormEnhancements();
        this.setupPreviewModal();
        this.setupBackToTop();
        this.setupFAQAccordion();
        this.setupUserEngagementTracking();
        this.setupMobileOptimizations();
        
        // Mark as loaded
        this.isLoaded = true;
        console.log('✅ Enhanced Landing UX initialized successfully');
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('enhancedUXReady', {
            detail: { timestamp: Date.now() }
        }));
    }

    /**
     * Performance metrics tracking
     */
    trackPerformanceMetrics() {
        // Page load time
        window.addEventListener('load', () => {
            this.performanceMetrics.pageLoadTime = performance.now();
            console.log(`📊 Page load time: ${this.performanceMetrics.pageLoadTime.toFixed(2)}ms`);
        });

        // Time to interactive (simplified)
        setTimeout(() => {
            this.performanceMetrics.timeToInteractive = performance.now();
            console.log(`⚡ Time to interactive: ${this.performanceMetrics.timeToInteractive.toFixed(2)}ms`);
        }, 100);

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.performanceMetrics.userEngagement.timeOnPage += Date.now() - this.pageStartTime;
            } else {
                this.pageStartTime = Date.now();
            }
        });

        this.pageStartTime = Date.now();
    }

    /**
     * Enhanced loading screen with animations
     */
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        // Simulate loading process with progress
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                // Hide loading screen with smooth transition
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    
                    // Remove from DOM after transition
                    setTimeout(() => {
                        loadingScreen.remove();
                        this.triggerInitialAnimations();
                    }, 800);
                }, 500);
            }
        }, 100);
    }

    /**
     * Trigger initial page animations
     */
    triggerInitialAnimations() {
        // Animate hero elements with stagger
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Animate counters
        this.animateCounters();
    }

    /**
     * Setup enhanced scroll effects
     */
    setupScrollEffects() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial call
        this.updateScrollEffects();
    }

    /**
     * Update scroll-based effects
     */
    updateScrollEffects() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        // Update scroll position for other functions
        this.scrollPosition = scrollY;

        // Navbar scroll effects
        const navbar = document.querySelector('.enhanced-navbar');
        if (navbar) {
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            const parallaxSpeed = 0.5;
            heroBackground.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        }

        // Update scroll depth for analytics
        const scrollDepth = Math.min((scrollY + windowHeight) / docHeight * 100, 100);
        this.performanceMetrics.userEngagement.scrollDepth = Math.max(
            this.performanceMetrics.userEngagement.scrollDepth,
            scrollDepth
        );

        // Show/hide back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    /**
     * Setup navigation enhancements
     */
    setupNavigationEnhancements() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', () => {
                const isActive = mobileMenuBtn.classList.contains('active');
                
                if (isActive) {
                    mobileMenuBtn.classList.remove('active');
                    mobileNav.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                } else {
                    mobileMenuBtn.classList.add('active');
                    mobileNav.classList.add('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    const navHeight = document.querySelector('.enhanced-navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mobileNav && mobileNav.classList.contains('active')) {
                        mobileMenuBtn.classList.remove('active');
                        mobileNav.classList.remove('active');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });

        // Active section highlighting
        this.setupActiveNavigation();
    }

    /**
     * Setup active navigation highlighting
     */
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0% -70% 0%',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    // Remove active class from all nav links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }

                    // Track section view
                    if (!this.performanceMetrics.userEngagement.sectionViews[sectionId]) {
                        this.performanceMetrics.userEngagement.sectionViews[sectionId] = 0;
                    }
                    this.performanceMetrics.userEngagement.sectionViews[sectionId]++;
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    /**
     * Setup intersection observer for animations
     */
    setupAnimationObserver() {
        const animatedElements = document.querySelectorAll(
            '.value-card, .step, .testimonial, .factor-item, .faq-item'
        );

        if (animatedElements.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    // Add staggered animation delay
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                    
                    // Unobserve after animation
                    this.intersectionObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }

    /**
     * Setup testimonial carousel
     */
    setupTestimonialCarousel() {
        const track = document.querySelector('.testimonial-track');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const indicators = document.querySelectorAll('.indicator');

        if (!track) return;

        let currentIndex = 0;
        const testimonials = document.querySelectorAll('.testimonial.enhanced');
        this.testimonialCount = testimonials.length;

        const updateCarousel = (index) => {
            const translateX = -index * 100;
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            currentIndex = index;
        };

        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = currentIndex > 0 ? currentIndex - 1 : this.testimonialCount - 1;
                updateCarousel(newIndex);
            });
        }

        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = currentIndex < this.testimonialCount - 1 ? currentIndex + 1 : 0;
                updateCarousel(newIndex);
            });
        }

        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                updateCarousel(index);
            });
        });

        // Auto-play carousel
        setInterval(() => {
            if (!document.hidden) {
                const nextIndex = currentIndex < this.testimonialCount - 1 ? currentIndex + 1 : 0;
                updateCarousel(nextIndex);
            }
        }, 5000);

        // Touch/swipe support for mobile
        this.setupCarouselSwipe(track, updateCarousel);
    }

    /**
     * Setup carousel swipe functionality
     */
    setupCarouselSwipe(track, updateCallback) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const handleStart = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            track.style.transition = 'none';
        };

        const handleMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX) - startX;
            const currentTransform = -this.testimonialIndex * 100;
            track.style.transform = `translateX(${currentTransform + (currentX / track.offsetWidth) * 100}%)`;
        };

        const handleEnd = () => {
            if (!isDragging) return;
            
            isDragging = false;
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            const threshold = 50;
            let newIndex = this.testimonialIndex;
            
            if (Math.abs(currentX) > threshold) {
                if (currentX > 0 && this.testimonialIndex > 0) {
                    newIndex = this.testimonialIndex - 1;
                } else if (currentX < 0 && this.testimonialIndex < this.testimonialCount - 1) {
                    newIndex = this.testimonialIndex + 1;
                }
            }
            
            updateCallback(newIndex);
            currentX = 0;
        };

        // Mouse events
        track.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);

        // Touch events
        track.addEventListener('touchstart', handleStart, { passive: false });
        track.addEventListener('touchmove', handleMove, { passive: false });
        track.addEventListener('touchend', handleEnd);
    }

    /**
     * Setup interactive elements
     */
    setupInteractiveElements() {
        // Hair showcase interactions
        const hairSamples = document.querySelectorAll('.hair-sample');
        hairSamples.forEach(sample => {
            sample.addEventListener('mouseenter', () => {
                const type = sample.dataset.type;
                if (type) {
                    this.showTooltip(sample, `Click to learn more about ${type}`);
                }
            });

            sample.addEventListener('click', () => {
                const type = sample.dataset.type;
                this.showHairTypeInfo(type);
            });
        });

        // Value card interactions
        const valueCards = document.querySelectorAll('.value-card.enhanced');
        valueCards.forEach(card => {
            card.addEventListener('click', () => {
                this.expandValueCard(card);
            });
        });

        // Science factor interactions
        const factorItems = document.querySelectorAll('.factor-item');
        factorItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showFactorDetails(item);
            });
        });

        // Interactive diagram
        const strandLayers = document.querySelectorAll('.strand-layer');
        strandLayers.forEach(layer => {
            layer.addEventListener('click', () => {
                this.highlightStrandLayer(layer);
            });
        });

        // CTA button enhancements
        this.setupCTAButtons();
    }

    /**
     * Setup CTA button tracking and effects
     */
    setupCTAButtons() {
        const ctaButtons = document.querySelectorAll('.cta-button, .mini-cta, .step-cta, .diagram-cta');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Track CTA clicks
                this.performanceMetrics.userEngagement.ctaClicks++;
                
                // Add ripple effect
                this.addRippleEffect(button, e);
                
                // Analytics tracking
                const buttonText = button.textContent.trim();
                const buttonLocation = this.getElementSection(button);
                console.log(`🎯 CTA clicked: "${buttonText}" in ${buttonLocation}`);
                
                // Custom event for tracking
                document.dispatchEvent(new CustomEvent('ctaClick', {
                    detail: {
                        text: buttonText,
                        location: buttonLocation,
                        timestamp: Date.now()
                    }
                }));
            });
        });
    }

    /**
     * Add ripple effect to buttons
     */
    addRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Setup accessibility features
     */
    setupAccessibilityFeatures() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Focus management for modal
        this.setupModalFocusManagement();

        // Screen reader announcements
        this.setupScreenReaderAnnouncements();

        // Reduced motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }

        // High contrast mode
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
    }

    /**
     * Setup modal focus management
     */
    setupModalFocusManagement() {
        const modal = document.getElementById('preview-modal');
        if (!modal) return;

        let lastFocusedElement = null;

        const openModal = () => {
            lastFocusedElement = document.activeElement;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus first interactive element
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        };

        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            
            // Return focus to last focused element
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };

        // Trap focus within modal
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
            
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });

        // Store open/close functions for global access
        window.showPreview = openModal;
        window.closePreview = closeModal;
    }

    /**
     * Setup screen reader announcements
     */
    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);

        // Function to announce messages
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }

    /**
     * Setup form enhancements
     */
    setupFormEnhancements() {
        // Email validation for any email inputs
        const emailInputs = document.querySelectorAll('input[type="email"]');
        
        emailInputs.forEach(input => {
            const container = input.parentElement;
            const feedback = document.createElement('div');
            feedback.className = 'email-validation-feedback';
            container.appendChild(feedback);

            input.addEventListener('input', () => {
                this.validateEmail(input, feedback);
            });

            input.addEventListener('blur', () => {
                this.validateEmail(input, feedback, true);
            });
        });

        // Enhanced form interactions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    /**
     * Validate email input
     */
    validateEmail(input, feedback, showError = false) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            input.classList.remove('valid', 'invalid');
            feedback.textContent = '';
            feedback.className = 'email-validation-feedback';
            return true;
        }
        
        if (emailRegex.test(email)) {
            input.classList.add('valid');
            input.classList.remove('invalid');
            feedback.textContent = '✓';
            feedback.className = 'email-validation-feedback valid';
            return true;
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
            feedback.textContent = showError ? '✗' : '';
            feedback.className = 'email-validation-feedback invalid';
            return false;
        }
    }

    /**
     * Validate entire form
     */
    validateForm(form) {
        let isValid = true;
        const emailInputs = form.querySelectorAll('input[type="email"]');
        
        emailInputs.forEach(input => {
            const feedback = input.parentElement.querySelector('.email-validation-feedback');
            if (!this.validateEmail(input, feedback, true)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Setup preview modal
     */
    setupPreviewModal() {
        const modal = document.getElementById('preview-modal');
        const modalOverlay = document.querySelector('.modal-overlay');
        const closeBtn = document.querySelector('.modal-close');
        
        if (!modal) return;

        // Close modal on overlay click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                window.closePreview();
            });
        }

        // Close modal on close button click
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                window.closePreview();
            });
        }
    }

    /**
     * Setup back to top button
     */
    setupBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Announce to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Scrolled to top of page');
            }
        });
    }

    /**
     * Setup FAQ accordion
     */
    setupFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                const isExpanded = item.getAttribute('aria-expanded') === 'true';
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current item
                item.setAttribute('aria-expanded', !isExpanded);
                
                // Announce to screen readers
                const question = item.querySelector('h3').textContent;
                if (window.announceToScreenReader) {
                    window.announceToScreenReader(`${question} ${!isExpanded ? 'expanded' : 'collapsed'}`);
                }
            });

            // Keyboard support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }

    /**
     * Setup user engagement tracking
     */
    setupUserEngagementTracking() {
        // Time on page
        this.startTime = Date.now();
        
        // Scroll tracking
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            maxScroll = Math.max(maxScroll, scrollPercent);
            this.performanceMetrics.userEngagement.scrollDepth = maxScroll;
        });

        // Click tracking
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, [onclick]');
            if (target) {
                const elementText = target.textContent.trim();
                const elementTag = target.tagName.toLowerCase();
                console.log(`🖱️ User clicked: ${elementTag} - "${elementText}"`);
            }
        });

        // Exit intent tracking
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) {
                console.log('👋 Exit intent detected');
                // Could trigger exit intent popup here
            }
        });
    }

    /**
     * Setup mobile optimizations
     */
    setupMobileOptimizations() {
        // Touch-friendly interactions
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Improve touch targets
            const touchTargets = document.querySelectorAll('button, a, .clickable');
            touchTargets.forEach(target => {
                const rect = target.getBoundingClientRect();
                if (rect.width < 44 || rect.height < 44) {
                    target.style.minWidth = '44px';
                    target.style.minHeight = '44px';
                }
            });
        }

        // Viewport height fix for mobile
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);

        // Prevent zoom on input focus (iOS)
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });
    }

    /**
     * Animate counters
     */
    animateCounters() {
        const counters = document.querySelectorAll('.counter-number');
        
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const duration = 2000;
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = target * easeOut;
                
                if (target % 1 === 0) {
                    counter.textContent = Math.floor(current);
                } else {
                    counter.textContent = current.toFixed(1);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    /**
     * Show tooltip
     */
    showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = message;
        
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
        
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }, 3000);
    }

    /**
     * Show hair type information
     */
    showHairTypeInfo(hairType) {
        const infoMap = {
            'Straight Hair': 'Type 1: Straight hair lies flat against the scalp and tends to be naturally shiny but can appear oily quickly.',
            'Wavy Hair': 'Type 2: Wavy hair has a slight curl pattern and can be prone to frizz in humid conditions.',
            'Curly Hair': 'Type 3: Curly hair has well-defined spiral curls and tends to be drier than straight hair.',
            'Coily Hair': 'Type 4: Coily hair has tight curls or zigzag patterns and requires extra moisture and gentle handling.'
        };
        
        const info = infoMap[hairType];
        if (info && window.announceToScreenReader) {
            window.announceToScreenReader(info);
        }
        
        console.log(`ℹ️ Hair type info: ${hairType} - ${info}`);
    }

    /**
     * Get element section for analytics
     */
    getElementSection(element) {
        const section = element.closest('section');
        return section ? section.id || section.className : 'unknown';
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        
        console.log('🗑️ Enhanced Landing UX destroyed');
    }
}

// Initialize enhanced UX when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedLandingUX = new EnhancedLandingUX();
});

// Global functions for backward compatibility
window.startQuiz = () => {
    window.location.href = 'quiz.html';
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedLandingUX;
}