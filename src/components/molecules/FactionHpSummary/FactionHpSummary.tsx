import React, { useCallback, useContext } from "react";

import Box from "@mui/material/Box";

import { GameContext } from "../../../contexts/GameContext";
import EditableStatText from "../../atoms/EditableStatText";
import StatText from "../../atoms/StatText";

interface FactionHpSummaryProps {
  factionId: string;
}

const HpBoxComponent = ({ children, "data-testid": dtid }: { children: React.ReactNode, "data-testid": string }) => (
  <Box display="flex" alignItems="center" data-testid={dtid}>
    {children}
  </Box>
);

const HpBox = React.memo(HpBoxComponent);

export default function FactionHpSummary({ factionId }: FactionHpSummaryProps) {
  const { state, controller } = useContext(GameContext);
  const handleUpdate = useCallback((val: number) => {
      controller.updateHp(factionId, val);
  }, [controller, factionId]);

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
  

  return (
    <HpBox data-testid="faction-hp-box">
      <EditableStatText
        updateValue={handleUpdate}
        inputSx={{ maxWidth: "5ch"}}
        data-testid="hp"
      >
        {hp}
      </EditableStatText>
      <StatText>/</StatText>
      <StatText data-testid="maxhp">{maxHp}</StatText>
    </HpBox>
  );
}
