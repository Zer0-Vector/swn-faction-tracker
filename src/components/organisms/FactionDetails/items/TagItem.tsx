import { useMemo } from "react";
import { TAGS } from "../../../../data/Tags";
import { Maybe } from "../../../../types/Maybe";
import { ControlledDropDown } from "../../../molecules/ControlledDropDown";
import { Item, ItemHeader } from "./helpers";

type TagItemProps = {
  readonly tag: Maybe<string>,
  readonly onUpdate: (val: string) => void,
}

export default function TagItem({ tag, onUpdate }: TagItemProps) {
  const tagOptions = useMemo(() => Object.keys(TAGS), []);

  return (
    <>
      <ItemHeader data-testid="tag-label">Tag:</ItemHeader>
      <Item data-testid="tag-item">
        <ControlledDropDown onUpdate={onUpdate} selectableOptions={tagOptions} data-testid="tag">{tag || "Unknown"}</ControlledDropDown>
      </Item>
    </>
  )
}
