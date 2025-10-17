import React, { useCallback, useContext } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { isGameMode } from "../../../types/GameMode";
import Nullable from "../../../types/Nullable";

export default function ModeToggleButtons() {
  const { state, controller } = useContext(UiStateContext);
  const confirm = useConfirmation();

  const handleChange = useCallback(
    (_: React.MouseEvent, value: Nullable<string>) => {
      if (value === null) {
        // when active button is clicked
        return;
      }

      if (isGameMode(value)) {
        if (state.editMode === "TURN" && value !== "TURN") {
          confirm({
            title: "End Turn Confirmation",
            message:
              "The turn is incomplete. Do you really want to end the turn?",
          }).then((confirmed: boolean) => {
            if (confirmed) {
              controller.setEditMode(value, true);
            }
          });
        } else {
          controller.setEditMode(value);
        }
      } else {
        console.warn("Unknown ModeToggleButton value: ", value);
      }
    },
    [confirm, controller, state.editMode]
  );

  console.debug("Rendering ModeToggleButtons...");

  return (
    <ToggleButtonGroup
      value={state.editMode}
      exclusive={true}
      color="tertiary"
      onChange={handleChange}
    >
      <ToggleButton value="VIEW" fullWidth={true}>
        View
      </ToggleButton>
      <ToggleButton value="EDIT" fullWidth={true}>
        Free Edit
      </ToggleButton>
      <ToggleButton value="TURN" fullWidth={true}>
        Take Turn
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
