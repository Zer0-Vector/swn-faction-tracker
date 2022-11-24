import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TextFieldProps } from "@mui/material/TextField";
import Typography, { TypographyProps } from "@mui/material/Typography";

import { ValidationContext } from "../../../contexts/ValidationContext";
import { ValidationController } from "../../../controllers/ValidationController";
import { Prefixed } from "../../../types/Prefixed";
import TestableProps from "../../../types/TestableProps";
import { ValidatedTextField } from "../ValidatedTextField";

export interface EditableTextBaseProps extends TestableProps {
  children: string;
  onUpdate: (newValue: string) => void;
}

type EditableTextProps = 
  & Prefixed<Pick<TextFieldProps, "variant" | "sx">, "input">
  & Pick<TypographyProps, "variant" | "sx">
  & Required<Pick<TextFieldProps, "id">>
  & EditableTextBaseProps;

export default function EditableText({ id, children, onUpdate, variant, sx, inputSx, inputVariant, "data-testid": dtid }: EditableTextProps) {
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [hovering, setHovering] = useState<boolean>(false);

  useEffect(() => {
    if (editing) {
      textFieldRef.current?.select();
    }
  }, [editing]);

  const validator = useMemo(() => new ValidationController({
    [id]: (val: string) => val.trim().length > 0,
  }), [id]);

  const enterEditMode = useCallback<React.FocusEventHandler>(() => {
    setEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (editing) {
      setEditing(false);
      setHasChanged(false);
      validator.reset();
    }
  }, [editing, validator]);

  const exitEditMode = useCallback((evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (editing && validator.isAllValid()) {
      if (hasChanged) {
        console.debug(`Changing ${textFieldRef.current?.id}: ${textFieldRef.current?.value}`);
        onUpdate(textFieldRef.current?.value as string);
      }
      setEditing(false);
      setHasChanged(false);
      validator.reset();
    }
  }, [editing, hasChanged, onUpdate, validator]);

  const handleKeyUp = useCallback((evt: React.KeyboardEvent<HTMLElement>) => {
    if (evt.key === 'Escape') {
      handleCancel();
    } else if (evt.key === 'Enter') {
      exitEditMode(evt);
    }
  }, [exitEditMode, handleCancel]);

  const handleChange = useCallback(() => {
    if (editing && !hasChanged) {
      setHasChanged(true);
    }
  }, [editing, hasChanged]);

  const handleInputClick = useCallback<React.MouseEventHandler>((evt) => {
    evt.stopPropagation();
  }, []);

  const hoverIn = useCallback<React.MouseEventHandler>(() => {
    if (!hovering) {
      setHovering(true);
    }
  }, [hovering]);

  const hoverOut = useCallback<React.MouseEventHandler>(() => {
    if (hovering) {
      setHovering(false);
    }
  }, [hovering]);

  if (editing || hovering) {
    return (
      <ValidationContext.Provider value={validator}>
        <ValidatedTextField
          id={id}
          inputRef={textFieldRef}
          onMouseLeave={hoverOut}
          onKeyUp={handleKeyUp}
          onChange={handleChange}
          onBlur={handleCancel}
          onFocus={enterEditMode}
          onClick={handleInputClick}
          defaultValue={children}
          autoComplete="off"
          sx={inputSx}
          variant={inputVariant}
          data-testid={`${dtid}-textfield`}
          size="small"
          fullWidth={true}
        />
      </ValidationContext.Provider>
    ); 
  } else {
    return (
      <Typography
        variant={variant}
        onMouseEnter={hoverIn}
        sx={sx}
        component="span"
        title={children}
        data-testid={dtid}
      >
        {children}
      </Typography>
    );
  }
}
