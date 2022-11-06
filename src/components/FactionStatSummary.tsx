import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import EditableStatText from "./EditableStatText";
import StatText from "./StatText";
import { Property } from "csstype";


type FactionStatSummaryProps = {
  factionName: string,
  force: number,
  cunning: number,
  wealth: number,
  fontSize?: Property.FontSize<number | string>,
};

export default function FactionStatSummary({ factionName, force, cunning, wealth, fontSize }: FactionStatSummaryProps) {
  const { controller } = useContext(GameContext);
  
  return (
    <>
      <EditableStatText
        updateValue={val => controller.updateForce(factionName, +val)}
        sx={{ fontSize: fontSize }}
        inputSx={{ width: `calc(${fontSize} * 1.5)`, minWidth: "3em" }}
      >
        {force}
      </EditableStatText>
      <StatText variant="body2" sx={{ fontSize: fontSize }}>/</StatText>
      <EditableStatText
        updateValue={val => controller.updateCunning(factionName, +val)}
        sx={{ fontSize }}
        inputSx={{ width: `calc(${fontSize} * 1.5)`, minWidth: "3em"  }}
      >
        {cunning}
      </EditableStatText>
      <StatText variant="body2" sx={{ fontSize }}>/</StatText>
      <EditableStatText
        updateValue={val => controller.updateWealth(factionName, +val)}
        sx={{ fontSize }}
        inputSx={{ maxWidth: `calc(${fontSize} * 1.5)`, minWidth: "3em"  }}
      >
        {wealth}
      </EditableStatText>
    </>
  );
}
