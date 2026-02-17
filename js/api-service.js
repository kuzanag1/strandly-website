/**
 * STRANDLY API SERVICE v2.0
 * Frontend-Backend Integration Layer
 * Updated for new backend architecture - February 17, 2026
 */

class StrandlyApiService {
    constructor() {
        this.baseURL = this.determineApiUrl();
        this.sessionId = this.generateSessionId();
        
        console.log(`🔗 API Service v2.0 initialized with base URL: ${this.baseURL}`);
    }

    /**
     * Determine API URL based on environment
     */
    determineApiUrl() {
        // Production check
        if (window.location.hostname.includes('strandly') || window.location.hostname.includes('netlify')) {
            return 'https://strandly-backend.onrender.com';
        }
        
        // Development fallback
        return 'http://localhost:5000';
    }

    /**
     * Generate unique session ID for tracking
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Make API request with error handling
     */
    async apiRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ API Success: ${response.status}`);
            return data;

        } catch (error) {
            console.error('API Request Failed:', error);
            throw new ApiError(0, 'Network error - please check your connection', error.message);
        }
    }

    /**
     * Check backend health
     */
    async checkHealth() {
        try {
            console.log('🏥 Checking backend health');
            const response = await this.apiRequest('/health');
            return response;
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'unhealthy', error: error.message };
        }
    }

    /**
     * Submit quiz answers to backend
     */
    async submitQuiz(answers) {
        console.log('📊 Submitting quiz answers to backend');
        
        // Add user email from the quiz
        const payload = {
            ...answers,
            sessionId: this.sessionId,
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        try {
            const response = await this.apiRequest('/api/quiz/submit', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            console.log('✅ Quiz submitted successfully:', response);
            
            // Store quiz ID for payment flow
            if (response.quizId) {
                localStorage.setItem('strandly_quiz_id', response.quizId);
            }

            return response;
        } catch (error) {
            console.error('Quiz submission failed:', error);
            throw error;
        }
    }

    /**
     * Create payment checkout session
     */
    async createPaymentSession(quizId = null) {
        console.log('💳 Creating payment checkout session');
        
        // Use stored quiz ID if not provided
        const finalQuizId = quizId || localStorage.getItem('strandly_quiz_id');
        
        if (!finalQuizId) {
            throw new Error('No quiz ID available for payment. Please retake the quiz.');
        }

        try {
            const response = await this.apiRequest('/api/payment/create-checkout', {
                method: 'POST',
                body: JSON.stringify({ quizId: finalQuizId })
            });

            console.log('✅ Payment session created:', response);
            return response;
        } catch (error) {
            console.error('Payment session creation failed:', error);
            throw error;
        }
    }

    /**
     * Redirect to Stripe checkout
     */
    async redirectToPayment() {
        try {
            const paymentSession = await this.createPaymentSession();
            
            if (paymentSession.url) {
                console.log('🔄 Redirecting to Stripe checkout');
                window.location.href = paymentSession.url;
            } else {
                throw new Error('Payment URL not received from server');
            }
        } catch (error) {
            console.error('Payment redirect failed:', error);
            this.showError('Failed to initialize payment. Please try again.');
        }
    }

    /**
     * Save quiz progress locally
     */
    saveQuizProgress(currentQuestionIndex, answers) {
        const progress = {
            currentQuestionIndex,
            answers,
            timestamp: Date.now(),
            sessionId: this.sessionId
        };
        
        localStorage.setItem('strandly_quiz_progress', JSON.stringify(progress));
        console.log('💾 Quiz progress saved locally');
    }

    /**
     * Load quiz progress from local storage
     */
    loadQuizProgress() {
        const stored = localStorage.getItem('strandly_quiz_progress');
        if (!stored) return null;

        try {
            const progress = JSON.parse(stored);
            
            // Check if progress is not too old (24 hours)
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            if (Date.now() - progress.timestamp > maxAge) {
                localStorage.removeItem('strandly_quiz_progress');
                return null;
            }

            console.log('📂 Quiz progress loaded from local storage');
            return progress;
        } catch (error) {
            console.error('Error loading quiz progress:', error);
            localStorage.removeItem('strandly_quiz_progress');
            return null;
        }
    }

    /**
     * Clear quiz progress and related data
     */
    clearQuizProgress() {
        localStorage.removeItem('strandly_quiz_progress');
        localStorage.removeItem('strandly_quiz_id');
        console.log('🗑️ Quiz progress cleared');
    }

    /**
     * Show error message to user
     */
    showError(message, title = 'Error') {
        // Create a simple error modal or alert
        if (window.showModal) {
            window.showModal(title, message);
        } else {
            alert(`${title}: ${message}`);
        }
    }

    /**
     * Show success message to user
     */
    showSuccess(message, title = 'Success') {
        // Create a simple success modal or alert
        if (window.showModal) {
            window.showModal(title, message, 'success');
        } else {
            alert(`${title}: ${message}`);
        }
    }

    /**
     * Analytics tracking
     */
    trackEvent(eventName, data = {}) {
        console.log(`📊 Analytics: ${eventName}`, data);
        // Future: send to analytics service
    }

    /**
     * Handle quiz completion workflow
     */
    async completeQuiz(finalAnswers) {
        try {
            console.log('🏁 Starting quiz completion workflow');
            
            // 1. Submit quiz to backend
            const quizResponse = await this.submitQuiz(finalAnswers);
            
            // 2. Track completion event
            this.trackEvent('quiz_completed', {
                quizId: quizResponse.quizId,
                questionCount: Object.keys(finalAnswers).length
            });

            // 3. Show success message
            this.showSuccess('Quiz completed! Redirecting to payment...');

            // 4. Small delay for UX, then redirect to payment
            setTimeout(() => {
                this.redirectToPayment();
            }, 2000);

            return quizResponse;
            
        } catch (error) {
            console.error('Quiz completion workflow failed:', error);
            this.showError('Failed to complete quiz. Please try again.');
            throw error;
        }
    }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(status, message, details) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }
}

// Initialize global API service
window.StrandlyApi = new StrandlyApiService();
window.ApiError = ApiError;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StrandlyApiService, ApiError };
}

console.log('🚀 Strandly API Service v2.0 ready!');