import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockActionController } from "../../__mocks__/MockActionController";

import FactionListItem from "./FactionListItem";


interface MockProviderProps extends RequiredChildrenProps {
  state: IGameState;
}

const MockProvider = ({ state, children }: MockProviderProps) => (
  <GameContext.Provider value={{
    state,
    controller: MockActionController,
  }}>
    {children}
  </GameContext.Provider>
);

const MockedState = {
  getFactions: () => {
    return [
      {
        slug: "test-faction-stored",
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
    slug: "test-faction",
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
