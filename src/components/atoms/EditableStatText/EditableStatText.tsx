import React, { useEffect, useRef, useState } from "react";

import { SxProps, Theme } from "@mui/material";
import TextField from "@mui/material/TextField";

import TestableProps from "../../../types/TestableProps";
import StatText from "../StatText";

export interface EditableStatTextProps extends TestableProps {
  children?: number;
  onUpdate: (newValue: number) => void;
  sx?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;
  placeholder?: string;
}

export default function EditableStatText({ children, onUpdate, sx, inputSx, placeholder, "data-testid": dtid }: EditableStatTextProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(true);
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      textFieldRef.current?.select();
    }
  }, [editing]);
  
  const exitEditMode = (evt: React.SyntheticEvent<Element>) => {
    evt.preventDefault();
    if (editing && valid) {
      if (hasChanged && textFieldRef.current) {
        try {
          const val = parseInt(textFieldRef.current.value);
          onUpdate(val);
        } catch (e) {
          console.error("Invalid stat value:", textFieldRef.current.value);
        }
      }
      setEditing(false);
      setHasChanged(false);
    }
  };

  const enterEditMode = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    setEditing(true);
  };

  const handleClick = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
  };

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLElement>) => {
    if (editing) {
      if (evt.key === 'Escape') {
        setEditing(false);
      } else if (evt.key === 'Enter') {
        exitEditMode(evt);
      }
    }
  };

  const handleInputChange = (_evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!textFieldRef.current) {
      return;
    }
    setHasChanged(true);
    const valid = validate(textFieldRef.current.value);
    setValid(valid);
    textFieldRef.current.focus();
  };

  const validate = (val: string): boolean => {
    let result = true;
    try {
      const n = parseInt(val);
      result = !isNaN(n) && n >= 0;
    } catch {
      result = false;
    }
    console.debug(`Validated text: '${val}', valid=${result}`);
    return result;
  };

  const val = children || placeholder || "??";
    
  if (editing) {
    return (
      <TextField
        defaultValue={val}
        inputRef={textFieldRef}
        variant="filled"
        onBlur={exitEditMode}
        onInput={handleInputChange}
        onClick={handleClick}
        onKeyUp={handleKeyUp}
        autoComplete="off"
        error={hasChanged && !valid}
        sx={inputSx}
        size="small"
        data-testid={`${dtid}-textfield`}
      />
    );
  } else {
    return (
      <StatText
        onClick={handleClick}
        onDoubleClick={enterEditMode}
        title="Double-click to edit"
        sx={sx}
        data-testid={dtid}
      >
        {val}
      </StatText>
    );
  }
}
