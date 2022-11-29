import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { IGameState } from "../../../types/RuntimeGameState";

import AddLocationDialog from "./AddLocationDialog";

export default {
  component: AddLocationDialog,
} as ComponentMeta<typeof AddLocationDialog>;

const MockedState = {
  getLocations: () => ([
    {
      id: "test-one",
      name: "Test One",
    },
    {
      id: "test-two",
      name: "Test Two",
    }
  ]),
} as IGameState;

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

export const Default: ComponentStory<typeof AddLocationDialog> = args => <AddLocationDialog {...args} />;
Default.args = {
  open: true,
};
Default.decorators = [
  story => (
    <MockProvider state={MockedState}>
      {story()}
    </MockProvider>
  ),
];
