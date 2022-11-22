import React, { useCallback, useEffect, useRef, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import { SxProps, Theme } from "@mui/material/styles";
import { Variant } from "@mui/material/styles/createTypography";
import TextField from "@mui/material/TextField";
import Typography, { TypographyPropsVariantOverrides } from "@mui/material/Typography";
import { OverridableStringUnion } from "@mui/types";

import EditableState from "../../../types/EditableState";
import Nullable from "../../../types/Nullable";

export interface EditableNameTextProps {
  children: string;
  onUpdate: (newValue: string) => void;
  variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
  sx?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;
  selectableOptions?: readonly string[];
  validate?: (value: string)=>boolean;
}

export default function EditableNameText({ children, onUpdate, variant, sx, inputSx, selectableOptions, validate }: EditableNameTextProps) {
  const defaultState: EditableState = { editing: false, hasChanged: false, valid: validate === undefined };
  const [state, setState] = useState<EditableState>(defaultState);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (state.editing) {
      textFieldRef.current?.select();
    }
  }, [state.editing]);

  const enterEditMode = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    setState(prev => ({
      ...prev,
      editing: true,
    }));
  }, []);

  const clickHandler = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    if (clicked) {
      evt.stopPropagation();
      setClicked(false);
    } else {
      setClicked(true);
      setTimeout(() => setClicked(false), 250);
    }
  }, [clicked]);

  const exitEditMode = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (state.editing && state.valid) {
      if (state.hasChanged) {
        console.debug(`Changing ${textFieldRef.current?.id}: ${textFieldRef.current?.value}`);
        onUpdate(textFieldRef.current?.value as string);
      }
      setState(defaultState);
    }
  };

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLElement>) => {
    if (evt.key === 'Escape') {
      handleCancel();
    } else if (evt.key === 'Enter') {
      exitEditMode(evt);
    }
  };

  const textChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (state.editing) {
      const text = textFieldRef.current?.value as string;
      console.assert(text !== undefined, "textFieldRef.current is undefined!!!");

      
      let isValid = false;
      if (validate) {
        isValid = text.trim().length > 0 && validate(text);
      } else if (selectableOptions) {
        isValid = selectableOptions.includes(text);
      } else {
        isValid = text.trim().length > 0;
      }
      console.debug("validating...", isValid);

      if (!state.hasChanged) {
        setState(prev => ({
          ...prev,
          hasChanged: true,
          valid: isValid,
        }));
      } else {
        setState(prev => ({
          ...prev,
          valid: isValid,
        }));
      }
    }
  };

  const dropdownChanged = (evt: React.SyntheticEvent, val: Nullable<string>) => {
    if (state.editing) {
      if (val !== null && val.trim().length > 0) {
        onUpdate(val);
      }
      setState(defaultState);
    }
  };

  const handleCancel = () => {
    if (state.editing) {
      setState(defaultState);
    }
  };

  if (state.editing) {
    if (selectableOptions) {
      return (
        <Autocomplete
          disablePortal={true}
          id="autocomplete-faction-homeworld"
          options={selectableOptions}
          openOnFocus={true}
          onChange={dropdownChanged}
          data-testid="editable-name-text-autocomplete"
          renderInput={params =>
            <TextField
              {...params}
              inputRef={textFieldRef}
              onKeyUp={handleKeyUp}
              onInput={textChanged}
              onClick={evt => evt.stopPropagation()}
              onBlur={handleCancel}
              error={!state.valid}
              autoComplete="off"
              sx={inputSx}
              data-testid="editable-name-text-autocomplete-textfield"
            />
          }
        />
      );
    } else {
      return (
        <TextField
          inputRef={textFieldRef}
          onKeyUp={handleKeyUp}
          onInput={textChanged}
          onClick={evt => evt.stopPropagation()}
          onBlur={handleCancel}
          defaultValue={children}
          error={!state.valid}
          autoComplete="off"
          sx={inputSx}
          data-testid="editable-name-text-textfield"
        />
      ); 
    }
  } else {
    return (
      <Typography
        onDoubleClick={enterEditMode}
        onClick={clickHandler}
        variant={variant}
        sx={sx}
        component="span"
        title={children}
        data-testid="editable-name-text-text"
      >
        {children}
      </Typography>
    );
  }
}
