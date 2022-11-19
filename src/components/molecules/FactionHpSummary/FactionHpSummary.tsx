import React, { useContext } from "react";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { GameContext } from "../../../contexts/GameContext";
import EditableStatText from "../../atoms/EditableStatText";
import StatText from "../../atoms/StatText";

interface HealthTextProps {
  factionId: string;
}

export default function FactionHpSummary({ factionId: factionName }: HealthTextProps) {
  const { state, controller } = useContext(GameContext);

  const HpBox = styled(Box)(theme => ({
    display: "flex",
    alignItems: "center",
  }));

  const faction = state.getFaction(factionName);
  if (!faction) {
    return (
      <HpBox>
        <StatText color="warning.main">??/??</StatText>
      </HpBox>
    );
  }

  const { hp, maxHp } = faction.stats;
  const handleUpdate = (val: string) => {
    try {
      controller.updateHp(factionName, parseInt(val));
    } catch {
      console.error("Could not parse faction hp input: ", val);
    }
  };

  return (
    <HpBox>
      <EditableStatText updateValue={handleUpdate} inputSx={{ maxWidth: "4em"}}>
        {hp}
      </EditableStatText>
      <StatText>/</StatText>
      <StatText>{maxHp}</StatText>
    </HpBox>
  );
}
