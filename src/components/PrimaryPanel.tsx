import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FactionList from "./FactionList";
import { UiStateContext } from "../contexts/UiStateContext";
import { GameContext } from "../contexts/GameContext";
import FactionInfo from "../types/FactionInfo";
import FactionDetails from "./FactionDetails";
import AssetList from "./AssetList";
import Slide from "@mui/material/Slide";
import FactionListActionToolbar from "./FactionListActionToolbar";
import AssetListActionsToolbar from "./AssetListActionsToolbar";

export default function PrimaryPanel() {
  const { state } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const faction: FactionInfo | undefined = uiState.selectedFaction ? state.getFaction(uiState.selectedFaction) : undefined;

  const handleExitTransitionEnd = () => uiController.selectFaction(null);

  return (
    <>
      <Box
        sx={{ 
        flexGrow: 1,
        padding: "1rem",
      }}>
        <FactionListActionToolbar />
        <FactionList />
      </Box>
      <Slide
        in={!!faction && uiState.hasFactionSelected}
        direction="left"
        unmountOnExit={true}
        onExited={handleExitTransitionEnd}
      >
        <Box sx={{
          width: "60%",
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
    </>
  );
}
