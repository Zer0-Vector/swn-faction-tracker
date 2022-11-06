import React, { useEffect, useRef, useState } from "react";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { SxProps, Theme } from "@mui/material";
import StatText from "../StatText";

type EditableNameTextProps = {
  children: string | number,
  updateValue: (newValue: string) => void,
  sx?: SxProps<Theme>,
  inputSx?: SxProps<Theme>,
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

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    if (isEditing && evt.key === 'Escape') {
      setIsEditing(false);
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
      <FormControl
        onSubmit={exitEditMode}
        onKeyUp={handleKeyUp}
        component="form"
      >
        <TextField
          defaultValue={children?.toString()}
          inputRef={textFieldRef }
          variant="filled"
          onBlur={exitEditMode}
          onInput={handleInputChange}
          onClick={handleClick}
          autoComplete="off"
          error={validate(textFieldRef.current?.value)}
          sx={inputSx}
        />
      </FormControl>
    );
  } else {
    return (
      <StatText
        onClick={handleClick}
        onDoubleClick={enterEditMode}
        title="Double-click to edit"
        sx={{...sx, margin: "auto"}}
      >
        {children}
      </StatText>
    );
  }
}