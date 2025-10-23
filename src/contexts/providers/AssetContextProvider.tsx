import React, { useEffect, useMemo, useRef } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ReadonlyPropsWithChildren } from "../../types/ReadonlyPropsWithChildren";
import PurchasedAsset from "../../utils/PurchasedAsset";
import { AssetContext, AssetContextType, AssetPoset } from "../AssetContext";
import { useFactions } from "../FactionContext";
import { useLocations } from "../LocationContext";

export function AssetContextProvider({ children }: ReadonlyPropsWithChildren) {
  const [storedAssets, setStoredAssets] = useLocalStorage<PurchasedAsset[]>(
    "swn-faction-tracker.assets",
    []
  );

  const assets = useRef(new AssetPoset(storedAssets));

  const locations = useLocations();
  const factions = useFactions();

  useEffect(() => {
    const assetsUnsubscribe = assets.current.subscribe(() => {
      setStoredAssets(assets.current.getAll());
      // TODO queue update for remote storage
    });

    const locationsUnsubscribe = locations.subscribe((action) => {
      if (action.type === "REMOVE") {
        const filtered = assets.current
          .getAll()
          .filter((a) => a.locationId === action.id);
        for (const a of filtered) {
          assets.current.update(a.id, "locationId", undefined);
        }
      }
    });

    const factionsUnsubscribe = factions.subscribe((action) => {
      if (action.type === "REMOVE") {
        const filtered = assets.current
          .getAll()
          .filter((a) => a.factionId === action.id);
        for (const a of filtered) {
          assets.current.remove(a.id);
        }
      }
    });

    return () => {
      assetsUnsubscribe();
      locationsUnsubscribe();
      factionsUnsubscribe();
    };
  }, [assets, locations, factions]);

  const context = useMemo<AssetContextType>(
    () => ({ assets: assets.current }),
    []
  );

  return (
    <AssetContext.Provider value={context}>{children}</AssetContext.Provider>
  );
}
