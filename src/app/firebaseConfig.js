// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBduxxdoaUifAaI82-YL_VPzyckPv8In6g",
  authDomain: "blog-app-94b40.firebaseapp.com",
  projectId: "blog-app-94b40",
  storageBucket: "blog-app-94b40.appspot.com",
  messagingSenderId: "402279466254",
  appId: "1:402279466254:web:f316e1fabbd53bce88835f",
  measurementId: "G-MD3JE0VC9T"
};

// Initialize Firebase
// Initialize Firebase
if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  
  export const auth = getAuth();
  export const db = getFirestore();
  export const storage = getStorage();