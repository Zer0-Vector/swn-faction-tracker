import React, { useContext } from "react";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { GameContext } from "../../../contexts/GameContext";
import TestableProps from "../../../types/TestableProps";
import EditableStatText from "../../atoms/EditableStatText";
import StatText from "../../atoms/StatText";

interface FactionHpSummaryProps extends TestableProps {
  factionId: string;
}

export default function FactionHpSummary({ factionId, "data-testid": dtid }: FactionHpSummaryProps) {
  const { state, controller } = useContext(GameContext);

  const HpBox = styled(Box)(theme => ({
    display: "flex",
    alignItems: "center",
  }));

  const faction = state.getFaction(factionId);
  console.debug(`faction(${factionId}) =`, faction);
  if (!faction) {
    return (
      <HpBox>
        <StatText color="warning.main" data-testid={dtid}>??/??</StatText>
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
    <HpBox>
      <EditableStatText
        updateValue={handleUpdate}
        inputSx={{ maxWidth: "4em"}}
        data-testid={`${dtid}-hp`}
      >
        {hp}
      </EditableStatText>
      <StatText>/</StatText>
      <StatText data-testid={`${dtid}-maxhp`}>{maxHp}</StatText>
    </HpBox>
  );
}
