import React, { useEffect, useMemo } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ReadonlyPropsWithChildren } from "../../types/ReadonlyPropsWithChildren";
import LocationInfo from "../../utils/LocationInfo";
import { LocationContext, LocationsPoset } from "../LocationContext";

export function LocationContextProvider({
  children,
}: ReadonlyPropsWithChildren) {
  const [storedLocations, setStoredLocations] = useLocalStorage<LocationInfo[]>(
    "swn-faction-tracker.locations",
    []
  );
  const locationsPoset = new LocationsPoset(storedLocations);

  useEffect(
    () =>
      locationsPoset.subscribe(() => {
        setStoredLocations(locationsPoset.getAll());
      }),
    [setStoredLocations]
  );

  const context = useMemo(
    () => ({ locations: locationsPoset }),
    [locationsPoset]
  );

  return (
    <LocationContext.Provider value={context}>
      {children}
    </LocationContext.Provider>
  );
}
