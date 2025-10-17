import React from "react";

import { SxProps, Theme } from "@mui/material/styles";

import { useFactions } from "../../../contexts/FactionContext";
import FactionInfo from "../../../utils/FactionInfo";
import StatText from "../../atoms/StatText";
import { ControlledStat } from "../ControlledStat";

interface GoalProgressProps {
  readonly faction: FactionInfo;
}

export default function GoalProgress({ faction }: GoalProgressProps) {
  const factions = useFactions();
  const inputSx = React.useMemo<SxProps<Theme>>(
    () => ({
      width: "5ch",
    }),
    []
  );

  if (!faction.goal) {
    return <em data-testid="goal-progress-empty">Select Goal</em>;
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
      console.debug(`setting target: '${val}'`);
      factions.update(faction.id, "goal", {
        ...faction.goal,
        target: val,
      });
    }
  };

  const { tally, target } = faction.goal;

  return (
    <span data-testid="goal-progress">
      <ControlledStat
        data-testid="goal-tally"
        onUpdate={handleUpdateTally}
        inputSx={inputSx}
      >
        {tally}
      </ControlledStat>
      <StatText>/</StatText>
      <ControlledStat
        data-testid="goal-target"
        onUpdate={handleUpdateTarget}
        inputSx={inputSx}
      >
        {target}
      </ControlledStat>
    </span>
  );
}
