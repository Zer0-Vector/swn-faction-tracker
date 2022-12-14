import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import { IGameState } from "../../../types/RuntimeGameState";
import { generateSlug } from "../../../utils/SlugGenerator";

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
  checkFactionName: (s: string) => generateSlug(s) !== "test-1" && generateSlug(s) !== "test-2",
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
