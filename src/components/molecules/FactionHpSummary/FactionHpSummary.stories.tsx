import React, { useState } from "react";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";

import FactionHpSummary from "./FactionHpSummary";

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
          update: (...params: Parameters<FactionPoset['update']>) => {
            params[1] === "hp" && setHp(params[2] as number);
            action("update")(params);
          },
        } as FactionPoset,
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
