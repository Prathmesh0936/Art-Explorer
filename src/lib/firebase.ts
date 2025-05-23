
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Log the API key to help debug.
// Ensure this is an expected value from your .env.local file or Firebase Studio environment.
console.log(
  'Attempting to initialize Firebase with API Key:',
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded' : 'MISSING or UNDEFINED'
);

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error(
    "CRITICAL: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is MISSING or UNDEFINED in your environment. For Firebase Studio, ensure this is correctly set in your project's environment variable configuration. The app cannot function without it. Please check your .env.local or Firebase Studio project settings and restart your development server/environment."
  );
}

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY_PLACEHOLDER", // Fallback to a placeholder
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN_PLACEHOLDER.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID_PLACEHOLDER",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET_PLACEHOLDER.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID_PLACEHOLDER",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID_PLACEHOLDER",
};

// Initialize Firebase
// We need to check if all essential config values *derived from env vars* are present (not just placeholders)
let app;
let auth;

if (
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error) {
    console.error('CRITICAL: Firebase initialization failed despite presence of API key. Error:', error);
    console.error('Firebase config used:', {
      apiKey: firebaseConfig.apiKey ? 'Exists (Placeholder or Real)' : 'MISSING',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
    });
    // auth will remain undefined if app initialization fails
  }
} else {
  console.error(
    'CRITICAL: Essential Firebase configuration (apiKey, authDomain, or projectId from NEXT_PUBLIC_... env vars) is MISSING or EMPTY. Firebase will NOT be initialized. Ensure these are correctly set in your .env.local or Firebase Studio project environment variables and the development server/environment is restarted.'
  );
  // auth will remain undefined as app is not initialized
}

export { app, auth };
