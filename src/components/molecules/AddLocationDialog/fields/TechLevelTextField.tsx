import React, { forwardRef } from "react";

import { MenuItem, TextField } from "@mui/material";

import { isInteger, LocationDialogFieldHandles, LocationDialogTextFieldProps, useLocationDialogHooks } from "./utils";

const TechLevelTextField = forwardRef<LocationDialogFieldHandles, LocationDialogTextFieldProps>(
  ({ onValidityChange }, ref) => {
    const {info: tlText, inputRef, inputHandler} = useLocationDialogHooks(isInteger, ref, onValidityChange);
    return (
      <TextField
        id="location-tl"
        label="Tech Level"
        variant="filled"
        inputRef={inputRef}
        autoFocus={false}
        value={tlText.value}
        onChange={inputHandler}
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
    );
  }
);
TechLevelTextField.displayName = "TechLevelTextField"

export default TechLevelTextField;
