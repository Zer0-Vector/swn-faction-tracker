import React, { useContext, useState } from "react";

import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import ListActionToolbar from "../ListActionToolbar";
import AddAssetDialog from "../molecules/AddAssetDialog";
import ConfirmDialog from "../molecules/ConfirmDialog";

export default function AssetListActionsToolbar() {
  const { controller } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const handleAdd = (assetName: string) => {
    if (uiState.selectedFaction) {
      controller.addAsset(uiState.selectedFaction, assetName);
    }
  };

  const handleRemove = () => {
    if (uiState.selectedAssetKey && uiState.selectedFaction) {
      const keyParts = uiState.selectedAssetKey.split(".");
      try {
        const id = parseInt(keyParts[2]);
        console.debug(`handleRemove(${keyParts})`);
        controller.removeAsset(uiState.selectedFaction, keyParts[1], id);
        uiController.selectAsset(null);
      } catch (e) {
        console.error("Could not parse assetId: ", keyParts);
      }
    }
  };

  return (
    <ListActionToolbar
      removable={!!uiState.selectedAssetKey}
      onAddClick={() => setAddOpen(true)}
      onRemoveClick={() => setRemoveOpen(true)}
    >
      <AddAssetDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
      <ConfirmDialog
        title="Confirm Remove Asset"
        message={`Remove asset ${uiState.selectedAssetKey?.split(".")[1]}?`}
        buttonText="Remove"
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
      />
    </ListActionToolbar>
  );
}
