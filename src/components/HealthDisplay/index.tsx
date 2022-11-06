import { Box, LinearProgress, Tooltip } from "@mui/material";
import { useContext } from "react";
import FactionInfo from "../../types/FactionInfo";
import EditableStatText from "../EditableStatText";
import { GameContext } from "../../GameContext"
import StatText from "../StatText";

type HealthDisplayProps = {
  faction: FactionInfo,
}

export default function HealthDisplay({ faction }: HealthDisplayProps) {

  const { controller } = useContext(GameContext);

  const updateHp = (hp: string): void => {
    try {
      controller.updateHp(faction.name, parseInt(hp));
    } catch (e) {
      console.warn(`Could not parse hp value: '${hp}'`)
    }
  }

  return (
    <>
      <Tooltip 
        title={
          <Box display="flex" alignItems="center">
            <EditableStatText updateValue={updateHp}>
              {faction.stats.hp.toString()}
            </EditableStatText>
            /
            <StatText>
              {faction.stats.maxHp}
            </StatText>
          </Box>
        }
        arrow
      >
        <LinearProgress 
          color="error"
          value={100*faction.stats.hp/faction.stats.maxHp}
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