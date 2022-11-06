import { AssetActionInfo } from "./AssetActions";
import { AssetRestrcition } from "./AssetRestrictions";
import AssetType from "./AssetType";
import { AssetAttribute, FactionAttribute } from "./FactionAttribute";

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
  maxHp: number | null;
  cost: number | null;
  tl: number;
  type: AssetType;
  attack: AssetAttackInfo | null;
  counter: DiceDefinition | null;
  note: AssetNote[];
  upkeep: number;
  action: AssetActionInfo | null;
  restriction: AssetRestrcition | null;
}
