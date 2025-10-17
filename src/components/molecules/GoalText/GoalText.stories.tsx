import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import FactionInfo from "../../../utils/FactionInfo";
import { MockAction } from "../../__mocks__/MockAction";

import GoalText from "./GoalText";

export default {
  component: GoalText,
  decorators: [
    (story) => (
      <FactionContext.Provider
        value={{
          factions: {
            ...MockAction("update"),
          } as unknown as FactionPoset,
        }}
      >
        {story()}
      </FactionContext.Provider>
    ),
  ],
} as ComponentMeta<typeof GoalText>;

const Template: ComponentStory<typeof GoalText> = (args) => (
  <GoalText {...args} />
);

export const Default = Template.bind({});
Default.args = {
  faction: {
    slug: "test-faction",
    goal: {
      type: "Invincible Valor",
    },
  } as FactionInfo,
};

export const Empty = Template.bind({});
Empty.args = {
  faction: {
    slug: "test-faction-2",
  } as FactionInfo,
};
