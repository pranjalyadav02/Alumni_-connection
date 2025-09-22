import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "", 
  messagingSenderId: "",
  appId: "",
  measurementId: "",
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
