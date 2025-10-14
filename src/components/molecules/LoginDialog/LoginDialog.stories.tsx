import React from "react";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import UiState from "../../../types/UiState";
import { MockActionUiStateController } from "../../__mocks__/MockActionUiStateController";

import LoginDialog from "./LoginDialog";

export default {
  component: LoginDialog,
  decorators: [
    (story) => (
      <UiStateContext.Provider
        value={{
          state: {
            loginState: "LOGGING_IN",
          } as UiState,
          controller: MockActionUiStateController,
        }}
      >
        {story()}
      </UiStateContext.Provider>
    ),
    (story) => (
      <AuthContext.Provider
        value={
          {
            login: (...args) => {
              action("login")(...args);
              return Promise.resolve({});
            },
          } as ProvidedAuth
        }
      >
        {story()}
      </AuthContext.Provider>
    ),
  ],
} as ComponentMeta<typeof LoginDialog>;

const Template: ComponentStory<typeof LoginDialog> = () => <LoginDialog />;

export const Default = Template.bind({});
