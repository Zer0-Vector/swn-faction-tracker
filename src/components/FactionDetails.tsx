import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import { styled, useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { GameContext } from "../contexts/GameContext/GameContext";
import { UiStateContext } from "../contexts/UiStateContext/UiStateContext";
import Typography from "@mui/material/Typography";
import EditableNameText from "./EditableNameText";

export default function FactionDetails() {
  const { state, controller } = useContext(GameContext);
  const { state: uiState } = useContext(UiStateContext);
  const theme = useTheme();

  const selection = uiState.selectedFaction || "";
  const faction = state.factions.get(selection);
  if (selection === "" || faction === undefined) {
    return (
      <Typography color="info.main">No Faction Selected</Typography>
    );
  }

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
    padding: theme.spacing(0.5),
  }));

  const ItemHeader = styled(Item)(({ theme }) => ({
    fontWeight: "bold",
    textAlign: "right",
  }));

  const homeworldText = faction.homeworld ? faction.homeworld : "Unknown";
  const tagText = faction.tag ? faction.tag : "Unknown";

  const updateHomeworld = (val: string) => {
    controller.updateHomeworld(selection, val);
  };

  const updateTag = (val: string) => {
    controller.updateTag(selection, val);
  };

  const gridContainerSpacing = 0.75;

  return (
    <Grid container
      spacing={gridContainerSpacing}
      sx={{ 
        backgroundColor: "background.paper2",
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(gridContainerSpacing),
        paddingRight: theme.spacing(gridContainerSpacing)
      }}
    >
      <Grid item xs={3}>
        <ItemHeader>Homeworld:</ItemHeader>
      </Grid>
      <Grid item xs={3}>
        <Item><EditableNameText onUpdate={updateHomeworld}>{homeworldText}</EditableNameText></Item>
      </Grid>
      <Grid item xs={3}>
        <ItemHeader>Tag:</ItemHeader>
      </Grid>
      <Grid item xs={3}>
        <Item><EditableNameText onUpdate={updateTag}>{tagText}</EditableNameText></Item>
      </Grid>
      <Grid item xs={3}>
        <ItemHeader>HP:</ItemHeader>
      </Grid>
      <Grid item xs={3}>
        <Item>{faction.stats.hp}/{faction.stats.maxHp}</Item>
      </Grid>
      <Grid item xs={3}>
        <ItemHeader>F/C/W:</ItemHeader>
      </Grid>
      <Grid item xs={3}>
        <Item>{faction.stats.force}/{faction.stats.cunning}/{faction.stats.wealth}</Item>
      </Grid>
    </Grid>
  );
}
