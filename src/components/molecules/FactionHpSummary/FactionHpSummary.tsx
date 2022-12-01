import React, { useCallback, useContext } from "react";

import Box from "@mui/material/Box";

import { GameContext } from "../../../contexts/GameContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import TestableProps from "../../../types/TestableProps";
import EditableStatText from "../../atoms/EditableStatText";
import StatText from "../../atoms/StatText";

interface FactionHpSummaryProps {
  factionId: string;
  hp: number;
  maxHp: number;
}

type HpBoxProps = RequiredChildrenProps & TestableProps;

const HpBoxComponent = ({ children, "data-testid": dtid }: HpBoxProps) => (
  <Box display="flex" alignItems="center" data-testid={dtid}>
    {children}
  </Box>
);

const HpBox = React.memo(HpBoxComponent);

export default function FactionHpSummary({ factionId, hp, maxHp }: FactionHpSummaryProps) {
  const { controller } = useContext(GameContext);
  const handleUpdate = useCallback((val: number) => {
      controller.updateHp(factionId, val);
  }, [controller, factionId]);  

  return (
    <HpBox data-testid="faction-hp-box">
      <EditableStatText
        onUpdate={handleUpdate}
        inputSx={{ maxWidth: "3rem"}}
        data-testid="hp"
      >
        {hp}
      </EditableStatText>
      <StatText>/</StatText>
      <StatText data-testid="maxhp">{maxHp}</StatText>
    </HpBox>
  );
}
