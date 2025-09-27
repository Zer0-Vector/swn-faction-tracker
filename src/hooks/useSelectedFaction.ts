
import { useFactions } from "../contexts/FactionContext";

import { useSelectionSlug } from "./useSelectionSlug";

export function useSelectedFaction() {
  const { factionSlug } = useSelectionSlug();
  const factions = useFactions();

  return factionSlug ? factions.slugGet(factionSlug) : undefined;
}
