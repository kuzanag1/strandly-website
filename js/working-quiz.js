/**
 * STRANDLY HAIR QUIZ - WORKING IMPLEMENTATION
 * Built with Opus model for complexity handling
 * February 17, 2026
 */

class WorkingStrandlyQuiz {
    constructor() {
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.totalQuestions = 10;
        
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
                id: 'environment-type',
                text: "What's your climate like most of the year?",
                type: 'single-choice',
                choices: [
                    'Super humid (frizz city!) 🌴',
                    'Pretty dry (static & flyaways) 🏜️',
                    'Moderate & comfortable 🌤️',
                    'Changes with seasons 🍂'
                ]
            },
            {
                id: 'hair-goals',
                text: "What's your ultimate hair dream?",
                type: 'single-choice',
                choices: [
                    'Healthy, strong hair that glows 💎',
                    'Faster growth & more length 🚀',
                    'Easy styling that lasts all day ⏰',
                    'Mirror-like shine & smoothness ✨',
                    'Volume & body that won\'t quit 🎈'
                ]
            }
        ];
        
        // Initialize DOM elements
        this.questionTextEl = null;
        this.questionOptionsEl = null;
        this.questionCounterEl = null;
        this.progressFillEl = null;
        this.prevButtonEl = null;
        this.nextButtonEl = null;
    }

    /**
     * Initialize the quiz - find DOM elements and start first question
     */
    initialize() {
        console.log('🎯 Initializing Working Strandly Quiz');
        console.log(`Total questions: ${this.quizQuestions.length}`);
        
        // Find DOM elements
        this.questionTextEl = document.getElementById('question-text');
        this.questionOptionsEl = document.getElementById('question-options');
        this.questionCounterEl = document.getElementById('question-counter');
        this.progressFillEl = document.getElementById('progress-fill');
        this.prevButtonEl = document.getElementById('prev-btn');
        this.nextButtonEl = document.getElementById('next-btn');
        
        // Verify all elements exist
        if (!this.questionTextEl || !this.questionOptionsEl || !this.questionCounterEl || 
            !this.progressFillEl || !this.prevButtonEl || !this.nextButtonEl) {
            console.error('❌ Required DOM elements not found');
            return false;
        }
        
        // Set up button event listeners
        this.setupEventListeners();
        
        // Display first question
        this.displayCurrentQuestion();
        
        return true;
    }
    
    /**
     * Set up event listeners for navigation buttons
     */
    setupEventListeners() {
        // Previous button
        this.prevButtonEl.addEventListener('click', () => {
            console.log('⬅️ Previous button clicked');
            this.goToPreviousQuestion();
        });
        
        // Next button
        this.nextButtonEl.addEventListener('click', () => {
            console.log('➡️ Next button clicked');
            if (this.isLastQuestion()) {
                this.completeQuiz();
            } else {
                this.goToNextQuestion();
            }
        });
    }
    
    /**
     * Display the current question and options
     */
    displayCurrentQuestion() {
        const currentQuestion = this.quizQuestions[this.currentQuestionIndex];
        console.log(`📝 Displaying question ${this.currentQuestionIndex + 1}: ${currentQuestion.id}`);
        
        // Update question text
        this.questionTextEl.textContent = currentQuestion.text;
        
        // Update question counter
        this.questionCounterEl.textContent = `${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;
        
        // Update progress bar
        const progressPercent = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        this.progressFillEl.style.width = `${progressPercent}%`;
        
        // Clear and populate options
        this.questionOptionsEl.innerHTML = '';
        
        currentQuestion.choices.forEach((choice, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'quiz-option-btn';
            optionButton.textContent = choice;
            optionButton.setAttribute('data-choice-index', index);
            optionButton.setAttribute('data-choice-value', choice);
            
            // Check if this option is already selected
            if (this.isChoiceSelected(currentQuestion.id, choice)) {
                optionButton.classList.add('selected');
            }
            
            // Add click event listener
            optionButton.addEventListener('click', (event) => {
                this.handleChoiceSelection(event, currentQuestion, choice);
            });
            
            this.questionOptionsEl.appendChild(optionButton);
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    /**
     * Handle when user selects a choice
     */
    handleChoiceSelection(event, question, selectedChoice) {
        console.log(`✅ Choice selected: ${selectedChoice} for question ${question.id}`);
        
        if (question.type === 'single-choice') {
            // Single choice: deselect all others, select this one
            const allOptions = this.questionOptionsEl.querySelectorAll('.quiz-option-btn');
            allOptions.forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
            
            // Store the answer
            this.userAnswers[question.id] = selectedChoice;
            
        } else if (question.type === 'multiple-choice') {
            // Multiple choice: toggle this option
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
        }
        
        return false;
    }
    
    /**
     * Update navigation button states
     */
    updateNavigationButtons() {
        // Previous button: disabled on first question
        this.prevButtonEl.disabled = (this.currentQuestionIndex === 0);
        
        // Next button: disabled if no valid answer, show different text on last question
        const hasAnswer = this.hasValidAnswer();
        this.nextButtonEl.disabled = !hasAnswer;
        
        if (this.isLastQuestion()) {
            this.nextButtonEl.textContent = 'Complete Quiz';
        } else {
            this.nextButtonEl.textContent = 'Next';
        }
        
        console.log(`Navigation updated: prev=${!this.prevButtonEl.disabled}, next=${!this.nextButtonEl.disabled}, hasAnswer=${hasAnswer}`);
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
     * Complete the quiz
     */
    completeQuiz() {
        console.log('🏆 Quiz completed!');
        console.log('Final answers:', this.userAnswers);
        
        // Count answered questions
        const answeredCount = Object.keys(this.userAnswers).length;
        
        alert(`Quiz completed! You answered ${answeredCount} out of ${this.totalQuestions} questions. Thank you for your responses.`);
        
        // Here you would normally send results to backend
        // window.location.href = 'results.html';
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, starting Working Strandly Quiz');
    
    const quiz = new WorkingStrandlyQuiz();
    const initialized = quiz.initialize();
    
    if (initialized) {
        console.log('✅ Quiz successfully initialized');
        // Make quiz globally accessible for debugging
        window.strandlyQuiz = quiz;
    } else {
        console.error('❌ Quiz initialization failed');
    }
});