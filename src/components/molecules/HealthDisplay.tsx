import React, { useContext } from "react";

import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";

import { GameContext } from "../../contexts/GameContext";

import FactionHpSummary from "./FactionHpSummary";

interface HealthDisplayProps {
  factionName: string;
}

export default function HealthDisplay({ factionName }: HealthDisplayProps) {
  const { state } = useContext(GameContext);
  const faction = state.getFaction(factionName);
  if (!faction) {
    return (<>No Faction Selected</>);
  }

  const { hp, maxHp } = faction.stats;

  return (
    <>
      <Tooltip
        title={ <FactionHpSummary factionName={factionName} /> }
        arrow={true}
      >
        <LinearProgress
          color="error"
          value={100 * hp / maxHp}
          variant="determinate"
          sx={{
            minWidth: "50px",
            width: "100%",
            height: "1.25rem"
          }}
        />
      </Tooltip>
    </>
  );
}
