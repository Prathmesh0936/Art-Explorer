
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Log the API key to help debug.
// Ensure this is an expected value from your .env.local file.
console.log(
  'Attempting to initialize Firebase with API Key:',
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded' : 'MISSING or UNDEFINED'
);
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error(
    "CRITICAL: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is MISSING or UNDEFINED in your environment. For Firebase Studio, ensure this is correctly set in your project's environment variable configuration. The app cannot function without it. Please check your .env.local or Firebase Studio project settings and restart your development server/environment."
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "", // Default to empty string to ensure type consistency
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Initialize Firebase
// We need to check if all essential config values are present before initializing
let app;
if (
  firebaseConfig.apiKey && // Non-empty string check
  firebaseConfig.authDomain && // Non-empty string check
  firebaseConfig.projectId    // Non-empty string check
) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} else {
  console.error(
    'CRITICAL: Firebase configuration is incomplete (apiKey, authDomain, or projectId derived from environment variables is missing/empty). Firebase will NOT be initialized. Check all NEXT_PUBLIC_FIREBASE_... variables in your .env.local or Firebase Studio project settings.'
  );
  // auth will be undefined if app is not initialized.
}

const auth = app ? getAuth(app) : undefined; // Initialize auth only if app was initialized

export { app, auth };
