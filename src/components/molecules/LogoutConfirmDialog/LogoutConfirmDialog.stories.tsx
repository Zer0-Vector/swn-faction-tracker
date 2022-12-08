import React from "react";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import UiState from "../../../types/UiState";
import { MockActionUiStateController } from "../../__mocks__/MockActionUiStateController";

import LogoutConfirmDialog from "./LogoutConfirmDialog";

export default {
  component: LogoutConfirmDialog,
  decorators: [
    story => (
      <UiStateContext.Provider value={{
        state: {
          loginState: "LOGGING_OUT",
        } as UiState,
        controller: MockActionUiStateController,
      }}>
        {story()}
      </UiStateContext.Provider>
    ),
    story => (
      <AuthContext.Provider value ={{
        logout: () => {
          action("logout")([]);
          return Promise.resolve();
        },
      } as ProvidedAuth}>
        {story()}
      </AuthContext.Provider>
    ),
  ],  
} as ComponentMeta<typeof LogoutConfirmDialog>;

const Template: ComponentStory<typeof LogoutConfirmDialog> = () => <LogoutConfirmDialog />;

export const Default = Template.bind({});
