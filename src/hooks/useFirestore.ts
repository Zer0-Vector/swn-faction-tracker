import { getFirestore } from "firebase/firestore";
import { FirebaseApp } from "../firebase-init";

export const useFirestore = () => getFirestore(FirebaseApp);
