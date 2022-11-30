import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockAction } from "../../__mocks__/MockAction";

import FactionStatSummary from "./FactionStatSummary";

export default {
  component: FactionStatSummary,
  decorators: [
    story => (
      <GameContext.Provider value={{
        state: {} as IGameState,
        controller: {
          ...MockAction("updateForce"),
          ...MockAction("updateCunning"),
          ...MockAction("updateWealth"),
        } as unknown as IGameController,
      }}>
        {story()}
      </GameContext.Provider>
    ),
  ],
} as ComponentMeta<typeof FactionStatSummary>;

const Template: ComponentStory<typeof FactionStatSummary> = args => <FactionStatSummary {...args} />;

export const Default = Template.bind({});
Default.args = {
  factionId: "test-123",
  force: 1,
  cunning: 2,
  wealth: 3,
};
