import React, { useEffect, useRef, useState } from "react";

import { SxProps, Theme } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import TextField from "@mui/material/TextField";
import Typography, { TypographyPropsVariantOverrides } from "@mui/material/Typography";
import { OverridableStringUnion } from "@mui/types";

interface EditableNameTextProps {
  children: string;
  onUpdate: (newValue: string) => void;
  variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
  sx?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;
}

export default function EditableNameText({ children, onUpdate, variant, sx, inputSx }: EditableNameTextProps) {
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

  const exitEditMode = (evt: React.SyntheticEvent<HTMLElement>) => {
    evt.preventDefault();
    if (isEditing && hasChanged) {
      console.debug(`Changing ${textFieldRef.current}: ${textFieldRef.current?.value}`);
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

  if (isEditing) {
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
