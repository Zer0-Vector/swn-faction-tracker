import React from "react";

import { NamedElementPoset } from "../utils/NamedElementPoset";
import PurchasedAsset from "../utils/PurchasedAsset";

export class AssetPoset extends NamedElementPoset<PurchasedAsset, { factionId: string }, "name", "factionId"> {
  constructor(elements: PurchasedAsset[] = []) {
    super(PurchasedAsset.from, elements,
      (args: { factionId: string }) =>
          (e: PurchasedAsset) => {
            return e.factionId === args.factionId;
          }
    );
  }
}

export interface AssetContextType {
  assets: AssetPoset;
}

export const AssetContext = React.createContext<AssetContextType>({} as AssetContextType);

export const useAssets = () => {
  const ctx = React.useContext(AssetContext);
  if (!ctx) throw new Error("useAssets must be used within a AssetContextProvider");

  return React.useSyncExternalStore(
      ctx.assets.subscribe.bind(ctx.assets),
      () => ctx.assets);
}
