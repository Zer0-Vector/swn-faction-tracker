import React, { useEffect, useMemo, useRef } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import FactionInfo from "../../types/FactionInfo";
import { NamedElementPoset } from "../../types/NamedElementPoset";
import { ReadonlyPropsWithChildren } from "../../types/ReadonlyPropsWithChildren";
import { FactionContext } from "../FactionContext";
import { useLocations } from "../LocationContext";

export function FactionContextProvider({ children }: ReadonlyPropsWithChildren) {
  const [storedFactions, setStoredFactions] = useLocalStorage<FactionInfo[]>("swn-faction-tracker.factions", []);
  const factions = useRef(new NamedElementPoset(
    FactionInfo.from,
    storedFactions
  ));
  const locations = useLocations();

  useEffect(() => {
    const factionsUnsubscribe = factions.current.subscribe(() => {
      setStoredFactions(factions.current.getAll());
    });
    const locationsUnsubscribe = locations.subscribe(action => {
      if (action.type === "REMOVE") {
        factions.current.getAll().forEach(f => {
          if (f.homeworldId === action.id) {
            factions.current.update(f.id, "homeworldId", undefined);
          }
        });
      }
    });
    return () => {
      factionsUnsubscribe();
      locationsUnsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useMemo(() => ({ factions: factions.current }), [factions]);

  return (
    <FactionContext.Provider value={context}>
      {children}
    </FactionContext.Provider>
  );
}
