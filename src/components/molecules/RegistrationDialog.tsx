import React, { useCallback, useContext, useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { UiStateContext } from "../../contexts/UiStateContext";
import Nullable from "../../types/Nullable";
import { ValidationInfo } from "../../types/ValidationInfo";

const DEFAULT_VALIDATION_INFO: ValidationInfo = {
  hasChanged: false,
  valid: false,
};

const RegistrationDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const [emailValid, setEmailValid] = useState<ValidationInfo>(DEFAULT_VALIDATION_INFO);
  const [passwordValid, setPasswordValid] = useState<ValidationInfo>(DEFAULT_VALIDATION_INFO);
  const [confirmValid, setConfirmValid] = useState<ValidationInfo>(DEFAULT_VALIDATION_INFO);
  const [matchingValid, setMatchingValid] = useState<boolean>(false);
  const confirmRef = useRef<Nullable<HTMLInputElement>>(null);
  const passwordRef = useRef<Nullable<HTMLInputElement>>(null);

  const open = uiState.loginState === "REGISTERING"
    || uiState.loginState === "REGISTER_ERROR"
    || uiState.loginState === "REGISTER_WAITING";

  const handleRegister = useCallback((evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
  }, []);

  const getChangeHandler = (setter: React.Dispatch<React.SetStateAction<ValidationInfo>>) => (
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setter({
        hasChanged: true,
        valid: evt.target.value.length > 0,
      });
    }
  );

  const isValid = (info: ValidationInfo) => {
    return info.hasChanged && info.valid;
  };

  const enabledButton = isValid(emailValid) && isValid(passwordValid) && isValid(confirmValid) && matchingValid;

  useEffect(() => {
    setMatchingValid(confirmRef.current !== null && passwordRef.current !== null && confirmRef.current.value === passwordRef.current.value);
  }, [confirmRef.current?.value, passwordRef.current?.value]);

  console.debug("Rendering RegistrationDialog...");

  return (
    <Dialog open={open} data-testid="registration-dialog">
      <form onSubmit={handleRegister}>
        <DialogTitle>Registration</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your email and create a password.</DialogContentText>
          <Container sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
          }}>
            <TextField
              label="Email"
              error={isValid(emailValid)}
              onChange={getChangeHandler(setEmailValid)}
            />
            <TextField
              type="password"
              label="Password"
              error={isValid(passwordValid) && matchingValid}
              onChange={getChangeHandler(setPasswordValid)}
              inputRef={passwordRef}
            />
            <TextField
              type="password"
              label="Confirm Password"
              error={isValid(confirmValid) && matchingValid}
              onChange={getChangeHandler(setConfirmValid)}
              inputRef={confirmRef}
            />
          </Container>
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!enabledButton} data-testid="registration-dialog-register-button">Register</Button>
          <Button data-testid="registration-dialog-cancel-button">Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegistrationDialog;
