import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AssetContext } from "../../../contexts/AssetContext";
import { useSelectedAsset } from "../../../hooks/useSelectedAsset";
import { useSelectedFaction } from "../../../hooks/useSelectedFaction";
import { useSelectionSlug } from "../../../hooks/useSelectionSlug";
import MessageDialog from "../../atoms/MessageDialog";
import { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";
import AddAssetDialog from "../../molecules/AddAssetDialog";
import ListActionToolbar from "../../molecules/ListActionToolbar";

export default function AssetListActionsToolbar() {
  const { assets } = useContext(AssetContext);

  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const asset = useSelectedAsset();
  const { assetSlug, factionSlug } = useSelectionSlug();

  const nav = useNavigate();
  const faction = useSelectedFaction();

  const handleAdd = useCallback((assetName: string) => {
    if (faction !== undefined) {
      assets.add({ name: assetName, factionId: faction.id });
    } else {
      console.error("Could not add asset. No faction selected.");
    }
  }, [assets, faction]);

  const handleAddClick = useCallback(() => setAddOpen(true), []);
  const handleRemoveClick = useCallback(() => setRemoveOpen(true), []);
  const handleAddDialogClose = useCallback(() => setAddOpen(false), []);
  
  const handleRemoveAction = useCallback<DialogActionHandler>((_, reason) => {
    setRemoveOpen(false);
    if (reason === "Remove") {
      if (factionSlug && assetSlug) {
        console.debug(`RemoveAsset: faction=${factionSlug}, asset=${assetSlug}`);
        const assetId = assets.getId(assetSlug);
        if (assetId !== undefined) {
          assets.remove(assetId);
          nav(`/factions/${factionSlug}`);
        } else {
          console.error("Could not remove asset. Unknown slug.", assetSlug);
        }
      } else {
        console.error(`Illegal selection state. factionId=${factionSlug}, assetId=${assetSlug}`);
      }
    }
  }, [assetSlug, assets, factionSlug, nav]);

  return (
    <ListActionToolbar
      removable={!!assetSlug}
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
        message={`Remove asset ${asset?.name}`}
        buttons={["Cancel", "Remove"]}
        open={removeOpen}
        onAction={handleRemoveAction}
        data-testid="remove-asset-dialog"
      />
    </ListActionToolbar>
  );
}
