import React, { useContext } from "react";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import { GameContext } from "../contexts/GameContext/GameContext";
import { UiStateContext } from "../contexts/UiStateContext/UiStateContext";
import { PurchasedAsset } from "../types/PurchasedAsset";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AssetDetails from "./AssetDetails";

export default function AssetList() {
  const { state } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const assets: PurchasedAsset[] = state.getAssets(uiState.selectedFaction);
  
  console.log("rendering asset list: ", assets);

  const handleSelectAsset = (pa: PurchasedAsset) => (_evt: React.SyntheticEvent, expanded: boolean) => {
    if (expanded) {
      uiController.selectAsset(pa);
    } else {
      uiController.selectAsset(null);
    }
  };

  return (
    // TODO make drag and drop
    <>
      {
        assets.length > 0 ? (
          assets.map((pa, index) => {
            const expanded = PurchasedAsset.getKey(uiState.selectedFaction as string, pa) === uiState.selectedAssetKey;
            const name = pa.nickname ? `${pa.nickname} (${pa.name})` : pa.name;
            return (
              <Accordion key={index} expanded={expanded} onChange={handleSelectAsset(pa)}>
                <AccordionSummary sx={{ backgroundColor: expanded ? "primary.main" : "inherit" }}>{name}</AccordionSummary>
                <AccordionDetails><AssetDetails asset={pa} /></AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Typography color="warning.main" fontStyle="italic">No Assets</Typography>
        )
      }
    </>
  );
}
