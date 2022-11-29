import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionHpSummary from "./FactionHpSummary";

interface MockProviderProps {
  state: IGameState;
  children: React.ReactNode;
}

const MockProvider = ({ state, children }: MockProviderProps) => (
  <GameContext.Provider value={{
    state,
    controller: {} as IGameController,
  }}>
    {children}
  </GameContext.Provider>
);

const MockedState = {
  getFaction: id => {
    if (id === "test123") {
      return {
        id: "test123",
        name: "Test123",
        stats: {
          hp: 11,
          maxHp: 22,
        }
      };
    } else {
      return undefined;
    }
  }
} as IGameState;

export default {
  component: FactionHpSummary,
  decorators: [
    story => (
      <MockProvider state={MockedState}>
        {story()}
      </MockProvider>
    ),
  ],
} as ComponentMeta<typeof FactionHpSummary>;

const Template: ComponentStory<typeof FactionHpSummary> = args => <FactionHpSummary {...args} />;

export const UnknownFaction = Template.bind({});
UnknownFaction.args = {
  factionId: "dunno",
};

export const Default = Template.bind({});
Default.args = {
  factionId: "test123",
};
