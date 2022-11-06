import React, { useContext } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import EditableNameText from "../atoms/EditableNameText";

export default function LocationsList() {
  const { state, controller } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const locations = state.getLocations();

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
  }));

  const ItemHeader = styled(Item)(({ theme }) => ({
    fontWeight: "bold",
    textAlign: "right",
  }));

  const handleUpdateName = (curr: string) => (val: string) => {
    controller.updateLocationName(curr, val);
  };

  const handleDragEnd = (result: DropResult) => {
    if (result.reason === 'DROP') {
      controller.reorderLocations(result.source, result.destination);
    }
  };

  const handleSelect = (locationName: string) => {
    if (locationName === uiState.selectedLocation) {
      uiController.selectLocaion(null);
    } else {
      uiController.selectLocaion(locationName);
    }
  };

  if (locations.length === 0) {
    return (
      <>
        <Typography variant="body1" color="warning.main">No Locations</Typography>
        <Typography variant="body2">Create locations using the buttons above.</Typography>
      </>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-location">
        {(provided, snapshot) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {locations.map((val, index) => (
              <Draggable key={val.name} index={index} draggableId={`draggable-location-${val.name.replaceAll(/\W/g, "-")}`}>
                {(provided, snapshot) => (
                  <Accordion {...provided.draggableProps} ref={provided.innerRef} expanded={uiState.selectedLocation === val.name}>
                    <AccordionSummary
                      onClick={() => handleSelect(val.name)}
                      sx={theme => ({ backgroundColor: snapshot.isDragging ? theme.palette.action.dragging : (uiState.selectedLocation === val.name ? theme.palette.action.selected : "inherit")})}
                    >
                      <Box sx={theme => ({
                        display: "flex",
                        alignContent: "center",
                        gap: theme.spacing(2),
                      })}>
                        <Icon {...provided.dragHandleProps}><DragHandleIcon /></Icon>
                        <EditableNameText onUpdate={handleUpdateName(val.name)} variant="body2">{val.name}</EditableNameText>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={3}><ItemHeader>Tech Level</ItemHeader></Grid>
                        <Grid item xs={3}><Item>{val.tl}</Item></Grid>
                        <Grid item xs={3}><ItemHeader>Coordinates</ItemHeader></Grid>
                        <Grid item xs={3}><Item>{val.x}, {val.y}</Item></Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
