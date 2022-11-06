import React, { useContext, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import AddAssetDialog from "../AddAssetDialog";
import ListActionToolbar from "../ListActionToolbar";

export default function AssetListActionsToolbar() {
  const { controller } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  return (
    <ListActionToolbar
      removable={!!uiState.selectedAsset}
      onAddClick={() => setAddOpen(true)}
      onRemoveClick={() => setRemoveOpen(true)}
    >
      <AddAssetDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(key: string) => uiState.selectedFaction && controller.addAsset(uiState.selectedFaction, key)}
      />
    </ListActionToolbar>
  );
}
