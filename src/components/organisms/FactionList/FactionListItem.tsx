import React, { useContext, useRef } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
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
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function FactionListItem({ dragHandleProps, isDragging, faction }: FactionListRowProps) {
  const { controller } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const boxRef = useRef<HTMLElement>(null);
  
  const getEditNameHandler = (factionId: string) => (
    (val: string) => {
      console.debug(`Updating faction name '${factionId}' to '${val}'`);
      controller.updateFactionName(factionId, val);
      if (uiState.selectedFaction === factionId) {
        uiController.selectFaction(val);
      }
    }
  );

  const handleClearSelection = () => {
    console.log("Clearing faction (and asset) selection");
    uiController.selectFaction(null);
  };

  const getSelectFactionHandler = (factionId: string) => (
    () => {
      if (uiState.selectedFaction === factionId) {
        handleClearSelection();
      } else {
        console.log("Selecting faction: ", factionId);
        uiController.selectFaction(factionId);
      }
    }
  );

  const isSelected = uiState.selectedFaction === faction.id;

  return (
    <Box
      onClick={getSelectFactionHandler(faction.id)}
      sx={{
        display: "grid",
        gridTemplateColumns: "50px 1fr 30%",
        backgroundColor: isDragging ? "action.dragging" : (faction.id === uiState.selectedFaction ? "action.selected" : "inherit"),
        overflow: "clip",
      }}
      ref={boxRef}
    >
      <ItemColumn {...dragHandleProps} >
        <DragHandleIcon />
      </ItemColumn>
      <ItemColumn sx={{
        textOverflow: "ellipsis",
        overflow: "hidden",
        gridColumnStart: "2",
        gridColumnEnd: "3",
        justifyContent: "flex-start",
      }}>
        <EditableNameText onUpdate={getEditNameHandler(faction.id)} variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {faction.name}
        </EditableNameText>
      </ItemColumn>
      <Slide in={!isSelected} container={boxRef.current} direction="up" appear={false}>
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "1fr 75px"
        }}>
          <ItemColumn>
            <HealthDisplay factionId={faction.id} />
          </ItemColumn>
          <ItemColumn>
            <FactionStatSummary {...faction.stats} factionId={faction.id} />
          </ItemColumn>
        </Box>
      </Slide>
    </Box>
  );
}
