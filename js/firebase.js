// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDYX1BCgVLKCy3SMFl88XxXG9ne-t1ub7U",

  authDomain: "absorb-284b3.firebaseapp.com",

  projectId: "absorb-284b3",

  storageBucket: "absorb-284b3.appspot.com",

  messagingSenderId: "180851909476",

  appId: "1:180851909476:web:37222cefc16108aabc5071",

  measurementId: "G-QGJ9334673"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(firebaseConfig);