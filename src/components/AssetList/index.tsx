import React, { useContext } from "react";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import Box from "@mui/material/Box";
import { AccordionSummary } from "@mui/material";
import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import PurchasedAsset from "../../types/PurchasedAsset";

export default function AssetList() {
  const { state } = useContext(GameContext);
  const { state: uiState } = useContext(UiStateContext);

  const assets: PurchasedAsset[] | undefined = state.assets[uiState.selectedFaction || "-=NULL=-"];
  
  console.log("rendering asset list: ", assets);

  return (
    <>
      <Typography variant="h3" sx={{ textAlign: "left" }}>Assets</Typography>
      {/* <AssetActionToolbar /> */}
      <Box>
        {
          assets && assets.length > 0 ? (
            assets.map((pa, index) => (
              <Accordion key={index}>
                <AccordionSummary>{pa.info.name}</AccordionSummary>
              </Accordion>
            ))
          ) : (
            <i>No Assets</i>
          )
        }
      </Box>
    </>
  );
}
