import React, { useCallback, useMemo } from "react";
import { useFactions } from "@/contexts/FactionContext";
import { TAGS } from "@/data/Tags";
import { Maybe } from "@/types/Maybe";
import { ControlledDropDown } from "../ControlledDropDown";

export type TagTextProps = {
  factionId: string,
  tag: Maybe<string>,
};

export default function TagText({ factionId, tag }: Readonly<TagTextProps>) {

  const factions = useFactions();
  const tagOptions = useMemo(() => Object.keys(TAGS), []);

  const updateTag = useCallback((val: string) => {
    factions.update(factionId, "tag", val);
  }, [factionId, factions]);

  // FIXME: allow for multiple selections

  return (
    <ControlledDropDown onUpdate={updateTag} selectableOptions={tagOptions} data-testid="tag">
      {tag || "Unknown"}
    </ControlledDropDown>
  );
}
