import React, { useContext, useState } from "react";
import { GameContext } from "../contexts/GameContext";
import { UiStateContext } from "../contexts/UiStateContext";
import LocationInfo from "../types/LocationInfo";
import AddLocationDialog from "./AddLocationDialog";
import ConfirmDialog from "./ConfirmDialog";
import ListActionToolbar from "./ListActionToolbar";

export default function LocationsActionToolbar() {
  const { controller } = useContext(GameContext);
  const { state: uiState } = useContext(UiStateContext);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);

  const handleOpenAddDialog: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    setAddDialogOpen(true);
  };

  const handleCloseAdd = () => setAddDialogOpen(false);

  const handleCreate = (info: LocationInfo) => {
    controller.addLocation(info);
    handleCloseAdd();
  };

  const handleOpenRemoveDialog: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    setRemoveDialogOpen(true);
  };

  const handleCloseRemoveDialog = () => setRemoveDialogOpen(false);

  const handleRemove = () => {
    if (uiState.selectedLocation) {
      controller.removeLocation(uiState.selectedLocation);
    }
    handleCloseRemoveDialog();
  };

  return (
    <ListActionToolbar
      removable={!!uiState.selectedLocation}
      onAddClick={handleOpenAddDialog}
      onRemoveClick={handleOpenRemoveDialog}
    >
      <AddLocationDialog
        open={addDialogOpen}
        onClose={handleCloseAdd}
        onCreate={handleCreate}
      />
      <ConfirmDialog
        open={removeDialogOpen}
        onClose={handleCloseRemoveDialog}
        onConfirm={handleRemove}
        title="Confirm Remove Location"
        message={`Remove location '${uiState.selectedLocation}'?`}
        buttonText="Remove"
      />
    </ListActionToolbar>
  );
}
