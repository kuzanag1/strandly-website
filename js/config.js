/**
 * STRANDLY FRONTEND CONFIGURATION
 * Environment-specific settings
 */

window.StrandlyConfig = {
    // API Configuration
    api: {
        baseUrl: window.location.hostname.includes('strandly') || window.location.hostname.includes('netlify') 
            ? 'https://strandly-backend.onrender.com'
            : 'http://localhost:5000'
    },

    // Stripe Configuration
    stripe: {
        // TODO: Replace with actual Stripe publishable key
        // Development: pk_test_...
        // Production: pk_live_...
        publishableKey: 'pk_test_51P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2P4LW2'
    },

    // Payment Configuration
    payment: {
        currency: 'eur',
        amount: 2900, // €29.00 in cents
        serviceName: 'Professional Hair Analysis'
    },

    // Feature flags
    features: {
        enableAnalytics: true,
        enableErrorTracking: true,
        enablePaymentRetry: true
    },

    // Environment detection
    environment: window.location.hostname === 'localhost' ? 'development' : 'production'
};

console.log('⚙️ Strandly Config loaded:', window.StrandlyConfig.environment);