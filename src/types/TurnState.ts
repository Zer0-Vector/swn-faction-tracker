export const TurnStates = [
  "OFF",
  "IDLE", // wating for faction to be selected
  "SELECTING_FACTION",
  "FACTION_SELECTED",
  "SELECTING_GOAL",
  "GOAL_SELECTED",
  "SELECTING_ACTION",
  "ACTION_SELECTED",
  "COMPLETE",
] as const;

export type TurnState = (typeof TurnStates)[number];

export function isTurnState(s: string): s is TurnState {
  return TurnStates.includes(s as TurnState);
}
