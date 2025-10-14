import React, { useCallback, useContext, useMemo, useState } from "react";

import Typography from "@mui/material/Typography";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { useAuth } from "../../../hooks/useAuth";
import Link from "../../atoms/Link";
import MessageDialog from "../../atoms/MessageDialog";

const NeedsVerificationDialog = () => {
  const { state: uiState, controller: uiController } =
    useContext(UiStateContext);
  const { currentUser, sendEmailVerification, logout } = useAuth();
  const open =
    uiState.loginState === "NEEDS_VERIFICATION"
    || uiState.loginState === "REGISTERED";
  const [sent, setSent] = useState<boolean>(false);

  const handleResend = useCallback(async () => {
    if (currentUser) {
      try {
        await sendEmailVerification(currentUser);
        console.log("Email sent.");
        setSent(true);
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
    } finally {
      setSent(false);
    }
  }, [logout, uiController]);

  const sendLink = useMemo(
    () =>
      sent ? (
        <Typography color="info" fontStyle="italic">
          Sent!
        </Typography>
      ) : (
        <Link
          onClick={handleResend}
          data-testid="verification-dialog-resend-link"
        >
          Resend Verification Email
        </Link>
      ),
    [handleResend, sent]
  );

  return (
    <MessageDialog
      data-testid="verification-dialog"
      open={open}
      title="Email Verification Required"
      message="Please check your email to verify your email address."
      onAction={handleClose}
      buttons={["Logout"]}
    >
      {sendLink}
    </MessageDialog>
  );
};

export default NeedsVerificationDialog;
