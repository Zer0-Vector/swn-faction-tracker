import React, { useContext, useState } from "react";
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

  const handleRemove = () => {
    if (selectedFaction) {
      controller.removeFaction(selectedFaction.id);
      nav("/factions");
    }
  };

  return (
    <ListActionToolbar
      removable={!!selectedFaction}
      onAddClick={() => setAddOpen(true)}
      onRemoveClick={() => setRemoveOpen(true)}
    >
      <AddFactionDialog 
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={v => controller.addFaction(v)}
      />
      <ConfirmDialog
        id="delete-faction"
        title="Confirm Delete Faction"
        message={`Delete faction "${selectedFaction?.name}"`}
        buttonText="Remove"
        open={removeOpen}
        onCancel={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
      />
    </ListActionToolbar>
  );
}
