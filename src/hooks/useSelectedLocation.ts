import { useContext } from "react";

import { GameContext } from "../contexts/GameContext";

import { useSelectionId } from "./useSelectionId";

export function useSelectedLocation() {
  const { locationId } = useSelectionId();
  const { state } = useContext(GameContext);
  
  return locationId ? state.getLocation(locationId) : undefined;
}
