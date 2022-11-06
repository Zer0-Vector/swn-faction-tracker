import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FactionList from "../FactionList";
import FactionActionToolbar from "../FactionActionToolbar";
import { UiStateContext } from "../../contexts/UiStateContext";
import { GameContext } from "../../contexts/GameContext";
import FactionInfo from "../../types/FactionInfo";
import FactionDetails from "../FactionDetails";
import AssetList from "../AssetList";

export default function PrimaryPanel() {
  const { state } = useContext(GameContext);
  const { state: uiState } = useContext(UiStateContext);

  const faction: FactionInfo | undefined = state.factions[uiState.selectedFaction || "-=NULL=-"];

  return (
    <Box sx={{
        display: "flex",
        minHeight: "calc(100vh - 4rem)",
        flexDirection: "column",
        alignItems: "stretch",
        padding: "2rem 0",
      }}
      data-testid="app-inner-box"
    >
      <Typography variant="h1" sx={{ textAlign: "center" }}>SWN Faction Tracker</Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%"
      }}>
        <Box sx={{ 
          flexGrow: 3,
          marginTop: "2rem",
          marginX: "2rem",
          padding: "1rem",
          backgroundColor: "background.paper",
        }}>
          <FactionActionToolbar />
          <FactionList />
        </Box>
        {
          faction ? (
            <Box sx={{
              flexGrow: 10,
              marginTop: "2rem",
              marginX: "2rem",
              padding: "1rem",
            }}>
              <Typography variant="h2">{faction.name}</Typography>
              <FactionDetails />
              <AssetList />
            </Box>
          ) : undefined
        }
      </Box>
    </Box>
  );
}
