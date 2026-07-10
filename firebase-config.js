// Firebase Configuration
// Replace these with your Firebase project credentials
// Get these from Firebase Console: https://console.firebase.google.com/

const firebaseConfig = {
    apiKey: "AIzaSyDemoKeyChangeMe",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Auth instance
const auth = firebase.auth();

// Enable phone authentication with reCAPTCHA
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('send-otp-btn', {
    'size': 'invisible',
    'callback': (response) => {
        console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
        console.log('reCAPTCHA expired');
    }
});