import React from "react";

import type FactionInfo from "../../../../utils/FactionInfo";
import GoalText from "../../../molecules/GoalText";

import { Item, ItemHeader } from "./helpers";

interface GoalItemProps {
  faction: FactionInfo,
}

export default function GoalItem({ faction }: Readonly<GoalItemProps>) {
  return (<>
    <ItemHeader data-testid="goal-label">Goal:</ItemHeader>
    <Item data-testid="goal-item">
      <GoalText faction={faction} />
    </Item>
  </>)
}
