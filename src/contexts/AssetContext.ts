import React from "react";

import { INamedElementPoset } from "../types/NamedElementPoset";
import PurchasedAsset from "../types/PurchasedAsset";

export type AssetPoset = INamedElementPoset<PurchasedAsset, { factionId: string }, "name">;

export interface AssetContextType {
  assets: AssetPoset;
}

export const AssetContext = React.createContext<AssetContextType>({} as AssetContextType);
