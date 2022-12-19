import React from "react";

import LocationInfo from "../types/LocationInfo";
import { INamedElementPoset } from "../types/NamedElementPoset";

export type LocationsPoset = INamedElementPoset<LocationInfo, { tl: number, x: number, y: number }>;

export interface LocationContextType {
  locations: LocationsPoset;
}

export const LocationContext = React.createContext({} as LocationContextType);
