import AssetType from "./AssetType";

export type AssetRestrictionType =
  | "ATTACKER";

interface IAssetRestriction<T> {
  type: AssetRestrictionType
  details: T
}

type AttackerRestrictionDetails = {
  only: AssetType
};

interface AttackerRestriction extends IAssetRestriction<AttackerRestrictionDetails> {
  type: "ATTACKER"
}

export type AssetRestrcition =
  | AttackerRestriction;

