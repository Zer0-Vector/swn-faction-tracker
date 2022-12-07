import React from "react";
import { User } from "firebase/auth";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import { MockActionUiStateController } from "../../__mocks__/MockActionUiStateController";

import NeedsVerificationDialog from "./NeedsVerificationDialog";

export default {
  component: NeedsVerificationDialog,
  decorators: [
    story => (
      <UiStateContext.Provider value={{
        state: {
          loginState: "NEEDS_VERIFICATION",
        },
        controller: MockActionUiStateController,
      }}>
        {story()}
      </UiStateContext.Provider>
    ),
    story => (
      <AuthContext.Provider value={{
        currentUser: {} as User,
        sendEmailVerification: (u: User) => {
          action("sendEmailVerification")(u);
          return Promise.resolve();
        },
      } as ProvidedAuth}>
        {story()}
      </AuthContext.Provider>
    ),
  ],
} as ComponentMeta<typeof NeedsVerificationDialog>;

const Template: ComponentStory<typeof NeedsVerificationDialog> = () => <NeedsVerificationDialog />;

export const Default = Template.bind({});
