import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../../contexts/GameContext";
import { useSelection } from "../../../hooks/useSelection";
import { useSelectionId } from "../../../hooks/useSelectionId";
import AddAssetDialog from "../../molecules/AddAssetDialog";
import ConfirmDialog from "../../molecules/ConfirmDialog";
import ListActionToolbar from "../../molecules/ListActionToolbar";

export default function AssetListActionsToolbar() {
  const { controller } = useContext(GameContext);

  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const { asset } = useSelection();
  const { assetId, factionId } = useSelectionId();

  const nav = useNavigate();

  const handleAdd = useCallback((assetName: string) => {
    if (factionId) {
      controller.addAsset(factionId, assetName);
    } else {
      console.warn("No faction selected.");
    }
  }, [controller, factionId]);

  const handleRemove = useCallback(() => {
    if (factionId && assetId) {
      console.debug(`handleRemove(${factionId}, ${assetId})`);
      controller.removeAsset(factionId, assetId);
      setRemoveOpen(false);
      nav(`/factions/${factionId}`);
    } else {
      console.warn(`Illegal selection state. factionId=${factionId}, assetId=${assetId}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, controller, factionId]);

  const handleAddClick = useCallback(() => setAddOpen(true), []);
  const handleRemoveClick = useCallback(() => setRemoveOpen(true), []);
  const handleAddDialogClose = useCallback(() => setAddOpen(false), []);
  const handleConfirmCancel = useCallback(() => setRemoveOpen(false), []);
  
  return (
    <ListActionToolbar
      removable={!!assetId}
      onAddClick={handleAddClick}
      onRemoveClick={handleRemoveClick}
    >
      <AddAssetDialog
        open={addOpen}
        onClose={handleAddDialogClose}
        onAdd={handleAdd}
      />
      <ConfirmDialog
        id="remove-asset"
        title="Confirm Remove Asset"
        message={`Remove asset ${asset?.id.displayName}`}
        buttonText="Remove"
        open={removeOpen}
        onCancel={handleConfirmCancel}
        onConfirm={handleRemove}
      />
    </ListActionToolbar>
  );
}
