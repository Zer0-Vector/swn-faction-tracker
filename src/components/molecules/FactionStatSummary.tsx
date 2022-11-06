import React, { useContext } from "react";

import { GameContext } from "../../contexts/GameContext";
import EditableStatText from "../atoms/EditableStatText";
import StatText from "../atoms/StatText";


interface FactionStatSummaryProps {
  factionName: string;
  force: number;
  cunning: number;
  wealth: number;
}

export default function FactionStatSummary({ factionName, force, cunning, wealth }: FactionStatSummaryProps) {
  const { controller } = useContext(GameContext);
  
  return (
    <>
      <EditableStatText
        updateValue={val => controller.updateForce(factionName, +val)}
        inputSx={theme => ({ 
          ...theme.typography.body2,
          width: "3em",
         })}
      >
        {force}
      </EditableStatText>
      <StatText variant="body2">/</StatText>
      <EditableStatText
        updateValue={val => controller.updateCunning(factionName, +val)}
        inputSx={theme => ({ 
          ...theme.typography.body2,
          width: "3em",
         })}
      >
        {cunning}
      </EditableStatText>
      <StatText variant="body2">/</StatText>
      <EditableStatText
        updateValue={val => controller.updateWealth(factionName, +val)}
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
