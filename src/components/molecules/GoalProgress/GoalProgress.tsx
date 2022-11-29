import React, { useContext } from "react";

import { GameContext } from "../../../contexts/GameContext";
import FactionInfo from "../../../types/FactionInfo";
import EditableStatText from "../../atoms/EditableStatText";
import StatText from "../../atoms/StatText";

interface GoalProgressProps {
  faction: FactionInfo;
}

export default function GoalProgress({ faction }: GoalProgressProps) {
  const { controller } = useContext(GameContext);

  if (!faction.goal) {
    return (
      <em data-testid="goal-progress">Select Goal</em>
    );
  }

  const handleUpdateTally = (val: number) => {
    if (faction.goal) {
      console.debug(`setting tally: '${val}'`);
      controller.setGoal(faction.id, {
        ...faction.goal,
        tally: val,
      });
    }
  };

  const handleUpdateTarget = (val: number) => {
    if (faction.goal) {
      controller.setGoal(faction.id, {
        ...faction.goal,
        target: val,
      });
    }
  };

  const valueOrDefault = (val: number | undefined) => {
    return val === undefined || val === null ? "??" : val;
  };

  const { tally, target } = faction.goal;

  return (
    <span data-testid="goal-progress">
      <EditableStatText data-testid="goal-tally" updateValue={handleUpdateTally} inputSx={{ width: "3em" }}>{valueOrDefault(tally)}</EditableStatText>
      <StatText>/</StatText>
      <EditableStatText data-testid="goal-target" updateValue={handleUpdateTarget} inputSx={{ width: "3em" }}>{valueOrDefault(target)}</EditableStatText>
    </span>
  );
}
