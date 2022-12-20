import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import { AssetContext } from "../../../contexts/AssetContext";
import { useSelectedFaction } from "../../../hooks/useSelectedFaction";
import { useSelectionSlug } from "../../../hooks/useSelectionSlug";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import { Maybe } from "../../../types/Maybe";
import PurchasedAsset from "../../../types/PurchasedAsset";
import AssetDetails from "../AssetDetails";

interface AssetSummaryProps extends RequiredChildrenProps<string> {
  expanded: boolean;
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

function useAssetList(factionId: Maybe<string>) {
  const { assets } = useContext(AssetContext);
  const [list, setList] = useState(assets.getAll().filter(a => a.factionId === factionId));
  useEffect(() => assets.subscribe(
    () => setList(assets.getAll().filter(a => a.factionId === factionId))
  ), [assets, factionId]);
  return {
    list,
  };
}

export default function AssetList() {
  const faction = useSelectedFaction();
  const { list: assets } = useAssetList(faction?.id);
  const { assetSlug, factionSlug } = useSelectionSlug();
  const nav = useNavigate();

  
  const handleSelectAsset = (pa: PurchasedAsset) => (_evt: React.SyntheticEvent, expanded: boolean) => {
    if (expanded) {
      console.debug("Selecting asset", pa.slug);
      nav(`/factions/${factionSlug}/assets/${pa.slug}`);
    } else {
      console.debug("Deselecting asset", pa.slug);
      nav(`/factions/${factionSlug}`);
    }
  };
  if (faction === undefined) {
    return <Typography color="error">No faction selected!</Typography>;
  }
  
  console.log("Rendering asset list: ", assets);
  return (
    // TODO make drag and drop
    <>
      {
        assets.length > 0 ? (
          assets.map((pa, index) => {
            const expanded = pa.slug === assetSlug;
            const name = pa.nickname ? `${pa.nickname} (${pa.name})` : pa.name;
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
