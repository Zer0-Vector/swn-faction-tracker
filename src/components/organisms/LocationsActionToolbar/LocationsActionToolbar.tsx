import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLocations } from "../../../contexts/LocationContext";
import { useSelectedLocation } from "../../../hooks/useSelectedLocation";
import MessageDialog from "../../atoms/MessageDialog";
import { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";
import AddLocationDialog from "../../molecules/AddLocationDialog";
import ListActionToolbar from "../../molecules/ListActionToolbar";

export default function LocationsActionToolbar() {
  const locations = useLocations();
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
  const selectedLocation = useSelectedLocation();
  const nav = useNavigate();

  const handleOpenAddDialog: React.MouseEventHandler<HTMLButtonElement> = useCallback((evt) => {
    evt.stopPropagation();
    setAddDialogOpen(true);
  }, []);

  const handleCloseAdd = useCallback(() => setAddDialogOpen(false), []);

  const handleCreate = useCallback((info: {name: string, tl: number, x: number, y: number}) => {
    locations.add(info);
    handleCloseAdd();
  }, [handleCloseAdd, locations]);

  const handleOpenRemoveDialog: React.MouseEventHandler<HTMLButtonElement> = useCallback((evt) => {
    evt.stopPropagation();
    setRemoveDialogOpen(true);
  }, []);

  const handleRemoveAction = useCallback<DialogActionHandler>((result) => {
    setRemoveDialogOpen(false);
    if (selectedLocation && result.reason === "Remove") {
      locations.remove(selectedLocation.id);
      nav("/locations");
    }
  }, [locations, nav, selectedLocation]);

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
