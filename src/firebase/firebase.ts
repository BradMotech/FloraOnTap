// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDgh_IzW6TzrscXMX0Xw_-ne8jLtg2xrU0",
  authDomain: "hairdu2024.firebaseapp.com",
  projectId: "hairdu2024",
  storageBucket: "hairdu2024.appspot.com",
  messagingSenderId: "648264423943",
  appId: "1:648264423943:web:ab00d0d2e5846fae0aa8a2",
  measurementId: "G-4P3Z3YDHPV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
