import React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface ConfirmDialogProps {
  id: string;
  title: string;
  message: string;
  buttonText?: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function ConfirmDialog({ id, title, message, buttonText, open, onCancel, onConfirm, children }: ConfirmDialogProps) {
  const handleConfirm = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    onConfirm();
  };

  const handleCancel = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    onCancel();
  };
  
  return (
    <Dialog open={open} onClose={onCancel} data-testid={`${id}-confirm-dialog`}>
      <DialogTitle data-testid={`${id}-confirm-dialog-title`}>{title}</DialogTitle>
      <DialogContent data-testid={`${id}-confirm-dialog-content`}>
        <DialogContentText data-testid={`${id}-confirm-dialog-content-text`}>{message}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} data-testid={`${id}-confirm-dialog-cancel-button`}>Cancel</Button>
        <Button onClick={handleConfirm} data-testid={`${id}-confirm-dialog-confirm-button`}>{buttonText || "Confirm"}</Button>
      </DialogActions>
    </Dialog>
  );
}
