import React, { useState } from "react";

import { Meta, Story } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import GameMode, { GameModes } from "../../../types/GameMode";
import { IGameState } from "../../../types/RuntimeGameState";
import { ExtendedStoryProps } from "../../__mocks__/ExtendedStoryProps";

import ModeToggleButtons from "./ModeToggleButtons";

interface AdditionalProps {
  mode: GameMode;
}

type StoryProps = ExtendedStoryProps<typeof ModeToggleButtons, AdditionalProps>;

export default {
  component: ModeToggleButtons,
  argTypes: {
    mode: {
      name: "Mode",
      options: GameModes,
      required: true,
      defaultValue: "EDIT",
      control: { type: "select" },
    },
  },
} as Meta<StoryProps>;

const Template: Story<StoryProps> = (args) => {
  const [mode, setMode] = useState<GameMode>(args.mode);
  return (
    <GameContext.Provider value={{
      state: {
        mode: mode,
      } as IGameState,
      controller: {
        setMode(val: string) {
          setMode(val as GameMode);
        },
      } as IGameController,
    }}>
      <ModeToggleButtons />
    </GameContext.Provider>
  );
};

export const Default = Template.bind({});
