import { useContext } from "react";

import { LocationContext } from "../contexts/LocationContext";

import { useSelectionSlug } from "./useSelectionSlug";

export function useSelectedLocation() {
  const { locationSlug } = useSelectionSlug();
  const { locations } = useContext(LocationContext);
  
  return locationSlug ? locations.slugGet(locationSlug) : undefined;
}
