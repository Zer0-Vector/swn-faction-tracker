import React, { useContext } from "react";

import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";

import AssetList from "../components/organisms/AssetList";
import AssetListActionsToolbar from "../components/organisms/AssetListActionsToolbar";
import FactionDetails from "../components/organisms/FactionDetails";
import FactionList from "../components/organisms/FactionList";
import FactionListActionToolbar from "../components/organisms/FactionListActionToolbar";
import { GameContext } from "../contexts/GameContext";
import { UiStateContext } from "../contexts/UiStateContext";
import FactionInfo from "../types/FactionInfo";

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
