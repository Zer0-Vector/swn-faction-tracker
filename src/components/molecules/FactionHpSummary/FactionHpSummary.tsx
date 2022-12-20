import React, { useCallback, useContext } from "react";

import Box from "@mui/material/Box";

import { FactionContext } from "../../../contexts/FactionContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import TestableProps from "../../../types/TestableProps";
import StatText from "../../atoms/StatText";
import { ControlledStat } from "../ControlledStat";

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
  const { factions } = useContext(FactionContext);
  const handleUpdate = useCallback((val: number) => {
      factions.update(factionId, "hp", val);
  }, [factionId, factions]);  

  return (
    <HpBox data-testid="faction-hp-box">
      <ControlledStat
        onUpdate={handleUpdate}
        inputSx={{ maxWidth: "3rem"}}
        data-testid="hp"
      >
        {hp}
      </ControlledStat>
      <StatText>/</StatText>
      <StatText data-testid="maxhp">{maxHp}</StatText>
    </HpBox>
  );
}
