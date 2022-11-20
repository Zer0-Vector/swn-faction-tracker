import React, { useContext } from "react";

import { GameContext } from "../../../contexts/GameContext";
import FactionInfo from "../../../types/FactionInfo";
import { GoalTypes, isGoalType } from "../../../types/GoalType";
import EditableNameText from "../../atoms/EditableNameText";

interface GoalTextProps {
  faction: FactionInfo;
}

export default function GoalText({faction}: GoalTextProps) {
  const { controller } = useContext(GameContext);
  
  const handleUpdate = (val: string) => {
    if (isGoalType(val)) {
      controller.setGoal(faction.id, { type: val });
    }
  };

  return (
    <EditableNameText
      selectableOptions={GoalTypes as unknown as string[]}
      onUpdate={handleUpdate}
    >
      {faction.goal?.type || "None"}
    </EditableNameText>
  );
}
