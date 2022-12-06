import React, { useCallback, useContext } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { useAuth } from "../../../hooks/useAuth";
import MessageDialog from "../MessageDialog";

const VerificationEmailErrorDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const { currentUser, logout } = useAuth();
  const open = uiState.loginState === "VERIFICATION_ERROR";

  const handleClose = useCallback(async () => {
    if (currentUser) {
      try {
        uiController.setLoginState("LOGOUT_WAITING");
        await logout();
        uiController.setLoginState("LOGGED_OUT");
      } catch (reason) {
        console.error("Error signing out: ", reason);
        uiController.setLoginState("LOGGED_IN");
      }
    }
  }, [logout, uiController, currentUser]);

  return (
    <MessageDialog
      data-testid="verification-error-dialog"
      open={open}
      onAction={handleClose}
      title="Error"
      message="An error occurred sending the verification email. Try logging in again later."
      buttons={["Logout"]}
    />
  );
};

export default VerificationEmailErrorDialog;
