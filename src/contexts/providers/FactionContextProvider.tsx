import React, { useEffect, useMemo } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ReadonlyPropsWithChildren } from "../../types/ReadonlyPropsWithChildren";
import FactionInfo from "../../utils/FactionInfo";
import type LocationInfo from "../../utils/LocationInfo";
import { NamedElementPosetAction } from "../../utils/NamedElementPoset";
import { FactionContext, FactionPoset } from "../FactionContext";
import { useLocations } from "../LocationContext";

export function FactionContextProvider({
  children,
}: ReadonlyPropsWithChildren) {
  const [storedFactions, setStoredFactions] = useLocalStorage<FactionInfo[]>(
    "swn-faction-tracker.factions",
    []
  );
  const factionsPoset = new FactionPoset(storedFactions);
  const locations = useLocations();

  const onFactionsChanged = () => {
    setStoredFactions(factionsPoset.getAll());
    // TODO queue update for remote storage
  };

  const onLocationChanged = (
    action: NamedElementPosetAction<LocationInfo>
  ): void => {
    if (action.type === "REMOVE") {
      factionsPoset
        .getAll()
        .filter((f) => f.homeworldId === action.id)
        .forEach((f) => factionsPoset.update(f.id, "homeworldId", undefined));
    }
  };

  useEffect(() => {
    const factionsUnsubscribe = factionsPoset.subscribe(onFactionsChanged);
    const locationsUnsubscribe = locations.subscribe(onLocationChanged);
    return () => {
      factionsUnsubscribe();
      locationsUnsubscribe();
    };
  }, [factionsPoset, locations]);

  const context = useMemo(() => ({ factions: factionsPoset }), [factionsPoset]);

  return (
    <FactionContext.Provider value={context}>
      {children}
    </FactionContext.Provider>
  );
}
