
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Log the API key to help debug.
// Ensure this is an expected value from your .env.local file.
console.log('Attempting to initialize Firebase with API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded' : 'MISSING or UNDEFINED');
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error("Firebase API Key is MISSING. Please check your .env.local file and ensure it contains NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_key and that you've restarted your development server.");
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// We need to check if all essential config values are present before initializing
let app;
if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} else {
  console.error('Firebase configuration is incomplete. Firebase will not be initialized.');
  // You might want to throw an error here or handle this case appropriately
  // For now, auth will be undefined if app is not initialized.
}

const auth = app ? getAuth(app) : undefined; // Initialize auth only if app was initialized

export { app, auth };
