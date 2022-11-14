import React, { useContext, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { UiStateContext } from "../../contexts/UiStateContext";
import { FirebaseAuth } from "../../firebase-init";
import Nullable from "../../types/Nullable";

interface ValidationInfo {
  hasChanged: boolean;
  valid: boolean;
}

export default function LoginDialog() {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const [usernameValid, setUsernameValid] = useState<ValidationInfo>({hasChanged: false, valid: false});
  const [passwordValid, setPasswordValid] = useState({hasChanged: false, valid: false});
  const emailRef = useRef<Nullable<HTMLInputElement>>(null);
  const passwordRef = useRef<Nullable<HTMLInputElement>>(null);

  const handleClearForm = () => {
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
  };

  const handleCancel = () => {
    uiController.setLoginState("LOGGED_OUT");
    handleClearForm();
  };

  const handleLogin: React.FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    const username = emailRef.current?.value;
    const password = passwordRef.current?.value;
    
    if (!username || !password) {
      console.error("Username or password not set: ", username, !!password);
      uiController.setLoginState("LOGGED_OUT");
      return;
    }

    uiController.setLoginState("LOGIN_WAITING");
    FirebaseAuth.signInWithEmailAndPassword(
      username,
      password
    ).then(cred => {
      console.info("Logged in as ", cred.user?.email);
      uiController.setLoginState("LOGGED_IN");
    }).catch(reason => {
      console.error("Error logging in: ", reason);
      uiController.setLoginState("LOGGED_OUT");
    });
    handleClearForm();
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setUsernameValid({
      hasChanged: true,
      valid: evt.target.value !== "",
    });
  };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setPasswordValid({
      hasChanged: true,
      valid: evt.target.value !== "",
    });
  };

  const usernameError = usernameValid.hasChanged && !usernameValid.valid;
  const passwordError = passwordValid.hasChanged && !passwordValid.valid;
  const buttonDisabled =
      !usernameValid.hasChanged 
      || !usernameValid.valid
      || !passwordValid.hasChanged
      || !passwordValid.valid;

  console.debug("Rendering LoginDialog...");

  return (
    <Dialog open={uiState.loginState === "LOGGING_IN"}>
      <DialogTitle>Login</DialogTitle>
      <form onSubmit={handleLogin}>
        <DialogContent>
          <DialogContentText sx={{ my: 2 }}>Enter your credientials.</DialogContentText>
          <Container disableGutters sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2}}>
            <TextField
              id="email"
              label="Email"
              error={usernameError}
              onChange={handleUsernameChange}
              autoFocus={true}
              autoComplete="email"
              inputRef={emailRef}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              error={passwordError}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              inputRef={passwordRef}
            />
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit" disabled={buttonDisabled}>Login</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
