import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import { GameContext } from "../../contexts/GameContext";
import { useSelectionId } from "../../hooks/useSelectionId";
import AssetId from "../../types/AssetId";
import PurchasedAsset, { PurchasedAssetUtils } from "../../types/PurchasedAsset";

import AssetDetails from "./AssetDetails";

export default function AssetList() {
  const { state } = useContext(GameContext);
  const { assetId, factionId } = useSelectionId();
  const nav = useNavigate();

  const assets: PurchasedAsset[] = state.getAssets(factionId);
  
  console.log("rendering asset list: ", assets);

  const handleSelectAsset = (pa: PurchasedAsset) => (_evt: React.SyntheticEvent, expanded: boolean) => {
    const assetRef = AssetId.toRefFormat(pa.id);
    if (expanded) {
      console.debug("Selecting asset", assetRef);
      nav(`/factions/${factionId}/assets/${assetRef}`);
    } else {
      console.debug("Deselecting asset", assetRef);
      nav(`/factions/${factionId}`);
    }
  };

  return (
    // TODO make drag and drop
    <>
      {
        assets.length > 0 ? (
          assets.map((pa, index) => {
            console.debug("pa, index: ", pa, index);
            const currentAssetId = PurchasedAssetUtils.getKey(factionId as string, pa);
            const selectedAssetId = `${factionId}.${assetId}`;
            console.debug(currentAssetId, selectedAssetId);
            const expanded = currentAssetId === selectedAssetId;
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
