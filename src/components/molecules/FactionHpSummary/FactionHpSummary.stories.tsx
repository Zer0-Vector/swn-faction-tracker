import React, { useState } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { MockAction } from "../../__mocks__/MockAction";

import FactionHpSummary from "./FactionHpSummary";
import { action } from "@storybook/addon-actions";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";

export default {
  component: FactionHpSummary,
} as ComponentMeta<typeof FactionHpSummary>;

const Template: ComponentStory<typeof FactionHpSummary> = args => {
  const [hp, setHp] = useState<number>(args.hp);
  
  return (
    <UiStateContext.Provider value={{
      state: {
        editMode: "EDIT",
        loginState: "LOGGED_IN",
      }, 
      controller: {} as UiStateController,
    }}>
      <FactionContext.Provider value={{
        factions: {
          update: (...params: Parameters<FactionPoset['update']>) => action("update")(params) as unknown as FactionPoset['update'],
        } as unknown as FactionPoset,
      }}>
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
