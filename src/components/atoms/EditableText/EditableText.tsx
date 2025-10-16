import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import EditIcon from "@mui/icons-material/Edit";
import { InputBaseProps, SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { TextFieldProps } from "@mui/material/TextField";
import Typography, { TypographyProps } from "@mui/material/Typography";

import { ValidationContext } from "../../../contexts/ValidationContext";
import { ValidationController } from "../../../controllers/ValidationController";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import { Prefixed } from "../../../types/Prefixed";
import TestableProps from "../../../types/TestableProps";
import { ValidationFn } from "../../../types/ValidationFn";
import { ValidatedTextField } from "../ValidatedTextField";

interface EditableTextBaseProps
  extends TestableProps,
  RequiredChildrenProps<string> {
  /**
   * Callback for editing the field.
   * @param newValue The updated value for the field.
   */
  onUpdate?: (newValue: string) => void;

  /**
   * Additional validation for updating text.
   */
  validate?: ValidationFn;

  /**
   * Enables editing for this component.
   * @default true
   */
  editable?: boolean;
}

export type EditableTextProps = Prefixed<
  Pick<TextFieldProps, "variant" | "sx">,
  "input"
>
  & Partial<Pick<TypographyProps, "variant" | "sx">>
  & Required<Pick<TextFieldProps, "id">>
  & EditableTextBaseProps;

export default function EditableText({
  id,
  children,
  onUpdate,
  variant,
  sx,
  inputSx,
  inputVariant,
  validate,
  editable = true,
  "data-testid": dtid,
}: EditableTextProps) {
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [fieldWidth, setFieldWidth] = useState<number>(children.length);

  useEffect(() => {
    if (editing) {
      textFieldRef.current?.select();
    }
  }, [editing]);

  const validator = useMemo(
    () =>
      new ValidationController({
        [id]: (val: string) =>
          val.trim().length > 0
          && (validate === undefined || validate(val.trim())),
      }),
    [id, validate]
  );

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

  const exitEditMode = useCallback(
    (evt: React.SyntheticEvent) => {
      evt.preventDefault();
      if (editing && validator.isAllValid()) {
        if (hasChanged && onUpdate) {
          console.debug(
            `Changing ${textFieldRef.current?.id}: ${textFieldRef.current?.value}`
          );
          onUpdate(textFieldRef.current?.value as string);
        }
        setEditing(false);
        setHasChanged(false);
        validator.reset();
      }
    },
    [editing, hasChanged, onUpdate, validator]
  );

  const handleKeyUp = useCallback(
    (evt: React.KeyboardEvent<HTMLElement>) => {
      if (evt.key === "Escape") {
        handleCancel();
      } else if (evt.key === "Enter") {
        if (textFieldRef.current) {
          setFieldWidth(textFieldRef.current.value.length);
        }
        exitEditMode(evt);
      }
    },
    [exitEditMode, handleCancel]
  );

  const handleChange = useCallback(() => {
    if (editing && !hasChanged) {
      setHasChanged(true);
    }
  }, [editing, hasChanged]);

  const handleInputClick = useCallback<React.MouseEventHandler>((evt) => {
    evt.stopPropagation();
  }, []);

  const handleInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (evt) => {
      setFieldWidth(evt.target.value.length);
    },
    []
  );

  const boxSx = useMemo<SxProps<Theme>>(
    () => ({
      "& .MuiIconButton-root": {
        visibility: editing ? "unset" : "hidden",
      },
      "&:hover .MuiIconButton-root": {
        visibility: editing ? "unset" : "visible",
      },
      overflow: "clip",
    }),
    [editing]
  );

  const textFieldInputProps = useMemo<Partial<InputBaseProps>>(
    () => ({
      sx: {
        minWidth: "3ch",
        width: fieldWidth + "ch",
        maxWidth: "100%",
      },
    }),
    [fieldWidth]
  );

  const textStyle = useMemo<SxProps<Theme>>(
    () => ({
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      ...sx,
    }),
    [sx]
  );

  let inner: React.ReactNode;
  if (editing) {
    inner = (
      <ValidationContext.Provider value={validator}>
        <ValidatedTextField
          id={id}
          inputRef={textFieldRef}
          slotProps={{ input: textFieldInputProps }}
          onKeyUp={handleKeyUp}
          onChange={handleChange}
          onInput={handleInput}
          onBlur={handleCancel}
          onClick={handleInputClick}
          defaultValue={children}
          autoComplete="off"
          sx={inputSx}
          variant={inputVariant || "standard"}
          data-testid="editable-text-textfield"
          size="small"
        />
      </ValidationContext.Provider>
    );
  } else {
    inner = (
      <Typography
        variant={variant}
        sx={textStyle}
        component="span"
        title={children}
        flexShrink={1}
        data-testid="editable-text-text"
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
      sx={boxSx}
      data-testid={dtid}
    >
      {inner}
      <IconButton
        size="small"
        onClick={enterEditMode}
        disabled={!editable}
        data-testid="editable-text-button"
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
