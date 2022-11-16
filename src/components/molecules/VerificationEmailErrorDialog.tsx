import React, { useCallback, useContext } from "react";
import { getAuth, signOut } from "firebase/auth";

import { UiStateContext } from "../../contexts/UiStateContext";
import { FirebaseApp } from "../../firebase-init";

import MessageDialog from "./MessageDialog";

const VerificationEmailErrorDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const open = uiState.loginState === "VERIFICATION_ERROR";

  const handleClose = useCallback(() => {
    const auth = getAuth(FirebaseApp);
    if (auth.currentUser) {
      signOut(auth).then(() => {
        uiController.setLoginState("LOGGED_OUT");
      }).catch((reason) => {
        console.error("Error signing out: ", reason);
      });
    } else {
      uiController.setLoginState("LOGGED_OUT");
    }
  }, [uiController]);

  return (
    <MessageDialog
      id="verification-error"
      open={open}
      onClose={handleClose}
      title="Error"
      message="An error occurred sending the verification email. Try logging in again later."
    />
  );
};

export default VerificationEmailErrorDialog;
