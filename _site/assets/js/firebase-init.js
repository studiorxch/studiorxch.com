// /assets/js/firebase-init.js
// ============================================================================
// StudioRich Firebase Init (TrackstarDB)
// Reads from environment vars for security
// ============================================================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Load from environment variables (recommended for production)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

