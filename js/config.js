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
        publishableKey: 'pk_test_51QWRmyJnWO5wX7c0pJD5CY8VL7jGBxCt8g4cCzNkGbFgZfkuQLGCEr1BCJ4Q7Fs46PYxzv3BNeFhNsm7O4lQk5N500pnq2x5MB', // Test key
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