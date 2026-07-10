# Login Webpage - Phone & Google OAuth

A fully operational login webpage with phone number (OTP) and Google OAuth authentication.

## Features

✅ **Phone Number Authentication** - Send and verify OTP
✅ **Google OAuth Login** - Sign in with Google account
✅ **Firebase Backend** - Secure authentication
✅ **Responsive Design** - Works on all devices
✅ **Real-time Timer** - OTP expiry countdown

## Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name and complete setup

### Step 2: Get Firebase Credentials

1. In Firebase Console, click "Project Settings"
2. Go to "Your apps" section
3. Register a new web app
4. Copy the Firebase config object

### Step 3: Update Configuration

1. Open `firebase-config.js`
2. Replace the credentials with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 4: Enable Authentication Methods

In Firebase Console:
1. Go to **Authentication** → **Sign-in method**
2. Enable **Phone**
3. Enable **Google**

### Step 5: Setup Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Create OAuth 2.0 Client ID
5. Add authorized JavaScript origins: `http://localhost:3000` (for testing)
6. Add authorized redirect URIs: `http://localhost:3000`

### Step 6: Deploy to GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Select "Deploy from a branch"
3. Select `main` branch
4. Save

Your live link will be: `https://jdelosreyes26.github.io/login_webpage/`

## Local Testing

1. Start a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   ```

2. Open `http://localhost:8000`

## File Structure

```
login_webpage/
├── index.html           # Main HTML
├── styles.css          # Styling
├── app.js              # JavaScript logic
├── firebase-config.js  # Firebase configuration
└── README.md           # This file
```

## Important Notes

⚠️ **Security**: Never commit real Firebase credentials to GitHub. Use environment variables in production.

⚠️ **Phone Authentication**: Requires valid phone numbers and may incur SMS charges depending on Firebase pricing.

⚠️ **reCAPTCHA**: Phone authentication requires reCAPTCHA verification to prevent abuse.

## Troubleshooting

### OTP not received?
- Ensure phone number format is correct (e.g., +1-555-123-4567)
- Check Firebase quotas and limits
- Verify phone authentication is enabled in Firebase

### Google login not working?
- Check OAuth credentials are correctly configured
- Ensure authorized origins match your deployment URL
- Clear browser cache and cookies

### Firebase errors?
- Verify Firebase config is correct
- Check internet connection
- Ensure Firebase project has required services enabled

## Support

For issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

---

**Repository**: https://github.com/jdelosreyes26/login_webpage