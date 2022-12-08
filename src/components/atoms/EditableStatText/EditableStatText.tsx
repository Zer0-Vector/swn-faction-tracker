import React, { useCallback, useEffect, useRef, useState } from "react";

import { TypographyProps } from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";

import { Prefixed } from "../../../types/Prefixed";
import TestableProps from "../../../types/TestableProps";
import StatText from "../StatText";

interface EditableStatTextBaseProps extends TestableProps {
  /**
   * The default number to display
   */
  children?: number;

  /**
   * Callback after value is edited.
   * @param newValue The new value for the field
   */
  onUpdate: (newValue: number) => void;

  /**
   * Text to display when {@link children} is `undefined`
   * @default "??"
   */
  placeholder?: string;

  /**
   * When `true`, the text is editable.
   * @default true
   */
  editable?: boolean;
}

export type EditableStatTextProps =
  & EditableStatTextBaseProps
  & Pick<TypographyProps, "sx">
  & Prefixed<Pick<TextFieldProps, "sx">, "input">;
  

export default function EditableStatText({
  children,
  onUpdate,
  sx,
  inputSx,
  placeholder = "??",
  editable = true,
  "data-testid": dtid,
}: EditableStatTextProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(true);
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      textFieldRef.current?.select();
    }
  }, [editing]);
  
  const exitEditMode = useCallback((evt: React.SyntheticEvent<Element>) => {
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
  }, [editing, hasChanged, onUpdate, valid]);

  const enterEditMode = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    if (editable) {
      setEditing(true);
    }
  }, [editable]);

  const handleClick = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
  }, []);

  const handleKeyUp = useCallback((evt: React.KeyboardEvent<HTMLElement>) => {
    if (editing) {
      if (evt.key === 'Escape') {
        setEditing(false);
      } else if (evt.key === 'Enter') {
        exitEditMode(evt);
      }
    }
  }, [editing, exitEditMode]);

  const validate = useCallback((val: string): boolean => {
    let result = true;
    try {
      const n = parseInt(val);
      result = !isNaN(n) && n >= 0;
    } catch {
      result = false;
    }
    console.debug(`Validated text: '${val}', valid=${result}`);
    return result;
  }, []);

  const handleInputChange = useCallback((_evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!textFieldRef.current) {
      return;
    }
    setHasChanged(true);
    const valid = validate(textFieldRef.current.value);
    setValid(valid);
    textFieldRef.current.focus();
  }, [validate]);

  const val = children === undefined ? placeholder : children;

  const title = editable ? "Double-click to edit" : "Enable editing to change";

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
        title={title}
        sx={sx}
        data-testid={dtid}
      >
        {val}
      </StatText>
    );
  }
}
