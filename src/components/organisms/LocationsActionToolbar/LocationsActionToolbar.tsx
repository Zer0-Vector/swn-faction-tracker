import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameContext } from "../../../contexts/GameContext";
import { useSelectedLocation } from "../../../hooks/useSelectedLocation";
import LocationInfo from "../../../types/LocationInfo";
import MessageDialog from "../../atoms/MessageDialog";
import { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";
import AddLocationDialog from "../../molecules/AddLocationDialog";
import ListActionToolbar from "../../molecules/ListActionToolbar";

export default function LocationsActionToolbar() {
  const { controller } = useContext(GameContext);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
  const selectedLocation = useSelectedLocation();
  const nav = useNavigate();

  const handleOpenAddDialog: React.MouseEventHandler<HTMLButtonElement> = useCallback((evt) => {
    evt.stopPropagation();
    setAddDialogOpen(true);
  }, []);

  const handleCloseAdd = useCallback(() => setAddDialogOpen(false), []);

  const handleCreate = useCallback((info: LocationInfo) => {
    controller.addLocation(info);
    handleCloseAdd();
  }, [controller, handleCloseAdd]);

  const handleOpenRemoveDialog: React.MouseEventHandler<HTMLButtonElement> = useCallback((evt) => {
    evt.stopPropagation();
    setRemoveDialogOpen(true);
  }, []);

  const handleRemoveAction = useCallback<DialogActionHandler>((_, reason) => {
    setRemoveDialogOpen(false);
    if (selectedLocation && reason === "Remove") {
      controller.removeLocation(selectedLocation.slug);
      nav("/locations");
    }
  }, [controller, nav, selectedLocation]);

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
      <MessageDialog
        data-testid="remove-location-confirmation"
        open={removeDialogOpen}
        onAction={handleRemoveAction}
        title="Confirm Remove Location"
        message={`Remove location '${selectedLocation?.name}'?`}
        buttons={["Cancel", "Remove"]}
      />
    </ListActionToolbar>
  );
}
