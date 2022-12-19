import React, { PropsWithChildren, useContext, useEffect, useMemo, useRef } from "react";

import ASSETS, { isAsset } from "../../data/Assets";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { NamedElementPoset } from "../../types/NamedElementPoset";
import PurchasedAsset from "../../types/PurchasedAsset";
import { AssetContext } from "../AssetContext";
import { FactionContext } from "../FactionContext";
import { LocationContext } from "../LocationContext";

export function AssetContextProvider({ children }: PropsWithChildren) {
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
  const { locations } = useContext(LocationContext);
  const { factions } = useContext(FactionContext);

  useEffect(() => {
    const assetsUnsub = assets.current.subscribe(() => setStoredAssets(assets.current.getAll()));
    const locationsUnsub = locations.subscribe(action => {
      if (action.type === "REMOVE") {
        assets.current.getAll().forEach(a => {
          if (a.locationId === action.id) {
            assets.current.update(a.id, "locationId", undefined);
          }
        });
      }
    });
    const factionsUnsub = factions.subscribe(action => {
      if (action.type === "REMOVE") {
        assets.current.getAll().forEach(a => {
          if (a.factionId === action.id) {
            assets.current.remove(a.id);
          }
        });
      }
    });
    return () => {
      assetsUnsub();
      locationsUnsub();
      factionsUnsub();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useMemo(() => ({ assets: assets.current }), []);

  return (
    <AssetContext.Provider value={context}>
      {children}
    </AssetContext.Provider>
  );
}
