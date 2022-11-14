import React, { useContext, useState } from "react";

import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import LocationInfo from "../../types/LocationInfo";
import AddLocationDialog from "../molecules/AddLocationDialog";
import ConfirmDialog from "../molecules/ConfirmDialog";
import ListActionToolbar from "../molecules/ListActionToolbar";

export default function LocationsActionToolbar() {
  const { controller } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
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
      uiController.selectLocaion(null);
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
        onCancel={handleCloseRemoveDialog}
        onConfirm={handleRemove}
        title="Confirm Remove Location"
        message={`Remove location '${uiState.selectedLocation}'?`}
        buttonText="Remove"
      />
    </ListActionToolbar>
  );
}
