import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { FirebaseApp } from "../../../firebase-init";
import Nullable from "../../../types/Nullable";
import { ValidationInfo } from "../../../types/ValidationInfo";

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
  const emailRef = useRef<Nullable<HTMLInputElement>>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const open = uiState.loginState === "REGISTERING"
    || uiState.loginState === "REGISTER_WAITING";

  const submitDisabled = !emailValid.hasChanged || !emailValid.valid
    || !passwordValid.hasChanged || !passwordValid.valid
    || !confirmValid.hasChanged || !confirmValid.valid
    || !matchingValid;

  const clearField = (field: Nullable<HTMLInputElement>) => {
    if (field !== null) {
      field.value = "";
    }
  };

  const handleClearForm = useCallback(() => {
    clearField(emailRef.current);
    clearField(passwordRef.current);
    clearField(confirmRef.current);
    setErrorMessage(null);
  }, []);

  const handleRegister = useCallback((evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorMessage(null);
    if (!emailRef.current || !passwordRef.current || submitDisabled) {
      console.warn("Cannot submit: ", !!emailRef.current, !!passwordRef.current, submitDisabled);
      return;
    }

    uiController.setLoginState("REGISTER_WAITING");
    createUserWithEmailAndPassword(getAuth(FirebaseApp), emailRef.current.value, passwordRef.current.value)
      .then(cred => {
        return sendEmailVerification(cred.user)
          .then(() => {
            console.info("Registered and verification sent.");
            uiController.setLoginState("REGISTERED"); // show email verification instructions
            handleClearForm();
          }, (reason: FirebaseError) => {
            console.error("Could not send email verification: ", reason);
            uiController.setLoginState("VERIFICATION_ERROR"); //  show error dialog with resend link
          });
      }, (reason: FirebaseError) => {
        console.error("Could not register: ", reason);
        setErrorMessage(`Error registering (${reason.code}).`);
        uiController.setLoginState("REGISTERING");
      });
  }, [handleClearForm, submitDisabled, uiController]);

  const handleCancel = useCallback(() => {
    uiController.setLoginState("LOGGING_IN");
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return !info.hasChanged || info.valid;
  };

  useEffect(() => {
    setMatchingValid(!(passwordValid.hasChanged && confirmValid.hasChanged) || (confirmRef.current !== null && passwordRef.current !== null && confirmRef.current.value === passwordRef.current.value));
  }, [confirmRef.current?.value, confirmValid.hasChanged, passwordRef.current?.value, passwordValid.hasChanged]);

  console.debug("Rendering RegistrationDialog...");

  return (
    <Dialog open={open} maxWidth="sm" fullWidth={true} data-testid="registration-dialog">
      <form onSubmit={handleRegister}>
        <DialogTitle>Registration</DialogTitle>
        <DialogContent>
          <DialogContentText marginBottom={2}>Enter your email and create a password.</DialogContentText>
          {errorMessage ? <Typography color="error" marginBottom={2} data-testid="registration-dialog-error-message">{errorMessage}</Typography> : null}
          <Container sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 1
          }}>
            <TextField
              label="Email"
              error={!isValid(emailValid)}
              onChange={getChangeHandler(setEmailValid)}
              autoFocus={true}
              inputRef={emailRef}
            />
            <TextField
              type="password"
              label="Password"
              error={!isValid(passwordValid) || !matchingValid}
              onChange={getChangeHandler(setPasswordValid)}
              inputRef={passwordRef}
            />
            <TextField
              type="password"
              label="Confirm Password"
              error={!isValid(confirmValid) || !matchingValid}
              onChange={getChangeHandler(setConfirmValid)}
              inputRef={confirmRef}
            />
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined" data-testid="registration-dialog-cancel-button">Back</Button>
          <Button type="submit" disabled={submitDisabled} data-testid="registration-dialog-register-button">Register</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegistrationDialog;
