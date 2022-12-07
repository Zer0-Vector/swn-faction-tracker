import { useEffect, useState } from "react";
import { browserLocalPersistence, getAuth, User } from "firebase/auth";
import * as fauth from "firebase/auth";

import { IUiStateController } from "../../controllers/UiStateController";
import { FirebaseApp } from "../../firebase-init";
import Nullable from "../../types/Nullable";
import { ProvidedAuth } from "../../types/ProvidedAuth";

export function useAuthProvider(controller: IUiStateController): ProvidedAuth {
  const [user, setUser] = useState<Nullable<User>>(null);

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
      }
    });
    return () => unsub();
  }, [AUTH, controller]);

  return {
    currentUser: user,
    
    login: async (email: string, password: string) => {
      const { user } = await fauth.signInWithEmailAndPassword(AUTH, email, password);
      setUser(user);
      return user;
    },
    
    logout: async () => {
      await fauth.signOut(AUTH);
      setUser(null);
    },

    signup: async (email: string, password: string) => {
      const { user } = await fauth.createUserWithEmailAndPassword(AUTH, email, password);
      setUser(user);
      return user;
    },

    sendEmailVerification: (user: User) => {
      return fauth.sendEmailVerification(user);
    },

    sendPasswordResetEmail: async (email: string) => {
      await fauth.sendPasswordResetEmail(AUTH, email);
    },
  };
}
