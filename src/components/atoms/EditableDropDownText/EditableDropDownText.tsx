import React, { useCallback, useEffect, useRef, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
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
}

type EditableDropDownTextProps =
  & EditableDropDownTextBaseProps
  & Pick<TextFieldProps, "sx">
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

  const handleCancel = useCallback(() => {
    if (editing) {
      setEditing(false);
      setHasChanged(false);
    }
  }, [editing]);

  const handleKeyUp = useCallback((evt: React.KeyboardEvent<HTMLElement>) => {
    if (evt.key === 'Escape') {
      handleCancel();
    }
  }, [handleCancel]);

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

  const inputClickHander = useCallback<React.MouseEventHandler>((evt) => {
    evt.stopPropagation();
  }, []);

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
        renderInput={params =>
          <TextField
            {...params}
            inputRef={textFieldRef}
            onKeyUp={handleKeyUp}
            onInput={textChanged}
            onClick={inputClickHander}
            onBlur={handleCancel}
            autoComplete="off"
            sx={inputSx}
            data-testid="editable-dropdown-textfield"
          />
        }
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
