/**
 * STRANDLY PAYMENT INTEGRATION
 * Complete Stripe checkout integration for $29 hair analysis
 * February 18, 2026
 */

class StrandlyPaymentIntegration {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.isProcessing = false;
        this.quizId = null;
        
        console.log('💳 Payment Integration initialized');
    }

    /**
     * Initialize the payment system
     */
    async initialize() {
        try {
            // Get quiz ID from URL or localStorage
            this.quizId = this.getQuizId();
            if (!this.quizId) {
                throw new Error('No quiz ID found. Please complete the quiz first.');
            }

            // Initialize Stripe
            await this.initializeStripe();
            
            // Setup form handlers
            this.setupFormHandlers();
            
            console.log('✅ Payment system initialized successfully');
            return true;

        } catch (error) {
            console.error('❌ Payment initialization failed:', error);
            this.showError(error.message);
            return false;
        }
    }

    /**
     * Get quiz ID from URL parameters or localStorage
     */
    getQuizId() {
        // Try URL first
        const urlParams = new URLSearchParams(window.location.search);
        let quizId = urlParams.get('quiz_id');
        
        // Fallback to localStorage
        if (!quizId) {
            quizId = localStorage.getItem('strandly_quiz_id');
        }
        
        console.log('📋 Quiz ID:', quizId);
        return quizId;
    }

    /**
     * Initialize Stripe with Elements
     */
    async initializeStripe() {
        try {
            // Check if Stripe is loaded
            if (typeof Stripe === 'undefined') {
                throw new Error('Stripe.js failed to load. Please check your connection.');
            }

            // Get publishable key from config
            const publishableKey = window.StrandlyConfig?.STRIPE?.publishableKey;
            if (!publishableKey) {
                throw new Error('Stripe publishable key not configured');
            }

            // Initialize Stripe
            this.stripe = Stripe(publishableKey);
            
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
                        borderRadius: '8px',
                    }
                }
            });

            // Create and mount card element
            this.cardElement = this.elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#495057',
                        '::placeholder': {
                            color: '#6c757d',
                        },
                    },
                    invalid: {
                        color: '#dc3545',
                        iconColor: '#dc3545'
                    }
                }
            });

            // Mount the card element
            this.cardElement.mount('#card-element');

            // Handle real-time validation errors from the card Element
            this.cardElement.on('change', ({error}) => {
                const displayError = document.getElementById('card-errors');
                if (error) {
                    displayError.textContent = error.message;
                    displayError.style.display = 'block';
                } else {
                    displayError.textContent = '';
                    displayError.style.display = 'none';
                }
            });

            // Handle focus/blur for styling
            this.cardElement.on('focus', () => {
                document.getElementById('card-element').classList.add('focused');
            });

            this.cardElement.on('blur', () => {
                document.getElementById('card-element').classList.remove('focused');
            });

            console.log('✅ Stripe Elements initialized');

        } catch (error) {
            console.error('❌ Stripe initialization error:', error);
            throw error;
        }
    }

    /**
     * Setup form event handlers
     */
    setupFormHandlers() {
        const form = document.getElementById('payment-form');
        const submitButton = document.getElementById('submit-payment');

        if (!form || !submitButton) {
            throw new Error('Payment form elements not found');
        }

        // Handle form submission
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handlePaymentSubmission();
        });

        console.log('📝 Form handlers setup complete');
    }

    /**
     * Handle payment submission
     */
    async handlePaymentSubmission() {
        if (this.isProcessing) {
            console.log('Payment already processing...');
            return;
        }

        this.isProcessing = true;
        this.updateButtonState(true);

        try {
            console.log('💳 Starting payment process...');

            // Method 1: Try Payment Intent first (more control)
            try {
                await this.processPaymentIntent();
                return;
            } catch (intentError) {
                console.log('Payment Intent failed, trying Checkout Session...', intentError.message);
                
                // Method 2: Fallback to Checkout Session
                await this.processCheckoutSession();
            }

        } catch (error) {
            console.error('❌ Payment processing failed:', error);
            this.showError('Payment failed: ' + error.message);
        } finally {
            this.isProcessing = false;
            this.updateButtonState(false);
        }
    }

    /**
     * Process payment using Payment Intent
     */
    async processPaymentIntent() {
        // Create payment intent
        const response = await fetch(`${window.StrandlyConfig.getApiUrl()}/api/payment/create-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quizId: this.quizId,
                amount: 2900, // $29.00
                currency: 'usd'
            }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const { clientSecret } = await response.json();

        // Confirm payment with Stripe
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: this.cardElement,
            }
        });

        if (error) {
            throw error;
        }

        if (paymentIntent.status === 'succeeded') {
            console.log('✅ Payment succeeded via Payment Intent');
            this.handlePaymentSuccess(paymentIntent.id);
        } else {
            throw new Error('Payment not completed');
        }
    }

    /**
     * Process payment using Checkout Session (fallback)
     */
    async processCheckoutSession() {
        console.log('🔄 Creating checkout session...');

        const response = await fetch(`${window.StrandlyConfig.getApiUrl()}/api/payment/create-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quizId: this.quizId
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || `Server error: ${response.status}`);
        }

        const { sessionId, url } = await response.json();

        if (url) {
            console.log('🔄 Redirecting to Stripe Checkout...');
            window.location.href = url;
        } else if (sessionId) {
            // Use sessionId with redirectToCheckout
            const { error } = await this.stripe.redirectToCheckout({
                sessionId: sessionId
            });

            if (error) {
                throw error;
            }
        } else {
            throw new Error('No payment URL or session ID received');
        }
    }

    /**
     * Handle successful payment
     */
    handlePaymentSuccess(paymentId) {
        console.log('🎉 Payment successful!', paymentId);
        
        // Show success message
        this.showSuccess('Payment successful! Redirecting...');
        
        // Redirect to success page after a short delay
        setTimeout(() => {
            window.location.href = `success.html?payment_id=${paymentId}&quiz_id=${this.quizId}`;
        }, 2000);
    }

    /**
     * Update button state during processing
     */
    updateButtonState(isProcessing) {
        const button = document.getElementById('submit-payment');
        const buttonText = button.querySelector('.button-text');
        const spinner = button.querySelector('.loading-spinner');

        if (isProcessing) {
            button.disabled = true;
            buttonText.textContent = 'Processing...';
            spinner.style.display = 'inline-block';
        } else {
            button.disabled = false;
            buttonText.textContent = 'Complete Payment - $29';
            spinner.style.display = 'none';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.getElementById('card-errors');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Also show alert for critical errors
        if (message.includes('quiz') || message.includes('configuration')) {
            alert('Error: ' + message);
        }
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; max-width: 400px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                    <h2 style="margin: 0 0 1rem 0; color: #28a745;">Payment Successful!</h2>
                    <p style="margin: 0; color: #6c757d;">${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing payment integration...');
    
    // Wait for config to be loaded
    const waitForConfig = () => {
        return new Promise((resolve) => {
            if (window.StrandlyConfig) {
                resolve();
            } else {
                setTimeout(() => waitForConfig().then(resolve), 100);
            }
        });
    };

    await waitForConfig();

    // Initialize payment integration
    const paymentIntegration = new StrandlyPaymentIntegration();
    const initialized = await paymentIntegration.initialize();

    if (initialized) {
        console.log('✅ Payment integration ready');
        window.strandlyPayment = paymentIntegration;
    } else {
        console.error('❌ Failed to initialize payment integration');
    }
});