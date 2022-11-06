import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useContext, useRef, useState } from "react";
import { GameContext } from "../../GameContext";

type FormInfo = {
  text: string,
  valid: boolean,
}

export default function AddFactionForm() {
  const { state, controller } = useContext(GameContext);
  const { factions } = state;

  const [formState, setFormState] = useState<FormInfo>({text: "", valid: false});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (formState.valid) {
      controller.addFaction(formState.text);
      setFormState({ text: "", valid: false})
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newText = evt.target.value;
    const nameExists = Object.keys(factions).includes(newText);
    const isNotBlank = newText.trim().length > 0;
    const newState = {
      text: newText,
      valid: isNotBlank && !nameExists,
    }
    setFormState(newState);
  };
  
  return (
    <Box margin="1rem 0">
      <form noValidate={true} onSubmit={handleClick} style={{ 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
      }}>
        <Box margin="0 1rem" flexGrow={0.5}>
          <TextField 
            id="faction-name"
            label="Faction Name"
            variant="filled"
            inputRef={inputRef}
            type="text"
            placeholder="Enter Faction Name"
            autoFocus={true}
            value={formState.text}
            onInput={handleInputChange}
            error={!formState.valid && formState.text !== ""}
            fullWidth={true}
            autoComplete="off"
          />
        </Box>
        <Box margin="0 1rem">
          <Button type="submit" disabled={!formState.valid} variant="contained">Add Faction</Button>
        </Box>
      </form>
    </Box>
  );
}
