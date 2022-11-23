import React, { useCallback, useContext, useMemo, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { SxProps } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import { GameContext } from "../../../contexts/GameContext";
import FormInfo from "../../../types/FormInfo";
import LocationInfo from "../../../types/LocationInfo";

interface AddLocationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (loc: LocationInfo) => void;
}

type Coordinate<T> = [x: T, y: T];

const BLANK_FORM_INFO: FormInfo = { value: "", valid: false };
const BLANK_COORDS: FormInfo<Coordinate<string>> = { value: ["", ""], valid: false };

type FormInfoSetter = (val: FormInfo) => void;
type StringValidator = (val: string) => boolean;

export default function AddLocationDialog({ open, onClose, onCreate }: AddLocationDialogProps) {
  const { state } = useContext(GameContext);
  const [nameText, setNameText] = useState<FormInfo>(BLANK_FORM_INFO);
  const [tlText, setTlText] = useState<FormInfo>(BLANK_FORM_INFO);
  const [coords, setCoords] = useState<FormInfo<Coordinate<string>>>(BLANK_COORDS);
  const inputRef = useRef<HTMLInputElement>(null);

  const locationsNames = useMemo(() => state.getLocations().map(loc => loc.name), [state]);

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

  const isNotDuplicateName = useCallback((val: string) => !locationsNames.includes(val.trim()), [locationsNames]);

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

  const handleCancel = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    handleClose();
  }, [handleClose]);

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
        id: nameText.value.toLowerCase().replaceAll(/[\W_]+/g, "-"),
        name: nameText.value,
        tl: parseInt(tlText.value),
        x: parseInt(coords.value[0]),
        y: parseInt(coords.value[1]),
      });
    }
    handleClose();
  }, [allValid, coords.value, handleClose, nameText.value, onCreate, tlText.value]);  

  const formCtrlSx = useMemo<SxProps>(() => ({
    display: "flex",
    gap: 2,
  }), []);

  return (
    <Dialog open={open} onClose={onClose} data-testid="add-location-dialog">
      <DialogTitle data-testid="add-location-dialog-title">Add Location</DialogTitle>
      <DialogContent>
        <DialogContentText paddingBottom={2} data-testid="add-location-dialog-content-text">
          Enter the new location&apos;s details.
        </DialogContentText>
        <FormControl sx={formCtrlSx}>
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
            data-testid="add-location-dialog-location-name-field"
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
            data-testid="add-location-dialog-location-tl-field"
          >
            <MenuItem value="0">0</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </TextField>
          <Box display="flex" gap={2}>
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
              data-testid="add-location-dialog-location-x-field"
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
              data-testid="add-location-dialog-location-y-field"
            />
          </Box>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}  data-testid="add-location-dialog-cancel-button">Cancel</Button>
        <Button onClick={handleCreate} disabled={!allValid()}  data-testid="add-location-dialog-confirm-button">Create</Button>
      </DialogActions>
    </Dialog>
  );
}
