import React, { useCallback, useContext, useMemo } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import { styled } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { GameContext } from "../../../contexts/GameContext";
import { useSelectionId } from "../../../hooks/useSelectionId";
import { ControlledText } from "../../molecules/ControlledText";

const Item = React.memo(styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  px: theme.spacing(1),
})));

const ItemHeader = React.memo(styled(Item)(() => ({
  fontWeight: "bold",
  textAlign: "right",
  whiteSpace: "nowrap",
  overflow: "clip",
  textOverflow: "ellipsis",
})));

const Column = React.memo(styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})));


export default function LocationsList() {
  const { state, controller } = useContext(GameContext);
  const { locationId: selectedLocationId } = useSelectionId();
  const nav = useNavigate();
  const hasSmallWidth = useMediaQuery("(max-width:600px)");

  const locations = state.getLocations();

  const updateNameHandlers = useMemo(() => locations.map(loc => (
    (val: string) => {
      const info = controller.updateLocationName(loc.slug, val);
      if (info !== undefined && selectedLocationId === loc.slug) {
        nav(`/locations/${info.slug}`);
      }
    }
  )), [controller, locations, nav, selectedLocationId]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (result.reason === 'DROP') {
      controller.reorderLocations(result.source, result.destination);
    }
  }, [controller]);

  const selectionHandlers = useMemo(() => (
    locations.map(val => () => {
      if (val.slug === selectedLocationId) {
        nav("/locations");
      } else {
        nav(`/locations/${val.slug}`);
      }
    })
  ), [locations, nav, selectedLocationId]);

  if (locations.length === 0) {
    return (
      <>
        <Typography variant="body1" color="warning.main">No Locations</Typography>
        <Typography variant="body2">Create locations using the buttons above.</Typography>
      </>
    );
  }

  const cellWidth = hasSmallWidth ? 6 : 3;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-location">
        {(provided, snapshot) => (
          <Box 
            {...provided.droppableProps}
            ref={provided.innerRef} 
            data-testid="locations-list-container"
            padding={2}
            bgcolor={snapshot.isDraggingOver ? "background.paper2" : "background.paper"}
          >
            {locations.map((val, index) => {
              const isSelected = selectedLocationId === val.slug;
              const notDraggingColor = isSelected ? "action.selected" : "inherit";
              return (
                <Draggable key={val.name} index={index} draggableId={`draggable-location-${val.name.replaceAll(/\W/g, "-")}`}>
                  {(provided, snapshot) => (
                    <Accordion
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      expanded={isSelected}
                      disableGutters={true}
                    >
                      <AccordionSummary
                        onClick={selectionHandlers[index]}
                        sx={{
                          backgroundColor: snapshot.isDragging ? "action.dragging" : notDraggingColor,
                          justifyContent: "flex-start",
                          gap: 1,
                          display: "grid",
                          gridTemplateColumns: "30px 1fr",
                          "& .MuiAccordionSummary-content": {
                            padding: 0,
                            margin: 0,
                            alignItems: "center",
                            width: "100%",
                          },
                          "&:hover": {
                            cursor: "pointer",
                            backgroundColor: isSelected ? "action.selected-hover" : "action.hover",
                          },
                        }}
                      >
                        <Column>
                          <Icon
                            {...provided.dragHandleProps}
                            component="div"
                            sx={{
                              display: "flex",
                            }}
                          >
                            <DragHandleIcon />
                          </Icon>
                        </Column>
                        <Column>
                          <ControlledText id="location-name" onUpdate={updateNameHandlers[index]} variant="body2">{val.name}</ControlledText>
                        </Column>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={1}>
                          <Grid item xs={cellWidth}><ItemHeader>Tech Level</ItemHeader></Grid>
                          <Grid item xs={cellWidth}><Item>{val.tl}</Item></Grid>
                          <Grid item xs={cellWidth}><ItemHeader>Coordinates</ItemHeader></Grid>
                          <Grid item xs={cellWidth}><Item>{val.x}, {val.y}</Item></Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
