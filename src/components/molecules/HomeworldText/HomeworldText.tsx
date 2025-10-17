import React, { useCallback } from "react";

import { useFactions } from "@/contexts/FactionContext";
import { useLocations } from "@/contexts/LocationContext";
import { Maybe } from "@/types/Maybe";

import { ControlledDropDown } from "../ControlledDropDown";

export interface HomeworldTextProps {
  factionId: string;
  homeworldId: Maybe<string>;
}

export default function HomeworldText({
  factionId,
  homeworldId,
}: Readonly<HomeworldTextProps>) {
  const locations = useLocations();
  const factions = useFactions();

  const homeworldOptions = locations.getAll().map((loc) => loc.name);
  const resolveHomeworldName = (id: Maybe<string>) =>
    (id && locations.get(id)?.name) || "Unknown";

  const updateHomeworld = useCallback(
    (val: string) => {
      console.log("Updating homeworld: ", val);
      const selectedId = locations.getAll().find((loc) => loc.name === val)?.id;
      if (selectedId === undefined) {
        console.error("Could not find location: ", val);
        return;
      }
      factions.update(factionId, "homeworldId", selectedId);
    },
    [factionId, factions, locations]
  );

  return (
    <ControlledDropDown
      onUpdate={updateHomeworld}
      selectableOptions={homeworldOptions}
      data-testid="homeworld"
    >
      {resolveHomeworldName(homeworldId)}
    </ControlledDropDown>
  );
}
