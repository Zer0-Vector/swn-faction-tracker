import React, { useCallback, useContext, useMemo } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import MessageDialog from "../../atoms/MessageDialog";
import { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";

export function PasswordResetErrorDialog() {
  const { state, controller } = useContext(UiStateContext);
  const buttons = useMemo(() => ["OK"], []);
  const handleAction = useCallback<DialogActionHandler>(() => {
    controller.setLoginState("LOGGING_IN");
  }, [controller]);

  return (
    <MessageDialog
      open={state.loginState === "PASSWORD_RESET_ERROR"}
      title="Error"
      message="An error ocurred sending password reset email. Try again later."
      onAction={handleAction}
      buttons={buttons}
      data-testid="reset-error-dialog"
    />
  );
}
