import React, { useMemo } from "react";

import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";

import FactionHpSummary from "../FactionHpSummary";

interface HealthDisplayProps {
  factionId: string;
  hp: number;
  maxHp: number;
}

export default function HealthDisplay({ factionId, hp, maxHp}: HealthDisplayProps) {
  const sx = useMemo(() => ({
    minWidth: "50px",
    width: "100%",
    height: "1.25rem",
  }), []);

  const tooltip = useMemo(() => (
    <FactionHpSummary factionId={factionId} hp={hp} maxHp={maxHp} />
  ), [factionId, hp, maxHp]);

  return (
    <>
      <Tooltip
        title={tooltip}
        arrow={true}
      >
        <LinearProgress
          color="error"
          value={100 * hp / maxHp}
          variant="determinate"
          sx={sx}
        />
      </Tooltip>
    </>
  );
}
