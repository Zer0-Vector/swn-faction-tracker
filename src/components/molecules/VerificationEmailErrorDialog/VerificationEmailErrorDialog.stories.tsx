import React from "react";
import { User } from "firebase/auth";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import { MockActionUiStateController } from "../../__mocks__/MockActionUiStateController";

import VerificationEmailErrorDialog from "./VerificationEmailErrorDialog";

export default {
  component: VerificationEmailErrorDialog,
  decorators: [
    story => (
      <UiStateContext.Provider value={{
        state: {
          loginState: "VERIFICATION_ERROR",
        },
        controller: MockActionUiStateController,
      }}>
        {story()}
      </UiStateContext.Provider>
    ),
    story => (
      <AuthContext.Provider value={{
        currentUser: {} as User,
        logout: () => {
          action("logout")([]);
          return Promise.resolve();
        },
      } as ProvidedAuth}>
        {story()}
      </AuthContext.Provider>
    ),
  ],
} as ComponentMeta<typeof VerificationEmailErrorDialog>;

const Template: ComponentStory<typeof VerificationEmailErrorDialog> = () => <VerificationEmailErrorDialog />;

export const Default = Template.bind({});
