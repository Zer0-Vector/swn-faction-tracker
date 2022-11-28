import React, { useCallback, useContext, useMemo, useRef } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import { styled, SxProps } from "@mui/material/styles";

import { GameContext } from "../../../contexts/GameContext";
import { useSelectionId } from "../../../hooks/useSelectionId";
import FactionInfo from "../../../types/FactionInfo";
import EditableText from "../../atoms/EditableText";
import FactionStatSummary from "../../molecules/FactionStatSummary";
import HealthDisplay from "../../molecules/HealthDisplay";

interface FactionListRowProps {
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
  isDragging: boolean;
  faction: FactionInfo;
}

const ItemColumn = React.memo(styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})));

export default function FactionListItem({ dragHandleProps, isDragging, faction }: FactionListRowProps) {
  const { controller } = useContext(GameContext);
  const boxRef = useRef<HTMLElement>(null);
  const { factionId: navFactionId } = useSelectionId();
  const nav = useNavigate();

  const getEditNameHandler = useCallback((factionId: string) => (
    (val: string) => {
      console.debug(`Updating faction name '${factionId}' to '${val}'`);
      controller.updateFactionName(factionId, val);
    }
  ), [controller]);

  const getSelectFactionHandler = useCallback((factionId: string) => (
    () => {
      if (navFactionId === factionId) {
        console.debug("Deselecting faction: ", navFactionId);
        nav("/factions");
      } else {
        console.log("Selecting faction: ", factionId);
        nav(`/factions/${factionId}`);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [navFactionId]);


  const isSelected = navFactionId === faction.id;
  const notDraggingBgColor = isSelected ? "action.selected" : "inherit";
  const containerBoxSx = useMemo<SxProps>(() => ({
    display: "grid",
    gridTemplateColumns: "50px 1fr 30%",
    backgroundColor: isDragging ? "action.dragging" : notDraggingBgColor,
    overflow: "clip",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: isSelected ? "action.selected-hover" : "action.hover",
    },
  }), [isDragging, isSelected, notDraggingBgColor]);

  const factionNameColSx = useMemo<SxProps>(() => ({
    textOverflow: "ellipsis",
    overflow: "hidden",
    gridColumnStart: "2",
    gridColumnEnd: "3",
    justifyContent: "flex-start",
  }), []);

  const statsBoxSx = useMemo<SxProps>(() => ({
    display: "grid",
    gridTemplateColumns: "1fr 75px"
  }), []);

  const nameSx = useMemo(() => ({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }), []);
  
  return (
    <Box
      onClick={getSelectFactionHandler(faction.id)}
      sx={containerBoxSx}
      ref={boxRef}
      data-testid="faction-list-item"
    >
      <ItemColumn {...dragHandleProps} data-testid="faction-list-item-drag-handle-col">
        <DragHandleIcon />
      </ItemColumn>
      <ItemColumn sx={factionNameColSx} data-testid="faction-list-item-name-col">
        <EditableText id="faction-name" onUpdate={getEditNameHandler(faction.id)} variant="body2" sx={nameSx} data-testid="faction-list-item-name">
          {faction.name}
        </EditableText>
      </ItemColumn>
      <Slide in={!isSelected} container={boxRef.current} direction="up" appear={false}>
        <Box sx={statsBoxSx} data-testid="faction-list-item-stats">
          <ItemColumn data-testid="faction-list-item-health-col">
            <HealthDisplay factionId={faction.id} />
          </ItemColumn>
          <ItemColumn data-testid="faction-list-item-attributes-col">
            <FactionStatSummary {...faction.stats} factionId={faction.id}  />
          </ItemColumn>
        </Box>
      </Slide>
    </Box>
  );
}
