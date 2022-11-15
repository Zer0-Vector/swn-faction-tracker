import React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface MessageDialogProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  id: string;
  buttonText?: string;
}

const MessageDialog = ({ open, title, message, onClose, id, buttonText }: MessageDialogProps) => {
  return (
    <Dialog open={open} fullWidth={true} maxWidth="xs" data-testid={`${id}-dialog`}>
      <DialogTitle data-testid={`${id}-dialog-title`}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText data-testid={`${id}-dialog-message`}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-testid={`${id}-dialog-close-button`}>{buttonText || "Close"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
