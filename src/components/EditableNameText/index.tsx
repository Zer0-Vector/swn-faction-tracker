import { TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

type EditableNameTextProps = {
  children: string,
  updateValue: (newValue: string) => void,
  divStyle?: React.CSSProperties
}

export default function EditableNameText({ children, updateValue, divStyle }: EditableNameTextProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);

  const actualDivStyle: React.CSSProperties = {
    ...divStyle,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "clip",
    width: "100%",
  }

  useEffect(() => {
    if (isEditing) {
      textFieldRef.current?.select();
    }
  }, [isEditing])

  const enterEditMode = () => {
    setIsEditing(true);
  }

  const exitEditMode = (evt: React.SyntheticEvent<Element>) => {
    evt.preventDefault();
    if (hasChanged) {
      updateValue(textFieldRef.current?.value as string);
      setHasChanged(false);
    }
    setIsEditing(false);
  }

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    if (evt.key === 'Escape') {
      setIsEditing(false);
    }
  }

  const textChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setHasChanged(true);
  }

  if (isEditing) {
    return (
      <form onSubmit={exitEditMode} onKeyUp={handleKeyUp} style={actualDivStyle}>
        <TextField
          inputRef={textFieldRef}
          onBlur={exitEditMode}
          onInput={textChanged}
          defaultValue={children}
          fullWidth={true}
          inputProps={{ style: { height: "100%" } }}
        />
      </form>
    ) 
  } else {
    return (
      <div style={actualDivStyle} onDoubleClick={enterEditMode}>{children}</div>
    );
  }
}