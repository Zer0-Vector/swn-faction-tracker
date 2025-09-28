import React, { useCallback, useMemo, useRef } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import { styled, SxProps } from "@mui/material/styles";

import { useFactions } from "../../../contexts/FactionContext";
import { useSelectionSlug } from "../../../hooks/useSelectionSlug";
import FactionInfo from "../../../types/FactionInfo";
import { ValidationFn } from "../../../types/ValidationFn";
import { ControlledText } from "../../molecules/ControlledText";
import FactionStatSummary from "../../molecules/FactionStatSummary";
import HealthDisplay from "../../molecules/HealthDisplay";

interface FactionListRowProps {
  readonly dragHandleProps: DraggableProvidedDragHandleProps | undefined;
  readonly isDragging: boolean;
  readonly faction: FactionInfo;
}

const ItemColumn = React.memo(styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})));

export default function FactionListItem({ dragHandleProps, isDragging, faction }: FactionListRowProps) {
  const factions = useFactions();
  const boxRef = useRef<HTMLElement>(null);
  const { factionSlug: navFactionSlug } = useSelectionSlug();
  const nav = useNavigate();

  const isSelected = navFactionSlug === faction.slug;
  const getEditNameHandler = (factionSlug: string) => (
    (val: string) => {
      const faction = factions.slugGet(factionSlug);
      if (faction !== undefined) {
        const result = factions.update(faction.id, "name", val);
        if (navFactionSlug === factionSlug) {
          nav(`/factions/${result.slug}`);
        }
      }
      console.debug(`Updated faction name for '${factionSlug}' to '${val}'`);
    }
  );

  const getSelectFactionHandler = (factionSlug: string) => (
    () => {
      if (navFactionSlug === factionSlug) {
        console.debug("Deselecting faction: ", navFactionSlug);
        nav("/factions");
      } else {
        console.log("Selecting faction: ", factionSlug);
        nav(`/factions/${factionSlug}`);
      }
    }
  );

  const checkForDuplicates = useCallback<ValidationFn>((val: string) => {
    return factions.checkName({ name: val });
  }, [factions]);


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
      onClick={getSelectFactionHandler(faction.slug)}
      sx={containerBoxSx}
      ref={boxRef}
      data-testid="faction-list-item"
    >
      <ItemColumn {...dragHandleProps} data-testid="faction-list-item-drag-handle-col">
        <DragHandleIcon />
      </ItemColumn>
      <ItemColumn sx={factionNameColSx} data-testid="faction-list-item-name-col">
        <ControlledText validate={checkForDuplicates} id="faction-name" onUpdate={getEditNameHandler(faction.slug)} variant="body2" data-testid="faction-list-item-name">
          {faction.name}
        </ControlledText>
      </ItemColumn>
      <Slide in={!isSelected} container={boxRef.current} direction="up" appear={false}>
        <Box sx={statsBoxSx} data-testid="faction-list-item-stats">
          <ItemColumn data-testid="faction-list-item-health-col">
            <HealthDisplay factionId={faction.id} hp={faction.hp} maxHp={faction.maxHp} />
          </ItemColumn>
          <ItemColumn data-testid="faction-list-item-attributes-col">
            <FactionStatSummary { ...faction } factionId={faction.id}  />
          </ItemColumn>
        </Box>
      </Slide>
    </Box>
  );
}
