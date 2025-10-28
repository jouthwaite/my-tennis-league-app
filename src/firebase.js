// src/firebase.js

// 1. Import initializeApp (for the main connection)
import { initializeApp } from "firebase/app";
// 2. Import getFirestore (to access the database)
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBS6PXQ_fTpMafHus9MYrZKkTN0kKohHU",
  authDomain: "chip-tennis.firebaseapp.com",
  projectId: "chip-tennis",
  storageBucket: "chip-tennis.firebasestorage.app",
  messagingSenderId: "857756304269",
  appId: "1:857756304269:web:f4ff9542e629be902433c4",
  measurementId: "G-YFBP63KZ9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and EXPORT it so your React components can use it
export const db = getFirestore(app);
