import React, { useCallback } from "react";

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
  children?: React.ReactNode;
  ["data-testid"]?: string;
}

export default function ConfirmDialog({ title, message, buttonText, open, onCancel, onConfirm, children, "data-testid": dtid }: ConfirmDialogProps) {
  const handleConfirm = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback<React.MouseEventHandler<HTMLButtonElement>>((evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    onCancel();
  }, [onCancel]);
  
  return (
    <Dialog open={open} onClose={onCancel} data-testid={dtid}>
      <DialogTitle data-testid="title">{title}</DialogTitle>
      <DialogContent data-testid="content">
        <DialogContentText data-testid="content-text">{message}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions data-testid="actions">
        <Button onClick={handleCancel} data-testid="cancel-button">Cancel</Button>
        <Button onClick={handleConfirm} data-testid="confirm-button">{buttonText || "Confirm"}</Button>
      </DialogActions>
    </Dialog>
  );
}
