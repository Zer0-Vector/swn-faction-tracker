import React, { useContext } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { UiStateContext } from "../../../contexts/UiStateContext";

export default function ModeToggleButtons() {
  const { state, controller } = useContext(UiStateContext);

  const handleChange = (_: React.MouseEvent, value: string) => {
    if (value) {
      controller.setEditMode(value);
    }
  };

  console.debug("Rendering ModeToggleButtons...");

  return (
    <ToggleButtonGroup
      value={state.editMode}
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
