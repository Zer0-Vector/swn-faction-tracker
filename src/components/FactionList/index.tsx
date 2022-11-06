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
import ClickAwayListener from "@mui/material/ClickAwayListener";
import FactionStatSummary from "../FactionStatSummary";

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
    console.log("Clearing faction selection");
    uiController.selectFaction(null);
  };

  const ItemColumn = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
  }));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <ClickAwayListener onClickAway={handleClearSelection}>
            <Stack
              spacing={2}
              sx={{
                backgroundColor: snapshot.isDraggingOver ? "background.default" : "inherit",
              }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {state.factionOrder.map((name: string, index: number) => {
                const faction = state.factions[name];
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
                            backgroundColor: name === uiState.selectedFaction ? theme.palette.primary.main : "inherit"
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
                            <EditableNameText updateValue={getEditNameHandler(name)} variant="h2" sx={{ fontSize: "2rem"}}>
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
                              fontSize="2rem"
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
          </ClickAwayListener>
        )}
      </Droppable>
    </DragDropContext>
  );
}