import React, { forwardRef, useCallback } from "react";

import { useLocations } from "@/contexts/LocationContext";
import { TextField } from "@mui/material";

import { LocationDialogFieldHandles, LocationDialogTextFieldProps, useLocationDialogHooks } from "./utils";

const NameTextField = forwardRef<LocationDialogFieldHandles, LocationDialogTextFieldProps>(
  ({ onValidityChange }, ref) => {
    const locations = useLocations();

    const isNotDuplicateName = useCallback(
      (val: string) => locations.checkName({ name: val }),
      [locations]
    );

    const {
      info: nameInfo,
      inputRef,
      inputHandler
    } = useLocationDialogHooks(isNotDuplicateName, ref, onValidityChange);

    // TODO add helperText
    return <TextField
      id="location-name"
      label="Location Name"
      variant="filled"
      inputRef={inputRef}
      type="text"
      placeholder="Enter Location Name"
      autoFocus={true}
      value={nameInfo.value}
      error={!nameInfo.valid}
      fullWidth={true}
      autoComplete="off"
      data-testid="location-name-field"
      onInput={inputHandler}
    />
  }
);
NameTextField.displayName = "NameTextField";

export default NameTextField;
