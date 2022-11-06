import AssetType from "./AssetType";
import { FactionAttribute } from "./FactionAttribute";
/* Basis */
interface IAssetActionInfo<T> {
  type: string;
  cost: number;
  details: T;
}

/* Move Action */
interface MoveActionDetails {
  distance: number;
  types: AssetType[];
  quantity: number;
  includeSelf: boolean;
}

interface MoveActionInfo extends IAssetActionInfo<MoveActionDetails> {
  type: "MOVE";
}

/* Sacrifice Action */
interface SacrificeActionInfo extends IAssetActionInfo<null> {
  type: "SACRIFICE";
  details: null;
}

/* Instant Action */
export type InstantTrigger = 
  | "PERMISSION_GRANTED"
  | "ATTACK"
  | "DEFEND";

export type InstantEffect = 
  | "PERMISSION_DENIED"
  | "PREVENT_TAG_DICE";

interface InstantActionDetails {
  trigger: InstantTrigger[];
  test: {
          offense: FactionAttribute;
          defense: FactionAttribute;
        } | null;
  effect: InstantEffect[];
}

interface InstantActionInfo extends IAssetActionInfo<InstantActionDetails> {
  type: "INSTANT";
}

/* Sabotage Action */
interface SabotageActionInfo extends IAssetActionInfo<null> {
  type: "SABOTAGE";
}

/* Final Form */
export type AssetActionInfo =
  | MoveActionInfo
  | SacrificeActionInfo
  | SabotageActionInfo
  | InstantActionInfo;

export const f: AssetActionInfo = {
  type: "INSTANT",
  cost: 0,
  details: {
    effect: [],
    test: null,
    trigger: []
  }
};
