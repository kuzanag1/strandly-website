// URGENT QUIZ FIX - Navigation Issues
// February 17, 2026

// Enhanced StrandlyQuiz class with fixed navigation
class FixedStrandlyQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.autoAdvanceTimer = null;
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
                visual: true,
                cssClass: 'question-texture-circles',
                options: [
                    { value: 'straight', text: 'Straight', description: 'Lies flat against scalp', image: 'images/hair-circle-straight.png' },
                    { value: 'wavy', text: 'Wavy', description: 'Gentle waves and slight bend', image: 'images/hair-circle-wavy.png' },
                    { value: 'curly', text: 'Curly', description: 'Defined curls and spirals', image: 'images/hair-circle-curly.png' },
                    { value: 'coily', text: 'Coily', description: 'Tight coils and kinks', image: 'images/hair-circle-coily.png' }
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
                    { value: 'floats', text: 'It floats on top (Low porosity)' },
                    { value: 'slow_sink', text: 'It slowly sinks (Normal porosity)' },
                    { value: 'fast_sink', text: 'It sinks quickly (High porosity)' },
                    { value: 'unsure', text: "I haven't tested this yet" }
                ]
            },
            {
                id: 'scalp',
                question: "How would you describe your scalp?",
                type: 'single',
                options: [
                    { value: 'oily', text: 'Gets oily quickly' },
                    { value: 'normal', text: 'Normal - not too oily or dry' },
                    { value: 'dry', text: 'Dry or flaky' },
                    { value: 'sensitive', text: 'Sensitive or irritated' }
                ]
            },
            {
                id: 'damage',
                question: "What chemical treatments have you had? (Select all that apply)",
                type: 'multiple',
                options: [
                    { value: 'none', text: 'None' },
                    { value: 'color', text: 'Hair coloring' },
                    { value: 'bleach', text: 'Bleaching' },
                    { value: 'perm', text: 'Perms or relaxers' },
                    { value: 'highlights', text: 'Highlights' }
                ]
            },
            {
                id: 'environment',
                question: "What's your environment like?",
                type: 'single',
                options: [
                    { value: 'humid', text: 'Humid climate' },
                    { value: 'dry', text: 'Dry climate' },
                    { value: 'moderate', text: 'Moderate climate' },
                    { value: 'variable', text: 'Changes with seasons' }
                ]
            },
            {
                id: 'goals',
                question: "What's your main hair goal?",
                type: 'single',
                options: [
                    { value: 'health', text: 'Healthier, stronger hair' },
                    { value: 'growth', text: 'Faster hair growth' },
                    { value: 'manageability', text: 'Easier to style and manage' },
                    { value: 'shine', text: 'More shine and softness' },
                    { value: 'volume', text: 'More volume and thickness' }
                ]
            }
        ];
    }

    start() {
        this.currentQuestion = 0;
        this.answers = {};
        this.renderQuestion();
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionDisplay = document.getElementById('question-display');
        const questionText = document.getElementById('question-text');
        const questionOptions = document.getElementById('question-options');
        const questionCounter = document.getElementById('question-counter');
        
        // Update question text and counter
        questionText.textContent = question.question;
        questionCounter.textContent = `${this.currentQuestion + 1} of ${this.questions.length}`;
        
        // Clear previous options
        questionOptions.innerHTML = '';
        
        // Apply question-specific CSS class
        questionDisplay.className = 'question-display';
        if (question.cssClass) {
            questionDisplay.classList.add(question.cssClass);
        }
        
        if (question.visual) {
            this.renderVisualOptions(question, questionOptions);
        } else {
            this.renderTextOptions(question, questionOptions);
        }
        
        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = ((this.currentQuestion + 1) / this.questions.length) * 100;
        progressFill.style.width = `${progressPercent}%`;
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) prevBtn.disabled = this.currentQuestion === 0;
        if (nextBtn) nextBtn.style.display = this.currentQuestion === this.questions.length - 1 ? 'none' : 'inline-block';
        
        console.log(`Question ${this.currentQuestion + 1}: ${question.question}`);
    }
    
    renderVisualOptions(question, container) {
        container.className = 'question-options visual-grid';
        
        question.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'visual-option';
            optionDiv.dataset.value = option.value;
            
            // Check if this option was previously selected
            if (this.answers[question.id] === option.value) {
                optionDiv.classList.add('selected');
            }
            
            // Individual option images or shared reference image
            const imageSrc = option.image || question.image;
            optionDiv.innerHTML = `
                <img src="${imageSrc}" alt="${option.text}" loading="lazy" class="option-image">
                <div class="option-text">${option.text}</div>
                <div class="option-description">${option.description || ''}</div>
            `;
            
            optionDiv.addEventListener('click', () => {
                this.selectOption(question.id, option.value, optionDiv);
            });
            
            container.appendChild(optionDiv);
        });
    }
    
    renderTextOptions(question, container) {
        container.className = 'question-options text-list';
        
        question.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'text-option';
            
            const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
            const inputName = question.id;
            
            // Check if this option was previously selected
            const isSelected = question.type === 'multiple' 
                ? (this.answers[question.id] || []).includes(option.value)
                : this.answers[question.id] === option.value;
            
            if (isSelected) {
                optionDiv.classList.add('selected');
            }
            
            optionDiv.innerHTML = `
                <input type="${inputType}" 
                       name="${inputName}" 
                       value="${option.value}" 
                       id="${question.id}_${option.value}"
                       ${isSelected ? 'checked' : ''}>
                <label for="${question.id}_${option.value}">${option.text}</label>
            `;
            
            optionDiv.addEventListener('click', () => {
                const input = optionDiv.querySelector('input');
                if (question.type === 'multiple') {
                    input.checked = !input.checked;
                    this.selectMultipleOption(question.id, option.value, input.checked);
                } else {
                    input.checked = true;
                    this.selectOption(question.id, option.value, optionDiv);
                }
            });
            
            container.appendChild(optionDiv);
        });
    }
    
    selectOption(questionId, value, optionElement) {
        // Clear any existing auto-advance timer
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
        }
        
        // Store the answer
        this.answers[questionId] = value;
        
        // Update visual selection
        const allOptions = optionElement.parentNode.querySelectorAll('.visual-option, .text-option');
        allOptions.forEach(opt => opt.classList.remove('selected'));
        optionElement.classList.add('selected');
        
        // Enable next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) nextBtn.disabled = false;
        
        // REMOVED: Auto-advance functionality for better user control
        // Users can now use Previous/Next buttons as needed
    }
    
    selectMultipleOption(questionId, value, isSelected) {
        if (!this.answers[questionId]) {
            this.answers[questionId] = [];
        }
        
        if (isSelected && !this.answers[questionId].includes(value)) {
            this.answers[questionId].push(value);
        } else if (!isSelected) {
            this.answers[questionId] = this.answers[questionId].filter(v => v !== value);
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        } else {
            this.submitQuiz();
        }
    }

    previousQuestion() {
        // Clear any auto-advance timer
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
        }
        
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
        }
    }

    submitQuiz() {
        console.log('🧬 Submitting quiz answers:', this.answers);
        
        // Show completion message
        document.getElementById('question-text').textContent = 
            "Analyzing your hair profile...";
        document.getElementById('question-options').innerHTML = 
            '<div style="text-align: center; padding: 2rem;"><div style="font-size: 3rem;">🧬</div><p>Processing your personalized recommendations...</p></div>';
        
        // Simulate processing time
        setTimeout(() => {
            alert('Quiz completed! (Results page coming soon)');
        }, 2000);
    }
}