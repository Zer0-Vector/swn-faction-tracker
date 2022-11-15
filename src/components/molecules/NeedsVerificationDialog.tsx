import React, { useCallback, useContext } from "react";
import { FirebaseError } from "firebase/app";
import { getAuth, sendEmailVerification } from "firebase/auth";

import { UiStateContext } from "../../contexts/UiStateContext";
import { FirebaseApp } from "../../firebase-init";
import Link from "../atoms/Link";

import MessageDialog from "./MessageDialog";

const NeedsVerificationDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const open = uiState.loginState === "NEEDS_VERIFICATION";
  const handleResend = useCallback(() => {
    const currentUser = getAuth(FirebaseApp).currentUser;
    if (currentUser) {
      sendEmailVerification(currentUser);
    } else {
      console.error("Cannot sendEmailVerification. No currentUser set.");
    }
  }, []);

  const handleClose = useCallback(() => {
    getAuth(FirebaseApp).signOut().then(() => {
      uiController.setLoginState("LOGGED_OUT");
    }).catch((reason: FirebaseError) => {
      console.error("Log out failed: ", reason);
      uiController.setLoginState("LOGGED_IN");
    });
  }, [uiController]);

  return (
    <MessageDialog
      id="verification"
      open={open}
      title="Email Verification Required"
      message="Please check your email to verify your email address."
      onClose={handleClose}
    >
      <Link onClick={handleResend}>Resend Verification Email</Link>
    </MessageDialog>
  );
};

export default NeedsVerificationDialog;
