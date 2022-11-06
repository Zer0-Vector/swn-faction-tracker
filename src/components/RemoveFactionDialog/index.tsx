import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

type RemoveFactionDialogProps = {
  factionName: string | null,
  open: boolean,
  onClose: () => void,
  onConfirm: () => void,
};

export default function RemoveFactionDialog({ factionName, open, onClose, onConfirm }: RemoveFactionDialogProps) {
  const handleRemove = () => {
    onConfirm();
    onClose();
  };
  return (
    <Dialog open={open && factionName !== null} onClose={onClose}>
      <DialogContent>
        <DialogTitle>Confirm Delete Faction</DialogTitle>
        <DialogContentText>Delete faction {`"${factionName}"`}</DialogContentText>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleRemove}>Remove</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}