import React, { useCallback, useContext } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { useAuth } from "../../../hooks/useAuth";
import Link from "../../atoms/Link";
import MessageDialog from "../MessageDialog";

const NeedsVerificationDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const { currentUser, sendEmailVerification, logout } = useAuth();
  const open = uiState.loginState === "NEEDS_VERIFICATION" || uiState.loginState === "REGISTERED";
  
  const handleResend = useCallback(async () => {
    if (currentUser) {
      try {
        await sendEmailVerification();
        console.log("Email sent.");
      } catch (reason) {
        console.error("Error sending email verification: ", reason);
        uiController.setLoginState("VERIFICATION_ERROR");
      }
    } else {
      console.error("Cannot sendEmailVerification. No User logged in.");
    }
  }, [sendEmailVerification, uiController, currentUser]);

  const handleClose = useCallback(async () => {
    try {
      uiController.setLoginState("LOGOUT_WAITING");
      await logout();
      uiController.setLoginState("LOGGED_OUT");
      console.info("User logged out.");
    } catch (reason) {
      console.warn("Log out failed: ", reason);
      uiController.setLoginState("LOGGED_IN");
    }
  }, [logout, uiController]);

  return (
    <MessageDialog
      data-testid="verification-dialog"
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
