import { JSX } from "react";

import { Maybe } from "./Maybe";

export const TurnPhaseNames = [
  "Select Faction",
  "Set Goal",
  "Select Action",
] as const;

export type TurnPhaseName = (typeof TurnPhaseNames)[number];

export function isTurnStepName(s: string): s is TurnPhaseName {
  return TurnPhaseNames.includes(s as TurnPhaseName);
}

export type TurnPhaseNameValue = TurnPhaseName | "";

export interface TurnPhase {
  readonly name: TurnPhaseNameValue;
  readonly icon?: JSX.Element;
  readonly title?: string;
  readonly onClick: Maybe<() => void>;
  readonly onExit?: () => void;
}
