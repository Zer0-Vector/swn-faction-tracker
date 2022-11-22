import React, { useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import { GameContext } from "../../../contexts/GameContext";
import { useSelectionId } from "../../../hooks/useSelectionId";
import AssetId from "../../../types/AssetId";
import PurchasedAsset from "../../../types/PurchasedAsset";
import AssetDetails from "../AssetDetails";

interface AssetSummaryProps {
  expanded: boolean;
  children: string;
}

const AssetSummaryComponent = ({ expanded, children }: AssetSummaryProps) => {
  const summarySx = useMemo(() => ({ backgroundColor: expanded ? "action.selected" : "inherit" }), [expanded]);
  return (
    <AccordionSummary sx={summarySx}>
      {children}
    </AccordionSummary>
  );
};

const AssetSummary = React.memo(AssetSummaryComponent, (prev, next) => (prev.expanded === next.expanded && prev.children === next.children));

export default function AssetList() {
  const { state } = useContext(GameContext);
  const { assetId, factionId } = useSelectionId();
  const nav = useNavigate();

  const assets: PurchasedAsset[] = state.getAssets(factionId);
  
  const handleSelectAsset = useCallback((pa: PurchasedAsset) => (_evt: React.SyntheticEvent, expanded: boolean) => {
    const assetRef = AssetId.toRefFormat(pa.id);
    if (expanded) {
      console.debug("Selecting asset", assetRef);
      nav(`/factions/${factionId}/assets/${assetRef}`);
    } else {
      console.debug("Deselecting asset", assetRef);
      nav(`/factions/${factionId}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factionId]);
  
  
  
  console.log("Rendering asset list: ", assets);
  return (
    // TODO make drag and drop
    <>
      {
        assets.length > 0 ? (
          assets.map((pa, index) => {
            const currentAssetId = PurchasedAsset.getKey(factionId as string, pa);
            const selectedAssetId = `${factionId}.${assetId}`;
            const expanded = currentAssetId === selectedAssetId;
            const name = pa.nickname ? `${pa.nickname} (${pa.id.displayName})` : pa.id.displayName;
            return (
              <Accordion key={index} expanded={expanded} onChange={handleSelectAsset(pa)}>
                <AssetSummary expanded={expanded}>{name}</AssetSummary>
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
