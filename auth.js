/**
 * Prism Study Planner & Assistant - Authentication Module
 * Supports Firebase Google Sign-In with Demo / Local fallback
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;
let currentUser = null;
let authListeners = [];

// Initialize Firebase Auth if credentials are configured
if (isFirebaseConfigured()) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        currentUser = {
          uid: user.uid,
          displayName: user.displayName || "Prism Scholar",
          email: user.email,
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`
        };
      } else {
        currentUser = null;
      }
      notifyListeners(currentUser);
    });
  } catch (err) {
    console.warn("Firebase Auth initialization error:", err);
  }
} else {
  // Check local demo session
  const storedUser = localStorage.getItem("prism_demo_user");
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (e) {
      currentUser = null;
    }
  }
}

/**
 * Sign in with Google Account
 */
export async function loginWithGoogle() {
  if (isFirebaseConfigured() && firebaseAuth && googleProvider) {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      currentUser = {
        uid: result.user.uid,
        displayName: result.user.displayName || "Prism Scholar",
        email: result.user.email,
        photoURL: result.user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${result.user.uid}`
      };
      notifyListeners(currentUser);
      return { success: true, user: currentUser };
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      return { success: false, error: error.message };
    }
  } else {
    // Demo Mode fallback for immediate local testing
    currentUser = {
      uid: "demo-scholar-" + Math.floor(1000 + Math.random() * 9000),
      displayName: "Alex Rivera",
      email: "alex.scholar@prismstudy.app",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    };
    localStorage.setItem("prism_demo_user", JSON.stringify(currentUser));
    notifyListeners(currentUser);
    return { 
      success: true, 
      user: currentUser, 
      isDemo: true, 
      message: "Signed in with Demo Scholar account (Firebase credentials pending in js/firebase-config.js)" 
    };
  }
}

/**
 * Sign out user
 */
export async function logoutUser() {
  if (isFirebaseConfigured() && firebaseAuth) {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      console.error("Firebase SignOut error:", err);
    }
  }
  localStorage.removeItem("prism_demo_user");
  currentUser = null;
  notifyListeners(null);
  return { success: true };
}

/**
 * Get current logged in user
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Register auth state listener
 */
export function onAuthChange(callback) {
  authListeners.push(callback);
  callback(currentUser);
}

function notifyListeners(user) {
  authListeners.forEach(fn => fn(user));
}

export { firebaseApp, firebaseAuth };
