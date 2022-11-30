import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import { FirebaseError } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from "firebase/auth";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { SxProps } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { FirebaseApp } from "../../../firebase-init";
import Nullable from "../../../types/Nullable";
import { ValidationInfo } from "../../../types/ValidationInfo";
import Link from "../../atoms/Link";

export default function LoginDialog() {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const [usernameValid, setUsernameValid] = useState<ValidationInfo>({hasChanged: false, valid: false});
  const [passwordValid, setPasswordValid] = useState({hasChanged: false, valid: false});
  const emailRef = useRef<Nullable<HTMLInputElement>>(null);
  const passwordRef = useRef<Nullable<HTMLInputElement>>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const open = uiState.loginState === "LOGGING_IN" || uiState.loginState === "LOGIN_WAITING";

  const handleClearForm = useCallback(() => {
    if (emailRef.current) {
      emailRef.current.value = "";
    }
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
    setUsernameValid({
      hasChanged: false,
      valid: false,
    });
    setPasswordValid({
      hasChanged: false,
      valid: false,
    });
    setErrorMessage(null);
  }, []);

  const handleCancel = useCallback(() => {
    uiController.setLoginState("LOGGED_OUT");
    handleClearForm();
  }, [handleClearForm, uiController]);

  const handleLogin = useCallback<React.FormEventHandler<HTMLFormElement>>((evt) => {
    evt.preventDefault();
    const username = emailRef.current?.value;
    const password = passwordRef.current?.value;
    
    if (!username || !password) {
      console.error("Username or password not set: ", username, !!password);
      uiController.setLoginState("LOGGED_OUT");
      return;
    }

    uiController.setLoginState("LOGIN_WAITING");
    const AUTH = getAuth(FirebaseApp);
    setPersistence(AUTH, browserLocalPersistence).then(() => 
      signInWithEmailAndPassword(AUTH, username, password)
    ).then(cred => {
      console.info("Logged in as:", cred.user.email);
      if (cred.user.emailVerified) {
        console.debug("verified");
        uiController.setLoginState("LOGGED_IN");
        handleClearForm();
      } else {
        console.warn("User not email verified");
        uiController.setLoginState("NEEDS_VERIFICATION");
      }
    }).catch((reason: FirebaseError) => {
      console.error("Error logging in: ", reason);
      switch (reason.code) {
        case "auth/user-not-found":
        case "auth/invalid-email":
        case "auth/wrong-password":
          setErrorMessage("Invalid credentials.");
          emailRef.current?.select();
          break;
        case "auth/too-many-requests":
          setErrorMessage("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.");
          break;
        default:
          setErrorMessage(`An error occurred logging in (${reason.code}).`);
          break;
      }
      uiController.setLoginState("LOGGING_IN");
    });
  }, [handleClearForm, uiController]);

  const handleUsernameChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((evt) => {
    setUsernameValid({
      hasChanged: true,
      valid: evt.target.value !== "",
    });
  }, []);

  const handlePasswordChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((evt) => {
    setPasswordValid({
      hasChanged: true,
      valid: evt.target.value !== "",
    });
  }, []);

  const usernameError = usernameValid.hasChanged && !usernameValid.valid;
  const passwordError = passwordValid.hasChanged && !passwordValid.valid;
  const buttonDisabled =
      !usernameValid.hasChanged 
      || !usernameValid.valid
      || !passwordValid.hasChanged
      || !passwordValid.valid;

  const containerSx = useMemo<SxProps>(() => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
    textAlign: "center",
  }), []);

  const tfSx = useMemo<SxProps>(() => ({
    gridColumn: "1 / 3",
  }), []);

  const handleRegisterClick = useCallback(
    () => uiController.setLoginState("REGISTERING"), 
    [uiController]
  );
  
  const handlePasswordResetClick = useCallback(
    () => uiController.setLoginState("RESETTING_PASSWORD"),
    [uiController]
  );
  
  console.debug("Rendering LoginDialog...");

  return (
    <Dialog open={open} fullWidth={true} maxWidth="sm" data-testid="login-dialog">
      <form onSubmit={handleLogin} data-testid="login-dialog-form">
        <DialogTitle data-testid="login-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText marginBottom={2}>Enter your credentials.</DialogContentText>
          {errorMessage ? <Typography color="error" marginBottom={2} data-testid="login-dialog-error-message">{errorMessage}</Typography> : null}
          <Container
            disableGutters
            sx={containerSx}>
            <TextField
              id="email"
              label="Email"
              error={usernameError}
              onChange={handleUsernameChange}
              autoComplete="email"
              autoFocus={true}
              inputRef={emailRef}
              sx={tfSx}
              data-testid="login-dialog-email-field"
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              error={passwordError}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              inputRef={passwordRef}
              sx={tfSx}
              data-testid="login-dialog-password-field"
            />
            <Link onClick={handleRegisterClick}>Register</Link>
            <Link onClick={handlePasswordResetClick}>Reset Password</Link>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="login-dialog-cancel-button">Cancel</Button>
          <Button type="submit" disabled={buttonDisabled} data-testid="login-dialog-login-button">Login</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
