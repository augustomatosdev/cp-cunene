import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBWZi0sTd6fUlAmckAvFLW3I61ldicpOYk",
  authDomain: "cp-cunene.firebaseapp.com",
  projectId: "cp-cunene",
  storageBucket: "cp-cunene.appspot.com",
  messagingSenderId: "94913518822",
  appId: "1:94913518822:web:0526ab8b5f0fd7eaa22f27",
};

// Initialize Firebase

const app = getApps.length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.useDeviceLanguage(); // Use the device's language for authentication

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
