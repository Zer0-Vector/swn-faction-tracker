import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../../contexts/GameContext";
import { useSelection } from "../../../hooks/useSelection";
import LocationInfo from "../../../types/LocationInfo";
import AddLocationDialog from "../../molecules/AddLocationDialog";
import ConfirmDialog from "../../molecules/ConfirmDialog";
import ListActionToolbar from "../../molecules/ListActionToolbar";

export default function LocationsActionToolbar() {
  const { controller } = useContext(GameContext);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
  const { location: selectedLocation } = useSelection();
  const nav = useNavigate();

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
    if (selectedLocation) {
      controller.removeLocation(selectedLocation.id);
      nav("/locations");
    }
    handleCloseRemoveDialog();
  };

  return (
    <ListActionToolbar
      removable={!!selectedLocation}
      onAddClick={handleOpenAddDialog}
      onRemoveClick={handleOpenRemoveDialog}
      data-testid="locations-action-toolbar"
    >
      <AddLocationDialog
        open={addDialogOpen}
        onClose={handleCloseAdd}
        onCreate={handleCreate}
      />
      <ConfirmDialog
        id="remove-location"
        open={removeDialogOpen}
        onCancel={handleCloseRemoveDialog}
        onConfirm={handleRemove}
        title="Confirm Remove Location"
        message={`Remove location '${selectedLocation?.name}'?`}
        buttonText="Remove"
      />
    </ListActionToolbar>
  );
}
