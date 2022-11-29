import React, { useEffect, useRef, useState } from "react";

import { SxProps, Theme } from "@mui/material";
import TextField from "@mui/material/TextField";

import EditableState from "../../../types/EditableState";
import TestableProps from "../../../types/TestableProps";
import StatText from "../StatText";

export interface EditableStatTextProps extends TestableProps {
  children: string | number;
  updateValue: (newValue: number) => void;
  sx?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;
}

export default function EditableStatText({ children, updateValue, sx, inputSx, "data-testid": dtid }: EditableStatTextProps) {
  const defaultState: EditableState = {
    editing: false,
    hasChanged: false,
    valid: true
  };
  const [state, setState] = useState<EditableState>(defaultState);
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.editing) {
      textFieldRef.current?.select();
    }
  }, [state.editing]);
  
  const exitEditMode = (evt: React.SyntheticEvent<Element>) => {
    evt.preventDefault();
    if (state.editing && state.valid) {
      if (state.hasChanged && textFieldRef.current) {
        try {
          const val = parseInt(textFieldRef.current.value);
          updateValue(val);
        } catch (e) {
          console.error("Invalid stat value:", textFieldRef.current.value);
        }
      }
      setState(defaultState);
    }
  };

  const enterEditMode = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    setState(prev => ({
      ...prev,
      editing: true,
    }));
  };

  const handleClick = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
  };

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLElement>) => {
    if (state.editing) {
      if (evt.key === 'Escape') {
        setState(prev => ({
          ...prev,
          editing: false,
        }));
      } else if (evt.key === 'Enter') {
        exitEditMode(evt);
      }
    }
  };

  const handleInputChange = (_evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!textFieldRef.current) {
      return;
    }
    const valid = validate(textFieldRef.current.value);
    setState(prev => ({
      ...prev,
      hasChanged: true,
      valid: valid,
    }));
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
    
  if (state.editing) {
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
        error={!state.valid}
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
        {children}
      </StatText>
    );
  }
}
