import React, { useContext, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { UiStateContext } from "../../contexts/UiStateContext";

export default function LoginDialog() {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const handleCancel = () => {
    uiController.setLoginState("LOGGED_OUT");
  };

  const handleLogin = () => {
    uiController.setLoginState("LOGIN_WAITING");
  };

  return (
    <Dialog open={uiState.loginState === "LOGGING_IN"}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleLogin}>Login</Button>
      </DialogActions>
    </Dialog>
  );
}
