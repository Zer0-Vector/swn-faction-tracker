import React from "react";

import { useFactions } from "../../../contexts/FactionContext";
import FactionInfo from "../../../utils/FactionInfo";
import { GoalTypes, isGoalType } from "../../../types/GoalType";
import { ControlledDropDown } from "../ControlledDropDown";

interface GoalTextProps {
  readonly faction: FactionInfo;
}

export default function GoalText({ faction }: GoalTextProps) {
  const factions = useFactions();

  const handleUpdate = React.useCallback((val: string) => {
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
