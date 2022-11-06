import React, { useEffect, useRef, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import { SxProps, Theme } from "@mui/material/styles";
import { Variant } from "@mui/material/styles/createTypography";
import TextField from "@mui/material/TextField";
import Typography, { TypographyPropsVariantOverrides } from "@mui/material/Typography";
import { OverridableStringUnion } from "@mui/types";

import Nullable from "../../types/Nullable";

interface EditableNameTextProps {
  children: string;
  onUpdate: (newValue: string) => void;
  variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
  sx?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;
  selectableOptions?: string[];
  validate?: (value: string)=>boolean;
}

interface EditableState {
  isEditing: boolean;
  hasChanged: boolean;
}

const ALL_FALSE: EditableState = {
  isEditing: false,
  hasChanged: false,
};

export default function EditableNameText({ children, onUpdate, variant, sx, inputSx, selectableOptions, validate }: EditableNameTextProps) {
  const [state, setState] = useState<EditableState>(ALL_FALSE);
  const [isValid, setIsValid] = useState<boolean>(state.hasChanged || validate === undefined);
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.isEditing) {
      console.debug(`selecting text field: ${textFieldRef.current} - ${state.isEditing}`);
      textFieldRef.current?.select();
    }
  }, [state.isEditing]);

  const enterEditMode = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    setState(prev => ({
      ...prev,
      isEditing: true,
    }));
  };

  const clickHandler = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
  };

  const exitEditMode = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (state.isEditing && state.hasChanged) {
      console.debug(`Changing ${textFieldRef.current?.id}: ${textFieldRef.current?.value}`);
      onUpdate(textFieldRef.current?.value as string);
    }
    setState(ALL_FALSE);
  };

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLElement>) => {
    if (evt.key === 'Escape' || evt.key === 'Enter') {
      exitEditMode(evt);
    }
  };

  const textChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (state.isEditing) {
      if (!state.hasChanged) {
        setState(prev => ({
          ...prev,
          hasChanged: true,
        }));
      }

      const text = textFieldRef.current?.value as string;
      console.assert(text !== undefined, "textFieldRef.current is undefined!!!");

      if (validate) {
        setIsValid(text.trim().length > 0 && validate(text));
      } else if (selectableOptions) {
        setIsValid(selectableOptions.includes(text));
      } else {
        setIsValid(text.trim().length > 0);
      }
    }
  };

  const dropdownChanged = (evt: React.SyntheticEvent, val: Nullable<string>) => {
    if (state.isEditing) {
      if (val !== null && val.trim().length > 0) {
        onUpdate(val);
      }
      setState(ALL_FALSE);
    }
  };

  const handleCancel = () => {
    if (state.isEditing) {
      setState(ALL_FALSE);
    }
  };

  if (state.isEditing) {
    if (selectableOptions) {
      return (
        <Autocomplete
          disablePortal={true}
          id="autocomplete-faction-homeworld"
          options={selectableOptions}
          openOnFocus={true}
          onChange={dropdownChanged}
          renderInput={params =>
            <TextField
              {...params}
              inputRef={textFieldRef}
              onKeyUp={handleKeyUp}
              onInput={textChanged}
              onClick={clickHandler}
              onBlur={handleCancel}
              error={isValid}
              sx={inputSx}
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
          onClick={clickHandler}
          onBlur={handleCancel}
          defaultValue={children}
          error={isValid}
          sx={inputSx}
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
      >
        {children}
      </Typography>
    );
  }
}
