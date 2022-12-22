export const TurnActionList = [
  "Attack",
  "Buy Asset",
  "Change Homeworld",
  "Expand Influence",
  "Refit Asset",
  "Repair Asset",
  "Repair Faction", // TODO: check if this is actually needed
  "Sell Asset",
  "Seize Planet",
  "Use Asset Ability",
] as const;

export type TurnAction = typeof TurnActionList[number];

export function isTurnAction(s: string): s is TurnAction {
  return TurnActionList.includes(s as TurnAction);
}
