import React, { useCallback, useMemo, useRef, useState } from "react";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { useLocations } from "../../../contexts/LocationContext";
import FormInfo from "../../../types/FormInfo";
import MessageDialog from "../../atoms/MessageDialog";
import { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";

interface AddLocationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (loc: { name: string, tl: number, x: number, y: number }) => void;
}

type Coordinate<T> = [x: T, y: T];

const BLANK_FORM_INFO: FormInfo = { value: "", valid: false };
const BLANK_COORDS: FormInfo<Coordinate<string>> = { value: ["", ""], valid: false };

type FormInfoSetter = (val: FormInfo) => void;
type StringValidator = (val: string) => boolean;

export default function AddLocationDialog({ open, onClose, onCreate }: AddLocationDialogProps) {
  const locations = useLocations();
  const [nameText, setNameText] = useState<FormInfo>(BLANK_FORM_INFO);
  const [tlText, setTlText] = useState<FormInfo>(BLANK_FORM_INFO);
  const [coords, setCoords] = useState<FormInfo<Coordinate<string>>>(BLANK_COORDS);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (setter: FormInfoSetter, valid?: StringValidator) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newText = evt.target.value;
    console.log("validating...");
    const isValid = valid === undefined || valid(newText);
    console.log(isValid ? "valid" : "invalid");
    console.log(`text='${newText}'`);
    const isNotBlank = newText !== undefined && newText.trim().length > 0;
    const newState = {
      value: newText,
      valid: isNotBlank && isValid,
    };
    setter(newState);
  };

  const handleCoordsChange = (index: number) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (index > 1) {
      throw new Error("wtf...index is out of range");
    }

    const newText = evt.target.value;
    console.log(`validating index ${index}...`);
    const newCoords: Coordinate<string> = index === 0 ? [newText, coords.value[1]] : [coords.value[0], newText];
    const isNotBlank = newText !== undefined && newText.trim().length > 0;
    const newState = {
      value: newCoords,
      valid: isNotBlank,
    };
    console.log("setting coords: ", newState);
    setCoords(newState);
  };

  const isNotDuplicateName = useCallback((val: string) => locations.checkName({ name: val }), [locations]);

  const isInteger = (val: string) => {
    try {
      parseInt(val);
      return true;
    } catch {
      return false;
    }
  };

  const handleClose = useCallback(() => {
    setNameText(BLANK_FORM_INFO);
    setTlText(BLANK_FORM_INFO);
    setCoords({ value: ["", ""], valid: false });
    inputRef.current?.focus();
    onClose();
  }, [onClose]);

  const allValid = useCallback(() => {
    return (
      isNotDuplicateName(nameText.value)
      && nameText.valid
      && tlText.valid
      && coords.valid
    );
  }, [coords.valid, isNotDuplicateName, nameText.valid, nameText.value, tlText.valid]);

  const handleCreate = useCallback(() => {
    if (allValid()) {
      onCreate({
        name: nameText.value,
        tl: parseInt(tlText.value),
        x: parseInt(coords.value[0]),
        y: parseInt(coords.value[1]),
      });
    }
  }, [allValid, coords.value, nameText.value, onCreate, tlText.value]);

  const handleAction = useCallback<DialogActionHandler>((result) => {
    if (result.reason === "Create") {
      handleCreate();
    }
    handleClose();
  }, [handleClose, handleCreate]);

  const buttons = useMemo(() => ["Cancel", "Create"], []);
  const disabledButtons = useMemo(() => !allValid() ? ["Create"] : [], [allValid]);

  return (
    <MessageDialog
      open={open}
      message="Enter the new location's details."
      title="Add Location"
      buttons={buttons}
      disabledButtons={disabledButtons}
      onAction={handleAction}
      data-testid="add-location-dialog"
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          id="location-name"
          label="Location Name"
          variant="filled"
          inputRef={inputRef}
          type="text"
          placeholder="Enter Location Name"
          autoFocus={true}
          value={nameText.value}
          onInput={handleChange(setNameText, isNotDuplicateName)}
          error={!nameText.valid}
          fullWidth={true}
          autoComplete="off"
          data-testid="location-name-field"
        />
        <TextField
          id="location-tl"
          label="Tech Level"
          variant="filled"
          inputRef={inputRef}
          autoFocus={false}
          value={tlText.value}
          onChange={handleChange(setTlText, isInteger)}
          error={!tlText.valid}
          fullWidth={true}
          autoComplete="off"
          select={true}
          data-testid="location-tl-field"
        >
          <MenuItem value="0">0</MenuItem>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="4">4</MenuItem>
          <MenuItem value="5">5</MenuItem>
        </TextField>
        <Box display="flex" justifyContent="space-between" gap={2}>
          <TextField
            id="location-x"
            label="X"
            variant="filled"
            type="number"
            placeholder="X Coordinate"
            autoFocus={false}
            value={coords.value[0]}
            onInput={handleCoordsChange(0)}
            error={!coords.valid}
            autoComplete="off"
            fullWidth={true}
            data-testid="location-x-field"
          />
          <TextField
            id="location-y"
            label="Y"
            variant="filled"
            type="number"
            placeholder="Y Coordinate"
            autoFocus={false}
            value={coords.value[1]}
            onInput={handleCoordsChange(1)}
            error={!coords.valid}
            autoComplete="off"
            fullWidth={true}
            data-testid="location-y-field"
          />
        </Box>
      </Box>
    </MessageDialog>
  );
}
