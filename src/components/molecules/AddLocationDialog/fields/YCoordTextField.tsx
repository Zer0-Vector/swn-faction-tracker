import React, { forwardRef } from "react";

import { TextField } from "@mui/material";

import { isInteger, LocationDialogFieldHandles, LocationDialogTextFieldProps, useLocationDialogHooks } from "./utils";

const YCoordTextField = forwardRef<LocationDialogFieldHandles, LocationDialogTextFieldProps>(
  ({ onValidityChange }, ref) => {
  const {info: coordY, inputRef, inputHandler} = useLocationDialogHooks(isInteger, ref, onValidityChange);
  return (
    <TextField
      id="location-y"
      label="Y"
      variant="filled"
      inputRef={inputRef}
      type="number"
      placeholder="Y Coordinate"
      autoFocus={false}
      value={coordY.value}
      onInput={inputHandler}
      error={!coordY.valid}
      autoComplete="off"
      fullWidth={true}
      data-testid="location-y-field"
    />
  );
})
YCoordTextField.displayName = "XCoordTextField";

export default YCoordTextField;
