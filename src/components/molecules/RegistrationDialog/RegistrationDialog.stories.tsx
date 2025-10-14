import React from "react";
import { User } from "firebase/auth";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import UiState from "../../../types/UiState";
import { MockAction } from "../../__mocks__/MockAction";

import RegistrationDialog from "./RegistrationDialog";

const mockAuth = {
  signup: (...args) => {
    action("signup")(...args);
    return Promise.resolve({
      emailVerified: false,
    });
  },
  sendEmailVerification: (u: User) => {
    action("sendEmailVerification")(u);
    return Promise.resolve();
  },
} as ProvidedAuth;

export default {
  component: RegistrationDialog,
  decorators: [
    (story) => (
      <AuthContext.Provider value={mockAuth}>{story()}</AuthContext.Provider>
    ),
    (story) => (
      <UiStateContext.Provider
        value={{
          state: {
            loginState: "REGISTERING",
          } as UiState,
          controller: {
            ...MockAction("setLoginState"),
          } as unknown as UiStateController,
        }}
      >
        {story()}
      </UiStateContext.Provider>
    ),
  ],
} as ComponentMeta<typeof RegistrationDialog>;

const Template: ComponentStory<typeof RegistrationDialog> = () => (
  <RegistrationDialog />
);

export const Default = Template.bind({});
