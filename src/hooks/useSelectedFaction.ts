import { useContext } from "react";

import { FactionContext } from "../contexts/FactionContext";

import { useSelectionSlug } from "./useSelectionSlug";

export function useSelectedFaction() {
  const { factionSlug } = useSelectionSlug();
  const { factions } = useContext(FactionContext);
  
  return factionSlug ? factions.slugGet(factionSlug) : undefined;
}
