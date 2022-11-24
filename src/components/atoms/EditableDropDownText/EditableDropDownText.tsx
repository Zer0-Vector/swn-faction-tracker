import React, { useCallback, useEffect, useRef, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import { SxProps, Theme } from "@mui/material/styles";
import { Variant } from "@mui/material/styles/createTypography";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography, { TypographyPropsVariantOverrides } from "@mui/material/Typography";
import { OverridableStringUnion } from "@mui/types";

import Nullable from "../../../types/Nullable";
import TestableProps from "../../../types/TestableProps";

export interface EditableDropDownTextBaseProps {
  children: string;
  onUpdate: (newValue: string) => void;
  textVariant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
  inputSx?: SxProps<Theme>;
  selectableOptions: readonly string[];
  validate?: (value: string)=>boolean;
}

type EditableDropDownTextProps =
  & EditableDropDownTextBaseProps
  & TextFieldProps
  & TestableProps;

export default function EditableDropDownText({ children, onUpdate, textVariant, sx, inputSx, selectableOptions,  "data-testid": dtid }: EditableDropDownTextProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (editing) {
      textFieldRef.current?.select();
    }
  }, [editing]);

  const enterEditMode = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    setEditing(true);
  }, []);

  const exitEditMode = useCallback((evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (editing) {
      if (hasChanged) {
        console.debug(`Changing ${textFieldRef.current?.id}: ${textFieldRef.current?.value}`);
        onUpdate(textFieldRef.current?.value as string);
      }
      setEditing(false);
      setHasChanged(false);
    }
  }, [editing, hasChanged, onUpdate]);

  const handleCancel = useCallback(() => {
    if (editing) {
      setEditing(false);
      setHasChanged(false);
    }
  }, [editing]);

  const handleKeyUp = useCallback((evt: React.KeyboardEvent<HTMLElement>) => {
    if (evt.key === 'Escape') {
      handleCancel();
    } else if (evt.key === 'Enter') {
      exitEditMode(evt);
    }
  }, [exitEditMode, handleCancel]);

  const textChanged = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    if (editing && !hasChanged) {
      setHasChanged(true);
    }
  }, [editing, hasChanged]);

  const dropdownChanged = useCallback((evt: React.SyntheticEvent, val: Nullable<string>) => {
    if (editing) {
      if (val !== null && val.trim().length > 0) {
        onUpdate(val);
      }
      setEditing(false);
      setHasChanged(false);
    }
  }, [editing, onUpdate]);

  const clickHandler = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    if (clicked) {
      evt.stopPropagation();
      setClicked(false);
    } else {
      setClicked(true);
      setTimeout(() => setClicked(false), 250);
    }
  }, [clicked]);

  if (editing) {
    return (
      <Autocomplete
        disablePortal={true}
        id="autocomplete-faction-homeworld"
        options={selectableOptions}
        openOnFocus={true}
        onChange={dropdownChanged}
        data-testid={dtid ? `${dtid}-autocomplete` : undefined}
        renderInput={params =>
          <TextField
            {...params}
            inputRef={textFieldRef}
            onKeyUp={handleKeyUp}
            onInput={textChanged}
            onClick={evt => evt.stopPropagation()}
            onBlur={handleCancel}
            autoComplete="off"
            sx={inputSx}
            data-testid={`${dtid}-textfield`}
          />
        }
      />
    );
  } else {
    return (
      <Typography
        onDoubleClick={enterEditMode}
        onClick={clickHandler}
        variant={textVariant}
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
