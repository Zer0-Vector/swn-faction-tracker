import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { ValidationContext } from "../../../contexts/ValidationContext";
import { ValidationController } from "../../../controllers/ValidationController";
import { useAuth } from "../../../hooks/useAuth";
import Nullable from "../../../types/Nullable";
import MessageDialog from "../../atoms/MessageDialog";
import { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";
import { ValidatedTextField } from "../../atoms/ValidatedTextField";

export function PasswordResetDialog() {
  const { state: uiState, controller: uiController } =
    useContext(UiStateContext);
  const { sendPasswordResetEmail } = useAuth();
  const emailRef = useRef<Nullable<HTMLInputElement>>(null);
  const [ready, setReady] = useState<boolean>(false);

  const open = uiState.loginState === "RESETTING_PASSWORD";

  const validator = useMemo(
    () =>
      new ValidationController({
        "password-reset-email": (val: string) => {
          return val.trim().length > 0;
        },
      }),
    []
  );

  const handleChange = useCallback(() => {
    setReady(validator.isAllValid());
  }, [validator]);

  const buttons = useMemo(() => ["Cancel", "OK"], []);
  const disabledButtons = useMemo(() => (ready ? [] : ["OK"]), [ready]);

  const handleAction = useCallback<DialogActionHandler>(
    async (result) => {
      if (result.reason === "OK") {
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
      } else {
        uiController.setLoginState("LOGGING_IN");
      }
    },
    [sendPasswordResetEmail, uiController, validator]
  );

  return (
    <MessageDialog
      open={open}
      buttons={buttons}
      disabledButtons={disabledButtons}
      title="Password Reset"
      message="Enter the email for your account:"
      onAction={handleAction}
      data-testid="password-reset-dialog"
    >
      <ValidationContext.Provider value={validator}>
        <ValidatedTextField
          id="password-reset-email"
          data-testid="email-textfield"
          inputRef={emailRef}
          label="Email"
          onChange={handleChange}
          fullWidth={true}
        />
      </ValidationContext.Provider>
    </MessageDialog>
  );
}
