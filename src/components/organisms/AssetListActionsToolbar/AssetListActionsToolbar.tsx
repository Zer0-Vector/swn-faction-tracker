import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../../contexts/GameContext";
import { useSelectedAsset } from "../../../hooks/useSelectedAsset";
import { useSelectionId } from "../../../hooks/useSelectionId";
import MessageDialog from "../../atoms/MessageDialog";
import { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";
import AddAssetDialog from "../../molecules/AddAssetDialog";
import ListActionToolbar from "../../molecules/ListActionToolbar";

export default function AssetListActionsToolbar() {
  const { controller } = useContext(GameContext);

  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const asset = useSelectedAsset();
  const { assetId, factionId } = useSelectionId();

  const nav = useNavigate();

  const handleAdd = useCallback((assetName: string) => {
    if (factionId) {
      controller.addAsset(factionId, assetName);
    } else {
      console.warn("No faction selected.");
    }
  }, [controller, factionId]);

  const handleAddClick = useCallback(() => setAddOpen(true), []);
  const handleRemoveClick = useCallback(() => setRemoveOpen(true), []);
  const handleAddDialogClose = useCallback(() => setAddOpen(false), []);
  
  const handleRemoveAction = useCallback<DialogActionHandler>((_, reason) => {
    setRemoveOpen(false);
    if (reason === "Remove") {
      if (factionId && assetId) {
        console.debug(`RemoveAsset: faction=${factionId}, asset=${assetId}`);
        controller.removeAsset(factionId, assetId);
        nav(`/factions/${factionId}`);
      } else {
        console.error(`Illegal selection state. factionId=${factionId}, assetId=${assetId}`);
      }
    }
  }, [assetId, controller, factionId, nav]);

  return (
    <ListActionToolbar
      removable={!!assetId}
      onAddClick={handleAddClick}
      onRemoveClick={handleRemoveClick}
      data-testid="asset-lat"
    >
      <AddAssetDialog
        open={addOpen}
        onClose={handleAddDialogClose}
        onAdd={handleAdd}
      />
      <MessageDialog
        title="Confirm Remove Asset"
        message={`Remove asset ${asset?.id.displayName}`}
        buttons={["Cancel", "Remove"]}
        open={removeOpen}
        onAction={handleRemoveAction}
        data-testid="remove-asset-dialog"
      />
    </ListActionToolbar>
  );
}
