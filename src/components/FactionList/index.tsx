import React, { useContext } from "react";
import AssetList from "../AssetList";
import { GameContext } from "../../contexts/GameContext";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import FactionDetails from "../FactionDetails";
import { UiStateContext } from "../../contexts/UiStateContext";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditableNameText from "../EditableNameText";
import HealthDisplay from "../HealthDisplay";
import EditableStatText from "../EditableStatText";
import ActionsButton from "./ActionsButton";

export default function FactionList(): JSX.Element {
  const { state, controller } = useContext(GameContext);
  const { state: uiState, controller: uiControl } = useContext(UiStateContext);
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    controller.reorderFactions(result.source.index, result.destination.index);
  };

  const getSelectFactionHandler = (name: string) => (
    () => {
      if (uiState.selectedFaction === name) {
        uiControl.selectFaction(null);
      } else {
        console.log("Selecting faction: ", name);
        uiControl.selectFaction(name);
      }
    }
  );

  const getEditNameHandler = (name: string) => (
    (val: string) => controller.updateFactionName(name, val)
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
    uiControl.selectFaction(null);
  };

  const ItemColumn = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
  }));

  const getOnRemoveHandler = (name: string) => (
    () => {
      controller.removeFaction(name);
    }
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd} onBeforeDragStart={handleClearSelection}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <ClickAwayListener onClickAway={handleClearSelection}>
            <Stack
              direction="column"
              spacing={1}
              sx={{
                marginTop: "2rem",
                marginX: "2rem",
                padding: "1rem",
                backgroundColor: snapshot.isDraggingOver ? "#555" : "inherit",
              }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {state.factionOrder.map((name: string, index: number) => {
                const bgColor = (index % 2 === 0) ? "#444" : "#333";
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
                        <Box sx={{ display: "flex", width: "100%" }}>
                          <ItemColumn sx={{
                              maxWidth: "50px",
                              display: "flex",
                              // flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={getSelectFactionHandler(name)}
                            {...itemProvided.dragHandleProps}
                          >
                            <DragHandleIcon />
                          </ItemColumn>
                          <ItemColumn sx={{ flexGrow: 1, minWidth: "300px", width: "70%" }}>
                            <EditableNameText updateValue={getEditNameHandler(name)} variant="h2">
                              {name}
                            </EditableNameText>
                          </ItemColumn>
                          <ItemColumn sx={{
                            minWidth: "16rem",
                            width: "17rem",
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
                              minWidth: "150px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}>
                              <EditableStatText updateValue={val => controller.updateForce(name, +val)}>
                                {faction.stats.force.toString()}
                              </EditableStatText> / 
                              <EditableStatText updateValue={val => controller.updateCunning(name, +val)}>
                                {faction.stats.cunning.toString()}
                              </EditableStatText> /
                              <EditableStatText updateValue={val => controller.updateWealth(name, +val)}>
                                {faction.stats.wealth.toString()}
                              </EditableStatText>
                            </ItemColumn>
                            <ItemColumn>
                              <ActionsButton onRemove={getOnRemoveHandler(name)} />
                            </ItemColumn>
                          </Box>
                        {name === uiState.selectedFaction ? (
                          <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            backgroundColor: itemSnapshot.isDragging ? "#AAA" : (name === uiState.selectedFaction ? "darkgreen" : bgColor),
                            padding: "0.25rem",
                          }}>
                            <FactionDetails />
                            <AssetList />
                          </Box>
                        ): null}
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