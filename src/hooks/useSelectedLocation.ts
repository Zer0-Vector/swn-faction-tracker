import { useLocations } from "../contexts/LocationContext";

import { useSelectionSlug } from "./useSelectionSlug";

export function useSelectedLocation() {
  const { locationSlug } = useSelectionSlug();
  const locations = useLocations();

  return locationSlug ? locations.slugGet(locationSlug) : undefined;
}
