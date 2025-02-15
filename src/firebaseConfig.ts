import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY
const AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL
const PROGECT_ID = import.meta.env.VITE_PROJECT_ID
const STORAGE_BUCKET = import.meta.env.VITE_STORAGE_BUCKET
const MESSAGING_SENDER_ID = import.meta.env.VITE_MESSAGING_SENDER_ID
const APP_ID = import.meta.env.VITE_APP_ID
const MEASUREMENT_ID = import.meta.env.VITE_MESUREMENT_ID

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROGECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app);
const storage = getStorage(app);
const db=getFirestore(app);

export { storage , auth, db, app, firebaseConfig};