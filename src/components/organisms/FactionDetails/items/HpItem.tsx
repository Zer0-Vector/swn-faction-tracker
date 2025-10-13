import React from "react";

import FactionHpSummary from "../../../molecules/FactionHpSummary";

import { Item, ItemHeader } from "./helpers";

interface HpItemProps {
  readonly id: string,
  readonly hp: number,
  readonly maxHp: number,
}

export default function HpItem({ id, hp, maxHp }: HpItemProps) {
  return (
    <>
      <ItemHeader data-testid="hp-label">HP:</ItemHeader>
      <Item data-testid="hp-item">
        <FactionHpSummary factionId={id} hp={hp} maxHp={maxHp} data-testid="hp-summary" />
      </Item>
    </>
  )
}
