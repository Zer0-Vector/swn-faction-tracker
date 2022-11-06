import React, { useContext, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FactionList from "./FactionList";
import { UiStateContext } from "../contexts/UiStateContext/UiStateContext";
import { GameContext } from "../contexts/GameContext/GameContext";
import FactionInfo from "../types/FactionInfo";
import FactionDetails from "./FactionDetails";
import AssetList from "./AssetList";
import Slide from "@mui/material/Slide";
import FactionListActionToolbar from "./FactionListActionToolbar";
import AssetListActionsToolbar from "./AssetListActionsToolbar";

export default function PrimaryPanel() {
  const { state } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const containerRef = useRef(null);

  const faction: FactionInfo | undefined = uiState.selectedFaction ? state.factions.get(uiState.selectedFaction) : undefined;

  const handleExitTransitionEnd = () => uiController.selectFaction(null);

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
          flexGrow: 1,
          marginTop: "2rem",
          padding: "1rem",
        }}>
          <FactionListActionToolbar />
          <FactionList />
        </Box>
        <Slide
          in={!!faction && uiState.hasFactionSelected}
          direction="left"
          unmountOnExit={true}
          container={containerRef.current}
          onExited={handleExitTransitionEnd}
        >
          <Box sx={{
            width: "60%",
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
              <Box>
                <Typography variant="h3" sx={{ textAlign: "left" }}>Assets</Typography>
                <AssetListActionsToolbar />
                <AssetList />
              </Box>
            </Box>
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}
