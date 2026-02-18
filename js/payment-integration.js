/**
 * STRANDLY PAYMENT INTEGRATION
 * Stripe integration for hair analysis purchases
 * February 17, 2026
 */

class StrandlyPaymentManager {
    constructor() {
        this.apiService = new StrandlyApiService();
        this.stripe = null;
        this.isProcessing = false;
        
        console.log('💳 Payment Manager initialized');
    }

    /**
     * Initialize Stripe and payment forms
     */
    async initialize() {
        try {
            // Initialize Stripe (will be loaded from external script)
            await this.initializeStripe();
            
            // Setup payment buttons
            this.setupPaymentButtons();
            
            // Setup pricing display
            this.updatePricingDisplay();
            
            console.log('✅ Payment Manager ready');
            return true;
        } catch (error) {
            console.error('❌ Payment Manager initialization failed:', error);
            return false;
        }
    }

    /**
     * Initialize Stripe instance
     */
    async initializeStripe() {
        // Wait for Stripe to be loaded
        let attempts = 0;
        while (typeof Stripe === 'undefined' && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (typeof Stripe === 'undefined') {
            throw new Error('Stripe library not loaded');
        }

        // Initialize with publishable key (environment-specific)
        const publishableKey = this.getStripePublishableKey();
        this.stripe = Stripe(publishableKey);
        
        console.log('🔗 Stripe initialized');
    }

    /**
     * Get Stripe publishable key based on environment
     */
    getStripePublishableKey() {
        // Production key for live domain
        if (window.location.hostname.includes('strandly') && !window.location.hostname.includes('netlify')) {
            return 'pk_live_YOUR_LIVE_KEY_HERE'; // Replace with actual live key
        }
        
        // Test key for development/staging
        return 'pk_test_51234567890abcdef'; // Replace with actual test key
    }

    /**
     * Setup payment buttons
     */
    setupPaymentButtons() {
        // Purchase analysis buttons
        const purchaseButtons = document.querySelectorAll('.purchase-analysis-btn, [data-action="purchase"]');
        purchaseButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.handlePurchaseClick(button);
            });
        });

        // Upgrade subscription buttons
        const upgradeButtons = document.querySelectorAll('.upgrade-plan-btn, [data-action="upgrade"]');
        upgradeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.handleUpgradeClick(button);
            });
        });
    }

    /**
     * Update pricing display
     */
    updatePricingDisplay() {
        const pricing = this.getPricingInfo();
        
        // Update price elements
        const priceElements = document.querySelectorAll('.analysis-price');
        priceElements.forEach(el => {
            el.textContent = pricing.analysis.display;
        });

        // Update subscription prices
        const subscriptionElements = document.querySelectorAll('.subscription-price');
        subscriptionElements.forEach(el => {
            const plan = el.dataset.plan || 'monthly';
            el.textContent = pricing.subscription[plan]?.display || '$9.99/month';
        });
    }

    /**
     * Get pricing information
     */
    getPricingInfo() {
        return {
            analysis: {
                amount: 2900, // €29.00 in cents
                currency: 'eur',
                display: '€29.00'
            },
            subscription: {
                monthly: {
                    amount: 999, // $9.99 in cents
                    currency: 'usd',
                    display: '$9.99/month'
                },
                annual: {
                    amount: 9999, // $99.99 in cents (save 17%)
                    currency: 'usd',
                    display: '$99.99/year'
                }
            }
        };
    }

    /**
     * Handle purchase analysis button click
     */
    async handlePurchaseClick(button) {
        if (this.isProcessing) return;

        console.log('💳 Processing analysis purchase');
        this.isProcessing = true;

        try {
            // Show loading state
            this.setButtonLoading(button, true);

            // Get quiz results (either from localStorage or API)
            const quizResults = await this.getQuizResults();
            if (!quizResults) {
                throw new Error('No quiz results found. Please take the quiz first.');
            }

            // Create checkout session
            const checkoutSession = await this.createCheckoutSession({
                type: 'analysis',
                quizResultId: quizResults.id,
                successUrl: window.location.origin + '/analysis-complete.html',
                cancelUrl: window.location.href
            });

            // Redirect to Stripe Checkout
            const { error } = await this.stripe.redirectToCheckout({
                sessionId: checkoutSession.id
            });

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('❌ Purchase failed:', error);
            this.handlePaymentError(error);
        } finally {
            this.isProcessing = false;
            this.setButtonLoading(button, false);
        }
    }

    /**
     * Handle upgrade subscription button click
     */
    async handleUpgradeClick(button) {
        if (this.isProcessing) return;

        console.log('📈 Processing subscription upgrade');
        this.isProcessing = true;

        try {
            // Show loading state
            this.setButtonLoading(button, true);

            // Check authentication
            if (!this.apiService.isAuthenticated()) {
                throw new Error('Please log in to upgrade your subscription');
            }

            const plan = button.dataset.plan || 'monthly';

            // Create subscription checkout session
            const checkoutSession = await this.createCheckoutSession({
                type: 'subscription',
                plan: plan,
                successUrl: window.location.origin + '/subscription-complete.html',
                cancelUrl: window.location.href
            });

            // Redirect to Stripe Checkout
            const { error } = await this.stripe.redirectToCheckout({
                sessionId: checkoutSession.id
            });

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('❌ Subscription upgrade failed:', error);
            this.handlePaymentError(error);
        } finally {
            this.isProcessing = false;
            this.setButtonLoading(button, false);
        }
    }

    /**
     * Create Stripe checkout session via API
     */
    async createCheckoutSession(options) {
        try {
            console.log('🔗 Creating Stripe checkout session:', options);

            // This would call your backend API
            const response = await this.apiService.apiRequest('/payments/create-checkout-session', {
                method: 'POST',
                body: JSON.stringify(options)
            });

            return response.checkoutSession;

        } catch (error) {
            console.error('Failed to create checkout session:', error);
            throw new Error('Failed to initialize payment. Please try again.');
        }
    }

    /**
     * Get quiz results from localStorage or API
     */
    async getQuizResults() {
        // First try localStorage (for recent quiz)
        const localResults = localStorage.getItem('strandly_quiz_results');
        if (localResults) {
            try {
                return JSON.parse(localResults);
            } catch (error) {
                console.warn('Failed to parse local quiz results');
            }
        }

        // If authenticated, try to get from API
        if (this.apiService.isAuthenticated()) {
            try {
                const user = this.apiService.getCurrentUser();
                const response = await this.apiService.getQuizResult(user.id);
                return response.results;
            } catch (error) {
                console.warn('Failed to fetch quiz results from API:', error);
            }
        }

        return null;
    }

    /**
     * Handle payment processing success
     */
    handlePaymentSuccess(sessionId) {
        console.log('🎉 Payment successful:', sessionId);

        // Clear any temporary data
        localStorage.removeItem('strandly_pending_payment');

        // Show success message
        this.showSuccessMessage('Payment successful! Redirecting to your results...');

        // The success URL will handle the actual redirect
    }

    /**
     * Handle payment errors
     */
    handlePaymentError(error) {
        let errorMessage = 'Payment failed. Please try again.';
        
        if (error.message.includes('quiz results')) {
            errorMessage = 'Please complete the hair quiz before purchasing your analysis.';
        } else if (error.message.includes('log in')) {
            errorMessage = 'Please log in to continue with your purchase.';
        } else if (error.type === 'card_error') {
            errorMessage = `Payment failed: ${error.message}`;
        } else if (error.type === 'validation_error') {
            errorMessage = error.message;
        }

        this.showErrorMessage(errorMessage);
    }

    /**
     * Set button loading state
     */
    setButtonLoading(button, isLoading) {
        button.disabled = isLoading;
        
        if (isLoading) {
            button.dataset.originalText = button.textContent;
            button.innerHTML = '<span class="spinner"></span> Processing...';
            button.classList.add('loading');
        } else {
            button.textContent = button.dataset.originalText || 'Purchase Analysis';
            button.classList.remove('loading');
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        // Create or get message element
        let messageEl = document.getElementById('payment-message');
        
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'payment-message';
            messageEl.className = 'payment-message';
            document.body.appendChild(messageEl);
        }

        messageEl.textContent = message;
        messageEl.className = `payment-message ${type} show`;

        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageEl.classList.remove('show');
            }, 5000);
        }
    }

    /**
     * Process successful payment from redirect
     */
    async processPaymentSuccess() {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (!sessionId) return false;

        try {
            console.log('✅ Processing payment success callback');

            // Verify payment with backend
            const response = await this.apiService.apiRequest('/payments/verify-session', {
                method: 'POST',
                body: JSON.stringify({ sessionId })
            });

            if (response.status === 'complete') {
                this.handlePaymentSuccess(sessionId);
                return true;
            } else {
                throw new Error('Payment verification failed');
            }

        } catch (error) {
            console.error('❌ Payment verification failed:', error);
            this.handlePaymentError(error);
            return false;
        }
    }

    /**
     * Initialize payment success handling for success pages
     */
    initializeSuccessPage() {
        // Auto-process payment success if we're on a success page
        if (window.location.pathname.includes('complete.html')) {
            this.processPaymentSuccess();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing Payment Manager');
    
    const paymentManager = new StrandlyPaymentManager();
    await paymentManager.initialize();
    
    // Initialize success page handling
    paymentManager.initializeSuccessPage();
    
    // Make globally accessible
    window.strandlyPayments = paymentManager;
});