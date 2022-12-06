import React, { useCallback } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import TestableProps from "../../../types/TestableProps";

interface MessageDialogProps extends TestableProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
  children?: React.ReactNode;
}

const MessageDialog = ({ open, title, message, onClose, buttonText, children, "data-testid": dtid }: MessageDialogProps) => {
  return (
    <Dialog open={open} fullWidth={true} maxWidth="xs" data-testid={dtid}>
      <DialogTitle data-testid="message-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText marginBottom={theme => theme.spacing(1.5)} data-testid="message-dialog-message">{message}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-testid="message-dialog-close-button">{buttonText || "Close"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
