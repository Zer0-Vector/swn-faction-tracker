import React, { useCallback, useContext, useMemo } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { useAuth } from "../../../hooks/useAuth";
import ConfirmDialog from "../ConfirmDialog";

const LogoutConfirmDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    uiController.setLoginState("LOGOUT_WAITING");
    try {
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

  const open = useMemo(() => uiState.loginState === "LOGGING_OUT", [uiState.loginState]);

  console.log("Rendering LogoutConfirmDialog...");

  return (
    <ConfirmDialog
      id="logout"
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
