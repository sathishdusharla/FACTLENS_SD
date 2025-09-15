// Firebase configuration and initialization
// Replace the below config with your own from Firebase Console
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCW-tvUfuv3MEAczkEkZCOw9DAIzpu95I4",
  authDomain: "factlens-2514d.firebaseapp.com",
  projectId: "factlens-2514d",
  storageBucket: "factlens-2514d.firebasestorage.app",
  messagingSenderId: "774638572380",
  appId: "1:774638572380:web:5cb52d0fcf66e4f75de799",
  measurementId: "G-MN657B52WJ"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
