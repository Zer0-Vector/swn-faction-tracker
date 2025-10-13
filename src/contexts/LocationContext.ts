import React from "react";

import LocationInfo from "../utils/LocationInfo";
import { NamedElementPoset } from "../utils/NamedElementPoset";

type LocationRequiredProps = {
  tl: number;
  x: number;
  y: number;
};

export class LocationsPoset extends NamedElementPoset<LocationInfo, LocationRequiredProps> {

  constructor(elements: LocationInfo[] = []) {
    super(LocationInfo.from, elements)
  }

}

export interface LocationContextType {
  locations: LocationsPoset;
}

export const LocationContext = React.createContext({} as LocationContextType);

export const useLocations = () => {
  const ctx = React.useContext(LocationContext);
  if (!ctx) throw new Error("useLocations must be used within a LocationContextProvider");
  return React.useSyncExternalStore(
      ctx.locations.subscribe.bind(ctx.locations),
      () => ctx.locations);
};
