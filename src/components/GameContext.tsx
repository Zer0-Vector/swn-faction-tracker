import { createContext } from "react";
import FactionInfo from "../types/FactionInfo";
import GameState from "../types/GameState";

export type GameController = {
  removeFaction: (name: string) => void;
  addFaction: (faction: FactionInfo) => void,
}

export type GameContextType = {
  state: GameState, 
  controller: GameController
};

export const GameContext = createContext({} as GameContextType);
