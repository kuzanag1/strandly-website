/**
 * MOBILE UX INTEGRATION BRIDGE
 * Connects mobile optimization with existing quiz functionality
 */

(function() {
    'use strict';
    
    // Wait for both DOM and mobile optimizer to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeMobileBridge();
    });
    
    function initializeMobileBridge() {
        // Wait for mobile optimizer to be available
        const checkOptimizer = setInterval(() => {
            if (window.mobileUXOptimizer) {
                clearInterval(checkOptimizer);
                setupIntegration();
            }
        }, 100);
        
        // Timeout fallback
        setTimeout(() => {
            if (!window.mobileUXOptimizer) {
                console.warn('Mobile UX Optimizer not found after 5 seconds');
            }
            clearInterval(checkOptimizer);
        }, 5000);
    }
    
    function setupIntegration() {
        console.log('Mobile UX Integration Bridge: Initializing...');
        
        // Hook into existing quiz progression
        interceptQuizProgress();
        
        // Hook into email capture events
        interceptEmailEvents();
        
        // Hook into payment events
        interceptPaymentEvents();
        
        // Enhance existing quiz options with mobile-friendly features
        enhanceQuizOptions();
        
        // Setup quiz completion tracking
        setupCompletionTracking();
        
        console.log('Mobile UX Integration Bridge: Ready!');
    }
    
    function interceptQuizProgress() {
        // Look for existing quiz progress updates
        const progressElements = document.querySelectorAll('.progress-fill, .progress-fill-enhanced, #question-counter, .progress-counter');
        
        // Create a mutation observer to watch for progress changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    updateMobileProgress();
                }
            });
        });
        
        progressElements.forEach(element => {
            observer.observe(element, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        });
        
        // Also hook into potential existing progress functions
        if (typeof window.updateProgress === 'function') {
            const originalUpdateProgress = window.updateProgress;
            window.updateProgress = function(...args) {
                const result = originalUpdateProgress.apply(this, args);
                updateMobileProgress();
                return result;
            };
        }
        
        // Hook into quiz navigation functions
        if (typeof window.nextQuestion === 'function') {
            const originalNextQuestion = window.nextQuestion;
            window.nextQuestion = function(...args) {
                const result = originalNextQuestion.apply(this, args);
                updateMobileProgress();
                return result;
            };
        }
    }
    
    function updateMobileProgress() {
        // Extract current progress from DOM elements
        const questionCounter = document.querySelector('#question-counter, .progress-counter');
        const progressFill = document.querySelector('.progress-fill, .progress-fill-enhanced');
        
        let currentQuestion = 1;
        let totalQuestions = 10;
        
        // Try to extract from question counter text
        if (questionCounter && questionCounter.textContent) {
            const match = questionCounter.textContent.match(/(\\d+)[\\s\\w]*?(\\d+)/);
            if (match) {
                currentQuestion = parseInt(match[1], 10);
                totalQuestions = parseInt(match[2], 10);
            }
        }
        
        // Try to extract from progress fill width
        if (progressFill && progressFill.style.width) {
            const widthPercent = parseFloat(progressFill.style.width.replace('%', ''));
            if (widthPercent >= 0) {
                currentQuestion = Math.round((widthPercent / 100) * totalQuestions);
            }
        }
        
        // Update mobile optimizer
        if (window.mobileUXOptimizer && typeof window.mobileUXOptimizer.onQuestionChange === 'function') {
            window.mobileUXOptimizer.onQuestionChange(currentQuestion, totalQuestions);
        }
    }
    
    function interceptEmailEvents() {
        // Look for existing email forms
        const emailForms = document.querySelectorAll('form[id*=\"email\"], form[class*=\"email\"], .email-form, .email-capture-form');
        
        emailForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const emailInput = form.querySelector('input[type=\"email\"], input[name*=\"email\"], input[id*=\"email\"]');
                if (emailInput && emailInput.value && window.mobileUXOptimizer) {
                    // Mark as captured in mobile optimizer
                    window.mobileUXOptimizer.emailCaptured = true;
                    localStorage.setItem('user_email', emailInput.value);
                }
            });
        });
        
        // Hook into potential existing email capture functions
        if (typeof window.captureEmail === 'function') {
            const originalCaptureEmail = window.captureEmail;
            window.captureEmail = function(email, ...args) {
                if (window.mobileUXOptimizer) {
                    window.mobileUXOptimizer.emailCaptured = true;
                }
                return originalCaptureEmail.apply(this, [email, ...args]);
            };
        }
    }
    
    function interceptPaymentEvents() {
        // Look for payment buttons
        const paymentButtons = document.querySelectorAll('.pay-button, .unlock-analysis-btn, #pay-button, .payment-submit');
        
        paymentButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (window.mobileUXOptimizer && typeof window.mobileUXOptimizer.onPaymentInitiated === 'function') {
                    window.mobileUXOptimizer.onPaymentInitiated(29, 'USD');
                }
            });
        });
        
        // Hook into Stripe elements if present
        if (typeof Stripe !== 'undefined' && window.stripe) {
            // Look for existing payment handling
            const cardElement = document.querySelector('#card-element');
            if (cardElement) {
                cardElement.addEventListener('change', function(event) {
                    if (event.complete && window.mobileUXOptimizer) {
                        // Payment details completed
                        window.mobileUXOptimizer.trackEvent('payment_details_completed', {
                            timestamp: Date.now()
                        });
                    }
                });
            }
        }
    }
    
    function enhanceQuizOptions() {
        // Add mobile-friendly enhancements to quiz options
        const quizOptions = document.querySelectorAll('.quiz-option, .option-label, input[type=\"radio\"] + label');
        
        quizOptions.forEach((option, index) => {
            // Ensure proper touch targets
            if (!option.style.minHeight) {
                option.style.minHeight = '48px';
            }
            
            // Add selection tracking
            option.addEventListener('click', function() {
                const questionId = extractQuestionId(option);
                const optionValue = extractOptionValue(option);
                
                if (window.mobileUXOptimizer && typeof window.mobileUXOptimizer.onOptionSelected === 'function') {
                    window.mobileUXOptimizer.onOptionSelected(questionId, optionValue);
                }
            });
            
            // Add keyboard navigation support
            if (!option.hasAttribute('tabindex')) {
                option.setAttribute('tabindex', '0');
            }
            
            option.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
            });
        });
    }
    
    function extractQuestionId(element) {
        // Try to extract question ID from various sources
        const questionContainer = element.closest('[data-question]');
        if (questionContainer) {
            return questionContainer.getAttribute('data-question');
        }
        
        const questionNumber = document.querySelector('#question-counter, .progress-counter');
        if (questionNumber && questionNumber.textContent) {
            const match = questionNumber.textContent.match(/Question (\\d+)/);
            return match ? match[1] : 'unknown';
        }
        
        return 'unknown';
    }
    
    function extractOptionValue(element) {
        // Try to extract option value from various sources
        if (element.hasAttribute('data-value')) {
            return element.getAttribute('data-value');
        }
        
        const input = element.querySelector('input') || element;
        if (input.value) {
            return input.value;
        }
        
        return element.textContent.trim().substring(0, 50);
    }
    
    function setupCompletionTracking() {
        // Watch for quiz completion indicators
        const completionIndicators = [
            '.quiz-complete',
            '.results-screen',
            '.payment-screen',
            '#payment-screen',
            '.unlock-analysis'
        ];
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        completionIndicators.forEach(selector => {
                            if (node.matches && node.matches(selector)) {
                                handleQuizCompletion();
                            }
                            
                            const found = node.querySelector && node.querySelector(selector);
                            if (found) {
                                handleQuizCompletion();
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also check for URL changes that might indicate completion
        let currentPath = window.location.pathname;
        setInterval(() => {
            if (window.location.pathname !== currentPath) {
                currentPath = window.location.pathname;
                if (currentPath.includes('payment') || currentPath.includes('results')) {
                    handleQuizCompletion();
                }
            }
        }, 1000);
    }
    
    function handleQuizCompletion() {
        if (window.mobileUXOptimizer && typeof window.mobileUXOptimizer.onQuizCompleted === 'function') {
            const results = {
                completed_at: Date.now(),
                email_captured: window.mobileUXOptimizer.emailCaptured || false,
                completion_url: window.location.href
            };
            
            window.mobileUXOptimizer.onQuizCompleted(results);
        }
    }
    
    // Public API for manual integration
    window.mobileBridge = {
        updateProgress: updateMobileProgress,
        triggerCompletion: handleQuizCompletion,
        trackOptionSelection: function(questionId, optionValue) {
            if (window.mobileUXOptimizer && typeof window.mobileUXOptimizer.onOptionSelected === 'function') {
                window.mobileUXOptimizer.onOptionSelected(questionId, optionValue);
            }
        }
    };
    
})();