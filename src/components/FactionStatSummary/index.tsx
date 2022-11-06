import React, { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
import EditableStatText from "../EditableStatText";
import StatText from "../StatText";

type FactionStatSummaryProps = {
  factionName: string,
  force: number,
  cunning: number,
  wealth: number,
  fontSize: string,
};

export default function FactionStatSummary({ factionName, force, cunning, wealth, fontSize }: FactionStatSummaryProps) {
  const { controller } = useContext(GameContext);
  
  return (
    <>
      <EditableStatText
        updateValue={val => controller.updateForce(factionName, +val)}
        sx={{ fontSize: fontSize }}
        inputSx={{ maxWidth: `calc(${fontSize} * 1.5)`}}
      >
        {force}
      </EditableStatText>
      <StatText variant="body2" sx={{ fontSize: fontSize }}>/</StatText>
      <EditableStatText
        updateValue={val => controller.updateCunning(factionName, +val)}
        sx={{ fontSize }}
        inputSx={{ maxWidth: `calc(${fontSize} * 1.5)` }}
      >
        {cunning}
      </EditableStatText>
      <StatText variant="body2" sx={{ fontSize }}>/</StatText>
      <EditableStatText
        updateValue={val => controller.updateWealth(factionName, +val)}
        sx={{ fontSize }}
        inputSx={{ maxWidth: `calc(${fontSize} * 1.5)` }}
      >
        {wealth}
      </EditableStatText>
    </>
  );
}