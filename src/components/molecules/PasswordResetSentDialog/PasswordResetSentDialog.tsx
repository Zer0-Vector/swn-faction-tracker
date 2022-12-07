import React, { useCallback, useContext } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import MessageDialog from "../../atoms/MessageDialog";

export function PasswordResetSentDialog() {
  const { state, controller } = useContext(UiStateContext);
  const handleClose = useCallback(() => {
    controller.setLoginState("LOGGING_IN");
  }, [controller]);

  return (
    <MessageDialog
      open={state.loginState === "PASSWORD_RESET_SENT"}
      title="Password Reset"
      message="Password reset link sent."
      onAction={handleClose}
      data-testid="reset-sent-dialog"
    />
  );
}
