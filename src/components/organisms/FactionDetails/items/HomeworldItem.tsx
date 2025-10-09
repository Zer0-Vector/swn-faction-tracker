import React, { useMemo } from "react";
import { Item, ItemHeader } from "./helpers";
import { useLocations } from "../../../../contexts/LocationContext";
import { Maybe } from "../../../../types/Maybe";
import { ControlledDropDown } from "../../../molecules/ControlledDropDown"


type HomeworldItemProps = {
  readonly homeworldId: Maybe<string>,
  readonly onUpdate: (val: string) => void
}

export default function HomeworldItem({ homeworldId, onUpdate }: HomeworldItemProps) {
  const locations = useLocations();
  const homeworldOptions = locations.getAll().map(loc => loc.name);
  const resolveHomeworldName = (id: Maybe<string>) => (id && locations.get(id)?.name) || "Unknown";

  return (
    <>
      <ItemHeader data-testid="homeworld-label">Homeworld:</ItemHeader>
        <Item data-testid="homeworld-item">
          <ControlledDropDown onUpdate={onUpdate} selectableOptions={homeworldOptions} data-testid="homeworld">{resolveHomeworldName(homeworldId)}</ControlledDropDown>
        </Item>
    </>
  )
}
