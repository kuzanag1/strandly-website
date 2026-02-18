/**
 * STRANDLY HAIR QUIZ - BACKEND INTEGRATED VERSION
 * Updated for full API integration and payment flow
 * February 17, 2026
 */

class WorkingStrandlyQuiz {
    constructor() {
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.totalQuestions = 10;
        this.isSubmitting = false;
        
        // Define all 10 questions - SPECIALIST OPTIMIZED
        this.quizQuestions = [
            {
                id: 'hair-concern',
                text: "What's your biggest hair frustration right now?",
                type: 'single-choice',
                choices: [
                    'My hair feels dry and lifeless 💧',
                    'It gets greasy way too quickly 🫧',
                    'Damage from styling/treatments 🔥',
                    'Thinning or lack of volume 📉',
                    'Hard to style the way I want ✨'
                ]
            },
            {
                id: 'hair-length',
                text: "How would you describe your hair length?",
                type: 'single-choice',
                choices: [
                    'Short & sassy (above shoulders) ✂️',
                    'Medium length (shoulder to chest) 📏',
                    'Long & luscious (past chest) 🌊'
                ]
            },
            {
                id: 'wash-frequency',
                text: "How often do you currently wash your hair?",
                type: 'single-choice',
                choices: [
                    'Every day (I have to!) 🚿',
                    '2-3 times per week ⭐',
                    'Once a week 📅',
                    'Less than once a week 🌿'
                ]
            },
            {
                id: 'hair-texture',
                text: "What's your natural hair texture?",
                type: 'single-choice',
                choices: [
                    'Pin-straight (sleek & smooth) ➡️',
                    'Wavy (with some natural movement) 🌊',
                    'Curly (defined spirals) 🌀',
                    'Coily/kinky (tight curls) ⚡'
                ]
            },
            {
                id: 'hair-thickness',
                text: "How does your hair feel when you touch it?",
                type: 'single-choice',
                choices: [
                    'Fine (soft but can look flat) 🪶',
                    'Medium (just right balance) ⚖️',
                    'Thick (lots of volume & body) 💪'
                ]
            },
            {
                id: 'hair-porosity',
                text: "Quick strand test: Drop a clean hair in water - what happens?",
                type: 'single-choice',
                choices: [
                    'It floats on top 🎈',
                    'Slowly sinks to the bottom 🐌',
                    'Sinks quickly like a rock 🪨',
                    'I\'d rather skip this step ⏭️'
                ]
            },
            {
                id: 'scalp-type',
                text: "How does your scalp usually feel?",
                type: 'single-choice',
                choices: [
                    'Gets oily quickly 🫧',
                    'Pretty normal & balanced ✅',
                    'Often feels dry or tight 🌵',
                    'Sensitive or easily irritated 🌸'
                ]
            },
            {
                id: 'chemical-treatments',
                text: "What treatments have you used on your hair? (Select all that apply)",
                type: 'multiple-choice',
                choices: [
                    'None - I keep it natural 🌿',
                    'Hair color/highlights ✨',
                    'Bleaching treatments 💫',
                    'Chemical relaxers/perms 🌀',
                    'Heat styling regularly 🔥'
                ]
            },
            {
                id: 'lifestyle-factors',
                text: "Which lifestyle factors affect your hair? (Select all that apply)",
                type: 'multiple-choice',
                choices: [
                    'Frequent swimming 🏊‍♀️',
                    'High stress levels 😤',
                    'Hard water area 🚿',
                    'Diet changes recently 🥗',
                    'Hormonal changes 🌟',
                    'None of these ✅'
                ]
            },
            {
                id: 'email',
                text: "Enter your email to receive your personalized hair analysis:",
                type: 'email',
                choices: [],
                required: true,
                placeholder: 'your.email@example.com'
            }
        ];
        
        console.log('🧬 Hair quiz initialized with', this.totalQuestions, 'questions');
    }
    
    /**
     * Initialize quiz
     */
    initialize() {
        try {
            // Get DOM elements
            this.questionTextEl = document.getElementById('question-text');
            this.questionOptionsEl = document.getElementById('question-options');
            this.prevButtonEl = document.getElementById('prev-btn');
            this.nextButtonEl = document.getElementById('next-btn');
            this.questionCounterEl = document.getElementById('question-counter');
            this.progressFillEl = document.getElementById('progress-fill');
            
            if (!this.questionTextEl || !this.questionOptionsEl || !this.prevButtonEl || !this.nextButtonEl) {
                throw new Error('Required quiz elements not found');
            }
            
            // Bind event handlers
            this.prevButtonEl.addEventListener('click', () => this.goToPreviousQuestion());
            this.nextButtonEl.addEventListener('click', () => this.handleNextClick());
            
            // Load saved progress if exists
            this.loadSavedProgress();
            
            // Display first question
            this.displayCurrentQuestion();
            
            return true;
            
        } catch (error) {
            console.error('Quiz initialization failed:', error);
            return false;
        }
    }
    
    /**
     * Load saved progress from localStorage
     */
    loadSavedProgress() {
        if (window.StrandlyApi) {
            const savedProgress = window.StrandlyApi.loadQuizProgress();
            if (savedProgress) {
                this.currentQuestionIndex = savedProgress.currentQuestionIndex;
                this.userAnswers = savedProgress.answers;
                console.log('📂 Loaded saved progress:', savedProgress);
            }
        }
    }
    
    /**
     * Save current progress
     */
    saveProgress() {
        if (window.StrandlyApi) {
            window.StrandlyApi.saveQuizProgress(this.currentQuestionIndex, this.userAnswers);
        }
    }
    
    /**
     * Display current question
     */
    displayCurrentQuestion() {
        const question = this.quizQuestions[this.currentQuestionIndex];
        
        // Update question text
        this.questionTextEl.textContent = question.text;
        
        // Update question counter
        this.questionCounterEl.textContent = `${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;
        
        // Update progress bar
        const progressPercentage = ((this.currentQuestionIndex) / this.totalQuestions) * 100;
        this.progressFillEl.style.width = `${progressPercentage}%`;
        
        // Clear previous options
        this.questionOptionsEl.innerHTML = '';
        
        if (question.type === 'email') {
            this.renderEmailInput(question);
        } else {
            this.renderChoiceOptions(question);
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        console.log(`Displaying question ${this.currentQuestionIndex + 1}: ${question.id}`);
    }
    
    /**
     * Render email input field
     */
    renderEmailInput(question) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'email-input-container';
        
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.id = 'email-input';
        emailInput.placeholder = question.placeholder;
        emailInput.className = 'email-input';
        emailInput.required = question.required;
        
        // Set existing value if available
        if (this.userAnswers[question.id]) {
            emailInput.value = this.userAnswers[question.id];
        }
        
        // Add input event listener
        emailInput.addEventListener('input', (event) => {
            this.handleEmailInput(question.id, event.target.value);
        });
        
        inputContainer.appendChild(emailInput);
        this.questionOptionsEl.appendChild(inputContainer);
        
        // Focus the input
        setTimeout(() => emailInput.focus(), 100);
    }
    
    /**
     * Render choice options for question
     */
    renderChoiceOptions(question) {
        question.choices.forEach((choice, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            
            // Check if this choice is already selected
            if (this.isChoiceSelected(question.id, choice)) {
                optionDiv.classList.add('selected');
            }
            
            optionDiv.textContent = choice;
            optionDiv.setAttribute('data-choice', choice);
            optionDiv.addEventListener('click', (event) => this.handleChoiceClick(event, question));
            
            this.questionOptionsEl.appendChild(optionDiv);
        });
    }
    
    /**
     * Handle email input
     */
    handleEmailInput(questionId, value) {
        this.userAnswers[questionId] = value;
        this.updateNavigationButtons();
        this.saveProgress();
    }
    
    /**
     * Handle choice click
     */
    handleChoiceClick(event, question) {
        const selectedChoice = event.target.getAttribute('data-choice');
        console.log(`Selected: ${selectedChoice} for question: ${question.id}`);
        
        if (question.type === 'single-choice') {
            // Single choice: clear other selections
            this.questionOptionsEl.querySelectorAll('.quiz-option').forEach(option => {
                option.classList.remove('selected');
            });
            event.target.classList.add('selected');
            
            // Store answer
            this.userAnswers[question.id] = selectedChoice;
        } else if (question.type === 'multiple-choice') {
            // Multiple choice: toggle selection
            event.target.classList.toggle('selected');
            
            // Initialize array if doesn't exist
            if (!this.userAnswers[question.id]) {
                this.userAnswers[question.id] = [];
            }
            
            // Add or remove from array
            const answerArray = this.userAnswers[question.id];
            const choiceIndex = answerArray.indexOf(selectedChoice);
            
            if (choiceIndex > -1) {
                // Remove if already selected
                answerArray.splice(choiceIndex, 1);
            } else {
                // Add if not selected
                answerArray.push(selectedChoice);
            }
        }
        
        // Update navigation after selection
        this.updateNavigationButtons();
        this.saveProgress();
        
        console.log('Current answers:', this.userAnswers);
    }
    
    /**
     * Check if a specific choice is selected for current question
     */
    isChoiceSelected(questionId, choice) {
        const answer = this.userAnswers[questionId];
        
        if (!answer) return false;
        
        if (Array.isArray(answer)) {
            return answer.includes(choice);
        } else {
            return answer === choice;
        }
    }
    
    /**
     * Check if current question has valid answer
     */
    hasValidAnswer() {
        const currentQuestion = this.quizQuestions[this.currentQuestionIndex];
        const answer = this.userAnswers[currentQuestion.id];
        
        if (currentQuestion.type === 'single-choice') {
            return answer && answer.trim().length > 0;
        } else if (currentQuestion.type === 'multiple-choice') {
            return answer && Array.isArray(answer) && answer.length > 0;
        } else if (currentQuestion.type === 'email') {
            return answer && this.isValidEmail(answer);
        }
        
        return false;
    }
    
    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Update navigation button states
     */
    updateNavigationButtons() {
        // Previous button: disabled on first question
        this.prevButtonEl.disabled = (this.currentQuestionIndex === 0);
        
        // Next button: disabled if no valid answer, show different text on last question
        const hasAnswer = this.hasValidAnswer();
        this.nextButtonEl.disabled = !hasAnswer || this.isSubmitting;
        
        if (this.isLastQuestion()) {
            this.nextButtonEl.textContent = this.isSubmitting ? 'Processing...' : 'Get My Analysis (€29)';
            this.nextButtonEl.classList.add('cta-button');
        } else {
            this.nextButtonEl.textContent = 'Next';
            this.nextButtonEl.classList.remove('cta-button');
        }
        
        console.log(`Navigation updated: prev=${!this.prevButtonEl.disabled}, next=${!this.nextButtonEl.disabled}, hasAnswer=${hasAnswer}`);
    }
    
    /**
     * Handle next button click
     */
    handleNextClick() {
        if (this.isSubmitting) return;
        
        if (this.isLastQuestion()) {
            this.completeQuiz();
        } else {
            this.goToNextQuestion();
        }
    }
    
    /**
     * Go to previous question
     */
    goToPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            console.log(`⬅️ Moved to question ${this.currentQuestionIndex + 1}`);
            this.displayCurrentQuestion();
        }
    }
    
    /**
     * Go to next question
     */
    goToNextQuestion() {
        if (this.currentQuestionIndex < this.quizQuestions.length - 1 && this.hasValidAnswer()) {
            this.currentQuestionIndex++;
            console.log(`➡️ Moved to question ${this.currentQuestionIndex + 1}`);
            this.displayCurrentQuestion();
        }
    }
    
    /**
     * Check if on last question
     */
    isLastQuestion() {
        return this.currentQuestionIndex === (this.quizQuestions.length - 1);
    }
    
    /**
     * Complete the quiz and submit to backend
     */
    async completeQuiz() {
        console.log('🏆 Starting quiz completion...');
        
        // Prevent double submission
        if (this.isSubmitting) {
            console.log('Already submitting, ignoring...');
            return;
        }
        
        this.isSubmitting = true;
        this.updateNavigationButtons();
        
        // Validate we have all required answers
        const answeredCount = Object.keys(this.userAnswers).length;
        if (answeredCount < this.totalQuestions) {
            alert(`Please answer all questions. You've answered ${answeredCount} out of ${this.totalQuestions}.`);
            this.isSubmitting = false;
            this.updateNavigationButtons();
            return;
        }
        
        // Validate email
        if (!this.userAnswers.email || !this.isValidEmail(this.userAnswers.email)) {
            alert('Please enter a valid email address to receive your analysis.');
            this.isSubmitting = false;
            this.updateNavigationButtons();
            return;
        }
        
        console.log('Final answers:', this.userAnswers);
        
        try {
            // Check if API service is available
            if (!window.StrandlyApi) {
                throw new Error('API service not available');
            }
            
            // Use the API service to complete the quiz
            await window.StrandlyApi.completeQuiz(this.userAnswers);
            
            // Clear saved progress on successful submission
            window.StrandlyApi.clearQuizProgress();
            
        } catch (error) {
            console.error('Quiz completion failed:', error);
            
            // Show user-friendly error message
            alert('We encountered an issue submitting your quiz. Please try again or contact support if the problem persists.');
            
            this.isSubmitting = false;
            this.updateNavigationButtons();
        }
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, starting Backend-Integrated Strandly Quiz');
    
    // Wait for API service to be available
    const initQuiz = () => {
        if (window.StrandlyApi) {
            const quiz = new WorkingStrandlyQuiz();
            const initialized = quiz.initialize();
            
            if (initialized) {
                console.log('✅ Quiz successfully initialized with API integration');
                // Make quiz globally accessible for debugging
                window.strandlyQuiz = quiz;
            } else {
                console.error('❌ Quiz initialization failed');
            }
        } else {
            console.log('⏳ Waiting for API service...');
            setTimeout(initQuiz, 100);
        }
    };
    
    initQuiz();
});