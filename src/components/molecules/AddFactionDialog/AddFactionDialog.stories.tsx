import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import { IGameState } from "../../../types/RuntimeGameState";

import AddFactionDialog from "./AddFactionDialog";

export default {
  component: AddFactionDialog,
} as ComponentMeta<typeof AddFactionDialog>;

interface MockProviderProps extends RequiredChildrenProps {
  state: IGameState;
}

const MockProvider = ({ state, children }: MockProviderProps) => (
  <GameContext.Provider value={{
    state: state,
    controller: {} as IGameController,
  }}>
    {children}
  </GameContext.Provider>
);

const MockState = {
  getFactions: () => ([
    {
      id: "test-1",
      name: "Test 1",
    },
    {
      id: "test-2",
      name: "Test 2",
    },
  ]),
} as IGameState;

export const Default: ComponentStory<typeof AddFactionDialog> = args => <AddFactionDialog {...args} />;
Default.args = {
  open: true,
};
Default.decorators = [
  story => (
    <MockProvider state={MockState}>
      {story()}
    </MockProvider>
  ),
];
