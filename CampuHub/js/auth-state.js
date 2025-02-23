import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    onAuthStateChanged,
    signOut
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

// DOM Elements
const loginButton = document.getElementById('loginButton');
const profileDropdown = document.getElementById('profileDropdown');
const userName = document.getElementById('userName');
const profileImage = document.getElementById('profileImage');
const logoutButton = document.getElementById('logoutButton');

// Handle auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
        
        // Get stored user info (might have additional data)
        const storedUserInfo = localStorage.getItem('userInfo');
        const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
        
        // Update UI for signed-in user
        if (loginButton) loginButton.style.display = 'none';
        if (profileDropdown) profileDropdown.style.display = 'inline-block';
        
        // Update user info - prefer stored info if available
        if (userName) {
            userName.textContent = userInfo?.displayName || user.displayName || 'User';
        }
        
        if (profileImage) {
            // Use Google profile picture if available, otherwise generate avatar
            const photoURL = userInfo?.photoURL || user.photoURL || 
                           `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=random`;
            profileImage.src = photoURL;
            profileImage.onerror = () => {
                // Fallback if image fails to load
                profileImage.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=random`;
            };
        }

        // Add provider-specific class for styling
        if (profileDropdown && userInfo?.provider) {
            profileDropdown.classList.add(`provider-${userInfo.provider}`);
        }

    } else {
        // User is signed out
        console.log('User is signed out');
        
        // Update UI for signed-out user
        if (loginButton) loginButton.style.display = 'inline-block';
        if (profileDropdown) profileDropdown.style.display = 'none';
        
        // Clear user info from localStorage
        localStorage.removeItem('userInfo');
    }
});

// Handle logout
if (logoutButton) {
    logoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            // Clear any stored user data
            localStorage.removeItem('userInfo');
            // Redirect to home page after logout
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    });
}

// Initialize dropdown on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        if (userName) userName.textContent = userInfo.displayName || 'User';
        if (profileImage) {
            profileImage.src = userInfo.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.displayName || 'User')}&background=random`;
        }
    }
});
