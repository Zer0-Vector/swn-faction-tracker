import { createContext } from "react";
import { IGameController } from "../controllers/GameController";
import { IGameState } from "../types/RuntimeGameState";

interface GameContextType {
  state: IGameState;
  controller: IGameController;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);
