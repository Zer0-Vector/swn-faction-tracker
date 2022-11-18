import { useContext } from "react";
import { useLocation } from "react-router-dom";

import { GameContext } from "../contexts/GameContext";
import FactionInfo from "../types/FactionInfo";
import { Maybe } from "../types/Maybe";
import PurchasedAsset from "../types/PurchasedAsset";

interface FactionSelection {
  faction: Maybe<FactionInfo>;
  asset: Maybe<PurchasedAsset>;
}

export function useFactionSelection(): FactionSelection {
  const location = useLocation();
  const { state } = useContext(GameContext);
  
  const pathParts = location.pathname.split("/");
  const selectedFaction = pathParts.length > 2 && pathParts[1] === "factions" ? pathParts[2] : undefined;
  const selectedAsset = pathParts.length > 4 && pathParts[1] === "factions" && pathParts[3] === "assets" ? pathParts[4] : undefined;
  return {
    faction: selectedFaction ? state.getFaction(selectedFaction) : undefined,
    asset: selectedAsset && selectedFaction ? state.getAsset(selectedFaction, selectedAsset) : undefined,
  };
}
