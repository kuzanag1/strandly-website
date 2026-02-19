/**
 * STRANDLY INTEGRATED HAIR QUIZ
 * Frontend-Backend Integration Implementation
 * February 17, 2026
 */

class IntegratedStrandlyQuiz {
    constructor() {
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.questions = [];
        this.totalQuestions = 0;
        this.apiService = new StrandlyApiService();
        this.isSubmitting = false;
        
        // DOM elements
        this.questionTextEl = null;
        this.questionOptionsEl = null;
        this.questionCounterEl = null;
        this.progressFillEl = null;
        this.prevButtonEl = null;
        this.nextButtonEl = null;
        this.loadingEl = null;
        this.errorEl = null;
        
        console.log('🎯 Initializing Integrated Strandly Quiz');
    }

    /**
     * Initialize the quiz
     */
    async initialize() {
        try {
            // Find DOM elements
            this.findDOMElements();
            
            if (!this.verifyDOMElements()) {
                throw new Error('Required DOM elements not found');
            }

            // Show loading state
            this.showLoading('Loading quiz questions...');

            // Load quiz questions from API
            await this.loadQuizQuestions();

            // Setup event listeners
            this.setupEventListeners();

            // Try to restore previous progress
            this.restoreProgress();

            // Display first question
            this.displayCurrentQuestion();

            this.hideLoading();
            console.log('✅ Integrated quiz successfully initialized');
            return true;

        } catch (error) {
            console.error('❌ Quiz initialization failed:', error);
            this.showError('Failed to load quiz. Please refresh the page to try again.');
            return false;
        }
    }

    /**
     * Find all required DOM elements
     */
    findDOMElements() {
        this.questionTextEl = document.getElementById('question-text');
        this.questionOptionsEl = document.getElementById('question-options');
        this.questionCounterEl = document.getElementById('question-counter');
        this.progressFillEl = document.getElementById('progress-fill');
        this.prevButtonEl = document.getElementById('prev-btn');
        this.nextButtonEl = document.getElementById('next-btn');
        this.loadingEl = document.getElementById('quiz-loading') || this.createLoadingElement();
        this.errorEl = document.getElementById('quiz-error') || this.createErrorElement();
    }

    /**
     * Verify all required DOM elements exist
     */
    verifyDOMElements() {
        const required = [
            'questionTextEl', 'questionOptionsEl', 'questionCounterEl',
            'progressFillEl', 'prevButtonEl', 'nextButtonEl'
        ];

        return required.every(el => {
            if (!this[el]) {
                console.error(`❌ Missing DOM element: ${el}`);
                return false;
            }
            return true;
        });
    }

    /**
     * Create loading element if it doesn't exist
     */
    createLoadingElement() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'quiz-loading';
        loadingDiv.className = 'quiz-loading hidden';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading...</p>
        `;
        document.body.appendChild(loadingDiv);
        return loadingDiv;
    }

    /**
     * Create error element if it doesn't exist
     */
    createErrorElement() {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'quiz-error';
        errorDiv.className = 'quiz-error hidden';
        errorDiv.innerHTML = `
            <div class="error-icon">⚠️</div>
            <p class="error-text">An error occurred</p>
            <button class="retry-btn" onclick="window.integratedQuiz.retryInitialization()">Retry</button>
        `;
        document.body.appendChild(errorDiv);
        return errorDiv;
    }

    /**
     * Load quiz questions from API
     */
    async loadQuizQuestions() {
        try {
            const response = await this.apiService.getQuizQuestions();
            this.questions = response.questions;
            this.totalQuestions = response.totalQuestions;
            
            console.log(`📝 Loaded ${this.totalQuestions} questions from API`);
        } catch (error) {
            console.error('Failed to load quiz questions:', error);
            
            // Fallback to local questions if API fails
            console.log('🔄 Falling back to local questions');
            this.loadFallbackQuestions();
        }
    }

    /**
     * Fallback questions if API is unavailable
     */
    loadFallbackQuestions() {
        this.questions = [
            {
                id: 'concern',
                question: "What's your biggest hair concern?",
                type: 'single',
                required: true,
                options: [
                    { value: 'dryness', text: 'Dryness and frizz 💧' },
                    { value: 'oily', text: 'Gets greasy quickly 🫧' },
                    { value: 'damage', text: 'Damage and breakage 🔥' },
                    { value: 'thinning', text: 'Thinning or lack of volume 📉' },
                    { value: 'styling', text: 'Hard to style ✨' }
                ]
            },
            {
                id: 'length',
                question: "How would you describe your hair length?",
                type: 'single',
                required: true,
                options: [
                    { value: 'short', text: 'Short (above shoulders) ✂️' },
                    { value: 'medium', text: 'Medium (shoulder to chest) 📏' },
                    { value: 'long', text: 'Long (past chest) 🌊' }
                ]
            },
            {
                id: 'wash_frequency',
                question: "How often do you wash your hair?",
                type: 'single',
                required: true,
                options: [
                    { value: 'daily', text: 'Every day 🚿' },
                    { value: '2-3times', text: '2-3 times per week ⭐' },
                    { value: 'weekly', text: 'Once a week 📅' },
                    { value: 'less', text: 'Less than once a week 🌿' }
                ]
            }
        ];
        this.totalQuestions = this.questions.length;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Previous button
        this.prevButtonEl.addEventListener('click', () => {
            console.log('⬅️ Previous button clicked');
            this.goToPreviousQuestion();
        });

        // Next button
        this.nextButtonEl.addEventListener('click', async () => {
            console.log('➡️ Next button clicked');
            if (this.isLastQuestion()) {
                await this.completeQuiz();
            } else {
                this.goToNextQuestion();
            }
        });

        // Auto-save progress
        window.addEventListener('beforeunload', () => {
            this.saveProgress();
        });
    }

    /**
     * Restore previous quiz progress
     */
    restoreProgress() {
        const progress = this.apiService.loadQuizProgress();
        if (!progress) return;

        console.log('🔄 Restoring previous quiz progress');
        this.userAnswers = progress.answers || {};
        this.currentQuestionIndex = Math.min(progress.currentQuestionIndex || 0, this.questions.length - 1);
    }

    /**
     * Save current progress
     */
    saveProgress() {
        this.apiService.saveQuizProgress(this.currentQuestionIndex, this.userAnswers);
    }

    /**
     * Display current question
     */
    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) return;

        const currentQuestion = this.questions[this.currentQuestionIndex];
        console.log(`📝 Displaying question ${this.currentQuestionIndex + 1}: ${currentQuestion.id}`);

        // Update question text
        this.questionTextEl.textContent = currentQuestion.question;

        // Update counter
        this.questionCounterEl.textContent = `${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;

        // Update progress bar
        const progressPercent = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        this.progressFillEl.style.width = `${progressPercent}%`;

        // Clear and populate options
        this.displayQuestionOptions(currentQuestion);

        // Update navigation buttons
        this.updateNavigationButtons();

        // Save progress
        this.saveProgress();
    }

    /**
     * Display question options
     */
    displayQuestionOptions(question) {
        this.questionOptionsEl.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'quiz-option-btn';
            optionButton.textContent = option.text;
            optionButton.setAttribute('data-value', option.value);

            // Check if this option is already selected
            if (this.isOptionSelected(question.id, option.value)) {
                optionButton.classList.add('selected');
            }

            // Add click handler
            optionButton.addEventListener('click', (event) => {
                this.handleOptionSelection(event, question, option);
            });

            this.questionOptionsEl.appendChild(optionButton);
        });
    }

    /**
     * Handle option selection
     */
    handleOptionSelection(event, question, option) {
        console.log(`✅ Option selected: ${option.value} for question ${question.id}`);

        if (question.type === 'single') {
            // Single choice: deselect all others
            const allButtons = this.questionOptionsEl.querySelectorAll('.quiz-option-btn');
            allButtons.forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');

            this.userAnswers[question.id] = option.value;
        } else if (question.type === 'multiple') {
            // Multiple choice: toggle selection
            event.target.classList.toggle('selected');

            if (!this.userAnswers[question.id]) {
                this.userAnswers[question.id] = [];
            }

            const answers = this.userAnswers[question.id];
            const index = answers.indexOf(option.value);

            if (index > -1) {
                answers.splice(index, 1);
            } else {
                answers.push(option.value);
            }
        }

        this.updateNavigationButtons();
        console.log('Current answers:', this.userAnswers);
    }

    /**
     * Check if option is selected
     */
    isOptionSelected(questionId, value) {
        const answer = this.userAnswers[questionId];
        if (!answer) return false;

        if (Array.isArray(answer)) {
            return answer.includes(value);
        }
        return answer === value;
    }

    /**
     * Check if current question has valid answer
     */
    hasValidAnswer() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const answer = this.userAnswers[currentQuestion.id];

        if (!answer) return false;

        if (Array.isArray(answer)) {
            return answer.length > 0;
        }
        return answer.trim().length > 0;
    }

    /**
     * Update navigation buttons
     */
    updateNavigationButtons() {
        // Previous button
        this.prevButtonEl.disabled = (this.currentQuestionIndex === 0);

        // Next button
        const hasAnswer = this.hasValidAnswer();
        this.nextButtonEl.disabled = !hasAnswer || this.isSubmitting;

        if (this.isLastQuestion()) {
            this.nextButtonEl.textContent = this.isSubmitting ? 'Submitting...' : 'Complete Quiz';
            this.nextButtonEl.classList.add('complete-btn');
        } else {
            this.nextButtonEl.textContent = 'Next';
            this.nextButtonEl.classList.remove('complete-btn');
        }
    }

    /**
     * Go to previous question
     */
    goToPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    }

    /**
     * Go to next question
     */
    goToNextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1 && this.hasValidAnswer()) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
        }
    }

    /**
     * Check if on last question
     */
    isLastQuestion() {
        return this.currentQuestionIndex === (this.questions.length - 1);
    }

    /**
     * Complete quiz by submitting to API
     */
    async completeQuiz() {
        if (this.isSubmitting) return;

        console.log('🏆 Completing quiz...');
        this.isSubmitting = true;
        this.updateNavigationButtons();

        try {
            this.showLoading('Analyzing your hair profile...');

            // Submit quiz to API
            const response = await this.apiService.submitQuiz(this.userAnswers, {
                completedAt: new Date().toISOString(),
                questionCount: this.questions.length
            });

            console.log('✅ Quiz submitted successfully:', response);

            // Clear saved progress
            this.apiService.clearQuizProgress();

            // Handle response
            await this.handleQuizCompletion(response);

        } catch (error) {
            console.error('❌ Quiz submission failed:', error);
            await this.handleSubmissionError(error);
        } finally {
            this.isSubmitting = false;
            this.hideLoading();
            this.updateNavigationButtons();
        }
    }

    /**
     * Handle successful quiz completion
     */
    async handleQuizCompletion(response) {
        console.log('🎉 Quiz completed successfully');

        // Store results locally
        localStorage.setItem('strandly_quiz_results', JSON.stringify(response));

        // Check if user is authenticated
        if (this.apiService.isAuthenticated()) {
            // Redirect to results page
            window.location.href = 'results.html';
        } else {
            // Prompt for signup to save results
            this.promptForSignup(response);
        }
    }

    /**
     * Handle submission error
     */
    async handleSubmissionError(error) {
        const errorInfo = this.apiService.handleError(error);
        
        if (errorInfo.type === 'network_error') {
            this.showError('Connection failed. Your answers have been saved locally. Please try again when you have a stable internet connection.', true);
        } else if (errorInfo.type === 'auth_required') {
            this.promptForSignup(null, 'Please create an account to save your results and get personalized recommendations.');
        } else {
            this.showError(`Submission failed: ${errorInfo.message}`, errorInfo.canRetry);
        }
    }

    /**
     * Prompt user to sign up for results
     */
    promptForSignup(results, message) {
        const defaultMessage = "Create a free account to save your personalized hair analysis and get product recommendations!";
        
        if (confirm(message || defaultMessage)) {
            // Store results and redirect to signup
            if (results) {
                localStorage.setItem('strandly_pending_results', JSON.stringify(results));
            }
            window.location.href = 'signup.html?redirect=quiz-complete';
        }
    }

    /**
     * Show loading state
     */
    showLoading(message = 'Loading...') {
        if (this.loadingEl) {
            this.loadingEl.querySelector('.loading-text').textContent = message;
            this.loadingEl.classList.remove('hidden');
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.loadingEl) {
            this.loadingEl.classList.add('hidden');
        }
    }

    /**
     * Show error message
     */
    showError(message, showRetry = false) {
        if (this.errorEl) {
            this.errorEl.querySelector('.error-text').textContent = message;
            const retryBtn = this.errorEl.querySelector('.retry-btn');
            if (retryBtn) {
                retryBtn.style.display = showRetry ? 'block' : 'none';
            }
            this.errorEl.classList.remove('hidden');
        }
    }

    /**
     * Hide error message
     */
    hideError() {
        if (this.errorEl) {
            this.errorEl.classList.add('hidden');
        }
    }

    /**
     * Retry initialization
     */
    async retryInitialization() {
        this.hideError();
        await this.initialize();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DOM loaded, starting Integrated Strandly Quiz');
    
    const quiz = new IntegratedStrandlyQuiz();
    const initialized = await quiz.initialize();
    
    if (initialized) {
        console.log('✅ Integrated quiz successfully initialized');
        // Make quiz globally accessible
        window.integratedQuiz = quiz;
    } else {
        console.error('❌ Integrated quiz initialization failed');
    }
});