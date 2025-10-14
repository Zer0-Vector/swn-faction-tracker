import React from "react";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import UiState from "../../../types/UiState";
import { MockActionUiStateController } from "../../__mocks__/MockActionUiStateController";

import { PasswordResetDialog } from "./PasswordResetDialog";

export default {
  component: PasswordResetDialog,
  decorators: [
    (story) => (
      <UiStateContext.Provider
        value={{
          state: {
            loginState: "RESETTING_PASSWORD",
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
            sendPasswordResetEmail: (...args) => {
              action("sendPasswordResetEmail")(...args);
              return Promise.resolve();
            },
          } as ProvidedAuth
        }
      >
        {story()}
      </AuthContext.Provider>
    ),
  ],
} as ComponentMeta<typeof PasswordResetDialog>;

const Template: ComponentStory<typeof PasswordResetDialog> = () => (
  <PasswordResetDialog />
);

export const Default = Template.bind({});
