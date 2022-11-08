import React, { useContext } from "react";

import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";

import AssetList from "../components/organisms/AssetList";
import AssetListActionsToolbar from "../components/organisms/AssetListActionsToolbar";
import FactionDetails from "../components/organisms/FactionDetails";
import FactionList from "../components/organisms/FactionList/FactionList";
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
      <Box sx={{ gridColumnStart: "1", gridColumnEnd: faction ? "2" : "3" }}>
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
          padding: 1,
        }}>
          <Typography variant="h2">{faction?.name}</Typography>
          <Box
            sx={{
              backgroundColor: "background.paper",
              padding: 3
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
