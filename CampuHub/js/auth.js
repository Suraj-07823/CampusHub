// Import Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAcERRyqO8MIDVq4XrUnnbE0_fqyhvpKPo",
    authDomain: "campushub-9ce8e.firebaseapp.com",
    projectId: "campushub-9ce8e",
    storageBucket: "campushub-9ce8e.firebasestorage.app",
    messagingSenderId: "961265177921",
    appId: "1:961265177921:web:9d1470863a0315af567dc0",
    measurementId: "G-PSNHNBZ5M9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Store user info in localStorage
            const userInfo = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                emailVerified: user.emailVerified,
                provider: user.providerData[0]?.providerId
            };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            if (window.location.pathname.includes('auth.html')) {
                // If user is logged in and on auth page, redirect to home
                window.location.href = 'index.html';
            }
        }
    });

    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs?.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetForm}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleEmailLogin);
    }

    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleEmailSignup);
    }

    // Google authentication
    const googleAuthBtns = document.querySelectorAll('.google-auth-btn');
    googleAuthBtns?.forEach(btn => {
        btn.addEventListener('click', handleGoogleAuth);
    });
});

// Handle Google Authentication
async function handleGoogleAuth(e) {
    if (e) e.preventDefault();
    
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Store user info in localStorage
        const userInfo = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            emailVerified: user.emailVerified,
            provider: 'google'
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log('Google auth successful:', userInfo);
        
        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Google auth error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
            alert('Sign-in popup was closed before completing the sign-in process. Please try again.');
        } else if (error.code === 'auth/popup-blocked') {
            alert('Sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
        } else {
            alert('An error occurred during sign-in. Please try again.');
        }
    }
}

// Handle Email Login
async function handleEmailLogin(e) {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!validateEmail(email)) {
        showError('loginEmailError', 'Please enter a valid email address');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        handleSuccessfulAuth(userCredential.user);
    } catch (error) {
        console.error('Login error:', error);
        showError('loginPasswordError', getErrorMessage(error.code));
    }
}

// Handle Email Signup
async function handleEmailSignup(e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (!name) {
        showError('signupNameError', 'Please enter your name');
        return;
    }

    if (!validateEmail(email)) {
        showError('signupEmailError', 'Please enter a valid email address');
        return;
    }

    if (password !== confirmPassword) {
        showError('signupConfirmPasswordError', 'Passwords do not match');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: name
        });
        handleSuccessfulAuth(userCredential.user);
    } catch (error) {
        console.error('Signup error:', error);
        showError('signupEmailError', getErrorMessage(error.code));
    }
}

// Handle Successful Authentication
function handleSuccessfulAuth(user) {
    const userInfo = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        emailVerified: user.emailVerified,
        provider: user.providerData[0]?.providerId
    };
    
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    window.location.href = 'index.html';
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password';
        case 'auth/email-already-in-use':
            return 'Email is already registered';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
        case 'auth/popup-blocked':
            return 'Sign-in popup was blocked. Please allow popups and try again.';
        default:
            return 'An error occurred. Please try again.';
    }
}
