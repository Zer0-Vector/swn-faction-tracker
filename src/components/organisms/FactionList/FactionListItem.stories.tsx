import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionListItem from "./FactionListItem";


interface MockProviderProps {
  children: React.ReactNode;
  state: IGameState;
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
  getFactions: () => {
    return [
      {
        id: "test-faction-stored",
        name: "Test Faction Stored",
      },
    ];
  },
} as IGameState;

export default {
  component: FactionListItem,
  decorators: [
    story => (
      <MemoryRouter initialEntries={["/"]}>
        {story()}
      </MemoryRouter>
    ),
    story => (
      <MockProvider state={MockedState}>
        {story()}
      </MockProvider>
    ),
  ],
} as ComponentMeta<typeof FactionListItem>;

const Template: ComponentStory<typeof FactionListItem> = args => {
  return <FactionListItem {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  faction: {
    id: "test-faction",
    name: "Test Faction",
    stats: {
      force: 11,
      cunning: 22,
      wealth: 33,
      hp: 8,
      maxHp: 16,
      xp: 999,
    },
  },
};
