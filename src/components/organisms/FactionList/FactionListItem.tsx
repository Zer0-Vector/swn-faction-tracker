import React, { useContext, useRef } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useLocation, useNavigate } from "react-router-dom";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";

import { GameContext } from "../../../contexts/GameContext";
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
  const boxRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const nav = useNavigate();

  // process location.pathname
  // FIXME should this useFactionSelection() instead?
  const pathParts = location.pathname.split("/");
  const navFactionId = pathParts.length > 2 ? pathParts[2] : null;

  const getEditNameHandler = (factionId: string) => (
    (val: string) => {
      console.debug(`Updating faction name '${factionId}' to '${val}'`);
      controller.updateFactionName(factionId, val);
    }
  );

  const getSelectFactionHandler = (factionId: string) => (
    () => {
      if (navFactionId === factionId) {
        console.debug("Deselecting faction: ", navFactionId);
        nav("..");
      } else {
        console.log("Selecting faction: ", factionId);
        nav(`/factions/${factionId}`);
      }
    }
  );


  const isSelected = navFactionId === faction.id;

  return (
    <Box
      onClick={getSelectFactionHandler(faction.id)}
      sx={{
        display: "grid",
        gridTemplateColumns: "50px 1fr 30%",
        backgroundColor: isDragging ? "action.dragging" : (faction.id === navFactionId ? "action.selected" : "inherit"),
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
