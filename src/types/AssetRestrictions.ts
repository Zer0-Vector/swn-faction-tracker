import AssetType from "./AssetType";

export type AssetRestrictionType =
  | "ATTACKER";

interface IAssetRestriction<T> {
  type: AssetRestrictionType;
  details: T;
}

interface AttackerRestrictionDetails {
  only: AssetType;
}

interface AttackerRestriction extends IAssetRestriction<AttackerRestrictionDetails> {
  type: "ATTACKER";
}

export type AssetRestriction =
  | AttackerRestriction;

