import React, { useContext, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FactionList from "../FactionList";
import FactionActionToolbar from "../FactionActionToolbar";
import { UiStateContext } from "../../contexts/UiStateContext";
import { GameContext } from "../../contexts/GameContext";
import FactionInfo from "../../types/FactionInfo";
import FactionDetails from "../FactionDetails";
import AssetList from "../AssetList";
import Slide from "@mui/material/Slide";

export default function PrimaryPanel() {
  const { state } = useContext(GameContext);
  const { state: uiState } = useContext(UiStateContext);

  const containerRef = useRef(null);

  const faction: FactionInfo | undefined = state.factions[uiState.selectedFaction || "-=NULL=-"];

  return (
    <Box sx={{
        display: "flex",
        minHeight: "calc(100vh - 4rem)",
        flexDirection: "column",
        alignItems: "stretch",
        padding: "2rem 0",
      }}
      ref={containerRef}
      data-testid="app-inner-box"
    >
      <Typography variant="h1" sx={{ textAlign: "center" }}>SWN Faction Tracker</Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: "0.25rem",
        overflow: "clip",
      }}>
        <Box
          sx={{ 
          flexGrow: 3,
          marginTop: "2rem",
          padding: "1rem",
        }}>
          <FactionActionToolbar />
          <FactionList />
        </Box>
        <Slide in={!!faction} direction="left" mountOnEnter={true} unmountOnExit={true} container={containerRef.current}>
          <Box sx={{
            flexGrow: 10,
            marginTop: "2rem",
            padding: "1rem",
          }}>
            <Typography variant="h2">{faction?.name}</Typography>
            <Box
              sx={{
                backgroundColor: "background.paper",
                padding: "2rem"
              }}
            >
              <FactionDetails />
              <AssetList />
            </Box>
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}
