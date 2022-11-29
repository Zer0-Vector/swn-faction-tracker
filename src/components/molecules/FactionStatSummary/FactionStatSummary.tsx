import React, { useCallback, useContext } from "react";

import { Theme } from "@mui/material";

import { GameContext } from "../../../contexts/GameContext";
import EditableStatText from "../../atoms/EditableStatText";
import StatText from "../../atoms/StatText";


interface FactionStatSummaryProps {
  factionId: string;
  force: number;
  cunning: number;
  wealth: number;
}

export default function FactionStatSummary({ factionId, force, cunning, wealth }: FactionStatSummaryProps) {
  const { controller } = useContext(GameContext);
  const handleUpdateForce = useCallback((val: number) => controller.updateForce(factionId, val), [controller, factionId]);
  const handleUpdateCunning = useCallback((val: number) => controller.updateCunning(factionId, val), [controller, factionId]);
  const handleUpdateWealth = useCallback((val: number) => controller.updateWealth(factionId, val), [controller, factionId]);
  const handleInputSx = useCallback((theme: Theme) => ({ 
    ...theme.typography.body2,
    width: "3em",
   }), []);
   
  return (
    <>
      <EditableStatText
        data-testid="faction-force"
        onUpdate={handleUpdateForce}
        inputSx={handleInputSx}
      >
        {force}
      </EditableStatText>
      <StatText variant="body2">/</StatText>
      <EditableStatText
        data-testid="faction-cunning"
        onUpdate={handleUpdateCunning}
        inputSx={handleInputSx}
      >
        {cunning}
      </EditableStatText>
      <StatText variant="body2">/</StatText>
      <EditableStatText
        data-testid="faction-wealth"
        onUpdate={handleUpdateWealth}
        inputSx={handleInputSx}
      >
        {wealth}
      </EditableStatText>
    </>
  );
}
