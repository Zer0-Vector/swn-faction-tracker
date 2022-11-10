import React, { useContext } from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { TAGS } from "../../data/Tags";
import EditableNameText from "../atoms/EditableNameText";
import FactionHpSummary from "../molecules/FactionHpSummary";
import FactionStatSummary from "../molecules/FactionStatSummary";

export default function FactionDetails() {
  const { state, controller } = useContext(GameContext);
  const { state: uiState } = useContext(UiStateContext);
  const theme = useTheme();

  const selection = uiState.selectedFaction || "";
  const faction = state.getFaction(selection);
  if (selection === "" || faction === undefined) {
    return (
      <Typography color="info.main">No Faction Selected</Typography>
    );
  }

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
    padding: theme.spacing(0.5),
    margin: theme.spacing(0.5),
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
      {/* ROW 1 */}
      <Grid item xs={3}>
        <ItemHeader>Homeworld:</ItemHeader>
      </Grid>
      <Grid item xs={3}>
        <Item><EditableNameText onUpdate={updateHomeworld} selectableOptions={state.getLocations().map(loc => loc.name)}>{homeworldText}</EditableNameText></Item>
      </Grid>
      <Grid item xs={3}>
        <ItemHeader>Tag:</ItemHeader>
      </Grid>
      <Grid item xs={3}>
        <Item><EditableNameText onUpdate={updateTag} selectableOptions={Object.keys(TAGS)}>{tagText}</EditableNameText></Item>
      </Grid>

      {/* ROW 2 */}
      <Grid item xs={3}>
        <ItemHeader>HP:</ItemHeader>
      </Grid>
      <Grid item xs={3}>
        <Item><FactionHpSummary factionName={faction.name} /></Item>
      </Grid>
      <Grid item xs={3}>
        <ItemHeader>F/C/W:</ItemHeader>
      </Grid>
      <Grid item xs={3}>
        <Item>
          <FactionStatSummary
            {...faction.stats}
            factionName={faction.name}
          />
        </Item>
      </Grid>

      {/* ROW 3 */}
      <Grid item xs={3}>
        <ItemHeader>Goal:</ItemHeader>
      </Grid>
      <Grid item xs={3}>
        <Item>{faction.goal?.type || "None"}</Item>
      </Grid>
      <Grid item xs={6}>
        <Item sx={{ height: "80%" }}></Item>
      </Grid>
    </Grid>
  );
}
