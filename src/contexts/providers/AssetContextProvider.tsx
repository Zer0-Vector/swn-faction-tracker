import React, { useEffect, useMemo, useRef } from "react";

import ASSETS, { isAsset } from "../../data/Assets";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { NamedElementPoset } from "../../types/NamedElementPoset";
import PurchasedAsset from "../../types/PurchasedAsset";
import { ReadonlyPropsWithChildren } from "../../types/ReadonlyPropsWithChildren";
import { AssetContext, AssetContextType } from "../AssetContext";
import { useFactions } from "../FactionContext";
import { useLocations } from "../LocationContext";

export function AssetContextProvider({ children }: ReadonlyPropsWithChildren) {
  const [storedAssets, setStoredAssets] = useLocalStorage<PurchasedAsset[]>("swn-faction-tracker.assets", []);
  const assets = useRef(new NamedElementPoset<PurchasedAsset, { factionId: string }, "name", "factionId">(
    info => {
      if (!isAsset(info.name)) {
        throw new Error(`Unknown asset: "${info.name}"`);
      }
      return new PurchasedAsset(info.id, info.slug, info.name, info.factionId, ASSETS[info.name].maxHp);
    },
    storedAssets,
    (args: { factionId: string }) => (e: PurchasedAsset) => {
      return e.factionId === args.factionId;
    }
  ));
  const locations = useLocations();
  const factions = useFactions();

  useEffect(() => {
    const assetsUnsubscribe = assets.current.subscribe(() => setStoredAssets(assets.current.getAll()));
    const locationsUnsubscribe = locations.subscribe(action => {
      if (action.type === "REMOVE") {
        assets.current.getAll().forEach(a => {
          if (a.locationId === action.id) {
            assets.current.update(a.id, "locationId", undefined);
          }
        });
      }
    });
    const factionsUnsubscribe = factions.subscribe(action => {
      if (action.type === "REMOVE") {
        assets.current.getAll().forEach(a => {
          if (a.factionId === action.id) {
            assets.current.remove(a.id);
          }
        });
      }
    });
    return () => {
      assetsUnsubscribe();
      locationsUnsubscribe();
      factionsUnsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useMemo<AssetContextType>(() => ({ assets: assets.current }), []);

  return (
    <AssetContext.Provider value={context}>
      {children}
    </AssetContext.Provider>
  );
}
