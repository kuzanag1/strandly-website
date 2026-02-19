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
            console.log('🚀 Initializing quiz...');
            
            // Get DOM elements
            this.questionTextEl = document.getElementById('question-text');
            this.questionOptionsEl = document.getElementById('question-options');
            this.prevButtonEl = document.getElementById('prev-btn');
            this.nextButtonEl = document.getElementById('next-btn');
            this.questionCounterEl = document.getElementById('question-counter');
            this.progressFillEl = document.getElementById('progress-fill');
            
            console.log('📋 DOM Elements found:');
            console.log('   question-text:', !!this.questionTextEl);
            console.log('   question-options:', !!this.questionOptionsEl);
            console.log('   prev-btn:', !!this.prevButtonEl);
            console.log('   next-btn:', !!this.nextButtonEl);
            console.log('   question-counter:', !!this.questionCounterEl);
            console.log('   progress-fill:', !!this.progressFillEl);
            
            if (!this.questionTextEl || !this.questionOptionsEl || !this.prevButtonEl || !this.nextButtonEl) {
                throw new Error('Required quiz elements not found');
            }
            
            // Bind event handlers with explicit debugging
            console.log('🔗 Binding event handlers...');
            
            this.prevButtonEl.addEventListener('click', (e) => {
                console.log('🔙 Previous button CLICKED');
                e.preventDefault();
                this.goToPreviousQuestion();
            });
            
            this.nextButtonEl.addEventListener('click', (e) => {
                console.log('➡️ Next button CLICKED');
                e.preventDefault();
                this.handleNextClick();
            });
            
            console.log('✅ Event handlers bound successfully');
            
            // Load saved progress if exists
            this.loadSavedProgress();
            
            // Display first question
            this.displayCurrentQuestion();
            
            console.log('✅ Quiz initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Quiz initialization failed:', error);
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
        emailInput.className = 'quiz-option-btn email-input'; // Match button styling
        emailInput.required = question.required;
        emailInput.style.cssText = `
            width: 100%;
            box-sizing: border-box;
            text-align: center;
            font-size: 16px;
            padding: 16px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            margin: 8px 0;
            background: white;
            transition: all 0.3s ease;
        `;
        
        // Set existing value if available
        if (this.userAnswers[question.id]) {
            emailInput.value = this.userAnswers[question.id];
        }
        
        // Add input event listener
        emailInput.addEventListener('input', (event) => {
            this.handleEmailInput(question.id, event.target.value);
        });
        
        // Add focus styling
        emailInput.addEventListener('focus', () => {
            emailInput.style.borderColor = '#667eea';
            emailInput.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
        });
        
        emailInput.addEventListener('blur', () => {
            if (!this.isValidEmail(emailInput.value)) {
                emailInput.style.borderColor = '#e2e8f0';
                emailInput.style.boxShadow = 'none';
            }
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
            // USE CORRECT CLASS NAME that matches CSS
            optionDiv.className = 'quiz-option-btn';
            
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
        console.log(`✅ Selected: ${selectedChoice} for question: ${question.id}`);
        
        if (question.type === 'single-choice') {
            // Single choice: clear other selections with CORRECT class selector
            this.questionOptionsEl.querySelectorAll('.quiz-option-btn').forEach(option => {
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
        
        console.log('📊 Current answers:', this.userAnswers);
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
        console.log(`🔄 Updating navigation buttons...`);
        console.log(`   Current question: ${this.currentQuestionIndex + 1}/${this.totalQuestions}`);
        console.log(`   Is submitting: ${this.isSubmitting}`);
        
        // Previous button: disabled on first question
        this.prevButtonEl.disabled = (this.currentQuestionIndex === 0);
        console.log(`   Previous button disabled: ${this.prevButtonEl.disabled}`);
        
        // Next button: disabled if no valid answer, show different text on last question
        const hasAnswer = this.hasValidAnswer();
        this.nextButtonEl.disabled = !hasAnswer || this.isSubmitting;
        console.log(`   Has valid answer: ${hasAnswer}`);
        console.log(`   Next button disabled: ${this.nextButtonEl.disabled}`);
        
        if (this.isLastQuestion()) {
            this.nextButtonEl.textContent = this.isSubmitting ? 'Processing...' : 'Get My Analysis ($29)';
            this.nextButtonEl.classList.add('cta-button');
            console.log(`   🎯 LAST QUESTION - Button text: "${this.nextButtonEl.textContent}"`);
        } else {
            this.nextButtonEl.textContent = 'Next';
            this.nextButtonEl.classList.remove('cta-button');
            console.log(`   ➡️ Regular question - Button text: "${this.nextButtonEl.textContent}"`);
        }
        
        console.log(`✅ Navigation updated: prev=${!this.prevButtonEl.disabled}, next=${!this.nextButtonEl.disabled}, hasAnswer=${hasAnswer}`);
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
        console.log(`🔙 Previous button clicked. Current index: ${this.currentQuestionIndex}, isSubmitting: ${this.isSubmitting}`);
        
        if (this.currentQuestionIndex > 0 && !this.isSubmitting) {
            this.currentQuestionIndex--;
            console.log(`⬅️ Moved to question ${this.currentQuestionIndex + 1}`);
            this.displayCurrentQuestion();
            
            // Force button state update
            this.updateNavigationButtons();
        } else {
            console.log(`❌ Cannot go back - index: ${this.currentQuestionIndex}, submitting: ${this.isSubmitting}`);
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
        
        // Show loading state
        this.showLoadingState();
        
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
                console.warn('API service not available, redirecting directly to payment');
                this.redirectToPayment();
                return;
            }
            
            // Use the API service to complete the quiz
            await window.StrandlyApi.completeQuiz(this.userAnswers);
            
            // Clear saved progress on successful submission
            window.StrandlyApi.clearQuizProgress();
            
        } catch (error) {
            console.error('Quiz completion failed:', error);
            
            // Fallback: redirect directly to payment page
            console.log('Falling back to direct payment redirect');
            this.redirectToPayment();
        }
    }
    
    /**
     * Show loading state during quiz completion
     */
    showLoadingState() {
        this.questionTextEl.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🧬</div>
                <h2>Analyzing Your Hair Profile...</h2>
                <p>Processing your responses and preparing your personalized recommendations</p>
                <div class="loading-dots">
                    <span>●</span><span>●</span><span>●</span>
                </div>
            </div>
        `;
        this.questionOptionsEl.innerHTML = '';
    }
    
    /**
     * Direct redirect to payment as fallback
     */
    redirectToPayment() {
        // Store answers for payment page
        localStorage.setItem('strandly_quiz_answers', JSON.stringify(this.userAnswers));
        localStorage.setItem('strandly_quiz_completed', 'true');
        
        // Show success message and redirect
        this.questionTextEl.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                <h2>Quiz Complete!</h2>
                <p>Redirecting to secure payment...</p>
            </div>
        `;
        
        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 2000);
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