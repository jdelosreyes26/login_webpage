// DOM Elements for Sign Up
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const sendOtpBtn = document.getElementById('send-otp-btn');
const otpSection = document.getElementById('otp-section');
const otpInput = document.getElementById('otp');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const otpTimer = document.getElementById('otp-timer');
const googleSignupBtn = document.getElementById('google-signup-btn');
const messageDiv = document.getElementById('message');
const phoneSignupSection = document.getElementById('phone-signup-section');
const accountSuccessDiv = document.getElementById('account-success');
const successNameSpan = document.getElementById('success-name');
const successEmailSpan = document.getElementById('success-email');

let confirmationResult = null;
let otpExpiryTime = null;
let timerInterval = null;
let userDataToRegister = {};

// Show message
function showMessage(message, type = 'info') {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Format phone number
function formatPhoneNumber(phone) {
    let cleaned = phone.replace(/\D/g, '');
    if (!cleaned.startsWith('1') && cleaned.length === 10) {
        cleaned = '1' + cleaned;
    }
    return '+' + cleaned;
}

// Validate form
function validateSignupForm() {
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const phone = phoneInput.value.trim();

    if (!fullname) {
        showMessage('Please enter your full name', 'error');
        return false;
    }

    if (!email || !isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }

    if (!phone) {
        showMessage('Please enter a phone number', 'error');
        return false;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return false;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return false;
    }

    return true;
}

// Send OTP via Phone
sendOtpBtn.addEventListener('click', async () => {
    if (!validateSignupForm()) {
        return;
    }

    try {
        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Sending...';

        const formattedPhone = formatPhoneNumber(phoneInput.value.trim());

        // Store user data temporarily
        userDataToRegister = {
            fullname: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: formattedPhone,
            password: passwordInput.value
        };

        // Sign in with phone number
        confirmationResult = await auth.signInWithPhoneNumber(
            formattedPhone,
            window.recaptchaVerifier
        );

        // Show OTP section
        otpSection.style.display = 'block';
        phoneInput.style.display = 'none';
        passwordInput.style.display = 'none';
        confirmPasswordInput.style.display = 'none';
        fullnameInput.style.display = 'none';
        emailInput.style.display = 'none';
        sendOtpBtn.style.display = 'none';

        // Set timer
        otpExpiryTime = Date.now() + 60000;
        startOtpTimer();

        showMessage('OTP sent successfully! Check your phone.', 'success');
    } catch (error) {
        console.error('Error sending OTP:', error);
        showMessage(`Error: ${error.message}`, 'error');
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = 'Send OTP';
    }
});

// Start OTP timer
function startOtpTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((otpExpiryTime - Date.now()) / 1000));
        otpTimer.textContent = `OTP expires in ${remaining}s`;

        if (remaining === 0) {
            clearInterval(timerInterval);
            showMessage('OTP expired. Please request a new one.', 'error');
            resetPhoneSignup();
        }
    }, 1000);
}

// Verify OTP and create account
verifyOtpBtn.addEventListener('click', async () => {
    const otp = otpInput.value.trim();

    if (!otp || otp.length !== 6) {
        showMessage('Please enter a valid 6-digit OTP', 'error');
        return;
    }

    try {
        verifyOtpBtn.disabled = true;
        verifyOtpBtn.textContent = 'Creating Account...';

        const result = await confirmationResult.confirm(otp);
        const user = result.user;

        // Update user profile
        await user.updateProfile({
            displayName: userDataToRegister.fullname
        });

        // You can store additional user data in Firestore here if needed
        // For now, we'll just show success

        clearInterval(timerInterval);
        showMessage('Account created successfully!', 'success');

        // Display success
        displayAccountSuccess(user);

    } catch (error) {
        console.error('Error verifying OTP:', error);
        showMessage('Invalid OTP. Please try again.', 'error');
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = 'Verify & Create Account';
    }
});

// Google Sign Up
googleSignupBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            showMessage('Account created with Google successfully!', 'success');
            displayAccountSuccess(user);
        })
        .catch((error) => {
            console.error('Error with Google signup:', error);
            showMessage(`Google signup error: ${error.message}`, 'error');
        });
});

// Display Account Success
function displayAccountSuccess(user) {
    phoneSignupSection.style.display = 'none';
    googleSignupBtn.style.display = 'none';
    accountSuccessDiv.style.display = 'block';

    successNameSpan.textContent = `Name: ${user.displayName || 'User'}`;
    successEmailSpan.textContent = `Email: ${user.email || user.phoneNumber || 'N/A'}`;
}

// Reset Phone Signup
function resetPhoneSignup() {
    otpSection.style.display = 'none';
    phoneInput.style.display = 'block';
    passwordInput.style.display = 'block';
    confirmPasswordInput.style.display = 'block';
    fullnameInput.style.display = 'block';
    emailInput.style.display = 'block';
    sendOtpBtn.style.display = 'block';
    phoneInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    otpInput.value = '';
    confirmationResult = null;
    userDataToRegister = {};
}

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        displayAccountSuccess(user);
    }
});