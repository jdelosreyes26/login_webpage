// DOM Elements
const phoneInput = document.getElementById('phone');
const sendOtpBtn = document.getElementById('send-otp-btn');
const otpSection = document.getElementById('otp-section');
const otpInput = document.getElementById('otp');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const otpTimer = document.getElementById('otp-timer');
const googleLoginBtn = document.getElementById('google-login-btn');
const messageDiv = document.getElementById('message');
const phoneLoginSection = document.getElementById('phone-login-section');
const userInfoDiv = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');
const userEmailSpan = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

let confirmationResult = null;
let otpExpiryTime = null;
let timerInterval = null;

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

// Format phone number
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present
    if (!cleaned.startsWith('1') && cleaned.length === 10) {
        cleaned = '1' + cleaned;
    }
    
    return '+' + cleaned;
}

// Send OTP via Phone
sendOtpBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();
    
    if (!phone) {
        showMessage('Please enter a phone number', 'error');
        return;
    }
    
    try {
        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Sending...';
        
        const formattedPhone = formatPhoneNumber(phone);
        
        // Sign in with phone number
        confirmationResult = await auth.signInWithPhoneNumber(
            formattedPhone,
            window.recaptchaVerifier
        );
        
        // Show OTP section
        otpSection.style.display = 'block';
        phoneInput.style.display = 'none';
        sendOtpBtn.style.display = 'none';
        
        // Set timer (OTP valid for 60 seconds)
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
            resetPhoneLogin();
        }
    }, 1000);
}

// Verify OTP
verifyOtpBtn.addEventListener('click', async () => {
    const otp = otpInput.value.trim();
    
    if (!otp || otp.length !== 6) {
        showMessage('Please enter a valid 6-digit OTP', 'error');
        return;
    }
    
    try {
        verifyOtpBtn.disabled = true;
        verifyOtpBtn.textContent = 'Verifying...';
        
        const result = await confirmationResult.confirm(otp);
        
        clearInterval(timerInterval);
        showMessage('Login successful!', 'success');
        
        // Display user info
        displayUserInfo(result.user);
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        showMessage('Invalid OTP. Please try again.', 'error');
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = 'Verify OTP';
    }
});

// Google Login
googleLoginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            showMessage('Login with Google successful!', 'success');
            displayUserInfo(result.user);
        })
        .catch((error) => {
            console.error('Error with Google login:', error);
            showMessage(`Google login error: ${error.message}`, 'error');
        });
});

// Display User Info
function displayUserInfo(user) {
    phoneLoginSection.style.display = 'none';
    googleLoginBtn.style.display = 'none';
    userInfoDiv.style.display = 'block';
    
    userNameSpan.textContent = `Name: ${user.displayName || 'User'}`;
    userEmailSpan.textContent = `Phone/Email: ${user.phoneNumber || user.email || 'N/A'}`;
}

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        resetUI();
        showMessage('Logged out successfully', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('Error logging out', 'error');
    }
});

// Reset Phone Login
function resetPhoneLogin() {
    otpSection.style.display = 'none';
    phoneInput.style.display = 'block';
    sendOtpBtn.style.display = 'block';
    phoneInput.value = '';
    otpInput.value = '';
    confirmationResult = null;
}

// Reset UI
function resetUI() {
    resetPhoneLogin();
    userInfoDiv.style.display = 'none';
    phoneLoginSection.style.display = 'block';
    googleLoginBtn.style.display = 'block';
    sendOtpBtn.disabled = false;
    sendOtpBtn.textContent = 'Send OTP';
}

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        displayUserInfo(user);
    } else {
        resetUI();
    }
});