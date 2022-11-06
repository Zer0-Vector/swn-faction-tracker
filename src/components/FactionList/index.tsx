import React, { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditableNameText from "../EditableNameText";
import HealthDisplay from "../HealthDisplay";
import { UiStateContext } from "../../contexts/UiStateContext";
import FactionStatSummary from "../FactionStatSummary";
import FactionInfo from "../../types/FactionInfo";

export default function FactionList(): JSX.Element {
  const { state, controller } = useContext(GameContext);
  const { state: uiState, controller: uiController} = useContext(UiStateContext);
  const theme = useTheme();
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    controller.reorderFactions(result.source.index, result.destination.index);
  };

  const getSelectFactionHandler = (name: string) => (
    () => {
      if (uiState.selectedFaction === name) {
        handleClearSelection();
      } else {
        console.log("Selecting faction: ", name);
        uiController.selectFaction(name);
      }
    }
  );

  const getEditNameHandler = (name: string) => (
    (val: string) => {
      controller.updateFactionName(name, val);
      if (uiState.selectedFaction === name) {
        uiController.selectFaction(val);
      }
    }
  );

  const getEditHpHandler = (name: string) => (
    (val: string) => {
      try {
        controller.updateHp(name, parseInt(val));
      } catch (e) {
        console.warn(`Could not parse hp value: '${val}'`);
      }
    }
  );

  const handleClearSelection = () => {
    console.log("Clearing faction (and asset) selection");
    uiController.deselectFaction();
  };

  const ItemColumn = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
  }));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="faction-droppable">
        {(provided, snapshot) => (
          <Stack
            spacing={theme.spacing(0.125)}
            sx={{
              padding: theme.spacing(2),
              backgroundColor: snapshot.isDraggingOver ? "background.paper2" : "background.paper",
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {state.factionOrder.map((name: string, index: number) => {
              const faction = state.factions.get(name) as FactionInfo;
              return (
                <Draggable
                  key={name}
                  draggableId={`draggable-${name.replaceAll(/\W/g, "-")}`}
                  index={index}
                >
                  {(itemProvided, itemSnapshot) => (
                    <Box
                      ref={itemProvided.innerRef}
                      {...itemProvided.draggableProps}
                    >
                      <Box
                        onClick={getSelectFactionHandler(name)}
                        sx={{
                          display: "flex",
                          width: "100%",
                          backgroundColor: name === uiState.selectedFaction ? "primary.main" : "inherit"
                        }}
                      >
                        <ItemColumn 
                          sx={{
                            maxWidth: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          {...itemProvided.dragHandleProps}
                        >
                          <DragHandleIcon />
                        </ItemColumn>
                        <ItemColumn sx={{ flexGrow: 1, display: "flex" }}>
                          <EditableNameText onUpdate={getEditNameHandler(name)} variant="body1">
                            {name}
                          </EditableNameText>
                        </ItemColumn>
                        <ItemColumn sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <HealthDisplay
                            current={faction.stats.hp}
                            max={faction.stats.maxHp}
                            onHpUpdate={getEditHpHandler(name)} 
                          />
                        </ItemColumn>
                        <ItemColumn sx={{
                          display: "flex",
                          alignItems: "center",
                        }}>
                          <FactionStatSummary
                            {...faction.stats}
                            factionName={name}
                            fontSize={theme.typography.body1.fontSize}
                          />
                        </ItemColumn>
                      </Box>
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
