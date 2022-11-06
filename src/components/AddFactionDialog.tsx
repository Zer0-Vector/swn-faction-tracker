import React, { useContext, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { GameContext } from "../contexts/GameContext/GameContext";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

type AddFactionDialogProps = {
  open: boolean,
  onClose: () => void,
  onCreate: (val: string) => void,
};

type FormInfo = {
  text: string,
  valid: boolean,
};

export default function AddFactionDialog({ open, onClose, onCreate }: AddFactionDialogProps) {
  const { state } = useContext(GameContext);
  const { factions } = state;

  const [formState, setFormState] = useState<FormInfo>({text: "", valid: false});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newText = evt.target.value;
    const nameExists = Object.keys(factions).includes(newText);
    const isNotBlank = newText.trim().length > 0;
    const newState = {
      text: newText,
      valid: isNotBlank && !nameExists,
    };
    setFormState(newState);
  };
  
  const handleClose = () => {
    setFormState({ text: "", valid: false });
    inputRef.current?.focus();
    onClose();
  };

  const handleCancel = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    handleClose();
  };

  const handleCreate = () => {
    if (formState.valid) {
      onCreate(formState.text);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Faction</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ paddingBottom: "1rem" }}>
          Enter a unique name for the new faction.
        </DialogContentText>
        <TextField
          id="faction-name"
          label="Faction Name"
          variant="filled"
          inputRef={inputRef}
          type="text"
          placeholder="Enter Faction Name"
          autoFocus={true}
          value={formState.text}
          onInput={handleInputChange}
          error={!formState.valid && formState.text !== ""}
          fullWidth={true}
          autoComplete="off"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!formState.valid}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
