import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // This is CRITICAL
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // This is also required
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only once
let firebaseApp: FirebaseApp;

if (!getApps().length) {
  // Check if required environment variables are set
  if (!firebaseConfig.projectId || !firebaseConfig.databaseURL) {
    console.error('Firebase configuration is incomplete. Please check your environment variables.');
    console.error('Project ID:', firebaseConfig.projectId);
    console.error('Database URL:', firebaseConfig.databaseURL);
    
    // Use a fallback for development (create a dummy app)
    firebaseApp = initializeApp({
      projectId: 'demo-project',
      databaseURL: 'https://demo-project-default-rtdb.firebaseio.com'
    });
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }
} else {
  firebaseApp = getApps()[0];
}

// Get Realtime Database instance
export const database = getDatabase(firebaseApp);