import React from "react";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";

import EditableStatText from "./EditableStatText";
import StatText from "./StatText";

interface HealthDisplayProps {
  onHpUpdate: (hp: string) => void;
  current: number;
  max: number;
}

export default function HealthDisplay({ current, max, onHpUpdate }: HealthDisplayProps) {
  return (
    <>
      <Tooltip
        title={
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <EditableStatText updateValue={onHpUpdate} sx={{ fontSize: "3rem" }} inputSx={{ maxWidth: "4.5em"}}>
              {current.toString()}
            </EditableStatText>
            <StatText sx={{ fontSize: "3rem" }}>/</StatText>
            <StatText sx={{ fontSize: "3rem" }}>
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
            width: "5rem",
            minWidth: "2rem",
            height: "1.25rem"
          }}
        />
      </Tooltip>
    </>
  );
}
