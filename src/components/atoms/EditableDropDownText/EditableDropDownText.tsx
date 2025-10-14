import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import EditIcon from "@mui/icons-material/Edit";
import { SxProps, Theme } from "@mui/material";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography, { TypographyProps } from "@mui/material/Typography";

import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import Nullable from "../../../types/Nullable";
import { Prefixed } from "../../../types/Prefixed";
import TestableProps from "../../../types/TestableProps";

interface EditableDropDownTextBaseProps extends RequiredChildrenProps<string> {
  /**
   * When the text field is updated.
   * @param newValue The value from the text field
   */
  onUpdate: (newValue: string) => void;

  /**
   * Options for drop down
   */
  selectableOptions: readonly string[];

  /**
   * Flag to enable/disable editing
   * @default true
   */
  editable?: boolean;
}

export type EditableDropDownTextProps = EditableDropDownTextBaseProps
  & Prefixed<Pick<TextFieldProps, "sx">, "input">
  & Pick<TypographyProps, "sx">
  & Prefixed<Pick<TypographyProps, "variant">, "text">
  & TestableProps;

export default function EditableDropDownText({
  children,
  onUpdate,
  textVariant,
  sx,
  inputSx,
  selectableOptions,
  editable = true,
  "data-testid": dtid,
}: EditableDropDownTextProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (editing && textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.select();
    }
  }, [editing, textFieldRef.current]);

  const enterEditMode = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      evt.stopPropagation();
      if (editable) {
        setEditing(true);
      }
    },
    [editable]
  );

  const handleCancel = useCallback(() => {
    if (editing) {
      setEditing(false);
    }
  }, [editing]);

  const handleKeyUp = useCallback(
    (evt: React.KeyboardEvent<HTMLElement>) => {
      if (evt.key === "Escape") {
        handleCancel();
      }
    },
    [handleCancel]
  );

  const dropdownChanged = useCallback(
    (evt: React.SyntheticEvent, val: Nullable<string>) => {
      if (editing) {
        if (val !== null && val.trim().length > 0) {
          onUpdate(val);
        }
        setEditing(false);
      }
    },
    [editing, onUpdate]
  );

  const clickHandler = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      if (clicked) {
        evt.stopPropagation();
        setClicked(false);
      } else {
        setClicked(true);
        setTimeout(() => setClicked(false), 250);
      }
    },
    [clicked]
  );

  const inputClickHandler = useCallback<React.MouseEventHandler>((evt) => {
    evt.stopPropagation();
  }, []);

  const autocompleteTextField = useCallback<
    (params: AutocompleteRenderInputParams) => React.ReactNode
  >(
    (params) => (
      <TextField
        {...params}
        inputRef={textFieldRef}
        onKeyUp={handleKeyUp}
        onClick={inputClickHandler}
        onBlur={handleCancel}
        autoComplete="off"
        sx={inputSx}
        data-testid="editable-dropdown-textfield"
      />
    ),
    [handleCancel, handleKeyUp, inputClickHandler, inputSx]
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

  const boxSx = useMemo(
    () => ({
      "& .MuiIconButton-root": {
        visibility: editing ? "unset" : "hidden",
      },
      "&:hover .MuiIconButton-root": {
        visibility: editing ? "unset" : "visible",
      },
    }),
    [editing]
  );

  const iconTitle = editable
    ? "Click to edit value"
    : "Enable edit mode to edit value";

  const iconSx = useMemo<SxProps<Theme>>(() => ({ pointerEvents: "auto" }), []);

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      sx={boxSx}
      data-testid={dtid}
      gap={0.25}
    >
      {inner}
      <IconButton
        size="small"
        onClick={enterEditMode}
        disabled={!editable}
        title={iconTitle}
        data-testid="editable-dropdown-button"
      >
        <EditIcon fontSize="inherit" sx={iconSx} />
      </IconButton>
    </Box>
  );
}
