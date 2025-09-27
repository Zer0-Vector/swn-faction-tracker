import React, { useMemo, useState } from "react";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import UiState from "../../../types/UiState";

import FactionHpSummary from "./FactionHpSummary";

export default {
  component: FactionHpSummary,
} as ComponentMeta<typeof FactionHpSummary>;

const Template: ComponentStory<typeof FactionHpSummary> = args => {
  const [hp, setHp] = useState<number>(args.hp);
  const uiStateContext = useMemo(() => ({
    state: {
      editMode: "EDIT",
      loginState: "LOGGED_IN",
    } as UiState,
    controller: {} as UiStateController,
  }), []);

  const factionContext = useMemo(() => ({
    factions: {
      update: (...params: Parameters<FactionPoset['update']>) => {
        params[1] === "hp" && setHp(params[2] as number);
        action("update")(params);
      },
    } as FactionPoset,
  }), []);
  
  return (
    <UiStateContext.Provider value={uiStateContext}>
      <FactionContext.Provider value={factionContext}>
        <FactionHpSummary {...args} hp={hp} />
      </FactionContext.Provider>
    </UiStateContext.Provider>
  );
};

export const Default = Template.bind({});
Default.args = {
  factionId: "test123",
  hp: 11,
  maxHp: 12,
};
