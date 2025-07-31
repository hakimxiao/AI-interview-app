
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBLNSLuN6fJdXNqpyacWwz5XuUFZiKj8c0",
  authDomain: "prepwise-ff1fd.firebaseapp.com",
  projectId: "prepwise-ff1fd",
  storageBucket: "prepwise-ff1fd.firebasestorage.app",
  messagingSenderId: "569709246742",
  appId: "1:569709246742:web:1ef63635cdd23f5359b837",
  measurementId: "G-L9MY1F4TKJ"
};


const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);