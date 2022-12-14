import { useContext } from "react";

import { GameContext } from "../contexts/GameContext";

import { useSelectionId } from "./useSelectionId";

export function useSelectedAsset() {
  const { factionId, assetId } = useSelectionId();
  const { state } = useContext(GameContext);
  
  return factionId && assetId ? state.getAsset(factionId, assetId) : undefined;
}
