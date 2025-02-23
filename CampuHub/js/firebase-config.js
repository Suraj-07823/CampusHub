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

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase instances
export { app, auth, db };
