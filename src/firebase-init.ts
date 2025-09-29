// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;
const firebaseConfig = JSON.parse(firebaseConfigString);

console.log("Configured Firebase: ", firebaseConfig.projectId)

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
