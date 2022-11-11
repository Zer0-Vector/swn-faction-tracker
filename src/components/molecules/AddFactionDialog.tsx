import React, { useContext, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { GameContext } from "../../contexts/GameContext";
import FormInfo from "../../types/FormInfo";

interface AddFactionDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (val: string) => void;
}

export default function AddFactionDialog({ open, onClose, onCreate }: AddFactionDialogProps) {
  const { state } = useContext(GameContext);
  const [formState, setFormState] = useState<FormInfo>({value: "", valid: false});
  const inputRef = useRef<HTMLInputElement>(null);

  const factions = state.getFactions().map(f => f.name);

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    console.debug("input changed!", factions);
    const newText = evt.target.value;
    const nameExists = factions.includes(newText);
    const isNotBlank = newText.trim().length > 0;
    const newState = {
      value: newText,
      valid: isNotBlank && !nameExists,
    };
    console.debug(isNotBlank, !nameExists);
    setFormState(newState);
  };
  
  const handleClose = () => {
    setFormState({ value: "", valid: false });
    inputRef.current?.focus();
    onClose();
  };

  const handleCancel = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    handleClose();
  };

  const handleCreate = () => {
    if (formState.valid) {
      onCreate(formState.value);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose} data-testid="add-faction-dialog">
      <DialogTitle data-testid="add-faction-dialog-title">Add Faction</DialogTitle>
      <DialogContent>
        <DialogContentText sx={theme => ({ paddingBottom: theme.spacing(2) })} data-testid="add-faction-dialog-content-text">
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
          value={formState.value}
          onInput={handleInputChange}
          error={!formState.valid && formState.value !== ""}
          fullWidth={true}
          autoComplete="off"
          data-testid="add-faction-dialog-faction-name-field"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} data-testid="add-faction-dialog-cancel-button">Cancel</Button>
        <Button onClick={handleCreate} disabled={!formState.valid} data-testid="add-faction-dialog-confirm-button">Create</Button>
      </DialogActions>
    </Dialog>
  );
}
