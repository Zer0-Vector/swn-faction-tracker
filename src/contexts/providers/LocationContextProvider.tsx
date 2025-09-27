import React, { useEffect, useMemo, useRef } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import LocationInfo from "../../types/LocationInfo";
import { NamedElementPoset } from "../../types/NamedElementPoset";
import { ReadonlyPropsWithChildren } from "../../types/ReadonlyPropsWithChildren";
import { LocationContext } from "../LocationContext";

export function LocationContextProvider({ children }: ReadonlyPropsWithChildren) {
  const [storedLocations, setStoredLocations] = useLocalStorage<LocationInfo[]>("swn-faction-tracker.locations", []);
  const locations = useRef(new NamedElementPoset<LocationInfo, { tl: number, x: number, y: number }>(
    info => new LocationInfo(info.id, info.slug, info.name, info.tl, info.x, info.y),
    storedLocations
  ));

  useEffect(() => locations.current.subscribe(
    () => {
      setStoredLocations(locations.current.getAll());
    }
  ), [setStoredLocations]);

  const context = useMemo(() => ({ locations: locations.current }), [locations]);

  return (
    <LocationContext.Provider value={context}>
      {children}
    </LocationContext.Provider>
  );
}
