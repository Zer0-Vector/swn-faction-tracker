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
import TextField from "@mui/material/TextField";

import { GameContext } from "../contexts/GameContext";
import FormInfo from "../types/FormInfo";
import LocationInfo from "../types/LocationInfo";

interface AddLocationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (loc: LocationInfo) => void;
}

const BLANK_FORM_INFO: FormInfo = { value: "", valid: false };

export default function AddLocationDialog({ open, onClose, onCreate }: AddLocationDialogProps) {
  const { state } = useContext(GameContext);
  const [nameText, setNameText] = useState<FormInfo>({value: "", valid: false});
  const [tlText, setTlText] = useState<FormInfo>({value: "", valid: false});
  const [xText, setXText] = useState<FormInfo>({value: "", valid: false});
  const [yText, setYText] = useState<FormInfo>({value: "", valid: false});
  const inputRef = useRef<HTMLInputElement>(null);

  const locationNames = useMemo(() => state.getLocations().map(loc => loc.name), [state]);

  const handleChange = (setter: (val: FormInfo)=>void, valid?: (val: string)=>boolean) => (evt: React.ChangeEvent<HTMLInputElement>) => {
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

  const isNotDuplicateName = (val: string) => {
    return !locationNames.includes(val);
  };

  const isInteger = (val: string) => {
    try {
      parseInt(val);
      return true;
    } catch {
      return false;
    }
  };

  const handleClose = () => {
    setNameText(BLANK_FORM_INFO);
    setTlText(BLANK_FORM_INFO);
    setXText(BLANK_FORM_INFO);
    setYText(BLANK_FORM_INFO);
    inputRef.current?.focus();
    onClose();
  };

  const handleCancel = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    handleClose();
  };

  const handleCreate = () => {
    if (allValid()) {
      onCreate({ 
        name: nameText.value,
        tl: parseInt(tlText.value),
        x: parseInt(xText.value),
        y: parseInt(yText.value),
        rank: locationNames.length,
      });
    }
    handleClose();
  };

  const allValid = useCallback(() => {
    return nameText.valid && tlText.valid && xText.valid && yText.valid;
  }, [nameText.valid, tlText.valid, xText.valid, yText.valid]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Faction</DialogTitle>
      <DialogContent>
        <DialogContentText sx={theme => ({ paddingBottom: theme.spacing(2) })}>
          Enter the new location&apos;s details.
        </DialogContentText>
        <FormControl sx={theme => ({
          display: "flex",
          gap: theme.spacing(2),
        })}>
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
          >
            <MenuItem value="0">0</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </TextField>
          <Box sx={theme => ({ display: "flex", gap: theme.spacing(2) })}>
            <TextField
              id="location-x"
              label="X"
              variant="filled"
              type="number"
              placeholder="X Coordinate"
              autoFocus={false}
              value={xText.value}
              onInput={handleChange(setXText, isInteger)}
              error={!xText.valid}
              autoComplete="off"
            />
            <TextField
              id="location-y"
              label="Y"
              variant="filled"
              type="number"
              placeholder="Y Coordinate"
              autoFocus={false}
              value={yText.value}
              onInput={handleChange(setYText, isInteger)}
              error={!yText.valid}
              autoComplete="off"
            />
          </Box>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!allValid()}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
