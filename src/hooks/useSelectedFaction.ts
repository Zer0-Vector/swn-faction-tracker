import { useContext } from "react";

import { GameContext } from "../contexts/GameContext";

import { useSelectionId } from "./useSelectionId";

export function useSelectedFaction() {
  const { factionId } = useSelectionId();
  const { state } = useContext(GameContext);
  
  return factionId ? state.getFaction(factionId) : undefined;
}
