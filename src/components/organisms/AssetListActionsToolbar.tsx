import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { useFactionSelection } from "../../hooks/useFactionSelection";
import AssetId from "../../types/AssetId";
import AddAssetDialog from "../molecules/AddAssetDialog";
import ConfirmDialog from "../molecules/ConfirmDialog";
import ListActionToolbar from "../molecules/ListActionToolbar";

export default function AssetListActionsToolbar() {
  const { controller } = useContext(GameContext);
  const { state: uiState } = useContext(UiStateContext);

  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const { asset, faction } = useFactionSelection();

  const nav = useNavigate();

  const handleAdd = (assetName: string) => {
    if (faction) {
      controller.addAsset(faction.id, assetName);
    } else {
      console.warn("No faction selected.");
    }
  };

  const handleRemove = () => {
    if (faction && asset) {
      const assetRef = AssetId.toRefFormat(asset.id);
      console.debug(`handleRemove(${faction.id}, ${assetRef})`);
      controller.removeAsset(faction.id, assetRef);
      setRemoveOpen(false);
      nav("..");
    } else {
      console.warn(`Illegal selection state. faction=${faction}, asset=${asset}`);
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
        message={`Remove asset ${asset?.id.displayName}`}
        buttonText="Remove"
        open={removeOpen}
        onCancel={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
      />
    </ListActionToolbar>
  );
}
