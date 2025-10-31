import AssetType from "./AssetType";
import { DiceDefinition } from "./dice";
import { FactionAttribute } from "./FactionAttribute";
import Nullable from "./Nullable";
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

interface AttackSideEffectDetails {
  defenderCharged: number;
}

interface HarvestActionDetails {
  roll: DiceDefinition;
  threshold: number;
}

interface PurchaseTaxActionDetails {
  tax: number;
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
export type InstantTrigger = "PERMISSION_GRANTED" | "ATTACK" | "DEFEND";

export type InstantEffect = "PERMISSION_DENIED" | "PREVENT_TAG_DICE";

interface InstantTest {
  offense: FactionAttribute;
  defense: FactionAttribute;
}

interface InstantActionDetails {
  trigger: InstantTrigger[];
  test: Nullable<InstantTest>;
  effect: InstantEffect[];
}

interface InstantActionInfo extends IAssetActionInfo<InstantActionDetails> {
  type: "INSTANT";
}

/* Sabotage Action */
interface SabotageActionInfo extends IAssetActionInfo<null> {
  type: "SABOTAGE";
}

interface AttackSideEffectInfo
  extends IAssetActionInfo<AttackSideEffectDetails> {
  type: "ATTACK_SIDE_EFFECT";
}

interface HarvestActionInfo extends IAssetActionInfo<HarvestActionDetails> {
  type: "HARVEST";
}

interface PurchaseTaxActionInfo
  extends IAssetActionInfo<PurchaseTaxActionDetails> {
  type: "PURCHASE_TAX";
}

/**************/
/* Final Form */
/**************/
export type AssetActionInfo =
  | MoveActionInfo
  | SacrificeActionInfo
  | SabotageActionInfo
  | InstantActionInfo
  | AttackSideEffectInfo
  | HarvestActionInfo
  | PurchaseTaxActionInfo;

export const f: AssetActionInfo = {
  type: "INSTANT",
  cost: 0,
  details: {
    effect: [],
    test: null,
    trigger: [],
  },
};
