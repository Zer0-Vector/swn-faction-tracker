import React, { useMemo } from "react";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";

import FactionHpSummary from "../FactionHpSummary";

interface HealthDisplayProps {
  readonly factionId: string;
  readonly hp: number;
  readonly maxHp: number;
}

export default function HealthDisplay({ factionId, hp, maxHp}: HealthDisplayProps) {
  const sx = useMemo(() => ({
    minWidth: "50px",
    width: "100%",
    height: "1.25rem",
  }), []);

  const tooltip = useMemo(() => (
    <Box paddingX={1.25} paddingY={1}>
      <FactionHpSummary factionId={factionId} hp={hp} maxHp={maxHp} />
    </Box>
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
