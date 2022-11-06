import React, { useContext, useState } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddFactionDialog from "../AddFactionDialog";
import { GameContext } from "../../contexts/GameContext";
import Box from "@mui/material/Box";
import { UiStateContext } from "../../contexts/UiStateContext";
import RemoveFactionDialog from "../RemoveFactionDialog";

export default function FactionActionToolbar() {
  const { controller } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const showAddFactionDialog = () => {
    setAddDialogOpen(true);
  };

  const hideAddFactionDialog = () => {
    setAddDialogOpen(false);
  };

  const handleCreateFaction = (val: string) => {
    console.log(`Create faction from dialog: '${val}'`);
    controller.addFaction(val);
  };

  const confirmRemoveFaction = () => {
    setRemoveDialogOpen(true);
  };

  const handleRemoveFaction = () => {
    if (uiState.selectedFaction) {
      controller.removeFaction(uiState.selectedFaction);
      uiController.selectFaction(null);
    }
  };

  return (
    <Box sx={{ paddingBottom: "1rem", display: "flex", flexDirection: "row", gap: "1rem" }}>
      <Fab
        size="medium"
        color="primary"
        onClick={showAddFactionDialog}
      >
        <AddIcon />
        <AddFactionDialog
          open={addDialogOpen}
          onClose={hideAddFactionDialog}
          onCreate={handleCreateFaction}
        />
      </Fab>
      <Fab
        size="medium"
        color="primary"
        disabled={uiState.selectedFaction === null}
        onClick={confirmRemoveFaction}
      >
        <RemoveIcon />
        <RemoveFactionDialog
          factionName={uiState.selectedFaction}
          open={removeDialogOpen}
          onClose={() => setRemoveDialogOpen(false)}
          onConfirm={handleRemoveFaction}
        />
      </Fab>
    </Box>
  );
}