import React from "react";

import FactionInfo from "../../../../utils/FactionInfo";
import GoalProgress from "../../../molecules/GoalProgress";

import { Item, ItemHeader } from "./helpers";

interface GoalProgressItemProps {
  faction: FactionInfo;
}

export default function GoalProgressItem({
  faction,
}: Readonly<GoalProgressItemProps>) {
  return (
    <>
      <ItemHeader data-testid="goal-progress-label">Progress:</ItemHeader>
      <Item data-testid="goal-progress-item">
        <GoalProgress faction={faction} />
      </Item>
    </>
  );
}
