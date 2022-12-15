import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockAction } from "../../__mocks__/MockAction";

import GoalProgress from "./GoalProgress";

export default {
  component: GoalProgress,
  decorators: [
    story => {
      return (
        <GameContext.Provider value={{
          state: {} as IGameState,
          controller: {
            ...MockAction("setGoal"),
          } as unknown as IGameController,
        }}>
          {story()}
        </GameContext.Provider>
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
