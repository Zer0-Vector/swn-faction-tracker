import GoalType from "./GoalType";

type GoalUnit =
  | "Asset"
  | "Planet"
  | "Base"
  | "HP"
  | "Turn"
  | "Faction"
  | "FacCred";

export default interface GoalInfo {
  type: GoalType;
  tally?: number;
  target?: number;
  unit?: GoalUnit;
  reward?: number;
}
