/**
 * SIMPLIFIED RESULTS MANAGER
 * No authentication required - simple quiz → payment → email workflow
 * February 19, 2026
 */

class SimpleResultsManager {
    constructor() {
        this.results = null;
        this.isLoading = false;
        
        console.log('📊 Simple Results Manager initialized');
    }

    /**
     * Initialize the results page
     */
    async initialize() {
        try {
            this.showLoading();
            
            // Load results data from local storage or URL params
            await this.loadResults();
            
            // Setup purchase interaction
            this.setupPurchaseFlow();
            
            this.hideLoading();
            console.log('✅ Simple Results Manager ready');
            
        } catch (error) {
            console.error('❌ Results initialization failed:', error);
            this.showError(error);
        }
    }

    /**
     * Load results from URL parameters or localStorage
     */
    async loadResults() {
        console.log('📊 Loading hair analysis results (simplified)');
        
        // Try to get results from URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const quizData = urlParams.get('quiz_data');
        
        if (quizData) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(quizData));
                this.results = this.generateResultsFromQuizData(parsedData);
                console.log('✅ Results generated from URL parameters');
                this.displayResults();
                return;
            } catch (error) {
                console.warn('Failed to parse URL quiz data:', error);
            }
        }

        // Fallback to localStorage
        const localQuizData = localStorage.getItem('strandly_quiz_answers');
        if (localQuizData) {
            try {
                const parsedData = JSON.parse(localQuizData);
                this.results = this.generateResultsFromQuizData(parsedData);
                console.log('✅ Results generated from localStorage');
                this.displayResults();
                return;
            } catch (error) {
                console.warn('Failed to parse local quiz data:', error);
            }
        }

        // No data available
        throw new Error('No quiz results found. Please take the quiz first.');
    }

    /**
     * Generate results from quiz answers (simplified algorithm)
     */
    generateResultsFromQuizData(quizAnswers) {
        console.log('🧮 Generating results from quiz data');
        
        // Simple hair type classification
        const hairType = this.classifyHairType(quizAnswers);
        const porosity = this.classifyPorosity(quizAnswers);
        const scalpType = this.classifyScalpType(quizAnswers);
        const damageLevel = this.classifyDamageLevel(quizAnswers);
        
        return {
            hairType: {
                description: hairType.description,
                code: hairType.code
            },
            porosity: porosity.level,
            scalpType: scalpType,
            damageLevel: damageLevel,
            advice: this.generateAdvice(hairType, porosity, scalpType, damageLevel),
            washFrequency: this.recommendWashFrequency(quizAnswers),
            recommendedProducts: this.recommendProducts(hairType, porosity, damageLevel),
            confidence: 0.92, // Static confidence for simplicity
            createdAt: new Date().toISOString()
        };
    }

    /**
     * Classify hair type from quiz answers
     */
    classifyHairType(answers) {
        const texture = answers[1]; // Question 1: hair texture
        const thickness = answers[2]; // Question 2: hair thickness
        
        const classifications = {
            straight: { description: 'Straight hair - naturally lies flat', code: '1' },
            wavy: { description: 'Wavy hair - natural wave pattern', code: '2' },
            curly: { description: 'Curly hair - defined curl pattern', code: '3' },
            coily: { description: 'Coily/Kinky hair - tight curl pattern', code: '4' }
        };
        
        return classifications[texture] || classifications.straight;
    }

    /**
     * Classify porosity from quiz answers
     */
    classifyPorosity(answers) {
        const waterBehavior = answers[4]; // Question 4: water behavior
        const dryTime = answers[5]; // Question 5: drying time
        
        if (waterBehavior === 'repels_water' || dryTime === 'very_long') {
            return { level: 'low', description: 'Low porosity - cuticles tightly closed' };
        } else if (waterBehavior === 'absorbs_quickly' || dryTime === 'fast') {
            return { level: 'high', description: 'High porosity - absorbs moisture quickly' };
        } else {
            return { level: 'normal', description: 'Normal porosity - healthy moisture balance' };
        }
    }

    /**
     * Classify scalp type
     */
    classifyScalpType(answers) {
        const washFreq = answers[10]; // Question 10: washing frequency
        const concern = answers[6]; // Question 6: primary concern
        
        if (washFreq === 'daily' || concern === 'oiliness') {
            return 'oily';
        } else if (concern === 'dryness') {
            return 'dry';
        } else {
            return 'normal';
        }
    }

    /**
     * Classify damage level
     */
    classifyDamageLevel(answers) {
        const concern = answers[6]; // Question 6: primary concern
        const treatments = answers[9]; // Question 9: treatments
        const heatUse = answers[8]; // Question 8: heat styling
        
        let damageScore = 0;
        
        if (concern === 'damage' || concern === 'breakage') damageScore += 2;
        if (Array.isArray(treatments) && (treatments.includes('color') || treatments.includes('chemical'))) damageScore += 2;
        if (heatUse === 'daily') damageScore += 1;
        
        if (damageScore >= 4) return 'severe';
        if (damageScore >= 2) return 'moderate';
        if (damageScore >= 1) return 'mild';
        return 'minimal';
    }

    /**
     * Generate personalized advice
     */
    generateAdvice(hairType, porosity, scalpType, damageLevel) {
        let advice = `Based on your ${hairType.description.toLowerCase()} with ${porosity.level} porosity, here's your personalized care routine:\n\n`;
        
        // Porosity-specific advice
        if (porosity.level === 'low') {
            advice += "• Use lightweight, water-based products\n• Apply heat when conditioning to open cuticles\n• Avoid heavy oils and butters\n";
        } else if (porosity.level === 'high') {
            advice += "• Use protein treatments monthly\n• Apply leave-in conditioner to damp hair\n• Use heavier creams and oils to seal moisture\n";
        } else {
            advice += "• Maintain balance with regular conditioning\n• Use a mix of light and moderate weight products\n• Deep condition weekly\n";
        }
        
        // Damage-specific advice
        if (damageLevel === 'severe') {
            advice += "\n• Focus on intensive repair treatments\n• Minimize heat styling\n• Use protein treatments weekly\n";
        } else if (damageLevel !== 'minimal') {
            advice += "\n• Use protective products before styling\n• Regular trims every 6-8 weeks\n• Deep conditioning treatments\n";
        }
        
        return advice;
    }

    /**
     * Recommend wash frequency
     */
    recommendWashFrequency(answers) {
        const scalpType = answers[6];
        const hairType = answers[1];
        
        if (scalpType === 'oiliness') return 'Every day or every other day';
        if (hairType === 'coily') return 'Once or twice per week';
        return '2-3 times per week';
    }

    /**
     * Recommend products (simplified)
     */
    recommendProducts(hairType, porosity, damageLevel) {
        return {
            shampoo: [
                {
                    name: 'Gentle Cleansing Shampoo',
                    brand: 'Professional Grade',
                    description: `Ideal for your ${hairType.description.toLowerCase()} and ${porosity.level} porosity`,
                    price: 24.99,
                    currency: 'USD'
                }
            ],
            conditioner: [
                {
                    name: 'Moisture Balance Conditioner',
                    brand: 'Professional Grade',
                    description: 'Provides optimal hydration without weighing hair down',
                    price: 26.99,
                    currency: 'USD'
                }
            ],
            treatment: [
                {
                    name: damageLevel === 'severe' ? 'Intensive Repair Mask' : 'Weekly Deep Treatment',
                    brand: 'Professional Grade',
                    description: 'Targeted treatment for your specific hair needs',
                    price: 32.99,
                    currency: 'USD'
                }
            ]
        };
    }

    /**
     * Display the results on the page
     */
    displayResults() {
        console.log('🎨 Displaying results');
        
        // Update hair profile
        this.updateHairProfile();
        
        // Update personalized advice
        this.updatePersonalizedAdvice();
        
        // Update product recommendations
        this.updateProductRecommendations();
        
        // Update metadata
        this.updateMetadata();
        
        // Show the content
        this.showContent();
    }

    /**
     * Update hair profile section
     */
    updateHairProfile() {
        const results = this.results;
        
        // Hair Type
        const hairTypeEl = document.getElementById('hair-type-text');
        const hairCodeEl = document.getElementById('hair-type-code');
        if (hairTypeEl && results.hairType) {
            hairTypeEl.textContent = results.hairType.description;
            if (hairCodeEl) {
                hairCodeEl.textContent = results.hairType.code;
            }
        }

        // Porosity
        const porosityEl = document.getElementById('porosity-text');
        if (porosityEl && results.porosity) {
            porosityEl.textContent = this.getPorosityDescription(results.porosity);
        }

        // Scalp Type
        const scalpEl = document.getElementById('scalp-type-text');
        if (scalpEl && results.scalpType) {
            scalpEl.textContent = this.getScalpTypeDescription(results.scalpType);
        }

        // Damage Level
        const damageEl = document.getElementById('damage-level-text');
        if (damageEl && results.damageLevel) {
            damageEl.textContent = this.getDamageLevelDescription(results.damageLevel);
        }
    }

    /**
     * Update personalized advice section
     */
    updatePersonalizedAdvice() {
        const adviceEl = document.getElementById('personalized-advice-content');
        const washFreqEl = document.getElementById('wash-frequency');
        
        if (adviceEl && this.results.advice) {
            const adviceHtml = this.formatAdviceText(this.results.advice);
            adviceEl.innerHTML = adviceHtml;
        }

        if (washFreqEl && this.results.washFrequency) {
            washFreqEl.textContent = this.results.washFrequency;
        }
    }

    /**
     * Update product recommendations
     */
    updateProductRecommendations() {
        const products = this.results.recommendedProducts;
        if (!products) return;

        // Update each product category
        this.updateProductCategory('shampoo-products', products.shampoo);
        this.updateProductCategory('conditioner-products', products.conditioner);
        this.updateProductCategory('treatment-products', products.treatment);
    }

    /**
     * Update a specific product category
     */
    updateProductCategory(containerId, products) {
        const container = document.getElementById(containerId);
        if (!container || !products) return;

        const productHtml = products.map(product => `
            <div class="product-card">
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-brand">${product.brand}</p>
                    <p class="product-description">${product.description}</p>
                </div>
                <div class="product-meta">
                    <div class="product-price">${this.formatPrice(product.price, product.currency)}</div>
                    <button class="btn btn-outline btn-small" onclick="alert('Product recommendations will be included in your email results!')">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = productHtml;
    }

    /**
     * Setup purchase flow (simplified)
     */
    setupPurchaseFlow() {
        const purchaseBtn = document.querySelector('.purchase-analysis-btn');
        if (purchaseBtn) {
            purchaseBtn.addEventListener('click', () => {
                // Store quiz data for payment flow
                if (this.results) {
                    const quizId = 'simple_' + Date.now();
                    localStorage.setItem('strandly_quiz_id', quizId);
                    localStorage.setItem('strandly_quiz_results', JSON.stringify(this.results));
                }
                
                // Redirect to payment
                window.location.href = 'payment.html';
            });
        }
    }

    /**
     * Helper methods
     */
    getPorosityDescription(porosity) {
        const descriptions = {
            low: 'Low porosity - Hair cuticles are tightly closed',
            normal: 'Normal porosity - Healthy moisture balance',
            high: 'High porosity - Hair absorbs moisture quickly'
        };
        return descriptions[porosity] || 'Custom porosity profile';
    }

    getScalpTypeDescription(scalpType) {
        const descriptions = {
            oily: 'Oily scalp - Produces excess sebum',
            normal: 'Normal scalp - Well-balanced oil production',
            dry: 'Dry scalp - Needs extra moisture'
        };
        return descriptions[scalpType] || 'Normal scalp';
    }

    getDamageLevelDescription(damageLevel) {
        const descriptions = {
            minimal: 'Minimal damage - Hair is in great condition',
            mild: 'Mild damage - Some wear but generally healthy',
            moderate: 'Moderate damage - Needs targeted repair',
            severe: 'Severe damage - Requires intensive treatment'
        };
        return descriptions[damageLevel] || 'Custom damage assessment';
    }

    formatAdviceText(advice) {
        return advice.split('\n').map(paragraph => 
            paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
        ).join('');
    }

    formatPrice(price, currency = 'USD') {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        });
        return formatter.format(price);
    }

    updateMetadata() {
        // Confidence score
        const confidenceEl = document.getElementById('confidence-value');
        if (confidenceEl && this.results.confidence) {
            confidenceEl.textContent = `${Math.round(this.results.confidence * 100)}%`;
        }

        // Analysis date
        const dateEl = document.getElementById('analysis-date');
        if (dateEl) {
            dateEl.textContent = 'Today';
        }
    }

    /**
     * Loading and error state management
     */
    showLoading() {
        const loadingEl = document.getElementById('results-loading');
        const contentEl = document.getElementById('results-content');
        const errorEl = document.getElementById('results-error');
        
        if (loadingEl) loadingEl.classList.remove('hidden');
        if (contentEl) contentEl.classList.add('hidden');
        if (errorEl) errorEl.classList.add('hidden');
        
        this.isLoading = true;
    }

    hideLoading() {
        const loadingEl = document.getElementById('results-loading');
        if (loadingEl) loadingEl.classList.add('hidden');
        this.isLoading = false;
    }

    showContent() {
        const contentEl = document.getElementById('results-content');
        if (contentEl) contentEl.classList.remove('hidden');
    }

    showError(error) {
        const errorEl = document.getElementById('results-error');
        const loadingEl = document.getElementById('results-loading');
        const contentEl = document.getElementById('results-content');
        
        if (errorEl) {
            const errorTextEl = errorEl.querySelector('.error-text');
            if (errorTextEl) {
                errorTextEl.textContent = error.message || 'Please take the quiz first to see your results.';
            }
            errorEl.classList.remove('hidden');
        }
        
        if (loadingEl) loadingEl.classList.add('hidden');
        if (contentEl) contentEl.classList.add('hidden');
        
        this.isLoading = false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing Simple Results Manager');
    
    const resultsManager = new SimpleResultsManager();
    await resultsManager.initialize();
    
    // Make globally accessible
    window.resultsManager = resultsManager;
});