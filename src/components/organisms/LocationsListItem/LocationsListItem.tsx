import React, { PropsWithChildren, useCallback, useContext, useMemo } from "react";
import { Draggable, DraggableProps } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

import DragHandleIcon from "@mui/icons-material/DragHandle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Paper from "@mui/material/Paper";
import { styled, SxProps, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { LocationContext } from "../../../contexts/LocationContext";
import LocationInfo from "../../../types/LocationInfo";
import { ControlledText } from "../../molecules/ControlledText";


type LocationsListItemProps = 
  & Pick<DraggableProps, "index" | "draggableId">
  & {
    isSelected: boolean,
    locationInfo: LocationInfo,
  };

const Column = React.memo(styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})));

const Item = React.memo(styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  px: theme.spacing(1),
})));

const ItemHeader = React.memo(styled(Item)(() => ({
  fontWeight: "bold",
  textAlign: "right",
  whiteSpace: "nowrap",
  overflow: "clip",
  textOverflow: "ellipsis",
})));

interface SummaryProps {
  isDragging: boolean;
  isSelected: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const SummaryComp = ({ isSelected, isDragging, children, onClick }: PropsWithChildren<SummaryProps>) => {
  const sx = useMemo<SxProps<Theme>>(() => {
    const notDraggingColor = isSelected ? "action.selected" : "inherit";
    return {
      backgroundColor: isDragging ? "action.dragging" : notDraggingColor,
      justifyContent: "flex-start",
      gap: 1,
      display: "grid",
      gridTemplateColumns: "30px 1fr",
      "& .MuiAccordionSummary-content": {
        padding: 0,
        margin: 0,
        alignItems: "center",
        width: "100%",
      },
      "&:hover": {
        cursor: "pointer",
        backgroundColor: isSelected ? "action.selected-hover" : "action.hover",
      },
    };
  }, [isDragging, isSelected]);

  return (
    <AccordionSummary onClick={onClick} sx={sx}>
      {children}
    </AccordionSummary>
  );
};

const Summary = React.memo(SummaryComp);

export function LocationsListItem({ index, draggableId, isSelected, locationInfo }: LocationsListItemProps) {
  const hasSmallWidth = useMediaQuery("(max-width:600px)");
  const iconSx = useMemo<SxProps<Theme>>(() => ({ display: "flex" }), []);
  const nav = useNavigate();
  const { locations } = useContext(LocationContext);

  const updateNameHandler = useCallback((val: string) => {
    const result = locations.update(locationInfo.id, "name", val);
    if (isSelected) {
      nav(`/locations/${result.slug}`);
    }
  }, [isSelected, locationInfo.id, locations, nav]);

  const selectionHandler = useCallback(() => {
    if (isSelected) {
      nav("/locations");
    } else {
      nav(`/locations/${locationInfo.slug}`);
    }
  }, [isSelected, locationInfo.slug, nav]);

  const cellWidth = hasSmallWidth ? 6 : 3;
  return (
    <Draggable index={index} draggableId={draggableId}>
      {(provided, snapshot) => (
        <Accordion
          {...provided.draggableProps}
          ref={provided.innerRef}
          expanded={isSelected}
          disableGutters={true}
        >
          <Summary onClick={selectionHandler} isDragging={snapshot.isDragging} isSelected={isSelected}>
            <Column>
              <Icon
                {...provided.dragHandleProps}
                component="div"
                sx={iconSx}
              >
                <DragHandleIcon />
              </Icon>
            </Column>
            <Column>
              <ControlledText id="location-name" onUpdate={updateNameHandler} variant="body2">{locationInfo.name}</ControlledText>
            </Column>
          </Summary>
          <AccordionDetails>
            <Grid container spacing={1}>
              <Grid item xs={cellWidth}><ItemHeader>Tech Level</ItemHeader></Grid>
              <Grid item xs={cellWidth}><Item>{locationInfo.tl}</Item></Grid>
              <Grid item xs={cellWidth}><ItemHeader>Coordinates</ItemHeader></Grid>
              <Grid item xs={cellWidth}><Item>{locationInfo.x}, {locationInfo.y}</Item></Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Draggable>
  );
}
