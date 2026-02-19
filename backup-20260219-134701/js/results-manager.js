/**
 * STRANDLY RESULTS MANAGER
 * Handle display of hair analysis results and product recommendations
 * February 17, 2026
 */

class StrandlyResultsManager {
    constructor() {
        this.apiService = new StrandlyApiService();
        this.results = null;
        this.isLoading = false;
        
        console.log('📊 Results Manager initialized');
    }

    /**
     * Initialize the results page
     */
    async initialize() {
        try {
            this.showLoading();
            
            // Load results data
            await this.loadResults();
            
            // Setup interactive elements
            this.setupInteractions();
            
            this.hideLoading();
            console.log('✅ Results Manager ready');
            
        } catch (error) {
            console.error('❌ Results initialization failed:', error);
            this.showError(error);
        }
    }

    /**
     * Load results from API or localStorage
     */
    async loadResults() {
        console.log('📊 Loading hair analysis results');
        
        try {
            // Try to get results from various sources
            this.results = await this.getResultsFromBestSource();
            
            if (!this.results) {
                throw new Error('No quiz results found. Please take the quiz first.');
            }
            
            console.log('✅ Results loaded:', this.results);
            
            // Display the results
            this.displayResults();
            
        } catch (error) {
            console.error('Failed to load results:', error);
            throw error;
        }
    }

    /**
     * Get results from the best available source
     */
    async getResultsFromBestSource() {
        // Source 1: Recent localStorage results
        const localResults = this.getLocalResults();
        if (localResults) {
            console.log('📂 Using results from localStorage');
            return localResults;
        }

        // Source 2: API for authenticated users
        if (this.apiService.isAuthenticated()) {
            try {
                const user = this.apiService.getCurrentUser();
                const apiResponse = await this.apiService.getQuizResult(user.id);
                console.log('🌐 Using results from API');
                return apiResponse.results;
            } catch (error) {
                console.warn('Failed to load from API:', error);
            }
        }

        // Source 3: Pending results after signup
        const pendingResults = localStorage.getItem('strandly_pending_results');
        if (pendingResults) {
            try {
                const parsed = JSON.parse(pendingResults);
                console.log('⏳ Using pending results');
                localStorage.removeItem('strandly_pending_results');
                return parsed.results || parsed;
            } catch (error) {
                console.warn('Failed to parse pending results:', error);
            }
        }

        return null;
    }

    /**
     * Get results from localStorage
     */
    getLocalResults() {
        const stored = localStorage.getItem('strandly_quiz_results');
        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored);
            
            // Check if results are not too old (7 days)
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
            const resultDate = new Date(parsed.results?.createdAt || parsed.createdAt);
            
            if (Date.now() - resultDate.getTime() > maxAge) {
                console.log('🕒 Local results are too old, clearing');
                localStorage.removeItem('strandly_quiz_results');
                return null;
            }

            return parsed.results || parsed;
        } catch (error) {
            console.error('Error parsing local results:', error);
            return null;
        }
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
            hairTypeEl.textContent = results.hairType.description || 'Your unique hair type';
            if (hairCodeEl) {
                hairCodeEl.textContent = results.hairType.code || '';
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
            // Convert advice to HTML
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

        if (products.length === 0) {
            container.innerHTML = '<p class="no-products">No specific recommendations available</p>';
            return;
        }

        const productHtml = products.map(product => `
            <div class="product-card">
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-brand">${product.brand || 'Professional Brand'}</p>
                    <p class="product-description">${product.description || 'Perfect for your hair type'}</p>
                    ${product.benefits ? `<div class="product-benefits">${product.benefits}</div>` : ''}
                </div>
                <div class="product-meta">
                    <div class="product-price">${this.formatPrice(product.price, product.currency)}</div>
                    ${product.rating ? `
                        <div class="product-rating">
                            <span class="stars">${this.renderStars(product.rating)}</span>
                            <span class="rating-count">(${product.review_count || 0})</span>
                        </div>
                    ` : ''}
                    <button class="btn btn-outline btn-small product-learn-more" data-product="${product.id}">
                        Learn More
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = productHtml;
    }

    /**
     * Update page metadata
     */
    updateMetadata() {
        // Confidence score
        const confidenceEl = document.getElementById('confidence-value');
        if (confidenceEl && this.results.confidence) {
            confidenceEl.textContent = `${Math.round(this.results.confidence * 100)}%`;
        }

        // Analysis date
        const dateEl = document.getElementById('analysis-date');
        if (dateEl && this.results.createdAt) {
            const date = new Date(this.results.createdAt);
            dateEl.textContent = date.toLocaleDateString();
        }
    }

    /**
     * Setup interactive elements
     */
    setupInteractions() {
        // Product "Learn More" buttons
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('product-learn-more')) {
                const productId = event.target.dataset.product;
                this.showProductDetails(productId);
            }
        });

        // Share button
        const shareBtn = document.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', this.handleShare.bind(this));
        }
    }

    /**
     * Show product details modal
     */
    showProductDetails(productId) {
        console.log('📦 Showing product details for:', productId);
        // This would typically open a modal with detailed product information
        alert('Product details would be shown here');
    }

    /**
     * Handle share functionality
     */
    async handleShare() {
        const shareData = {
            title: 'My Hair Analysis Results - Strandly',
            text: 'I just got my personalized hair analysis from Strandly!',
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareData.url);
                alert('Results link copied to clipboard!');
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    }

    /**
     * Helper methods for formatting
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
            dry: 'Dry scalp - Needs extra moisture',
            sensitive: 'Sensitive scalp - Requires gentle care'
        };
        return descriptions[scalpType] || 'Custom scalp profile';
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
        if (!advice) return 'Custom advice based on your hair profile.';
        
        // Convert line breaks to paragraphs
        return advice.split('\n').map(paragraph => 
            paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
        ).join('');
    }

    formatPrice(price, currency = 'USD') {
        if (!price) return 'Price available in store';
        
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase()
        });
        
        // Convert cents to dollars if needed
        const amount = price > 100 ? price / 100 : price;
        return formatter.format(amount);
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
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
                errorTextEl.textContent = error.message || 'An error occurred while loading your results.';
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
    console.log('🚀 Initializing Results Manager');
    
    const resultsManager = new StrandlyResultsManager();
    await resultsManager.initialize();
    
    // Make globally accessible
    window.resultsManager = resultsManager;
});