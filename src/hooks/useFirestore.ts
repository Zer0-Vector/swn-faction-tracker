import { useMemo } from "react";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

import { FirebaseApp } from "../firebase-init";

export const useFirestore = () => useMemo(() => {
  const firestore = getFirestore(FirebaseApp);
  const mode = import.meta.env.MODE;
  if (mode === "development" || mode === "integration-test") {
    connectFirestoreEmulator(firestore, "localhost", 8080);
  }
  return firestore;
}, []);
