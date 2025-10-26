// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// cSpell:disable
const firebaseConfig = {
  apiKey: "AIzaSyBkP-QvLft922K78h2flnbQaJgQGHJeeSM",
  authDomain: "swn-factions.firebaseapp.com",
  projectId: "swn-factions",
  storageBucket: "swn-factions.firebasestorage.app",
  messagingSenderId: "754249508647",
  appId: "1:754249508647:web:1c97a76aa63ee8cf97eb02",
  measurementId: "G-S5RZ10295Z",
};
// cSpell:enable

console.log("Configuring Firebase: ", firebaseConfig.projectId);
console.log(`===> ${import.meta.env.MODE} mode <===`);

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
console.log("Firebase App initialized: ", !!FirebaseApp, FirebaseApp?.name || "");


if (import.meta.env.DEV) {
  console.log(`ReCaptcha site key from env: ${!!import.meta.env.VITE_RECAPTCHA_SITE_KEY}`);
  const debugToken = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN || process.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
  console.log(`App Check debug token from env: ${!!debugToken}`);
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken || true; // NOSONAR
}

if (import.meta.env.PROD && self.FIREBASE_APPCHECK_DEBUG_TOKEN) { // NOSONAR
  console.warn("App Check debug token should not be used in production!");
}

export const FirebaseAppCheck = initializeAppCheck(FirebaseApp, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});


