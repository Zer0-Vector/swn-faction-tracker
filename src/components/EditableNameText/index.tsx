import { Variant } from "@mui/material/styles/createTypography";
import TextField from "@mui/material/TextField";
import Typography, { TypographyPropsVariantOverrides } from "@mui/material/Typography";
import React, { useEffect, useRef, useState } from "react";
import { OverridableStringUnion } from "@mui/types";

type EditableNameTextProps = {
  children: string,
  updateValue: (newValue: string) => void,
  variant: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>,
}

export default function EditableNameText({ children, updateValue, variant }: EditableNameTextProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);

  const actualDivStyle: React.CSSProperties = {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "clip",
    width: "100%",
  };

  useEffect(() => {
    if (isEditing) {
      textFieldRef.current?.select();
    }
  }, [isEditing]);

  const enterEditMode = () => {
    setIsEditing(true);
  };

  const exitEditMode = (evt: React.SyntheticEvent<Element>) => {
    evt.preventDefault();
    if (hasChanged) {
      updateValue(textFieldRef.current?.value as string);
      setHasChanged(false);
    }
    setIsEditing(false);
  };

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    if (evt.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const textChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setHasChanged(true);
  };

  if (isEditing) {
    return (
      <form onSubmit={exitEditMode} onKeyUp={handleKeyUp} style={actualDivStyle}>
        <TextField
          inputRef={textFieldRef}
          onBlur={exitEditMode}
          onInput={textChanged}
          defaultValue={children}
          fullWidth={true}
          sx={{ height: "100%" }}
        />
      </form>
    ); 
  } else {
    return (
      <Typography onDoubleClick={enterEditMode} variant={variant}>{children}</Typography>
    );
  }
}