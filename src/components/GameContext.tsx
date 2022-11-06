import { createContext } from "react";
import { IGameController } from "../GameController";
import GameState from "../types/GameState";

type GameContextType = {
  state: GameState, 
  controller: IGameController
};

export const GameContext = createContext({} as GameContextType);
