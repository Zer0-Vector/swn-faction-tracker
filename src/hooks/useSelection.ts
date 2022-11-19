import { useContext } from "react";

import { GameContext } from "../contexts/GameContext";
import FactionInfo from "../types/FactionInfo";
import LocationInfo from "../types/LocationInfo";
import PurchasedAsset from "../types/PurchasedAsset";

import { useSelectionId } from "./useSelectionId";

interface FactionSelection {
  faction: FactionInfo;
  asset: PurchasedAsset;
  location: LocationInfo;
}

export function useSelection(): Partial<FactionSelection> {
  const { factionId, assetId, locationId } = useSelectionId();
  const { state } = useContext(GameContext);
  
  return {
    faction: factionId ? state.getFaction(factionId) : undefined,
    asset: assetId && factionId ? state.getAsset(factionId, assetId) : undefined,
    location: locationId ? state.getLocation(locationId) : undefined,
  };
}
