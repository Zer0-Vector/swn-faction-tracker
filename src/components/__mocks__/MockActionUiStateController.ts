import { action } from "@storybook/addon-actions";

import { IUiStateController } from "../../controllers/UiStateController";

export const MockActionUiStateController: IUiStateController = {
  setLoginState(...args) {
    action(this.setLoginState.name)(...args);
  },
  setEditMode(...args) {
    action(this.setEditMode.name)(...args);
  },
  setTurnState(...args) {
    action(this.setTurnState.name)(...args);
  },
  setTurnInfo(...args) {
    action(this.setTurnInfo.name)(...args);
  },
  setTurnIndex(...args) {
    action(this.setTurnIndex.name)(...args);
  },
};
