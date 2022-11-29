import React, { useContext } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

import DragHandleIcon from "@mui/icons-material/DragHandle";
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
import EditableText from "../../atoms/EditableText";

const ItemComp = ({ children }: { children: React.ReactNode }) => (
  <Paper sx={theme => ({
    ...theme.typography.body1,
    px: 1,
  })}>
    {children}
  </Paper>
);

const ItemHeaderComp = ({ children }: { children: React.ReactNode }) => (
  <Paper sx={theme => ({
    ...theme.typography.body1,
    fontWeight: "bold",
    textAlign: "right",
    px: 1,
    whiteSpace: "nowrap",
    overflow: "clip",
    textOverflow: "ellipsis",
  })}>
    {children}
  </Paper>
);

const Item = React.memo(ItemComp);
const ItemHeader = React.memo(ItemHeaderComp);

export default function LocationsList() {
  const { state, controller } = useContext(GameContext);
  const { locationId: selectedLocationId } = useSelectionId();
  const nav = useNavigate();
  const hasSmallWidth = useMediaQuery("(max-width:600px)");

  const locations = state.getLocations();

  const handleUpdateName = (curr: string) => (val: string) => {
    controller.updateLocationName(curr, val);
  };

  const handleDragEnd = (result: DropResult) => {
    if (result.reason === 'DROP') {
      controller.reorderLocations(result.source, result.destination);
    }
  };

  const handleSelect = (locationId: string) => {
    if (locationId === selectedLocationId) {
      nav("/locations");
    } else {
      nav(`/locations/${locationId}`);
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

  const cellWidth = hasSmallWidth ? 6 : 3;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-location">
        {(provided, snapshot) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {locations.map((val, index) => (
              <Draggable key={val.name} index={index} draggableId={`draggable-location-${val.name.replaceAll(/\W/g, "-")}`}>
                {(provided, snapshot) => (
                  <Accordion 
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    expanded={selectedLocationId === val.id}
                    disableGutters={true}
                  >
                    <AccordionSummary
                      onClick={() => handleSelect(val.id)}
                      sx={theme => ({
                        backgroundColor: snapshot.isDragging ? theme.palette.action.dragging : (selectedLocationId === val.id ? theme.palette.action.selected : "inherit"),
                        justifyContent: "flex-start",
                        gap: 2,
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                          width: "100%"
                        },
                      })}
                    >
                      <Icon {...provided.dragHandleProps}><DragHandleIcon /></Icon>
                      <EditableText id="location-name" onUpdate={handleUpdateName(val.name)} variant="body2">{val.name}</EditableText>
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
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
