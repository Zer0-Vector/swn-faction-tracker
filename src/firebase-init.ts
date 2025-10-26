// Import the functions you need from the SDKs you need
import type { FirebaseOptions } from "firebase/app";
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = ((): FirebaseOptions => {
  if (import.meta.env.VITE_FIREBASE_CONFIG) {
    console.log("Loading .env FIREBASE_CONFIG");
    return JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
  } else {
    // cSpell:disable
    return {
      apiKey: "AIzaSyBkP-QvLft922K78h2flnbQaJgQGHJeeSM",
      authDomain: "swn-factions.firebaseapp.com",
      projectId: "swn-factions",
      storageBucket: "swn-factions.firebasestorage.app",
      messagingSenderId: "754249508647",
      appId: "1:754249508647:web:1c97a76aa63ee8cf97eb02",
      measurementId: "G-S5RZ10295Z",
    };
  }
})();

console.log("Configured Firebase: ", firebaseConfig.projectId);

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);

export const FirebaseAppCheck = initializeAppCheck(FirebaseApp, {
  provider: new ReCaptchaV3Provider("6LdjtPcrAAAAACc3HDJNdK36XhFIyWPnWGcZ_Cep"),
  isTokenAutoRefreshEnabled: true,
});
