// STRANDLY HAIR QUIZ - REBUILT FROM SCRATCH
// Simple, working implementation - February 17, 2026

class StrandlyQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        
        // 10 ACTUAL WORKING QUESTIONS
        this.questions = [
            {
                id: 'hair_concern',
                question: "What's your main hair concern?",
                type: 'single',
                options: [
                    'Dryness and frizz',
                    'Oily roots',
                    'Damage and breakage', 
                    'Thinning hair',
                    'Hard to style'
                ]
            },
            {
                id: 'hair_length',
                question: "How would you describe your hair length?",
                type: 'single',
                options: [
                    'Short (above shoulders)',
                    'Medium (shoulder to mid-back)',
                    'Long (below mid-back)'
                ]
            },
            {
                id: 'wash_frequency',
                question: "How often do you wash your hair?",
                type: 'single',
                options: [
                    'Daily',
                    '2-3 times per week',
                    'Once a week',
                    'Less than once a week'
                ]
            },
            {
                id: 'hair_texture',
                question: "Which best describes your hair texture?",
                type: 'single',
                options: [
                    'Straight - lies flat, minimal wave',
                    'Wavy - gentle waves, slight bends',
                    'Curly - defined curls and spirals',
                    'Coily - tight coils and kinks'
                ]
            },
            {
                id: 'hair_thickness',
                question: "How thick does each hair strand feel?",
                type: 'single',
                options: [
                    'Fine - like silk thread, hard to feel',
                    'Medium - noticeable but flexible',
                    'Thick - easily felt, strong and coarse'
                ]
            },
            {
                id: 'hair_porosity',
                question: "Hair Porosity Test: Drop a clean hair in water. What happens?",
                type: 'single',
                options: [
                    'It floats on top (Low porosity)',
                    'It slowly sinks (Normal porosity)',
                    'It sinks quickly (High porosity)',
                    "I haven't tested this yet"
                ]
            },
            {
                id: 'scalp_type',
                question: "How would you describe your scalp?",
                type: 'single',
                options: [
                    'Gets oily quickly (1-2 days)',
                    'Normal - balanced, not too oily or dry',
                    'Dry or flaky - tight, maybe dandruff',
                    'Sensitive - reacts to products'
                ]
            },
            {
                id: 'chemical_treatments',
                question: "What chemical treatments have you had? (Select all that apply)",
                type: 'multiple',
                options: [
                    'None - my hair is natural',
                    'Hair coloring or dye',
                    'Bleaching or lightening',
                    'Perms or chemical relaxers',
                    'Highlights or lowlights'
                ]
            },
            {
                id: 'environment',
                question: "What's your environment like?",
                type: 'single',
                options: [
                    'Humid climate - high moisture in air',
                    'Dry climate - low humidity',
                    'Moderate climate - balanced',
                    'Changes with seasons'
                ]
            },
            {
                id: 'hair_goals',
                question: "What's your main hair goal?",
                type: 'single',
                options: [
                    'Healthier, stronger hair overall',
                    'Faster hair growth',
                    'Easier to style and manage',
                    'More shine and smoothness',
                    'More volume and thickness'
                ]
            }
        ];
    }

    start() {
        console.log('🚀 Starting Strandly Quiz');
        console.log(`Total questions: ${this.questions.length}`);
        this.questions.forEach((q, i) => console.log(`${i+1}. ${q.id}`));
        this.renderQuestion();
        this.updateNavigation();
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        console.log(`📝 Rendering question ${this.currentQuestion + 1}: ${question.id} - ${question.question}`);
        
        // Update question text
        const questionText = document.getElementById('question-text');
        const questionOptions = document.getElementById('question-options');
        const questionCounter = document.getElementById('question-counter');
        
        if (questionText) questionText.textContent = question.question;
        if (questionCounter) questionCounter.textContent = `${this.currentQuestion + 1} of ${this.questions.length}`;
        
        // Clear and build options
        if (questionOptions) {
            questionOptions.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = option;
                button.onclick = () => this.selectOption(question.id, option, question.type);
                
                // Check if selected
                if (question.type === 'single' && this.answers[question.id] === option) {
                    button.classList.add('selected');
                }
                if (question.type === 'multiple' && this.answers[question.id] && this.answers[question.id].includes(option)) {
                    button.classList.add('selected');
                }
                
                questionOptions.appendChild(button);
            });
        }
        
        this.updateProgress();
        this.updateNavigation();
    }

    selectOption(questionId, option, type) {
        if (type === 'single') {
            this.answers[questionId] = option;
        } else if (type === 'multiple') {
            if (!this.answers[questionId]) this.answers[questionId] = [];
            
            const index = this.answers[questionId].indexOf(option);
            if (index > -1) {
                this.answers[questionId].splice(index, 1);
            } else {
                this.answers[questionId].push(option);
            }
        }
        
        this.renderQuestion(); // Re-render to update selection states
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
            progressFill.style.width = progress + '%';
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        // Previous button
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
            prevBtn.onclick = () => this.previousQuestion();
        }
        
        // Next button
        if (nextBtn) {
            const hasAnswer = this.hasAnswer();
            nextBtn.disabled = !hasAnswer;
            
            if (this.currentQuestion === this.questions.length - 1) {
                nextBtn.textContent = 'Complete Quiz';
                nextBtn.onclick = () => this.completeQuiz();
            } else {
                nextBtn.textContent = 'Next';
                nextBtn.onclick = () => this.nextQuestion();
            }
        }
    }

    hasAnswer() {
        const questionId = this.questions[this.currentQuestion].id;
        const answer = this.answers[questionId];
        
        if (this.questions[this.currentQuestion].type === 'multiple') {
            return answer && Array.isArray(answer) && answer.length > 0;
        } else {
            return answer && answer.trim().length > 0;
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            console.log(`➡️ Advanced to question ${this.currentQuestion + 1}/${this.questions.length}`);
            this.renderQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            console.log(`⬅️ Went back to question ${this.currentQuestion + 1}/${this.questions.length}`);
            this.renderQuestion();
        }
    }

    completeQuiz() {
        console.log('Quiz completed!', this.answers);
        alert('Quiz completed! Thank you for your responses.');
        // Here you would normally send to backend or show results
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Initializing Simple Quiz');
    window.quiz = new StrandlyQuiz();
    window.quiz.start();
});