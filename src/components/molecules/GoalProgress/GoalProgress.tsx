import React, { useContext, useMemo } from "react";

import { SxProps, Theme } from "@mui/material/styles";

import { GameContext } from "../../../contexts/GameContext";
import FactionInfo from "../../../types/FactionInfo";
import StatText from "../../atoms/StatText";
import { ControlledStat } from "../ControlledStat";

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
      controller.setGoal(faction.slug, {
        ...faction.goal,
        tally: val,
      });
    }
  };

  const handleUpdateTarget = (val: number) => {
    if (faction.goal) {
      controller.setGoal(faction.slug, {
        ...faction.goal,
        target: val,
      });
    }
  };

  const { tally, target } = faction.goal;

  return (
    <span data-testid="goal-progress">
      <ControlledStat data-testid="goal-tally" onUpdate={handleUpdateTally} inputSx={inputSx}>{tally}</ControlledStat>
      <StatText>/</StatText>
      <ControlledStat data-testid="goal-target" onUpdate={handleUpdateTarget} inputSx={inputSx}>{target}</ControlledStat>
    </span>
  );
}
