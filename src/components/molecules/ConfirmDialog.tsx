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
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, message, buttonText, open, onCancel, onConfirm }: ConfirmDialogProps) {
  const handleConfirm = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    onConfirm();
  };

  const handleCancel = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    onCancel();
  };
  
  return (
    <Dialog open={open} onClose={onCancel}>
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
