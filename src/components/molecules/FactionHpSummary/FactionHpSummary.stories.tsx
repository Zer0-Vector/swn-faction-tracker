import React, { useState } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";

import FactionHpSummary from "./FactionHpSummary";

export default {
  component: FactionHpSummary,
} as ComponentMeta<typeof FactionHpSummary>;

const Template: ComponentStory<typeof FactionHpSummary> = args => {
  const [hp, setHp] = useState<number>(args.hp);
  
  return (
    <FactionContext.Provider value={{
      factions: {
        update: jest.fn() as FactionPoset['update'],
      } as FactionPoset,
    }}>
      <FactionHpSummary {...args} hp={hp} />
    </FactionContext.Provider>
  );
};

export const Default = Template.bind({});
Default.args = {
  factionId: "test123",
  hp: 11,
  maxHp: 12,
};
