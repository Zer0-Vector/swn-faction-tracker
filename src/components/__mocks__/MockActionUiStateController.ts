import { action } from "@storybook/addon-actions";

import { IUiStateController } from "../../controllers/UiStateController";

export const MockActionUiStateController: IUiStateController = {
  setLoginState(...args) {
    action(this.setLoginState.name)(...args);
  },
};
