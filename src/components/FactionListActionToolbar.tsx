import React, { useContext, useState } from "react";
import { GameContext } from "../contexts/GameContext/GameContext";
import { UiStateContext } from "../contexts/UiStateContext/UiStateContext";
import AddFactionDialog from "./AddFactionDialog";
import ListActionToolbar from "./ListActionToolbar";
import ConfirmDialog from "./ConfirmDialog";

export default function FactionListActionToolbar() {
  const { controller } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [removeOpen, setRemoveOpen] = useState<boolean>(false);

  const handleRemove = () => {
    if (uiState.selectedFaction) {
      controller.removeFaction(uiState.selectedFaction);
      uiController.selectFaction(null);
    }
  };

  return (
    <ListActionToolbar
      removable={!!uiState.selectedFaction}
      onAddClick={() => setAddOpen(true)}
      onRemoveClick={() => setRemoveOpen(true)}
    >
      <AddFactionDialog 
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={v => controller.addFaction(v)}
      />
      <ConfirmDialog 
        title="Confirm Delete Faction"
        message={`Delete faction "${uiState.selectedFaction}"`}
        buttonText="Remove"
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
      />
    </ListActionToolbar>
  );
}
