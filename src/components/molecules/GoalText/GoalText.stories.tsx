import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockAction } from "../../__mocks__/MockAction";

import GoalText from "./GoalText";

export default {
  component: GoalText,
  decorators: [
    story => (
      <GameContext.Provider value={{
        state: {} as IGameState,
        controller: {
          ...MockAction("setGoal"),
        } as unknown as IGameController,
      }}>
        {story()}
      </GameContext.Provider>
    ),
  ],
} as ComponentMeta<typeof GoalText>;

const Template: ComponentStory<typeof GoalText> = args => <GoalText {...args} />;

export const Default = Template.bind({});
Default.args = {
  faction: {
    id: "test-faction",
    goal: {
      type: "Invincible Valor",
    },
  } as FactionInfo,
};

export const Empty = Template.bind({});
Empty.args = {
  faction: {
    id: "test-faction-2",
  } as FactionInfo,
};
