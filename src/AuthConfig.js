// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBYhhNeMobYdV9i7xO1KlTBjuzoBDMzzM",
  authDomain: "authfour-92484.firebaseapp.com",
  projectId: "authfour-92484",
  storageBucket: "authfour-92484.appspot.com",
  messagingSenderId: "338032605596",
  appId: "1:338032605596:web:74bb92bff352fb4ebe3059"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const FBAuth = getAuth(app)