/**
 * QUIZ NAVIGATION VALIDATOR
 * Quick validation script to verify all DOM elements and functionality
 */

function validateQuizSetup() {
    console.log('🔍 QUIZ NAVIGATION VALIDATION STARTING...');
    
    const results = {
        domElements: {},
        eventHandlers: {},
        cssClasses: {},
        functionality: {}
    };
    
    // 1. Check DOM Elements
    console.log('📋 Checking DOM elements...');
    const requiredElements = [
        'question-text',
        'question-options', 
        'prev-btn',
        'next-btn',
        'question-counter',
        'progress-fill'
    ];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        results.domElements[id] = !!element;
        console.log(`   ${id}: ${element ? '✅' : '❌'}`);
    });
    
    // 2. Check CSS Classes
    console.log('🎨 Checking CSS classes...');
    const requiredClasses = [
        'quiz-option-btn',
        'nav-button',
        'cta-button'
    ];
    
    requiredClasses.forEach(className => {
        const hasStyle = !!document.querySelector(`.${className}, style:contains('${className}')`);
        results.cssClasses[className] = hasStyle;
        console.log(`   .${className}: ${hasStyle ? '✅' : '❌'}`);
    });
    
    // 3. Check Quiz Instance
    console.log('🧬 Checking quiz instance...');
    if (window.strandlyQuiz) {
        const quiz = window.strandlyQuiz;
        results.functionality.quizInstance = true;
        results.functionality.totalQuestions = quiz.totalQuestions;
        results.functionality.currentQuestion = quiz.currentQuestionIndex + 1;
        results.functionality.hasAnswers = Object.keys(quiz.userAnswers).length;
        
        console.log(`   Quiz instance: ✅`);
        console.log(`   Total questions: ${quiz.totalQuestions}`);
        console.log(`   Current question: ${quiz.currentQuestionIndex + 1}`);
        console.log(`   Answers collected: ${Object.keys(quiz.userAnswers).length}`);
        
        // Test navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn && nextBtn) {
            results.functionality.navigationButtons = true;
            console.log(`   Navigation buttons: ✅`);
            
            // Check button states
            results.functionality.prevButtonState = !prevBtn.disabled;
            results.functionality.nextButtonState = !nextBtn.disabled;
            
            console.log(`   Previous button enabled: ${!prevBtn.disabled ? '✅' : '❌'}`);
            console.log(`   Next button enabled: ${!nextBtn.disabled ? '✅' : '❌'}`);
        }
    } else {
        results.functionality.quizInstance = false;
        console.log(`   Quiz instance: ❌`);
    }
    
    // 4. Check API Service
    console.log('🌐 Checking API service...');
    if (window.StrandlyApi) {
        results.functionality.apiService = true;
        console.log(`   API service: ✅`);
    } else {
        results.functionality.apiService = false;
        console.log(`   API service: ❌`);
    }
    
    // Summary
    console.log('\n📊 VALIDATION SUMMARY:');
    const domPassed = Object.values(results.domElements).every(v => v);
    const functionalityPassed = results.functionality.quizInstance && results.functionality.navigationButtons;
    
    console.log(`   DOM Elements: ${domPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Quiz Functionality: ${functionalityPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   API Integration: ${results.functionality.apiService ? '✅ PASS' : '⚠️ DEGRADED'}`);
    
    if (domPassed && functionalityPassed) {
        console.log('\n🚀 QUIZ NAVIGATION: READY FOR TESTING!');
        return true;
    } else {
        console.log('\n❌ QUIZ NAVIGATION: ISSUES DETECTED!');
        return false;
    }
}

// Auto-run validation when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(validateQuizSetup, 500); // Small delay to ensure quiz is initialized
    });
} else {
    setTimeout(validateQuizSetup, 500);
}

// Make validator available globally for manual testing
window.validateQuizSetup = validateQuizSetup;