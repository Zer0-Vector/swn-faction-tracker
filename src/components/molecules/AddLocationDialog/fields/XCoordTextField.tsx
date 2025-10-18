import React, { forwardRef } from "react";

import { TextField } from "@mui/material";

import { isInteger, LocationDialogFieldHandles, LocationDialogTextFieldProps, useLocationDialogHooks } from "./utils";

const XCoordTextField = forwardRef<LocationDialogFieldHandles, LocationDialogTextFieldProps>(
  ({ onValidityChange }, ref) => {
  const {info: coordX, inputRef, inputHandler} = useLocationDialogHooks(isInteger, ref, onValidityChange);
  return (
    <TextField
      id="location-x"
      label="X"
      variant="filled"
      inputRef={inputRef}
      type="number"
      placeholder="X Coordinate"
      autoFocus={false}
      value={coordX.value}
      onInput={inputHandler}
      error={!coordX.valid}
      autoComplete="off"
      fullWidth={true}
      data-testid="location-x-field"
    />
  );
})
XCoordTextField.displayName = "XCoordTextField";

export default XCoordTextField;
