// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdl-XcJbOPjmlUXqSCW56Vs5pfe7XlGk0",
  authDomain: "slurp-retails.firebaseapp.com",
  projectId: "slurp-retails",
  storageBucket: "slurp-retails.firebasestorage.app",
  messagingSenderId: "946612565396",
  appId: "1:946612565396:web:763b7a3f352c2206ae4b81",
  measurementId: "G-N65HJC7MVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;


