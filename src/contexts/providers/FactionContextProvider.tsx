import React, { useEffect, useMemo } from "react";

import { FactionContext, FactionPoset } from "@/contexts/FactionContext";
import { useLocations } from "@/contexts/LocationContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ReadonlyPropsWithChildren } from "@/types/ReadonlyPropsWithChildren";
import type FactionInfo from "@/utils/FactionInfo";
import type LocationInfo from "@/utils/LocationInfo";
import type { NamedElementPosetAction } from "@/utils/NamedElementPoset";

interface FactionContextProviderProps extends ReadonlyPropsWithChildren {
  readonly factory?: (initialElements: FactionInfo[]) => FactionPoset;
}
export function FactionContextProvider({
  children, factory
}: FactionContextProviderProps) {
  const [storedFactions, setStoredFactions] = useLocalStorage<FactionInfo[]>(
    "swn-faction-tracker.factions",
    []
  );
  const factionsPoset = factory ? factory(storedFactions) : new FactionPoset(storedFactions);
  const locations = useLocations();

  const onFactionsChanged = () => {
    setStoredFactions(factionsPoset.getAll());
    // TODO queue update for remote storage
  };

  const onLocationChanged = (
    action: NamedElementPosetAction<LocationInfo>
  ): void => {
    if (action.type === "REMOVE") {
      const filtered = factionsPoset
        .getAll()
        .filter((f) => f.homeworldId === action.id);
      for (const f of filtered) {
        factionsPoset.update(f.id, "homeworldId", undefined);
      }
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
