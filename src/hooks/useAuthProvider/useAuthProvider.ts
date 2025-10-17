import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";

import { IUiStateController } from "../../controllers/UiStateController";
import { FirebaseApp } from "../../firebase-init";
import Nullable from "../../types/Nullable";
import { ProvidedAuth } from "../../types/ProvidedAuth";

export function useAuthProvider(controller: IUiStateController): ProvidedAuth {
  const [user, setUser] = useState<Nullable<User>>(null);

  const AUTH = firebaseAuth.getAuth(FirebaseApp);

  useEffect(() => {
    firebaseAuth
      .setPersistence(AUTH, firebaseAuth.browserLocalPersistence)
      .catch((reason) => {
        console.error("Error setting auth persistence: ", reason);
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
