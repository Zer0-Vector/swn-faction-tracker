import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import FactionInfo from "../../../utils/FactionInfo";
import { MockAction } from "../../__mocks__/MockAction";

import GoalProgress from "./GoalProgress";

export default {
  component: GoalProgress,
  decorators: [
    story => {
      return (
        <FactionContext.Provider value={{
          factions: {
            ...MockAction("update"),
          } as unknown as FactionPoset,
        }}>
          {story()}
        </FactionContext.Provider>
      );
    },
  ],
} as ComponentMeta<typeof GoalProgress>;

const Template: ComponentStory<typeof GoalProgress> = args => <GoalProgress {...args} />;

export const Default = Template.bind({});
Default.args = {
  faction: {
    slug: "test-1",
    goal: {
      type: "Blood the Enemy",
      tally: 1,
      target: 2,
    },
  } as FactionInfo,
};

export const NoGoal = Template.bind({});
NoGoal.args = {
  faction: {
    slug: "test-2",
  } as FactionInfo,
};
