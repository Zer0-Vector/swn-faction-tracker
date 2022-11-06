import { AssetActionInfo } from "./AssetActions";
import { AssetRestrcition } from "./AssetRestrictions";
import AssetType from "./AssetType";
import { AssetAttribute, FactionAttribute } from "./FactionAttribute";
import Nullable from "./Nullable";

export type DiceDefinition = 
  | `${number}d${number}`
  | `${number}d${number}+${number}`
  | `${number}d${number}-${number}`;

export type AssetAttackResult = 
  | { type: "REVEAL_STEALTHED" }
  | { type: "DAMAGE", damage: DiceDefinition };

export interface AssetAttackInfo {
  offense: FactionAttribute;
  defense: FactionAttribute;
  result: AssetAttackResult;
}

type AssetNote = "A" | "S" | "P";

export default interface AssetInfo {
  // name: string;
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
  restriction: Nullable<AssetRestrcition>;
}
