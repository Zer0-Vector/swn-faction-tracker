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
import { ValidationFn } from "../../../types/ValidationFn";
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
  const { state, controller } = useContext(GameContext);
  const boxRef = useRef<HTMLElement>(null);
  const { factionId: navFactionId } = useSelectionId();
  const nav = useNavigate();

  const isSelected = navFactionId === faction.id;
  const getEditNameHandler = useCallback((factionId: string) => (
    (val: string) => {
      const newId = controller.updateFactionName(factionId, val);
      if (isSelected && newId) {
        console.debug(`Updated faction name for '${factionId}' to '${val}'`);
        nav(`/factions/${newId}`);
      }
    }
  ), [controller, isSelected, nav]);

  const getSelectFactionHandler = (factionId: string) => (
    () => {
      if (navFactionId === factionId) {
        console.debug("Deselecting faction: ", navFactionId);
        nav("/factions");
      } else {
        console.log("Selecting faction: ", factionId);
        nav(`/factions/${factionId}`);
      }
    }
  );

  const checkForDuplicates = useCallback<ValidationFn>(val => {
    return !state.getFactions().filter(f => f.id !== faction.id).map(f => f.name.toLowerCase()).includes(val.toLowerCase());
  }, [state, faction.id]);


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
    gridTemplateColumns: "1fr 75px",
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
        <EditableText validate={checkForDuplicates} id="faction-name" onUpdate={getEditNameHandler(faction.id)} variant="body2" data-testid="faction-list-item-name">
          {faction.name}
        </EditableText>
      </ItemColumn>
      <Slide in={!isSelected} container={boxRef.current} direction="up" appear={false}>
        <Box sx={statsBoxSx} data-testid="faction-list-item-stats">
          <ItemColumn data-testid="faction-list-item-health-col">
            <HealthDisplay factionId={faction.id} hp={faction.stats.hp} maxHp={faction.stats.maxHp} />
          </ItemColumn>
          <ItemColumn data-testid="faction-list-item-attributes-col">
            <FactionStatSummary {...faction.stats} factionId={faction.id}  />
          </ItemColumn>
        </Box>
      </Slide>
    </Box>
  );
}