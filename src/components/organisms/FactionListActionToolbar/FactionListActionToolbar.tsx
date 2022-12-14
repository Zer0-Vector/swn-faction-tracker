import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../../contexts/GameContext";
import { useSelectedFaction } from "../../../hooks/useSelectedFaction";
import MessageDialog from "../../atoms/MessageDialog";
import { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";
import AddFactionDialog from "../../molecules/AddFactionDialog";
import ListActionToolbar from "../../molecules/ListActionToolbar";

export default function FactionListActionToolbar() {
  const { controller } = useContext(GameContext);

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [removeOpen, setRemoveOpen] = useState<boolean>(false);

  const selectedFaction = useSelectedFaction();
  const nav = useNavigate();

  const handleAddClick = useCallback(() => setAddOpen(true), []);
  const handleRemoveClick = useCallback(() => setRemoveOpen(true), []);
  const handleAddDialogClose = useCallback(() => setAddOpen(false), []);
  const handleAddDialogCreate = useCallback((v: string): void => {controller.addFaction(v);}, [controller]);

  const handleRemoveAction = useCallback<DialogActionHandler>((_, reason) => {
    setRemoveOpen(false);
    console.debug("handleRemoveAction: ", selectedFaction, reason);
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
