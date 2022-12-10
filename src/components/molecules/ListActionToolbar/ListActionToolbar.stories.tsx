import React from "react";

import { ComponentMeta, ComponentStory} from "@storybook/react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import UiState from "../../../types/UiState";

import ListActionToolbar from "./ListActionToolbar";

export default {
  component: ListActionToolbar,
  decorators: [
    story => <UiStateContext.Provider value={{
      state: {
        editMode: "EDIT",
      } as UiState,
      controller: {} as UiStateController,
    }}>
      {story()}
    </UiStateContext.Provider>,
  ],
} as ComponentMeta<typeof ListActionToolbar>;

const Template: ComponentStory<typeof ListActionToolbar> = args => <ListActionToolbar {...args} />;

export const Default = Template.bind({});

export const Removable = Template.bind({});
Removable.args = {
  removable: true,
};

