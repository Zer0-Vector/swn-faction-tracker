import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { MockActionUiStateController } from "../../__mocks__/MockActionUiStateController";

import { PasswordResetErrorDialog } from "./PasswordResetErrorDialog";

export default {
  component: PasswordResetErrorDialog,
  decorators: [
    story => (
      <UiStateContext.Provider value={{
        state: {
          loginState: "PASSWORD_RESET_ERROR",
        },
        controller: MockActionUiStateController,
      }}>
        {story()}
      </UiStateContext.Provider>
    ),
  ],
} as ComponentMeta<typeof PasswordResetErrorDialog>;

const Template: ComponentStory<typeof PasswordResetErrorDialog> = () => <PasswordResetErrorDialog />;

export const Default = Template.bind({});
