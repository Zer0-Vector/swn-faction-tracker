import { createContext } from "react";
import { IGameController } from "../../controllers/GameController";
import RuntimeGameState from "../../types/RuntimeGameState";

type GameContextType = {
  state: RuntimeGameState, 
  controller: IGameController
};

export const GameContext = createContext<GameContextType>({} as GameContextType);
