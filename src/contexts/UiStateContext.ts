import { createContext } from "react";

import { IUiStateController } from "../controllers/UiStateController";
import UiState from "../types/UiState";

interface UiStateContextType {
  state: UiState;
  controller: IUiStateController;
}

export const UiStateContext = createContext<UiStateContextType>({} as UiStateContextType);
