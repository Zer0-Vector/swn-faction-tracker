import React, { useCallback, useContext } from "react";

import { FactionContext } from "../../../contexts/FactionContext";
import FactionInfo from "../../../types/FactionInfo";
import { GoalTypes, isGoalType } from "../../../types/GoalType";
import { ControlledDropDown } from "../ControlledDropDown";

interface GoalTextProps {
  faction: FactionInfo;
}

export default function GoalText({faction}: GoalTextProps) {
  const { factions } = useContext(FactionContext);
  
  const handleUpdate = useCallback((val: string) => {
    if (isGoalType(val)) {
      factions.update(faction.id, "goal", { type: val });
    }
  }, [faction.id, factions]);

  return (
    <ControlledDropDown
      selectableOptions={GoalTypes}
      onUpdate={handleUpdate}
      data-testid="goal-text"
    >
      {faction.goal?.type || "None"}
    </ControlledDropDown>
  );
}
