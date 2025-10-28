import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";

import { IUiStateController } from "../../controllers/UiStateController";
import { FirebaseApp } from "../../firebase-init";
import Nullable from "../../types/Nullable";
import { ProvidedAuth } from "../../types/ProvidedAuth";

export function useAuthProvider(controller: IUiStateController): ProvidedAuth {
  const [user, setUser] = useState<Nullable<User>>(null);

  const AUTH = useMemo(() => {
    const auth = firebaseAuth.getAuth(FirebaseApp)
    const mode = import.meta.env.MODE;
    if (mode === "development" || mode === "integration-test") {
     firebaseAuth.connectAuthEmulator(auth, "http://127.0.0.1:9099");
    }
    return auth;
  }, []);

  useEffect(() => {
    firebaseAuth
      .setPersistence(AUTH, firebaseAuth.browserLocalPersistence)
      .catch((error_) => {
        console.error("Error setting auth persistence: ", error_);
      });
  }, [AUTH]);

  useEffect(() => {
    return AUTH.onAuthStateChanged((loggedInUser) => {
      console.log("AuthStateChanged: logged in? ", !!loggedInUser);
      if (loggedInUser) {
        console.log("Login detected: ", loggedInUser.email);
        setUser(loggedInUser);
        controller.setLoginState("LOGGED_IN");
      } else if (user) {
        setUser(null);
        controller.setLoginState("LOGGED_OUT");
      }
    });
  }, [AUTH, controller]);

  return {
    currentUser: user,

    login: async (email: string, password: string) => {
      const { user } = await firebaseAuth.signInWithEmailAndPassword(
        AUTH,
        email,
        password
      );
      setUser(user);
      return user;
    },

    logout: async () => {
      await firebaseAuth.signOut(AUTH);
      setUser(null);
    },

    signup: async (email: string, password: string) => {
      const { user } = await firebaseAuth.createUserWithEmailAndPassword(
        AUTH,
        email,
        password
      );
      setUser(user);
      return user;
    },

    sendEmailVerification: (user: User) => {
      return firebaseAuth.sendEmailVerification(user);
    },

    sendPasswordResetEmail: async (email: string) => {
      await firebaseAuth.sendPasswordResetEmail(AUTH, email);
    },
  };
}
