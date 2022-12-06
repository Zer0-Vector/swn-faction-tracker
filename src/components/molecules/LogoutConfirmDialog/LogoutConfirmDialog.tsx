import React, { useCallback, useContext } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { useAuth } from "../../../hooks/useAuth";
import ConfirmDialog from "../ConfirmDialog";

const LogoutConfirmDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      uiController.setLoginState("LOGOUT_WAITING");
      await logout();
      uiController.setLoginState("LOGGED_OUT");
    } catch (reason) {
      console.error("Logout failed: ", reason);
      uiController.setLoginState("LOGGED_IN");
    }
  }, [logout, uiController]);

  const handleCancel = useCallback(() => {
    uiController.setLoginState("LOGGED_IN");
  }, [uiController]);

  const open = uiState.loginState === "LOGGING_OUT";

  console.log("Rendering LogoutConfirmDialog...");

  return (
    <ConfirmDialog
      data-testid="logout-confirmation"
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
