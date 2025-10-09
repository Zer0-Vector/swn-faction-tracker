import { useFactions } from "@/contexts/FactionContext";
import { useCallback, useMemo } from "react";
import { TAGS } from "../../../../data/Tags";
import { Maybe } from "../../../../types/Maybe";
import { ControlledDropDown } from "../../../molecules/ControlledDropDown";
import { Item, ItemHeader } from "./helpers";

type TagItemProps = {
  factionId: string,
  tag: Maybe<string>,
}

export default function TagItem({ tag, factionId }: Readonly<TagItemProps>) {
  const factions = useFactions();
  const tagOptions = useMemo(() => Object.keys(TAGS), []);

  const updateTag = useCallback((val: string) => {
    factions.update(factionId, "tag", val);
  }, [factionId, factions]);

  return (
    <>
      <ItemHeader data-testid="tag-label">Tag:</ItemHeader>
      <Item data-testid="tag-item">
        <ControlledDropDown onUpdate={updateTag} selectableOptions={tagOptions} data-testid="tag">{tag || "Unknown"}</ControlledDropDown>
      </Item>
    </>
  )
}
