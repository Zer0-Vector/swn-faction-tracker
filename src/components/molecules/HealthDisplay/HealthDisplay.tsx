import React from "react";

import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";

import FactionHpSummary from "../FactionHpSummary";

interface HealthDisplayProps {
  factionId: string;
  hp: number;
  maxHp: number;
}

export default function HealthDisplay(props: HealthDisplayProps) {
  return (
    <>
      <Tooltip
        title={ <FactionHpSummary {...props} /> }
        arrow={true}
      >
        <LinearProgress
          color="error"
          value={100 * props.hp / props.maxHp}
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
