import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { MockAction } from "../../__mocks__/MockAction";

import HealthDisplay from "./HealthDisplay";

export default {
  component: HealthDisplay,
  decorators: [
    story => (
      <div style={{ padding: 10, margin: 10 }}>
        {story()}
      </div>
    ),
    story => (
      <FactionContext.Provider value={{
        factions: {
          ...MockAction("update"),
        } as unknown as FactionPoset,
      }}>
        {story()}
      </FactionContext.Provider>
    ),
  ],
} as ComponentMeta<typeof HealthDisplay>;

const Template: ComponentStory<typeof HealthDisplay> = args => <HealthDisplay {...args} />;

export const Default = Template.bind({});
Default.args = {
  factionId: "test",
  hp: 5,
  maxHp: 7,
};

export const Full = Template.bind({});
Full.args = {
  factionId: "test",
  hp: 7,
  maxHp: 7,
};

export const Empty = Template.bind({});
Empty.args = {
  factionId: "test",
  hp: 0,
  maxHp: 7,
};
