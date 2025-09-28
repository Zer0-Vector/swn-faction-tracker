import { useContext, useMemo } from "react";

import { useSelectionDialog } from "../../../hooks/useSelectionDialog";
import GoalType, { GoalTypes } from "../../../types/GoalType";
import { TurnPhase, TurnPhaseNameValue } from "../../../types/TurnPhase";
import { useFactions } from "../../FactionContext";
import { UiStateContext } from "../../UiStateContext";

export function useSetGoalPhase() {
  const { state, controller } = useContext(UiStateContext);
  const showGoalSelectionDialog = useSelectionDialog<GoalType>();
  const factions = useFactions();
  return useMemo(() => new class implements TurnPhase {

    readonly name: TurnPhaseNameValue = "Set Goal";

    readonly onClick = () => {
      controller.setTurnState("SELECTING_GOAL");
      showGoalSelectionDialog({
        title: `Set Goal for ${state.turnInfo?.faction.name}`,
        message: "Choose a goal",
        options: [...GoalTypes],
        getOptionLabel: o => o,
        buttons: ["Cancel", "Set"],
      }).then(result => {
        if (result.reason === "Set" && !!result.data) {
          const factionId = state.turnInfo?.faction.id;
          if (factionId === undefined) {
            console.error("No faction selected to set goal.");
            return;
          }
          factions.update(factionId, "goal", { type: result.data });
          controller.setTurnState("GOAL_SELECTED");
        } else {
          controller.setTurnState("FACTION_SELECTED");
        }
      });
    };

  }(), [controller, factions, showGoalSelectionDialog, state.turnInfo?.faction.id, state.turnInfo?.faction.name]);
}
