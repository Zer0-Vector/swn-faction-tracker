import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../../contexts/GameContext";
import { useSelection } from "../../../hooks/useSelection";
import AddFactionDialog from "../../molecules/AddFactionDialog";
import ConfirmDialog from "../../molecules/ConfirmDialog";
import ListActionToolbar from "../../molecules/ListActionToolbar";

export default function FactionListActionToolbar() {
  const { controller } = useContext(GameContext);

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [removeOpen, setRemoveOpen] = useState<boolean>(false);

  const { faction: selectedFaction } = useSelection();
  const nav = useNavigate();

  const handleRemove = useCallback(() => {
    if (selectedFaction) {
      controller.removeFaction(selectedFaction.id);
      nav("/factions");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, selectedFaction]);

  const handleAddClick = useCallback(() => setAddOpen(true), []);
  const handleRemoveClick = useCallback(() => setRemoveOpen(true), []);
  const handleAddDialogClose = useCallback(() => setAddOpen(false), []);
  const handleAddDialogCreate = useCallback((v: string): void => {controller.addFaction(v);}, [controller]);
  const handleConfirmCancel = useCallback(() => setRemoveOpen(false), []);

  console.debug("Rendering FactionListActionToolbar...");

  return (
    <ListActionToolbar
      removable={!!selectedFaction}
      onAddClick={handleAddClick}
      onRemoveClick={handleRemoveClick}
    >
      <AddFactionDialog 
        open={addOpen}
        onClose={handleAddDialogClose}
        onCreate={handleAddDialogCreate}
      />
      <ConfirmDialog
        id="delete-faction"
        title="Confirm Delete Faction"
        message={`Delete faction "${selectedFaction?.name}"`}
        buttonText="Remove"
        open={removeOpen}
        onCancel={handleConfirmCancel}
        onConfirm={handleRemove}
      />
    </ListActionToolbar>
  );
}
