import React, { useEffect, useRef } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import LocationInfo from "../../types/LocationInfo";
import { NamedElementPoset } from "../../types/NamedElementPoset";
import { LocationContext } from "../LocationContext";

export function LocationContextProvider({ children }: React.PropsWithChildren<{}>) {
  const [storedLocations, setStoredLocations] = useLocalStorage<LocationInfo[]>("swn-faction-tracker.locations", []);
  const locations = useRef(new NamedElementPoset<LocationInfo, { tl: number, x: number, y: number }>(
    info => new LocationInfo(info.id, info.slug, info.name, info.tl, info.x, info.y),
    storedLocations
  ));

  useEffect(() => locations.current.subscribe(
    () => {
      setStoredLocations(locations.current.getAll());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  return (
    <LocationContext.Provider value={{ locations: locations.current }}>
      {children}
    </LocationContext.Provider>
  );
}
