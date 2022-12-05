import React, { useCallback, useContext, useMemo, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { ValidationContext } from "../../../contexts/ValidationContext";
import { ValidationController } from "../../../controllers/ValidationController";
import { useAuth } from "../../../hooks/useAuth";
import Nullable from "../../../types/Nullable";
import { ValidatedTextField } from "../../atoms/ValidatedTextField";

export function PasswordResetDialog() {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const { sendPasswordResetEmail } = useAuth();
  const emailRef = useRef<Nullable<HTMLInputElement>>(null);
  const [ready, setReady] = useState<boolean>(false);

  const open = uiState.loginState === "RESETTING_PASSWORD";

  const handleCancel = useCallback(() => {
    uiController.setLoginState("LOGGING_IN");
  }, [uiController]);

  const validator = useMemo(() => new ValidationController({
    "password-reset-email": (val: string) => {
      return val.trim().length > 0;
    },
  }), []);

  const handleSendReset = useCallback(async () => {
    if (validator.isAllValid() && emailRef.current) {
      try {
        const email = emailRef.current.value;
        uiController.setLoginState("PASSWORD_RESET_WAITING");
        await sendPasswordResetEmail(email);
        console.info(`Password reset email sent to "${email}"`);
        uiController.setLoginState("PASSWORD_RESET_SENT");
      } catch (reason) {
        console.error("Error sending password reset email:", reason);
        uiController.setLoginState("PASSWORD_RESET_ERROR");
      }
    }
  }, [sendPasswordResetEmail, uiController, validator]);

  const handleChange = useCallback(() => {
    setReady(validator.isAllValid());
  }, [validator]);

  return (
    <Dialog open={open} data-testid="password-reset-dialog">
      <DialogTitle>Password Reset</DialogTitle>
      <DialogContent>
        <DialogContentText data-testid="message">
          Enter the email for your account:
        </DialogContentText>
        <ValidationContext.Provider value={validator}>
          <ValidatedTextField
            id="password-reset-email"
            data-testid="email-textfield"
            inputRef={emailRef}
            label="Email"
            onChange={handleChange}
          />
        </ValidationContext.Provider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSendReset} disabled={!ready}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
