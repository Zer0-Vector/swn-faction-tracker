import { createContext } from "react";

import { IUiStateController } from "../controllers/UiStateController";
import UiState from "../types/UiState";

export interface UiStateContextType {
  state: UiState;
  controller: IUiStateController;
}

export const UiStateContext = createContext<UiStateContextType>({
  state: {
    loginState: "LOGGED_OUT",
    editMode: "VIEW",
    turnState: "IDLE",
  },
  controller: {} as IUiStateController,
} as UiStateContextType);
