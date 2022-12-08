import React, { useState } from "react";

import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import GameMode, { GameModes } from "../../../types/GameMode";
import UiState from "../../../types/UiState";
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
    <UiStateContext.Provider value={{
      state: {
        editMode: mode,
      } as UiState,
      controller: {
        setEditMode(val: string) {
          action("setEditMode")(val);
          setMode(val as GameMode);
        },
      } as UiStateController,
    }}>
      <ModeToggleButtons />
    </UiStateContext.Provider>
  );
};

export const Default = Template.bind({});
