// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyASNuwv-cwrbfC8qDgU95x2nLPJx4b2IDM",
  authDomain: "floraontap.firebaseapp.com",
  projectId: "floraontap",
  storageBucket: "floraontap.appspot.com",
  messagingSenderId: "382642693652",
  appId: "1:382642693652:web:9cf7932be2442bd6466901",
  measurementId: "G-YHJQ33J857"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
