/**
 * STRANDLY PAYMENT HANDLER
 * Stripe Elements Integration for Frontend Payment Processing
 * February 18, 2026
 */

class StrandlyPaymentHandler {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.clientSecret = null;
        this.quizId = null;
        this.isProcessing = false;
        
        console.log('💳 Payment handler initialized');
    }

    /**
     * Initialize Stripe and payment form
     */
    async initialize() {
        try {
            // Get quiz ID from storage or URL
            this.quizId = this.getQuizId();
            if (!this.quizId) {
                throw new Error('No quiz ID found. Please complete the quiz first.');
            }

            console.log('🆔 Quiz ID:', this.quizId);

            // Initialize Stripe with config
            if (!window.StrandlyConfig || !window.StrandlyConfig.stripe.publishableKey) {
                throw new Error('Stripe configuration not found');
            }
            
            this.stripe = Stripe(window.StrandlyConfig.stripe.publishableKey);
            
            // Create Payment Intent on backend
            await this.createPaymentIntent();

            // Setup Stripe Elements
            this.setupStripeElements();

            // Bind form events
            this.bindEvents();

            console.log('✅ Payment form ready');

        } catch (error) {
            console.error('❌ Payment initialization failed:', error);
            this.showError('Failed to initialize payment form. Please try again.');
        }
    }

    /**
     * Get quiz ID from various sources
     */
    getQuizId() {
        // Check URL params first
        const urlParams = new URLSearchParams(window.location.search);
        let quizId = urlParams.get('quiz_id');
        
        // Fallback to localStorage
        if (!quizId) {
            quizId = localStorage.getItem('strandly_quiz_id');
        }
        
        // Fallback to sessionStorage
        if (!quizId) {
            quizId = sessionStorage.getItem('strandly_quiz_id');
        }

        return quizId;
    }

    /**
     * Create Payment Intent on backend
     */
    async createPaymentIntent() {
        try {
            console.log('🔄 Creating payment intent...');
            
            const response = await window.StrandlyApi.apiRequest('/api/payment/create-intent', {
                method: 'POST',
                body: JSON.stringify({
                    quizId: this.quizId,
                    amount: 2900, // €29.00 in cents
                    currency: 'eur'
                })
            });

            this.clientSecret = response.clientSecret;
            console.log('✅ Payment intent created');

        } catch (error) {
            console.error('❌ Failed to create payment intent:', error);
            throw new Error('Unable to prepare payment. Please try again.');
        }
    }

    /**
     * Setup Stripe Elements
     */
    setupStripeElements() {
        // Create Elements instance
        this.elements = this.stripe.elements({
            appearance: {
                theme: 'stripe',
                variables: {
                    colorPrimary: '#667eea',
                    colorBackground: '#ffffff',
                    colorText: '#495057',
                    colorDanger: '#dc3545',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px'
                },
                rules: {
                    '.Input': {
                        padding: '12px',
                        fontSize: '16px'
                    }
                }
            }
        });

        // Create card element
        this.cardElement = this.elements.create('payment', {
            layout: 'tabs'
        });

        // Mount card element
        this.cardElement.mount('#card-element');

        // Handle real-time validation errors from the card Element
        this.cardElement.on('change', (event) => {
            const cardErrors = document.getElementById('card-errors');
            const cardElementDiv = document.getElementById('card-element');
            
            if (event.error) {
                cardErrors.textContent = event.error.message;
                cardErrors.style.display = 'block';
                cardElementDiv.classList.add('invalid');
            } else {
                cardErrors.style.display = 'none';
                cardElementDiv.classList.remove('invalid');
            }

            // Update element styling based on focus
            if (event.focus) {
                cardElementDiv.classList.add('focused');
            } else {
                cardElementDiv.classList.remove('focused');
            }
        });
    }

    /**
     * Bind form events
     */
    bindEvents() {
        const form = document.getElementById('payment-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }

    /**
     * Handle form submission
     */
    async handleSubmit() {
        if (this.isProcessing) {
            console.log('Already processing payment...');
            return;
        }

        console.log('💳 Processing payment...');
        this.setProcessingState(true);

        try {
            // Confirm the payment with Stripe
            const { error, paymentIntent } = await this.stripe.confirmPayment({
                elements: this.elements,
                confirmParams: {
                    return_url: `${window.location.origin}/success.html?quiz_id=${this.quizId}`,
                },
                redirect: 'if_required'
            });

            if (error) {
                // Payment failed
                console.error('❌ Payment failed:', error);
                this.showError(error.message);
                this.setProcessingState(false);
            } else if (paymentIntent.status === 'succeeded') {
                // Payment succeeded
                console.log('✅ Payment succeeded!');
                this.handlePaymentSuccess(paymentIntent);
            } else {
                // Payment requires additional action
                console.log('⚠️ Payment requires additional action:', paymentIntent.status);
                this.setProcessingState(false);
            }

        } catch (error) {
            console.error('❌ Payment processing error:', error);
            this.showError('An unexpected error occurred. Please try again.');
            this.setProcessingState(false);
        }
    }

    /**
     * Handle successful payment
     */
    handlePaymentSuccess(paymentIntent) {
        console.log('🎉 Payment successful, redirecting...');
        
        // Store payment info for success page
        sessionStorage.setItem('payment_intent_id', paymentIntent.id);
        sessionStorage.setItem('payment_amount', '29.00');
        
        // Clear quiz data since it's complete
        localStorage.removeItem('strandly_quiz_progress');
        
        // Redirect to success page
        window.location.href = `success.html?quiz_id=${this.quizId}&payment_intent=${paymentIntent.id}`;
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.getElementById('card-errors');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 8000);
    }

    /**
     * Set processing state
     */
    setProcessingState(processing) {
        this.isProcessing = processing;
        
        const submitButton = document.getElementById('submit-payment');
        const buttonText = submitButton.querySelector('.button-text');
        const loadingSpinner = submitButton.querySelector('.loading-spinner');
        const loadingOverlay = document.getElementById('loading-overlay');
        
        if (processing) {
            submitButton.disabled = true;
            buttonText.textContent = 'Processing...';
            loadingSpinner.style.display = 'block';
            loadingOverlay.style.display = 'flex';
        } else {
            submitButton.disabled = false;
            buttonText.textContent = 'Complete Payment - €29';
            loadingSpinner.style.display = 'none';
            loadingOverlay.style.display = 'none';
        }
    }

    /**
     * Retry payment initialization
     */
    async retry() {
        console.log('🔄 Retrying payment initialization...');
        await this.initialize();
    }
}

// Error handling for missing Stripe
if (typeof Stripe === 'undefined') {
    console.error('❌ Stripe.js not loaded. Please check your internet connection.');
    document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 2rem;">
            <div>
                <h2>Unable to load payment system</h2>
                <p>Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Retry
                </button>
            </div>
        </div>
    `;
} else {
    // Initialize payment handler when DOM is ready
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('🚀 DOM loaded, initializing payment handler...');
        
        // Wait for API service
        const initPayment = async () => {
            if (window.StrandlyApi) {
                try {
                    const paymentHandler = new StrandlyPaymentHandler();
                    await paymentHandler.initialize();
                    
                    // Make globally accessible for debugging
                    window.paymentHandler = paymentHandler;
                    
                } catch (error) {
                    console.error('❌ Payment handler initialization failed:', error);
                    
                    // Show user-friendly error
                    document.body.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 2rem;">
                            <div style="max-width: 400px;">
                                <h2>Payment Initialization Failed</h2>
                                <p>${error.message || 'Unable to initialize payment form. Please try again.'}</p>
                                <div style="margin-top: 2rem;">
                                    <button onclick="window.location.href='quiz.html'" style="padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 1rem;">
                                        Back to Quiz
                                    </button>
                                    <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }
            } else {
                console.log('⏳ Waiting for API service...');
                setTimeout(initPayment, 100);
            }
        };
        
        await initPayment();
    });
}