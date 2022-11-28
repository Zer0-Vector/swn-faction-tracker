import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { TextFieldProps } from "@mui/material/TextField";
import Typography, { TypographyProps } from "@mui/material/Typography";

import { ValidationContext } from "../../../contexts/ValidationContext";
import { ValidationController } from "../../../controllers/ValidationController";
import { Prefixed } from "../../../types/Prefixed";
import TestableProps from "../../../types/TestableProps";
import { ValidationFn } from "../../../types/ValidationFn";
import { ValidatedTextField } from "../ValidatedTextField";

export interface EditableTextBaseProps extends TestableProps {
  children: string;
  onUpdate?: (newValue: string) => void;
  validate?: ValidationFn;
}

type EditableTextProps = 
  & Prefixed<Pick<TextFieldProps, "variant" | "sx">, "input">
  & Pick<TypographyProps, "variant" | "sx">
  & Required<Pick<TextFieldProps, "id">>
  & EditableTextBaseProps;

export default function EditableText({ id, children, onUpdate, variant, sx, inputSx, inputVariant, validate, "data-testid": dtid }: EditableTextProps) {
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [fieldWidth, setFieldWidth] = useState<number>(children.length);

  useEffect(() => {
    if (editing) {
      textFieldRef.current?.select();
    }
  }, [editing]);

  const validator = useMemo(() => new ValidationController({
    [id]: (val: string) => val.trim().length > 0 && (validate === undefined || validate(val.trim())),
  }), [id, validate]);

  const enterEditMode = useCallback<React.MouseEventHandler>((evt) => {
    evt.stopPropagation();
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
      if (hasChanged && onUpdate) {
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

  const handleInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>((evt) => {
    setFieldWidth(evt.target.value.length);
  }, []);

  let inner: React.ReactNode;
  if (editing) {
    inner = (
      <ValidationContext.Provider value={validator}>
        <ValidatedTextField
          id={id}
          inputRef={textFieldRef}
          InputProps={{ sx: {
            minWidth: "3ch",
            width: fieldWidth + "ch"
          }}}
          onKeyUp={handleKeyUp}
          onChange={handleChange}
          onInput={handleInput}
          onBlur={handleCancel}
          onClick={handleInputClick}
          defaultValue={children}
          autoComplete="off"
          sx={inputSx}
          variant={inputVariant || "standard"}
          data-testid={"editable-text-textfield"}
          size="small"
        />
      </ValidationContext.Provider>
    ); 
  } else {
    inner = (
      <Typography
        variant={variant}
        sx={sx}
        component="span"
        title={children}
        flexShrink={1}
        data-testid="editable-text-text"
      >
        {children}
      </Typography>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        "& .MuiIconButton-root": {
          visibility: editing ? "unset" : "hidden",
        },
        "&:hover .MuiIconButton-root": {
          visibility: editing ? "unset" : "visible",
        }
      }}
      data-testid={dtid}
    >
      {inner}
      <IconButton size="small" onClick={enterEditMode} data-testid="editable-text-button">
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
