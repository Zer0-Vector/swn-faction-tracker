import React, { useCallback, useMemo } from "react";

import EllipsisIcon from "@mui/icons-material/MoreHoriz";

import { FactionAction } from "../../types/FactionAction";
import type { ReadonlyPropsWithChildren } from "../../types/ReadonlyPropsWithChildren";
import { TurnPhase } from "../../types/TurnPhase";

import { useSelectFactionPhase, useSetGoalPhase } from "./phases";

export interface TurnPhaseContextType {
  phases: TurnPhase[];
  onSelectAction(action: FactionAction): void;
}

export const TurnPhaseContext = React.createContext<TurnPhaseContextType>({} as TurnPhaseContextType);

export function TurnPhaseContextProvider({ children }: ReadonlyPropsWithChildren) {
  const selectFactionPhase = useSelectFactionPhase();
  const setGoalPhase = useSetGoalPhase();
  const phases = useMemo<TurnPhase[]>(() => [
    selectFactionPhase,
    setGoalPhase,
    {
      name: "Select Action",
      onClick: () => {
        // TODO
      },
    },
    {
      name: "",
      icon: React.createElement(EllipsisIcon),
      title: "Select an action to reveal the remaining steps",
      onClick: undefined,
    },
  ], [selectFactionPhase, setGoalPhase]);

  const onSelectAction = useCallback(() => {
    // TODO
  }, []);

  const turnPhaseContext = useMemo<TurnPhaseContextType>(() => ({ phases, onSelectAction }), [onSelectAction, phases]);

  return (
    <TurnPhaseContext.Provider value={turnPhaseContext}>
      {children}
    </TurnPhaseContext.Provider>
  );
}
