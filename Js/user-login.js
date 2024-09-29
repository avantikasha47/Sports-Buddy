// Import Firebase authentication and Firestore
import { auth, db, storage } from './firebase_config.js'; // Adjust the path as necessary
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Get elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleToRegister = document.getElementById('toggle-register');
const toggleToLogin = document.getElementById('toggle-login');

// Event listener to show Register form and hide Login form
toggleToRegister.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

// Event listener to show Login form and hide Register form
toggleToLogin.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Handle user registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get input values
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        // Register the user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the user's profile to include their name
        await updateProfile(user, { displayName: name });

        // Store the user's data in Firestore
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name: name,
            email: email
        });

        alert('Registration successful! You can now log in.');
        toggleToLogin.click();  // Automatically switch to the login form after registration
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Failed to register: ' + error.message);
    }
});

// Handle user login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get input values
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // Log the user in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert('Login successful!');
        window.location.href = 'index.html';  // Redirect to dashboard or home page after login
    } catch (error) {
        console.error('Error during login:', error);
        alert('Failed to log in: ' + error.message);
    }
});
