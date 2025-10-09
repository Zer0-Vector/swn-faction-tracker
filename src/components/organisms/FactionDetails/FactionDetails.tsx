import React, { useCallback, useMemo } from "react";

import Container from "@mui/material/Container";

import useMediaQuery from "@mui/material/useMediaQuery";

import { useFactions } from "../../../contexts/FactionContext";
import { useLocations } from "../../../contexts/LocationContext";
import FactionInfo from "../../../utils/FactionInfo";
import { AttributesItem, GoalItem, HomeworldItem, HpItem, TagItem } from "./items";


interface FactionDetailsProps {
  readonly faction: FactionInfo;
}


export default function FactionDetails({ faction }: FactionDetailsProps) {
  const factions = useFactions();
  const locations = useLocations();

  const isSmallViewport = useMediaQuery("(max-width:600px)");

  const updateHomeworld = useCallback((val: string) => {
    console.log("Updating homeworld: ", val);
    const selectedId = locations.getAll().find(loc => loc.name === val)?.id
    if (selectedId === undefined) {
      console.error("Could not find location: ", val);
      return;
    }
    factions.update(faction.id, "homeworldId", selectedId);
  }, [faction.id, factions, locations]);

  const updateTag = useCallback((val: string) => {
    factions.update(faction.id, "tag", val);
  }, [faction.id, factions]);

  const containerSx = useMemo(() => ({
    backgroundColor: "background.paper2",
    display: "grid",
    gridTemplateColumns: isSmallViewport ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
    gap: 0.25,
  }), [isSmallViewport]);



  console.log("Rendering FactionDetails...");

  return (
    <Container disableGutters={true} sx={containerSx} data-testid="faction-details">
      <HomeworldItem homeworldId={faction.homeworldId} onUpdate={updateHomeworld} />
      <TagItem tag={faction.tag} onUpdate={updateTag} />
      <HpItem id={faction.id} hp={faction.hp} maxHp={faction.maxHp} />
      <AttributesItem {...faction} />
      <GoalItem faction={faction} />
    </Container>
  );
}
