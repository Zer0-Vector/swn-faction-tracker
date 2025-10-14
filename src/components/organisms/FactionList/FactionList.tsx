import React, { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { useFactions } from "../../../contexts/FactionContext";
import { useSelectedFaction } from "../../../hooks/useSelectedFaction";
import FactionInfo from "../../../utils/FactionInfo";
import AssetList from "../AssetList";
import AssetListActionsToolbar from "../AssetListActionsToolbar";
import FactionDetails from "../FactionDetails";
import FactionListItem from "../FactionListItem";

function useFactionsList() {
  const factions = useFactions();
  const [list, setList] = useState(factions.getAll());
  useEffect(
    () => factions.subscribe(() => setList(factions.getAll())),
    [factions]
  );
  return {
    factions: list,
    reorder: factions.reorder.bind(factions),
  };
}

export default function FactionList(): JSX.Element {
  const { factions, reorder } = useFactionsList();
  const theme = useTheme();
  const selectedFaction = useSelectedFaction();

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }
      reorder(result.source.index, result.destination.index);
    },
    [reorder]
  );

  if (factions.length === 0) {
    return (
      <>
        <Typography variant="body1" color="warning.main">
          No Factions
        </Typography>
        <Typography variant="body2">
          Create factions using the buttons above.
        </Typography>
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
            bgcolor={
              snapshot.isDraggingOver ? "background.paper2" : "background.paper"
            }
            data-testid="faction-list-stack"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {factions.map((faction: FactionInfo, index: number) => {
              return (
                <Draggable
                  key={faction.slug}
                  draggableId={`draggable-faction-${faction.slug}`}
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
                        in={selectedFaction?.slug === faction.slug}
                        unmountOnExit={true}
                      >
                        <Box padding={1} bgcolor="background.paper">
                          <FactionDetails faction={faction} />
                          <Box marginTop={3}>
                            <Typography variant="h3" textAlign="left">
                              Assets
                            </Typography>
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
