/**
 * ENHANCED QUIZ UX - COMPREHENSIVE QUIZ EXPERIENCE IMPROVEMENTS
 * Features: Progress tracking, animations, validation, accessibility, mobile optimization
 */

class EnhancedQuizUX {
    constructor() {
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.totalQuestions = 10;
        this.isSubmitting = false;
        this.startTime = Date.now();
        this.questionStartTime = Date.now();
        this.timePerQuestion = {};
        this.validationErrors = {};
        
        // UX enhancements
        this.animationDuration = 600;
        this.progressUpdateDelay = 300;
        this.autoSaveInterval = null;
        this.keyboardNavigationEnabled = true;
        
        // Performance tracking
        this.metrics = {
            questionsAnswered: 0,
            backButtonUsed: 0,
            validationErrors: 0,
            timeToComplete: 0,
            averageTimePerQuestion: 0
        };
        
        // Enhanced quiz questions with better UX
        this.quizQuestions = [
            {
                id: 'hair-concern',
                text: "What's your biggest hair frustration right now?",
                subtitle: "Help us understand your primary concern so we can tailor our recommendations",
                type: 'single-choice',
                required: true,
                choices: [
                    {
                        text: 'My hair feels dry and lifeless',
                        icon: '💧',
                        description: 'Lacks moisture and shine'
                    },
                    {
                        text: 'It gets greasy way too quickly',
                        icon: '🫧',
                        description: 'Needs washing very frequently'
                    },
                    {
                        text: 'Damage from styling/treatments',
                        icon: '🔥',
                        description: 'Heat damage, chemical processing'
                    },
                    {
                        text: 'Thinning or lack of volume',
                        icon: '📉',
                        description: 'Hair appears flat or sparse'
                    },
                    {
                        text: 'Hard to style the way I want',
                        icon: '✨',
                        description: 'Styling challenges, frizz, unruly'
                    }
                ]
            },
            {
                id: 'hair-length',
                text: "How would you describe your current hair length?",
                subtitle: "Length affects product needs and styling techniques",
                type: 'single-choice',
                required: true,
                choices: [
                    {
                        text: 'Short & sassy (above shoulders)',
                        icon: '✂️',
                        description: 'Easy to maintain, quick styling'
                    },
                    {
                        text: 'Medium length (shoulder to chest)',
                        icon: '📏',
                        description: 'Versatile styling options'
                    },
                    {
                        text: 'Long & luscious (past chest)',
                        icon: '🌊',
                        description: 'Requires more intensive care'
                    }
                ]
            },
            {
                id: 'wash-frequency',
                text: "How often do you currently wash your hair?",
                subtitle: "This helps us understand your hair's oil production and current routine",
                type: 'single-choice',
                required: true,
                choices: [
                    {
                        text: 'Every day (I have to!)',
                        icon: '🚿',
                        description: 'Daily washing routine'
                    },
                    {
                        text: '2-3 times per week',
                        icon: '⭐',
                        description: 'Standard frequency'
                    },
                    {
                        text: 'Once a week',
                        icon: '📅',
                        description: 'Weekly washing'
                    },
                    {
                        text: 'Less than once a week',
                        icon: '🌿',
                        description: 'Infrequent washing'
                    }
                ]
            },
            {
                id: 'hair-texture',
                text: "What's your natural hair texture?",
                subtitle: "Before any chemical processing or heat styling",
                type: 'single-choice',
                required: true,
                choices: [
                    {
                        text: 'Pin-straight (sleek & smooth)',
                        icon: '➡️',
                        description: 'Type 1: No waves or curls'
                    },
                    {
                        text: 'Wavy (with some natural movement)',
                        icon: '🌊',
                        description: 'Type 2: Loose to moderate waves'
                    },
                    {
                        text: 'Curly (defined spirals)',
                        icon: '🌀',
                        description: 'Type 3: Well-defined curls'
                    },
                    {
                        text: 'Coily/kinky (tight curls)',
                        icon: '⚡',
                        description: 'Type 4: Very tight curl pattern'
                    }
                ]
            },
            {
                id: 'hair-thickness',
                text: "How does your hair feel when you touch it?",
                subtitle: "This is about individual strand thickness, not hair density",
                type: 'single-choice',
                required: true,
                choices: [
                    {
                        text: 'Fine (soft but can look flat)',
                        icon: '🪶',
                        description: 'Delicate, silky strands'
                    },
                    {
                        text: 'Medium (just right balance)',
                        icon: '⚖️',
                        description: 'Average strand thickness'
                    },
                    {
                        text: 'Thick (lots of volume & body)',
                        icon: '💪',
                        description: 'Strong, substantial strands'
                    }
                ]
            },
            {
                id: 'hair-porosity',
                text: "Quick strand test: Drop a clean hair in water - what happens?",
                subtitle: "This test reveals how your hair absorbs moisture (optional but helpful)",
                type: 'single-choice',
                required: false,
                choices: [
                    {
                        text: 'It floats on top',
                        icon: '🎈',
                        description: 'Low porosity - moisture resistant'
                    },
                    {
                        text: 'Slowly sinks to the bottom',
                        icon: '🐌',
                        description: 'Normal porosity - balanced'
                    },
                    {
                        text: 'Sinks quickly like a rock',
                        icon: '🪨',
                        description: 'High porosity - very absorbent'
                    },
                    {
                        text: 'I\'d rather skip this step',
                        icon: '⏭️',
                        description: 'We can determine this other ways'
                    }
                ]
            },
            {
                id: 'scalp-type',
                text: "How does your scalp usually feel?",
                subtitle: "Scalp health is crucial for healthy hair growth",
                type: 'single-choice',
                required: true,
                choices: [
                    {
                        text: 'Gets oily quickly',
                        icon: '🫧',
                        description: 'Produces excess sebum'
                    },
                    {
                        text: 'Pretty normal & balanced',
                        icon: '✅',
                        description: 'No major concerns'
                    },
                    {
                        text: 'Often feels dry or tight',
                        icon: '🌵',
                        description: 'Needs extra moisture'
                    },
                    {
                        text: 'Sensitive or easily irritated',
                        icon: '🌸',
                        description: 'Requires gentle products'
                    }
                ]
            },
            {
                id: 'chemical-treatments',
                text: "What treatments have you used on your hair?",
                subtitle: "Select all that apply - chemical processing affects hair needs",
                type: 'multiple-choice',
                required: true,
                choices: [
                    {
                        text: 'None - I keep it natural',
                        icon: '🌿',
                        description: 'No chemical processing'
                    },
                    {
                        text: 'Hair color/highlights',
                        icon: '✨',
                        description: 'Permanent or semi-permanent color'
                    },
                    {
                        text: 'Bleaching treatments',
                        icon: '💫',
                        description: 'Lightening processes'
                    },
                    {
                        text: 'Chemical relaxers/perms',
                        icon: '🌀',
                        description: 'Texture-altering treatments'
                    },
                    {
                        text: 'Heat styling regularly',
                        icon: '🔥',
                        description: 'Frequent use of hot tools'
                    }
                ]
            },
            {
                id: 'lifestyle-factors',
                text: "Which lifestyle factors affect your hair?",
                subtitle: "Environmental and lifestyle factors impact hair health",
                type: 'multiple-choice',
                required: false,
                choices: [
                    {
                        text: 'Frequent swimming',
                        icon: '🏊‍♀️',
                        description: 'Chlorine or salt water exposure'
                    },
                    {
                        text: 'High stress levels',
                        icon: '😤',
                        description: 'Can affect hair growth and health'
                    },
                    {
                        text: 'Hard water area',
                        icon: '🚿',
                        description: 'Mineral buildup concerns'
                    },
                    {
                        text: 'Diet changes recently',
                        icon: '🥗',
                        description: 'Nutritional impacts on hair'
                    },
                    {
                        text: 'Hormonal changes',
                        icon: '🌟',
                        description: 'Pregnancy, menopause, etc.'
                    },
                    {
                        text: 'None of these',
                        icon: '✅',
                        description: 'No significant lifestyle factors'
                    }
                ]
            },
            {
                id: 'email',
                text: "Enter your email to receive your personalized hair analysis",
                subtitle: "We'll send your detailed results and product recommendations here",
                type: 'email',
                required: true,
                placeholder: 'your.email@example.com',
                validation: {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                }
            }
        ];
        
        this.init();
    }

    /**
     * Initialize enhanced quiz
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeQuiz());
        } else {
            this.initializeQuiz();
        }
    }

    /**
     * Initialize quiz with enhanced UX
     */
    initializeQuiz() {
        console.log('🎯 Initializing Enhanced Quiz UX...');
        
        try {
            this.getDOMElements();
            this.setupEventListeners();
            this.setupKeyboardNavigation();
            this.setupProgressTracking();
            this.setupAutoSave();
            this.setupMobileOptimizations();
            this.setupAccessibility();
            
            // Load saved progress
            this.loadSavedProgress();
            
            // Display first question
            this.displayCurrentQuestion();
            
            // Setup validation
            this.setupValidation();
            
            console.log('✅ Enhanced Quiz UX initialized successfully');
            
            // Dispatch ready event
            document.dispatchEvent(new CustomEvent('enhancedQuizReady', {
                detail: { timestamp: Date.now() }
            }));
            
        } catch (error) {
            console.error('❌ Quiz initialization failed:', error);
            this.showError('Failed to initialize quiz. Please refresh the page.');
        }
    }

    /**
     * Get DOM elements with error checking
     */
    getDOMElements() {
        const elements = {
            questionText: document.getElementById('question-text'),
            questionOptions: document.getElementById('question-options'),
            prevButton: document.getElementById('prev-btn'),
            nextButton: document.getElementById('next-btn'),
            questionCounter: document.getElementById('question-counter'),
            progressFill: document.getElementById('progress-fill')
        };

        // Check for required elements
        const missingElements = [];
        Object.entries(elements).forEach(([key, element]) => {
            if (!element) {
                missingElements.push(key);
            } else {
                this[key + 'El'] = element;
            }
        });

        if (missingElements.length > 0) {
            throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
        }

        // Create enhanced progress container
        this.createEnhancedProgress();
        
        // Create question container for animations
        this.createQuestionContainer();
    }

    /**
     * Create enhanced progress indicators
     */
    createEnhancedProgress() {
        const progressContainer = document.querySelector('.progress-container');
        if (!progressContainer) return;

        // Enhanced progress header
        const progressHeader = document.createElement('div');
        progressHeader.className = 'enhanced-progress-container';
        progressHeader.innerHTML = `
            <div class="progress-header">
                <div class="progress-stats">
                    <div class="progress-stat">
                        <span class="progress-icon">📋</span>
                        <span>Question <span id="current-question">1</span> of ${this.totalQuestions}</span>
                    </div>
                    <div class="progress-stat">
                        <span class="progress-icon">⏱️</span>
                        <span class="time-remaining" id="time-remaining">Est. 2 min left</span>
                    </div>
                </div>
            </div>
            <div class="enhanced-progress-bar">
                <div class="progress-steps">
                    <div class="progress-line">
                        <div class="progress-line-fill" id="progress-line-fill"></div>
                    </div>
                    ${Array.from({length: this.totalQuestions}, (_, i) => 
                        `<div class="progress-step ${i === 0 ? 'active' : ''}" data-step="${i + 1}">
                            <span>${i + 1}</span>
                        </div>`
                    ).join('')}
                </div>
                <div class="progress-labels">
                    ${Array.from({length: this.totalQuestions}, (_, i) => 
                        `<div class="progress-label ${i === 0 ? 'active' : ''}" data-step="${i + 1}">
                            ${this.getStepLabel(i)}
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;

        progressContainer.parentNode.insertBefore(progressHeader, progressContainer);
        
        // Store references
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.progressLabels = document.querySelectorAll('.progress-label');
        this.progressLineFill = document.getElementById('progress-line-fill');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.timeRemainingSpan = document.getElementById('time-remaining');
    }

    /**
     * Create animated question container
     */
    createQuestionContainer() {
        const questionDisplay = document.getElementById('question-display');
        if (!questionDisplay) return;

        questionDisplay.classList.add('question-container');
        
        // Wrap content in slide container
        const slideContainer = document.createElement('div');
        slideContainer.className = 'question-slide';
        slideContainer.id = 'question-slide';
        
        // Move existing content
        while (questionDisplay.firstChild) {
            slideContainer.appendChild(questionDisplay.firstChild);
        }
        
        questionDisplay.appendChild(slideContainer);
        
        this.questionSlide = slideContainer;
    }

    /**
     * Get step label for progress
     */
    getStepLabel(index) {
        const labels = [
            'Concern', 'Length', 'Frequency', 'Texture', 'Thickness',
            'Porosity', 'Scalp', 'Treatments', 'Lifestyle', 'Contact'
        ];
        return labels[index] || `Step ${index + 1}`;
    }

    /**
     * Setup event listeners with enhanced functionality
     */
    setupEventListeners() {
        // Navigation buttons with debouncing
        this.prevButtonEl.addEventListener('click', 
            this.debounce((e) => {
                e.preventDefault();
                this.goToPreviousQuestion();
            }, 300)
        );

        this.nextButtonEl.addEventListener('click', 
            this.debounce((e) => {
                e.preventDefault();
                this.handleNextClick();
            }, 300)
        );

        // Window events
        window.addEventListener('beforeunload', (e) => {
            if (this.currentQuestionIndex > 0 && !this.isSubmitting) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? Your progress will be saved.';
                this.saveProgress();
            }
        });

        // Visibility change for auto-save
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveProgress();
            }
        });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.keyboardNavigationEnabled) return;

            switch (e.key) {
                case 'ArrowLeft':
                    if (this.currentQuestionIndex > 0) {
                        e.preventDefault();
                        this.goToPreviousQuestion();
                    }
                    break;
                    
                case 'ArrowRight':
                case 'Enter':
                    if (this.canProceedToNext()) {
                        e.preventDefault();
                        this.handleNextClick();
                    }
                    break;
                    
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    const optionIndex = parseInt(e.key) - 1;
                    const options = document.querySelectorAll('.enhanced-option-btn');
                    if (options[optionIndex] && !e.ctrlKey && !e.altKey) {
                        e.preventDefault();
                        options[optionIndex].click();
                    }
                    break;
                    
                case 'Escape':
                    // Could implement exit confirmation here
                    break;
            }
        });

        // Add keyboard navigation hints
        this.addKeyboardHints();
    }

    /**
     * Add keyboard navigation hints
     */
    addKeyboardHints() {
        const hintsContainer = document.createElement('div');
        hintsContainer.className = 'keyboard-hints';
        hintsContainer.innerHTML = `
            <div class="hints-toggle" id="hints-toggle" title="Show keyboard shortcuts">
                ⌨️
            </div>
            <div class="hints-panel" id="hints-panel">
                <h4>Keyboard Shortcuts</h4>
                <div class="hint-item">
                    <kbd>←</kbd> Previous question
                </div>
                <div class="hint-item">
                    <kbd>→</kbd> <kbd>Enter</kbd> Next question
                </div>
                <div class="hint-item">
                    <kbd>1-5</kbd> Select option
                </div>
            </div>
        `;
        
        document.body.appendChild(hintsContainer);
        
        const toggle = document.getElementById('hints-toggle');
        const panel = document.getElementById('hints-panel');
        
        toggle.addEventListener('click', () => {
            panel.classList.toggle('visible');
        });

        // Add CSS for hints
        const hintsCSS = `
            .keyboard-hints {
                position: fixed;
                top: 50%;
                right: 20px;
                z-index: 1000;
                transform: translateY(-50%);
            }
            
            .hints-toggle {
                width: 40px;
                height: 40px;
                background: var(--primary-gradient, #667eea);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
            }
            
            .hints-toggle:hover {
                transform: scale(1.1);
            }
            
            .hints-panel {
                position: absolute;
                right: 50px;
                top: 50%;
                transform: translateY(-50%);
                background: white;
                padding: 16px;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .hints-panel.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .hints-panel h4 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #495057;
            }
            
            .hint-item {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                font-size: 13px;
                color: #6c757d;
            }
            
            .hint-item kbd {
                background: #f8f9fa;
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px solid #dee2e6;
                font-size: 12px;
                font-family: monospace;
            }
            
            @media (max-width: 768px) {
                .keyboard-hints {
                    display: none;
                }
            }
        `;
        
        if (!document.getElementById('keyboard-hints-css')) {
            const style = document.createElement('style');
            style.id = 'keyboard-hints-css';
            style.textContent = hintsCSS;
            document.head.appendChild(style);
        }
    }

    /**
     * Setup progress tracking
     */
    setupProgressTracking() {
        this.updateProgress();
        
        // Estimate time remaining
        this.updateTimeEstimate();
        
        // Track question timing
        this.questionStartTime = Date.now();
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveProgress();
        }, 30000); // Save every 30 seconds
    }

    /**
     * Setup mobile optimizations
     */
    setupMobileOptimizations() {
        // Touch-friendly enhancements
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Prevent double-tap zoom on buttons
            const buttons = document.querySelectorAll('button, .enhanced-option-btn');
            buttons.forEach(button => {
                button.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    button.click();
                });
            });
            
            // Swipe navigation
            this.setupSwipeNavigation();
        }

        // Viewport height handling
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
    }

    /**
     * Setup swipe navigation
     */
    setupSwipeNavigation() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const minSwipeDistance = 50;
        const maxVerticalDistance = 100;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = Math.abs(endY - startY);
            
            // Only trigger swipe if vertical movement is minimal
            if (deltaY < maxVerticalDistance) {
                if (deltaX > minSwipeDistance) {
                    // Swipe right - previous question
                    if (this.currentQuestionIndex > 0) {
                        this.goToPreviousQuestion();
                    }
                } else if (deltaX < -minSwipeDistance) {
                    // Swipe left - next question
                    if (this.canProceedToNext()) {
                        this.handleNextClick();
                    }
                }
            }
        }, { passive: true });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'quiz-live-region';
        document.body.appendChild(liveRegion);

        this.liveRegion = liveRegion;

        // Focus management
        this.setupFocusManagement();

        // High contrast mode detection
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }

        // Reduced motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.animationDuration = 50;
            document.body.classList.add('reduced-motion');
        }
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Focus first interactive element when question changes
        this.focusQuestionContent = () => {
            const firstInteractive = this.questionSlide.querySelector(
                'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (firstInteractive) {
                setTimeout(() => firstInteractive.focus(), this.animationDuration + 100);
            }
        };
    }

    /**
     * Setup form validation
     */
    setupValidation() {
        this.validationRules = {
            'email': {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            }
        };
    }

    /**
     * Display current question with enhanced animations
     */
    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.completeQuiz();
            return;
        }

        const question = this.quizQuestions[this.currentQuestionIndex];
        this.announceToScreenReader(`Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}: ${question.text}`);
        
        // Update progress
        this.updateProgress();
        
        // Animate question change
        this.animateQuestionTransition(question);
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Track timing
        this.trackQuestionTiming();
    }

    /**
     * Animate question transition
     */
    animateQuestionTransition(question) {
        const isForward = true; // Determine direction if needed
        
        // Slide out current content
        this.questionSlide.classList.add(isForward ? 'slide-out-left' : 'slide-out-right');
        
        setTimeout(() => {
            // Update content
            this.updateQuestionContent(question);
            
            // Slide in new content
            this.questionSlide.classList.remove('slide-out-left', 'slide-out-right');
            this.questionSlide.classList.add(isForward ? 'slide-in-right' : 'slide-in-left');
            
            setTimeout(() => {
                this.questionSlide.classList.remove('slide-in-left', 'slide-in-right');
                this.focusQuestionContent();
            }, this.animationDuration);
            
        }, this.animationDuration / 2);
    }

    /**
     * Update question content
     */
    updateQuestionContent(question) {
        // Update question text
        this.questionTextEl.innerHTML = `
            <h2 class="enhanced-question-text">${question.text}</h2>
            ${question.subtitle ? `<p class="question-subtitle">${question.subtitle}</p>` : ''}
        `;

        // Update options
        this.questionOptionsEl.innerHTML = '';
        this.questionOptionsEl.className = 'enhanced-options';

        if (question.type === 'email') {
            this.createEmailInput(question);
        } else {
            this.createChoiceOptions(question);
        }
    }

    /**
     * Create email input with validation
     */
    createEmailInput(question) {
        const container = document.createElement('div');
        container.className = 'email-input-container';
        
        const input = document.createElement('input');
        input.type = 'email';
        input.className = 'enhanced-email-input';
        input.placeholder = question.placeholder || 'Enter your email address';
        input.value = this.userAnswers[question.id] || '';
        input.required = question.required;
        input.setAttribute('aria-describedby', 'email-help');
        
        const helpText = document.createElement('div');
        helpText.id = 'email-help';
        helpText.className = 'email-help-text';
        helpText.textContent = 'We\'ll send your personalized hair analysis to this email address';
        
        const feedback = document.createElement('div');
        feedback.className = 'email-validation-feedback';
        
        container.appendChild(input);
        container.appendChild(helpText);
        container.appendChild(feedback);
        this.questionOptionsEl.appendChild(container);
        
        // Setup real-time validation
        input.addEventListener('input', () => {
            this.validateEmailInput(input, feedback, question);
            this.userAnswers[question.id] = input.value;
            this.updateNavigationButtons();
            this.saveProgress();
        });
        
        input.addEventListener('blur', () => {
            this.validateEmailInput(input, feedback, question, true);
        });
        
        // Focus the input
        setTimeout(() => input.focus(), 100);
    }

    /**
     * Validate email input
     */
    validateEmailInput(input, feedback, question, showError = false) {
        const email = input.value.trim();
        const isValid = question.validation.pattern.test(email);
        
        if (email === '') {
            input.classList.remove('valid', 'invalid');
            feedback.textContent = '';
            feedback.className = 'email-validation-feedback';
            delete this.validationErrors[question.id];
        } else if (isValid) {
            input.classList.add('valid');
            input.classList.remove('invalid');
            feedback.textContent = '✓ Valid email address';
            feedback.className = 'email-validation-feedback valid';
            delete this.validationErrors[question.id];
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
            feedback.textContent = showError ? `✗ ${question.validation.message}` : '';
            feedback.className = 'email-validation-feedback invalid';
            this.validationErrors[question.id] = question.validation.message;
        }
        
        return isValid || email === '';
    }

    /**
     * Create choice options with enhanced styling
     */
    createChoiceOptions(question) {
        question.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'enhanced-option-btn';
            button.setAttribute('data-option', index);
            button.setAttribute('aria-describedby', `option-${index}-desc`);
            
            // Check if this option is selected
            const isSelected = this.isOptionSelected(question, index);
            if (isSelected) {
                button.classList.add('selected');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.setAttribute('aria-pressed', 'false');
            }
            
            button.innerHTML = `
                <div class="option-content">
                    <div class="option-header">
                        <span class="option-icon" aria-hidden="true">${choice.icon || ''}</span>
                        <span class="option-text">${choice.text}</span>
                    </div>
                    ${choice.description ? 
                        `<div class="option-description" id="option-${index}-desc">${choice.description}</div>` : 
                        ''
                    }
                </div>
            `;
            
            button.addEventListener('click', () => {
                this.selectOption(question, index, button);
            });
            
            // Add staggered animation
            button.style.animationDelay = `${index * 0.1}s`;
            
            this.questionOptionsEl.appendChild(button);
        });
    }

    /**
     * Check if option is selected
     */
    isOptionSelected(question, index) {
        const answer = this.userAnswers[question.id];
        if (question.type === 'multiple-choice') {
            return Array.isArray(answer) && answer.includes(index);
        } else {
            return answer === index;
        }
    }

    /**
     * Select option with enhanced feedback
     */
    selectOption(question, index, button) {
        const choice = question.choices[index];
        
        if (question.type === 'multiple-choice') {
            // Toggle selection for multiple choice
            if (!this.userAnswers[question.id]) {
                this.userAnswers[question.id] = [];
            }
            
            const currentAnswers = this.userAnswers[question.id];
            const optionIndex = currentAnswers.indexOf(index);
            
            if (optionIndex > -1) {
                // Deselect
                currentAnswers.splice(optionIndex, 1);
                button.classList.remove('selected');
                button.setAttribute('aria-pressed', 'false');
            } else {
                // Select
                currentAnswers.push(index);
                button.classList.add('selected');
                button.setAttribute('aria-pressed', 'true');
            }
        } else {
            // Single selection
            // Deselect all other options
            this.questionOptionsEl.querySelectorAll('.enhanced-option-btn').forEach(btn => {
                btn.classList.remove('selected');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // Select this option
            button.classList.add('selected');
            button.setAttribute('aria-pressed', 'true');
            this.userAnswers[question.id] = index;
        }
        
        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        // Screen reader announcement
        this.announceToScreenReader(`Selected: ${choice.text}`);
        
        // Update navigation and save
        this.updateNavigationButtons();
        this.saveProgress();
        
        // Auto-advance for single choice (optional)
        if (question.type === 'single-choice' && this.canProceedToNext()) {
            setTimeout(() => {
                if (this.currentQuestionIndex < this.totalQuestions - 1) {
                    this.handleNextClick();
                }
            }, 800);
        }
    }

    /**
     * Handle next button click
     */
    handleNextClick() {
        if (!this.canProceedToNext()) {
            this.showValidationError();
            return;
        }
        
        if (this.currentQuestionIndex === this.totalQuestions - 1) {
            this.completeQuiz();
        } else {
            this.goToNextQuestion();
        }
    }

    /**
     * Go to next question
     */
    goToNextQuestion() {
        this.trackQuestionTiming();
        this.currentQuestionIndex++;
        this.metrics.questionsAnswered++;
        
        this.displayCurrentQuestion();
        this.announceProgress();
    }

    /**
     * Go to previous question
     */
    goToPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.metrics.backButtonUsed++;
            this.displayCurrentQuestion();
            this.announceProgress();
        }
    }

    /**
     * Check if user can proceed to next question
     */
    canProceedToNext() {
        const question = this.quizQuestions[this.currentQuestionIndex];
        const answer = this.userAnswers[question.id];
        
        if (!question.required) {
            return true;
        }
        
        if (question.type === 'email') {
            return answer && answer.trim() && !this.validationErrors[question.id];
        } else if (question.type === 'multiple-choice') {
            return Array.isArray(answer) && answer.length > 0;
        } else {
            return answer !== undefined && answer !== null;
        }
    }

    /**
     * Show validation error
     */
    showValidationError() {
        const question = this.quizQuestions[this.currentQuestionIndex];
        
        this.metrics.validationErrors++;
        
        let message = 'Please select an option to continue.';
        if (question.type === 'email') {
            message = this.validationErrors[question.id] || 'Please enter a valid email address.';
        } else if (question.type === 'multiple-choice') {
            message = 'Please select at least one option.';
        }
        
        this.announceToScreenReader(`Error: ${message}`);
        
        // Visual feedback
        this.showErrorMessage(message);
        
        // Shake animation for options
        this.questionOptionsEl.classList.add('shake-error');
        setTimeout(() => {
            this.questionOptionsEl.classList.remove('shake-error');
        }, 600);
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        let errorContainer = document.getElementById('quiz-error-container');
        
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = 'quiz-error-container';
            errorContainer.className = 'quiz-error-container';
            this.questionSlide.appendChild(errorContainer);
        }
        
        errorContainer.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${message}</span>
            </div>
        `;
        
        errorContainer.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            errorContainer.classList.remove('show');
        }, 3000);
    }

    /**
     * Update progress indicators
     */
    updateProgress() {
        const progress = ((this.currentQuestionIndex) / this.totalQuestions) * 100;
        
        // Update progress bar
        if (this.progressFillEl) {
            this.progressFillEl.style.width = `${progress}%`;
        }
        
        // Update enhanced progress indicators
        if (this.progressLineFill) {
            this.progressLineFill.style.width = `${progress}%`;
        }
        
        if (this.currentQuestionSpan) {
            this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        }
        
        if (this.questionCounterEl) {
            this.questionCounterEl.textContent = `${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;
        }
        
        // Update step indicators
        if (this.progressSteps) {
            this.progressSteps.forEach((step, index) => {
                step.classList.remove('active', 'completed');
                
                if (index < this.currentQuestionIndex) {
                    step.classList.add('completed');
                } else if (index === this.currentQuestionIndex) {
                    step.classList.add('active');
                }
            });
        }
        
        if (this.progressLabels) {
            this.progressLabels.forEach((label, index) => {
                label.classList.toggle('active', index === this.currentQuestionIndex);
            });
        }
        
        // Update time estimate
        this.updateTimeEstimate();
    }

    /**
     * Update time estimate
     */
    updateTimeEstimate() {
        if (!this.timeRemainingSpan) return;
        
        const avgTimePerQuestion = 12; // seconds
        const questionsRemaining = this.totalQuestions - this.currentQuestionIndex;
        const estimatedSeconds = questionsRemaining * avgTimePerQuestion;
        
        if (estimatedSeconds > 60) {
            const minutes = Math.ceil(estimatedSeconds / 60);
            this.timeRemainingSpan.textContent = `Est. ${minutes} min left`;
        } else {
            this.timeRemainingSpan.textContent = `Est. ${estimatedSeconds}s left`;
        }
    }

    /**
     * Update navigation buttons
     */
    updateNavigationButtons() {
        // Previous button
        this.prevButtonEl.disabled = this.currentQuestionIndex === 0;
        this.prevButtonEl.style.opacity = this.currentQuestionIndex === 0 ? '0.5' : '1';
        
        // Next button
        const canProceed = this.canProceedToNext();
        this.nextButtonEl.disabled = !canProceed;
        
        if (this.currentQuestionIndex === this.totalQuestions - 1) {
            this.nextButtonEl.textContent = 'Complete Analysis';
            this.nextButtonEl.classList.add('cta-button');
        } else {
            this.nextButtonEl.textContent = 'Next';
            this.nextButtonEl.classList.remove('cta-button');
        }
    }

    /**
     * Track question timing
     */
    trackQuestionTiming() {
        const currentTime = Date.now();
        const timeSpent = currentTime - this.questionStartTime;
        this.timePerQuestion[this.currentQuestionIndex] = timeSpent;
        this.questionStartTime = currentTime;
    }

    /**
     * Announce progress to screen readers
     */
    announceProgress() {
        const message = `Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;
        this.announceToScreenReader(message);
    }

    /**
     * Announce to screen reader
     */
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            const progressData = {
                currentQuestionIndex: this.currentQuestionIndex,
                answers: this.userAnswers,
                timestamp: Date.now(),
                metrics: this.metrics,
                timePerQuestion: this.timePerQuestion
            };
            
            localStorage.setItem('strandlyQuizProgress', JSON.stringify(progressData));
        } catch (error) {
            console.warn('Could not save quiz progress:', error);
        }
    }

    /**
     * Load saved progress
     */
    loadSavedProgress() {
        try {
            const saved = localStorage.getItem('strandlyQuizProgress');
            if (saved) {
                const progressData = JSON.parse(saved);
                
                // Only restore if less than 24 hours old
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours
                if (Date.now() - progressData.timestamp < maxAge) {
                    this.currentQuestionIndex = progressData.currentQuestionIndex || 0;
                    this.userAnswers = progressData.answers || {};
                    this.metrics = { ...this.metrics, ...progressData.metrics };
                    this.timePerQuestion = progressData.timePerQuestion || {};
                    
                    console.log('📂 Restored quiz progress from', new Date(progressData.timestamp));
                }
            }
        } catch (error) {
            console.warn('Could not load saved progress:', error);
        }
    }

    /**
     * Complete quiz
     */
    async completeQuiz() {
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        this.trackQuestionTiming();
        
        // Calculate final metrics
        this.metrics.timeToComplete = Date.now() - this.startTime;
        const totalQuestionTime = Object.values(this.timePerQuestion).reduce((a, b) => a + b, 0);
        this.metrics.averageTimePerQuestion = totalQuestionTime / Object.keys(this.timePerQuestion).length;
        
        console.log('📊 Quiz Metrics:', this.metrics);
        
        // Show completion animation
        this.showCompletionAnimation();
        
        try {
            // Submit quiz data
            await this.submitQuizData();
            
            // Clear saved progress
            localStorage.removeItem('strandlyQuizProgress');
            
            // Redirect to payment page
            setTimeout(() => {
                window.location.href = 'payment.html';
            }, 2000);
            
        } catch (error) {
            console.error('Quiz submission failed:', error);
            this.showError('Submission failed. Please try again.');
            this.isSubmitting = false;
        }
    }

    /**
     * Show completion animation
     */
    showCompletionAnimation() {
        this.questionSlide.innerHTML = `
            <div class="completion-animation">
                <div class="success-icon">✅</div>
                <h2>Analysis Complete!</h2>
                <p>Preparing your personalized hair profile...</p>
                <div class="loading-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </div>
            </div>
        `;
        
        this.announceToScreenReader('Quiz completed successfully. Preparing your results.');
    }

    /**
     * Submit quiz data
     */
    async submitQuizData() {
        const submissionData = {
            answers: this.userAnswers,
            metrics: this.metrics,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            timePerQuestion: this.timePerQuestion
        };
        
        // Use existing API if available
        if (window.StrandlyApi) {
            return await window.StrandlyApi.submitQuiz(submissionData);
        }
        
        // Fallback API call
        const response = await fetch('/api/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
    }

    /**
     * Show error message
     */
    showError(message) {
        // Implementation for error display
        console.error(message);
        alert(message); // Temporary - should use proper modal
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // Remove keyboard hints
        const hints = document.querySelector('.keyboard-hints');
        if (hints) {
            hints.remove();
        }
        
        console.log('🗑️ Enhanced Quiz UX destroyed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedQuizUX = new EnhancedQuizUX();
});

// Backward compatibility
window.WorkingStrandlyQuiz = EnhancedQuizUX;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedQuizUX;
}