import React, { useCallback, useContext } from "react";

import { Theme } from "@mui/material";

import { FactionContext } from "../../../contexts/FactionContext";
import StatText from "../../atoms/StatText";
import { ControlledStat } from "../ControlledStat";


interface FactionStatSummaryProps {
  factionId: string;
  force: number;
  cunning: number;
  wealth: number;
}

export default function FactionStatSummary({ factionId, force, cunning, wealth }: FactionStatSummaryProps) {
  const { factions } = useContext(FactionContext);
  const handleUpdateForce = useCallback((val: number) => factions.update(factionId, "force", val), [factionId, factions]);
  const handleUpdateCunning = useCallback((val: number) => factions.update(factionId, "cunning", val), [factionId, factions]);
  const handleUpdateWealth = useCallback((val: number) => factions.update(factionId, "wealth", val), [factionId, factions]);
  const handleInputSx = useCallback((theme: Theme) => ({ 
    ...theme.typography.body2,
    width: "3em",
   }), []);
   
  return (
    <>
      <ControlledStat
        data-testid="faction-force"
        onUpdate={handleUpdateForce}
        inputSx={handleInputSx}
      >
        {force}
      </ControlledStat>
      <StatText variant="body2">/</StatText>
      <ControlledStat
        data-testid="faction-cunning"
        onUpdate={handleUpdateCunning}
        inputSx={handleInputSx}
      >
        {cunning}
      </ControlledStat>
      <StatText variant="body2">/</StatText>
      <ControlledStat
        data-testid="faction-wealth"
        onUpdate={handleUpdateWealth}
        inputSx={handleInputSx}
      >
        {wealth}
      </ControlledStat>
    </>
  );
}
