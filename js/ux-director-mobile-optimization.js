/**
 * SENIOR UX DIRECTOR - MOBILE OPTIMIZATION ENGINE
 * PRIORITY: REVENUE CRITICAL - Mobile Conversion Enhancement
 * TARGET: Improve UX Rating from C+ (60/100) to B+ (80/100)
 */

class MobileUXOptimizer {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.emailCaptured = false;
        this.emailCaptureThreshold = 0.7; // 70% completion
        this.conversionData = {};
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }
    
    init() {
        this.detectMobileDevice();
        this.setupProgressiveValueBuilding();
        this.setupTouchOptimizations();
        this.setupAccessibilityFeatures();
        this.setupPerformanceMonitoring();
        this.setupErrorRecovery();
        this.initializeConversionTracking();
        this.setupKeyboardNavigation();
        
        // Start monitoring user engagement
        this.startEngagementTracking();
    }
    
    // ========================================
    // MOBILE DEVICE DETECTION & OPTIMIZATION
    // ========================================
    
    detectMobileDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 768;
        const isTouchDevice = 'ontouchstart' in window;
        
        document.body.classList.toggle('mobile-device', isMobile || isSmallScreen);
        document.body.classList.toggle('touch-device', isTouchDevice);
        
        // Add viewport size class
        if (window.innerWidth <= 400) {
            document.body.classList.add('ultra-mobile');
        } else if (window.innerWidth <= 480) {
            document.body.classList.add('small-mobile');
        }
        
        // Optimize for iOS Safari
        if (/Safari/.test(navigator.userAgent) && /iPhone|iPad/.test(navigator.userAgent)) {
            document.body.classList.add('ios-safari');
            this.optimizeForIOSSafari();
        }
        
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 100);
        });
    }
    
    optimizeForIOSSafari() {
        // Prevent zoom on input focus
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.style.fontSize = '16px';
            });
        });
        
        // Handle safe area insets
        const root = document.documentElement;
        root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom, 0px)');
    }
    
    handleOrientationChange() {
        // Recalculate touch zones for new orientation
        this.optimizeTouchZones();
        
        // Adjust modal positioning
        const modals = document.querySelectorAll('.modal, .email-overlay-mobile');
        modals.forEach(modal => {
            if (modal.style.display !== 'none') {
                this.centerModal(modal);
            }
        });
    }
    
    // ========================================
    // PROGRESSIVE VALUE BUILDING SYSTEM
    // ========================================
    
    setupProgressiveValueBuilding() {
        this.valuePoints = [
            { threshold: 0.1, message: "🎯 Getting to know your hair type...", value: "Personalized analysis starting" },
            { threshold: 0.3, message: "🔬 Analyzing your hair structure...", value: "Scientific assessment in progress" },
            { threshold: 0.5, message: "💫 Discovering your unique needs...", value: "Custom recommendations being prepared" },
            { threshold: 0.7, message: "🌟 Unlocking premium insights...", value: "Professional-grade analysis complete" },
            { threshold: 0.9, message: "🚀 Finalizing your hair roadmap...", value: "Your transformation plan is ready" }
        ];
        
        this.createValueStackDisplay();
    }
    
    createValueStackDisplay() {
        const valueContainer = document.createElement('div');
        valueContainer.className = 'value-stack-mobile';
        valueContainer.innerHTML = `
            <h3 style="text-align: center; color: #667eea; margin-bottom: 20px; font-size: 18px;">
                ✨ What You're Getting
            </h3>
            <div class="value-points-container"></div>
        `;
        
        // Insert after hero section or at top of quiz
        const hero = document.querySelector('.hero') || document.querySelector('.quiz-container');
        if (hero) {
            hero.after(valueContainer);
        }
        
        this.updateValueDisplay(0);
    }
    
    updateValueDisplay(progress) {
        const container = document.querySelector('.value-points-container');
        if (!container) return;
        
        const activePoints = this.valuePoints.filter(point => progress >= point.threshold);
        const nextPoint = this.valuePoints.find(point => progress < point.threshold);
        
        let html = '';
        
        // Show completed value points
        activePoints.forEach((point, index) => {
            html += `
                <div class="value-point-mobile completed" style="animation: slideInLeft 0.5s ease ${index * 0.1}s both;">
                    <div class="value-icon-mobile">✅</div>
                    <div class="value-text-mobile">${point.value}</div>
                </div>
            `;
        });
        
        // Show next value point (in progress)
        if (nextPoint) {
            html += `
                <div class="value-point-mobile in-progress">
                    <div class="value-icon-mobile">⏳</div>
                    <div class="value-text-mobile">${nextPoint.message}</div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    // ========================================
    // QUIZ PROGRESSION & EMAIL CAPTURE
    // ========================================
    
    updateQuizProgress(current, total) {
        this.currentQuestion = current;
        this.totalQuestions = total;
        const progress = current / total;
        
        // Update progress indicator
        this.updateProgressIndicator(progress);
        
        // Update value display
        this.updateValueDisplay(progress);
        
        // Check for email capture trigger
        if (progress >= this.emailCaptureThreshold && !this.emailCaptured) {
            this.triggerEmailCapture();
        }
        
        // Track conversion events
        this.trackProgressEvent(progress);
    }
    
    updateProgressIndicator(progress) {
        const progressFill = document.querySelector('.progress-fill, .progress-fill-enhanced');
        const progressCounter = document.querySelector('.progress-counter, #question-counter');
        const progressPercentage = document.querySelector('.progress-percentage');
        
        if (progressFill) {
            progressFill.style.width = `${progress * 100}%`;
        }
        
        if (progressCounter) {
            progressCounter.textContent = `Question ${this.currentQuestion} of ${this.totalQuestions}`;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(progress * 100)}% Complete`;
        }
        
        // Add celebratory animations at milestones
        if (progress === 0.25 || progress === 0.5 || progress === 0.75) {
            this.showMilestoneAnimation(progress);
        }
    }
    
    showMilestoneAnimation(progress) {
        const celebration = document.createElement('div');
        celebration.className = 'milestone-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">${progress === 0.25 ? '🌟' : progress === 0.5 ? '🚀' : '🎉'}</div>
                <div class="celebration-text">${Math.round(progress * 100)}% Complete!</div>
                <div class="celebration-subtext">You're doing great!</div>
            </div>
        `;
        
        celebration.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: celebrationFade 2s ease forwards;
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 2000);
    }
    
    // ========================================
    // STRATEGIC EMAIL CAPTURE (70% Rule)
    // ========================================
    
    triggerEmailCapture() {
        if (this.emailCaptured) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'email-overlay-mobile';
        overlay.innerHTML = `
            <div class="email-capture-modal">
                <div class="email-modal-title">You're Almost Done! 🎉</div>
                <div class="email-modal-subtitle">
                    Get your personalized hair analysis results sent directly to your inbox.
                    <strong>No spam, just your results!</strong>
                </div>
                <form class="email-capture-form-modal" onsubmit="return false;">
                    <input type="email" class="email-input-modal" placeholder="Enter your email address" required>
                    <button type="submit" class="email-submit-modal">
                        Unlock My Results ✨
                    </button>
                    <div class="email-skip-option" onclick="this.closest('.email-overlay-mobile').remove()">
                        Continue without email
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Setup form submission
        const form = overlay.querySelector('.email-capture-form-modal');
        const input = overlay.querySelector('.email-input-modal');
        const button = overlay.querySelector('.email-submit-modal');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.captureEmail(input.value, overlay);
        });
        
        // Focus on input
        setTimeout(() => input.focus(), 300);
        
        // Track email capture trigger
        this.trackEvent('email_capture_triggered', {
            progress: this.currentQuestion / this.totalQuestions,
            question_number: this.currentQuestion
        });
    }
    
    captureEmail(email, overlay) {
        if (!this.isValidEmail(email)) {
            this.showEmailError('Please enter a valid email address');
            return;
        }
        
        const button = overlay.querySelector('.email-submit-modal');
        const originalText = button.textContent;
        
        button.textContent = 'Capturing...';
        button.disabled = true;
        
        // Simulate API call (replace with actual implementation)
        setTimeout(() => {
            this.emailCaptured = true;
            localStorage.setItem('user_email', email);
            
            // Show success message
            overlay.innerHTML = `
                <div class="email-capture-modal">
                    <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                    <div class="email-modal-title">Perfect!</div>
                    <div class="email-modal-subtitle">
                        Your results will be sent to <strong>${email}</strong>
                    </div>
                    <button class="email-submit-modal" onclick="this.closest('.email-overlay-mobile').remove()">
                        Continue Quiz
                    </button>
                </div>
            `;
            
            // Track successful email capture
            this.trackEvent('email_captured', {
                email: email,
                progress: this.currentQuestion / this.totalQuestions
            });
            
            // Remove overlay after 2 seconds
            setTimeout(() => overlay.remove(), 2000);
            
        }, 1500);
    }
    
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    showEmailError(message) {
        const existing = document.querySelector('.email-error');
        if (existing) existing.remove();
        
        const error = document.createElement('div');
        error.className = 'email-error';
        error.style.cssText = `
            color: #dc3545;
            font-size: 14px;
            margin-top: 8px;
            text-align: center;
            animation: shake 0.5s ease;
        `;
        error.textContent = message;
        
        const modal = document.querySelector('.email-capture-modal');
        const button = modal.querySelector('.email-submit-modal');
        button.after(error);
        
        setTimeout(() => error.remove(), 3000);
    }
    
    // ========================================
    // TOUCH OPTIMIZATIONS & THUMB ZONES
    // ========================================
    
    setupTouchOptimizations() {
        this.optimizeTouchZones();
        this.setupSwipeNavigation();
        this.setupTouchFeedback();
        this.preventUnwantedZoom();
    }
    
    optimizeTouchZones() {
        // Ensure all interactive elements meet touch target size requirements
        const interactiveElements = document.querySelectorAll(`
            .cta-button, .quiz-option, .option-label, .nav-btn,
            .pay-button, .unlock-analysis-btn, input, select, textarea
        `);
        
        interactiveElements.forEach(element => {
            const computedStyle = getComputedStyle(element);
            const height = parseFloat(computedStyle.height);
            const width = parseFloat(computedStyle.width);
            
            // Minimum touch target: 44px x 44px (Apple HIG)
            if (height < 44) {
                element.style.minHeight = '44px';
                element.style.paddingTop = '8px';
                element.style.paddingBottom = '8px';
            }
            
            if (width < 44) {
                element.style.minWidth = '44px';
                element.style.paddingLeft = '8px';
                element.style.paddingRight = '8px';
            }
        });
    }
    
    setupSwipeNavigation() {
        const quizContainer = document.querySelector('.quiz-container, .quiz-main');
        if (!quizContainer) return;
        
        quizContainer.addEventListener('touchstart', (e) => {
            this.touchStartY = e.changedTouches[0].screenY;
        });
        
        quizContainer.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipeGesture();
        });
    }
    
    handleSwipeGesture() {
        const swipeThreshold = 50;
        const diff = this.touchStartY - this.touchEndY;
        
        if (Math.abs(diff) < swipeThreshold) return;
        
        if (diff > 0) {
            // Swipe up - could trigger "next" action
            this.handleSwipeUp();
        } else {
            // Swipe down - could trigger "previous" action
            this.handleSwipeDown();
        }
    }
    
    handleSwipeUp() {
        // Optional: auto-advance to next question if current is answered
        const selectedOption = document.querySelector('.quiz-option.selected, .option-label.selected');
        const nextButton = document.querySelector('.next-btn, .continue-btn');
        
        if (selectedOption && nextButton && !nextButton.disabled) {
            nextButton.click();
        }
    }
    
    handleSwipeDown() {
        // Optional: go back to previous question
        const prevButton = document.querySelector('.prev-btn, .back-btn');
        if (prevButton && !prevButton.disabled) {
            prevButton.click();
        }
    }
    
    setupTouchFeedback() {
        // Add haptic-like feedback for touch interactions
        const touchElements = document.querySelectorAll('.quiz-option, .option-label, .cta-button, .nav-btn');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
                element.style.transition = 'transform 0.1s ease';
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                    element.style.transition = '';
                }, 100);
            });
        });
    }
    
    preventUnwantedZoom() {
        // Prevent zoom on input focus for iOS
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.fontSize = '16px';
            });
        });
    }
    
    // ========================================
    // ACCESSIBILITY FEATURES
    // ========================================
    
    setupAccessibilityFeatures() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.setupReducedMotion();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowDown':
                case 'j':
                    this.navigateToNextOption();
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                case 'k':
                    this.navigateToPrevOption();
                    e.preventDefault();
                    break;
                case 'Enter':
                case ' ':
                    this.selectFocusedOption();
                    e.preventDefault();
                    break;
                case 'Escape':
                    this.closeModals();
                    break;
            }
        });
    }
    
    navigateToNextOption() {
        const options = Array.from(document.querySelectorAll('.quiz-option, .option-label'));
        const currentFocus = document.activeElement;
        const currentIndex = options.indexOf(currentFocus);
        
        if (currentIndex < options.length - 1) {
            options[currentIndex + 1].focus();
        } else if (options.length > 0) {
            options[0].focus();
        }
    }
    
    navigateToPrevOption() {
        const options = Array.from(document.querySelectorAll('.quiz-option, .option-label'));
        const currentFocus = document.activeElement;
        const currentIndex = options.indexOf(currentFocus);
        
        if (currentIndex > 0) {
            options[currentIndex - 1].focus();
        } else if (options.length > 0) {
            options[options.length - 1].focus();
        }
    }
    
    selectFocusedOption() {
        const focused = document.activeElement;
        if (focused.classList.contains('quiz-option') || focused.classList.contains('option-label')) {
            focused.click();
        }
    }
    
    closeModals() {
        const modals = document.querySelectorAll('.email-overlay-mobile, .modal');
        modals.forEach(modal => modal.remove());
    }
    
    setupScreenReaderSupport() {
        // Add ARIA attributes dynamically
        const quizOptions = document.querySelectorAll('.quiz-option, .option-label');
        quizOptions.forEach((option, index) => {
            option.setAttribute('role', 'radio');
            option.setAttribute('aria-describedby', `option-description-${index}`);
            option.setAttribute('tabindex', '0');
        });
        
        // Progress announcements
        const progressElement = document.querySelector('.progress-counter, #question-counter');
        if (progressElement) {
            progressElement.setAttribute('aria-live', 'polite');
            progressElement.setAttribute('aria-atomic', 'true');
        }
    }
    
    setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('focusin', (e) => {
            const modal = document.querySelector('.email-overlay-mobile');
            if (modal && !modal.contains(e.target)) {
                const firstFocusable = modal.querySelector('input, button');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }
        });
    }
    
    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
            
            // Remove or reduce animations
            const animatedElements = document.querySelectorAll('[style*="animation"]');
            animatedElements.forEach(element => {
                element.style.animationDuration = '0.01ms';
            });
        }
    }
    
    // ========================================
    // PERFORMANCE MONITORING
    // ========================================
    
    setupPerformanceMonitoring() {
        this.performanceMetrics = {
            startTime: performance.now(),
            interactions: [],
            errors: []
        };
        
        // Monitor Core Web Vitals
        this.measureLCP();
        this.measureFID();
        this.measureCLS();
        
        // Monitor custom metrics
        this.monitorPageLoad();
        this.monitorInteractionLatency();
    }
    
    measureLCP() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.performanceMetrics.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
    }
    
    measureFID() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.performanceMetrics.fid = entry.processingStart - entry.startTime;
            });
        }).observe({ entryTypes: ['first-input'] });
    }
    
    measureCLS() {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.performanceMetrics.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    monitorPageLoad() {
        window.addEventListener('load', () => {
            this.performanceMetrics.loadTime = performance.now() - this.performanceMetrics.startTime;
        });
    }
    
    monitorInteractionLatency() {
        ['click', 'touchstart', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                const startTime = performance.now();
                
                requestAnimationFrame(() => {
                    const endTime = performance.now();
                    this.performanceMetrics.interactions.push({
                        type: eventType,
                        element: e.target.tagName,
                        latency: endTime - startTime,
                        timestamp: startTime
                    });
                });
            });
        });
    }
    
    // ========================================
    // ERROR HANDLING & RECOVERY
    // ========================================
    
    setupErrorRecovery() {
        window.addEventListener('error', (e) => {
            this.handleError(e.error, 'JavaScript Error');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason, 'Promise Rejection');
        });
        
        // Network error detection
        window.addEventListener('online', () => this.handleNetworkRecovery());
        window.addEventListener('offline', () => this.handleNetworkError());
    }
    
    handleError(error, type) {
        console.error(`${type}:`, error);
        
        this.performanceMetrics.errors.push({
            type: type,
            message: error.message || error,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        // Show user-friendly error message
        this.showErrorRecoveryUI(type, error);
        
        // Track error for analytics
        this.trackEvent('error_occurred', {
            error_type: type,
            error_message: error.message || error.toString(),
            user_progress: this.currentQuestion / this.totalQuestions
        });
    }
    
    showErrorRecoveryUI(type, error) {
        const existingError = document.querySelector('.error-recovery-mobile');
        if (existingError) existingError.remove();
        
        const errorUI = document.createElement('div');
        errorUI.className = 'error-recovery-mobile';
        errorUI.innerHTML = `
            <div class="error-icon">⚠️</div>
            <div class="error-title">Oops! Something went wrong</div>
            <div class="error-message">
                Don't worry, your progress is saved. Let's get you back on track.
            </div>
            <button class="error-action" onclick="window.location.reload()">
                Refresh Page
            </button>
        `;
        
        // Insert at top of page
        document.body.insertBefore(errorUI, document.body.firstChild);
        
        // Auto-hide after 10 seconds
        setTimeout(() => errorUI.remove(), 10000);
    }
    
    handleNetworkError() {
        const networkError = document.createElement('div');
        networkError.className = 'network-error-banner';
        networkError.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #dc3545;
            color: white;
            padding: 12px;
            text-align: center;
            z-index: 10000;
            font-size: 14px;
        `;
        networkError.textContent = '📶 No internet connection. Your progress will be saved when connection is restored.';
        
        document.body.appendChild(networkError);
    }
    
    handleNetworkRecovery() {
        const networkError = document.querySelector('.network-error-banner');
        if (networkError) {
            networkError.style.background = '#28a745';
            networkError.textContent = '✅ Connection restored!';
            
            setTimeout(() => networkError.remove(), 2000);
        }
    }
    
    // ========================================
    // CONVERSION TRACKING & ANALYTICS
    // ========================================
    
    initializeConversionTracking() {
        this.conversionFunnel = {
            landing_view: false,
            quiz_started: false,
            email_captured: false,
            quiz_completed: false,
            payment_initiated: false,
            payment_completed: false
        };
        
        this.trackEvent('page_loaded', {
            user_agent: navigator.userAgent,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight
        });
    }
    
    startEngagementTracking() {
        let engagementStartTime = Date.now();
        let totalEngagementTime = 0;
        
        // Track time on page
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                totalEngagementTime += 1000;
            }
        }, 1000);
        
        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
            maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
        });
        
        // Save engagement data
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                total_engagement_time: totalEngagementTime,
                max_scroll_depth: maxScrollDepth,
                quiz_progress: this.currentQuestion / this.totalQuestions,
                email_captured: this.emailCaptured
            });
        });
    }
    
    trackProgressEvent(progress) {
        const milestones = [0.1, 0.25, 0.5, 0.7, 0.9];
        const currentMilestone = milestones.find(m => Math.abs(progress - m) < 0.01);
        
        if (currentMilestone) {
            this.trackEvent(`quiz_progress_${Math.round(currentMilestone * 100)}`, {
                progress: progress,
                question_number: this.currentQuestion,
                time_elapsed: Date.now() - this.performanceMetrics.startTime
            });
        }
    }
    
    trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            session_id: this.getSessionId(),
            user_id: this.getUserId(),
            page_url: window.location.href,
            ...data
        };
        
        // Send to analytics (replace with your analytics service)
        console.log('Analytics Event:', eventData);
        
        // Store in localStorage for offline scenarios
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push(eventData);
        localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100 events
    }
    
    getSessionId() {
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }
    
    getUserId() {
        let userId = localStorage.getItem('user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('user_id', userId);
        }
        return userId;
    }
    
    // ========================================
    // PUBLIC API METHODS
    // ========================================
    
    // Method to be called when quiz question changes
    onQuestionChange(current, total) {
        this.updateQuizProgress(current, total);
    }
    
    // Method to be called when option is selected
    onOptionSelected(questionId, optionValue) {
        this.trackEvent('option_selected', {
            question_id: questionId,
            option_value: optionValue,
            question_number: this.currentQuestion
        });
    }
    
    // Method to be called when quiz is completed
    onQuizCompleted(results) {
        this.conversionFunnel.quiz_completed = true;
        this.trackEvent('quiz_completed', {
            completion_time: Date.now() - this.performanceMetrics.startTime,
            email_captured: this.emailCaptured,
            total_questions: this.totalQuestions
        });
    }
    
    // Method to be called when payment is initiated
    onPaymentInitiated(amount, currency) {
        this.conversionFunnel.payment_initiated = true;
        this.trackEvent('payment_initiated', {
            amount: amount,
            currency: currency,
            email_captured: this.emailCaptured
        });
    }
    
    // Method to get current performance metrics
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            currentTime: performance.now(),
            conversionFunnel: this.conversionFunnel
        };
    }
}

// Initialize the Mobile UX Optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mobileUXOptimizer = new MobileUXOptimizer();
});

// Add required CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes celebrationFade {
    0% { opacity: 0; transform: scale(0.8); }
    20% { opacity: 1; transform: scale(1); }
    80% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.1); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.milestone-celebration .celebration-content {
    text-align: center;
    animation: celebrationBounce 0.6s ease;
}

.celebration-icon {
    font-size: 64px;
    margin-bottom: 16px;
}

.celebration-text {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 8px;
}

.celebration-subtext {
    font-size: 18px;
    opacity: 0.9;
}

@keyframes celebrationBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}
`;

document.head.appendChild(styleSheet);