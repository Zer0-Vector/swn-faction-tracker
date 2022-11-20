import React, { useCallback, useContext } from "react";
import { FirebaseError } from "firebase/app";
import { getAuth, sendEmailVerification, signOut } from "firebase/auth";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { FirebaseApp } from "../../../firebase-init";
import Link from "../../atoms/Link";
import MessageDialog from "../MessageDialog";

const NeedsVerificationDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const open = uiState.loginState === "NEEDS_VERIFICATION" || uiState.loginState === "REGISTERED";
  
  const handleResend = useCallback(() => {
    const currentUser = getAuth(FirebaseApp).currentUser;
    if (currentUser) {
      sendEmailVerification(currentUser).then(() => {
        console.log("Email sent.");
      }).catch((reason) => {
        console.error("Error sending email verification: ", reason);
        uiController.setLoginState("VERIFICATION_ERROR");
      });
    } else {
      console.error("Cannot sendEmailVerification. No currentUser set.");
    }
  }, [uiController]);

  const handleClose = useCallback(() => {
    signOut(getAuth(FirebaseApp)).then(() => {
      uiController.setLoginState("LOGGED_OUT");
    }).catch((reason: FirebaseError) => {
      console.warn("Log out failed: ", reason);
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
      <Link onClick={handleResend} data-testid="verification-dialog-resend-link">Resend Verification Email</Link>
    </MessageDialog>
  );
};

export default NeedsVerificationDialog;
