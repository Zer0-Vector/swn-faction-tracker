import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../contexts/GameContext";
import { useSelection } from "../../hooks/useSelection";
import { useSelectionId } from "../../hooks/useSelectionId";
import AddAssetDialog from "../molecules/AddAssetDialog";
import ConfirmDialog from "../molecules/ConfirmDialog";
import ListActionToolbar from "../molecules/ListActionToolbar";

export default function AssetListActionsToolbar() {
  const { controller } = useContext(GameContext);

  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const { asset } = useSelection();
  const { assetId, factionId } = useSelectionId();

  const nav = useNavigate();

  const handleAdd = (assetName: string) => {
    if (factionId) {
      controller.addAsset(factionId, assetName);
    } else {
      console.warn("No faction selected.");
    }
  };

  const handleRemove = () => {
    if (factionId && assetId) {
      console.debug(`handleRemove(${factionId}, ${assetId})`);
      controller.removeAsset(factionId, assetId);
      setRemoveOpen(false);
      nav(`/factions/${factionId}`);
    } else {
      console.warn(`Illegal selection state. factionId=${factionId}, assetId=${assetId}`);
    }
  };

  return (
    <ListActionToolbar
      removable={!!assetId}
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
