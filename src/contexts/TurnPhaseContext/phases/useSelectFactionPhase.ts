import { useContext, useMemo } from "react";

import { useSelectionDialog } from "../../../hooks/useSelectionDialog";
import { TurnPhase } from "../../../types/TurnPhase";
import FactionInfo from "../../../utils/FactionInfo";
import { useFactions } from "../../FactionContext";
import { UiStateContext } from "../../UiStateContext";

export function useSelectFactionPhase() {
  const { state, controller } = useContext(UiStateContext);
  const showFactionSelectionDialog = useSelectionDialog<FactionInfo>();
  const factions = useFactions();

  const incrementor = (prev: number) => prev + 1;
  const propertyAppender = <V, T>(prop: string, value: V) => (obj: T) => ({
    ...obj,
    [prop]: value,
  });
  return useMemo(() => new class implements TurnPhase {

    readonly name = "Select Faction";
    readonly onExit = () => {
      if (state.turnState === "FACTION_SELECTED") {
        if (state.turnInfo?.faction.goal?.type !== undefined) {
          controller.setTurnState("GOAL_SELECTED");
          controller.setTurnIndex(incrementor);
        }
      }
    };
    readonly onClick = () => {
      controller.setTurnState("SELECTING_FACTION");
      showFactionSelectionDialog({
        title: "Select Faction",
        message: "Choose faction to take turn",
        options: factions.getAll(),
        getOptionLabel: (f: FactionInfo) => f.name,
        buttons: ["Cancel", "Select"],
      }).then(result => {
        if (result.reason === "Select" && !!result.data) {
          controller.setTurnInfo(propertyAppender("faction", result.data));
          controller.setTurnIndex(incrementor);
          controller.setTurnState("FACTION_SELECTED");
        } else {
          controller.setTurnState("IDLE");
        }
      });
    };

  }(), [controller, factions, showFactionSelectionDialog, state.turnInfo?.faction.goal?.type, state.turnState]);
}
