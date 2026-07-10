// Firebase Configuration
// Replace these with your Firebase project credentials
// Get these from Firebase Console: https://console.firebase.google.com/

const firebaseConfig = {
    apiKey: "AIzaSyCfrQ4SsgsroM_aBedd3HuwhfqO1bKopqQ",
    authDomain: "login-jndr26.firebaseapp.com",
    projectId: "login-jndr26",
    storageBucket: "login-jndr26.firebasestorage.app",
    messagingSenderId: "898947504822",
    appId: "1:898947504822:android:ffbe9b944f420cb547a417"
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
