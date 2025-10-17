export const FactionActionList = [
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

export type FactionAction = (typeof FactionActionList)[number];

export function isFactionAction(s: string): s is FactionAction {
  return FactionActionList.includes(s as FactionAction);
}
