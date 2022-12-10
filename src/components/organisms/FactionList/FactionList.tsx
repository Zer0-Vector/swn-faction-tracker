import React, { useCallback, useContext } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { GameContext } from "../../../contexts/GameContext";
import { useSelection } from "../../../hooks/useSelection";
import FactionInfo from "../../../types/FactionInfo";
import AssetList from "../AssetList";
import AssetListActionsToolbar from "../AssetListActionsToolbar";
import FactionDetails from "../FactionDetails";
import FactionListItem from "../FactionListItem";

export default function FactionList(): JSX.Element {
  const { state, controller } = useContext(GameContext);
  const theme = useTheme();
  const { faction: selectedFaction } = useSelection();
  
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }
    controller.reorderFactions(result.source.index, result.destination.index);
  }, [controller]);

  const factions = state.getFactions();

  if (factions.length === 0) {
    return (
      <>
        <Typography variant="body1" color="warning.main">No Factions</Typography>
        <Typography variant="body2">Create factions using the buttons above.</Typography>
      </>
    );
  }

  console.debug("Rendering FactionList...");

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="faction-droppable">
        {(provided, snapshot) => (
          <Stack
            spacing={theme.spacing(0.125)}
            padding={theme.spacing(2)}
            bgcolor={snapshot.isDraggingOver ? "background.paper2" : "background.paper"}
            data-testid="faction-list-stack"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {factions.map((faction: FactionInfo, index: number) => {
              return (
                <Draggable
                  key={faction.id}
                  draggableId={`draggable-faction-${faction.id}`}
                  index={index}
                >
                  {(itemProvided, itemSnapshot) => (
                    <Box
                      ref={itemProvided.innerRef}
                      {...itemProvided.draggableProps}
                    >
                      <FactionListItem
                        faction={faction}
                        dragHandleProps={itemProvided.dragHandleProps}
                        isDragging={itemSnapshot.isDragging}
                      />
                      <Collapse
                        in={selectedFaction?.id === faction.id}
                        unmountOnExit={true}
                      >
                        <Box padding={1} bgcolor="background.paper">
                          <FactionDetails faction={faction} />
                          <Box marginTop={3}>
                            <Typography variant="h3" textAlign="left">Assets</Typography>
                            <AssetListActionsToolbar />
                            <AssetList />
                          </Box>
                        </Box>
                      </Collapse>
                    </Box>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  );
}
