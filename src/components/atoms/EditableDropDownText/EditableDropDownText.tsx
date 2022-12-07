import React, { useCallback, useEffect, useRef, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import Autocomplete, { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { SxProps, Theme } from "@mui/material/styles";
import { Variant } from "@mui/material/styles/createTypography";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography, { TypographyPropsVariantOverrides } from "@mui/material/Typography";
import { OverridableStringUnion } from "@mui/types";

import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import Nullable from "../../../types/Nullable";
import TestableProps from "../../../types/TestableProps";

export interface EditableDropDownTextBaseProps extends RequiredChildrenProps<string> {
  onUpdate: (newValue: string) => void;
  textVariant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
  inputSx?: SxProps<Theme>;
  selectableOptions: readonly string[];
}

type EditableDropDownTextProps =
  & EditableDropDownTextBaseProps
  & Pick<TextFieldProps, "sx">
  & TestableProps;

export default function EditableDropDownText({ children, onUpdate, textVariant, sx, inputSx, selectableOptions,  "data-testid": dtid }: EditableDropDownTextProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (editing && textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.select();
    }
  }, [editing]);

  const enterEditMode = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    setEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (editing) {
      setEditing(false);
    }
  }, [editing]);

  const handleKeyUp = useCallback((evt: React.KeyboardEvent<HTMLElement>) => {
    if (evt.key === 'Escape') {
      handleCancel();
    }
  }, [handleCancel]);

  const dropdownChanged = useCallback((evt: React.SyntheticEvent, val: Nullable<string>) => {
    if (editing) {
      if (val !== null && val.trim().length > 0) {
        onUpdate(val);
      }
      setEditing(false);
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

  const inputClickHander = useCallback<React.MouseEventHandler>((evt) => {
    evt.stopPropagation();
  }, []);

  const autocompleteTextField = useCallback<(params: AutocompleteRenderInputParams) => React.ReactNode>(
    params =>
      <TextField
        {...params}
        inputRef={textFieldRef}
        onKeyUp={handleKeyUp}
        onClick={inputClickHander}
        onBlur={handleCancel}
        autoComplete="off"
        sx={inputSx}
        data-testid="editable-dropdown-textfield"
      />,
    [handleCancel, handleKeyUp, inputClickHander, inputSx]
  );

  let inner;
  if (editing) {
    inner = (
      <Autocomplete
        disablePortal={true}
        id="autocomplete-faction-homeworld"
        options={selectableOptions}
        openOnFocus={true}
        onChange={dropdownChanged}
        data-testid="editable-dropdown-autocomplete"
        value={children}
        renderInput={autocompleteTextField}
      />
    );
  } else {
    inner = (
      <Typography
        onClick={clickHandler}
        variant={textVariant}
        sx={sx}
        component="span"
        title={children}
        data-testid="editable-dropdown-text"
        color="text.primary"
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
        },
      }}
      data-testid={dtid}
    >
      {inner}
      <IconButton size="small" onClick={enterEditMode} data-testid="editable-dropdown-button">
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
