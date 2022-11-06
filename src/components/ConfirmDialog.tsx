import React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface ConfirmDialogProps {
  title: string;
  message: string;
  buttonText?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({ title, message, buttonText, open, onClose, onConfirm }: ConfirmDialogProps) {
  const handleConfirm = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    onConfirm();
    onClose();
  };

  const handleCancel = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogContentText>{message}</DialogContentText>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>{buttonText || "Confirm"}</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
