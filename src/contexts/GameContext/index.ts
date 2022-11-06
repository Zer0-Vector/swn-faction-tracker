import { createContext } from "react";
import { IGameController } from "../../controllers/GameController";
import GameState from "../../types/GameState";

type GameContextType = {
  state: GameState, 
  controller: IGameController
};

export const GameContext = createContext<GameContextType>({} as GameContextType);
