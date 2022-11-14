import React, { useCallback, useContext, useMemo } from "react";

import { UiStateContext } from "../../contexts/UiStateContext";
import { FirebaseAuth } from "../../firebase-init";

import ConfirmDialog from "./ConfirmDialog";

const LogoutConfirmDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const handleLogout = useCallback(() => {
    uiController.setLoginState("LOGOUT_WAITING");
    FirebaseAuth.signOut().then(() => {
      uiController.setLoginState("LOGGED_OUT");
    }).catch(reason => {
      console.error("Logout failed: ", reason);
      uiController.setLoginState("LOGGED_IN");
    });
  }, [uiController]);

  const handleCancel = useCallback(() => {
    uiController.setLoginState("LOGGED_IN");
  }, [uiController]);

  const open = useMemo(() => uiState.loginState === "LOGGING_OUT", [uiState.loginState]);

  console.log("Rendering LogoutConfirmDialog...");

  return (
    <ConfirmDialog
      title="Confirm Logout"
      message="Logout?"
      buttonText="Logout"
      onConfirm={handleLogout}
      onCancel={handleCancel}
      open={open}
    />
  );
};

export default LogoutConfirmDialog;
