import React, { useCallback, useEffect, useRef, useState } from "react";

import { TypographyProps } from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";

import { Maybe } from "../../../types/Maybe";
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


function maybeParseIntStat(val: string): Maybe<number> {
  try {
    return parseInt(val);
  } catch (e) {
    console.error("Invalid stat value:", val, e);
    return undefined;
  }
}

export default function EditableStatText({
  children,
  onUpdate,
  sx,
  inputSx,
  placeholder = "??",
  editable = true,
  "data-testid": dataTestId,
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
        const val = maybeParseIntStat(textFieldRef.current.value);
        try {
          if (val !== undefined) {
            onUpdate(val);
          }
        } catch (e) {
          console.error("Could not update:", textFieldRef.current.value, e);
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

  const handleInputChange = useCallback(() => {
    if (!textFieldRef.current) {
      return;
    }
    setHasChanged(true);
    const valid = validate(textFieldRef.current.value);
    setValid(valid);
    textFieldRef.current.focus();
  }, [validate]);

  const val = children ?? placeholder;

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
        data-testid={`${dataTestId}-textfield`}
      />
    );
  } else {
    return (
      <StatText
        onClick={handleClick}
        onDoubleClick={enterEditMode}
        title={title}
        sx={sx}
        data-testid={dataTestId}
      >
        {val}
      </StatText>
    );
  }
}
