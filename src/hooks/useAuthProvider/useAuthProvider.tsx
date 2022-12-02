import { useEffect, useState } from "react";
import { browserLocalPersistence, getAuth, User } from "firebase/auth";
import * as fauth from "firebase/auth";

import { IUiStateController } from "../../controllers/UiStateController";
import { FirebaseApp } from "../../firebase-init";
import { ProvidedAuth } from "../../types/ProvidedAuth";

export function useProvideAuth(controller: IUiStateController): ProvidedAuth {
  const [user, setUser] = useState<User>();

  const AUTH = getAuth(FirebaseApp);

  useEffect(() => {
    fauth.setPersistence(AUTH, browserLocalPersistence)
      .catch(reason => {
        console.error("Error setting auth persistence: ", reason);
      });
  }, [AUTH]);

  useEffect(() => {
    const unsub = AUTH.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        controller.setLoginState("LOGGED_IN");
      } else {
        setUser(undefined);
      }
    });
    return () => unsub();
  }, [AUTH, controller]);

  return {
    user,
    
    login: async (email: string, password: string) => {
      const { user } = await fauth.signInWithEmailAndPassword(AUTH, email, password);
      setUser(user);
      return user;
    },
    
    logout: async () => {
      await fauth.signOut(AUTH);
      setUser(undefined);
    },

    signup: async (email: string, password: string) => {
      const { user } = await fauth.createUserWithEmailAndPassword(AUTH, email, password);
      setUser(user);
      return user;
    },

    sendEmailVerification: async () => {
      if (user) {
        await fauth.sendEmailVerification(user);
      } else {
        throw new Error("User not logged in.");
      }
    },

    sendPasswordResetEmail: async (email: string) => {
      await fauth.sendPasswordResetEmail(AUTH, email);
    },

    confirmPasswordReset: async (code: string, password: string) => {
      await fauth.confirmPasswordReset(AUTH, code, password);
    },
  };
}
