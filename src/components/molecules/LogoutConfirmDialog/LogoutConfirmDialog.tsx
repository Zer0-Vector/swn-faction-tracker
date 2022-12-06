import React, { useCallback, useContext } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { useAuth } from "../../../hooks/useAuth";
import MessageDialog from "../MessageDialog";
import { DialogActionHandler } from "../MessageDialog/MessageDialog";

const LogoutConfirmDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const { logout } = useAuth();

  const handleAction = useCallback<DialogActionHandler>(async (action, reason) => {
    if (reason !== "Logout") {
      uiController.setLoginState("LOGGED_IN");
    } else {
      try {
        uiController.setLoginState("LOGOUT_WAITING");
        await logout();
        uiController.setLoginState("LOGGED_OUT");
      } catch (reason) {
        console.error("Logout failed: ", reason);
        uiController.setLoginState("LOGGED_IN");
      }
    }
  }, [logout, uiController]);

  console.log("Rendering LogoutConfirmDialog...");

  return (
    <MessageDialog 
      data-testid="logout-confirmation"
      title="Confirm Logout"
      message="Logout?"
      buttons={["Cancel", "Logout"]}
      closeable={false}
      onAction={handleAction}
      open={uiState.loginState === "LOGGING_OUT"}
    />
  );
};

export default LogoutConfirmDialog;
