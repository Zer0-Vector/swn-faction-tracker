import React, { useContext } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { GameContext } from "../../../contexts/GameContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import FactionInfo from "../../../types/FactionInfo";
import EditableNameText from "../../atoms/EditableNameText";
import FactionStatSummary from "../../molecules/FactionStatSummary";
import HealthDisplay from "../../molecules/HealthDisplay";

interface FactionListRowProps {
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
  isDragging: boolean;
  faction: FactionInfo;
}

const ItemColumn = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export default function FactionListRow({ dragHandleProps, isDragging, faction }: FactionListRowProps) {
  const { controller } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  
  const getEditNameHandler = (name: string) => (
    (val: string) => {
      console.debug(`Updating faction name '${name}' to '${val}'`);
      controller.updateFactionName(name, val);
      if (uiState.selectedFaction === name) {
        uiController.selectFaction(val);
      }
    }
  );

  const handleClearSelection = () => {
    console.log("Clearing faction (and asset) selection");
    uiController.deselectFaction();
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

  return (
    <Box
      onClick={getSelectFactionHandler(faction.name)}
      sx={{
        display: "flex",
        backgroundColor: isDragging ? "action.dragging" : (faction.name === uiState.selectedFaction ? "action.selected" : "inherit"),
        overflow: "clip",
      }}
    >
      <ItemColumn 
        sx={{
          maxWidth: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        {...dragHandleProps}
      >
        <DragHandleIcon />
      </ItemColumn>
      <ItemColumn sx={{ display: "flex", textOverflow: "ellipsis", overflow: "hidden" }}>
        <EditableNameText onUpdate={getEditNameHandler(faction.name)} variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {faction.name}
        </EditableNameText>
      </ItemColumn>
      {uiState.selectedFaction === faction.name ? null : (
        <>
          <ItemColumn sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <HealthDisplay factionName={faction.name} />
          </ItemColumn>
          <ItemColumn sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <FactionStatSummary
              {...faction.stats}
              factionName={faction.name}
            />
          </ItemColumn>
        </>
      )}
    </Box>
  );
}
