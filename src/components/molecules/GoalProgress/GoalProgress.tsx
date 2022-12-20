import React, { useContext, useMemo } from "react";

import { SxProps, Theme } from "@mui/material/styles";

import { FactionContext } from "../../../contexts/FactionContext";
import FactionInfo from "../../../types/FactionInfo";
import StatText from "../../atoms/StatText";
import { ControlledStat } from "../ControlledStat";

interface GoalProgressProps {
  faction: FactionInfo;
}

export default function GoalProgress({ faction }: GoalProgressProps) {
  const { factions } = useContext(FactionContext);
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
      factions.update(faction.id, "goal", {
        ...faction.goal,
        tally: val,
      });
    }
  };

  const handleUpdateTarget = (val: number) => {
    if (faction.goal) {
      factions.update(faction.id, "goal", {
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
