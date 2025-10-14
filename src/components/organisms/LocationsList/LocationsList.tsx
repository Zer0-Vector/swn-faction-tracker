import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useLocations } from "../../../contexts/LocationContext";
import { useSelectionSlug } from "../../../hooks/useSelectionSlug";
import { LocationsListItem } from "../LocationsListItem";

function useLocationsList() {
  const locations = useLocations();
  const [list, setList] = useState(locations.getAll());
  useEffect(
    () => locations.subscribe(() => setList(locations.getAll())),
    [locations]
  );

  return {
    locations: list,
    reorder: locations.reorder.bind(locations),
  };
}

export default function LocationsList() {
  const { locations, reorder } = useLocationsList();
  const { locationSlug: selectedLocationId } = useSelectionSlug();

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (result.reason === "DROP") {
        if (result.destination) {
          reorder(result.source.index, result.destination?.index);
        }
      }
    },
    [reorder]
  );

  if (locations.length === 0) {
    return (
      <>
        <Typography variant="body1" color="warning.main">
          No Locations
        </Typography>
        <Typography variant="body2">
          Create locations using the buttons above.
        </Typography>
      </>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-location">
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            data-testid="locations-list-container"
            padding={2}
            bgcolor={
              snapshot.isDraggingOver ? "background.paper2" : "background.paper"
            }
          >
            {locations.map((val, index) => (
              <LocationsListItem
                key={val.slug}
                index={index}
                draggableId={`draggable-${val.slug}`}
                isSelected={selectedLocationId === val.slug}
                locationInfo={val}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
