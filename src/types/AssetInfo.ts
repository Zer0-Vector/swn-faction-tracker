import { AssetActionInfo } from "./AssetActions";
import { AssetRestriction } from "./AssetRestrictions";
import AssetType from "./AssetType";
import type { DiceDefinition } from "./dice";
import { AssetAttribute, FactionAttribute } from "./FactionAttribute";
import Nullable from "./Nullable";

export type AssetAttackResult =
  | { type: "REVEAL_STEALTHED" }
  | { type: "DAMAGE"; damage: DiceDefinition };

export interface AssetAttackInfo {
  offense: FactionAttribute;
  defense: FactionAttribute;
  result: AssetAttackResult;
}

type AssetNote = "A" | "S" | "P";

export default interface AssetInfo {
  // name: string;
  description: string;
  attribute: AssetAttribute;
  level: number;
  maxHp: Nullable<number>;
  cost: Nullable<number>;
  tl: number;
  type: AssetType;
  attack: Nullable<AssetAttackInfo>;
  counter: Nullable<DiceDefinition>;
  note: AssetNote[];
  upkeep: number;
  action: Nullable<AssetActionInfo>;
  restriction: Nullable<AssetRestriction>;
}
