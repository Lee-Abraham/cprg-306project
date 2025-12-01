'use client';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage} from "firebase/storage";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlHQZwNnLxfKizC69OJRfMYLODg2C2XK8",
  authDomain: "cprg-306project.firebaseapp.com",
  projectId: "cprg-306project",
  storageBucket: "cprg-306project.firebasestorage.app",
  messagingSenderId: "387534019491",
  appId: "1:387534019491:web:52d2257d1217114556d816",
  measurementId: "G-7C45FEVXML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const dbf = getFirestore(app);
export const ldb = getDatabase(app);
export const storage = getStorage(app);


// Only initialize analytics if supported (i.e., in browser)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
