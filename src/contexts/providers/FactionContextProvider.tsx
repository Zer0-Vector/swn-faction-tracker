import React, { PropsWithChildren, useContext, useEffect, useRef } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import FactionInfo from "../../types/FactionInfo";
import { NamedElementPoset } from "../../types/NamedElementPoset";
import { FactionContext } from "../FactionContext";
import { LocationContext } from "../LocationContext";

export function FactionContextProvider({ children }: PropsWithChildren) {
  const [storedFactions, setStoredFactions] = useLocalStorage<FactionInfo[]>("swn-faction-tracker.factions", []);
  const factions = useRef(new NamedElementPoset(
    info => new FactionInfo(info.id, info.slug, info.name),
    storedFactions
  ));
  const { locations } = useContext(LocationContext);

  useEffect(() => {
    const factionsUnsub = factions.current.subscribe(() => {
      setStoredFactions(factions.current.getAll());
    });
    const locationsUnsub = locations.subscribe(action => {
      if (action.type === "REMOVE") {
        factions.current.getAll().forEach(f => {
          if (f.homeworldId === action.id) {
            factions.current.update(f.id, "homeworldId", undefined);
          }
        });
      }
    });
    return () => {
      factionsUnsub();
      locationsUnsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FactionContext.Provider value={{ factions: factions.current }}>
      {children}
    </FactionContext.Provider>
  );
}
