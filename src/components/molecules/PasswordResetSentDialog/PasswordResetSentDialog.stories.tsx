import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { MockActionUiStateController } from "../../__mocks__/MockActionUiStateController";

import { PasswordResetSentDialog } from "./PasswordResetSentDialog";

export default {
  component: PasswordResetSentDialog,
  decorators: [
    story => (
      <UiStateContext.Provider value={{
        state: {
          loginState: "PASSWORD_RESET_SENT",
        },
        controller: MockActionUiStateController,
      }}>
        {story()}
      </UiStateContext.Provider>
    ),
  ],
} as ComponentMeta<typeof PasswordResetSentDialog>;

const Template: ComponentStory<typeof PasswordResetSentDialog> = () => <PasswordResetSentDialog />;

export const Default = Template.bind({});
