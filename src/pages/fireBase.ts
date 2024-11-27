// firebase.ts
import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCf627v7brxNrog03eu-h7XQT3x1drLZs0",
  authDomain: "ionicauthapp-ace91.firebaseapp.com",
  projectId: "ionicauthapp-ace91",
  storageBucket: "ionicauthapp-ace91.appspot.com",
  messagingSenderId: "215182107687",
  appId: "1:215182107687:web:c2e7b7a5208b46a1b2ee02",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export authentication and Google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);
// Export sign-in functions
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const emailSignUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
