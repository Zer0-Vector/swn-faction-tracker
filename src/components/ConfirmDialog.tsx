import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface ConfirmDialogProps {
  title: string;
  message: string;
  buttonText: string;
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
          <Button onClick={handleConfirm}>{buttonText}</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
