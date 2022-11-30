import React, { useContext, useMemo } from "react";

import { SxProps, Theme } from "@mui/material/styles";

import { GameContext } from "../../../contexts/GameContext";
import FactionInfo from "../../../types/FactionInfo";
import EditableStatText from "../../atoms/EditableStatText";
import StatText from "../../atoms/StatText";

interface GoalProgressProps {
  faction: FactionInfo;
}

export default function GoalProgress({ faction }: GoalProgressProps) {
  const { controller } = useContext(GameContext);
  const inputSx = useMemo<SxProps<Theme>>(() => ({
    width: "5ch",
  }), []);

  if (!faction.goal) {
    return (
      <em data-testid="goal-progress-empty">Select Goal</em>
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

  const { tally, target } = faction.goal;

  return (
    <span data-testid="goal-progress">
      <EditableStatText data-testid="goal-tally" onUpdate={handleUpdateTally} inputSx={inputSx}>{tally}</EditableStatText>
      <StatText>/</StatText>
      <EditableStatText data-testid="goal-target" onUpdate={handleUpdateTarget} inputSx={inputSx}>{target}</EditableStatText>
    </span>
  );
}
