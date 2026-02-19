/**
 * STRANDLY PAYMENT HANDLER
 * Handles payment processing for $29 hair analysis
 * February 18, 2026
 */

class StrandlyPaymentHandler {
    constructor() {
        this.isProcessing = false;
        this.stripe = null;
        this.apiUrl = window.StrandlyConfig?.getApiUrl() || 'http://localhost:5003';
        
        console.log('💳 Payment Handler initialized with API:', this.apiUrl);
    }

    /**
     * Initialize Stripe
     */
    async initializeStripe() {
        try {
            if (typeof Stripe === 'undefined') {
                throw new Error('Stripe not loaded');
            }
            
            const publishableKey = window.StrandlyConfig?.STRIPE?.publishableKey;
            if (!publishableKey) {
                throw new Error('Stripe publishable key not configured');
            }
            
            this.stripe = Stripe(publishableKey);
            console.log('✅ Stripe initialized');
            return true;
        } catch (error) {
            console.error('❌ Stripe initialization failed:', error);
            return false;
        }
    }

    /**
     * Submit quiz and get quiz ID
     */
    async submitQuiz(quizData) {
        try {
            console.log('📝 Submitting quiz data...');
            
            const response = await fetch(`${this.apiUrl}/api/quiz/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quizData)
            });
            
            if (!response.ok) {
                throw new Error(`Quiz submission failed: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('✅ Quiz submitted:', result.quizId);
            
            return result.quizId;
        } catch (error) {
            console.error('❌ Quiz submission error:', error);
            throw error;
        }
    }

    /**
     * Create payment checkout session
     */
    async createPaymentSession(quizId) {
        try {
            console.log('💳 Creating payment session for quiz:', quizId);
            
            const response = await fetch(`${this.apiUrl}/api/payment/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quizId })
            });
            
            if (!response.ok) {
                throw new Error(`Payment session creation failed: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('✅ Payment session created:', result.sessionId);
            
            return result;
        } catch (error) {
            console.error('❌ Payment session creation error:', error);
            throw error;
        }
    }

    /**
     * Process payment for quiz completion
     */
    async processPayment(quizData) {
        if (this.isProcessing) {
            throw new Error('Payment already in progress');
        }

        this.isProcessing = true;

        try {
            // Step 1: Submit quiz data
            const quizId = await this.submitQuiz(quizData);
            
            // Step 2: Create payment session
            const paymentSession = await this.createPaymentSession(quizId);
            
            // Step 3: Handle payment based on mode
            if (paymentSession.mock) {
                // Mock payment - redirect to success page
                console.log('🧪 Mock payment detected - redirecting to success page');
                window.location.href = paymentSession.url;
                return { success: true, mock: true, sessionId: paymentSession.sessionId };
            } else {
                // Real Stripe payment - redirect to checkout
                if (!this.stripe) {
                    await this.initializeStripe();
                }
                
                console.log('💳 Redirecting to Stripe Checkout...');
                const { error } = await this.stripe.redirectToCheckout({
                    sessionId: paymentSession.sessionId
                });
                
                if (error) {
                    throw error;
                }
                
                return { success: true, sessionId: paymentSession.sessionId };
            }
            
        } catch (error) {
            console.error('❌ Payment processing failed:', error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Verify payment completion
     */
    async verifyPayment(sessionId, quizId) {
        try {
            console.log('🔍 Verifying payment:', sessionId);
            
            const response = await fetch(`${this.apiUrl}/api/payment/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId, quizId })
            });
            
            if (!response.ok) {
                throw new Error(`Payment verification failed: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('✅ Payment verification result:', result);
            
            return result;
        } catch (error) {
            console.error('❌ Payment verification error:', error);
            throw error;
        }
    }

    /**
     * Handle payment success page
     */
    async handlePaymentSuccess() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');
            const quizId = urlParams.get('quiz_id');
            
            if (!sessionId || !quizId) {
                console.warn('⚠️ Missing session_id or quiz_id in success URL');
                return false;
            }
            
            console.log('🎉 Processing payment success callback');
            
            // Verify payment was completed
            const verification = await this.verifyPayment(sessionId, quizId);
            
            if (verification.success && verification.status === 'completed') {
                console.log('✅ Payment successfully verified');
                
                // Show success message
                this.showSuccessMessage();
                
                return true;
            } else {
                throw new Error('Payment verification failed');
            }
            
        } catch (error) {
            console.error('❌ Payment success handling failed:', error);
            this.showErrorMessage('Payment verification failed. Please contact support.');
            return false;
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage() {
        const successHtml = `
            <div class="payment-success-overlay">
                <div class="success-content">
                    <div class="success-icon">🎉</div>
                    <h2>Payment Successful!</h2>
                    <p>Your hair analysis results will be delivered to your email within minutes.</p>
                    <div class="success-details">
                        <p><strong>Amount Paid:</strong> ${window.StrandlyConfig?.PAYMENT?.displayPrice || '$29.00'}</p>
                        <p><strong>Analysis Status:</strong> Processing...</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successHtml);
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        const errorHtml = `
            <div class="payment-error-overlay">
                <div class="error-content">
                    <div class="error-icon">❌</div>
                    <h2>Payment Failed</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="retry-button">Try Again</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHtml);
    }
}

// Initialize payment handler when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.strandlyPaymentHandler = new StrandlyPaymentHandler();
    
    // Auto-handle payment success if on success page
    if (window.location.pathname.includes('success') || 
        window.location.search.includes('session_id')) {
        window.strandlyPaymentHandler.handlePaymentSuccess();
    }
    
    console.log('💳 Payment Handler ready');
});