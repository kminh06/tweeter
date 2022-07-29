// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlnfyhFkYeGWFJ3bMV8OttmiqF7Nxj1nc",
  authDomain: "kminh06-forum.firebaseapp.com",
  projectId: "kminh06-forum",
  storageBucket: "kminh06-forum.appspot.com",
  messagingSenderId: "931175811787",
  appId: "1:931175811787:web:c51b93608403334b46a94e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);