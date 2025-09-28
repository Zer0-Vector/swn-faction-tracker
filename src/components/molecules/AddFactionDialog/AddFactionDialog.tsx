import React, { useCallback, useMemo, useRef, useState } from "react";

import TextField from "@mui/material/TextField";

import { useFactions } from "../../../contexts/FactionContext";
import FormInfo from "../../../types/FormInfo";
import MessageDialog from "../../atoms/MessageDialog";
import { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";

interface AddFactionDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreate: (val: string) => void;
}

export default function AddFactionDialog({ open, onClose, onCreate }: AddFactionDialogProps) {
  const factions = useFactions();
  const [formState, setFormState] = useState<FormInfo>({value: "", valid: false});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const newText = evt.target.value;
    const uniqueName = factions.checkName({ name: newText });
    const isNotBlank = newText.trim().length > 0;
    const newState = {
      value: newText,
      valid: isNotBlank && uniqueName,
    };
    console.debug(isNotBlank, uniqueName);
    setFormState(newState);
  }, [factions]);

  const handleClose = useCallback(() => {
    setFormState({ value: "", valid: false });
    inputRef.current?.focus();
    onClose();
  }, [onClose]);

  const handleAction = useCallback<DialogActionHandler>((result) => {
    if (result.reason === "Create" && formState.valid) {
      onCreate(formState.value);
    }
    handleClose();
  }, [formState.valid, formState.value, handleClose, onCreate]);

  const buttons = useMemo(() => ["Cancel", "Create"], []);
  const disabledButtons = useMemo(() => !formState.valid ? ["Create"] : [], [formState.valid]);

  return (
    <MessageDialog
      open={open}
      title="Add Faction"
      message="Enter a unique name for the new faction."
      onAction={handleAction}
      buttons={buttons}
      disabledButtons={disabledButtons}
      data-testid="add-faction-dialog"
    >
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
        data-testid="faction-name-field"
      />
    </MessageDialog>
  );
}
