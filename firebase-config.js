/**
 * Prism Study Planner & Assistant - Firebase Configuration
 * 
 * Replace the placeholder values below with your Firebase Project credentials.
 * To get these credentials:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a project (or select an existing one)
 * 3. Add a Web App (</>) and copy the `firebaseConfig` object
 * 4. Enable Google Sign-In in Firebase Console -> Authentication -> Sign-in method
 * 5. Create Cloud Firestore in test mode or with the provided firestore.rules
 * 6. (Optional) Enable Cloud Storage for file uploads (PDFs/docs)
 */

export const firebaseConfig = {
  apiKey: "",
  authDomain: "prism-study-planner-assistant.firebaseapp.com",
  projectId: "prism-study-planner-assistant",
  storageBucket: "prism-study-planner-assistant.firebasestorage.app",
  messagingSenderId: "",
  appId: ""
};

/**
 * Check if the user has provided actual Firebase credentials
 */
export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
  );
}
