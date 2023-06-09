// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNM-tQPGKeAblOqQPqZnBKwRnpGxOvc0Q",
  authDomain: "csc-450-project.firebaseapp.com",
  projectId: "csc-450-project",
  storageBucket: "csc-450-project.appspot.com",
  messagingSenderId: "877784266308",
  appId: "1:877784266308:web:31ab02901a000bc93fae11",
  measurementId: "G-RVEP3DC122",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
