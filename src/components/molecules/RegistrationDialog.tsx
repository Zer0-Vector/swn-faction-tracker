import React, { useCallback, useContext, useMemo } from "react";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { UiStateContext } from "../../contexts/UiStateContext";

const RegistrationDialog = () => {
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const open = useMemo(() => (
    uiState.loginState === "REGISTERING"
    || uiState.loginState === "REGISTER_ERROR"
    || uiState.loginState === "REGISTER_WAITING"
  ), [uiState.loginState]);

  const handleRegister = useCallback((evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
  }, []);

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
            />
            <TextField
              type="password"
              label="Password"
            />
            <TextField
              type="password"
              label="Confirm Password"
            />
          </Container>
        </DialogContent>
        <DialogActions>
          <Button type="submit" data-testid="registration-dialog-register-button">Register</Button>
          <Button data-testid="registration-dialog-cancel-button">Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegistrationDialog;
