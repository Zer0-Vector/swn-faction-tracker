import React, { useContext } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { GameContext } from "../../../contexts/GameContext";

export default function ModeToggleButtons() {
  const { state, controller } = useContext(GameContext);

  const handleChange = (_: React.MouseEvent, value: string) => {
    if (value) {
      controller.setMode(value);
    }
  };

  return (
    <ToggleButtonGroup
      value={state.mode}
      exclusive={true}
      color="tertiary"
      onChange={handleChange}
    >
      <ToggleButton value="VIEW" fullWidth={true}>View</ToggleButton>
      <ToggleButton value="EDIT" fullWidth={true}>Free Edit</ToggleButton>
      <ToggleButton value="TURN" fullWidth={true}>Take Turn</ToggleButton>
    </ToggleButtonGroup>
  );
}
