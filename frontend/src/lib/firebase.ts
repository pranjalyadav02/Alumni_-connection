import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Remove react-native imports for web/React projects
// import { Platform } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBi3d71upXq0544FEPVmCYjgJTYiby7RLo",
  authDomain: "student-alumni-platform-46a98.firebaseapp.com",
  projectId: "student-alumni-platform-46a98",
  storageBucket: "student-alumni-platform-46a98.appspot.com", // fixed typo: .app → .appspot.com
  messagingSenderId: "533433370288",
  appId: "1:533433370288:web:0ed5e9805dfebbdae09d75",
  measurementId: "G-3D1ED72JPX",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} else {
  app = getApp(); // Use existing app if already initialized
  console.log("Using existing Firebase app");
}

// For web, just use getAuth
const auth = getAuth(app);

export { app, auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
