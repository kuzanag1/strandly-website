// Strandly - Hair Analysis Platform JavaScript

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧬 Strandly initialized');
    
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Initialize any animations or interactions
    setupAnimations();
});

// Start the hair analysis quiz
function startQuiz() {
    console.log('🚀 Starting hair analysis quiz');
    
    // For now, redirect to quiz page
    // Later this will be enhanced with dynamic loading
    window.location.href = 'quiz.html';
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup entrance animations and interactions
function setupAnimations() {
    // Animate value cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.value-card, .step, .testimonial');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Hair Analysis Quiz Logic
class StrandlyQuiz {
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
            // Porosity test - simplified for users
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
        // Store the answer
        this.answers[questionId] = value;
        
        // Update visual selection
        const allOptions = optionElement.parentNode.querySelectorAll('.visual-option, .text-option');
        allOptions.forEach(opt => opt.classList.remove('selected'));
        optionElement.classList.add('selected');
        
        // Auto-advance after short delay for better UX
        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.nextQuestion();
            }
        }, 600);
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
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
        }
    }

    submitQuiz() {
        console.log('🧬 Submitting quiz answers:', this.answers);
        
        // Generate hair profile based on answers
        const profile = this.generateHairProfile();
        
        // Redirect to results page with profile
        localStorage.setItem('hairProfile', JSON.stringify(profile));
        window.location.href = 'results.html';
    }

    generateHairProfile() {
        const answers = this.answers;
        
        // Basic hair profile generation
        // This will be enhanced with the Hair Specialist's algorithm
        const profile = {
            type: this.determineHairType(answers),
            porosity: this.determinePorosity(answers),
            concerns: answers.concern || 'general',
            recommendations: this.generateRecommendations(answers),
            routine: this.generateRoutine(answers)
        };

        return profile;
    }

    determineHairType(answers) {
        // Combine texture, thickness, and other factors
        const texture = answers.texture || 'unknown';
        const thickness = answers.thickness || 'unknown';
        
        return `${texture}-${thickness}`;
    }

    determinePorosity(answers) {
        const porosityTest = answers.porosity;
        
        switch(porosityTest) {
            case 'floats':
                return 'low';
            case 'slow_sink':
                return 'normal';
            case 'fast_sink':
                return 'high';
            default:
                return 'normal';
        }
    }

    generateRecommendations(answers) {
        // This will be enhanced with the Hair Specialist's scientific recommendations
        const recommendations = [];
        
        if (answers.concern === 'dryness') {
            recommendations.push('Deep conditioning treatment');
            recommendations.push('Leave-in conditioner');
        }
        
        if (answers.porosity === 'high') {
            recommendations.push('Protein treatments');
            recommendations.push('Sealing oils');
        }
        
        return recommendations;
    }

    generateRoutine(answers) {
        // Basic routine generation
        return {
            morning: [
                'Apply leave-in conditioner',
                'Use heat protectant if styling'
            ],
            evening: [
                'Gentle brushing',
                'Apply hair oil to ends'
            ],
            weekly: [
                'Deep conditioning mask',
                'Scalp massage'
            ]
        };
    }
}

// Global quiz instance
let strandlyQuiz = new StrandlyQuiz();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StrandlyQuiz, startQuiz };
}