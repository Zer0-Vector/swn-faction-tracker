import React, { useContext } from "react";

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
  
  return (
    <>
      <EditableStatText
        data-testid="faction-force"
        updateValue={val => controller.updateForce(factionId, +val)}
        inputSx={theme => ({ 
          ...theme.typography.body2,
          width: "3em",
         })}
      >
        {force}
      </EditableStatText>
      <StatText variant="body2">/</StatText>
      <EditableStatText
        data-testid="faction-cunning"
        updateValue={val => controller.updateCunning(factionId, +val)}
        inputSx={theme => ({ 
          ...theme.typography.body2,
          width: "3em",
         })}
      >
        {cunning}
      </EditableStatText>
      <StatText variant="body2">/</StatText>
      <EditableStatText
        data-testid="faction-wealth"
        updateValue={val => controller.updateWealth(factionId, +val)}
        inputSx={theme => ({ 
          ...theme.typography.body2,
          width: "3em",
         })}
      >
        {wealth}
      </EditableStatText>
    </>
  );
}
