import React, { useContext } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { GameContext } from "../contexts/GameContext";
import { UiStateContext } from "../contexts/UiStateContext";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

export default function LocationsList() {
  const { state } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const locations = state.getLocations();

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
  }));

  const ItemHeader = styled(Item)(({ theme }) => ({
    fontWeight: "bold",
  }));

  return (
    <Box>
      {
        locations.length === 0 ? <Typography variant="body1" color="warning.main">No Locations</Typography>
        : locations.map((val, index) => (
          <Accordion key={index}>
            <AccordionSummary>{val.name}</AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item xs={3}><ItemHeader>Tech Level</ItemHeader></Grid>
                <Grid item xs={3}><Item>{val.tl}</Item></Grid>
                <Grid item xs={3}><ItemHeader>Coordinates</ItemHeader></Grid>
                <Grid item xs={3}><Item>{val.x}, {val.y}</Item></Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      }
    </Box>
  );
}
