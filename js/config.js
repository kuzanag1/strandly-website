/**
 * STRANDLY CONFIGURATION
 * API endpoints and environment configuration
 * February 18, 2026 - $29 Payment Integration
 */

const StrandlyConfig = {
    // API Configuration
    API_BASE_URL: 'https://strandly-backend.onrender.com', // UPDATED TO DEPLOYED RENDER URL
    
    // Payment Configuration
    PAYMENT: {
        amount: 2900, // $29.00 in cents
        currency: 'USD',
        displayPrice: '$29.00'
    },
    
    // Stripe Configuration
    STRIPE: {
        publishableKey: 'pk_test_51RTTQk07mG2JMZSa1rD5kC1tTqIqn0MDY3RjL4083yt0MxUVkA0alm5uQtfoPyAbr5t2tSoGDhLBSRE35PVyNCUj00ihSI35bo', // Updated test key
        // publishableKey: 'pk_live_YOUR_LIVE_KEY_HERE', // Production key
    },
    
    // Quiz Configuration
    QUIZ: {
        maxQuestions: 12,
        timeoutMs: 30000 // 30 seconds per question
    },
    
    // Environment Detection
    isDevelopment: () => {
        return window.location.hostname === 'localhost' || 
               window.location.hostname.includes('127.0.0.1') ||
               window.location.hostname.includes('netlify.app');
    },
    
    // Get appropriate API URL
    getApiUrl: () => {
        // For development/testing, use local mock server
        if (StrandlyConfig.isDevelopment()) {
            return StrandlyConfig.API_BASE_URL;
        }
        
        // For production, use deployed backend
        return 'https://strandly-backend.onrender.com';
    }
};

// Make globally available
window.StrandlyConfig = StrandlyConfig;

console.log('🔧 Strandly Config loaded:', {
    apiUrl: StrandlyConfig.getApiUrl(),
    paymentAmount: StrandlyConfig.PAYMENT.displayPrice,
    environment: StrandlyConfig.isDevelopment() ? 'Development' : 'Production'
});