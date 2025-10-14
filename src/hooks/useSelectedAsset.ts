import { useContext } from "react";

import { AssetContext } from "../contexts/AssetContext";

import { useSelectionSlug } from "./useSelectionSlug";

export function useSelectedAsset() {
  const { assetSlug } = useSelectionSlug();
  const { assets } = useContext(AssetContext);

  return assetSlug ? assets.slugGet(assetSlug) : undefined;
}
