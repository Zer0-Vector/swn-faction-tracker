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
import Nullable from "../../types/Nullable";

interface ValidationInfo {
  hasChanged: boolean;
  valid: boolean;
}

export default function LoginDialog() {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const [usernameValid, setUsernameValid] = useState<ValidationInfo>({hasChanged: false, valid: false});
  const [passwordValid, setPasswordValid] = useState({hasChanged: false, valid: false});
  const usernameRef = useRef<Nullable<HTMLInputElement>>(null);
  const passwordRef = useRef<Nullable<HTMLInputElement>>(null);

  const handleClearForm = () => {
    if (usernameRef.current) {
      usernameRef.current.value = "";
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

  const handleLogin = () => {
    uiController.setLoginState("LOGIN_WAITING");
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

  return (
    <Dialog open={uiState.loginState === "LOGGING_IN"}>
      <DialogTitle>Login</DialogTitle>
      <form onSubmit={handleLogin} action=".">
        <DialogContent>
          <DialogContentText sx={{ my: 2 }}>Enter your credientials.</DialogContentText>
          <Container disableGutters sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2}}>
            <TextField
              id="username"
              label="Username"
              error={usernameError}
              onChange={handleUsernameChange}
              autoFocus={true}
              autoComplete="username"
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              error={passwordError}
              onChange={handlePasswordChange}
              autoComplete="current-password"
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
