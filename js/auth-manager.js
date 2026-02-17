/**
 * STRANDLY AUTHENTICATION MANAGER
 * User signup, login, and session management
 * February 17, 2026
 */

class StrandlyAuthManager {
    constructor() {
        this.apiService = new StrandlyApiService();
        this.isProcessing = false;
        
        console.log('🔐 Auth Manager initialized');
    }

    /**
     * Initialize authentication forms
     */
    initialize() {
        this.setupSignupForm();
        this.setupLoginForm();
        this.setupLogoutButtons();
        this.checkAuthState();
        
        console.log('✅ Auth Manager ready');
    }

    /**
     * Setup signup form
     */
    setupSignupForm() {
        const signupForm = document.getElementById('signup-form');
        if (!signupForm) return;

        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await this.handleSignup(event.target);
        });

        // Add password strength indicator
        const passwordInput = signupForm.querySelector('#password');
        if (passwordInput) {
            passwordInput.addEventListener('input', this.updatePasswordStrength.bind(this));
        }
    }

    /**
     * Setup login form
     */
    setupLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await this.handleLogin(event.target);
        });
    }

    /**
     * Setup logout buttons
     */
    setupLogoutButtons() {
        const logoutButtons = document.querySelectorAll('.logout-btn, [data-action="logout"]');
        logoutButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.handleLogout();
            });
        });
    }

    /**
     * Handle user signup
     */
    async handleSignup(form) {
        if (this.isProcessing) return;

        console.log('📝 Processing signup');
        this.isProcessing = true;

        try {
            // Show loading state
            this.setFormLoading(form, true);
            this.clearFormErrors(form);

            // Extract form data
            const formData = new FormData(form);
            const userData = {
                email: formData.get('email'),
                password: formData.get('password'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                phone: formData.get('phone') || null
            };

            // Validate form data
            const validation = this.validateSignupData(userData);
            if (!validation.isValid) {
                this.showFormErrors(form, validation.errors);
                return;
            }

            // Submit to API
            const response = await this.apiService.register(userData);
            
            console.log('✅ Signup successful:', response.user.email);

            // Handle successful signup
            await this.handleSuccessfulAuth(response, 'signup');

        } catch (error) {
            console.error('❌ Signup failed:', error);
            this.handleAuthError(form, error, 'signup');
        } finally {
            this.isProcessing = false;
            this.setFormLoading(form, false);
        }
    }

    /**
     * Handle user login
     */
    async handleLogin(form) {
        if (this.isProcessing) return;

        console.log('🔐 Processing login');
        this.isProcessing = true;

        try {
            // Show loading state
            this.setFormLoading(form, true);
            this.clearFormErrors(form);

            // Extract form data
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');

            // Basic validation
            if (!email || !password) {
                this.showFormErrors(form, [{ field: 'general', message: 'Please fill in all fields' }]);
                return;
            }

            // Submit to API
            const response = await this.apiService.login(email, password);
            
            console.log('✅ Login successful:', response.user.email);

            // Handle successful login
            await this.handleSuccessfulAuth(response, 'login');

        } catch (error) {
            console.error('❌ Login failed:', error);
            this.handleAuthError(form, error, 'login');
        } finally {
            this.isProcessing = false;
            this.setFormLoading(form, false);
        }
    }

    /**
     * Handle successful authentication
     */
    async handleSuccessfulAuth(response, type) {
        const user = response.user;
        
        // Update UI to show authenticated state
        this.updateAuthenticatedUI(user);

        // Show success message
        this.showSuccessMessage(
            type === 'signup' ? 
            `Welcome to Strandly, ${user.firstName}!` :
            `Welcome back, ${user.firstName}!`
        );

        // Handle redirection
        await this.handleAuthRedirection(user);
    }

    /**
     * Handle post-authentication redirection
     */
    async handleAuthRedirection(user) {
        // Check URL parameters for redirect
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');

        // Check for pending quiz results
        const pendingResults = localStorage.getItem('strandly_pending_results');

        if (pendingResults) {
            // User just completed quiz before signing up
            console.log('🎯 Redirecting to results page with saved results');
            localStorage.removeItem('strandly_pending_results');
            setTimeout(() => {
                window.location.href = 'results.html';
            }, 2000);
            return;
        }

        if (redirect === 'quiz-complete') {
            // Redirect back to quiz or results
            setTimeout(() => {
                window.location.href = 'quiz.html';
            }, 2000);
            return;
        }

        if (redirect && redirect !== 'null') {
            // Custom redirect
            setTimeout(() => {
                window.location.href = redirect;
            }, 2000);
            return;
        }

        // Default redirect to dashboard/profile
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }

    /**
     * Handle logout
     */
    handleLogout() {
        console.log('👋 Logging out');
        
        // Clear authentication
        this.apiService.logout();
        
        // Update UI
        this.updateUnauthenticatedUI();
        
        // Show message
        this.showSuccessMessage('You have been logged out successfully');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    /**
     * Validate signup data
     */
    validateSignupData(userData) {
        const errors = [];

        // Email validation
        if (!userData.email) {
            errors.push({ field: 'email', message: 'Email is required' });
        } else if (!this.isValidEmail(userData.email)) {
            errors.push({ field: 'email', message: 'Please enter a valid email address' });
        }

        // Password validation
        if (!userData.password) {
            errors.push({ field: 'password', message: 'Password is required' });
        } else if (userData.password.length < 8) {
            errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
        }

        // Name validation
        if (!userData.firstName) {
            errors.push({ field: 'firstName', message: 'First name is required' });
        }

        if (!userData.lastName) {
            errors.push({ field: 'lastName', message: 'Last name is required' });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Check if email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Update password strength indicator
     */
    updatePasswordStrength(event) {
        const password = event.target.value;
        const strengthEl = document.getElementById('password-strength');
        
        if (!strengthEl) return;

        const strength = this.calculatePasswordStrength(password);
        
        strengthEl.className = `password-strength strength-${strength.level}`;
        strengthEl.textContent = strength.text;
    }

    /**
     * Calculate password strength
     */
    calculatePasswordStrength(password) {
        if (password.length === 0) {
            return { level: 'none', text: '' };
        }

        let score = 0;
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Character variety
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score < 3) {
            return { level: 'weak', text: 'Weak password' };
        } else if (score < 5) {
            return { level: 'medium', text: 'Good password' };
        } else {
            return { level: 'strong', text: 'Strong password' };
        }
    }

    /**
     * Set form loading state
     */
    setFormLoading(form, isLoading) {
        const submitBtn = form.querySelector('[type="submit"]');
        const inputs = form.querySelectorAll('input');

        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.textContent = isLoading ? 'Please wait...' : submitBtn.dataset.originalText || submitBtn.textContent;
            if (!submitBtn.dataset.originalText) {
                submitBtn.dataset.originalText = submitBtn.textContent;
            }
        }

        inputs.forEach(input => {
            input.disabled = isLoading;
        });

        form.classList.toggle('loading', isLoading);
    }

    /**
     * Show form errors
     */
    showFormErrors(form, errors) {
        this.clearFormErrors(form);

        errors.forEach(error => {
            const field = form.querySelector(`[name="${error.field}"]`) || form;
            const errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            errorEl.textContent = error.message;
            
            if (error.field === 'general') {
                form.insertBefore(errorEl, form.firstChild);
            } else if (field && field.parentNode) {
                field.parentNode.appendChild(errorEl);
                field.classList.add('error');
            }
        });
    }

    /**
     * Clear form errors
     */
    clearFormErrors(form) {
        const errorEls = form.querySelectorAll('.field-error');
        errorEls.forEach(el => el.remove());

        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    /**
     * Handle authentication errors
     */
    handleAuthError(form, error, type) {
        const errorInfo = this.apiService.handleError(error);
        
        let errorMessage = errorInfo.message;
        
        // Customize error messages based on context
        if (error.status === 409 && type === 'signup') {
            errorMessage = 'An account with this email already exists. Try logging in instead.';
        } else if (error.status === 401 && type === 'login') {
            errorMessage = 'Invalid email or password. Please try again.';
        }

        this.showFormErrors(form, [{ field: 'general', message: errorMessage }]);
    }

    /**
     * Check current authentication state
     */
    checkAuthState() {
        if (this.apiService.isAuthenticated()) {
            console.log('✅ User is authenticated');
            this.updateAuthenticatedUI();
        } else {
            console.log('❌ User is not authenticated');
            this.updateUnauthenticatedUI();
        }
    }

    /**
     * Update UI for authenticated user
     */
    updateAuthenticatedUI(user) {
        // Hide auth forms
        const authForms = document.querySelectorAll('.auth-form, .login-prompt');
        authForms.forEach(form => form.style.display = 'none');

        // Show authenticated elements
        const authElements = document.querySelectorAll('.authenticated-only');
        authElements.forEach(el => el.style.display = 'block');

        // Update user info
        if (user) {
            const userNameEls = document.querySelectorAll('.user-name');
            userNameEls.forEach(el => {
                el.textContent = user.firstName || user.email;
            });
        }
    }

    /**
     * Update UI for unauthenticated user
     */
    updateUnauthenticatedUI() {
        // Show auth forms
        const authForms = document.querySelectorAll('.auth-form, .login-prompt');
        authForms.forEach(form => form.style.display = 'block');

        // Hide authenticated elements
        const authElements = document.querySelectorAll('.authenticated-only');
        authElements.forEach(el => el.style.display = 'none');
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        // Create or update success message element
        let successEl = document.getElementById('auth-success');
        
        if (!successEl) {
            successEl = document.createElement('div');
            successEl.id = 'auth-success';
            successEl.className = 'auth-success';
            document.body.appendChild(successEl);
        }

        successEl.textContent = message;
        successEl.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            successEl.classList.remove('show');
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Auth Manager');
    
    const authManager = new StrandlyAuthManager();
    authManager.initialize();
    
    // Make globally accessible
    window.strandlyAuth = authManager;
});