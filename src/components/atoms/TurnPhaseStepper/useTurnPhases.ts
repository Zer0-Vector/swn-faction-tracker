import { useContext } from "react";

import { TurnPhaseContext } from "../../../contexts/TurnPhaseContext";
import { UiStateContext } from "../../../contexts/UiStateContext";

export function useTurnPhases() {
  const { state } = useContext(UiStateContext);
  const { phases } = useContext(TurnPhaseContext);

  return {
    phases,
    index: state.turnIndex,
  };
}
