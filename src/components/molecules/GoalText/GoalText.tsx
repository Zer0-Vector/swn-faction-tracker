import React, { useCallback, useContext } from "react";

import { GameContext } from "../../../contexts/GameContext";
import FactionInfo from "../../../types/FactionInfo";
import { GoalTypes, isGoalType } from "../../../types/GoalType";
import { ControlledDropDown } from "../ControlledDropDown";

interface GoalTextProps {
  faction: FactionInfo;
}

export default function GoalText({faction}: GoalTextProps) {
  const { controller } = useContext(GameContext);
  
  const handleUpdate = useCallback((val: string) => {
    if (isGoalType(val)) {
      controller.setGoal(faction.slug, { type: val });
    }
  }, [controller, faction.slug]);

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
