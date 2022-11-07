import React, { useEffect, useRef, useState } from "react";

import { SxProps, Theme } from "@mui/material";
import TextField from "@mui/material/TextField";

import StatText from "./StatText";

interface EditableNameTextProps {
  children: string | number;
  updateValue: (newValue: string) => void;
  sx?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;
}

export default function EditableStatText({ children, updateValue, sx, inputSx }: EditableNameTextProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      textFieldRef.current?.select();
    }
  }, [isEditing]);
  
  const exitEditMode = (evt: React.SyntheticEvent<Element>) => {
    if (!updateValue) { 
      return;
    }
    evt.preventDefault();
    if (isEditing && hasChanged) {
      updateValue(textFieldRef.current?.value || children?.toString() || "");
      setHasChanged(false);
    }
    setIsEditing(false);
  };

  const enterEditMode = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    setIsEditing(true);
  };

  const handleClick = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
  };

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLElement>) => {
    if (isEditing) {
      if (evt.key === 'Escape') {
        setIsEditing(false);
      } else if (evt.key === 'Enter') {
        exitEditMode(evt);
      }
    }
  };

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setHasChanged(true);
    textFieldRef.current?.focus();
  };

  const validate = (val: string | undefined): boolean => {
    if (!val) {
      return false;
    }
    
    try {
      const n = parseInt(val);
      return !isNaN(n) && n >= 0;
    } catch {
      return false;
    }
  };
    
  if (isEditing) {
    return (
      <TextField
        defaultValue={children?.toString()}
        inputRef={textFieldRef}
        variant="filled"
        onBlur={exitEditMode}
        onInput={handleInputChange}
        onClick={handleClick}
        onKeyUp={handleKeyUp}
        autoComplete="off"
        error={validate(textFieldRef.current?.value)}
        sx={inputSx}
        size="small"
      />
    );
  } else {
    return (
      <StatText
        onClick={handleClick}
        onDoubleClick={enterEditMode}
        title="Double-click to edit"
        sx={sx}
      >
        {children}
      </StatText>
    );
  }
}
