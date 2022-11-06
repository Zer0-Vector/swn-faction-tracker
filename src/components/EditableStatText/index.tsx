import { TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react"

type EditableNameTextProps = {
  children: string,
  updateValue: (newValue: string) => void,
  divStyle?: React.CSSProperties,
}

export default function EditableStatText({ children, updateValue, divStyle }: EditableNameTextProps) {

  const actualDivStyle: React.CSSProperties = {
    ...divStyle,
    fontSize: "2.5rem",
    textAlign: "center",
    padding: "0 0.5rem",
    maxWidth: "3rem",
  };
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const textFieldRef = useRef<HTMLInputElement>(null);

  const exitEditMode = (evt: React.SyntheticEvent<Element>) => {
    evt.preventDefault();
    if (isEditing && hasChanged) {
      updateValue(textFieldRef.current?.value || children?.toString() || "");
      setHasChanged(false);
    }
    setIsEditing(false);
  };

  const enterEditMode = () => {
    setIsEditing(true);
  };

  const handleKeyUp = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    if (isEditing && evt.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setHasChanged(true);
    textFieldRef.current?.focus();
  };

  useEffect(() => {
    if (isEditing) {
      textFieldRef.current?.select();
    }
  }, [isEditing]);
    
  if (isEditing) {
    return (
      <div style={actualDivStyle}>
        <form onSubmit={exitEditMode} onKeyUp={handleKeyUp}>
          <TextField 
            defaultValue={children?.toString()}
            inputRef={textFieldRef}
            onBlur={exitEditMode}
            onInput={handleInputChange}
            autoComplete="off"
          />
        </form>
      </div>
    );
  } else {
    return (
      <div onDoubleClick={enterEditMode} title="Double-click to edit" style={actualDivStyle}>
        {children?.toString()}
      </div>
    )
  }
}