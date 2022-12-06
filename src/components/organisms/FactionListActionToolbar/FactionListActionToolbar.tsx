import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../../contexts/GameContext";
import { useSelection } from "../../../hooks/useSelection";
import AddFactionDialog from "../../molecules/AddFactionDialog";
import ListActionToolbar from "../../molecules/ListActionToolbar";
import MessageDialog from "../../molecules/MessageDialog";
import { DialogActionHandler } from "../../molecules/MessageDialog/MessageDialog";

export default function FactionListActionToolbar() {
  const { controller } = useContext(GameContext);

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [removeOpen, setRemoveOpen] = useState<boolean>(false);

  const { faction: selectedFaction } = useSelection();
  const nav = useNavigate();

  const handleAddClick = useCallback(() => setAddOpen(true), []);
  const handleRemoveClick = useCallback(() => setRemoveOpen(true), []);
  const handleAddDialogClose = useCallback(() => setAddOpen(false), []);
  const handleAddDialogCreate = useCallback((v: string): void => {controller.addFaction(v);}, [controller]);

  const handleRemoveAction = useCallback<DialogActionHandler>((_, reason) => {
    setRemoveOpen(false);
    if (selectedFaction && reason === "Remove") {
      controller.removeFaction(selectedFaction.id);
      nav("/factions");
    }
  }, [controller, nav, selectedFaction]);

  console.debug("Rendering FactionListActionToolbar...");

  return (
    <ListActionToolbar
      removable={!!selectedFaction}
      onAddClick={handleAddClick}
      onRemoveClick={handleRemoveClick}
      data-testid="faction-list-action-toolbar"
    >
      <AddFactionDialog 
        open={addOpen}
        onClose={handleAddDialogClose}
        onCreate={handleAddDialogCreate}
      />
      <MessageDialog
        data-testid="delete-faction-confirmation"
        title="Confirm Delete Faction"
        message={`Delete faction "${selectedFaction?.name}"`}
        buttons={["Cancel", "Remove"]}
        open={removeOpen}
        onAction={handleRemoveAction}
      />
    </ListActionToolbar>
  );
}
