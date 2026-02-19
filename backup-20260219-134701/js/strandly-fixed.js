// EMERGENCY NAVIGATION FIX - February 17, 2026
// CAPTAIN'S URGENT REQUIREMENTS: Perfect navigation + no images + clean UX

class FixedStrandlyQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.questions = [
            {
                id: 'concern',
                question: "What's your biggest hair concern?",
                type: 'single',
                options: [
                    { value: 'dryness', text: 'Dryness and frizz' },
                    { value: 'oily', text: 'Oily roots' },
                    { value: 'damage', text: 'Damage and breakage' },
                    { value: 'thinning', text: 'Thinning or lack of volume' },
                    { value: 'styling', text: 'Hard to style' }
                ]
            },
            {
                id: 'length',
                question: "How would you describe your hair length?",
                type: 'single',
                options: [
                    { value: 'short', text: 'Short (above shoulders)' },
                    { value: 'medium', text: 'Medium (shoulder to mid-back)' },
                    { value: 'long', text: 'Long (below mid-back)' }
                ]
            },
            {
                id: 'wash_frequency',
                question: "How often do you wash your hair?",
                type: 'single',
                options: [
                    { value: 'daily', text: 'Daily' },
                    { value: '2-3times', text: '2-3 times per week' },
                    { value: 'weekly', text: 'Once a week' },
                    { value: 'less', text: 'Less than once a week' }
                ]
            },
            {
                id: 'texture',
                question: "Which best describes your hair texture?",
                type: 'single',
                options: [
                    { value: 'straight', text: 'Straight - lies flat against scalp, minimal wave or curl' },
                    { value: 'wavy', text: 'Wavy - gentle waves with slight bends, not quite curly' },
                    { value: 'curly', text: 'Curly - defined curls and spirals, springy texture' },
                    { value: 'coily', text: 'Coily - tight coils and kinks, very textured' }
                ]
            },
            {
                id: 'thickness',
                question: "How thick does each individual hair strand feel?",
                type: 'single',
                options: [
                    { value: 'fine', text: 'Fine - like silk thread, hard to feel between fingers' },
                    { value: 'medium', text: 'Medium - noticeable thickness but flexible' },
                    { value: 'thick', text: 'Thick - easily felt, strong and coarse' }
                ]
            },
            {
                id: 'porosity',
                question: "Hair Porosity Test: Drop a clean hair strand in water. What happens?",
                type: 'single',
                options: [
                    { value: 'floats', text: 'It floats on top (Low porosity - hair repels moisture)' },
                    { value: 'slow_sink', text: 'It slowly sinks (Normal porosity - balanced moisture)' },
                    { value: 'fast_sink', text: 'It sinks quickly (High porosity - absorbs moisture fast)' },
                    { value: 'unsure', text: "I haven't tested this yet" }
                ]
            },
            {
                id: 'scalp',
                question: "How would you describe your scalp?",
                type: 'single',
                options: [
                    { value: 'oily', text: 'Gets oily quickly - greasy within 1-2 days' },
                    { value: 'normal', text: 'Normal - balanced, not too oily or dry' },
                    { value: 'dry', text: 'Dry or flaky - feels tight, may have dandruff' },
                    { value: 'sensitive', text: 'Sensitive or irritated - reacts to products' }
                ]
            },
            {
                id: 'damage',
                question: "What chemical treatments have you had? (Select all that apply)",
                type: 'multiple',
                options: [
                    { value: 'none', text: 'None - my hair is natural/untreated' },
                    { value: 'color', text: 'Hair coloring or dye' },
                    { value: 'bleach', text: 'Bleaching or lightening' },
                    { value: 'perm', text: 'Perms or chemical relaxers' },
                    { value: 'highlights', text: 'Highlights or lowlights' }
                ]
            },
            {
                id: 'environment',
                question: "What's your environment like?",
                type: 'single',
                options: [
                    { value: 'humid', text: 'Humid climate - high moisture in air' },
                    { value: 'dry', text: 'Dry climate - low humidity, arid conditions' },
                    { value: 'moderate', text: 'Moderate climate - balanced humidity' },
                    { value: 'variable', text: 'Changes with seasons - varies throughout year' }
                ]
            },
            {
                id: 'goals',
                question: "What's your main hair goal?",
                type: 'single',
                options: [
                    { value: 'health', text: 'Healthier, stronger hair overall' },
                    { value: 'growth', text: 'Faster hair growth and length retention' },
                    { value: 'manageability', text: 'Easier to style and manage daily' },
                    { value: 'shine', text: 'More shine, softness, and smoothness' },
                    { value: 'volume', text: 'More volume and thickness appearance' }
                ]
            }
        ];
    }

    start() {
        // Initialize quiz state
        this.currentQuestion = 0;
        this.answers = {};
        
        // Set up navigation event listeners ONCE
        this.setupNavigation();
        
        // Render first question
        this.renderQuestion();
        
        console.log('✅ Quiz started successfully');
    }

    setupNavigation() {
        // Clear any existing listeners and set up clean navigation
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            // Clone button to remove all existing listeners
            const newPrevBtn = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
            
            newPrevBtn.addEventListener('click', () => {
                console.log('🔙 Previous button clicked');
                this.previousQuestion();
            });
        }
        
        if (nextBtn) {
            // Clone button to remove all existing listeners
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
            
            newNextBtn.addEventListener('click', () => {
                console.log('➡️ Next button clicked');
                this.nextQuestion();
            });
        }
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionText = document.getElementById('question-text');
        const questionOptions = document.getElementById('question-options');
        const questionCounter = document.getElementById('question-counter');
        
        // Update question text and counter
        questionText.textContent = question.question;
        questionCounter.textContent = `${this.currentQuestion + 1} of ${this.questions.length}`;
        
        // Clear previous options
        questionOptions.innerHTML = '';
        questionOptions.className = 'question-options';
        
        // Render options based on type
        this.renderOptions(question, questionOptions);
        
        // Update progress bar
        this.updateProgress();
        
        // Update navigation buttons
        this.updateNavigation();
        
        console.log(`📝 Rendered question ${this.currentQuestion + 1}: ${question.question}`);
    }
    
    renderOptions(question, container) {
        question.options.forEach(option => {
            const optionDiv = document.createElement('button');
            optionDiv.className = 'option-button';
            optionDiv.dataset.value = option.value;
            optionDiv.textContent = option.text;
            
            // Check if previously selected
            const isSelected = question.type === 'multiple' 
                ? (this.answers[question.id] || []).includes(option.value)
                : this.answers[question.id] === option.value;
            
            if (isSelected) {
                optionDiv.classList.add('selected');
            }
            
            // Add click handler
            optionDiv.addEventListener('click', () => {
                if (question.type === 'multiple') {
                    this.toggleMultipleOption(question.id, option.value, optionDiv);
                } else {
                    this.selectSingleOption(question.id, option.value, optionDiv, container);
                }
                this.updateNavigation();
            });
            
            container.appendChild(optionDiv);
        });
    }
    
    selectSingleOption(questionId, value, selectedElement, container) {
        // Store answer
        this.answers[questionId] = value;
        
        // Update visual selection
        container.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        selectedElement.classList.add('selected');
        
        console.log(`✅ Selected: ${questionId} = ${value}`);
    }
    
    toggleMultipleOption(questionId, value, optionElement) {
        // Initialize array if needed
        if (!this.answers[questionId]) {
            this.answers[questionId] = [];
        }
        
        const isCurrentlySelected = this.answers[questionId].includes(value);
        
        if (isCurrentlySelected) {
            // Remove selection
            this.answers[questionId] = this.answers[questionId].filter(v => v !== value);
            optionElement.classList.remove('selected');
            console.log(`❌ Deselected: ${questionId} -= ${value}`);
        } else {
            // Add selection
            this.answers[questionId].push(value);
            optionElement.classList.add('selected');
            console.log(`✅ Selected: ${questionId} += ${value}`);
        }
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const progressPercent = ((this.currentQuestion + 1) / this.questions.length) * 100;
            progressFill.style.width = `${progressPercent}%`;
        }
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            // Previous button: disabled only on first question
            prevBtn.disabled = this.currentQuestion === 0;
            prevBtn.style.display = 'inline-block';
        }
        
        if (nextBtn) {
            const currentQuestion = this.questions[this.currentQuestion];
            const hasAnswer = this.hasValidAnswer(currentQuestion);
            
            if (this.currentQuestion === this.questions.length - 1) {
                // Last question: show "Complete Quiz"
                nextBtn.textContent = 'Complete Quiz';
                nextBtn.disabled = !hasAnswer;
            } else {
                // Regular questions: show "Next"
                nextBtn.textContent = 'Next';
                nextBtn.disabled = !hasAnswer;
            }
            nextBtn.style.display = 'inline-block';
        }
    }
    
    hasValidAnswer(question) {
        const answer = this.answers[question.id];
        
        if (question.type === 'multiple') {
            return Array.isArray(answer) && answer.length > 0;
        } else {
            return answer !== undefined && answer !== null;
        }
    }

    nextQuestion() {
        const currentQuestion = this.questions[this.currentQuestion];
        
        // Validate answer exists
        if (!this.hasValidAnswer(currentQuestion)) {
            console.warn('⚠️ No answer selected');
            return;
        }
        
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            console.log(`➡️ Advanced to question ${this.currentQuestion + 1}`);
        } else {
            this.submitQuiz();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            console.log(`🔙 Went back to question ${this.currentQuestion + 1}`);
        }
    }

    submitQuiz() {
        console.log('🧬 Quiz completed! Final answers:', this.answers);
        
        // Show completion state
        const questionText = document.getElementById('question-text');
        const questionOptions = document.getElementById('question-options');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        questionText.textContent = "Analyzing your hair profile...";
        questionOptions.innerHTML = `
            <div style="text-align: center; padding: 3rem 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🧬</div>
                <h3 style="margin-bottom: 1rem; color: #495057;">Processing your personalized recommendations</h3>
                <p style="color: #6c757d;">This will take just a moment...</p>
            </div>
        `;
        
        // Hide navigation
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        
        // Simulate processing and redirect
        setTimeout(() => {
            alert('Quiz completed successfully! Redirecting to results...');
            // In real implementation: window.location.href = 'results.html';
        }, 2000);
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Strandly Quiz...');
    
    // Create and start the quiz
    window.strandlyQuiz = new FixedStrandlyQuiz();
    window.strandlyQuiz.start();
    
    console.log('✅ Quiz initialized successfully');
});