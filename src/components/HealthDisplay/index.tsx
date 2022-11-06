import React from "react";
import EditableStatText from "../EditableStatText";
import StatText from "../StatText";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

type HealthDisplayProps = {
  onHpUpdate: (hp: string) => void,
  current: number,
  max: number,
}

export default function HealthDisplay({ current, max, onHpUpdate }: HealthDisplayProps) {
  return (
    <>
      <Tooltip
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EditableStatText updateValue={onHpUpdate}>
              {current.toString()}
            </EditableStatText>
            /
            <StatText>
              {max}
            </StatText>
          </Box>
        }
        arrow={true}
      >
        <LinearProgress
          color="error"
          value={100 * current / max}
          variant="determinate"
          sx={{ 
            width: "7rem",
            minWidth: "5rem",
            height: "35%",
          }}
        />
      </Tooltip>
    </>
  );
}