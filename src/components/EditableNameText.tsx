import React, { useEffect, useRef, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import { SxProps, Theme } from "@mui/material/styles";
import { Variant } from "@mui/material/styles/createTypography";
import TextField from "@mui/material/TextField";
import Typography, { TypographyPropsVariantOverrides } from "@mui/material/Typography";
import { OverridableStringUnion } from "@mui/types";

import Nullable from "../types/Nullable";

interface EditableNameTextProps {
  children: string;
  onUpdate: (newValue: string) => void;
  variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
  sx?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;
  selectableOptions?: string[];
}

export default function EditableNameText({ children, onUpdate, variant, sx, inputSx, selectableOptions }: EditableNameTextProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      console.debug(`selecting text field: ${textFieldRef.current} - ${isEditing}`);
      textFieldRef.current?.select();
    }
  }, [isEditing]);

  const enterEditMode = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    setIsEditing(true);
  };

  const clickHandler = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
  };

  const exitEditMode = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (isEditing && hasChanged) {
      console.debug(`Changing ${textFieldRef.current?.id}: ${textFieldRef.current?.value}`);
      onUpdate(textFieldRef.current?.value as string);
      setHasChanged(false);
    }
    setIsEditing(false);
  };

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLElement>) => {
    if (evt.key === 'Escape') {
      setIsEditing(false);
    } else if (evt.key === 'Enter') {
      exitEditMode(evt);
    }
  };

  const textChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasChanged) {
      setHasChanged(true);
    }
  };

  const dropdownChanged = (evt: React.SyntheticEvent, val: Nullable<string>) => {
    if (isEditing) {
      if (val !== null && val.trim().length > 0) {
        onUpdate(val);
      }
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (selectableOptions) {
      return (
        <Autocomplete
          disablePortal={true}
          id="autocomplete-faction-homeworld"
          options={selectableOptions}
          openOnFocus={true}
          onChange={dropdownChanged}
          renderInput={params =>
            <TextField
              {...params}
              inputRef={textFieldRef}
              onKeyUp={handleKeyUp}
              onInput={textChanged}
              onClick={clickHandler}
              sx={inputSx}
            />
          }
        />
      );
    } else {
      return (
        <TextField
          inputRef={textFieldRef}
          onKeyUp={handleKeyUp}
          onInput={textChanged}
          onClick={clickHandler}
          defaultValue={children}
          sx={inputSx}
        />
      ); 
    }
  } else {
    return (
      <Typography
        onDoubleClick={enterEditMode}
        onClick={clickHandler}
        variant={variant}
        sx={sx}
        component="span"
      >
        {children}
      </Typography>
    );
  }
}
