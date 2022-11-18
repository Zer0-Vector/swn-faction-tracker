import React, { useContext } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { useSelectionId } from "../../hooks/useSelectionId";
import PurchasedAsset, { PurchasedAssetUtils } from "../../types/PurchasedAsset";

import AssetDetails from "./AssetDetails";

export default function AssetList() {
  const { state } = useContext(GameContext);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);
  const { factionId } = useSelectionId();

  const assets: PurchasedAsset[] = state.getAssets(factionId);
  
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
            console.debug("pa, index: ", pa, index);
            const expanded = PurchasedAssetUtils.getKey(uiState.selectedFaction as string, pa) === uiState.selectedAssetKey;
            const name = pa.nickname ? `${pa.nickname} (${pa.id.displayName})` : pa.id.displayName;
            return (
              <Accordion key={index} expanded={expanded} onChange={handleSelectAsset(pa)}>
                <AccordionSummary sx={{ backgroundColor: expanded ? "action.selected" : "inherit" }}>
                  {name}
                </AccordionSummary>
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
