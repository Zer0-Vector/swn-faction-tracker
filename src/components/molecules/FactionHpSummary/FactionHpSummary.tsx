import React, { useContext } from "react";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { GameContext } from "../../../contexts/GameContext";
import EditableStatText from "../../atoms/EditableStatText";
import StatText from "../../atoms/StatText";

interface FactionHpSummaryProps {
  factionId: string;
}

export default function FactionHpSummary({ factionId }: FactionHpSummaryProps) {
  const { state, controller } = useContext(GameContext);

  const HpBox = styled(Box)(theme => ({
    display: "flex",
    alignItems: "center",
  }));

  const faction = state.getFaction(factionId);
  console.debug(`faction(${factionId}) =`, faction);
  if (!faction) {
    return (
      <HpBox data-testid="faction-hp-box">
        <StatText color="warning.main">??/??</StatText>
      </HpBox>
    );
  }

  const { hp, maxHp } = faction.stats;
  const handleUpdate = (val: string) => {
    try {
      controller.updateHp(factionId, parseInt(val));
    } catch {
      console.error("Could not parse faction hp input: ", val);
    }
  };

  return (
    <HpBox data-testid="faction-hp-box">
      <EditableStatText
        updateValue={handleUpdate}
        inputSx={{ maxWidth: "4em"}}
        data-testid="hp"
      >
        {hp}
      </EditableStatText>
      <StatText>/</StatText>
      <StatText data-testid="maxhp">{maxHp}</StatText>
    </HpBox>
  );
}
