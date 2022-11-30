import React from "react";
import { User } from "firebase/auth";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import UiState from "../../../types/UiState";
import { MockAction } from "../../__mocks__/MockAction";

import UserMenu from "./UserMenu";

export default {
  component: UserMenu,
  decorators: [
    story => (
      <UiStateContext.Provider value={{
        state: {} as UiState,
        controller: {
          ...MockAction("setLoginState"),
        } as unknown as UiStateController,
      }}>
        {story()}
      </UiStateContext.Provider>
    ),
  ],
} as ComponentMeta<typeof UserMenu>;

const Template: ComponentStory<typeof UserMenu> = args => <UserMenu {...args} />;

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  user: null,
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {} as User,
};
